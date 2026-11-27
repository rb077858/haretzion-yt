/* הר עציון לצעירים — אתר דמו */
(function () {
  const LOGO = `
  <svg viewBox="0 0 64 64" aria-hidden="true">
    <defs><linearGradient id="lg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#4fa8e0"/><stop offset="1" stop-color="#d4ad57"/></linearGradient></defs>
    <circle cx="32" cy="32" r="30" fill="none" stroke="url(#lg)" stroke-width="2.5"/>
    <path d="M32 54 C32 40 31 30 33 16" stroke="#fff" stroke-width="2.6" fill="none" stroke-linecap="round"/>
    <path d="M32.5 30 C26 27 21 22 18 15" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M32.8 24 C38 21 43 17 46 11" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round"/>
    <g fill="#4fa8e0">
      <ellipse cx="17" cy="13" rx="3.2" ry="5" transform="rotate(-35 17 13)"/>
      <ellipse cx="23" cy="21" rx="2.6" ry="4.4" transform="rotate(-60 23 21)"/>
      <ellipse cx="46.5" cy="9.5" rx="3.2" ry="5" transform="rotate(35 46.5 9.5)"/>
      <ellipse cx="41" cy="18" rx="2.6" ry="4.4" transform="rotate(60 41 18)"/>
      <ellipse cx="33" cy="12" rx="2.8" ry="4.8"/>
    </g>
    <g fill="#d4ad57"><circle cx="27" cy="16" r="2"/><circle cx="38" cy="13" r="2"/><circle cx="36" cy="27" r="1.8"/></g>
  </svg>`;

  const pages = [
    ["index.html", "ראשי"],
    ["about.html", "על הישיבה"],
    ["staff.html", "הצוות"],
    ["learning.html", "לימודים וחיים"],
    ["articles.html", "מאמרים"],
  ];
  const here = (location.pathname.split("/").pop() || "index.html");

  // --- nav ---
  const nav = document.createElement("header");
  nav.className = "nav" + (document.body.dataset.solidNav ? " solid" : "");
  nav.innerHTML = `
    <div class="container">
      <a class="brand" href="index.html" aria-label="דף הבית">${LOGO}
        <span class="brand-text"><small>ישיבה תיכונית · אלון שבות</small><strong>הר עציון לצעירים</strong></span>
      </a>
      <button class="burger" aria-label="תפריט"><span></span></button>
      <ul class="nav-links">
        ${pages.map(([h, t]) => `<li><a href="${h}" class="${h === here ? "active" : ""}">${t}</a></li>`).join("")}
        <li><a href="contact.html" class="nav-cta ${here === "contact.html" ? "active" : ""}">הרשמה וקשר</a></li>
      </ul>
    </div>`;
  document.body.prepend(nav);
  nav.querySelector(".burger").addEventListener("click", () => nav.classList.toggle("open"));

  const progress = document.createElement("div");
  progress.className = "progress";
  progress.innerHTML = "<i></i>";
  document.body.prepend(progress);

  // --- footer ---
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

  // --- scroll effects ---
  const heroBg = document.querySelector(".hero-bg");
  const bar = progress.querySelector("i");
  const onScroll = () => {
    const y = window.scrollY;
    nav.classList.toggle("scrolled", y > 40);
    const h = document.documentElement.scrollHeight - innerHeight;
    bar.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";
    if (heroBg && y < innerHeight * 1.2) heroBg.style.transform = `scale(1.08) translateY(${y * 0.25}px)`;
  };
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // --- reveal ---
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    });
  }, { threshold: 0.14 });
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

  // --- counters ---
  const cio = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target, end = +el.dataset.count, pre = el.dataset.prefix || "", suf = el.dataset.suffix || "";
      const t0 = performance.now(), dur = 1600;
      const step = (t) => {
        const p = Math.min(1, (t - t0) / dur), v = Math.round(end * (1 - Math.pow(1 - p, 3)));
        el.textContent = pre + v + suf;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      cio.unobserve(el);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll("[data-count]").forEach((el) => cio.observe(el));

  // --- demo forms ---
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
})();
