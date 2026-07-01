import * as React from "react";

interface HealthcareWorkerMoneyMapEmailProps {
  firstName?: string;
}

const baseUrl = "https://communityacquiredfinance.com";

export function HealthcareWorkerMoneyMapEmail({ firstName }: HealthcareWorkerMoneyMapEmailProps) {
  const greeting = firstName?.trim() ? `Hi ${firstName.trim()},` : "Hi,";

  return (
    <div style={{ fontFamily: "Arial, sans-serif", color: "#183326", lineHeight: 1.55, maxWidth: "640px" }}>
      <p>{greeting}</p>

      <h1 style={{ color: "#004022", fontSize: "28px", lineHeight: 1.2 }}>Your Healthcare Worker Money Map</h1>

      <p>
        Thanks for signing up for Community Acquired Finance. This is a plain-English starting point for organizing the
        money decisions that show up around healthcare work: paychecks, benefits, insurance, debt, cash flow, and investing.
      </p>

      <ol>
        <li>Build a cash buffer before over-optimizing.</li>
        <li>Get the employer retirement match when available.</li>
        <li>Compare Roth vs Traditional contributions before assuming one is best.</li>
        <li>Understand HSA and FSA tradeoffs during open enrollment.</li>
        <li>Separate federal student loan strategies from private loan payoff decisions.</li>
        <li>Compare health insurance by total risk, not only premium.</li>
        <li>Keep investing simple enough to sustain during stressful work seasons.</li>
        <li>Protect yourself from burnout-driven financial decisions.</li>
      </ol>

      <p>
        Start here: <a href={`${baseUrl}/healthcare-workers`} style={{ color: "#005c38", fontWeight: 700 }}>Healthcare Worker Money Hub</a>
      </p>

      <p>
        Useful tools: <a href={`${baseUrl}/tools`} style={{ color: "#005c38", fontWeight: 700 }}>Community Acquired Finance calculators</a>
      </p>

      <hr style={{ border: 0, borderTop: "1px solid #d8ded3", margin: "24px 0" }} />

      <p style={{ color: "#53645a", fontSize: "13px" }}>
        Educational only. This email is not individualized financial, legal, tax, insurance, investment, or medical advice.
      </p>
    </div>
  );
}
