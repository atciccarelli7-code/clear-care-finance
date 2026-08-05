begin;

create index if not exists benefit_document_uploads_product_key_idx
  on public.benefit_document_uploads (product_key);

create index if not exists benefit_document_uploads_workspace_owner_idx
  on public.benefit_document_uploads (workspace_id, user_id, product_key);

commit;
