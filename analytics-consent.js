/* Bécsi Magyar Iskola GA4: explicit, page-scoped analytics consent. */
(function () {
  "use strict";
  var measurementId = "G-CZ2K1KVYX2";
  var enabled = false;
  var loaded = false;
  window.bmiConsent = false;

  function loadAnalytics() {
    if (loaded) return;
    loaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    window.gtag("config", measurementId);
    var script = document.createElement("script");
    script.async = true;
    script.src = "https://www.googletagmanager.com/gtag/js?id=" + measurementId;
    document.head.appendChild(script);
  }

  function mount() {
    if (document.getElementById("bmi-analytics-consent")) return;
    var style = document.createElement("style");
    style.textContent = "#bmi-analytics-consent{position:fixed;z-index:2147483646;inset:auto 16px 16px;max-width:620px;margin:auto;padding:18px 20px;background:#fff;color:#202124;border:1px solid #d5d7db;border-radius:14px;box-shadow:0 12px 40px #0003;font:15px/1.5 system-ui,sans-serif}#bmi-analytics-consent p{margin:0 0 12px}#bmi-analytics-consent .bmi-actions{display:flex;gap:8px;flex-wrap:wrap}#bmi-analytics-consent button{font:inherit;padding:8px 14px;border-radius:8px;border:1px solid #606775;background:#fff;color:#202124;cursor:pointer}#bmi-analytics-consent button.bmi-accept{background:#164e7b;color:#fff;border-color:#164e7b}#bmi-analytics-consent button:focus-visible{outline:3px solid #e4a72c;outline-offset:2px}";
    document.head.appendChild(style);
    var box = document.createElement("div");
    box.id = "bmi-analytics-consent";
    box.setAttribute("role", "region");
    box.setAttribute("aria-label", "Látogatottsági mérés beállítása");
    box.innerHTML = '<p><strong>Segítesz javítani az oldalt?</strong> A Bécsi Magyar Iskola Google Analytics segítségével mérné az oldal látogatottságát. A mérés csak az engedélyed után indul, és a választás csak az aktuális oldalmegnyitásra érvényes.</p><div class="bmi-actions"><button type="button" class="bmi-accept">Engedélyezem</button><button type="button" class="bmi-reject">Nem kérem</button></div>';
    box.querySelector(".bmi-accept").addEventListener("click", function () {
      enabled = true;
      window.bmiConsent = true;
      loadAnalytics();
      box.remove();
    });
    box.querySelector(".bmi-reject").addEventListener("click", function () {
      enabled = false;
      window.bmiConsent = false;
      box.remove();
    });
    document.body.appendChild(box);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount);
  else mount();
})();
