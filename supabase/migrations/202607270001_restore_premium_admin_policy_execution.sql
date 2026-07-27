begin;

-- The authenticated SELECT policies for profiles, entitlements, and workspaces
-- call this private SECURITY DEFINER helper. PostgreSQL still requires the
-- invoking role to have schema USAGE and function EXECUTE privileges when a
-- policy evaluates the function. Keep the schema outside the exposed Data API,
-- deny anonymous callers, and grant only the minimum privileges required for
-- authenticated policy evaluation.
revoke all on schema private from public, anon, authenticated;
grant usage on schema private to authenticated;

revoke execute on function private.is_premium_admin() from public, anon, authenticated;
grant execute on function private.is_premium_admin() to authenticated;

commit;
