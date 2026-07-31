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
      if (!skill.includes('## Completion test')) {
        errors.push(`Skill lacks a completion test: ${role.path}`);
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
  const packageJson = JSON.parse(read('package.json'));
  const requiredReferences = [
    'docs/ai/ROLE_REGISTRY.json',
    'docs/ai/PROJECT_CONTEXT.md',
    'docs/ai/DECISION_LEDGER.md',
    'docs/ai/EVIDENCE_LEDGER.md',
    'docs/ai/WORK_LEDGER.md',
    'docs/ai/WORK_PACKET_TEMPLATE.md',
    'docs/ai/COMPOUNDING_LOOP.md',
  ];

  for (const reference of requiredReferences) {
    if (!agents.includes(reference)) {
      errors.push(`AGENTS.md does not reference required operating artifact: ${reference}`);
    }
    if (!master.includes(reference)) {
      errors.push(`MASTER_WORK_PROMPT.md does not reference required operating artifact: ${reference}`);
    }
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
