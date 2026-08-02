from pathlib import Path

script_path = Path("scripts/apply-patient-cost-share-ledgers.py")
source = script_path.read_text(encoding="utf-8")
old = 'insert_before("docs/ai/WORK_LEDGER.md", "\\n## Usage rules\\n", work, "CAF-W-009")'
new = 'insert_before("docs/ai/WORK_LEDGER.md", "\\n### CAF-W-001", work, "CAF-W-009")'

if old not in source:
    raise SystemExit("Expected work-ledger insertion call was not found")

exec(compile(source.replace(old, new, 1), str(script_path), "exec"))
