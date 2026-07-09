-- 0008_restrict_order_insert_status.sql
--
-- orders_insert_own_or_guest (0003) checks auth.uid() = user_id or user_id
-- is null, but never constrains status/total/subtotal. Any anon or
-- authenticated client could POST directly to PostgREST /orders with
-- status:'paid' and an arbitrary total, bypassing Stripe entirely. This
-- doesn't move real money (nothing reads a client-fabricated order as proof
-- of payment for fulfillment), but it poisons fetchAdminStats() (queries.ts),
-- which sums totals across orders with status in ('paid','fulfilled') —
-- fabricated orders show up as real revenue in the admin dashboard.
--
-- The legitimate insert path (checkout/route.ts) always creates orders with
-- status: 'pending' using the session client. The only path that sets
-- status to 'paid'/'fulfilled'/'cancelled' is the webhook's UPDATE, which
-- runs via the service-role client and therefore bypasses RLS entirely.
-- Restricting INSERT to pending-only does not touch that path.

begin;

drop policy if exists "orders_insert_own_or_guest" on public.orders;

create policy "orders_insert_own_or_guest" on public.orders
  for insert with check (
    (auth.uid() = user_id or user_id is null)
    and status = 'pending'
  );

commit;
