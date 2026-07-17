import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { ARTICLE_VOICE_NOTES } from "@/data/articleVoiceNotes";
import About from "@/pages/About";
import { MedicationCoverageChecklist } from "@/pages/InsuranceDecisionToolsBundle";
import OutOfPocketMaxEstimatorPage from "@/pages/OutOfPocketMaxEstimatorPage";

const renderPage = (page: React.ReactNode, path: string) => render(
  <MemoryRouter initialEntries={[path]}>{page}</MemoryRouter>,
);

describe("RN insight integration", () => {
  it("presents the founder's actual nursing scope without inventing a broader credential", () => {
    renderPage(<About />, "/about");

    expect(screen.getByText(/admissions, discharge, and transfer nurse widened that view/i)).toBeInTheDocument();
    expect(screen.getByText(/pharmacists, physicians, and case managers/i)).toBeInTheDocument();
    expect(screen.getByText(/do not make me a CFP professional/i)).toBeInTheDocument();
  });

  it("keeps the bedside medication story de-identified and qualified", () => {
    const note = ARTICLE_VOICE_NOTES["deductible-copay-coinsurance-out-of-pocket-max"];

    expect(note.eyebrow).toMatch(/de-identified/i);
    expect(note.body).toMatch(/covered|formulary/i);
    expect(note.body).toMatch(/plan, pharmacist, and prescriber/i);
    expect(note.body).not.toMatch(/\$|front.?load|free for the rest/i);
  });

  it("does not request medication, dose, pharmacy, price, or member details", () => {
    renderPage(<MedicationCoverageChecklist />, "/insurance/medication-coverage-checklist");

    expect(screen.getByText(/CAF does not need a medication name, dose, diagnosis, pharmacy, price, plan name, or member identifier/i)).toBeInTheDocument();
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
    expect(screen.getAllByRole("combobox")).toHaveLength(3);
    expect(screen.getByRole("heading", { name: /medication plan is not complete until access is realistic/i })).toBeInTheDocument();
  });

  it("places the nursing lesson next to the out-of-pocket estimator without making a coverage promise", () => {
    renderPage(<OutOfPocketMaxEstimatorPage />, "/tools/out-of-pocket-max-estimator");

    expect(screen.getByRole("heading", { name: /monthly price does not always explain the full plan-year cost/i })).toBeInTheDocument();
    expect(screen.getByText(/does not confirm drug coverage/i)).toBeInTheDocument();
  });
});
