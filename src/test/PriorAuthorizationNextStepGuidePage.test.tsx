import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import PriorAuthorizationNextStepGuidePage from "@/pages/PriorAuthorizationNextStepGuidePage";

const clickContinue = () => fireEvent.click(screen.getByRole("button", { name: /continue/i }));

describe("PriorAuthorizationNextStepGuidePage", () => {
  it("keeps continue disabled until the current question is answered", () => {
    render(
      <MemoryRouter>
        <PriorAuthorizationNextStepGuidePage />
      </MemoryRouter>,
    );

    expect(screen.getByRole("button", { name: /continue/i })).toBeDisabled();
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow");
    expect(screen.getByText(/answers stay in this browser session/i)).toBeInTheDocument();
  });

  it("skips the pending-duration question and produces an expedited Medicare Advantage pathway", () => {
    render(
      <MemoryRouter>
        <PriorAuthorizationNextStepGuidePage />
      </MemoryRouter>,
    );

    const choices = [
      /Medicare Advantage A private Medicare plan/i,
      /Procedure or surgery An outpatient procedure/i,
      /Denied in writing A letter/i,
      /Delay could seriously jeopardize life/i,
      /Yes Keep every page/i,
      /Medical necessity or coverage criteria/i,
      /Peer-to-peer offered or scheduled/i,
      /No, the service is still upcoming/i,
    ];

    choices.forEach((choice, index) => {
      fireEvent.click(screen.getByRole("button", { name: choice }));
      if (index < choices.length - 1) clickContinue();
    });

    expect(screen.queryByRole("heading", { name: /How long has the complete request been pending/i })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /build my next steps/i }));

    expect(screen.getByRole("heading", { name: /formal denial and expedited review question may apply/i })).toBeInTheDocument();
    expect(screen.getByText(/Do this first/i)).toBeInTheDocument();
    expect(screen.getByText(/65 days/i)).toBeInTheDocument();
    expect(screen.getByText(/72-hour decision timeframe/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /copy action plan/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /print/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /review answers/i })).toBeInTheDocument();
  });
});
