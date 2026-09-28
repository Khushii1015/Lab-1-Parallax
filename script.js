/* =========================================================
   The Climb — scroll-driven story
   - One passive scroll listener, throttled with requestAnimationFrame
   - Writes CSS transforms / CSS variables; CSS does the rendering
   - IntersectionObserver for reveals, counters and active nav dots
   ========================================================= */
(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v));

  /* ---------- Build stars ---------- */
  const starsLayer = $(".stars");
  const starCount = window.innerWidth < 700 ? 80 : 160;
  const frag = document.createDocumentFragment();
  for (let i = 0; i < starCount; i++) {
    const s = document.createElement("span");
    const size = Math.random() * 2 + 1;
    s.className = "star";
    s.style.width = s.style.height = `${size}px`;
    s.style.left = `${Math.random() * 100}%`;
    s.style.top = `${Math.random() * 75}%`;
    s.style.setProperty("--t", `${2 + Math.random() * 3}s`);
    s.style.animationDelay = `${Math.random() * 3}s`;
    frag.appendChild(s);
  }
  starsLayer.appendChild(frag);

  /* ---------- Split chapter-1 text into word spans ---------- */
  $$("[data-words]").forEach((el) => {
    const words = el.textContent.trim().split(/\s+/);
    el.textContent = "";
    words.forEach((word, i) => {
      const span = document.createElement("span");
      span.textContent = word;
      el.appendChild(span);
      if (i < words.length - 1) el.appendChild(document.createTextNode(" "));
    });
  });

  /* ---------- Cache elements ---------- */
  const progressBar = $(".progress__bar");
  const skies = {
    day: $(".sky--day"),
    dusk: $(".sky--dusk"),
    night: $(".sky--night"),
  };
  const sun = $(".sun");
  const moon = $(".moon");
  const parallaxEls = $$("[data-speed]");
  const fadeEls = $$("[data-fade]");
  const clouds = $$("[data-drift]");
  const pins = $$(".pin");
  const wordSpans = $$("[data-words] span");
  const ridgeTrack = $(".ridge__track");
  const mountains = $$(".mountain");

  let vw = window.innerWidth;
  let vh = window.innerHeight;
  let maxScroll = 1;

  function measure() {
    vw = window.innerWidth;
    vh = window.innerHeight;
    maxScroll = Math.max(1, document.documentElement.scrollHeight - vh);
    // How far the horizontal track needs to travel
    const travel = Math.max(0, ridgeTrack.scrollWidth - vw);
    ridgeTrack.style.setProperty("--max", travel);
  }

  /* ---------- Main scroll update ---------- */
  function update() {
    const y = window.scrollY;
    const g = clamp(y / maxScroll); // global story progress 0 → 1

    // Progress bar
    progressBar.style.transform = `scaleX(${g})`;

    // Sky cross-fade: dawn (base) → day → dusk → night
    const day = clamp((g - 0.06) / 0.2);
    const dusk = clamp((g - 0.62) / 0.18);
    const night = clamp((g - 0.84) / 0.12);
    skies.day.style.opacity = day;
    skies.dusk.style.opacity = dusk;
    skies.night.style.opacity = night;
    starsLayer.style.opacity = night;

    // Sun travels an arc across the sky, then sets
    const t = clamp(g / 0.86);
    const sunSize = sun.offsetWidth;
    const sunX = vw * (0.08 + 0.84 * t) - sunSize / 2;
    const sunY = vh * (0.78 - 0.62 * Math.sin(Math.PI * t)) - sunSize / 2;
    sun.style.transform = `translate3d(${sunX}px, ${sunY}px, 0)`;
    sun.style.opacity = 1 - clamp((g - 0.8) / 0.08);

    // Mountains darken into silhouettes as night falls
    mountains.forEach((m) => (m.style.filter = `brightness(${1 - night * 0.55})`));

    // Moon rises at night
    const moonX = vw * 0.72;
    const moonY = vh * (0.55 - 0.35 * night);
    moon.style.transform = `translate3d(${moonX}px, ${moonY}px, 0)`;
    moon.style.opacity = night;

    // Vertical parallax: each layer moves at its own speed
    if (!reduceMotion) {
      // Hero text moves with raw scroll; mountain layers sink gradually over the
      // whole story (you are climbing above them), nearer layers sinking faster.
      parallaxEls.forEach((el) => {
        const speed = parseFloat(el.dataset.speed);
        const offset = el.classList.contains("mountain") ? g * speed * vh * 0.4 : y * speed;
        el.style.transform = `translate3d(0, ${offset}px, 0)`;
      });

      // Clouds drift sideways and wrap around the screen
      clouds.forEach((el) => {
        const drift = parseFloat(el.dataset.drift);
        const base = (parseFloat(getComputedStyle(el).getPropertyValue("--base")) / 100) * vw;
        const span = vw + 400;
        const x = ((((base + y * drift) % span) + span) % span) - 300;
        el.style.transform = `translate3d(${x}px, 0, 0)`;
        el.style.opacity = 1 - night * 0.8; // clouds fade into the night sky
      });
    }

    // Hero fades out as you leave it
    const heroFade = 1 - clamp(y / (vh * 0.7));
    fadeEls.forEach((el) => (el.style.opacity = heroFade));

    // Pinned sections: expose local progress as --p for CSS transforms
    pins.forEach((pin) => {
      const rect = pin.getBoundingClientRect();
      const p = clamp(-rect.top / (rect.height - vh));
      pin.style.setProperty("--p", p.toFixed(4));
      pin._p = p;
    });

    // Chapter 1: light words progressively
    const wordsPin = pins[0];
    const lit = reduceMotion ? wordSpans.length : Math.ceil(clamp(wordsPin._p * 1.2) * wordSpans.length);
    wordSpans.forEach((span, i) => span.classList.toggle("lit", i < lit));

    ticking = false;
  }

  let ticking = false;
  function onScroll() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", () => {
    measure();
    onScroll();
  });

  /* ---------- Reveal on scroll ---------- */
  const revealObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2, rootMargin: "0px 0px -10% 0px" }
  );
  $$(".reveal").forEach((el) => revealObserver.observe(el));

  /* ---------- Count-up numbers ---------- */
  const formatter = new Intl.NumberFormat("en-CA");
  function countUp(el) {
    const target = parseInt(el.dataset.count, 10);
    if (reduceMotion) {
      el.textContent = formatter.format(target);
      return;
    }
    const duration = 1800;
    const start = performance.now();
    const step = (now) => {
      const t = clamp((now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      el.textContent = formatter.format(Math.round(target * eased));
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
  const countObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          countUp(entry.target);
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 }
  );
  $$("[data-count]").forEach((el) => countObserver.observe(el));

  /* ---------- Active chapter dot ---------- */
  const dots = $$(".dots a");
  const chapterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        dots.forEach((d) => {
          const active = d.getAttribute("href") === `#${id}`;
          d.classList.toggle("active", active);
          if (active) d.setAttribute("aria-current", "true");
          else d.removeAttribute("aria-current");
        });
      });
    },
    { rootMargin: "-50% 0px -50% 0px" }
  );
  $$("[data-chapter]").forEach((sec) => chapterObserver.observe(sec));

  /* ---------- Back to top ---------- */
  $("#back-to-top").addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  });

  /* ---------- Init ---------- */
  measure();
  update();
  window.addEventListener("load", () => {
    measure();
    update();
  });
})();
