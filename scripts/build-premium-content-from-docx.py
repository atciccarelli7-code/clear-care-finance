#!/usr/bin/env python3
"""Build the private CAF premium-content JSON from the canonical v3.0 DOCX.

The input and output are private operating artifacts. Store them under
private-product-content/, which is intentionally gitignored.
"""

from __future__ import annotations

import argparse
import json
import re
from pathlib import Path
from typing import Iterable, Union

from docx import Document
from docx.document import Document as DocumentType
from docx.oxml.table import CT_Tbl
from docx.oxml.text.paragraph import CT_P
from docx.table import Table
from docx.text.paragraph import Paragraph

PRODUCT_ID = "healthcare_compensation_benefits_decision_book"
PRODUCT_VERSION = "3.0-web.1"
SOURCE_VERSION = "3.0"
SOURCE_REVIEW_DATE = "2026-07-23"

MODULE_IDS = [
    "pay-structure",
    "total-compensation",
    "medical-insurance",
    "dental-insurance",
    "vision-insurance",
    "hsa-fsa-hra",
    "retirement-plan",
    "retirement-election",
    "pto-leave",
    "protection-elections",
    "schedule-time",
    "repayment-risk",
    "career-fit",
    "integrated-decision",
]

RELATED_MODULES = {
    "pay-structure": ["total-compensation", "schedule-time", "repayment-risk"],
    "total-compensation": ["pay-structure", "medical-insurance", "retirement-plan", "integrated-decision"],
    "medical-insurance": ["hsa-fsa-hra", "total-compensation", "integrated-decision"],
    "dental-insurance": ["vision-insurance", "integrated-decision"],
    "vision-insurance": ["dental-insurance", "integrated-decision"],
    "hsa-fsa-hra": ["medical-insurance", "integrated-decision"],
    "retirement-plan": ["retirement-election", "total-compensation", "integrated-decision"],
    "retirement-election": ["retirement-plan", "integrated-decision"],
    "pto-leave": ["protection-elections", "schedule-time", "integrated-decision"],
    "protection-elections": ["pto-leave", "schedule-time", "integrated-decision"],
    "schedule-time": ["pay-structure", "pto-leave", "career-fit", "integrated-decision"],
    "repayment-risk": ["pay-structure", "career-fit", "integrated-decision"],
    "career-fit": ["schedule-time", "repayment-risk", "integrated-decision"],
    "integrated-decision": ["total-compensation", "medical-insurance", "retirement-plan", "pto-leave", "repayment-risk", "career-fit"],
}

MODULE_SOURCES = {
    "pay-structure": ["dol-flsa", "dol-off-clock"],
    "total-compensation": ["dol-plan-info", "dol-retirement"],
    "medical-insurance": ["healthcare-sbc", "healthcare-costs"],
    "dental-insurance": [],
    "vision-insurance": [],
    "hsa-fsa-hra": ["irs-hsa", "irs-pub15b"],
    "retirement-plan": ["irs-403b", "irs-cola", "dol-retirement"],
    "retirement-election": ["irs-403b", "irs-cola", "dol-retirement"],
    "pto-leave": ["dol-fmla"],
    "protection-elections": ["irs-pub15b"],
    "schedule-time": ["dol-flsa", "dol-off-clock"],
    "repayment-risk": ["irs-pub15b"],
    "career-fit": [],
    "integrated-decision": ["dol-plan-info", "dol-retirement", "healthcare-sbc", "irs-403b"],
}

SOURCES = [
    {"id": "irs-403b", "agency": "Internal Revenue Service", "title": "403(b) contribution limits", "url": "https://www.irs.gov/retirement-plans/plan-participant-employee/retirement-topics-403b-contribution-limits"},
    {"id": "irs-cola", "agency": "Internal Revenue Service", "title": "COLA increases for retirement limitations", "url": "https://www.irs.gov/retirement-plans/cola-increases-for-dollar-limitations-on-benefits-and-contributions"},
    {"id": "irs-hsa", "agency": "Internal Revenue Service", "title": "Revenue Procedure 2025-19 — 2026 HSA and HDHP limits", "url": "https://www.irs.gov/irb/2025-21_IRB"},
    {"id": "irs-pub15b", "agency": "Internal Revenue Service", "title": "Publication 15-B (2026)", "url": "https://www.irs.gov/publications/p15b"},
    {"id": "dol-flsa", "agency": "U.S. Department of Labor", "title": "FLSA overtime Fact Sheet #23", "url": "https://www.dol.gov/agencies/whd/fact-sheets/23-flsa-overtime-pay"},
    {"id": "dol-off-clock", "agency": "U.S. Department of Labor", "title": "Off-the-clock work", "url": "https://www.dol.gov/agencies/whd/flsa/off-the-clock"},
    {"id": "dol-fmla", "agency": "U.S. Department of Labor", "title": "FMLA Fact Sheet #28", "url": "https://www.dol.gov/agencies/whd/fact-sheets/28-fmla"},
    {"id": "healthcare-sbc", "agency": "HealthCare.gov", "title": "Summary of Benefits and Coverage", "url": "https://www.healthcare.gov/health-care-law-protections/summary-of-benefits-and-coverage/"},
    {"id": "healthcare-costs", "agency": "HealthCare.gov", "title": "Your total costs for health care", "url": "https://www.healthcare.gov/choose-a-plan/your-total-costs/"},
    {"id": "dol-plan-info", "agency": "U.S. Department of Labor", "title": "Employee benefit plan information", "url": "https://www.dol.gov/general/topic/health-plans/planinformation"},
    {"id": "dol-retirement", "agency": "U.S. Department of Labor", "title": "Retirement plan guidance", "url": "https://www.dol.gov/general/topic/retirement"},
    {"id": "fsa-pslf", "agency": "Federal Student Aid", "title": "Public Service Loan Forgiveness progress", "url": "https://studentaid.gov/manage-loans/forgiveness-cancellation/public-service"},
]

Block = Union[Paragraph, Table]


def normalize(value: str) -> str:
    return " ".join((value or "").split())


def iter_blocks(document: DocumentType) -> Iterable[Block]:
    for child in document.element.body.iterchildren():
        if isinstance(child, CT_P):
            yield Paragraph(child, document)
        elif isinstance(child, CT_Tbl):
            yield Table(child, document)


def table_matrix(table: Table) -> list[list[str]]:
    return [[normalize(cell.text) for cell in row.cells] for row in table.rows]


def find_paragraph(blocks: list[Block], exact_text: str) -> int:
    for index, block in enumerate(blocks):
        if isinstance(block, Paragraph) and normalize(block.text) == exact_text:
            return index
    raise ValueError(f"Required paragraph not found: {exact_text}")


def first_table_after(blocks: list[Block], index: int) -> Table:
    for block in blocks[index + 1 :]:
        if isinstance(block, Table):
            return block
    raise ValueError(f"Required table not found after block {index}")


def prefixed_table_text(blocks: list[Block], prefix: str) -> str:
    for block in blocks:
        if isinstance(block, Table):
            value = normalize(block.cell(0, 0).text)
            if value.startswith(prefix):
                return value.removeprefix(prefix).strip()
    raise ValueError(f"Required table callout not found: {prefix}")


def build_standard_module(module_id: str, module_blocks: list[Block]) -> dict:
    number = normalize(module_blocks[0].text)  # type: ignore[union-attr]
    header = normalize(module_blocks[1].text)  # type: ignore[union-attr]
    part = header.split("/", 1)[1].strip().title()
    title = normalize(module_blocks[2].text)  # type: ignore[union-attr]
    purpose = normalize(module_blocks[3].text)  # type: ignore[union-attr]
    orientation = prefixed_table_text(module_blocks, "THIS MODULE CONTROLS")

    questions_position = find_paragraph(module_blocks, "Three questions that frame the decision")
    questions = [row[0] for row in table_matrix(first_table_after(module_blocks, questions_position))[1:] if row and row[0]]

    comparison_position = next(
        index
        for index, block in enumerate(module_blocks)
        if isinstance(block, Paragraph) and normalize(block.text).startswith("Compare: ")
    )
    comparison_fields = [row[0] for row in table_matrix(first_table_after(module_blocks, comparison_position))[1:] if row and row[0]]

    close_position = find_paragraph(module_blocks, "Close the module")
    actions: list[str] = []
    for block in module_blocks[close_position + 1 :]:
        if isinstance(block, Paragraph):
            text = normalize(block.text)
            if text == "Copy-ready questions":
                break
            if text:
                actions.append(text)
        elif actions:
            break

    questions_position = find_paragraph(module_blocks, "Copy-ready questions")
    professional_questions = [
        normalize(block.text)
        for block in module_blocks[questions_position + 1 :]
        if isinstance(block, Paragraph) and normalize(block.text)
    ][:3]

    completion = prefixed_table_text(module_blocks, "COMPLETE THIS MODULE WHEN")

    return {
        "id": module_id,
        "number": number,
        "part": part,
        "title": title,
        "purpose": purpose,
        "orientation": orientation,
        "framingQuestions": questions,
        "comparisonFields": comparison_fields,
        "actions": actions,
        "professionalQuestions": professional_questions,
        "completionCriteria": [completion],
        "relatedModuleIds": RELATED_MODULES[module_id],
        "sourceIds": MODULE_SOURCES[module_id],
    }


def build_integrated_module(module_blocks: list[Block]) -> dict:
    election_table = next(
        block
        for block in module_blocks
        if isinstance(block, Table) and table_matrix(block)[0][0] == "Election"
    )
    comparison_fields = [row[0] for row in table_matrix(election_table)[1:] if row and row[0]]
    board_rule = prefixed_table_text(module_blocks, "BOARD RULE")
    decision_ready = prefixed_table_text(module_blocks, "DECISION-READY STANDARD")

    return {
        "id": "integrated-decision",
        "number": "14",
        "part": "Integrated Decision",
        "title": "My healthcare compensation & benefits elections",
        "purpose": "Bring every applicable choice, reason, source, confidence label, unresolved fact, and review date into one calm decision record.",
        "orientation": f"{board_rule} {decision_ready}",
        "framingQuestions": [
            "What was selected in each applicable module?",
            "Which facts and tradeoffs were decisive?",
            "What must still be verified, completed, monitored, or reviewed?",
        ],
        "comparisonFields": comparison_fields,
        "actions": [
            "Tie every applicable election to the controlling source, the next review date or trigger, and any decision-changing open fact.",
            "A decision is more durable when the buyer knows which facts still matter and what would change the answer.",
            "A good choice can still fail during implementation. Verify the transition before irreversible action.",
        ],
        "professionalQuestions": [
            "Please confirm all contingencies, benefits effective dates, payroll setup deadlines, and written conditions before resignation.",
            "Please confirm the exact job title, FTE, exempt or nonexempt status, department, manager, location, and anticipated start date.",
            "Please confirm the base rate or salary, scheduled hours, paid weeks, and first eligible pay period.",
        ],
        "completionCriteria": [decision_ready],
        "relatedModuleIds": RELATED_MODULES["integrated-decision"],
        "sourceIds": MODULE_SOURCES["integrated-decision"],
    }


def build_product(source_path: Path) -> dict:
    document = Document(source_path)
    blocks = list(iter_blocks(document))
    module_starts = [
        index
        for index, block in enumerate(blocks)
        if isinstance(block, Paragraph) and re.fullmatch(r"\d{2}", normalize(block.text))
    ]
    if len(module_starts) != 14:
        raise ValueError(f"Expected fourteen module starts; found {len(module_starts)}")

    modules = []
    for index, module_id in enumerate(MODULE_IDS[:13]):
        modules.append(build_standard_module(module_id, blocks[module_starts[index] : module_starts[index + 1]]))
    modules.append(build_integrated_module(blocks[module_starts[13] :]))

    if [module["id"] for module in modules] != MODULE_IDS:
        raise ValueError("Module order does not match the premium contract")

    return {
        "id": PRODUCT_ID,
        "name": "Healthcare Compensation & Benefits Decision Workspace",
        "sourceEditionName": "Healthcare Compensation & Benefits Decision Book",
        "version": PRODUCT_VERSION,
        "sourceVersion": SOURCE_VERSION,
        "sourceReviewDate": SOURCE_REVIEW_DATE,
        "publishedAt": SOURCE_REVIEW_DATE,
        "audience": "Healthcare professionals evaluating pay, insurance, retirement, time, and employment risk.",
        "outcome": "A documented compensation and benefits decision that explains what was selected, why it was selected, what remains uncertain, and when it will be reviewed.",
        "purchaseModel": {
            "type": "one_time",
            "automaticRenewal": False,
            "access": "Continued access to the purchased edition while the service remains available.",
            "updates": "Twelve months of substantive product updates from the verified purchase date.",
            "ads": False,
        },
        "privacy": {
            "savedToAccount": ["module completion", "last viewed module", "generic task completion", "product version"],
            "keptInBrowser": ["calculator inputs", "free-text notes", "draft comparisons", "personalized print content until the user prints or saves it"],
            "prohibited": ["Social Security numbers", "account or member IDs", "banking credentials", "medical records", "insurance portal credentials", "beneficiary details", "unnecessary health information"],
        },
        "modules": modules,
        "sources": SOURCES,
        "updateHistory": [
            {"version": PRODUCT_VERSION, "date": SOURCE_REVIEW_DATE, "type": "substantive", "summary": "Converted the canonical v3.0 private-client decision book into a secure modular workspace with account progress, source library, and print-ready decision records."},
            {"version": SOURCE_VERSION, "date": SOURCE_REVIEW_DATE, "type": "source edition", "summary": "Expanded the healthcare compensation and benefits system to fourteen modular decisions and an integrated election board."},
        ],
        "limitation": "Educational decision support only. The workspace does not provide individualized financial, legal, tax, employment, insurance, investment, or medical advice; determine eligibility or coverage; interpret controlling documents; or guarantee outcomes.",
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("source_docx", type=Path)
    parser.add_argument("output_json", type=Path)
    args = parser.parse_args()

    if not args.source_docx.exists():
        raise SystemExit(f"Source DOCX not found: {args.source_docx}")
    args.output_json.parent.mkdir(parents=True, exist_ok=True)
    product = build_product(args.source_docx)
    args.output_json.write_text(json.dumps(product, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Built {args.output_json} from {args.source_docx}")
    print(f"Product: {product['id']} / {product['version']} / {len(product['modules'])} modules")
    print("The generated file is private and must not be committed.")


if __name__ == "__main__":
    main()
