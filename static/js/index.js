document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("theme-toggle");
  if (btn) {
    const root = document.documentElement;
    btn.addEventListener("click", () => {
      const next = root.getAttribute("data-theme") === "night" ? "day" : "night";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("phrvla-theme", next); } catch (e) {}
    });
  }

  // ── Video lightbox: enlarges a clip to ~half the viewport instead of ──
  // ── native fullscreen (which stretched our compressed clips edge-to- ──
  // ── edge and made the quality drop). ──────────────────────────────────
  const overlay = document.createElement("div");
  overlay.className = "video-lightbox";
  overlay.innerHTML =
    '<button type="button" class="video-lightbox__close" aria-label="Close">&times;</button>' +
    '<div class="video-lightbox__holder"></div>';
  document.body.appendChild(overlay);
  const holder = overlay.querySelector(".video-lightbox__holder");

  function openLightbox(video) {
    if (!video) return;
    video._lbParent = video.parentNode;
    video._lbNext = video.nextSibling;
    video._lbRate = video.playbackRate;
    holder.appendChild(video);
    video.controls = true;
    video.playbackRate = 1;
    overlay.classList.add("open");
  }
  function closeLightbox() {
    const video = holder.firstElementChild;
    if (video && video._lbParent) {
      video._lbParent.insertBefore(video, video._lbNext);
      video.controls = false;
      video.playbackRate = video._lbRate || 1;
    }
    overlay.classList.remove("open");
  }
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay || e.target.closest(".video-lightbox__close")) closeLightbox();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLightbox();
  });

  document.querySelectorAll(".video-card-media").forEach((media) => {
    media.addEventListener("click", () => openLightbox(media.querySelector("video")));
  });

  const stageExpand = document.getElementById("stage-expand");
  if (stageExpand) {
    stageExpand.addEventListener("click", () => {
      openLightbox(document.querySelector(".stage__video"));
    });
  }

  const applyFastRate = (video) => {
    const setRate = () => { video.playbackRate = 4; };
    setRate();
    ["loadedmetadata", "play", "playing", "seeked"].forEach((evt) => {
      video.addEventListener(evt, setRate);
    });
  };

  const stageVideo = document.querySelector(".stage__video");
  if (stageVideo) applyFastRate(stageVideo);

  // Task-strip clips are lazy: with 200+ clips on the page, only decode the
  // handful actually scrolled into view (and only on the active tab, since
  // hidden panels have no layout box and never intersect).
  const stripVideos = document.querySelectorAll(".taskstrip video");
  stripVideos.forEach(applyFastRate);
  if ("IntersectionObserver" in window) {
    const lazyIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const v = entry.target;
          if (entry.isIntersecting) {
            v.play().catch(() => {});
          } else {
            v.pause();
          }
        });
      },
      { threshold: 0.35 }
    );
    stripVideos.forEach((v) => lazyIO.observe(v));
  } else {
    stripVideos.forEach((v) => { v.play().catch(() => {}); });
  }

  // Sliding task strips: auto-scroll on a continuous loop, recycling the
  // leading card to the end as it passes. Driven by a CSS transform on an
  // inner track rather than native scrollLeft, which the browser silently
  // clamps at (scrollWidth - clientWidth) — that clamp was the bug where
  // short strips would stall partway instead of cycling through every card.
  document.querySelectorAll(".taskstrip").forEach((strip) => {
    if (!strip.dataset.autoscroll) return;
    const track = strip.querySelector(".taskstrip__track");
    if (!track || track.children.length < 2) return;
    const speed = 45; // px/sec
    let offset = 0;
    let paused = false;
    let last = null;
    strip.addEventListener("mouseenter", () => { paused = true; });
    strip.addEventListener("mouseleave", () => { paused = false; });
    function step(ts) {
      if (last === null) last = ts;
      const dt = ts - last;
      last = ts;
      if (!paused && !overlay.classList.contains("open")) {
        offset += (speed * dt) / 1000;
        const first = track.firstElementChild;
        if (first) {
          const cardSpan = first.getBoundingClientRect().width + 14;
          if (offset >= cardSpan) {
            offset -= cardSpan;
            track.appendChild(first);
          }
        }
        track.style.transform = "translateX(-" + offset + "px)";
      }
      requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  });
});
