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

  const cleanPath = () => {
    const path = window.location.pathname.replace(/\/+$/, "");
    return path || "/";
  };

  const analyticsAllowed = () => {
    try {
      return window.localStorage.getItem("caf-privacy-consent-v1") === "analytics";
    } catch {
      return false;
    }
  };

  const track = (name, parameters = {}) => {
    if (!analyticsAllowed()) return;
    const payload = { event_category: "medical_bill_product", ...parameters };
    if (typeof window.gtag === "function") window.gtag("event", name, payload);
    if (typeof window.va === "function") window.va("event", { name, data: payload });
  };

  const addStyles = () => {
    if (document.getElementById("caf-productization-spa-styles")) return;
    const style = document.createElement("style");
    style.id = "caf-productization-spa-styles";
    style.textContent = `
      .caf-product-offer{margin:2.5rem 0;border:1px solid rgba(11,91,66,.24);background:#edf6f0;border-radius:2rem;padding:1.5rem;box-shadow:0 14px 36px rgba(23,59,46,.07);font-family:Inter,Arial,sans-serif;color:#173b2e}
      .caf-product-offer__grid{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:1.5rem;align-items:center}
      .caf-product-offer__eyebrow{font-size:.72rem;text-transform:uppercase;letter-spacing:.14em;color:#0b5b42;font-weight:800}
      .caf-product-offer h2{margin:.6rem 0 0;font-family:"Plus Jakarta Sans",Inter,sans-serif;font-size:clamp(1.55rem,3vw,2.15rem);line-height:1.15}
      .caf-product-offer p{margin:.75rem 0 0;color:#53645a;line-height:1.65}
      .caf-product-offer__chips{display:flex;flex-wrap:wrap;gap:.45rem;margin-top:.9rem}
      .caf-product-offer__chip{border:1px solid #d0dbd4;background:#fff;border-radius:999px;padding:.38rem .68rem;font-size:.75rem;font-weight:700;color:#53645a}
      .caf-product-offer__button{display:inline-flex;align-items:center;justify-content:center;border-radius:999px;background:#0b5b42;color:#fff;text-decoration:none;font-weight:800;padding:.78rem 1.05rem;white-space:nowrap}
      .caf-product-offer__small{font-size:.75rem!important;max-width:20rem}
      .caf-email-panel{margin-top:1.1rem;border-top:1px solid #cbdad0;padding-top:1rem;display:grid;gap:.7rem}
      .caf-email-panel__row{display:grid;grid-template-columns:1fr 1.4fr;gap:.65rem}
      .caf-email-panel input[type=text],.caf-email-panel input[type=email]{width:100%;border:1px solid #c7d4cb;border-radius:.75rem;padding:.7rem .75rem;font:inherit;background:#fff}
      .caf-email-panel label{font-size:.76rem;color:#53645a;display:flex;gap:.45rem;align-items:flex-start}
      .caf-email-panel button{border:0;border-radius:999px;background:#0b5b42;color:#fff;font-weight:800;padding:.75rem 1rem;cursor:pointer}
      .caf-email-panel button:disabled{opacity:.65;cursor:wait}
      .caf-email-panel__message{min-height:1.25rem;font-size:.78rem;font-weight:700;color:#0b5b42}
      @media(max-width:760px){.caf-product-offer__grid{grid-template-columns:1fr}.caf-product-offer__button{width:100%}.caf-email-panel__row{grid-template-columns:1fr}}
    `;
    document.head.appendChild(style);
  };

  const submitEmail = async (form, messageElement) => {
    const data = new FormData(form);
    const email = String(data.get("email") || "").trim().toLowerCase();
    const firstName = String(data.get("firstName") || "").trim();
    const consent = data.get("consent") === "on";
    const website = String(data.get("website") || "").trim();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      messageElement.textContent = "Enter a valid email address.";
      return;
    }
    if (!consent) {
      messageElement.textContent = "Check the consent box before signing up.";
      return;
    }

    const button = form.querySelector("button[type=submit]");
    if (button) button.disabled = true;
    messageElement.textContent = "Saving...";

    try {
      const response = await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          firstName,
          consent,
          website,
          source: "medical-bill-response-system",
          type: "medical-bill-sequence",
        }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || result.ok !== true || result.saved !== true) {
        throw new Error(result.error || "Signup could not be completed.");
      }
      form.reset();
      messageElement.textContent = result.emailDelivered === false
        ? "Your signup was saved. Email delivery is still pending sender verification."
        : "You are on the medical-bill list. Check your inbox for the first response email.";
      track("free_pack_email_signup", { source_surface: "medical-bill-response-system" });
      track("medical_bill_email_sequence_start", {
        source_surface: "medical-bill-response-system",
        sequence_status: result.sequenceStatus || "first_email_only",
      });
    } catch (error) {
      messageElement.textContent = error instanceof Error ? error.message : "Signup failed. Try again.";
    } finally {
      if (button) button.disabled = false;
    }
  };

  const createOffer = (path) => {
    const isHub = path === HUB_ROUTE;
    const section = document.createElement("section");
    section.className = "caf-product-offer";
    section.dataset.cafMedicalBillProduct = path;
    section.innerHTML = `
      <div class="caf-product-offer__grid">
        <div>
          <div class="caf-product-offer__eyebrow">Free product laboratory</div>
          <h2>Expanded Medical Bill Response Workbook</h2>
          <p>The complete 32-page workbook foundation is built. Community Acquired Finance is validating usefulness and audience demand before considering payment.</p>
          <div class="caf-product-offer__chips">
            <span class="caf-product-offer__chip">No payment</span>
            <span class="caf-product-offer__chip">Public sample</span>
            <span class="caf-product-offer__chip">No PHI requested</span>
          </div>
        </div>
        <div>
          <a class="caf-product-offer__button" href="${PRODUCT_ROUTE}" data-caf-product-link>Preview the foundation →</a>
          <p class="caf-product-offer__small">Essential guidance, official sources, and the free Response Pack remain free.</p>
        </div>
      </div>
      ${isHub ? `
        <form class="caf-email-panel" data-caf-medical-bill-sequence novalidate>
          <strong>Keep the response sequence for your next billing call</strong>
          <div class="caf-email-panel__row">
            <input name="firstName" type="text" autocomplete="given-name" placeholder="First name (optional)" />
            <input name="email" type="email" autocomplete="email" placeholder="you@example.com" required />
          </div>
          <label><input name="consent" type="checkbox" required /> I agree to receive educational medical-bill emails. I can unsubscribe anytime.</label>
          <input name="website" type="text" tabindex="-1" autocomplete="off" aria-hidden="true" style="display:none" />
          <button type="submit">Start the medical-bill email path</button>
          <div class="caf-email-panel__message" role="status" aria-live="polite"></div>
        </form>` : ""}
    `;

    section.querySelector("[data-caf-product-link]")?.addEventListener("click", () => {
      track("supporting_page_to_product", { source_surface: path, product_id: PRODUCT_ID });
    });

    const form = section.querySelector("[data-caf-medical-bill-sequence]");
    if (form) {
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        const message = form.querySelector(".caf-email-panel__message");
        submitEmail(form, message);
      });
    }

    return section;
  };

  const enhanceRoute = () => {
    const path = cleanPath();
    document.querySelectorAll("[data-caf-medical-bill-product]").forEach((node) => {
      if (node.dataset.cafMedicalBillProduct !== path) node.remove();
    });

    if (!MEDICAL_BILL_ROUTES.has(path)) return;
    if (document.querySelector(`[data-caf-medical-bill-product="${CSS.escape(path)}"]`)) return;

    const main = document.querySelector("main");
    if (!main) return;

    const target = path.startsWith("/articles/")
      ? document.querySelector("main article") || document.querySelector("main .container") || main
      : document.querySelector("main .container") || main;
    target.appendChild(createOffer(path));
  };

  const scheduleEnhancement = (() => {
    let primaryTimer = 0;
    let retryTimer = 0;
    return () => {
      window.clearTimeout(primaryTimer);
      window.clearTimeout(retryTimer);
      primaryTimer = window.setTimeout(enhanceRoute, 350);
      retryTimer = window.setTimeout(enhanceRoute, 1200);
    };
  })();

  const patchHistory = () => {
    ["pushState", "replaceState"].forEach((method) => {
      const original = history[method];
      history[method] = function (...args) {
        const result = original.apply(this, args);
        window.dispatchEvent(new Event("caf:navigation"));
        return result;
      };
    });
    window.addEventListener("popstate", () => window.dispatchEvent(new Event("caf:navigation")));
    window.addEventListener("caf:navigation", scheduleEnhancement);
  };

  const boot = () => {
    addStyles();
    patchHistory();
    scheduleEnhancement();
  };

  if (document.readyState === "complete") {
    boot();
  } else {
    window.addEventListener("load", boot, { once: true });
  }
})();
