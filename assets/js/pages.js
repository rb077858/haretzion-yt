/* רינדור תוכן דינמי: מאמרים, חזון, אירועי הרשמה */
(function () {
  const A = window.HEY_ARTICLES || [];
  const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const words = (a) => a.paras.join(" ").split(/\s+/).length;
  const mins = (a) => Math.max(1, Math.round(words(a) / 180));
  const excerpt = (a, n = 170) => { const t = a.paras.join(" "); return t.length > n ? t.slice(0, n).replace(/\s+\S*$/, "") + "…" : t; };

  // group consecutive short lines (poems / verses) into one block
  function renderParas(paras) {
    const out = []; let verse = [];
    const flush = () => { if (verse.length) { out.push(`<p class="verse">${verse.map(esc).join("<br>")}</p>`); verse = []; } };
    paras.forEach((p) => {
      if (p.startsWith("h:")) { flush(); out.push(`<h3>${esc(p.slice(2))}</h3>`); return; }
      if (/^[\s*•.…·]+$/.test(p)) { flush(); out.push(`<div class="sep" aria-hidden="true">✦ ✦ ✦</div>`); return; }
      const short = (p.length < 60 && !/[.?!:]["'״]?$/.test(p.trim())) || (verse.length && p.length < 30);
      if (short) verse.push(p); else { flush(); out.push(`<p>${esc(p)}</p>`); }
    });
    flush();
    return out.join("\n");
  }

  // ---------- article cards (articles.html, index.html) ----------
  document.querySelectorAll("[data-article-list]").forEach((el) => {
    const limit = +el.dataset.articleList || A.length;
    el.innerHTML = A.slice(0, limit).map((a, i) => `
      <a class="article reveal ${i % 3 === 1 ? "d1" : i % 3 === 2 ? "d2" : ""} ${i === 0 && !el.dataset.noFeature ? "wide" : ""}" href="article.html?a=${a.id}">
        <div class="meta"><span class="cat">${a.tag}</span><span>הרב עמיחי גורדין</span><span>· ${mins(a)} דק' קריאה</span></div>
        <h3>${esc(a.title)}</h3>
        <p>${esc(excerpt(a, i === 0 ? 260 : 160))}</p>
        <span class="more">לקריאת המאמר <span class="arrow">←</span></span>
      </a>`).join("");
  });

  // ---------- single article reader ----------
  const reader = document.querySelector("[data-reader]");
  if (reader) {
    const id = new URLSearchParams(location.search).get("a");
    const idx = Math.max(0, A.findIndex((a) => a.id === id));
    const a = A[idx];
    document.title = `${a.title} | הר עציון לצעירים (דמו)`;
    document.querySelector("[data-a-title]").textContent = a.title;
    document.querySelector("[data-a-meta]").innerHTML = `<span class="cat">${a.tag}</span> מאת ראש הישיבה, הרב עמיחי גורדין · ${mins(a)} דקות קריאה`;
    if (/^['"״׳]/.test(a.paras[0])) reader.classList.add("no-drop");
    reader.innerHTML = renderParas(a.paras) +
      `<div class="sign">— הרב עמיחי גורדין</div>
       <p class="form-note">המאמר פורסם במקור באתר הישיבה. <a href="${a.src}" target="_blank" rel="noopener">למקור ←</a></p>`;
    const prev = A[(idx - 1 + A.length) % A.length], next = A[(idx + 1) % A.length];
    document.querySelector("[data-a-nav]").innerHTML = `
      <a class="nav-card" href="article.html?a=${prev.id}"><small>→ המאמר הקודם</small><b>${esc(prev.title)}</b></a>
      <a class="nav-card next" href="article.html?a=${next.id}"><small>המאמר הבא ←</small><b>${esc(next.title)}</b></a>`;
    const more = document.querySelector("[data-a-more]");
    if (more) {
      const others = A.filter((x) => x.id !== a.id).slice(0, 3);
      more.innerHTML = others.map((x, i) => `
        <a class="article reveal d${i}" href="article.html?a=${x.id}">
          <div class="meta"><span class="cat">${x.tag}</span><span>${mins(x)} דק' קריאה</span></div>
          <h3>${esc(x.title)}</h3><p>${esc(excerpt(x, 120))}</p><span class="more">לקריאה ←</span></a>`).join("");
    }
  }

  // ---------- vision ----------
  const vision = document.querySelector("[data-vision]");
  if (vision && window.HEY_VISION) {
    const V = window.HEY_VISION.slice(1); // drop "אנחנו מאמינים" (page title)
    const toc = [];
    let html = `<blockquote class="epigraph">${esc(V[0].replace(/\s*–\s*$/, ""))}<cite>${esc(V[1].replace(/[()]/g, ""))}</cite></blockquote>`;
    const body = [];
    V.slice(2).forEach((p) => {
      const m = p.match(/^([א-ה])\.\s*(.+?):?$/);
      if (m && p.length < 40) { toc.push([m[1], m[2]]); body.push(`h:${p}`); }
      else body.push(p);
    });
    let n = 0;
    html += renderParas(body).replace(/<h3>/g, () => `<h3 id="ch-${toc[n++][0]}"><span class="ch-num">${toc[n - 1][0]}</span>`);
    vision.innerHTML = html + `<div class="sign">— הרב עמיחי גורדין, ראש הישיבה</div>`;
    const tocEl = document.querySelector("[data-vision-toc]");
    if (tocEl) tocEl.innerHTML = toc.map(([l, t]) => `<a href="#ch-${l}"><span>${l}</span>${esc(t.replace(/[:"]/g, ""))}</a>`).join("");
  }

  // ---------- events + countdown ----------
  const EVENTS = [
    { d: "2026-12-22T20:30", t: "ערב היכרות להורים", w: "חדר האוכל הקטן, ישיבת הר עציון", link: "https://forms.gle/DAyJSUjvDC2LN2dy5" },
    { d: "2027-01-07T16:00", t: "פתיחת ההרשמה לשבתות ההיכרות", w: "הרשמה מקוונת", link: "https://forms.gle/y3oPgfcyRkWHPr2T8" },
    { d: "2027-01-12T20:30", t: "ערב היכרות להורים", w: "חדר האוכל הקטן, ישיבת הר עציון", link: "https://forms.gle/DAyJSUjvDC2LN2dy5" },
    { d: "2027-01-15T14:00", t: "שבת היכרות — פרשת בא", w: "ז'–ח' שבט תשפ\"ז, בישיבה", link: "https://forms.gle/y3oPgfcyRkWHPr2T8" },
    { d: "2027-01-26T09:00", t: "יום ההרשמה לשנת תשפ\"ח", w: "יח' שבט תשפ\"ז", link: "https://rishum.app/hemed" },
    { d: "2027-02-05T14:00", t: "שבת היכרות — פרשת משפטים", w: "כח'–כט' שבט תשפ\"ז, בישיבה", link: "https://forms.gle/y3oPgfcyRkWHPr2T8" },
    { d: "2027-02-09T09:00", t: "מבדקי גמרא וראיונות", w: "ב' אדר א' תשפ\"ז", link: null },
  ];
  const now = new Date();
  const next = EVENTS.find((e) => new Date(e.d) > now);
  const cd = document.querySelector("[data-countdown]");
  if (cd) {
    if (!next) { cd.closest(".countdown-wrap").remove(); }
    else {
      cd.parentElement.querySelector("[data-next-title]").textContent = next.t;
      cd.parentElement.querySelector("[data-next-where]").textContent =
        new Date(next.d).toLocaleDateString("he-IL", { weekday: "long", day: "numeric", month: "long", year: "numeric" }) + " · " + next.w;
      const tick = () => {
        let s = Math.max(0, (new Date(next.d) - new Date()) / 1000);
        const v = [Math.floor(s / 86400), Math.floor((s % 86400) / 3600), Math.floor((s % 3600) / 60), Math.floor(s % 60)];
        cd.querySelectorAll("b").forEach((b, i) => { const t = String(v[i]).padStart(2, "0"); if (b.textContent !== t) b.textContent = t; });
      };
      tick(); setInterval(tick, 1000);
    }
  }
  document.querySelectorAll("[data-event-date]").forEach((el) => {
    if (new Date(el.dataset.eventDate) < now) el.classList.add("past");
  });
})();
