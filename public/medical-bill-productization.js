(() => {
  "use strict";

  const PRODUCT_ROUTE = "/products/expanded-medical-bill-response-workbook";
  const HUB_ROUTE = "/insurance/medical-bill-review-toolkit";
  const FREE_PACK_ROUTE = "/downloads/medical-bill-response-pack.html";
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

  const initializeStaticAnalytics = () => {
    if (!analyticsAllowed() || window.gtag) return;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    const script = document.createElement("script");
    script.async = true;
    script.dataset.cafGoogleAnalytics = "true";
    script.src = "https://www.googletagmanager.com/gtag/js?id=G-2MR6ZCDJ1W";
    document.head.appendChild(script);
    window.gtag("js", new Date());
    window.gtag("config", "G-2MR6ZCDJ1W", {
      send_page_view: false,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
    });
  };

  const track = (name, parameters = {}) => {
    if (!analyticsAllowed()) return;
    const payload = {
      event_category: "medical_bill_product",
      ...parameters,
    };
    if (typeof window.gtag === "function") window.gtag("event", name, payload);
    if (typeof window.va === "function") window.va("event", { name, data: payload });
  };

  const addEnhancementStyles = () => {
    if (document.getElementById("caf-productization-styles")) return;
    const style = document.createElement("style");
    style.id = "caf-productization-styles";
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
      .caf-email-panel__message{min-height:1.25rem;font-size:.78rem;font-weight:700;color:#0b5b42}
      @media(max-width:760px){.caf-product-offer__grid{grid-template-columns:1fr}.caf-product-offer__button{width:100%}.caf-email-panel__row{grid-template-columns:1fr}}
    `;
    document.head.appendChild(style);
  };

  const submitEmail = async (form, type, source, messageElement) => {
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
        body: JSON.stringify({ email, firstName, consent, website, source, type }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || result.ok !== true || result.saved !== true) {
        throw new Error(result.error || "Signup could not be completed.");
      }
      form.reset();
      if (type === "medical-bill-sequence") {
        messageElement.textContent = result.emailDelivered === false
          ? "Your signup was saved. Email delivery is still pending sender verification."
          : "You are on the medical-bill list. Check your inbox for the first response email.";
        track("free_pack_email_signup", { source_surface: source });
        track("medical_bill_email_sequence_start", {
          source_surface: source,
          sequence_status: result.sequenceStatus || "first_email_only",
        });
      } else {
        messageElement.textContent = result.emailDelivered === false
          ? "Your interest was saved. Email delivery is still pending sender verification."
          : "You are on the workbook launch list. No payment was collected.";
        track("premium_interest_submit", { source_surface: source, product_id: PRODUCT_ID });
      }
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
          <div class="caf-product-offer__eyebrow">Optional organization upgrade</div>
          <h2>Expanded Medical Bill Response Workbook</h2>
          <p>The free system explains the next step. The 32-page workbook helps organize bills, EOBs, calls, deadlines, assistance records, written requests, and caregiver handoffs in one reusable system.</p>
          <div class="caf-product-offer__chips"><span class="caf-product-offer__chip">$24 one-time</span><span class="caf-product-offer__chip">No subscription</span><span class="caf-product-offer__chip">No PHI requested</span></div>
        </div>
        <div>
          <a class="caf-product-offer__button" href="${PRODUCT_ROUTE}" data-caf-product-link>Preview the workbook →</a>
          <p class="caf-product-offer__small">Essential guidance, official sources, and the free Response Pack remain free.</p>
        </div>
      </div>
      ${isHub ? `
        <form class="caf-email-panel" data-caf-medical-bill-sequence novalidate>
          <strong>Keep the response sequence for your next billing call</strong>
          <div class="caf-email-panel__row"><input name="firstName" type="text" autocomplete="given-name" placeholder="First name (optional)" /><input name="email" type="email" autocomplete="email" placeholder="you@example.com" required /></div>
          <label><input name="consent" type="checkbox" required /> I agree to receive educational medical-bill emails. I can unsubscribe anytime.</label>
          <input name="website" type="text" tabindex="-1" autocomplete="off" aria-hidden="true" style="display:none" />
          <button type="submit">Start the medical-bill email path</button>
          <div class="caf-email-panel__message" role="status" aria-live="polite"></div>
        </form>` : ""}
    `;

    section.querySelector("[data-caf-product-link]")?.addEventListener("click", () => {
      track("free_to_premium_click", { source_surface: path, product_id: PRODUCT_ID });
    });

    const sequenceForm = section.querySelector("[data-caf-medical-bill-sequence]");
    if (sequenceForm) {
      sequenceForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const message = sequenceForm.querySelector(".caf-email-panel__message");
        submitEmail(sequenceForm, "medical-bill-sequence", "medical-bill-response-system", message);
      });
    }

    return section;
  };

  const enhanceSpaRoute = () => {
    const path = cleanPath();
    document.querySelectorAll("[data-caf-medical-bill-product]").forEach((node) => {
      if (node.dataset.cafMedicalBillProduct !== path) node.remove();
    });
    if (!MEDICAL_BILL_ROUTES.has(path) || document.querySelector(`[data-caf-medical-bill-product="${CSS.escape(path)}"]`)) return;

    const main = document.querySelector("main");
    if (!main) return;
    const target = path.startsWith("/articles/")
      ? document.querySelector("main article") || document.querySelector("main .container") || main
      : document.querySelector("main .container") || main;
    target.appendChild(createOffer(path));
  };

  const configureProductPage = async () => {
    if (!document.body.matches("[data-caf-product-page]") || cleanPath() !== PRODUCT_ROUTE) return;
    initializeStaticAnalytics();
    track("medical_bill_product_view", { product_id: PRODUCT_ID, checkout_state: "loading" });

    const companion = document.getElementById("browser-companion");
    const counter = document.getElementById("companion-counter");
    const updateCounter = () => {
      const boxes = [...companion.querySelectorAll("input[type=checkbox]")];
      const completed = boxes.filter((box) => box.checked).length;
      counter.textContent = `${completed} of ${boxes.length} control points documented.`;
    };
    companion?.addEventListener("change", updateCounter);
    document.getElementById("reset-companion")?.addEventListener("click", () => {
      companion.querySelectorAll("input[type=checkbox]").forEach((box) => { box.checked = false; });
      updateCounter();
    });
    document.getElementById("print-companion")?.addEventListener("click", () => {
      track("print_or_save_action", { action_type: "browser_companion_print" });
      window.print();
    });

    document.querySelectorAll("[data-preview-page]").forEach((preview) => {
      preview.addEventListener("click", () => track("premium_product_preview", {
        product_id: PRODUCT_ID,
        preview_page: Number(preview.dataset.previewPage),
      }));
    });
    document.querySelectorAll("[data-caf-event]").forEach((link) => {
      link.addEventListener("click", () => track(link.dataset.cafEvent, {
        product_id: PRODUCT_ID,
        source_surface: "product_page",
      }));
    });

    const form = document.getElementById("medical-bill-product-form");
    const message = document.getElementById("product-form-message");
    form?.addEventListener("submit", (event) => {
      event.preventDefault();
      submitEmail(form, "medical-bill-product-interest", "medical-bill-workbook-product-page", message);
    });

    try {
      const response = await fetch("/api/product-config", { headers: { Accept: "application/json" } });
      const config = await response.json();
      const action = document.getElementById("primary-product-action");
      const status = document.getElementById("checkout-status");
      if (response.ok && config.checkoutEnabled && /^https:\/\//.test(config.checkoutUrl || "")) {
        action.href = config.checkoutUrl;
        action.target = "_blank";
        action.rel = "noreferrer";
        action.textContent = "Buy securely for $24";
        action.addEventListener("click", () => track("premium_checkout_start", { product_id: PRODUCT_ID, price_usd: 24 }));
        status.textContent = "Secure hosted checkout is configured. Community Acquired Finance does not collect or store payment-card information.";
        document.getElementById("launch-heading").textContent = "Secure hosted checkout is available";
        document.getElementById("launch-copy").textContent = "Payment, receipt, and product delivery are handled by the authorized hosted provider. The controlling delivery and refund terms appear before payment.";
      } else {
        track("medical_bill_product_view", { product_id: PRODUCT_ID, checkout_state: "interest_only" });
      }
    } catch {
      track("medical_bill_product_view", { product_id: PRODUCT_ID, checkout_state: "config_unavailable" });
    }
  };

  const scheduleEnhancement = (() => {
    let frame = 0;
    return () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(enhanceSpaRoute);
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

  addEnhancementStyles();
  patchHistory();
  document.addEventListener("DOMContentLoaded", () => {
    configureProductPage();
    scheduleEnhancement();
    const observer = new MutationObserver(scheduleEnhancement);
    observer.observe(document.body, { childList: true, subtree: true });
  }, { once: true });
})();
