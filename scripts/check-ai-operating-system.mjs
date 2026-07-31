import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (relativePath) =>
  fs.readFileSync(path.join(root, relativePath), 'utf8');
const exists = (relativePath) => fs.existsSync(path.join(root, relativePath));

const errors = [];
const requiredFiles = [
  'AGENTS.md',
  'docs/ai/MASTER_WORK_PROMPT.md',
  'docs/ai/ROLE_QUORUM.md',
  'docs/ai/ROLE_REGISTRY.json',
  'docs/ai/PROJECT_CONTEXT.md',
  'docs/ai/DECISION_LEDGER.md',
  'docs/ai/EVIDENCE_LEDGER.md',
  'docs/ai/WORK_LEDGER.md',
  'docs/ai/WORK_PACKET_TEMPLATE.md',
  'docs/ai/COMPOUNDING_LOOP.md',
  'docs/ai/EXECUTIVE_OPERATING_SYSTEM.md',
  'docs/ai/EXECUTIVE_DECISION_REVIEW_TEMPLATE.md',
  '.github/pull_request_template.md',
];

for (const file of requiredFiles) {
  if (!exists(file)) errors.push(`Missing required AI operating-system file: ${file}`);
}

if (errors.length === 0) {
  const registry = JSON.parse(read('docs/ai/ROLE_REGISTRY.json'));
  const roles = registry.roles;

  if (!Array.isArray(roles) || roles.length < 22) {
    errors.push(`ROLE_REGISTRY.json must define at least 22 roles; found ${roles?.length ?? 0}`);
  } else {
    const ids = new Set();
    const paths = new Set();
    const agents = read('AGENTS.md');
    const quorum = read('docs/ai/ROLE_QUORUM.md');
    const workPacket = read('docs/ai/WORK_PACKET_TEMPLATE.md');

    for (const role of roles) {
      if (!role.id || !role.label || !role.path || !role.phase || !role.participation) {
        errors.push(`Role is missing required fields: ${JSON.stringify(role)}`);
        continue;
      }
      if (ids.has(role.id)) errors.push(`Duplicate role id: ${role.id}`);
      if (paths.has(role.path)) errors.push(`Duplicate role path: ${role.path}`);
      ids.add(role.id);
      paths.add(role.path);

      if (!exists(role.path)) {
        errors.push(`Registered skill file does not exist: ${role.path}`);
        continue;
      }

      const skill = read(role.path);
      if (!skill.includes(`name: ${role.id}`)) {
        errors.push(`Skill frontmatter name does not match registry id: ${role.path}`);
      }
      if (!/^## Completion (test|gate)$/m.test(skill)) {
        errors.push(`Skill lacks a completion test or completion gate: ${role.path}`);
      }
      if (!agents.includes(role.path)) {
        errors.push(`AGENTS.md does not register skill path: ${role.path}`);
      }
      if (!quorum.toLowerCase().includes(role.label.toLowerCase())) {
        errors.push(`ROLE_QUORUM.md does not name registered role: ${role.label}`);
      }
      if (!workPacket.toLowerCase().includes(role.label.toLowerCase())) {
        errors.push(`WORK_PACKET_TEMPLATE.md does not include role: ${role.label}`);
      }
    }
  }

  const agents = read('AGENTS.md');
  const master = read('docs/ai/MASTER_WORK_PROMPT.md');
  const executive = read('docs/ai/EXECUTIVE_OPERATING_SYSTEM.md');
  const executiveTemplate = read('docs/ai/EXECUTIVE_DECISION_REVIEW_TEMPLATE.md');
  const workPacket = read('docs/ai/WORK_PACKET_TEMPLATE.md');
  const packageJson = JSON.parse(read('package.json'));
  const requiredReferences = [
    'docs/ai/ROLE_REGISTRY.json',
    'docs/ai/PROJECT_CONTEXT.md',
    'docs/ai/DECISION_LEDGER.md',
    'docs/ai/EVIDENCE_LEDGER.md',
    'docs/ai/WORK_LEDGER.md',
    'docs/ai/WORK_PACKET_TEMPLATE.md',
    'docs/ai/COMPOUNDING_LOOP.md',
    'docs/ai/EXECUTIVE_OPERATING_SYSTEM.md',
    'docs/ai/EXECUTIVE_DECISION_REVIEW_TEMPLATE.md',
  ];

  for (const reference of requiredReferences) {
    if (!agents.includes(reference)) {
      errors.push(`AGENTS.md does not reference required operating artifact: ${reference}`);
    }
    if (!master.includes(reference)) {
      errors.push(`MASTER_WORK_PROMPT.md does not reference required operating artifact: ${reference}`);
    }
  }

  const requiredExecutivePhrases = [
    'Inherited-decision challenge gate',
    'Quantified-impact requirement',
    'Anomaly detection',
    'Separate technical and business validation',
    'Chief Financial Officer',
    'Chief Operating Officer',
    'Chief Data and Analytics Officer',
    'Adversarial Red Team',
    'Absence from one record is not proof',
  ];

  for (const phrase of requiredExecutivePhrases) {
    if (!executive.includes(phrase)) {
      errors.push(`EXECUTIVE_OPERATING_SYSTEM.md is missing required control: ${phrase}`);
    }
  }

  const requiredTemplatePhrases = [
    'Always provide numerator and denominator',
    'Changes more than 20% of a major site surface',
    'Technical validation',
    'Business validation',
    'What did not change',
    'Single highest-value next action',
  ];

  for (const phrase of requiredTemplatePhrases) {
    if (!executiveTemplate.includes(phrase)) {
      errors.push(`EXECUTIVE_DECISION_REVIEW_TEMPLATE.md is missing required control: ${phrase}`);
    }
    if (!workPacket.includes(phrase)) {
      errors.push(`WORK_PACKET_TEMPLATE.md is missing required executive control: ${phrase}`);
    }
  }

  const executivePerspectives = [
    'Chief Executive / Strategy',
    'Chief Operating Officer',
    'Chief Financial Officer',
    'Chief Revenue Officer',
    'Chief Product Officer',
    'Chief Technology Officer',
    'Chief Data and Analytics Officer',
    'Chief Marketing and Discovery Officer',
    'Editorial and Evidence Officer',
    'Healthcare User and Clinical Context Officer',
    'Privacy, Legal, and User Protection Officer',
    'Accessibility and Reliability Officer',
    'Quality and Release Officer',
    'Adversarial Red Team',
    'Process Improvement Officer',
  ];

  for (const perspective of executivePerspectives) {
    if (!executive.includes(perspective)) {
      errors.push(`EXECUTIVE_OPERATING_SYSTEM.md does not name executive perspective: ${perspective}`);
    }
    if (!workPacket.includes(perspective)) {
      errors.push(`WORK_PACKET_TEMPLATE.md does not include executive perspective: ${perspective}`);
    }
  }

  if (!agents.includes('Technical validation and business validation are separate release decisions')) {
    errors.push('AGENTS.md must require separate technical and business validation');
  }
  if (!master.includes('A passing build does not imply a passing business decision')) {
    errors.push('MASTER_WORK_PROMPT.md must distinguish technical from business validation');
  }
  if (!agents.includes('absence from one registry as proof')) {
    errors.push('AGENTS.md must prohibit treating registry absence as proof that work was absent');
  }

  if (packageJson.scripts?.['ai:governance-check'] !== 'node scripts/check-ai-operating-system.mjs') {
    errors.push('package.json must define ai:governance-check');
  }
}

if (errors.length > 0) {
  console.error('AI operating-system governance check failed:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('AI operating-system governance check passed.');
