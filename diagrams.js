/* ============================================================
   Interactive blueprint concept diagrams
   Squares · triangles · circles → ideas
   - Buyers:    hover a shape to read it (static otherwise)
   - Cycle:     auto-rotates; active stage sits at top
   - Trust:     auto-cycles inward ring by ring
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

  /* ---------- 2 · THE SALES CYCLE (auto-rotate) ----------------- */
  function buildCycle() {
    const stage = document.getElementById("stage-cycle");
    const ro = document.getElementById("ro-cycle");
    if (!stage) return;

    const stages = [
      ["Qualify",  "Separate signal from noise before anyone burns a cycle."],
      ["Discover", "Lead discovery — find the problem beneath the stated one."],
      ["Architect","Design the integration: APIs, data flows, cloud fit."],
      ["Prove",    "Scope a tight POC; validate against their own data."],
      ["Validate", "Every stakeholder sees their own win confirmed."],
      ["Close",    "The technical voice that removes the last doubt."],
      ["Feedback", "Field insight routed back to Product & Engineering."],
    ];
    const cx = 200, cy = 150, r = 92;
    const n = stages.length;
    const step = 360 / n;

    let nodes = "";
    stages.forEach((s, i) => {
      const a = (-90 + i * step) * Math.PI / 180;
      const x = cx + Math.cos(a) * r;
      const y = cy + Math.sin(a) * r;
      const shape = i % 3 === 0
        ? `<rect class="fill" x="-13" y="-13" width="26" height="26"/><rect class="stroke" x="-13" y="-13" width="26" height="26"/>`
        : i % 3 === 1
        ? `<polygon class="fill" points="0,-15 14,11 -14,11"/><polygon class="stroke" points="0,-15 14,11 -14,11"/>`
        : `<circle class="fill" cx="0" cy="0" r="14"/><circle class="stroke" cx="0" cy="0" r="14"/>`;
      nodes += `<g class="cnode prim" data-i="${i}" transform="translate(${x.toFixed(1)} ${y.toFixed(1)})">
          <g class="cnode-spin">${shape}
            <text class="lab" x="0" y="30" text-anchor="middle">${stages[i][0].toUpperCase()}</text>
          </g>
        </g>`;
    });

    stage.innerHTML = `
      <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid meet" aria-label="Sales cycle">
        <g id="cyc-marker">
          <polygon points="200,30 206,42 194,42" fill="var(--orange)"/>
          <text class="lab" x="200" y="22" text-anchor="middle" style="fill:var(--orange)">NOW</text>
        </g>
        <circle data-draw cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="var(--blue)" stroke-width="1" stroke-dasharray="3 4" opacity="0.55"/>
        <g id="cyc-rotor">${nodes}</g>
        <text class="lab" x="${cx}" y="${cy - 5}" text-anchor="middle" style="fill:var(--on-ink-mut)">THE</text>
        <text x="${cx}" y="${cy + 15}" text-anchor="middle" style="font-family:var(--display);font-weight:800;font-size:21px;fill:var(--on-ink);letter-spacing:-0.02em">LOOP</text>
      </svg>`;

    const rotor = stage.querySelector("#cyc-rotor");
    rotor.style.transformBox = "view-box";
    rotor.style.transformOrigin = cx + "px " + cy + "px";
    rotor.style.transition = "transform 1.1s cubic-bezier(.5,0,.2,1)";
    const cnodes = [...stage.querySelectorAll(".cnode")];
    cnodes.forEach((g) => {
      const spin = g.querySelector(".cnode-spin");
      spin.style.transformBox = "fill-box";
      spin.style.transformOrigin = "center";
      spin.style.transition = "transform 1.1s cubic-bezier(.5,0,.2,1)";
    });

    let turn = 0;
    function render() {
      const idx = ((turn % n) + n) % n;
      rotor.style.transform = `rotate(${(-turn * step).toFixed(2)}deg)`;
      cnodes.forEach((g, k) => {
        g.querySelector(".cnode-spin").style.transform = `rotate(${(turn * step).toFixed(2)}deg)`;
        g.classList.toggle("sel", k === idx);
      });
      setReadout(ro, "Stage 0" + (idx + 1) + " · " + stages[idx][0], stages[idx][1]);
    }
    function advanceTo(k) {            // only ever move forward — endless single direction
      const idx = ((turn % n) + n) % n;
      turn += (((k - idx) % n) + n) % n;
      render();
    }
    render();

    let timer = null;
    function play() { if (!timer) timer = setInterval(() => { turn += 1; render(); }, 7000); }
    function pause() { clearInterval(timer); timer = null; }
    stage.addEventListener("mouseenter", pause);
    stage.addEventListener("mouseleave", play);
    cnodes.forEach((g) => g.addEventListener("mouseenter", () => advanceTo(+g.dataset.i)));

    stage._play = play; stage._pause = pause;
  }

  /* ---------- 3 · EARNING THE CONVERSATION (auto-cycle) --------- */
  function buildTrust() {
    const stage = document.getElementById("stage-trust");
    const ro = document.getElementById("ro-trust");
    if (!stage) return;

    const rings = [
      { r: 104, k: "access",  label: "ACCESS",      t: "Access",          d: "You got the meeting. Table stakes — now earn the questions." },
      { r: 78,  k: "cred",    label: "CREDIBILITY", t: "Credibility",     d: "Understand their world faster than they expected." },
      { r: 52,  k: "trust",   label: "TRUST",       t: "Trust",           d: "Tell them what won’t work. Honesty compounds." },
      { r: 26,  k: "advisor", label: "ADVISOR",     t: "Trusted Advisor", d: "Trusted advisor in the room to make recommendations." },
    ];
    const cx = 200, cy = 150;
    let circles = "";
    rings.forEach((ring) => {
      circles += `<g class="tring" data-k="${ring.k}">
          <circle class="t-fill" cx="${cx}" cy="${cy}" r="${ring.r}" fill="rgba(79,143,208,.04)"/>
          <circle class="t-stroke" data-draw cx="${cx}" cy="${cy}" r="${ring.r}" fill="none" stroke="var(--blue)" stroke-width="1.6"/>
          <text class="lab" x="${cx}" y="${cy - ring.r + 14}" text-anchor="middle">${ring.label}</text>
        </g>`;
    });

    stage.innerHTML = `
      <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid meet" aria-label="Earning the conversation">
        <line class="dim" x1="${cx}" y1="20" x2="${cx}" y2="${cy}" stroke-dasharray="3 3"/>
        <text class="dim-txt" x="${cx + 6}" y="32">INWARD = EARNED</text>
        ${circles}
        <circle cx="${cx}" cy="${cy}" r="3" fill="var(--orange)"/>
      </svg>`;

    const trings = [...stage.querySelectorAll(".tring")];
    function sel(idx) {
      trings.forEach((g, k) => {
        const on = k === idx;
        g.classList.toggle("on", on);
        g.querySelector(".t-stroke").setAttribute("stroke", on ? "var(--orange)" : "var(--blue)");
        g.querySelector(".t-stroke").setAttribute("stroke-width", on ? "2.8" : "1.6");
        g.querySelector(".t-fill").setAttribute("fill", on ? "rgba(255,74,0,.12)" : "rgba(79,143,208,.04)");
        g.querySelector(".lab").setAttribute("fill", on ? "var(--on-ink)" : "var(--on-ink-mut)");
      });
      setReadout(ro, "Ring 0" + (idx + 1) + " · " + rings[idx].t, rings[idx].d);
    }

    let i = 0; sel(0);
    let timer = null;
    function play() { if (!timer) timer = setInterval(() => { i = (i + 1) % rings.length; sel(i); }, 6000); }
    function pause() { clearInterval(timer); timer = null; }
    trings.forEach((g, k) => g.addEventListener("mouseenter", () => { pause(); i = k; sel(k); }));
    stage.addEventListener("mouseleave", () => { play(); });
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

    stage.addEventListener("pointermove", (e) => {
      const r = stage.getBoundingClientRect();
      to((e.clientX - r.left) / r.width);
      hint.style.opacity = "0";
    });
    // Cursor-only: hold whatever state it is in when the pointer leaves.
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
    ["stage-buyers", "stage-cycle", "stage-trust"].forEach((id) => {
      const el = document.getElementById(id);
      if (el && el._play) el._play();
    });
  }

  function init() {
    buildBuyers();
    buildCycle();
    buildTrust();
    buildTranslate();
    setupDraw();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();

  window.ZM_DIAGRAMS = { init, startAuto };
})();
