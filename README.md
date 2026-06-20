# Clear Care Finance

Clear Care Finance is the repository for Community Acquired Finance, a plain-English financial education site for healthcare workers, patients, families, and caregivers.

The site explains workplace benefits, insurance, retirement accounts, Medicare, Medicaid, hospital bills, and related healthcare costs without sales funnels or individualized advice. It preserves a content-driven Lovable interface built around reusable topic, article, glossary, source, and calculator components.

## What is included

- Audience guides for healthcare workers and patients or caregivers
- Eight reusable topic hubs
- Source-backed articles and a searchable glossary
- Five educational calculators
- Medicare and Medicaid comparisons, definitions, warnings, and related resources
- Responsive navigation and shared layout components

## Technology

- Vite
- React 18 and TypeScript
- React Router
- Tailwind CSS
- shadcn/ui and Radix UI
- TanStack Query
- Vitest and Testing Library

## Local development

Install dependencies:

    npm install

Start the development server:

    npm run dev

Create a production build:

    npm run build

Run tests:

    npm test

Run linting:

    npm run lint

The Vite development server uses port 8080 by default.

## Project structure

- `src/pages` contains routed page components.
- `src/components/layout` contains the shared header, footer, and route layout.
- `src/components/shared` contains reusable content and presentation components.
- `src/components/calculators` contains the interactive educational tools.
- `src/data` contains topics, articles, glossary entries, and sources.
- `src/lib/article-status.ts` prevents placeholder article drafts from appearing in public lists.
- `vercel.json` sends application routes to `index.html` so React Router can handle direct visits.

## Content workflow

Topic and article pages are rendered from structured records in `src/data`. Articles whose body still contains the editorial placeholder `Paste this article from Notion.` are treated as drafts: they are omitted from public article lists and display a clear coming-soon state when opened directly.

Completed article copy should remain source-backed and should not be replaced with generated filler solely to remove a draft state.

## Deployment

The project is configured for Vercel. Git-connected preview deployments may be used for review, but production deployment should happen only after the production build, tests, and direct nested-route behavior have been verified.

## Important disclaimer

Community Acquired Finance provides educational information only. It is not financial, tax, legal, insurance, or medical advice. Details should be verified with official sources, plan documents, benefits departments, or qualified professionals.