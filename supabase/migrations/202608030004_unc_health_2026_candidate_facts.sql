begin;

update public.employer_benefits_employers
set status = 'active', updated_at = now()
where slug = 'unc-health';

update public.employer_benefits_packages p
set
  status = 'review',
  source_completeness_percent = 20,
  updated_at = now()
from public.employer_benefits_employers e
where p.employer_id = e.id
  and e.slug = 'unc-health'
  and p.plan_year = 2026
  and p.population_label = 'Triangle and Non-Triangle employees';

update public.employer_benefits_sources s
set
  review_status = 'facts_extracted',
  page_count = 5,
  effective_start = date '2026-01-01',
  effective_end = date '2026-12-31',
  review_note = 'Official-domain five-page benefits summary. Candidate facts extracted with page provenance; controlling plan documents and separate human verification remain required before guided prefill.',
  updated_at = now()
from public.employer_benefits_packages p
join public.employer_benefits_employers e on e.id = p.employer_id
where s.package_id = p.id
  and e.slug = 'unc-health'
  and p.plan_year = 2026
  and s.source_url = 'https://jobs.unchealthcare.org/system/production/assets/515332/original/2026_UNC_Health_Benefit_Summary_Triangle___Non-Triangle.pdf';

with unc_package as (
  select p.id as package_id
  from public.employer_benefits_packages p
  join public.employer_benefits_employers e on e.id = p.employer_id
  where e.slug = 'unc-health'
    and p.plan_year = 2026
    and p.population_label = 'Triangle and Non-Triangle employees'
), guide_source as (
  select s.id as source_id, s.package_id
  from public.employer_benefits_sources s
  join unc_package p on p.package_id = s.package_id
  where s.document_type = 'benefits_guide'
), candidate_facts(category, fact_key, value, unit, source_page, reviewer_note) as (
  values
    (
      'eligibility',
      'eligibility.minimum_scheduled_hours',
      '{"hours_per_week":20,"applies_to":["medical","dental","vision","pharmacy"],"employment_statuses":["full-time non-temporary","part-time"]}'::jsonb,
      'hours per week',
      2,
      'Summary states coverage is available to full-time non-temporary and part-time teammates scheduled and regularly working at least 20 hours per week.'
    ),
    (
      'medical',
      'medical.plan_options',
      '["High Deductible Health Plan with HSA","PPO Copay Plan"]'::jsonb,
      null,
      2,
      'Summary lists two medical plan options. Controlling medical plan documents remain authoritative.'
    ),
    (
      'spending_account',
      'medical.hdph.hsa_employer_contribution',
      '{"teammate_only_annual":500,"teammate_plus_dependent_annual":1000}'::jsonb,
      'USD per plan year',
      2,
      'Candidate employer contribution values extracted from the summary.'
    ),
    (
      'medical',
      'medical.per_pay_period_premiums',
      '{
        "triangle_full_time": {
          "non_well_being": {
            "ppo_copay": {"teammate_only":131.21,"teammate_spouse":289.71,"teammate_children":246.87,"teammate_family":377.04},
            "hdhp_hsa": {"teammate_only":60.89,"teammate_spouse":132.88,"teammate_children":113.28,"teammate_family":205.16}
          },
          "well_being": {
            "ppo_copay": {"teammate_only":113.03,"teammate_spouse":251.55,"teammate_children":208.71,"teammate_family":339.24},
            "hdhp_hsa": {"teammate_only":41.81,"teammate_spouse":93.28,"teammate_children":73.68,"teammate_family":165.56}
          }
        },
        "non_triangle_full_time": {
          "non_well_being": {
            "ppo_copay": {"teammate_only":104.98,"teammate_spouse":231.90,"teammate_children":197.29,"teammate_family":356.08},
            "hdhp_hsa": {"teammate_only":36.80,"teammate_spouse":80.44,"teammate_children":68.28,"teammate_family":125.27}
          },
          "well_being": {
            "ppo_copay": {"teammate_only":86.80,"teammate_spouse":193.74,"teammate_children":159.13,"teammate_family":318.28},
            "hdhp_hsa": {"teammate_only":17.72,"teammate_spouse":40.84,"teammate_children":28.68,"teammate_family":85.67}
          }
        }
      }'::jsonb,
      'USD per pay period',
      3,
      'Full-time rates extracted from the summary. Pay frequency and individual employee classification require verification before annualization.'
    ),
    (
      'retirement',
      'retirement.plan_options',
      '["403(b)","457(b) for specified management or highly compensated groups"]'::jsonb,
      null,
      5,
      'Summary states NC Health contributes only to the 403(b) plan.'
    ),
    (
      'retirement',
      'retirement.403b_match_tiers',
      '[{"service_years":"less_than_3","match_rate":0.5,"employee_contribution_limit_percent":6},{"service_years":"3_to_less_than_8","match_rate":0.5,"employee_contribution_limit_percent":8},{"service_years":"8_plus","match_rate":0.5,"employee_contribution_limit_percent":10}]'::jsonb,
      null,
      5,
      'Candidate service-based match tiers extracted from the summary.'
    ),
    (
      'retirement',
      'retirement.403b_vesting',
      '{"years":3}'::jsonb,
      'years',
      5,
      'Summary states vesting after three years; controlling plan document remains authoritative.'
    ),
    (
      'retirement',
      'retirement.403b_auto_deferral',
      '{"total_percent":3,"mandatory_percent":2,"voluntary_percent":1,"annual_escalation_percent":1,"escalation_cap_percent":10}'::jsonb,
      'percent of compensation',
      5,
      'Candidate automatic deferral and escalation terms extracted from the summary.'
    ),
    (
      'leave',
      'leave.full_time_pto_schedule',
      '{
        "below_manager": [
          {"service_years":"up_to_3","annual_hours":200},
          {"service_years":"after_3","annual_hours":240},
          {"service_years":"after_8","annual_hours":280},
          {"service_years":"after_14","annual_hours":320}
        ],
        "department_heads_managers_apps": [
          {"service_years":"up_to_3","annual_hours":240},
          {"service_years":"after_3","annual_hours":280},
          {"service_years":"after_8","annual_hours":320}
        ],
        "prorated_below_40_hours":true
      }'::jsonb,
      'hours per year',
      5,
      'Candidate PTO schedule extracted from the summary; role category and individual schedule require verification.'
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

commit;
