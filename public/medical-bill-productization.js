(() => {
  "use strict";

  const PRODUCT_ROUTE = "/products/expanded-medical-bill-response-workbook";
  const HUB_ROUTE = "/insurance/medical-bill-review-toolkit";
  const PRODUCT_ID = "expanded_medical_bill_response_workbook";
  const MEDICAL_BILL_ROUTES = new Set([
    HUB_ROUTE,
    "/patients-families",
    "/articles/how-to-read-an-eob",
    "/articles/check-hospital-financial-assistance-before-paying",
    "/articles/facility-fee-vs-professional-fee",
    "/articles/prior-authorization-explained",
    "/articles/what-to-do-before-paying-a-large-medical-bill",
    "/articles/medical-bill-sent-to-collections-what-happens-next",
  ]);

  const cleanPath = () => window.location.pathname.replace(/\/+$/, "") || "/";
  const analyticsAllowed = () => {
    try {
      return window.localStorage.getItem("caf-privacy-consent-v1") === "analytics";
    } catch {
      return false;
    }
  };

  const track = (name, data = {}) => {
    if (!analyticsAllowed()) return;
    const payload = { event_category: "medical_bill_product", ...data };
    if (typeof window.gtag === "function") window.gtag("event", name, payload);
    if (typeof window.va === "function") window.va("event", { name, data: payload });
  };

  const submitEmail = async (form, type, source, message) => {
    const data = new FormData(form);
    const email = String(data.get("email") || "").trim().toLowerCase();
    const firstName = String(data.get("firstName") || "").trim();
    const consent = data.get("consent") === "on";
    const website = String(data.get("website") || "").trim();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      message.textContent = "Enter a valid email address.";
      return;
    }
    if (!consent) {
      message.textContent = "Check the consent box before joining.";
      return;
    }

    const button = form.querySelector("button[type=submit]");
    if (button) button.disabled = true;
    message.textContent = "Saving…";

    try {
      const response = await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, firstName, consent, website, source, type }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || result.ok !== true || result.saved !== true) {
        throw new Error(result.error || "Signup could not be completed.");
      }
      form.reset();
      message.textContent = result.emailDelivered === false
        ? "Your interest was saved. Email delivery is still being finalized."
        : "You are on the early-access list. No payment was collected.";
      track("premium_interest_submit", { source_surface: source, product_id: PRODUCT_ID });
    } catch (error) {
      message.textContent = error instanceof Error ? error.message : "Signup failed. Try again.";
    } finally {
      if (button) button.disabled = false;
    }
  };

  const addStyles = () => {
    if (document.getElementById("caf-product-foundation-styles")) return;
    const style = document.createElement("style");
    style.id = "caf-product-foundation-styles";
    style.textContent = `
      .caf-product-foundation{margin:2.5rem 0;border:1px solid rgba(11,91,66,.24);background:#edf6f0;border-radius:2rem;padding:1.5rem;box-shadow:0 14px 36px rgba(23,59,46,.07);font-family:Inter,Arial,sans-serif;color:#173b2e}
      .caf-product-foundation__grid{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:1.4rem;align-items:center}
      .caf-product-foundation__eyebrow{font-size:.72rem;text-transform:uppercase;letter-spacing:.14em;color:#0b5b42;font-weight:800}
      .caf-product-foundation h2{margin:.6rem 0 0;font-size:clamp(1.5rem,3vw,2.1rem);line-height:1.15}
      .caf-product-foundation p{margin:.75rem 0 0;color:#53645a;line-height:1.65}
      .caf-product-foundation__chips{display:flex;flex-wrap:wrap;gap:.45rem;margin-top:.9rem}
      .caf-product-foundation__chip{border:1px solid #d0dbd4;background:#fff;border-radius:999px;padding:.38rem .68rem;font-size:.75rem;font-weight:700;color:#53645a}
      .caf-product-foundation__button{display:inline-flex;align-items:center;justify-content:center;border-radius:999px;background:#0b5b42;color:#fff;text-decoration:none;font-weight:800;padding:.78rem 1.05rem;white-space:nowrap}
      @media(max-width:760px){.caf-product-foundation__grid{grid-template-columns:1fr}.caf-product-foundation__button{width:100%}}
    `;
    document.head.appendChild(style);
  };

  const createOffer = (path) => {
    const section = document.createElement("section");
    section.className = "caf-product-foundation";
    section.dataset.cafMedicalBillProduct = path;
    section.innerHTML = `
      <div class="caf-product-foundation__grid">
        <div>
          <div class="caf-product-foundation__eyebrow">Free product laboratory</div>
          <h2>Expanded Medical Bill Response Workbook</h2>
          <p>The complete 32-page workbook foundation is built. Community Acquired Finance is validating usefulness and audience demand before considering payment.</p>
          <div class="caf-product-foundation__chips"><span class="caf-product-foundation__chip">No payment</span><span class="caf-product-foundation__chip">Public sample</span><span class="caf-product-foundation__chip">No PHI requested</span></div>
        </div>
        <div><a class="caf-product-foundation__button" href="${PRODUCT_ROUTE}" data-caf-product-link>Preview the foundation →</a><p style="font-size:.75rem;max-width:19rem">Essential guidance and the free Response Pack remain free.</p></div>
      </div>`;
    section.querySelector("[data-caf-product-link]")?.addEventListener("click", () => {
      track("free_to_premium_click", { source_surface: path, product_id: PRODUCT_ID });
    });
    return section;
  };

  const enhanceSpaRoute = () => {
    const path = cleanPath();
    document.querySelectorAll("[data-caf-medical-bill-product]").forEach((node) => {
      if (node.dataset.cafMedicalBillProduct !== path) node.remove();
    });
    if (!MEDICAL_BILL_ROUTES.has(path) || document.querySelector(`[data-caf-medical-bill-product="${path}"]`)) return;
    const main = document.querySelector("main");
    if (!main) return;
    addStyles();
    const target = path.startsWith("/articles/")
      ? document.querySelector("main article") || document.querySelector("main .container") || main
      : document.querySelector("main .container") || main;
    target.appendChild(createOffer(path));
  };

  const configureProductPage = () => {
    if (!document.body.matches("[data-caf-product-page]") || cleanPath() !== PRODUCT_ROUTE) return;
    track("medical_bill_product_view", { product_id: PRODUCT_ID, product_status: "audience_validation" });

    const companion = document.getElementById("browser-companion");
    const counter = document.getElementById("companion-counter");
    const updateCounter = () => {
      const boxes = [...(companion?.querySelectorAll("input[type=checkbox]") || [])];
      const completed = boxes.filter((box) => box.checked).length;
      if (counter) counter.textContent = `${completed} of ${boxes.length} control points documented.`;
    };
    companion?.addEventListener("change", updateCounter);
    document.getElementById("reset-companion")?.addEventListener("click", () => {
      companion?.querySelectorAll("input[type=checkbox]").forEach((box) => { box.checked = false; });
      updateCounter();
    });
    document.getElementById("print-companion")?.addEventListener("click", () => {
      track("print_or_save_action", { action_type: "browser_companion_print" });
      window.print();
    });

    document.querySelectorAll("[data-preview-page], [data-caf-event='premium_product_preview']").forEach((node) => {
      node.addEventListener("click", () => track("premium_product_preview", { product_id: PRODUCT_ID }));
    });

    const form = document.getElementById("medical-bill-product-form");
    const message = document.getElementById("product-form-message");
    form?.addEventListener("submit", (event) => {
      event.preventDefault();
      submitEmail(form, "medical-bill-product-interest", "medical-bill-workbook-product-page", message);
    });
  };

  const run = () => {
    enhanceSpaRoute();
    configureProductPage();
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", run, { once: true });
  else run();
  window.addEventListener("popstate", () => setTimeout(enhanceSpaRoute, 0));
  const pushState = history.pushState;
  history.pushState = function (...args) { pushState.apply(this, args); setTimeout(enhanceSpaRoute, 0); };
  const replaceState = history.replaceState;
  history.replaceState = function (...args) { replaceState.apply(this, args); setTimeout(enhanceSpaRoute, 0); };
})();
