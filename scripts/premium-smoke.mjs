const base = (process.env.PREMIUM_SMOKE_URL || "http://127.0.0.1:4173").replace(/\/$/, "");
const checks = [
  ["/products/healthcare-worker-benefits-decision-system", 200, "A complete benefits decision system—not another disconnected free calculator."],
  ["/products/healthcare-worker-benefits-decision-pack", 200, "A complete benefits decision system—not another disconnected free calculator."],
  ["/sign-in", 200, "Secure account"],
  ["/app/benefits-decision", 200, "Access"],
];
const failures = [];
for (const [route, expected, text] of checks) {
  try {
    const response = await fetch(`${base}${route}`, { redirect: "follow" });
    const body = await response.text();
    if (response.status !== expected || !body.includes(text)) failures.push(`${route}: expected ${expected} and ${text}.`);
    if (route.includes("healthcare-worker-benefits-decision") && !body.includes('content="noindex, nofollow, noarchive"')) {
      failures.push(`${route}: expected noindex, nofollow, noarchive metadata.`);
    }
    if (route.includes("healthcare-worker-benefits-decision") && !body.includes("Premium foundation built")) {
      failures.push(`${route}: expected an honest premium-readiness boundary.`);
    }
    if (route.includes("healthcare-worker-benefits-decision") && !body.includes("Live payment and public paid access remain off")) {
      failures.push(`${route}: expected live commerce to remain explicitly off.`);
    }
    if (route.includes("healthcare-worker-benefits-decision") && /Buy now|Proceed to checkout|card number/i.test(body)) {
      failures.push(`${route}: purchase or payment collection appeared during demand validation.`);
    }
  } catch {
    failures.push(`${route}: request failed.`);
  }
}
try {
  const response = await fetch(`${base}/api/checkout`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: base },
    body: JSON.stringify({ productKey: "healthcare-worker-benefits-decision-system" }),
  });
  const payload = await response.json();
  if (response.status !== 503 || payload.code !== "checkout_disabled") failures.push("/api/checkout must remain disabled.");
} catch {
  failures.push("/api/checkout: request failed.");
}
if (failures.length) {
  console.error("Premium smoke failed:\n");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log(`Premium smoke passed against ${base}.`);
