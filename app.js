/* ============================================================
   App: nav, scroll readout, reveal observers, timeline
   ============================================================ */
(function () {
  "use strict";

  /* ---- scan/progress line + scroll coordinate readout ---- */
  const scan = document.querySelector(".scan");
  const coord = document.getElementById("coord");
  function onScroll() {
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    const p = max > 0 ? h.scrollTop / max : 0;
    if (scan) scan.style.width = (p * 100).toFixed(2) + "%";
    if (coord) {
      const y = Math.round(p * 9999).toString().padStart(4, "0");
      coord.innerHTML = "Y:<b>" + y + "</b>";
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---- active nav link + section label ---- */
  const links = [...document.querySelectorAll(".topbar nav a")];
  const sections = links
    .map((a) => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);
  const navObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          const id = "#" + e.target.id;
          links.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === id));
        }
      });
    },
    { rootMargin: "-46px 0px -65% 0px", threshold: 0 }
  );
  sections.forEach((s) => navObs.observe(s));

  /* ---- reveal-on-enter (.in) for sections + .rise elements ---- */
  let autoStarted = false;
  const revObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          if (e.target.classList.contains("diaband") && !autoStarted) {
            autoStarted = true;
            if (window.ZM_DIAGRAMS && window.ZM_DIAGRAMS.startAuto) {
              setTimeout(window.ZM_DIAGRAMS.startAuto, 400);
            }
          }
        }
      });
    },
    { threshold: 0.12 }
  );
  document.querySelectorAll("section, .rise").forEach((el) => revObs.observe(el));

  /* ---- experience: filing-cabinet tabs ---- */
  const tabs = [...document.querySelectorAll(".ftab")];
  const panels = [...document.querySelectorAll(".filepanel")];
  function activate(i) {
    tabs.forEach((t, k) => t.classList.toggle("active", k === i));
    panels.forEach((p, k) => p.classList.toggle("active", k === i));
  }
  tabs.forEach((t, i) => {
    t.addEventListener("click", () => activate(i));
    t.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") { e.preventDefault(); activate(Math.min(i + 1, tabs.length - 1)); tabs[Math.min(i + 1, tabs.length - 1)].focus(); }
      if (e.key === "ArrowLeft") { e.preventDefault(); activate(Math.max(i - 1, 0)); tabs[Math.max(i - 1, 0)].focus(); }
    });
  });
  if (tabs.length) activate(0);

  /* ---- travel thumbnails → lightbox ---- */
  const lb = document.getElementById("lightbox");
  if (lb) {
    const lbImg = lb.querySelector("img");
    const lbCap = lb.querySelector(".lb-cap");
    const open = (full, cap) => { lbImg.src = full; lbImg.alt = cap; lbCap.textContent = cap; lb.classList.add("open"); lb.setAttribute("aria-hidden", "false"); };
    const close = () => { lb.classList.remove("open"); lb.setAttribute("aria-hidden", "true"); };
    document.querySelectorAll(".tthumb").forEach((t) => {
      t.addEventListener("click", () => open(t.dataset.full, t.dataset.cap));
    });
    lb.addEventListener("click", close);
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
  }

  /* ---- live clock in footer ---- */
  const clock = document.getElementById("clock");
  if (clock) {
    const tick = () => {
      const d = new Date();
      const hh = String(d.getHours()).padStart(2, "0");
      const mm = String(d.getMinutes()).padStart(2, "0");
      const ss = String(d.getSeconds()).padStart(2, "0");
      clock.textContent = hh + ":" + mm + ":" + ss + " CT";
    };
    tick();
    setInterval(tick, 1000);
  }
})();
