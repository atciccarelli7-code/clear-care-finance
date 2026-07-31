import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { PrivateStudentLoanPayoffCalculator } from "@/components/calculators/PrivateStudentLoanPayoffCalculator";
import { loadStoredNavigatorPlan } from "@/lib/financialNavigator";

const renderCalculator = () => render(<MemoryRouter initialEntries={["/tools/private-student-loan-payoff-calculator"]}><PrivateStudentLoanPayoffCalculator /></MemoryRouter>);

const choosePrivate = () => fireEvent.change(screen.getByLabelText("Which loans are included?"), { target: { value: "private" } });

const fillCurrentPlan = ({ payment = "525", extra = "0" } = {}) => {
  fireEvent.change(screen.getByLabelText("Current principal balance"), { target: { value: "45000" } });
  fireEvent.change(screen.getByLabelText("Current APR"), { target: { value: "9" } });
  fireEvent.change(screen.getByLabelText("Current remaining term"), { target: { value: "138" } });
  fireEvent.change(screen.getByLabelText("Current monthly payment"), { target: { value: payment } });
  fireEvent.change(screen.getByLabelText("Optional additional monthly payment"), { target: { value: extra } });
};

describe("PrivateStudentLoanPayoffCalculator", () => {
  beforeEach(() => {
    window.localStorage.clear();
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText: vi.fn().mockResolvedValue(undefined) },
    });
    Object.defineProperty(window, "print", { configurable: true, value: vi.fn() });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    window.localStorage.clear();
  });

  it("starts with a loan-type gate and no assumed financial result", () => {
    renderCalculator();
    expect(screen.getByRole("heading", { name: /verify the loan type first/i })).toBeInTheDocument();
    expect(screen.queryByLabelText("Current principal balance")).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: /decision outcome/i })).not.toBeInTheDocument();
    expect(screen.getByText(/do not enter lender names, account numbers/i)).toBeInTheDocument();
  });

  it.each([
    ["federal", /You identified federal loans/i],
    ["mixed", /mix of federal and private loans/i],
    ["uncertain", /loan type is uncertain/i],
  ])("keeps %s debt in verification and omits commercial solicitation", (loanType, reason) => {
    renderCalculator();
    fireEvent.change(screen.getByLabelText("Which loans are included?"), { target: { value: loanType } });
    fireEvent.click(screen.getByRole("button", { name: /show verification steps/i }));
    expect(screen.getByRole("heading", { name: "Verify loan type first" })).toBeInTheDocument();
    expect(screen.getAllByText(reason).length).toBeGreaterThan(0);
    expect(screen.getByRole("link", { name: /check federal loan records/i })).toHaveAttribute("href", "https://studentaid.gov/dashboard/");
    expect(screen.queryByText(/optional commercial path/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/partner comparison/i)).not.toBeInTheDocument();
  });

  it("produces a deliberate current-plan outcome with associated inputs", () => {
    renderCalculator();
    choosePrivate();
    fillCurrentPlan();
    fireEvent.click(screen.getByRole("button", { name: /build decision outcome/i }));
    expect(screen.getByRole("heading", { name: "Continue current plan" })).toBeInTheDocument();
    expect(screen.getAllByText("11 yr 6 mo")).toHaveLength(2);
    expect(screen.getByText("$27,344")).toBeInTheDocument();
    expect(screen.getByText(/generated/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /copy decision summary/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /print or save as pdf/i })).toBeInTheDocument();
    expect(screen.getByRole("region", { name: /assumptions used/i })).toHaveTextContent("Confirmed private loans only");
    expect(screen.getByRole("region", { name: /assumptions used/i })).toHaveTextContent("Current principal");
  });

  it("shows validation errors instead of clamping malformed inputs", () => {
    renderCalculator();
    choosePrivate();
    fillCurrentPlan({ payment: "0" });
    fireEvent.change(screen.getByLabelText("Current principal balance"), { target: { value: "-1" } });
    fireEvent.click(screen.getByRole("button", { name: /build decision outcome/i }));
    expect(screen.getByRole("heading", { name: "Insufficient information" })).toBeInTheDocument();
    expect(screen.getByLabelText("Current principal balance")).toHaveAttribute("aria-invalid", "true");
    expect(screen.getAllByText(/Enter a balance greater than \$0/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Enter a current payment greater than \$0/i).length).toBeGreaterThan(0);
  });

  it("labels a lower-payment, longer, higher-cost quote explicitly", () => {
    renderCalculator();
    choosePrivate();
    fillCurrentPlan();
    fireEvent.change(screen.getByLabelText("Refinance comparison"), { target: { value: "compare" } });
    fireEvent.change(screen.getByLabelText("Quoted APR"), { target: { value: "8.5" } });
    fireEvent.change(screen.getByLabelText("Quoted refinance term"), { target: { value: "240" } });
    fireEvent.change(screen.getByLabelText("Lender or origination fees"), { target: { value: "0" } });
    fireEvent.click(screen.getByRole("button", { name: /build decision outcome/i }));
    expect(screen.getByRole("heading", { name: "Lower payment, but higher total cost" })).toBeInTheDocument();
    expect(screen.getByText(/monthly-payment relief and total-cost savings are different decisions/i)).toBeInTheDocument();
    expect(screen.getByText("Total repayment with fees")).toBeInTheDocument();
    expect(screen.getByText("Term difference")).toBeInTheDocument();
    expect(screen.getByRole("region", { name: /assumptions used/i })).toHaveTextContent("Quoted APR8.50%");
    expect(screen.getByRole("region", { name: /assumptions used/i })).toHaveTextContent("Quoted term20 yr");
    expect(screen.getByRole("region", { name: /assumptions used/i })).toHaveTextContent("Quoted fees$0");
  });

  it("rejects a higher-rate quote and keeps commercial configuration inactive", () => {
    renderCalculator();
    choosePrivate();
    fillCurrentPlan({ extra: "250" });
    fireEvent.change(screen.getByLabelText("Refinance comparison"), { target: { value: "compare" } });
    fireEvent.change(screen.getByLabelText("Quoted APR"), { target: { value: "12" } });
    fireEvent.change(screen.getByLabelText("Quoted refinance term"), { target: { value: "84" } });
    fireEvent.click(screen.getByRole("button", { name: /build decision outcome/i }));
    expect(screen.getByRole("heading", { name: "Do not refinance based on this quote" })).toBeInTheDocument();
    expect(screen.getByText(/increases estimated financing cost/i)).toBeInTheDocument();
    expect(screen.queryByText(/optional commercial path/i)).not.toBeInTheDocument();
  });

  it("copies the complete portable summary and invokes native print", async () => {
    renderCalculator();
    choosePrivate();
    fillCurrentPlan({ extra: "250" });
    fireEvent.click(screen.getByRole("button", { name: /build decision outcome/i }));
    fireEvent.click(screen.getByRole("button", { name: /copy decision summary/i }));
    await waitFor(() => expect(navigator.clipboard.writeText).toHaveBeenCalledTimes(1));
    const summary = vi.mocked(navigator.clipboard.writeText).mock.calls[0][0];
    expect(summary).toContain("Current principal: $45,000");
    expect(summary).toContain("RECOMMENDATION STATE: Accelerate repayment");
    expect(summary).toContain("Educational estimate only");
    fireEvent.click(screen.getByRole("button", { name: /print or save as pdf/i }));
    expect(window.print).toHaveBeenCalledTimes(1);
  });

  it("saves only the fixed student-loan action to My Plan", () => {
    renderCalculator();
    choosePrivate();
    fillCurrentPlan({ extra: "250" });
    fireEvent.click(screen.getByRole("button", { name: /build decision outcome/i }));
    fireEvent.click(screen.getByRole("button", { name: "Add this action" }));
    const plan = loadStoredNavigatorPlan();
    expect(plan?.actionIds).toContain("wealth_student_loans");
    expect(JSON.stringify(plan)).not.toMatch(/45000|\b9\b|525|250|principal|apr|payment|quote|fee/i);
  });

  it("restarts without retaining assumptions", () => {
    renderCalculator();
    choosePrivate();
    fillCurrentPlan();
    fireEvent.click(screen.getByRole("button", { name: /build decision outcome/i }));
    fireEvent.click(screen.getByRole("button", { name: /restart/i }));
    expect(screen.getByLabelText("Which loans are included?")).toHaveValue("uncertain");
    expect(screen.queryByLabelText("Current principal balance")).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Continue current plan" })).not.toBeInTheDocument();
  });
});
