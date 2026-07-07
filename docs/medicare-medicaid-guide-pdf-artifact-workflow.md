# Medicare and Medicaid Guide PDF Artifact Workflow

Community Acquired Finance  
Internal PDF artifact workflow pass  
Last updated: 2026-07-06

## Purpose

This workflow generates a draft Medicare/Medicaid guide PDF as a GitHub Actions artifact for internal review.

It does **not** publish the guide publicly.

## Workflow file

`/.github/workflows/guide-pdf-preflight.yml`

Workflow name:

`Guide PDF Preflight Artifact`

## How to run the workflow

1. Go to the GitHub repository.
2. Select the **Actions** tab.
3. Select **Guide PDF Preflight Artifact**.
4. Click **Run workflow**.
5. Choose the branch to run from.
6. Start the workflow.

The workflow runs manually through `workflow_dispatch`. It does not run automatically on every push or pull request.

## What the workflow does

The workflow:

1. Checks out the repository.
2. Sets up Node 20.
3. Installs dependencies with `npm ci`.
4. Sets up Chrome.
5. Runs:

```bash
npm run guide:pdf:draft
```

6. Confirms the generated draft HTML and PDF exist.
7. Fails if any PDF is found under:

```text
/public/drafts
/public/guides
```

8. Uploads the draft HTML and PDF as a GitHub Actions artifact.

## Where to download the artifact

After the workflow completes:

1. Open the completed workflow run.
2. Scroll to **Artifacts**.
3. Download:

```text
medicare-medicaid-guide-preflight-draft
```

The artifact should contain:

```text
docs/generated/medicare-medicaid-guide/hospital-family-guide-medicare-medicaid-preflight.html
docs/generated/medicare-medicaid-guide/hospital-family-guide-medicare-medicaid-preflight.pdf
```

## Why this is safer than `/public/drafts`

Files under `/public` are served by Vercel.

A file at a path like:

```text
/public/drafts/hospital-family-guide-medicare-medicaid-preflight.pdf
```

could become publicly reachable even if it is not linked on the site and not added to the sitemap.

This workflow avoids that risk by:

- generating files under `docs/generated`,
- keeping `docs/generated` ignored by Git,
- uploading generated files as temporary GitHub Actions artifacts,
- not committing generated files,
- not placing drafts under `/public`.

## What to inspect before public release

Before any public PDF release, inspect the artifact for:

- cover title fit,
- clipped text,
- overlapping boxes,
- long source-note readability,
- raw URL wrapping,
- footer overlap,
- page breaks in short chapters,
- page breaks in long chapters,
- callout and example block splits,
- worksheet spacing,
- source/endnote readability,
- mobile PDF viewing,
- black-and-white printing.

Print at least:

- cover,
- one short chapter,
- one long chapter,
- one worksheet,
- source/endnotes page.

Open the PDF on:

- desktop browser,
- iPhone,
- Android if available.

## What this workflow does not do

This workflow does not:

- update the public guide landing page CTA,
- update `/public/sitemap.xml`,
- generate final QR codes,
- publish a downloadable guide,
- add a final PDF under `/public/guides`,
- add ads,
- add affiliate links,
- add insurer rankings,
- add lead forms,
- add plan recommendations.

## Public release gate

Only after the artifact passes manual QA should a separate final release PR be considered.

That later PR may:

- place a final approved PDF under `/public/guides`,
- update the guide landing page CTA,
- update the sitemap if appropriate,
- add final tested QR codes,
- update the public-release report.

Do not combine artifact generation and public release in the same PR.
