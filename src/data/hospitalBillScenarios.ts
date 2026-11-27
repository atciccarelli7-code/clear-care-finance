export interface BillLineItem {
  id: string;
  department: string;
  revenueCode: string;
  description: string;
  quantity: number;
  unitChargeCents: number;
  explanation: string;
  question: string;
  separateProfessional: boolean;
}

export interface BillScenario {
  id: string;
  title: string;
  focus: string;
  patient: { name: string; age: number };
  classification: 'inpatient' | 'observation';
  inpatientDays: number;
  dates: { admission: string; discharge: string };
  diagnosis: string;
  comorbidities: string[];
  pathway: string[];
  timeline: { day: string; title: string; detail: string; departments: string[] }[];
  discharge: string;
  separateBills: string[];
  risks: string[];
  items: BillLineItem[];
  benchmarkDrg?: string;
  illustrativeAllowedCents: number;
  professionalChargesCents: number;
  professionalAllowedCents: number;
  sourceIds: string[];
  limitations: string[];
}

const item = (id: string, department: string, revenueCode: string, description: string, quantity: number, unitChargeCents: number, explanation: string, question: string, separateProfessional = false): BillLineItem => ({ id, department, revenueCode, description, quantity, unitChargeCents, explanation, question, separateProfessional });

const commonLimits = [
  'Every identity, date, service quantity and itemized charge is fictional. These are educational pathways, not treatment recommendations or predictions of usual care.',
  'The modeled allowed amount and professional prices are invented teaching assumptions, not hospital-specific Medicare rates, negotiated prices or quotes.',
  'Revenue codes identify broad illustrative departments; they do not establish that a particular code, unit or charge is correct for an actual claim.',
  'The facility model assumes covered care. Denials, medical necessity, payment adjustments and individual coding require the actual claim and plan documents.',
];

const pneumoniaItems: BillLineItem[] = [
  item('ed', 'Emergency department', '0450', 'Emergency department facility services', 1, 380000, 'The emergency department uses staff, space and equipment to evaluate the patient. This is a facility charge; the emergency physician may bill separately. In this inpatient example, the listed departments are components of a case payment rather than individually paid prices.', 'Which encounter and date does this facility service belong to?', true),
  item('room', 'Room and board', '0120', 'Semiprivate room and routine nursing', 4, 420000, 'The daily room charge represents a category of hospital resources, including routine nursing. Do not add a second fictional nursing payment to it. A charge is neither a measurement of the nurse’s wages nor the hospital’s actual daily cost.', 'Does this quantity match the billed inpatient dates, and is routine nursing already included?'),
  item('lab', 'Laboratory', '0300', 'Laboratory testing bundle', 1, 285000, 'This simulated department subtotal groups blood counts, chemistry and microbiology testing. Under an inpatient case payment, more tests do not automatically produce a separate payment for each listed test.', 'Can you provide the underlying tests and dates behind this subtotal?'),
  item('imaging', 'Imaging', '0320', 'Chest imaging facility services', 1, 320000, 'The facility supplies the imaging equipment and technical work. A radiologist’s interpretation can generate a different professional claim. The simulated subtotal does not identify a CPT-coded scan price.', 'Is this the technical facility charge, and will a radiologist send a separate bill?', true),
  item('pharmacy', 'Pharmacy', '0250', 'Medications, antibiotics and IV fluids', 1, 415000, 'These are fictional hospital pharmacy charges grouped for teaching. In a covered inpatient stay, drugs are generally part of the hospital payment, not an outpatient prescription filled under Part D.', 'Which medications, quantities and administration dates are included?'),
  item('respiratory', 'Respiratory therapy', '0410', 'Oxygen and respiratory treatment services', 1, 245000, 'Oxygen delivery and respiratory services use equipment, supplies and clinical labor. An inpatient line item does not establish a separate insurer payment of this amount.', 'Which respiratory services were provided, and are equipment quantities correct?'),
  item('supplies', 'Medical supplies', '0270', 'Medical supply subtotal', 1, 180500, 'This reconstructed subtotal represents supplies used in the illustrative stay. It is not a verified list of hospital unit prices or a way to calculate the hospital’s profit.', 'Can you explain the supplies and distinguish them from items already included elsewhere?'),
];

const pneumonia: BillScenario = {
  id: 'pneumonia', title: 'Pneumonia: four inpatient days', focus: 'One hospitalization, several meanings of “price.”',
  patient: { name: 'Morgan Sample', age: 68 }, classification: 'inpatient', inpatientDays: 4,
  dates: { admission: '2026-11-10', discharge: '2026-11-14' }, diagnosis: 'Illustrative pneumonia admission; compare the separate MS-DRG 194 aggregate benchmark',
  comorbidities: ['Chronic lung disease; no patient record or coding determination is implied'],
  pathway: ['Emergency evaluation, imaging and laboratory work', 'Inpatient antibiotics, fluids and oxygen as clinically indicated', 'Reassessment, medication reconciliation and discharge preparation'],
  timeline: [
    { day: 'Arrival', title: 'The emergency visit becomes an admission', detail: 'The fictional patient has fever, cough and low oxygen. The hospital obtains an inpatient order. Clinical details here do not determine an actual DRG.', departments: ['Emergency department', 'Laboratory', 'Imaging'] },
    { day: 'Days 1–3', title: 'Treatment and reassessment', detail: 'Routine nursing, medications and respiratory services appear in separate charge categories even when facility payment is bundled.', departments: ['Room and board', 'Pharmacy', 'Respiratory therapy'] },
    { day: 'Day 4', title: 'Discharge is another financial handoff', detail: 'Medication access and follow-up need checking. Covered inpatient treatment does not settle later pharmacy, equipment or physician claims.', departments: ['Pharmacy', 'Care coordination'] },
  ],
  discharge: 'Home with follow-up arranged; no assumption that family supplies unpaid skilled care.',
  separateBills: ['Emergency physician', 'Hospitalist or consultant', 'Radiologist interpretation', 'Ambulance if used'],
  risks: ['Prescriptions after discharge use a different benefit from inpatient drugs.', 'Home oxygen or other equipment has its own coverage and supplier rules.', 'Ask who will help between any intermittent home-health visits.'],
  items: pneumoniaItems, benchmarkDrg: '194', illustrativeAllowedCents: 800000, professionalChargesCents: 240000, professionalAllowedCents: 120000,
  sourceIds: ['cms-inpatient', 'cms-dictionary', 'medicare-costs', 'ipps', 'inpatient-status', 'inpatient-coverage'], limitations: commonLimits,
};

export const hospitalBillScenarios: BillScenario[] = [pneumonia, {
  id: 'heart-failure', title: 'Heart failure: five inpatient days', focus: 'Severity, readmission risk and the next setting of care.',
  patient: { name: 'Alex Example', age: 74 }, classification: 'inpatient', inpatientDays: 5,
  dates: { admission: '2026-11-05', discharge: '2026-11-10' }, diagnosis: 'Illustrative acute heart-failure admission; separate benchmark is MS-DRG 291 with MCC',
  comorbidities: ['Chronic kidney disease', 'Chronic heart failure; fictional clinical details are not a coding grouper'],
  pathway: ['Evaluation of breathlessness and fluid retention', 'Diuresis, monitoring and reassessment', 'Medication access, follow-up and support planning'],
  timeline: [
    { day: 'Arrival', title: 'A clinical problem crosses several departments', detail: 'Laboratory work, imaging and monitoring help the clinical team assess the situation. More listed departments do not mean a payer reimburses every charge separately.', departments: ['Emergency department', 'Laboratory', 'Imaging'] },
    { day: 'Days 1–4', title: 'Care and documentation affect different systems', detail: 'Treatment, nursing and monitoring continue. The actual diagnoses, documented severity, procedures and discharge status determine coding; the title “heart failure” alone does not establish DRG 291.', departments: ['Room and board', 'Pharmacy', 'Cardiology'] },
    { day: 'Day 5', title: 'The hospital bill does not cover the whole recovery', detail: 'The plan needs usable medications, transport and follow-up. A later readmission is a new encounter; benefit-period and plan rules determine the patient’s cost sharing.', departments: ['Care coordination', 'Pharmacy'] },
  ],
  discharge: 'Home with an individualized follow-up and medication plan; post-acute services require separate eligibility review.',
  separateBills: ['Hospitalist', 'Cardiologist', 'Radiologist', 'Ambulance if used'],
  risks: ['A readmission can produce another account even when Original Medicare remains in the same Part A benefit period.', 'Specialty medication and transport costs may remain after the facility account closes.', 'Rehabilitation is not automatically authorized because a clinician recommends it.'],
  items: [
    item('ed', 'Emergency department', '0450', 'Emergency department facility services', 1, 410000, 'A simulated facility subtotal for emergency evaluation; the physician claim is separate.', 'Does this match the emergency encounter on my EOB?', true),
    item('room', 'Room and board', '0120', 'Semiprivate room and routine nursing', 5, 420000, 'Routine nursing is represented within room and board. Its simulated daily charge is not the hospital’s daily cost or reimbursement.', 'Does the number of billed days match the account dates?'),
    item('lab', 'Laboratory', '0300', 'Laboratory monitoring bundle', 1, 360000, 'The fictional subtotal groups testing used for monitoring. These charges can sit inside the inpatient case payment.', 'Which tests and collection dates make up this subtotal?'),
    item('imaging', 'Imaging', '0320', 'Imaging technical services', 1, 280000, 'The facility technical component can appear separately from a physician interpretation.', 'Is a separate interpretation claim expected?', true),
    item('pharmacy', 'Pharmacy', '0250', 'Inpatient medications and IV therapy', 1, 420000, 'An invented pharmacy subtotal; outpatient prescriptions after discharge are a different claim and benefit.', 'Are these inpatient administrations, rather than take-home prescriptions?'),
    item('cardiology', 'Cardiology', '0480', 'Cardiac diagnostic facility services', 1, 350000, 'A broad simulated department total, not a quoted echocardiogram price. A specialist can bill professional services separately.', 'Which diagnostic services and dates are included?', true),
    item('therapy', 'Physical therapy', '0420', 'Mobility assessment and therapy', 2, 65000, 'Therapy can inform discharge planning without guaranteeing insurance approval for another facility.', 'What sessions are included, and what remains a separate post-discharge decision?'),
    item('supplies', 'Medical supplies', '0270', 'Medical supply subtotal', 1, 150000, 'A fictional grouping of supplies; the gross charge is not the acquisition cost.', 'Can you provide the details behind this category?'),
  ], benchmarkDrg: '291', illustrativeAllowedCents: 1100000, professionalChargesCents: 320000, professionalAllowedCents: 160000,
  sourceIds: ['cms-inpatient', 'cms-dictionary', 'ipps', 'medicare-costs', 'inpatient-coverage'], limitations: commonLimits,
}, {
  ...pneumonia, id: 'delayed-discharge', title: 'Pneumonia: three more days awaiting a safe discharge', focus: 'The work continues even when a case payment does not increase each day.',
  patient: { name: 'Taylor Fiction', age: 72 }, inpatientDays: 7, dates: { admission: '2026-11-10', discharge: '2026-11-17' },
  comorbidities: ['Chronic lung disease', 'Mobility limitation; fictional circumstances'],
  pathway: [...pneumonia.pathway, 'Additional time coordinating a safe next setting and needed services'],
  timeline: [...pneumonia.timeline.slice(0, 2),
    { day: 'Days 4–6', title: 'Medically improving, discharge still unresolved', detail: 'The team is coordinating support, equipment and a possible accepting facility. Staffing, meals and other resources continue. Coverage of delay days is not automatic and may require notices or review.', departments: ['Room and board', 'Therapy', 'Care coordination'] },
    { day: 'Day 7', title: 'The next organization must be ready', detail: 'An accepting provider, transport and a usable plan are operational requirements. Clinical recommendation, insurance coverage and provider acceptance are separate steps.', departments: ['Care coordination', 'Transport'] },
  ],
  discharge: 'An accepting skilled nursing facility, only after eligibility, coverage, availability and transport have been verified in the fictional pathway.',
  risks: ['Original Medicare SNF coverage has separate criteria; observation time generally does not count toward the qualifying inpatient stay.', 'Not every extra hospital day is covered merely because placement is difficult.', 'Transfer policy, outliers, severity changes and payer contracts can change facility reimbursement.'],
  items: pneumoniaItems.map(line => line.id === 'room' ? { ...line, quantity: 7 } : line).concat([
    item('therapy', 'Physical therapy', '0420', 'Mobility and discharge assessments', 3, 65000, 'Therapy contributes to assessing needs and a safe transition. A recommendation does not reserve a post-acute bed or authorize coverage.', 'Which sessions occurred, and has any post-acute coverage been confirmed?'),
  ]),
  limitations: [...commonLimits, 'This is a counterfactual teaching variant, not a measured length-of-stay cohort. The same $8,000 modeled allowed amount is held fixed only to illustrate case payment; no claim of an actual payment is made.'],
}, {
  id: 'observation', title: 'An overnight observation stay', focus: 'A bed overnight does not establish inpatient status.',
  patient: { name: 'Jordan Demo', age: 67 }, classification: 'observation', inpatientDays: 0,
  dates: { admission: '2026-11-12', discharge: '2026-11-13' }, diagnosis: 'Fictional chest discomfort evaluated without an inpatient admission order',
  comorbidities: ['Hypertension; fictional profile'],
  pathway: ['Emergency assessment and tests', 'Outpatient observation and reassessment', 'Discharge with follow-up if clinically appropriate'],
  timeline: [
    { day: 'Arrival', title: 'Emergency evaluation', detail: 'The patient is evaluated without an inpatient order. A hospital bed and an overnight stay do not by themselves change that status.', departments: ['Emergency department', 'Laboratory', 'Imaging'] },
    { day: 'Overnight', title: 'Observation remains outpatient', detail: 'Observation uses outpatient payment and benefit rules. A MOON notice can explain this classification; ask the team which status applies.', departments: ['Observation', 'Nursing', 'Pharmacy'] },
    { day: 'Next day', title: 'A different coverage path', detail: 'Original Medicare Part A inpatient cost sharing does not apply to this example. Hospital outpatient copayments, packaging and self-administered drug rules need service-level information.', departments: ['Care coordination'] },
  ],
  discharge: 'Home with follow-up; this narrative is not a recommendation for clinical disposition.',
  separateBills: ['Emergency physician', 'Radiologist', 'Other clinicians if involved'],
  risks: ['Original Medicare observation is not a qualifying inpatient day for the usual SNF three-day rule; exceptions and waivers may apply.', 'Self-administered medications in outpatient care can have different coverage.', 'Ask about status, notices and appeal rights rather than inferring status from where the bed was located.'],
  items: [
    item('ed', 'Emergency department', '0450', 'Emergency facility evaluation', 1, 260000, 'A fictional outpatient facility subtotal. Actual outpatient payment uses service-specific classification and packaging, not a Part A admission deductible.', 'Was this processed as outpatient emergency care?', true),
    item('observation', 'Observation', '0762', 'Observation hours', 18, 15000, 'Observation is an outpatient service. The hourly list charge does not establish a separately payable Medicare rate for every hour.', 'What start and stop times support these units?'),
    item('lab', 'Laboratory', '0300', 'Laboratory testing subtotal', 1, 95000, 'This fictional department amount does not model Medicare OPPS packaging or laboratory exceptions.', 'Which tests were billed, and were they packaged with another outpatient service?'),
    item('imaging', 'Imaging', '0320', 'Imaging technical services', 1, 130000, 'A facility component; physician interpretation can arrive in a separate account.', 'Is this the technical component of imaging?', true),
    item('pharmacy', 'Pharmacy', '0250', 'Outpatient medications and supplies', 1, 45000, 'Outpatient drug payment depends on the drug and service. Self-administered drugs can have different rules.', 'Which medicines were self-administered, and what coverage applies?'),
  ], illustrativeAllowedCents: 260000, professionalChargesCents: 110000, professionalAllowedCents: 55000,
  sourceIds: ['inpatient-status', 'medicare-costs', 'eob', 'snf'],
  limitations: [...commonLimits, 'No Original Medicare outpatient facility estimate is supplied: actual OPPS/APC packaging, copayments and drug rules require service-level data. The inpatient aggregate dataset does not benchmark this encounter.'],
}];

export const scenarioGrossCents = (scenario: BillScenario): number => scenario.items.reduce((sum, line) => sum + line.quantity * line.unitChargeCents, 0);
