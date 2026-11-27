/* הר עציון לצעירים — אתר דמו */
(function () {
  const root = document.documentElement;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const LOGO = `<span class="logo-disc"><img src="assets/img/logo.png?v=202611270931" alt="" width="400" height="400"></span>`;

  const pages = [
    ["index.html", "ראשי"],
    ["about.html", "על הישיבה"],
    ["staff.html", "הצוות"],
    ["learning.html", "לימודים וחיים"],
    ["articles.html", "מאמרים"],
  ];
  const here = location.pathname.split("/").pop() || "index.html";

  // ---------- nav ----------
  const nav = document.createElement("header");
  nav.className = "nav";
  nav.innerHTML = `
    <div class="container">
      <a class="brand" href="index.html" aria-label="דף הבית">${LOGO}
        <span class="brand-text"><small>ישיבה תיכונית · אלון שבות</small><strong>הר עציון לצעירים</strong></span>
      </a>
      <button class="burger" aria-label="תפריט" aria-expanded="false"><span></span></button>
      <ul class="nav-links">
        ${pages.map(([h, t]) => `<li><a href="${h}" class="${h === here ? "active" : ""}">${t}</a></li>`).join("")}
        <li><a href="contact.html" class="nav-cta ${here === "contact.html" ? "active" : ""}">הרשמה וקשר</a></li>
      </ul>
    </div>`;
  document.body.prepend(nav);
  const burger = nav.querySelector(".burger");
  burger.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    burger.setAttribute("aria-expanded", open);
  });

  const progress = document.createElement("div");
  progress.className = "progress";
  progress.innerHTML = "<i></i>";
  document.body.prepend(progress);
  const bar = progress.firstChild;

  // ---------- footer ----------
  const footer = document.createElement("footer");
  footer.innerHTML = `
    <div class="container">
      <div class="footer-grid">
        <div>
          <a class="brand" href="index.html">${LOGO}<span class="brand-text"><small>ישיבה תיכונית פנימייתית</small><strong>הר עציון לצעירים</strong></span></a>
          <p>ישיבה תיכונית פנימייתית שהוקמה בשנת תשפ"ג לאור דרכם של ראשי ישיבת הר עציון המייסדים, הרב יהודה עמיטל והרב אהרן ליכטנשטיין זצ"ל, בליווי המכללה האקדמית הרצוג.</p>
        </div>
        <div>
          <h4>ניווט</h4>
          <ul>${pages.map(([h, t]) => `<li><a href="${h}">${t}</a></li>`).join("")}<li><a href="contact.html">הרשמה וקשר</a></li></ul>
        </div>
        <div>
          <h4>יצירת קשר</h4>
          <ul>
            <li>📍 אלון שבות, גוש עציון</li>
            <li>📞 02-9937300 שלוחה 0</li>
            <li>✉️ yt.haretzion@gmail.com</li>
          </ul>
        </div>
      </div>
      <div class="footer-word">הר עציון לצעירים</div>
      <div class="footer-bottom">
        <span>⚠️ אתר דמו בלבד — אינו האתר הרשמי של הישיבה. חלק מהתכנים להמחשה.</span>
        <span>"וטהר ליבנו לעבדך באמת"</span>
      </div>
    </div>`;
  document.body.append(footer);

  // ---------- smooth scroll (Lenis) ----------
  let lenis = null;
  if (!reduced && window.Lenis) {
    lenis = new Lenis({ duration: 1.15, easing: (t) => 1 - Math.pow(1 - t, 4), smoothWheel: true });
    const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
  }
  const OFFSET = -110;
  const scrollToEl = (el, immediate) => {
    if (lenis) lenis.scrollTo(el, { offset: OFFSET, immediate });
    else el.scrollIntoView({ behavior: immediate ? "auto" : "smooth" });
  };
  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const t = document.querySelector(a.getAttribute("href"));
    if (t) { e.preventDefault(); scrollToEl(t); history.replaceState(null, "", a.getAttribute("href")); }
  });

  // ---------- scroll-linked effects (rAF throttled) ----------
  const heroBg = document.querySelector(".hero-bg");
  const parallax = heroBg && !reduced && matchMedia("(min-width: 900px) and (hover: hover)").matches;
  let ticking = false;
  const update = () => {
    ticking = false;
    const y = window.scrollY;
    nav.classList.toggle("scrolled", y > 40);
    const h = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${h > 0 ? Math.min(1, y / h) : 0})`;
    if (parallax && y < innerHeight * 1.3) heroBg.style.transform = `translate3d(0, ${y * 0.22}px, 0) scale(1.08)`;
  };
  addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  update();

  // hero background fades in once loaded (no pop-in)
  if (heroBg) {
    const img = new Image();
    img.onload = () => heroBg.classList.add("loaded");
    img.src = "assets/img/yeshiva.jpg";
  }
  // every image fades in when decoded
  document.querySelectorAll("img").forEach((im) => {
    if (im.complete) return;
    im.classList.add("img-fade");
    im.addEventListener("load", () => im.classList.add("img-in"), { once: true });
  });

  // ---------- reveal ----------
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

  // ---------- counters ----------
  const cio = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target, end = +el.dataset.count, pre = el.dataset.prefix || "", suf = el.dataset.suffix || "";
      const t0 = performance.now(), dur = 1800;
      const step = (t) => {
        const p = Math.min(1, (t - t0) / dur), v = Math.round(end * (1 - Math.pow(1 - p, 4)));
        el.textContent = pre + v + suf;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      cio.unobserve(el);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll("[data-count]").forEach((el) => cio.observe(el));

  // ---------- schedule tabs ----------
  document.querySelectorAll("[data-tabs]").forEach((wrap) => {
    const btns = wrap.querySelectorAll("[data-tab]");
    const panes = wrap.querySelectorAll("[data-pane]");
    const pill = wrap.querySelector(".tab-pill");
    const movePill = (b) => { if (pill) { pill.style.width = b.offsetWidth + "px"; pill.style.transform = `translateX(${b.offsetLeft}px)`; } };
    btns.forEach((b) => b.addEventListener("click", () => {
      btns.forEach((x) => x.classList.toggle("on", x === b));
      panes.forEach((p) => p.classList.toggle("on", p.dataset.pane === b.dataset.tab));
      movePill(b);
    }));
    const first = wrap.querySelector("[data-tab].on") || btns[0];
    requestAnimationFrame(() => movePill(first));
    addEventListener("resize", () => movePill(wrap.querySelector("[data-tab].on")));
  });

  // ---------- demo forms ----------
  document.querySelectorAll("form.demo-form").forEach((f) => {
    f.addEventListener("submit", (ev) => {
      ev.preventDefault();
      let t = document.querySelector(".toast");
      if (!t) { t = document.createElement("div"); t.className = "toast"; document.body.append(t); }
      t.textContent = "✨ זהו אתר דמו — הטופס לא נשלח בפועל. לפרטים אמיתיים: 02-9937300 שלוחה 0";
      t.classList.add("show");
      setTimeout(() => t.classList.remove("show"), 4200);
    });
  });

  // ---------- smooth page-to-page transitions ----------
  // Browsers with cross-document View Transitions get a native cross-fade (see CSS).
  // Others: fade the page out before leaving.
  const nativeVT = "onpagereveal" in window;
  if (!nativeVT && !reduced) {
    document.addEventListener("click", (e) => {
      const a = e.target.closest("a[href]");
      if (!a || a.target === "_blank" || e.metaKey || e.ctrlKey || e.shiftKey) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || url.pathname === location.pathname) return;
      e.preventDefault();
      root.classList.add("leaving");
      setTimeout(() => { location.href = url.href; }, 320);
    });
    addEventListener("pageshow", (e) => { if (e.persisted) root.classList.remove("leaving"); });
  }

  // ---------- reveal page once fonts are ready (no font-swap jump) ----------
  const ready = () => {
    if (root.classList.contains("ready")) return;
    root.classList.add("ready");
    try { sessionStorage.setItem("hey-visited", "1"); } catch (e) {}
    // arriving with a hash: glide to it instead of jumping
    if (location.hash) {
      const t = document.querySelector(location.hash);
      if (t) { if (lenis) lenis.scrollTo(0, { immediate: true }); else scrollTo(0, 0); setTimeout(() => scrollToEl(t), 450); }
    }
  };
  if (location.hash && "scrollRestoration" in history) history.scrollRestoration = "manual";
  const fontsP = document.fonts && document.fonts.load
    ? Promise.all([
        document.fonts.load('900 1em "Frank Ruhl Libre"', "הר"),
        document.fonts.load('700 1em "Frank Ruhl Libre"', "הר"),
        document.fonts.load('400 1em "Heebo"', "הר"),
        document.fonts.load('700 1em "Heebo"', "הר"),
      ])
    : Promise.resolve();
  Promise.race([fontsP, new Promise((r) => setTimeout(r, 1600))]).then(() => requestAnimationFrame(ready));
})();
