/* ============================================================
   Interactive blueprint concept diagrams
   Squares · triangles · circles → ideas
   - Buyers:    hover a shape to read it (static otherwise)
   - Translate: cursor x (left→right) drives complexity→solution
   ============================================================ */
(function () {
  "use strict";

  function setReadout(el, k, d) {
    if (!el) return;
    el.querySelector(".ro-k").textContent = k;
    el.querySelector(".ro-d").textContent = d;
    el.classList.add("live");
  }

  /* ---------- 1 · BUYER PROFILES (hover) ------------------------- */
  function buildBuyers() {
    const stage = document.getElementById("stage-buyers");
    const ro = document.getElementById("ro-buyers");
    if (!stage) return;

    const data = {
      ops:  { k: "Operator ▢ · operations", d: "Runs it daily. Wins on reliability and workflow fit." },
      eng:  { k: "Engineer △ · technical",   d: "Judges architecture, APIs, scale. Wins on depth and candor." },
      exec: { k: "Executive ○ · economic",   d: "Buys outcomes. Wins on risk, ROI, and time-to-value." },
    };
    const idle = { k: "3 profiles · one deal", d: "Hover a shape — three stakeholders, three conversations." };

    stage.innerHTML = `
      <svg viewBox="0 0 400 270" preserveAspectRatio="xMidYMid meet" aria-label="Buyer profiles">
        <line class="dim" x1="44" y1="40" x2="356" y2="40"/>
        <line class="dim" x1="44" y1="36" x2="44" y2="44"/>
        <line class="dim" x1="356" y1="36" x2="356" y2="44"/>
        <text class="dim-txt" x="200" y="33" text-anchor="middle">3 PROFILES · ONE DEAL</text>

        <g class="prim" data-k="ops" tabindex="0" role="button" aria-label="The Operator">
          <rect class="fill" x="48" y="84" width="84" height="84"/>
          <rect class="stroke" x="48" y="84" width="84" height="84"/>
          <text class="lab" x="90" y="190" text-anchor="middle">OPERATOR</text>
        </g>
        <g class="prim" data-k="eng" tabindex="0" role="button" aria-label="The Engineer">
          <polygon class="fill" points="200,84 244,168 156,168"/>
          <polygon class="stroke" points="200,84 244,168 156,168"/>
          <text class="lab" x="200" y="190" text-anchor="middle">ENGINEER</text>
        </g>
        <g class="prim" data-k="exec" tabindex="0" role="button" aria-label="The Executive">
          <circle class="fill" cx="310" cy="126" r="42"/>
          <circle class="stroke" cx="310" cy="126" r="42"/>
          <text class="lab" x="310" y="190" text-anchor="middle">EXECUTIVE</text>
        </g>
      </svg>`;

    const prims = [...stage.querySelectorAll(".prim")];
    const order = ["ops", "eng", "exec"];
    let bi = 0;
    function sel(key) {
      prims.forEach((p) => p.classList.toggle("sel", p.dataset.k === key));
      setReadout(ro, data[key].k, data[key].d);
      const ix = order.indexOf(key); if (ix >= 0) bi = ix;
    }
    let timer = null;
    function play() { if (!timer) timer = setInterval(() => { bi = (bi + 1) % order.length; sel(order[bi]); }, 6500); }
    function pause() { clearInterval(timer); timer = null; }
    prims.forEach((p) => {
      p.addEventListener("mouseenter", () => { pause(); sel(p.dataset.k); });
      p.addEventListener("focus", () => { pause(); sel(p.dataset.k); });
    });
    stage.addEventListener("mouseleave", play);
    sel(order[0]);
    stage._play = play; stage._pause = pause;
  }

  /* ---------- 4 · COMPLEXITY → SOLUTIONS (cursor x) ------------- */
  function buildTranslate() {
    const stage = document.getElementById("stage-translate");
    const ro = document.getElementById("ro-translate");
    if (!stage) return;

    const shapes = [
      { type: "rect", sx: 64,  sy: 80,  sr: -22, ox: 250, oy: 78 },
      { type: "tri",  sx: 118, sy: 196, sr: 30,  ox: 250, oy: 116 },
      { type: "circ", sx: 92,  sy: 132, sr: 0,   ox: 250, oy: 154 },
      { type: "rect", sx: 168, sy: 96,  sr: 44,  ox: 250, oy: 192 },
      { type: "circ", sx: 56,  sy: 206, sr: 0,   ox: 250, oy: 230 },
      { type: "tri",  sx: 196, sy: 162, sr: -38, ox: 318, oy: 116 },
      { type: "rect", sx: 138, sy: 242, sr: 12,  ox: 318, oy: 154 },
      { type: "circ", sx: 174, sy: 228, sr: 0,   ox: 318, oy: 192 },
      { type: "tri",  sx: 78,  sy: 258, sr: 60,  ox: 318, oy: 78 },
    ];
    const S = 24;
    function geom(type) {
      if (type === "rect") return `<rect x="${-S/2}" y="${-S/2}" width="${S}" height="${S}" fill="rgba(255,74,0,0.07)" stroke="var(--blue)" stroke-width="1.6"/>`;
      if (type === "circ") return `<circle cx="0" cy="0" r="${S/2}" fill="rgba(255,74,0,0.07)" stroke="var(--blue)" stroke-width="1.6"/>`;
      return `<polygon points="0,${-S/2-1} ${S/2},${S/2-1} ${-S/2},${S/2-1}" fill="rgba(255,74,0,0.07)" stroke="var(--blue)" stroke-width="1.6"/>`;
    }

    stage.innerHTML = `
      <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid meet" aria-label="Translating complexity to solutions">
        <text class="lab" x="108" y="32" text-anchor="middle" style="fill:var(--on-ink-mut)">COMPLEXITY</text>
        <text class="lab" x="284" y="32" text-anchor="middle" style="fill:var(--orange)">SOLUTION</text>
        <line class="dim" x1="200" y1="44" x2="200" y2="276" stroke-dasharray="3 4"/>
        <g class="tconnect" opacity="0"></g>
        ${shapes.map((s) => `<g class="tshape"><g class="tshape-inner">${geom(s.type)}</g></g>`).join("")}
      </svg>
      <div class="t-hint mono-sm">◄ MOVE CURSOR ►</div>`;

    const nodes = [...stage.querySelectorAll(".tshape")];
    const connect = stage.querySelector(".tconnect");
    const hint = stage.querySelector(".t-hint");
    connect.innerHTML =
      `<line x1="250" y1="78" x2="250" y2="230" stroke="var(--orange)" stroke-width="1.4"/>` +
      `<line x1="318" y1="78" x2="318" y2="192" stroke="var(--orange)" stroke-width="1.4"/>` +
      `<line x1="250" y1="154" x2="318" y2="154" stroke="var(--orange)" stroke-width="1" stroke-dasharray="2 3"/>`;

    const lerp = (a, b, t) => a + (b - a) * t;
    let cur = 0, target = 0, raf = null;

    function paint(t) {
      const e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      nodes.forEach((g, i) => {
        const s = shapes[i];
        g.querySelector(".tshape-inner").setAttribute(
          "transform",
          `translate(${lerp(s.sx, s.ox, e).toFixed(1)} ${lerp(s.sy, s.oy, e).toFixed(1)}) rotate(${lerp(s.sr, 0, e).toFixed(1)})`
        );
      });
      connect.style.opacity = e > 0.55 ? ((e - 0.55) / 0.45).toFixed(2) : 0;
      let k, d;
      if (t < 0.34) { k = "Input · raw complexity"; d = "Requirements, constraints, politics — all at once."; }
      else if (t < 0.7) { k = "Process · translating"; d = "Sort signal from noise; name the moving parts."; }
      else { k = "Output · clear solution"; d = "Same pieces, ordered into a system they can trust."; }
      setReadout(ro, k, d);
    }

    function tick() {
      cur += (target - cur) * 0.16;
      if (Math.abs(target - cur) < 0.001) cur = target;
      paint(cur);
      if (cur !== target) raf = requestAnimationFrame(tick);
      else raf = null;
    }
    function to(t) { target = Math.max(0, Math.min(1, t)); if (!raf) raf = requestAnimationFrame(tick); }

    const coarse = window.matchMedia("(hover: none), (pointer: coarse)").matches;
    if (coarse) {
      // No cursor on touch devices — drive the animation with scroll position
      // as the band moves up through the viewport.
      hint.textContent = "▼ SCROLL TO SOLVE ▼";
      const onScroll = () => {
        const r = stage.getBoundingClientRect();
        const vh = window.innerHeight || document.documentElement.clientHeight;
        const t = (vh - r.top) / (r.height + vh * 0.35);
        to(t);
        hint.style.display = t > 0.15 ? "none" : "";
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll, { passive: true });
      onScroll();
    } else {
      stage.addEventListener("pointermove", (e) => {
        const r = stage.getBoundingClientRect();
        to((e.clientX - r.left) / r.width);
        hint.style.display = "none";
      });
    }
    // Holds whatever state it is in when input stops.
    paint(0);
  }

  function setupDraw() {
    document.querySelectorAll("[data-draw]").forEach((el) => {
      let len = 300;
      try { len = el.getTotalLength ? el.getTotalLength() : 2 * Math.PI * (+el.getAttribute("r") || 40); } catch (e) {}
      el.classList.add("draw");
      el.style.setProperty("--len", len);
    });
  }

  function startAuto() {
    ["stage-buyers"].forEach((id) => {
      const el = document.getElementById(id);
      if (el && el._play) el._play();
    });
  }

  function init() {
    buildBuyers();
    buildTranslate();
    setupDraw();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();

  window.ZM_DIAGRAMS = { init, startAuto };
})();
