const base = (process.env.PREMIUM_SMOKE_URL || "http://127.0.0.1:4173").replace(/\/$/, "");
const checks = [
  ["/products/healthcare-worker-benefits-decision-system", 200, "Healthcare Worker Benefits Decision System"],
  ["/products/healthcare-worker-benefits-decision-pack", 200, "Healthcare Worker Benefits Decision System"],
  ["/sign-in", 200, "Secure account"],
  ["/app/benefits-decision", 200, "Access"],
];
const failures = [];
for (const [route, expected, text] of checks) {
  try {
    const response = await fetch(`${base}${route}`, { redirect: "follow" });
    const body = await response.text();
    if (response.status !== expected || !body.includes(text)) failures.push(`${route}: expected ${expected} and ${text}.`);
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
