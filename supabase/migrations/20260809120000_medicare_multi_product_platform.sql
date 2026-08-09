-- Register the Medicare Coverage Decision System in the existing generic
-- premium product platform. Runtime checkout, entitlement, and workspace
-- capabilities remain controlled by server-side flags and configuration.

insert into public.products (product_key, name, status, access_type)
values (
  'medicare-coverage-decision-system',
  'Medicare Coverage Decision System',
  'private_build',
  'one_time'
)
on conflict (product_key) do nothing;
