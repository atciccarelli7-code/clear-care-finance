begin;

update public.employer_benefits_employers
set status = 'active', updated_at = now()
where slug = 'ecu-health';

update public.employer_benefits_packages p
set
  status = 'review',
  source_completeness_percent = 20,
  updated_at = now()
from public.employer_benefits_employers e
where p.employer_id = e.id
  and e.slug = 'ecu-health'
  and p.plan_year = 2026
  and p.population_label = 'Benefits-eligible team members';

update public.employer_benefits_sources s
set
  review_status = 'facts_extracted',
  effective_start = date '2026-01-01',
  effective_end = date '2026-12-31',
  review_note = 'Official-domain 2026 benefits guide. Candidate facts extracted with page provenance; controlling plan documents and separate human verification remain required before guided prefill.',
  updated_at = now()
from public.employer_benefits_packages p
join public.employer_benefits_employers e on e.id = p.employer_id
where s.package_id = p.id
  and e.slug = 'ecu-health'
  and p.plan_year = 2026
  and s.source_url = 'https://totalrewards.ecuhealth.org/wp-content/uploads/2025/09/2026_ECU_Health_8.5x11_Benefits_Guide_Team_LR.pdf';

with ecu_package as (
  select p.id as package_id
  from public.employer_benefits_packages p
  join public.employer_benefits_employers e on e.id = p.employer_id
  where e.slug = 'ecu-health'
    and p.plan_year = 2026
    and p.population_label = 'Benefits-eligible team members'
), guide_source as (
  select s.id as source_id, s.package_id
  from public.employer_benefits_sources s
  join ecu_package p on p.package_id = s.package_id
  where s.document_type = 'benefits_guide'
), candidate_facts(category, fact_key, value, unit, source_page, reviewer_note) as (
  values
    (
      'eligibility',
      'eligibility.minimum_fte',
      '{"fte":0.5,"applies_to":"benefits eligibility"}'::jsonb,
      'FTE',
      5,
      'Guide states team members working at least 0.5 FTE are eligible for benefits; individual employment classification must be verified.'
    ),
    (
      'deadline',
      'enrollment.new_hire_window_days',
      '30'::jsonb,
      'days',
      5,
      'Guide states newly eligible team members have 30 days to enroll.'
    ),
    (
      'eligibility',
      'coverage.new_hire_effective_date',
      '{"rule":"first_day_of_month_after_hire"}'::jsonb,
      null,
      5,
      'Candidate effective-date rule extracted from the guide; special populations and controlling documents may differ.'
    ),
    (
      'medical',
      'medical.plan_options',
      '["Medical Savings Plan","Basic Plan","Choice Plan"]'::jsonb,
      null,
      13,
      'Three medical plan options listed in the 2026 guide.'
    ),
    (
      'medical',
      'medical.payroll_deduction_schedule',
      '{"deductions_per_year":24,"paychecks_per_year":26}'::jsonb,
      'pay periods',
      12,
      'Guide states benefit deductions occur on 24 of 26 paychecks; payroll exceptions still require verification.'
    ),
    (
      'medical',
      'medical.spouse_surcharge',
      '{"amount_per_pay_period":55,"applies_when":"spouse_or_domestic_partner_has_access_to_other_employer_medical_coverage","exceptions":["not employed","self-employed","employer does not offer medical coverage","not eligible for employer medical coverage","covered by Medicare or military coverage"]}'::jsonb,
      'USD per pay period',
      12,
      'Candidate spouse surcharge and listed exceptions extracted from the guide; applicability must be confirmed for the employee.'
    ),
    (
      'medical',
      'medical.per_pay_period_premiums',
      '{
        "full_time": {
          "medical_savings": {"employee_only":40.22,"employee_children":149.40,"employee_spouse":234.44,"employee_family":257.42},
          "basic": {"employee_only":45.97,"employee_children":174.68,"employee_spouse":273.51,"employee_family":299.94},
          "choice": {"employee_only":60.91,"employee_children":202.26,"employee_spouse":306.84,"employee_family":335.57}
        },
        "part_time": {
          "medical_savings": {"employee_only":112.62,"employee_children":255.12,"employee_spouse":322.93,"employee_family":381.54},
          "basic": {"employee_only":129.86,"employee_children":297.65,"employee_spouse":378.09,"employee_family":444.74},
          "choice": {"employee_only":143.65,"employee_children":324.08,"employee_spouse":412.57,"employee_family":479.22}
        }
      }'::jsonb,
      'USD per benefit-deduction pay period',
      12,
      'Employee deductions extracted from the guide. Full-time versus part-time status and any wellness or surcharge adjustments require verification.'
    ),
    (
      'medical',
      'medical.tier_one_cost_sharing',
      '{
        "medical_savings": {"deductible_single":2000,"deductible_family":4000,"medical_out_of_pocket_single":6000,"medical_out_of_pocket_family":12000},
        "basic": {"deductible_single":1200,"deductible_family":2400,"medical_out_of_pocket_single":4000,"medical_out_of_pocket_family":8000,"prescription_out_of_pocket_single":2500,"prescription_out_of_pocket_family":5000},
        "choice": {"deductible_single":850,"deductible_family":1700,"medical_out_of_pocket_single":3300,"medical_out_of_pocket_family":6600,"prescription_out_of_pocket_single":2500,"prescription_out_of_pocket_family":5000}
      }'::jsonb,
      'USD per plan year',
      14,
      'Tier 1 deductible and out-of-pocket values extracted from the guide. Network, embedded-family, and service-specific rules remain unresolved.'
    ),
    (
      'retirement',
      'retirement.401k_auto_enrollment',
      '{"employee_contribution_percent":5,"starts_after_days":30}'::jsonb,
      'percent of eligible pay',
      34,
      'Guide states automatic enrollment at 5% after 30 days unless changed or declined.'
    ),
    (
      'retirement',
      'retirement.401k_match_non_pension_eligible',
      '[{"service_years":"less_than_5","match_rate":0.5,"employee_contribution_limit_percent":5},{"service_years":"5_to_less_than_10","match_rate":0.75,"employee_contribution_limit_percent":5},{"service_years":"10_plus","match_rate":1.0,"employee_contribution_limit_percent":5}]'::jsonb,
      null,
      34,
      'Candidate graduated match schedule for non-pension-eligible team members extracted from the guide.'
    ),
    (
      'retirement',
      'retirement.401k_match_pension_eligible',
      '{"match_rate":0.5,"employee_contribution_limit_percent":5}'::jsonb,
      null,
      34,
      'Candidate match schedule for pension-eligible team members extracted from the guide.'
    ),
    (
      'retirement',
      'retirement.401k_match_eligibility',
      '{"immediate_in_2026":true}'::jsonb,
      null,
      34,
      'Guide states immediate employer-match eligibility in 2026; plan-document verification remains required.'
    ),
    (
      'retirement',
      'retirement.401k_match_vesting',
      '{"years":3,"applies_to_hires_on_or_after":"2025-01-01"}'::jsonb,
      'years',
      34,
      'Candidate vesting rule extracted from the guide; earlier-hire populations may have different terms.'
    ),
    (
      'education',
      'education.tuition_reimbursement',
      '{"associate_or_bachelor":{"full_time_annual_maximum":4000,"part_time_annual_maximum":2000},"graduate_or_professional":{"full_time_annual_maximum":5000,"part_time_annual_maximum":2500}}'::jsonb,
      'USD per calendar year',
      40,
      'Candidate tuition reimbursement maximums extracted from the guide; eligibility, approved programs, and repayment obligations require policy verification.'
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
