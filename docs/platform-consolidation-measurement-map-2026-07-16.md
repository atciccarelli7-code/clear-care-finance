# Platform Consolidation Measurement Map

Date: July 16, 2026  
Scope: homepage hierarchy, Benefits Command Center, healthcare-cost journey, Medicare/Medicaid journey, and organization buyer journey.

## Privacy contract

All events are consent-gated through the existing site analytics boundary. Parameters must match the fixed lowercase identifier contract in `src/lib/growthAnalytics.ts`. The sanitizer rejects unknown event names, unknown property keys, non-string values, URLs, spaces, punctuation, long strings, and values that do not match the fixed-ID pattern.

Never transmit user-entered amounts, answers, medical or insurance details, plan or employer names, diagnoses, medications, identifiers, free text, documents, or local-storage contents.

## Homepage and Concierge

| Event | Trigger | Fixed parameters | Purpose | Decision supported |
|---|---|---|---|---|
| `home_primary_cta_clicked` | Hero Concierge CTA | `entry_surface`, `action_id` | Measure orientation demand | Keep or revise the primary hero action |
| `home_secondary_cta_clicked` | Hero tools-library CTA | `entry_surface`, `action_id` | Measure direct catalog demand | Keep the secondary library path |
| `concierge_started` | First broad category choice | `entry_surface`, `problem_category` | Measure routing activation | Improve the first question if starts are weak |
| `concierge_category_selected` | Broad fixed category choice | `entry_surface`, `problem_category` | Compare broad decision demand | Prioritize journey placement, not personal answers |
| `concierge_destination_opened` | Recommended journey link | `entry_surface`, `problem_category`, `destination_id` | Measure completed routing | Improve weak category-to-destination handoffs |
| `flagship_journey_opened` | Primary journey card CTA | `entry_surface`, `destination_id` | Compare three flagship entrances | Rebalance homepage prominence |

## Benefits Command Center

| Event | Trigger | Fixed parameters | Purpose | Decision supported |
|---|---|---|---|---|
| `bcc_landing_viewed` | Activation surface mounts | `entry_surface` | Establish entry volume | Evaluate landing-to-mode activation |
| `bcc_mode_selected` | Build, sample Receipt, sample comparison, tour, or workspace purpose chosen | `entry_surface`, `action_id` | Compare safe fixed modes | Improve or remove weak activation modes |
| `bcc_tour_started` | Tour opens at step one | `entry_surface`, `action_id` | Measure orientation demand | Keep, shorten, or revise the tour |
| `bcc_package_started` | A user package is created | `entry_surface`, `action_id` | Measure creation activation | Reduce blank-workspace abandonment |
| `bcc_section_completed` | Next advances from a workspace section | `entry_surface`, `action_id` | Identify section drop-off | Simplify the weakest section |
| `bcc_receipt_generated` | Receipt module is opened | `entry_surface`, `action_id` | Measure useful output reach | Improve package-to-Receipt completion |
| `bcc_comparison_generated` | Comparison module opens with two packages | `entry_surface`, `action_id` | Measure comparison value | Improve two-package activation |
| `bcc_print_clicked` | Receipt print/PDF action | `entry_surface`, `action_id` | Measure retained output intent | Improve printable Receipt design |
| `bcc_local_data_cleared` | Clear-all control succeeds | `entry_surface`, `action_id` | Verify privacy-control use | Keep clearing visible and understandable |

No BCC event includes labels, pay, premiums, plan values, package contents, comparison results, completeness values, or local-storage data.

## Healthcare-cost journey

| Event | Trigger | Fixed parameters | Purpose | Decision supported |
|---|---|---|---|---|
| `cost_prep_started` | First cost-preparation interaction | `entry_surface`, `action_id` | Measure pre-care activation | Improve the initial preparation step |
| `cost_prep_completed` | Preparation plan is produced | `entry_surface`, `action_id` | Measure pre-care completion | Improve the weakest completion step |
| `prior_auth_guide_started` | First prior-authorization answer | `entry_surface`, `action_id` | Measure authorization handoff use | Improve pathway placement and orientation |
| `bill_review_started` | Bill-review pathway or fixed question is used | `entry_surface`, `action_id` | Measure post-care activation | Improve the pre-care to bill-review handoff |
| `bill_review_completed` | Review checklist is copied or printed | `entry_surface`, `action_id` | Measure retained review output | Improve checklist usefulness |
| `official_source_opened` | Fixed official-resource action | `entry_surface`, `destination_id` | Measure verification handoff | Keep the most useful official sources prominent |

## Medicare, Medicaid, and discharge

| Event | Trigger | Fixed parameters | Purpose | Decision supported |
|---|---|---|---|---|
| `coverage_check_started` | Eligibility starting-point check advances | `entry_surface`, `action_id` | Measure coverage-screen activation | Improve the first coverage step |
| `coverage_check_completed` | Starting-point results are reached | `entry_surface`, `action_id` | Measure completed screening | Improve weak steps without collecting answers |
| `discharge_checklist_started` | First discharge fixed choice changes | `entry_surface`, `action_id` | Measure discharge-preparation use | Improve discharge journey entry |
| `official_program_resource_opened` | Official program link opens | `entry_surface`, `action_id` | Measure authoritative handoff | Keep program resources findable |

## Organization journey

| Event | Trigger | Fixed parameters | Purpose | Decision supported |
|---|---|---|---|---|
| `organization_page_viewed` | Executive overview mounts | `entry_surface` | Establish buyer discovery volume | Evaluate organization visibility |
| `organization_program_opened` | Program or due-diligence page opens | `entry_surface`, `destination_id` or `action_id` | Measure buyer-stage depth | Improve buyer navigation and page priority |
| `organization_brief_started` | First fixed planner choice | `entry_surface`, `action_id` | Measure brief activation | Improve the planner introduction |
| `organization_brief_completed` | Brief is generated | `entry_surface`, `action_id` | Measure qualified self-service | Improve planner completion |
| `organization_contact_opened` | Non-sensitive contact path opens | `entry_surface`, `action_id` | Measure inquiry intent | Improve contact placement and scope copy |
| `organization_trust_page_opened` | Trust and procurement page opens | `entry_surface`, `action_id` | Measure due-diligence demand | Prioritize requested procurement evidence |

Organization type, audience, priority, timeline, brief contents, buyer identity, company name, contact information, and case details are prohibited from these events.

