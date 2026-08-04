begin;

update public.employer_benefits_employers
set status = 'active', updated_at = now()
where slug = 'atrium-health';

update public.employer_benefits_packages p
set
  population_label = 'General benefits-eligible teammates; division-specific verification required',
  status = 'review',
  source_completeness_percent = 40,
  updated_at = now()
from public.employer_benefits_employers e
where p.employer_id = e.id
  and e.slug = 'atrium-health'
  and p.plan_year = 2026
  and p.population_label = 'General benefits-eligible teammates';

insert into public.employer_benefits_sources (
  package_id,
  document_type,
  title,
  source_url,
  official_domain,
  review_status,
  retrieved_at,
  effective_start,
  effective_end,
  page_count,
  review_note
)
select
  p.id,
  'benefits_guide',
  '2026 Advocate Health and Atrium Health Benefits Guide',
  'https://cdn.atriumhealth.org/-/media/new-provider-portal/documents/2026/2026-benefits.pdf',
  'atriumhealth.org',
  'facts_extracted',
  date '2026-08-03',
  date '2026-01-01',
  date '2026-12-31',
  22,
  'Official-domain enterprise benefits guide. Candidate facts extracted with page provenance. Atrium division, employing entity, job class, and controlling plan documents require separate verification before guided prefill.'
from public.employer_benefits_packages p
join public.employer_benefits_employers e on e.id = p.employer_id
where e.slug = 'atrium-health'
  and p.plan_year = 2026
on conflict (package_id, source_url) do update set
  review_status = excluded.review_status,
  effective_start = excluded.effective_start,
  effective_end = excluded.effective_end,
  page_count = excluded.page_count,
  review_note = excluded.review_note,
  updated_at = now();

insert into public.employer_benefits_sources (
  package_id,
  document_type,
  title,
  source_url,
  official_domain,
  review_status,
  retrieved_at,
  effective_start,
  effective_end,
  page_count,
  review_note
)
select
  p.id,
  'employee_rate_sheet',
  '2026 Advocate Health Health Plan Premiums',
  'https://cdn.atriumhealth.org/-/media/new-provider-portal/documents/2026/2026_premium-sheet.pdf',
  'atriumhealth.org',
  'facts_extracted',
  date '2026-08-03',
  date '2026-01-01',
  date '2026-12-31',
  2,
  'Official-domain premium sheet. Candidate biweekly teammate contributions extracted; salary band, work status, surcharge status, division, and employee class require verification before guided prefill.'
from public.employer_benefits_packages p
join public.employer_benefits_employers e on e.id = p.employer_id
where e.slug = 'atrium-health'
  and p.plan_year = 2026
on conflict (package_id, source_url) do update set
  review_status = excluded.review_status,
  effective_start = excluded.effective_start,
  effective_end = excluded.effective_end,
  page_count = excluded.page_count,
  review_note = excluded.review_note,
  updated_at = now();

with atrium_package as (
  select p.id as package_id
  from public.employer_benefits_packages p
  join public.employer_benefits_employers e on e.id = p.employer_id
  where e.slug = 'atrium-health'
    and p.plan_year = 2026
), guide_source as (
  select s.id as source_id, s.package_id
  from public.employer_benefits_sources s
  join atrium_package p on p.package_id = s.package_id
  where s.document_type = 'benefits_guide'
), candidate_facts(category, fact_key, value, unit, source_page, reviewer_note) as (
  values
    (
      'deadline',
      'enrollment.annual_window',
      '{"start":"2025-10-15","end":"2025-10-31","action_required":true,"coverage_effective":"2026-01-01"}'::jsonb,
      null,
      2,
      'Guide states annual enrollment is October 15–31, action is required, and 2026 coverage becomes effective January 1, 2026.'
    ),
    (
      'deadline',
      'enrollment.elections_not_carried_forward',
      '{"medical":true,"dental":true,"vision":true,"hsa_contribution":true,"fsa_contribution":true}'::jsonb,
      null,
      4,
      'Guide states listed health elections and savings/spending contributions do not carry forward automatically for 2026.'
    ),
    (
      'medical',
      'medical.plan_options',
      '["Essentials","Choice HDHP with HSA","Premier"]'::jsonb,
      null,
      5,
      'Three medical options listed in the enterprise guide.'
    ),
    (
      'medical',
      'medical.network_structure',
      '{"tier_one":"Advocate Health Network","tier_two":"Aetna Choice POS II Network","out_of_network":"urgent_or_emergency_only","out_of_area_dependents":{"distance_miles":40,"tier_two_at_tier_one_benefit_level":true}}'::jsonb,
      null,
      6,
      'Candidate network rules extracted from the guide; provider participation must always be checked in the current directory.'
    ),
    (
      'medical',
      'medical.in_network_cost_sharing',
      '{
        "essentials": {
          "tier_one":{"deductible_individual":750,"deductible_family":1500,"coinsurance_percent":20,"primary_care_copay":20,"specialist_copay":60,"emergency_room_copay":450,"inpatient_admission_copay":500},
          "tier_two":{"deductible_individual":4000,"deductible_family":8000,"coinsurance_percent":50}
        },
        "choice": {
          "tier_one":{"deductible_individual":1800,"deductible_family":3600,"coinsurance_percent":10},
          "tier_two":{"deductible_individual":2500,"deductible_family":5000,"coinsurance_percent":30}
        },
        "premier": {
          "tier_one":{"deductible_individual":0,"deductible_family":0,"coinsurance_percent":0,"primary_care_copay":20,"specialist_copay":60,"emergency_room_copay":300,"outpatient_surgery_copay":250,"inpatient_admission_copay":500},
          "tier_two":{"deductible_individual":1500,"deductible_family":3000,"coinsurance_percent":30}
        },
        "out_of_pocket_maximum":{"tier_one_individual":4000,"tier_one_family":8000,"tier_two_individual":8000,"tier_two_family":16000}
      }'::jsonb,
      'USD per plan year unless percent or copay stated',
      7,
      'Candidate cost-sharing values extracted from the guide table. Service-specific, pharmacy, family-aggregation, and network rules require controlling-document verification.'
    ),
    (
      'spending_account',
      'medical.choice_hsa_employer_contribution',
      '{
        "salary_50000_or_less":{"teammate_only":500,"with_dependents":1000},
        "salary_50001_to_125000":{"teammate_only":250,"with_dependents":500},
        "salary_over_125000":{"teammate_only":0,"with_dependents":0},
        "eligible_plan":"Choice HDHP with HSA"
      }'::jsonb,
      'USD per plan year',
      15,
      'Candidate Advocate Health HSA contribution schedule extracted from the guide; salary and eligibility must be verified.'
    ),
    (
      'deadline',
      'enrollment.qualified_life_event_window',
      '{"standard_days":31,"birth_or_adoption_days":60}'::jsonb,
      'days from event',
      21,
      'Guide states a 31-day standard QLE notice window and 60 days for birth or adoption.'
    )
)
insert into public.employer_benefits_facts (
  package_id,
  source_id,
  category,
  fact_key,
  value,
  unit,
  source_page,
  confidence,
  review_status,
  reviewer_note
)
select
  g.package_id,
  g.source_id,
  f.category,
  f.fact_key,
  f.value,
  f.unit,
  f.source_page,
  'medium',
  'candidate',
  f.reviewer_note
from guide_source g
cross join candidate_facts f
on conflict (package_id, fact_key) do update set
  source_id = excluded.source_id,
  category = excluded.category,
  value = excluded.value,
  unit = excluded.unit,
  source_page = excluded.source_page,
  confidence = excluded.confidence,
  review_status = excluded.review_status,
  reviewer_note = excluded.reviewer_note,
  updated_at = now();

with atrium_package as (
  select p.id as package_id
  from public.employer_benefits_packages p
  join public.employer_benefits_employers e on e.id = p.employer_id
  where e.slug = 'atrium-health'
    and p.plan_year = 2026
), rate_source as (
  select s.id as source_id, s.package_id
  from public.employer_benefits_sources s
  join atrium_package p on p.package_id = s.package_id
  where s.document_type = 'employee_rate_sheet'
)
insert into public.employer_benefits_facts (
  package_id,
  source_id,
  category,
  fact_key,
  value,
  unit,
  source_page,
  confidence,
  review_status,
  reviewer_note
)
select
  r.package_id,
  r.source_id,
  'medical',
  'medical.biweekly_employee_premiums',
  '{
    "full_time_30_plus_hours": {
      "salary_50000_or_less": {
        "essentials":{"teammate_only":20,"teammate_children":67,"teammate_spouse_partner":106,"family":153},
        "choice":{"teammate_only":50,"teammate_children":123,"teammate_spouse_partner":169,"family":242},
        "premier":{"teammate_only":100,"teammate_children":221,"teammate_spouse_partner":285,"family":334}
      },
      "salary_50001_to_125000": {
        "essentials":{"teammate_only":38,"teammate_children":101,"teammate_spouse_partner":144,"family":206},
        "choice":{"teammate_only":67,"teammate_children":155,"teammate_spouse_partner":206,"family":293},
        "premier":{"teammate_only":119,"teammate_children":255,"teammate_spouse_partner":325,"family":460}
      },
      "salary_125001_plus": {
        "essentials":{"teammate_only":56,"teammate_children":134,"teammate_spouse_partner":183,"family":261},
        "choice":{"teammate_only":84,"teammate_children":186,"teammate_spouse_partner":243,"family":345},
        "premier":{"teammate_only":137,"teammate_children":290,"teammate_spouse_partner":365,"family":518}
      }
    },
    "part_time_20_to_29_hours": {
      "all_salaries": {
        "essentials":{"teammate_only":102,"teammate_children":222,"teammate_spouse_partner":285,"family":405},
        "choice":{"teammate_only":128,"teammate_children":270,"teammate_spouse_partner":340,"family":482},
        "premier":{"teammate_only":185,"teammate_children":382,"teammate_spouse_partner":471,"family":668}
      }
    }
  }'::jsonb,
  'USD per biweekly paycheck',
  1,
  'medium',
  'candidate',
  'Teammate-contribution values extracted from the official premium sheet. Work status, salary band, dependent tier, division, and surcharge status require verification before guided prefill.'
from rate_source r
on conflict (package_id, fact_key) do update set
  source_id = excluded.source_id,
  value = excluded.value,
  unit = excluded.unit,
  source_page = excluded.source_page,
  confidence = excluded.confidence,
  review_status = excluded.review_status,
  reviewer_note = excluded.reviewer_note,
  updated_at = now();

with atrium_package as (
  select p.id as package_id
  from public.employer_benefits_packages p
  join public.employer_benefits_employers e on e.id = p.employer_id
  where e.slug = 'atrium-health'
    and p.plan_year = 2026
), rate_source as (
  select s.id as source_id, s.package_id
  from public.employer_benefits_sources s
  join atrium_package p on p.package_id = s.package_id
  where s.document_type = 'employee_rate_sheet'
)
insert into public.employer_benefits_facts (
  package_id,
  source_id,
  category,
  fact_key,
  value,
  unit,
  source_page,
  confidence,
  review_status,
  reviewer_note
)
select
  r.package_id,
  r.source_id,
  'medical',
  'medical.payroll_surcharges',
  '{"spousal":{"amount":60,"per":"pay_period","trigger":"enrolled spouse or partner has access to other medical coverage"},"tobacco":{"amount":50,"per":"pay_period","applies_to":"enrolled teammate or enrolled spouse/partner using tobacco","cessation_waiver_or_reimbursement_available":true}}'::jsonb,
  'USD per pay period',
  1,
  'medium',
  'candidate',
  'Candidate surcharge amounts and triggers extracted from the official premium sheet; employee certification and exceptions remain authoritative.'
from rate_source r
on conflict (package_id, fact_key) do update set
  source_id = excluded.source_id,
  value = excluded.value,
  unit = excluded.unit,
  source_page = excluded.source_page,
  confidence = excluded.confidence,
  review_status = excluded.review_status,
  reviewer_note = excluded.reviewer_note,
  updated_at = now();

commit;
