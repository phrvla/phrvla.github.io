// PHR-VLA interactive bar charts — titled chartbox cards, gridlines, growing
// bars on scroll, hover tooltips, click-to-isolate / hover-to-highlight legend.
(function () {
  "use strict";

  var LIBERO_TASKS = ["Spatial", "Object", "Goal", "Long", "Average"];
  var MW_TASKS = ["Easy", "Medium", "Hard", "Very Hard", "Average"];

  // ─────────────────────────────────────────────────────────────────────────
  // CHART SPECS  (data-chart attribute)
  // ─────────────────────────────────────────────────────────────────────────
  var CHARTS = {

    // ── LIBERO main results (Table I) ─────────────────────────────────────
    libero: {
      title: "Success Rate",
      sub: "LIBERO · four task suites, 300 trials per suite",
      groups: [
        { label: "Baselines", methods: ["act", "dp", "octo", "dit", "openvla", "smolvla"] },
        { label: "Ours", methods: ["ours"] }
      ],
      methodDefs: {
        act:     { label: "ACT",              cls: "m-act" },
        dp:      { label: "Diffusion Policy",  cls: "m-dp" },
        octo:    { label: "Octo",              cls: "m-octo" },
        dit:     { label: "DiT Policy",        cls: "m-dit" },
        openvla: { label: "OpenVLA",           cls: "m-openvla" },
        smolvla: { label: "SmolVLA",           cls: "m-smolvla" },
        ours:    { label: "PHR-VLA (ours)",    cls: "m-ours" }
      },
      methodOrder: ["act", "dp", "octo", "dit", "openvla", "smolvla", "ours"],
      tasks: LIBERO_TASKS,
      tabs: [
        { key: "sr", label: "Success Rate ↑", unit: "%", log: false,
          data: {
            act:     [36.7, 48.4, 2.0, 15.7, 24.2],
            dp:      [78.3, 92.5, 68.3, 50.5, 72.4],
            octo:    [78.9, 85.7, 84.6, 51.1, 75.1],
            dit:     [84.2, 96.3, 85.4, 63.8, 82.4],
            openvla: [84.7, 88.4, 79.2, 53.7, 76.5],
            smolvla: [86.0, 97.7, 86.7, 66.0, 84.1],
            ours:    [88.7, 98.0, 92.4, 74.4, 88.4]
          } }
      ]
    },

    // ── Meta-World main results (Table II) ──────────────────────────────────
    metaworld: {
      title: "Success Rate",
      sub: "Meta-World · all difficulty levels",
      groups: [
        { label: "Baselines", methods: ["act", "dp", "tinyvla", "smolvla"] },
        { label: "Ours", methods: ["ours"] }
      ],
      methodDefs: {
        act:     { label: "ACT",           cls: "m-act" },
        dp:      { label: "Diffusion Policy", cls: "m-dp" },
        tinyvla: { label: "TinyVLA",       cls: "m-tinyvla" },
        smolvla: { label: "SmolVLA",       cls: "m-smolvla" },
        ours:    { label: "PHR-VLA (ours)", cls: "m-ours" }
      },
      methodOrder: ["act", "dp", "tinyvla", "smolvla", "ours"],
      tasks: MW_TASKS,
      tabs: [
        { key: "sr", label: "Success Rate ↑", unit: "%", log: false,
          data: {
            act:     [68.2, 49.7, 28.9, 49.4, 49.0],
            dp:      [23.1, 10.7, 1.9, 6.1, 10.5],
            tinyvla: [77.6, 21.5, 11.4, 15.8, 31.6],
            smolvla: [82.0, 54.2, 43.9, 46.7, 56.7],
            ours:    [85.3, 55.2, 45.6, 45.4, 57.8]
          } }
      ]
    },

    // ── Ablation: Camera View (Fig. 3) ──────────────────────────────────────
    camview: {
      title: "Ablation — camera view",
      sub: "Patch-level, latent-dynamics supervision, λ = 0.02",
      groups: [
        { label: "Baseline", methods: ["smolvla"] },
        { label: "PHR-VLA", methods: ["tp", "mc", "wrist"] }
      ],
      methodDefs: {
        smolvla: { label: "SmolVLA",              cls: "m-smolvla" },
        tp:      { label: "Third-Person",         cls: "m-ours-tp" },
        mc:      { label: "Multicam",             cls: "m-ours-mc" },
        wrist:   { label: "Wrist (ours)",         cls: "m-ours-wr" }
      },
      methodOrder: ["smolvla", "tp", "mc", "wrist"],
      tasks: LIBERO_TASKS,
      tabs: [
        { key: "sr", label: "Success Rate ↑", unit: "%", log: false,
          data: {
            smolvla: [86.0, 97.7, 86.7, 66.0, 84.1],
            tp:      [89.3, 95.0, 88.3, 74.7, 86.8],
            mc:      [86.8, 98.0, 90.7, 76.3, 88.1],
            wrist:   [88.7, 98.0, 92.3, 74.3, 88.4]
          } }
      ]
    },

    // ── Ablation: Target Granularity — Patch vs Mean (Fig. 4) ──────────────
    granularity: {
      title: "Ablation — target granularity",
      sub: "Patch vs. mean-pooled latent targets, λ = 0.02",
      groups: [
        { label: "Wrist", methods: ["wr_mean", "wr_patch"] },
        { label: "Multicam", methods: ["mc_mean", "mc_patch"] },
        { label: "Third-Person", methods: ["tp_mean", "tp_patch"] }
      ],
      methodDefs: {
        wr_mean:  { label: "Wrist · Mean",         cls: "m-mean" },
        wr_patch: { label: "Wrist · Patch",        cls: "m-patch" },
        mc_mean:  { label: "Multicam · Mean",      cls: "m-mean" },
        mc_patch: { label: "Multicam · Patch",     cls: "m-patch" },
        tp_mean:  { label: "Third-Person · Mean",  cls: "m-mean" },
        tp_patch: { label: "Third-Person · Patch", cls: "m-patch" }
      },
      methodOrder: ["wr_mean", "wr_patch", "mc_mean", "mc_patch", "tp_mean", "tp_patch"],
      tasks: LIBERO_TASKS,
      tabs: [
        { key: "sr", label: "Success Rate ↑", unit: "%", log: false,
          data: {
            wr_mean:  [87.0, 98.0, 91.0, 69.0, 86.2],
            wr_patch: [88.7, 98.0, 92.3, 74.3, 88.4],
            mc_mean:  [85.3, 97.0, 90.0, 65.3, 84.4],
            mc_patch: [87.3, 98.0, 90.7, 76.3, 88.1],
            tp_mean:  [88.7, 98.3, 90.3, 67.0, 86.1],
            tp_patch: [89.3, 95.0, 88.3, 74.7, 86.8]
          } }
      ]
    },

    // ── Ablation: Latent Dynamics vs Absolute Latent (Fig. 5) ──────────────
    dynamics: {
      title: "Ablation — latent dynamics vs. absolute",
      sub: "Patch-level supervision, λ = 0.02",
      groups: [
        { label: "Wrist", methods: ["wr_abs", "wr_dyn"] },
        { label: "Multicam", methods: ["mc_abs", "mc_dyn"] },
        { label: "Third-Person", methods: ["tp_abs", "tp_dyn"] }
      ],
      methodDefs: {
        wr_abs: { label: "Wrist · Absolute",     cls: "m-abs" },
        wr_dyn: { label: "Wrist · Dynamics",     cls: "m-dyn" },
        mc_abs: { label: "Multicam · Absolute",  cls: "m-abs" },
        mc_dyn: { label: "Multicam · Dynamics",  cls: "m-dyn" },
        tp_abs: { label: "Third-Person · Absolute", cls: "m-abs" },
        tp_dyn: { label: "Third-Person · Dynamics", cls: "m-dyn" }
      },
      methodOrder: ["wr_abs", "wr_dyn", "mc_abs", "mc_dyn", "tp_abs", "tp_dyn"],
      tasks: LIBERO_TASKS,
      tabs: [
        { key: "sr", label: "Success Rate ↑", unit: "%", log: false,
          data: {
            wr_abs: [83.7, 98.7, 91.7, 72.7, 88.7],
            wr_dyn: [86.7, 98.0, 92.3, 74.3, 88.4],
            mc_abs: [84.3, 95.3, 93.7, 74.0, 87.3],
            mc_dyn: [86.8, 98.0, 90.7, 76.3, 88.1],
            tp_abs: [85.3, 98.0, 90.7, 73.0, 89.3],
            tp_dyn: [86.8, 95.0, 88.3, 74.7, 86.8]
          } }
      ]
    },

    // ── Ablation: Loss Weight λ (Fig. 6) ────────────────────────────────────
    lambda: {
      title: "Ablation — auxiliary loss weight λ",
      sub: "Patch-level, wrist-camera, latent-dynamics supervision",
      groups: [
        { label: "Baseline", methods: ["smolvla"] },
        { label: "PHR-VLA", methods: ["lam005", "lam02"] }
      ],
      methodDefs: {
        smolvla: { label: "SmolVLA",       cls: "m-smolvla" },
        lam005:  { label: "λ = 0.005",     cls: "m-lam1" },
        lam02:   { label: "λ = 0.02 (ours)", cls: "m-lam2" }
      },
      methodOrder: ["smolvla", "lam005", "lam02"],
      tasks: LIBERO_TASKS,
      tabs: [
        { key: "sr", label: "Success Rate ↑", unit: "%", log: false,
          data: {
            smolvla: [86.0, 97.7, 86.7, 66.0, 84.1],
            lam005:  [87.3, 99.0, 89.7, 67.3, 85.8],
            lam02:   [88.7, 98.0, 92.3, 74.3, 88.4]
          } }
      ]
    },

    // ── Real-world disassembly (Table VI) ───────────────────────────────────
    realworld: {
      title: "Success Rate",
      sub: "Real-world disassembly · Franka Emika Panda, 30 trials per task",
      groups: [
        { label: "Baselines", methods: ["act", "dp", "smolvla"] },
        { label: "Ours", methods: ["ours", "oursjepa"] }
      ],
      methodDefs: {
        act:      { label: "ACT",              cls: "m-act" },
        dp:       { label: "Diffusion Policy",  cls: "m-dp" },
        smolvla:  { label: "SmolVLA",           cls: "m-smolvla" },
        ours:     { label: "PHR-VLA (SigLIP)",  cls: "m-ours" },
        oursjepa: { label: "PHR-VLA (JEPA)",    cls: "m-ours-jepa" }
      },
      methodOrder: ["act", "dp", "smolvla", "ours", "oursjepa"],
      tasks: ["Task I", "Task II", "Task III", "Task IV", "Total"],
      tabs: [
        { key: "sr", label: "Success Rate ↑", unit: "%", log: false,
          data: {
            act:      [63.3, 46.7, 33.3, 0.0, 35.8],
            dp:       [70.0, 63.3, 46.7, 26.7, 51.7],
            smolvla:  [86.7, 66.7, 80.0, 20.0, 63.3],
            ours:     [93.3, 86.7, 73.3, 76.7, 82.5],
            oursjepa: [96.7, 96.7, 86.7, 30.0, 77.5]
          } }
      ]
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // SHARED RENDERING HELPERS
  // ─────────────────────────────────────────────────────────────────────────

  function dataRange(data, methodOrder) {
    var min = Infinity, max = -Infinity;
    methodOrder.forEach(function (m) {
      (data[m] || []).forEach(function (v) {
        if (v < min) min = v;
        if (v > max) max = v;
      });
    });
    return { min: min, max: max * 1.08 };
  }

  function toHeight(v, range, useLog) {
    if (useLog) {
      var lmin = Math.log10(Math.max(range.min, 1e-4));
      var lmax = Math.log10(Math.max(range.max, 1e-4));
      var lv = Math.log10(Math.max(v, 1e-4));
      return lmax > lmin ? ((lv - lmin) / (lmax - lmin)) * 92 : 0;
    }
    return range.max > 0 ? (v / range.max) * 92 : 0;
  }

  function fmtVal(v, unit) {
    if (unit === "%") return v.toFixed(1) + "%";
    return v.toFixed(2);
  }

  // Legend items are buttons: click isolates a method (solo it, click again to
  // restore all); hover highlights that method's bars everywhere in the chart.
  function buildLegend(container, spec, chartEl) {
    var legend = document.createElement("div");
    legend.className = "fmp-legend";
    var soloed = null;

    function applyState() {
      chartEl.querySelectorAll(".fmp-legend-item").forEach(function (it) {
        var m = it.getAttribute("data-m");
        it.classList.toggle("is-off", soloed !== null && soloed !== m);
      });
      chartEl.querySelectorAll(".fmp-bar").forEach(function (bar) {
        var m = bar.getAttribute("data-m");
        bar.classList.toggle("is-off", soloed !== null && soloed !== m);
      });
    }

    spec.groups.forEach(function (grp) {
      var grpEl = document.createElement("span");
      grpEl.className = "fmp-legend-group";
      var lbl = document.createElement("span");
      lbl.className = "fmp-legend-group-label";
      lbl.textContent = grp.label + ":";
      grpEl.appendChild(lbl);
      grp.methods.forEach(function (m) {
        var def = spec.methodDefs[m];
        var item = document.createElement("button");
        item.type = "button";
        item.className = "fmp-legend-item";
        item.setAttribute("data-m", m);
        item.title = "Click to isolate " + def.label;
        var sw = document.createElement("span");
        sw.className = "fmp-legend-swatch " + def.cls;
        item.appendChild(sw);
        item.appendChild(document.createTextNode(def.label));
        item.addEventListener("click", function () {
          soloed = soloed === m ? null : m;
          applyState();
        });
        item.addEventListener("mouseenter", function () {
          if (soloed !== null) return;
          chartEl.querySelectorAll(".fmp-bar").forEach(function (bar) {
            bar.classList.toggle("is-dim", bar.getAttribute("data-m") !== m);
          });
        });
        item.addEventListener("mouseleave", function () {
          if (soloed !== null) return;
          chartEl.querySelectorAll(".fmp-bar").forEach(function (bar) { bar.classList.remove("is-dim"); });
        });
        grpEl.appendChild(item);
      });
      legend.appendChild(grpEl);
    });
    container.appendChild(legend);
  }

  function buildPlot(wrap, tab, spec) {
    var useLog = tab.log;
    var range = dataRange(tab.data, spec.methodOrder);
    if (!useLog && tab.unit === "%") range = { min: 0, max: 100 };

    var ticks = tab.unit === "%" ? [0, 25, 50, 75, 100] : [];

    var axis = document.createElement("div");
    axis.className = "fmp-y-axis";
    ticks.slice().reverse().forEach(function (v) {
      var tick = document.createElement("div");
      tick.className = "fmp-y-tick";
      tick.textContent = fmtVal(v, tab.unit);
      axis.appendChild(tick);
    });
    wrap.appendChild(axis);

    var plotOuter = document.createElement("div");
    plotOuter.className = "fmp-chart-plot-outer";

    var grid = document.createElement("div");
    grid.className = "fmp-gridlines";
    ticks.forEach(function (v) {
      var line = document.createElement("div");
      line.className = "fmp-gridline";
      line.style.bottom = (v / (ticks[ticks.length - 1] || 100)) * 92 + "%";
      grid.appendChild(line);
    });
    plotOuter.appendChild(grid);

    var plot = document.createElement("div");
    plot.className = "fmp-chart-plot";

    spec.tasks.forEach(function (task, ti) {
      var group = document.createElement("div");
      group.className = "fmp-bar-group";
      var bars = document.createElement("div");
      bars.className = "fmp-bar-group-bars";

      var prevGrp = null;
      spec.methodOrder.forEach(function (m) {
        var curGrp = null;
        spec.groups.forEach(function (g) { if (g.methods.indexOf(m) >= 0) curGrp = g.label; });
        if (prevGrp && curGrp !== prevGrp) {
          var sp = document.createElement("div"); sp.className = "fmp-bar-spacer"; bars.appendChild(sp);
        }
        prevGrp = curGrp;

        var v = (tab.data[m] || [])[ti];
        if (v === undefined || v === null) return;
        var pct = toHeight(v, range, useLog);

        var bar = document.createElement("div");
        bar.className = "fmp-bar " + spec.methodDefs[m].cls;
        bar.setAttribute("data-m", m);
        bar.style.setProperty("--target", pct + "%");

        var tip = document.createElement("span");
        tip.className = "fmp-bar-tooltip";
        tip.textContent = spec.methodDefs[m].label + ": " + fmtVal(v, tab.unit);
        bar.appendChild(tip);
        bars.appendChild(bar);
      });

      group.appendChild(bars);
      var lbl = document.createElement("div");
      lbl.className = "fmp-bar-group-label";
      lbl.textContent = task;
      group.appendChild(lbl);
      plot.appendChild(group);
    });
    plotOuter.appendChild(plot);
    wrap.appendChild(plotOuter);
  }

  function buildChart(el) {
    var key = el.getAttribute("data-chart");
    var spec = CHARTS[key];
    if (!spec) return;

    var box = document.createElement("div");
    box.className = "chartbox";

    var head = document.createElement("div");
    head.className = "chartbox__head";
    var titleWrap = document.createElement("div");
    var title = document.createElement("div");
    title.className = "chartbox__title";
    title.textContent = spec.title || "";
    titleWrap.appendChild(title);
    if (spec.sub) {
      var sub = document.createElement("div");
      sub.className = "chartbox__sub";
      sub.textContent = spec.sub;
      titleWrap.appendChild(sub);
    }
    head.appendChild(titleWrap);
    box.appendChild(head);

    var activeIdx = 0;

    if (spec.tabs.length > 1) {
      var tabs = document.createElement("div");
      tabs.className = "fmp-metric-tabs";
      spec.tabs.forEach(function (tab, idx) {
        var btn = document.createElement("button");
        btn.className = "fmp-metric-tab" + (idx === 0 ? " active" : "");
        btn.textContent = tab.label;
        btn.addEventListener("click", function () {
          if (idx === activeIdx) return;
          activeIdx = idx;
          tabs.querySelectorAll(".fmp-metric-tab").forEach(function (b) { b.classList.remove("active"); });
          btn.classList.add("active");
          wrap.innerHTML = "";
          buildPlot(wrap, spec.tabs[activeIdx], spec);
        });
        tabs.appendChild(btn);
      });
      box.appendChild(tabs);
    }

    buildLegend(box, spec, box);

    var wrap = document.createElement("div");
    wrap.className = "fmp-chart-wrap";
    box.appendChild(wrap);
    buildPlot(wrap, spec.tabs[0], spec);

    el.appendChild(box);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // SECTION-LEVEL TABS (Ablations)
  // ─────────────────────────────────────────────────────────────────────────
  function initSecTabs() {
    document.querySelectorAll(".sec-tab-nav").forEach(function (nav) {
      var btns = nav.querySelectorAll(".sec-tab");
      var scope = nav.parentElement || document;
      function activate(target) {
        btns.forEach(function (b) { b.classList.toggle("active", b === target); });
        var targetId = target.getAttribute("data-panel");
        scope.querySelectorAll(".sec-panel").forEach(function (p) {
          if (p.id === targetId) {
            p.classList.remove("sec-panel-hidden");
            p.querySelectorAll(".fmp-bar-chart").forEach(function (c) { c.classList.add("in-view"); });
          } else {
            p.classList.add("sec-panel-hidden");
          }
        });
      }
      btns.forEach(function (btn) { btn.addEventListener("click", function () { activate(btn); }); });
    });
  }

  // ─────────────────────────────────────────────────────────────────────────
  // INIT
  // ─────────────────────────────────────────────────────────────────────────
  function initAll() {
    document.querySelectorAll(".fmp-bar-chart[data-chart]").forEach(buildChart);
    initSecTabs();

    var allCharts = document.querySelectorAll(".fmp-bar-chart");
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add("in-view"); io.unobserve(e.target); }
        });
      }, { threshold: 0.1 });
      allCharts.forEach(function (c) { io.observe(c); });
    } else {
      allCharts.forEach(function (c) { c.classList.add("in-view"); });
    }

    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var blocks = document.querySelectorAll(".reveal-block");
    if (reduce || !("IntersectionObserver" in window)) {
      blocks.forEach(function (b) { b.classList.add("is-visible"); }); return;
    }
    var rio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("is-visible"); rio.unobserve(e.target); }
      });
    }, { threshold: 0.08 });
    blocks.forEach(function (b) { rio.observe(b); });
  }

  if (document.readyState === "loading") { document.addEventListener("DOMContentLoaded", initAll); }
  else { initAll(); }
})();
