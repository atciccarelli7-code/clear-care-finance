begin;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'workspaces_id_user_product_unique'
      and conrelid = 'public.workspaces'::regclass
  ) then
    alter table public.workspaces
      add constraint workspaces_id_user_product_unique
      unique (id, user_id, product_key);
  end if;
end;
$$;

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'benefits-document-staging',
  'benefits-document-staging',
  false,
  10485760,
  array['application/pdf', 'text/plain']::text[]
)
on conflict (id) do update
set public = false,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

create table if not exists public.benefit_document_uploads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  workspace_id uuid not null,
  product_key text not null references public.products(product_key) on delete restrict,
  document_kind text not null check (document_kind in (
    'benefits_guide',
    'medical_plan_summary',
    'retirement_summary',
    'leave_and_protection_summary',
    'pharmacy_or_network_reference',
    'alternate_household_plan'
  )),
  status text not null check (status in (
    'authorized',
    'uploaded',
    'quarantined',
    'ready_for_extraction',
    'extracted',
    'rejected_sensitive_data',
    'extraction_unavailable',
    'deleted',
    'expired'
  )),
  intake_mode text not null check (intake_mode in ('synthetic_only', 'redacted_benefits_only')),
  storage_bucket text not null default 'benefits-document-staging'
    check (storage_bucket = 'benefits-document-staging'),
  storage_path text not null unique check (char_length(storage_path) between 20 and 500),
  mime_type text not null check (mime_type in ('application/pdf', 'text/plain')),
  size_bytes bigint not null check (size_bytes between 1 and 10485760),
  sha256 text check (sha256 is null or sha256 ~ '^[a-f0-9]{64}$'),
  scan_status text not null default 'not_started' check (scan_status in (
    'not_started',
    'filename_passed',
    'content_passed',
    'blocked',
    'manual_review_required'
  )),
  extraction_status text not null default 'not_requested' check (extraction_status in (
    'not_requested',
    'queued',
    'completed',
    'provider_unavailable',
    'blocked'
  )),
  finding_codes text[] not null default '{}'::text[],
  extracted_facts jsonb not null default '[]'::jsonb check (jsonb_typeof(extracted_facts) = 'array'),
  attested_no_personal_information boolean not null check (attested_no_personal_information),
  attested_not_election_record boolean not null check (attested_not_election_record),
  attested_authorized_to_use boolean not null check (attested_authorized_to_use),
  attested_synthetic_public_or_redacted boolean not null check (attested_synthetic_public_or_redacted),
  expires_at timestamptz not null,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint benefit_document_uploads_workspace_owner_fk
    foreign key (workspace_id, user_id, product_key)
    references public.workspaces (id, user_id, product_key)
    on delete cascade,
  constraint benefit_document_uploads_expiry_after_creation
    check (expires_at > created_at)
);

comment on table public.benefit_document_uploads is
  'Prelaunch private quarantine metadata for synthetic, public, or deliberately redacted benefits documents. Never stores original filenames, raw extracted text, official elections, completed enrollment confirmations, claims, medical records, credentials, payment data, or individualized records.';
comment on column public.benefit_document_uploads.storage_path is
  'Server-generated opaque path only. Original client filenames must never be persisted.';
comment on column public.benefit_document_uploads.extracted_facts is
  'Bounded structured benefit-fact candidates only. Never raw source text or excerpts.';

create index if not exists benefit_document_uploads_user_workspace_updated
  on public.benefit_document_uploads (user_id, workspace_id, updated_at desc);
create index if not exists benefit_document_uploads_expiration
  on public.benefit_document_uploads (expires_at)
  where deleted_at is null;
create index if not exists benefit_document_uploads_status
  on public.benefit_document_uploads (status, extraction_status)
  where deleted_at is null;

drop trigger if exists benefit_document_uploads_set_updated_at on public.benefit_document_uploads;
create trigger benefit_document_uploads_set_updated_at
before update on public.benefit_document_uploads
for each row execute function public.set_updated_at();

alter table public.benefit_document_uploads enable row level security;
alter table public.benefit_document_uploads force row level security;

revoke all on public.benefit_document_uploads from public, anon, authenticated;

-- Intentionally create no policies on public.benefit_document_uploads or storage.objects.
-- Browser uploads require a short-lived, one-path token issued by the authenticated server API.
-- Listing, reading, extraction, and deletion remain service-role operations scoped again by user,
-- product, workspace ownership, and entitlement in application code.

commit;
