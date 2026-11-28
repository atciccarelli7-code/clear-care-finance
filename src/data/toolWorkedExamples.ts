type ToolWorkedExample = {
  title: string;
  example: string;
  check: string;
  next: { label: string; href: string };
  source?: { label: string; href: string };
};

export const toolWorkedExamples: Partial<Record<string, ToolWorkedExample>> = {
  "health-insurance-visit-cost-calculator": {
    title: "How a $500 allowed charge can leave you with $260",
    example: "Say an in-network service has a $500 allowed amount, $200 left on your deductible, and 20% coinsurance. You pay the first $200 and then $60 of the remaining $300, for $260. This example assumes no separate copay and that the out-of-pocket limit has not been reached.",
    check: "Before a visit, ask the plan which rate applies and how much of your deductible remains. After the visit, compare the provider bill with the processed explanation of benefits for the same service.",
    next: { label: "Compare your bill with your EOB", href: "/tools/eob-to-bill-match-checker" },
    source: { label: "HealthCare.gov deductible definition and example", href: "https://www.healthcare.gov/glossary/deductible/" },
  },
  "student-loan-payment-calculator": {
    title: "What a lower monthly payment can cost over time",
    example: "For a hypothetical $20,000 loan at 6% fixed interest and no fees, paying over 10 years costs about $222 a month and $6,645 in total interest. Stretching to 15 years lowers the payment to about $169 a month and raises total interest to about $10,379.",
    check: "Compare the payment with what you bring home in a month without overtime. If you have federal loans, check repayment options and possible forgiveness separately before using a fixed-payment comparison to make a decision.",
    next: { label: "Review your student loan options", href: "/student-loans" },
    source: { label: "Federal Student Aid Loan Simulator", href: "https://studentaid.gov/repayment-calculator/" },
  },
  "hospital-cafe-savings-calculator": {
    title: "Keep one cafe meal and see what two swaps save",
    example: "If you work three shifts a week, keep one $12 cafe meal and bring a $7 meal for each of the other two shifts. Enter $12 for the cafe meal, $7 for the packed meal and two shifts per week to price the swaps. That is $10 a week, or $520 over 52 weeks at the same schedule.",
    check: "Try the swap over two pay periods. Include groceries, drinks and the shifts when you buy a meal anyway so your estimate reflects what you actually spend.",
    next: { label: "Read the hospital cafe spending guide", href: "/articles/hospital-cafe-habit" },
  },
};
