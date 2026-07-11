# Broad-Audience Homepage and Information Architecture Review

## Scope

This review examines whether Community Acquired Finance communicates broad usefulness for retirement, investing, workplace benefits, credit, debt, and financial independence while preserving its differentiated expertise in healthcare costs, insurance, Medicare, and Medicaid.

## Production findings

1. The homepage hero currently names healthcare workers, patients, and families as the audience. That framing is credible for healthcare content but can make general financial material appear restricted.
2. The primary navigation mixes formats (`Tools`, `Articles`), subjects (`Insurance`), audiences (`Healthcare Workers`), and outcomes (`Build Wealth`).
3. The four homepage starting paths include healthcare-worker identity but no equivalent retirement or financial-independence path.
4. The featured article mix is almost entirely insurance and medical-cost content even though broader personal-finance articles are now available.
5. Footer copy and navigation repeat the same audience-first positioning.
6. Existing strengths should remain intact: source-backed content, trust disclosures, mobile bottom navigation, route-level code splitting, prerendered HTML, privacy-safe analytics, ad-free guided tools, and consistent card components.

## Implemented information architecture

Primary navigation:

1. Start Here
2. Tools
3. Money & Retirement
4. Benefits & Insurance
5. Medicare & Medicaid
6. Articles

Secondary navigation retains:

- Healthcare Workers
- Patients & Caregivers
- Quick Guides
- Open Enrollment
- Student Loans
- Glossary
- About

This approach keeps audience-specific material available without using audience identity as the main organizing system.

## Implemented homepage direction

Hero:

> Understand your money—from workplace benefits to healthcare costs.

Supporting copy:

> Use practical guides and calculators for retirement, investing, workplace benefits, insurance, medical bills, Medicare, and Medicaid—built with an RN’s healthcare perspective.

Starting paths:

- Retirement or financial independence
- Medical bill review
- Medicare or Medicaid
- Workplace benefits or insurance

The healthcare-worker hub remains linked below the universal starting paths.

## Content-cluster plan: childcare and workplace benefits

### Article 1: How Much Does Childcare Really Cost?

Purpose: help households translate weekly tuition and related fees into a realistic annual cost, then check employer assistance and tax-advantaged options.

### Article 2: Dependent Care FSA Explained

Purpose: explain eligibility, work-related care requirements, qualifying expenses, reimbursement timing, plan rules, the 2026 statutory limit, and use-it-or-lose-it risk.

### Article 3: 2026 Employer Childcare Tax Credit Changes

Purpose: explain that the credit percentage applies to qualifying employer expenditures and does not automatically pay that percentage of an employee’s childcare bill.

### Current legal notes requiring final primary-source verification before publication

- The Dependent Care FSA statutory limit increases to $7,500 for 2026, or $3,750 for married filing separately.
- The employer-provided childcare credit rate increases from 25% to 40%, or 50% for an eligible small business.
- Annual credit ceilings and qualifying-expense rules also change.

Final articles must be checked against the enacted statute, current IRS instructions, and any later Treasury or IRS implementation guidance.

## Tool roadmap

1. General workplace-benefits checklist and document locator
2. Dependent Care FSA tax-savings estimator
3. Childcare-cost planning calculator
4. HSA versus FSA decision guide
5. Retirement contribution priority tool
6. Additional medical-cost and insurance decision pathways

## Validation requirements

Before merge:

- run lint and type checks
- run unit and content checks
- run the production build and bundle budget
- confirm all canonical routes prerender
- inspect desktop and 320px mobile layouts
- confirm the branch preview contains broad homepage copy in raw HTML
- confirm no new runtime errors
- confirm the navigation remains keyboard accessible

## Known follow-up

The central SEO registry contains additional audience-specific titles and descriptions for the homepage, Build Wealth, Open Enrollment, Tools, Articles, Topics, Newsletter, and WebSite structured data. Those entries should be updated in the same release or an immediately following SEO-only commit so prerendered metadata fully matches the visible homepage positioning.
