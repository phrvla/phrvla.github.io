(function () {
  function smoothScrollTo(id) {
    var target = id === "top" ? document.body : document.getElementById(id);
    if (!target) return;
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function initRail() {
    var rail = document.querySelector(".rail__links");
    if (!rail) return;
    var links = Array.prototype.slice.call(rail.querySelectorAll("a[href^='#']"));
    if (!links.length || !("IntersectionObserver" in window)) return;

    var targets = links
      .map(function (a) { return document.getElementById(a.getAttribute("href").slice(1)); })
      .filter(Boolean);

    function setActive(id) {
      links.forEach(function (a) {
        a.classList.toggle("active", a.getAttribute("href") === "#" + id);
      });
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    }, { rootMargin: "-30% 0px -55% 0px", threshold: 0.01 });

    targets.forEach(function (t) { observer.observe(t); });
  }

  function initRailOverHero() {
    var rail = document.querySelector(".rail");
    var stage = document.querySelector(".stage");
    if (!rail || !stage || !("IntersectionObserver" in window)) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        rail.classList.toggle("is-visible", !entry.isIntersecting);
      });
    }, { threshold: 0 });

    observer.observe(stage);
  }

  function initProgress() {
    var progress = document.createElement("div");
    progress.className = "research-progress";
    progress.setAttribute("aria-hidden", "true");
    document.body.appendChild(progress);

    function update() {
      var max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      progress.style.transform = "scaleX(" + Math.min(1, window.scrollY / max) + ")";
    }
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
  }

  function initReveal() {
    var items = document.querySelectorAll(
      ".highlight-card, .method-step, .chart-card, .fmp-chart-wrap, .fig-wrap, .module-card, .taxonomy-card, .mini-figure, .paper-browser"
    );
    if (!("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("research-visible"); });
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("research-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    items.forEach(function (el) {
      el.classList.add("research-reveal");
      observer.observe(el);
    });
  }

  function initTopButton() {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "research-top";
    btn.setAttribute("aria-label", "Back to top");
    btn.textContent = "↑";
    btn.addEventListener("click", function () { smoothScrollTo("top"); });
    document.body.appendChild(btn);

    function update() {
      btn.classList.toggle("visible", window.scrollY > 600);
    }
    window.addEventListener("scroll", update, { passive: true });
    update();
  }

  function initLightbox() {
    var media = document.querySelectorAll(".fig-wrap img, .survey-hero-card img, .mini-figure img, .method-visual-card img");
    if (!media.length) return;

    var overlay = document.createElement("div");
    overlay.className = "research-lightbox";
    overlay.innerHTML = '<button type="button" class="research-lightbox-close" aria-label="Close">×</button><img alt="">';
    document.body.appendChild(overlay);

    var img = overlay.querySelector("img");
    function close() { overlay.classList.remove("open"); }
    overlay.addEventListener("click", function (event) {
      if (event.target === overlay || event.target.closest(".research-lightbox-close")) close();
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") close();
    });

    media.forEach(function (el) {
      el.classList.add("research-clickable-media");
      el.addEventListener("click", function () {
        img.src = el.currentSrc || el.src;
        img.alt = el.alt || "";
        overlay.classList.add("open");
      });
    });
  }

  function initAccent() {
    var link = document.querySelector("a");
    if (!link) return;
    var color = window.getComputedStyle(link).color;
    if (color) document.documentElement.style.setProperty("--research-accent", color);
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.body.classList.add("research-polished");
    initAccent();
    initProgress();
    initRail();
    initRailOverHero();
    initReveal();
    initTopButton();
    initLightbox();
  });
})();
