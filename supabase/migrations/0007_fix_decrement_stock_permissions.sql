-- 0007_fix_decrement_stock_permissions.sql
--
-- 0006 tried to restrict decrement_variant_stock to service_role via
-- `revoke all ... from public`. That does not work on Supabase: this project
-- grants EXECUTE on new functions in the public schema to anon and
-- authenticated by default (ALTER DEFAULT PRIVILEGES set at provisioning),
-- and revoking from the PUBLIC pseudo-role does not touch a privilege
-- granted directly to a named role. Verified live — the anon key could call
-- the function and actually decrement stock before this fix.
--
-- Anyone holding the anon key (i.e. anyone with the site open) could have
-- called this directly and drained inventory with no purchase behind it.

begin;

revoke execute on function public.decrement_variant_stock(uuid, integer) from anon, authenticated, public;
grant execute on function public.decrement_variant_stock(uuid, integer) to service_role;

commit;

-- Verify after running (should return an empty set — no grants to anon/authenticated):
--   select grantee, privilege_type from information_schema.routine_privileges
--   where routine_name = 'decrement_variant_stock' and grantee in ('anon','authenticated');
