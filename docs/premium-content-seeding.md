# Premium content extraction and seeding

The Community Acquired Finance repository is public. Substantive paid-product copy must never be committed to Git, placed in a public static asset, embedded in a client bundle, or exposed through an unauthenticated API.

## Source of truth

- Canonical private source: `CAF_Healthcare_Compensation_Benefits_Decision_Book_v3.0.docx`
- Source version: `3.0`
- Source review date: `2026-07-23`
- Web payload version: `3.0-web.1`
- Redis key: `caf:premium:content:healthcare_compensation_benefits_decision_book:3.0-web.1`

The DOCX remains in private Google Drive project storage. The generated JSON belongs under `private-product-content/`, which is gitignored.

## Build the private payload

Install the local extraction dependency outside the production application:

```bash
python -m pip install python-docx
```

Download the canonical DOCX from private Drive, then run:

```bash
mkdir -p private-product-content
python scripts/build-premium-content-from-docx.py \
  private-product-content/CAF_Healthcare_Compensation_Benefits_Decision_Book_v3.0.docx \
  private-product-content/healthcare-benefits-v3.json
```

The extractor:

- requires exactly fourteen ordered modules;
- preserves module purpose, orientation, comparison fields, actions, questions, completion standard, and source relationships from the canonical source;
- emits the product and source versions expected by the server validator;
- does not alter the source DOCX;
- does not upload or commit the generated payload.

For the canonical July 23, 2026 source used during implementation, the generated JSON was validated as 14 modules and approximately 31 KB. Record a new checksum whenever the canonical source or extractor changes:

```bash
shasum -a 256 private-product-content/healthcare-benefits-v3.json
```

Implementation-validation checksum: `661b13db2aab26490dff32db2a91e146dff60a63a59ff39a8c7c460295c00ad8`.

The checksum is an integrity record, not a substitute for source review. It will change after any substantive source or extractor update.

## Seed private Redis content

Set production-scoped or preview-scoped Redis credentials without exposing them through `VITE_` variables:

```bash
export UPSTASH_REDIS_REST_URL='...'
export UPSTASH_REDIS_REST_TOKEN='...'
```

Then run:

```bash
node scripts/seed-premium-content.mjs \
  private-product-content/healthcare-benefits-v3.json
```

The seeding utility validates:

- product ID;
- web version;
- source version;
- fourteen ordered module IDs;
- required module strings and arrays;
- source, update-history, and limitation structures;
- successful Redis `SET` response.

## Verify fail-closed behavior

Before seeding, an authenticated entitled request to `/api/premium-workspace` must return HTTP 503 with `content_not_configured` and no product content.

After seeding, the same entitled request should return the validated product payload and minimal account progress. Signed-out users must receive 401; signed-in users without active entitlement must receive 403. Neither response may include module content.

## Update procedure

For every substantive update:

1. Update and review the private canonical DOCX.
2. Increment the source edition and/or web payload version as appropriate.
3. Update the public manifest and validator.
4. Regenerate the private JSON.
5. Review the generated diff outside the public repository.
6. Record the checksum, review date, source links, and material changes.
7. Seed preview Redis first.
8. Validate all modules, print outputs, authorization, and protected network responses.
9. Seed production Redis only after approval.
10. Notify customers whose included update period is active when the change meets the notification criteria.

## Repository-history incident rule

If substantive paid copy is accidentally committed to a public branch, do not merge that branch. Remove the content from the active tree, create a clean branch from the latest main with only the sanitized final tree, close the exposed pull request, delete the exposed branch where possible, and follow GitHub's sensitive-data removal process when the content remains reachable in public commit history.
