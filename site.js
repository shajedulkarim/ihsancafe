// ---- Config: fill these when the owner confirms. null = not available yet. ----
const CONFIG = {
  timezone: "Asia/Muscat",
  instagram: "https://www.instagram.com/ihsancafe/",
  instagramDM: "https://ig.me/m/ihsancafe",
  phone: null,        // e.g. "+968XXXXXXXX"
  whatsapp: null,     // digits only, e.g. "968XXXXXXXX"
  mapsUrl: null,      // Google Maps share link
  address: null,
  // hours[0..6] (Sun..Sat) = [["HH:MM","HH:MM"], ...] or null when closed. null overall = unknown.
  hours: null
};

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

// ---- Prices ----
const fmt = p => (p == null ? "price soon" : `${MENU.currency} ${p.toFixed(3)}`);

// ---- Menu render ----
(function menu() {
  const tabs = $("#tabs"), panels = $("#panels");
  MENU.categories.forEach((c, i) => {
    const b = document.createElement("button");
    b.className = "tab"; b.role = "tab"; b.id = "tab-" + c.id;
    b.setAttribute("aria-controls", "panel-" + c.id);
    b.textContent = c.title;
    b.addEventListener("click", () => select(c.id, true));
    tabs.appendChild(b);

    const p = document.createElement("div");
    p.className = "panel"; p.role = "tabpanel"; p.id = "panel-" + c.id;
    p.setAttribute("aria-labelledby", b.id);
    const items = c.items.map(it => `
      <li class="item">
        <div class="item-main">
          <h4>${it.name}${it.tag ? ` <span class="chip">${it.tag}</span>` : ""}</h4>
          <p>${it.desc}</p>
        </div>
        <div class="price${it.price == null ? " tba" : ""}">${fmt(it.price)}</div>
      </li>`).join("");
    p.innerHTML = `
      <figure class="shot"><img src="${c.photo.src}" alt="${c.photo.alt}" loading="lazy"></figure>
      <p class="cat-note">${c.note}</p>
      ${items ? `<ul class="items">${items}</ul>` : ""}`;
    panels.appendChild(p);
  });

  function select(id, user) {
    $$(".tab").forEach(t => {
      const on = t.id === "tab-" + id;
      t.classList.toggle("on", on); t.setAttribute("aria-selected", on);
      if (on) {
        const left = t.offsetLeft - (tabs.clientWidth - t.offsetWidth) / 2;
        tabs.scrollTo({ left, behavior: user ? "smooth" : "auto" });
      }
    });
    $$(".panel").forEach(p => p.hidden = p.id !== "panel-" + id);
  }
  select(MENU.categories[0].id, false);
})();

// ---- Dock + contact links ----
(function links() {
  const dock = $("#dock"), items = [];
  if (CONFIG.phone) items.push(["Call", "tel:" + CONFIG.phone, "M6.6 10.8a15 15 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11 11 0 0 0 3.5.56 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.2.2 2.4.56 3.5a1 1 0 0 1-.25 1z"]);
  items.push(["WhatsApp" , CONFIG.whatsapp ? "https://wa.me/" + CONFIG.whatsapp : null, "M12 3a9 9 0 0 0-7.8 13.5L3 21l4.6-1.2A9 9 0 1 0 12 3z"]);
  items.push(["Directions", CONFIG.mapsUrl, "M12 2 4 20l8-4 8 4z"]);
  // Fallbacks until the owner supplies real contacts: only live links appear.
  const live = items.filter(i => i[1]);
  if (!CONFIG.whatsapp) live.push(["Message", CONFIG.instagramDM, "M4 5h16v11H8l-4 4z"]);
  live.push(["Instagram", CONFIG.instagram, "M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4zm5 5a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"]);
  dock.innerHTML = live.map(([l, h, d]) =>
    `<a href="${h}" ${h.startsWith("http") ? 'target="_blank" rel="noopener"' : ""}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="${d}"/></svg><span>${l}</span></a>`).join("");
  dock.style.setProperty("--n", live.length);

  const map = $("#mapLink"), ph = $("#phoneRow"), addr = $("#addr");
  if (CONFIG.mapsUrl) { map.href = CONFIG.mapsUrl; map.textContent = "Open in Google Maps"; }
  if (CONFIG.phone) ph.innerHTML = `<a href="tel:${CONFIG.phone}">${CONFIG.phone}</a>`;
  if (CONFIG.address) addr.textContent = CONFIG.address;
})();

// ---- Live open / closed (cafe timezone) ----
function status() {
  const el = $("#open"), tbl = $("#hours");
  if (!CONFIG.hours) { el.textContent = "Opening soon"; el.className = "badge soon"; return; }
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const parts = Object.fromEntries(new Intl.DateTimeFormat("en-GB", { timeZone: CONFIG.timezone, weekday: "short", hour: "2-digit", minute: "2-digit", hour12: false })
    .formatToParts(new Date()).map(p => [p.type, p.value]));
  const d = days.indexOf(parts.weekday), now = (+parts.hour % 24) * 60 + +parts.minute;
  const m = s => +s.slice(0, 2) * 60 + +s.slice(3);
  const today = CONFIG.hours[d] || [];
  const isOpen = today.some(([a, b]) => m(b) > m(a) ? now >= m(a) && now < m(b) : now >= m(a) || now < m(b));
  el.textContent = isOpen ? "Open now" : "Closed now"; el.className = "badge " + (isOpen ? "open" : "closed");
  tbl.innerHTML = days.map((n, i) => `<tr${i === d ? ' class="today"' : ""}><td>${n}</td><td>${(CONFIG.hours[i] || []).map(r => r.join("–")).join(", ") || "Closed"}</td></tr>`).join("");
}
status(); setInterval(status, 60000);

// ---- Scroll reveal ----
(function reveal() {
  const els = $$(".rv");
  if (!("IntersectionObserver" in window) || matchMedia("(prefers-reduced-motion: reduce)").matches) { els.forEach(e => e.classList.add("in")); return; }
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .12 });
  els.forEach(e => io.observe(e));
})();
