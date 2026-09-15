// Interactive PHR-VLA architecture configurator (method section).
(function () {
  "use strict";

  var root = document.getElementById("archviz");
  if (!root) return;

  var PRESETS = {
    wrist: {
      cam: "wrist", mode: "train", sr: "88.4", srNote: "+4.3 points over SmolVLA.",
      name: "Wrist-camera training (ours)",
      note: "The wrist camera supplies the planning-horizon target during training — the largest gain " +
        "(88.4% on LIBERO) because it captures the short-range, contact-centric interactions most relevant " +
        "to the task."
    },
    tp: {
      cam: "tp", mode: "train", sr: "86.8", srNote: "+2.7 points over SmolVLA.",
      name: "Third-person training",
      note: "A fixed third-person view alone still improves over SmolVLA, reaching 86.8% — but spends " +
        "capacity on background regions that evolve less informatively than the wrist view."
    },
    multicam: {
      cam: "multicam", mode: "train", sr: "88.1", srNote: "+4.0 points over SmolVLA.",
      name: "Multi-camera training",
      note: "Concatenating wrist and third-person latents reaches 88.1% — strong, but the added " +
        "third-person stream slightly dilutes the more informative wrist-camera signal."
    },
    inference: {
      cam: "wrist", mode: "infer", sr: "88.4", srNote: "Same deployed weights as wrist-camera training.",
      name: "Deployed policy (efficient inference)",
      note: "At deployment the future head and frozen encoder are dropped entirely. The action head runs " +
        "exactly as the base VLA on the same wrist + third-person inputs, so PHR-VLA adds zero latency or " +
        "memory cost."
    }
  };

  var elLat = document.getElementById("av-lat");
  var elLatNote = document.getElementById("av-lat-note");
  var elSr = document.getElementById("av-sr");
  var elSrNote = document.getElementById("av-sr-note");
  var elRegimeName = document.getElementById("av-regime-name");
  var elRegimeNote = document.getElementById("av-regime-note");

  var camBtns = Array.prototype.slice.call(root.querySelectorAll(".maskbtn[data-cam]"));
  var modeBtns = Array.prototype.slice.call(root.querySelectorAll(".maskbtn[data-mode]"));
  var presetBtns = Array.prototype.slice.call(root.querySelectorAll(".regimechip[data-preset]"));

  function setOn(id, on) {
    var el = document.getElementById(id);
    if (el) el.setAttribute("data-on", on ? "true" : "false");
  }

  function applyState(cam, mode) {
    var isTrain = mode === "train";

    // future head / frozen encoder / L_Align only active during training
    setOn("av-p-future", isTrain);
    setOn("av-p-future-out", isTrain);
    setOn("av-p-fe-out", isTrain);
    var futureOut = root.querySelector('.av-out[data-o="future"]');
    var feOut = root.querySelector('.av-out[data-o="fe"]');
    var alignOut = root.querySelector('.av-out[data-o="align"]');
    if (futureOut) futureOut.setAttribute("data-on", isTrain ? "true" : "false");
    if (feOut) feOut.setAttribute("data-on", isTrain ? "true" : "false");
    if (alignOut) alignOut.setAttribute("data-on", isTrain ? "true" : "false");

    // which camera(s) feed the frozen encoder
    setOn("av-p-fe-wrist", isTrain && (cam === "wrist" || cam === "multicam"));
    setOn("av-p-fe-tp", isTrain && (cam === "tp" || cam === "multicam"));

    // camera mask buttons: disabled + reflect selection only in training mode
    camBtns.forEach(function (b) {
      var active = isTrain && b.getAttribute("data-cam") === cam;
      b.setAttribute("aria-pressed", active ? "true" : "false");
      b.disabled = !isTrain;
    });
    modeBtns.forEach(function (b) {
      b.setAttribute("aria-pressed", b.getAttribute("data-mode") === mode ? "true" : "false");
    });

    // readouts
    elLat.innerHTML = '0<span class="unit">ms</span>';
    elLatNote.textContent = isTrain
      ? "Future head & frozen encoder are training-only."
      : "Future head & frozen encoder removed entirely.";

    // match a preset for the headline text + sr/name/note
    var presetKey = !isTrain ? "inference" : cam;
    var p = PRESETS[presetKey] || PRESETS.wrist;
    elSr.innerHTML = p.sr + '<span class="unit">%</span>';
    elSrNote.textContent = p.srNote;
    elRegimeName.textContent = p.name;
    elRegimeNote.textContent = p.note;

    presetBtns.forEach(function (b) {
      b.classList.toggle("active", b.getAttribute("data-preset") === presetKey);
    });
  }

  presetBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var p = PRESETS[btn.getAttribute("data-preset")];
      if (p) applyState(p.cam, p.mode);
    });
  });
  camBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      if (btn.disabled) return;
      applyState(btn.getAttribute("data-cam"), "train");
    });
  });
  modeBtns.forEach(function (btn) {
    var mode = btn.getAttribute("data-mode");
    btn.addEventListener("click", function () {
      var currentCam = root.querySelector('.maskbtn[data-cam][aria-pressed="true"]');
      applyState(currentCam ? currentCam.getAttribute("data-cam") : "wrist", mode);
    });
  });

  applyState("wrist", "train");
})();
