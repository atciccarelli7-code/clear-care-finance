begin;

update public.employer_benefits_employers
set status = 'active', updated_at = now()
where slug = 'novant-health';

update public.employer_benefits_packages p
set
  status = 'review',
  source_completeness_percent = 40,
  updated_at = now()
from public.employer_benefits_employers e
where p.employer_id = e.id
  and e.slug = 'novant-health'
  and p.plan_year = 2026
  and p.population_label = 'General benefits-eligible employees';

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
  '2026 Novant Health Team Member Benefits Guide',
  'https://benefits.novanthealth.org/-/media/Mercer/Novant/Documents/2026-Team-Member-Enrollment-Guide.pdf?hash=F440BA48770F5B5D168FBD720C87D379&rev=b6470faf82774984b3b3e5e8c476985c',
  'benefits.novanthealth.org',
  'facts_extracted',
  date '2026-08-03',
  date '2026-01-01',
  date '2026-12-31',
  54,
  'Official-domain benefits guide. Candidate facts extracted with page provenance; separate human verification remains required before guided prefill.'
from public.employer_benefits_packages p
join public.employer_benefits_employers e on e.id = p.employer_id
where e.slug = 'novant-health'
  and p.plan_year = 2026
  and p.population_label = 'General benefits-eligible employees'
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
  '2026 Novant Health Health Plan Bi-Weekly Premiums',
  'https://benefits.novanthealth.org/-/media/Mercer/Novant/Documents/2026-Contribution-Rates.pdf?hash=7DA1355E29DFF1767C2A9644D7433CEC&rev=59985308668043ae93468ae143dbfa2f',
  'benefits.novanthealth.org',
  'facts_extracted',
  date '2026-08-03',
  date '2026-01-01',
  date '2026-12-31',
  1,
  'Official-domain premium sheet. Candidate biweekly employee net premiums extracted; separate human verification remains required before guided prefill.'
from public.employer_benefits_packages p
join public.employer_benefits_employers e on e.id = p.employer_id
where e.slug = 'novant-health'
  and p.plan_year = 2026
  and p.population_label = 'General benefits-eligible employees'
on conflict (package_id, source_url) do update set
  review_status = excluded.review_status,
  effective_start = excluded.effective_start,
  effective_end = excluded.effective_end,
  page_count = excluded.page_count,
  review_note = excluded.review_note,
  updated_at = now();

with novant_package as (
  select p.id as package_id
  from public.employer_benefits_packages p
  join public.employer_benefits_employers e on e.id = p.employer_id
  where e.slug = 'novant-health'
    and p.plan_year = 2026
    and p.population_label = 'General benefits-eligible employees'
), guide_source as (
  select s.id as source_id, s.package_id
  from public.employer_benefits_sources s
  join novant_package p on p.package_id = s.package_id
  where s.document_type = 'benefits_guide'
), candidate_facts(category, fact_key, value, unit, source_page, reviewer_note) as (
  values
    (
      'deadline',
      'enrollment.new_hire_window_days',
      '31'::jsonb,
      'days',
      5,
      'Guide states newly hired team members have 31 days to enroll and submit required dependent documentation.'
    ),
    (
      'eligibility',
      'medical.spouse_other_employer_coverage_exclusion',
      '{"applies":true,"summary":"An employed spouse eligible for employer-sponsored group medical coverage cannot be enrolled in a Novant Health medical plan; documented exceptions include self-employment, unemployment, retirement, disability, or no employer group medical coverage."}'::jsonb,
      null,
      7,
      'Candidate rule requires verification against controlling plan documents and the employee population before use.'
    ),
    (
      'medical',
      'medical.plan_options',
      '["Novant Health Premier Plan","Blue Standard Plan","Blue Premium Plan","Blue High Deductible Health Plan with HSA"]'::jsonb,
      null,
      9,
      'Four medical options listed in the 2026 team-member guide.'
    ),
    (
      'spending_account',
      'medical.blue_hdph.hsa_employer_contribution',
      '{"employee_only_annual":750,"family_annual":1500,"new_hire_proration":true}'::jsonb,
      'USD per plan year',
      9,
      'Guide states Novant Health contributes $750 individual and $1,500 family annually, prorated for new hires.'
    ),
    (
      'disability',
      'disability.long_term',
      '{"employer_paid":true,"base_pay_replacement_percent":60,"waiting_period_days":90,"monthly_maximum":15000}'::jsonb,
      null,
      38,
      'Guide summary; controlling carrier and plan documents remain authoritative.'
    ),
    (
      'life_insurance',
      'life.basic',
      '{"employer_paid":true,"base_pay_multiple":1.5,"coverage_maximum":1000000,"automatic_enrollment":true}'::jsonb,
      null,
      38,
      'Guide summary; controlling carrier and plan documents remain authoritative.'
    ),
    (
      'retirement',
      'retirement.auto_enrollment',
      '{"pre_tax_percent":4,"opt_out_window_days":90,"default_investment":"State Street Target Retirement Fund based on date of birth"}'::jsonb,
      null,
      39,
      'Guide states newly hired team members are automatically enrolled at 4% pre-tax unless changed.'
    ),
    (
      'retirement',
      'retirement.employee_contribution_range',
      '{"minimum_percent":1,"maximum_percent":60,"increment_percent":0.1,"supports_pre_tax":true,"supports_roth":true}'::jsonb,
      'percent of salary',
      40,
      'Candidate contribution range from guide; statutory and plan-specific limits still apply.'
    ),
    (
      'retirement',
      'retirement.match_formula',
      '{"type":"dollar_for_dollar_up_to_employee_percent","match_rate":1,"employee_contribution_limit_percent":6,"calculated_each_pay_period":true,"eligibility":"date of hire"}'::jsonb,
      null,
      40,
      'Guide states dollar-for-dollar match on the first 6% contributed each pay period.'
    ),
    (
      'retirement',
      'retirement.match_vesting',
      '{"vesting_years":3,"hours_required_per_vesting_year":1000,"employee_contributions_always_fully_vested":true}'::jsonb,
      null,
      40,
      'Guide states matching contributions vest after three years of service, with 1,000 paid hours required for a year of vesting service.'
    ),
    (
      'leave',
      'leave.pto_schedule',
      '[{"service_months":"0-11","biweekly_hours":8.00,"hourly_accrual_rate":0.1},{"service_months":"12-23","annual_days":29,"biweekly_hours":8.92,"hourly_accrual_rate":0.111538},{"service_months":"24-59","annual_days":31,"biweekly_hours":9.54,"hourly_accrual_rate":0.119231},{"service_months":"60-179","annual_days":34,"biweekly_hours":10.47,"hourly_accrual_rate":0.130875},{"service_months":"180+","annual_days":39,"biweekly_hours":12.00,"hourly_accrual_rate":0.15}]'::jsonb,
      null,
      43,
      'Guide notes biweekly accrual is based on a 40-hour work week; applicability to individual schedules requires verification.'
    ),
    (
      'leave',
      'leave.parental_and_caregiver',
      '{"eligibility":{"months_employed":12,"hours_in_prior_12_months":1250},"parental":{"weeks":4,"base_pay_percent":100},"caregiver":{"weeks":1,"base_pay_percent":100}}'::jsonb,
      null,
      43,
      'Guide summary; FMLA definitions and controlling policies remain authoritative.'
    ),
    (
      'education',
      'education.tuition_reimbursement',
      '{"eligibility_wait_days":90,"full_time":{"minimum_hours_per_week":30,"annual_maximum":5250},"part_time":{"annual_maximum":2625},"approved_plan_of_study_required":true}'::jsonb,
      'USD per calendar year',
      44,
      'Guide summary; program approval and controlling policy remain authoritative.'
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

with novant_package as (
  select p.id as package_id
  from public.employer_benefits_packages p
  join public.employer_benefits_employers e on e.id = p.employer_id
  where e.slug = 'novant-health'
    and p.plan_year = 2026
    and p.population_label = 'General benefits-eligible employees'
), rate_source as (
  select s.id as source_id, s.package_id
  from public.employer_benefits_sources s
  join novant_package p on p.package_id = s.package_id
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
      "novant_health_premier": {"employee_only":19.70,"employee_children":80.02,"employee_spouse":129.32,"employee_family":149.20},
      "blue_standard": {"employee_only":41.19,"employee_children":122.93,"employee_spouse":182.17,"employee_family":230.42},
      "blue_premium": {"employee_only":76.69,"employee_children":191.08,"employee_spouse":255.70,"employee_family":335.11},
      "blue_hdph_hsa": {"employee_only":35.01,"employee_children":104.49,"employee_spouse":154.85,"employee_family":195.86}
    },
    "part_time_24_to_29_hours": {
      "novant_health_premier": {"employee_only":111.01,"employee_children":257.37,"employee_spouse":310.85,"employee_family":418.73},
      "blue_standard": {"employee_only":122.22,"employee_children":283.36,"employee_spouse":342.24,"employee_family":461.01},
      "blue_premium": {"employee_only":167.78,"employee_children":371.37,"employee_spouse":435.65,"employee_family":594.33},
      "blue_hdph_hsa": {"employee_only":116.11,"employee_children":269.19,"employee_spouse":325.13,"employee_family":437.96}
    }
  }'::jsonb,
  'USD per biweekly paycheck',
  1,
  'medium',
  'candidate',
  'Employee net-cost values extracted from the official 2026 premium sheet. Employment classification and source figures require separate human verification before guided prefill.'
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
