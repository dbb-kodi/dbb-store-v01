-- 0006_atomic_stock_decrement.sql
--
-- stock_qty was never decremented anywhere in the codebase. Every "sold out"
-- state was fiction after the first real sale — two buyers could both pay for
-- the last unit of a variant, since nothing ever recorded that it left the
-- shelf. This is the fix: an atomic, race-safe decrement called once per
-- order_item when a payment settles (src/app/api/stripe/webhook/route.ts).
--
-- Atomicity: the WHERE clause (stock_qty >= qty) is evaluated by Postgres in
-- the same statement as the UPDATE, so two concurrent calls against the same
-- row can't both read a stale stock_qty and both succeed — one wins, the
-- other's WHERE clause fails to match and it returns false. No transaction
-- or explicit lock needed; a single UPDATE is already atomic per-row.
--
-- Deliberately does NOT throw when stock is insufficient. By the time this
-- runs, the customer has already paid — refusing the update doesn't undo the
-- charge, it just leaves stock_qty wrong. Returning false lets the caller log
-- an oversell for manual reconciliation instead of throwing inside a webhook
-- handler whose failure Stripe would interpret as "retry the whole event".

begin;

create or replace function public.decrement_variant_stock(p_variant_id uuid, p_qty integer)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_rows integer;
begin
  update public.variants
  set stock_qty = stock_qty - p_qty
  where id = p_variant_id and stock_qty >= p_qty;

  get diagnostics v_rows = row_count;
  return v_rows > 0;
end;
$$;

-- security definer runs as the function owner (bypassing the caller's RLS),
-- which is required here since this is invoked with the anon/authenticated
-- role indirectly via the service-role webhook client — restrict who can
-- call it at all, same posture as the rest of the write surface.
revoke all on function public.decrement_variant_stock(uuid, integer) from public;
grant execute on function public.decrement_variant_stock(uuid, integer) to service_role;

commit;
