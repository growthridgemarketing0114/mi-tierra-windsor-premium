(function () {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("site-nav");

  function setOpen(open) {
    if (!toggle || !nav) return;
    nav.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }

  if (toggle && nav) {
    setOpen(false);

    toggle.addEventListener("click", (e) => {
      e.stopPropagation();
      setOpen(!nav.classList.contains("open"));
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => setOpen(false));
    });

    document.addEventListener("click", (e) => {
      if (!nav.classList.contains("open")) return;
      if (nav.contains(e.target) || toggle.contains(e.target)) return;
      setOpen(false);
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") setOpen(false);
    });
  }

  /* Accordion (menu mobile) */
  document.querySelectorAll("[data-acc]").forEach((item) => {
    const btn = item.querySelector(".acc-trigger");
    if (!btn) return;
    btn.addEventListener("click", () => {
      const open = item.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
  });

  /* Sticky category active state */
  const catLinks = document.querySelectorAll(".menu-cats a");
  const sections = [];
  catLinks.forEach((a) => {
    const id = a.getAttribute("href");
    if (id && id.startsWith("#")) {
      const el = document.querySelector(id);
      if (el) sections.push({ el, a });
    }
  });
  if (sections.length && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const match = sections.find((s) => s.el === entry.target);
          if (!match) return;
          catLinks.forEach((l) => l.classList.remove("is-active"));
          match.a.classList.add("is-active");
        });
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: 0 }
    );
    sections.forEach((s) => io.observe(s.el));
  }

  /* Reveal on scroll */
  const reveals = document.querySelectorAll(".reveal");
  if (reveals.length && "IntersectionObserver" in window) {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      reveals.forEach((el) => el.classList.add("is-in"));
    } else {
      const rio = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-in");
              rio.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
      );
      reveals.forEach((el) => rio.observe(el));
    }
  } else {
    reveals.forEach((el) => el.classList.add("is-in"));
  }

  /* Hero ready for gentle zoom settle */
  requestAnimationFrame(() => {
    document.querySelectorAll(".hero-cinematic").forEach((h) => h.classList.add("is-ready"));
  });
})();


/* Joey 2026-09-20: split-hero dish cycle (Paragon-style) */
(function () {
  function startHeroCycle() {
    const slides = Array.from(document.querySelectorAll(".hero-visual [data-hero-slide]"));
    const caption = document.querySelector("[data-hero-caption]");
    if (slides.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const short = [
      "Enchiladas verdes",
      "Street tacos",
      "Nachos",
      "Taco salad",
      "Cheesecake",
      "Smothered burrito",
      "Churros",
      "Cheese enchiladas",
      "Sopaipillas",
    ];

    let i = slides.findIndex((el) => el.classList.contains("is-active"));
    if (i < 0) i = 0;
    slides.forEach((el, n) => el.classList.toggle("is-active", n === i));
    if (caption) caption.textContent = short[i] || "";

    window.setInterval(function () {
      slides[i].classList.remove("is-active");
      i = (i + 1) % slides.length;
      slides[i].classList.add("is-active");
      if (caption) caption.textContent = short[i] || "";
    }, 4000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startHeroCycle);
  } else {
    startHeroCycle();
  }
})();
