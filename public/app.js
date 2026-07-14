/* ============================================================
   Galicia Planner — frontend
   ============================================================ */
const state = {
  user: localStorage.getItem("galicia_user") || null,
  names: { a: "Álvaro", b: "Diana" }, // nombres fijos
  stops: [],
  currentDay: null,
  days: [],
  filter: null, // null = todas, "must" = solo imperdibles
};

const api = {
  async get() { const r = await fetch("/api/stops"); return r.json(); },
  async done(id, user, done) {
    return (await fetch(`/api/stops/${id}/done`, m({ user, done }))).json();
  },
  async patch(id, data) { return (await fetch(`/api/stops/${id}`, m(data, "PATCH"))).json(); },
  async add(data) { return (await fetch("/api/stops", m(data))).json(); },
  async del(id) { return (await fetch(`/api/stops/${id}`, { method: "DELETE" })).json(); },
  async reorder(day, orderedIds) { return (await fetch("/api/reorder", m({ day, orderedIds }))).json(); },
  async addNote(id, author, body) { return (await fetch(`/api/stops/${id}/notes`, m({ author, body }))).json(); },
  async delNote(id) { return (await fetch(`/api/notes/${id}`, { method: "DELETE" })).json(); },
  async addLink(id, author, url, label, kind) { return (await fetch(`/api/stops/${id}/links`, m({ author, url, label, kind }))).json(); },
  async delLink(id) { return (await fetch(`/api/links/${id}`, { method: "DELETE" })).json(); },
  async getNames() { const r = await fetch("/api/names"); return r.json(); },
  async saveNames(a, b) { return (await fetch("/api/names", m({ a, b }))).json(); },
};
function m(body, method = "POST") {
  return { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) };
}

// ---------- DÍAS ----------
const DAY_TITLES = {
  0: { kicker: "Antes de salir", title: "Info <span class='accent'>práctica</span>", note: "Coche, reservas y notas de conducción.", date: "" },
  1: { kicker: "Miércoles · sin coche", title: "Santiago <span class='accent'>a fondo</span>", note: "La ciudad imprescindible: catedral, casco antiguo y primera cena top.", date: "2026-07-15" },
  2: { kicker: "Jueves · sin coche", title: "Santiago <span class='accent'>con calma</span>", note: "Museos, tapeo y arquitectura, sin prisa.", date: "2026-07-16" },
  3: { kicker: "Viernes · sin coche", title: "Santiago <span class='accent'>o excursión</span>", note: "El coche llega mañana. Día tranquilo en la ciudad o excursión en bus.", date: "2026-07-17" },
  4: { kicker: "Sábado · con coche", title: "Costa da Morte <span class='accent'>e Fisterra</span>", note: "El día grande de costa salvaje: faros, el fin del mundo y el Ézaro iluminado.", date: "2026-07-18" },
  5: { kicker: "Domingo · con coche", title: "Rías Baixas <span class='accent'>e Albariño</span>", note: "Cambados, bodega familiar, comida top en Casa Solla y Combarro.", date: "2026-07-19" },
  6: { kicker: "Lunes · sin coche", title: "Despedida <span class='accent'>en Santiago</span>", note: "Se devuelve el coche por la mañana. Último día completo, a pie y con calma.", date: "2026-07-20" },
  8: { kicker: "Sin fecha", title: "Ideas <span class='accent'>extra</span>", note: "Necesitan coche o un día más. Por si cambia el plan.", date: "" },
};

const MONTHS = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
const WEEKDAYS = ["domingo","lunes","martes","miércoles","jueves","viernes","sábado"];
const TRIP_START = "2026-07-15";

const PRIORITY_LABEL = { must: "Imperdible", nice: "Recomendable", optional: "Opcional" };

const ICON = {
  map: '<svg viewBox="0 0 24 24" fill="none"><path d="M9 20l-5.5 2V6L9 4m0 16l6-2m-6 2V4m6 14l5.5 2V4l-5.5 2m0 12V6m0 0L9 4" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
  note: '<svg viewBox="0 0 24 24" fill="none"><path d="M8 10h8M8 14h5M21 12a8 8 0 01-11.5 7.2L3 21l1.8-6.5A8 8 0 1121 12z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
  photo: '<svg viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" stroke-width="1.8"/><circle cx="8.5" cy="10" r="1.5" fill="currentColor"/><path d="M3 16l4.5-4 3.5 3 4-4L21 15" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
  edit: '<svg viewBox="0 0 24 24" fill="none"><path d="M14 5l5 5M4 20l1-4L16 5l3 3L8 19l-4 1z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
  check: '<svg viewBox="0 0 24 24" class="stroke" fill="none"><path d="M4 12l5 5L20 6" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  drag: '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="9" cy="6" r="1.6"/><circle cx="15" cy="6" r="1.6"/><circle cx="9" cy="12" r="1.6"/><circle cx="15" cy="12" r="1.6"/><circle cx="9" cy="18" r="1.6"/><circle cx="15" cy="18" r="1.6"/></svg>',
  link: '<svg viewBox="0 0 24 24" fill="none"><path d="M10 14a5 5 0 007 0l3-3a5 5 0 00-7-7l-1 1m1 9a5 5 0 01-7 0 5 5 0 010-7l3-3a5 5 0 017 0" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
};

// ---------- INIT ----------
async function init() {
  // nombres fijos en pantalla de bienvenida
  document.getElementById("nameA").textContent = state.names.a;
  document.getElementById("nameB").textContent = state.names.b;

  document.querySelectorAll(".who-btn").forEach((b) => {
    b.onclick = () => selectUser(b.dataset.user);
  });
  document.getElementById("meChip").onclick = openMeMenu;
  document.getElementById("addStopBtn").onclick = openAddStop;
  document.getElementById("filterToggle").onclick = toggleFilter;
  document.getElementById("modalOverlay").onclick = (e) => {
    if (e.target.id === "modalOverlay") closeModal();
  };

  if (state.user) {
    showApp();
  }
}

function selectUser(u) {
  state.user = u;
  localStorage.setItem("galicia_user", u);
  showApp();
}

async function showApp() {
  document.getElementById("whoScreen").classList.add("hidden");
  document.getElementById("app").classList.remove("hidden");
  updateMeChip();
  await load();
}

function updateMeChip() {
  const name = state.names[state.user];
  document.getElementById("meName").textContent = name;
  const dot = document.querySelector("#meChip .me-dot");
  dot.style.background = state.user === "a" ? "var(--user-a)" : "var(--user-b)";
}

async function load() {
  state.stops = await api.get();
  state.days = [...new Set(state.stops.map((s) => s.day))].sort((a, b) => a - b);
  // día actual por defecto: el primer día real (ni info=0 ni extra=8)
  if (state.currentDay === null) {
    state.currentDay = state.days.find((d) => d !== 0 && d !== 8) ?? state.days[0];
  }
  renderNav();
  renderDay();
  renderProgress();
  renderCountdown();
}

function renderCountdown() {
  const el = document.getElementById("countdown");
  const diff = daysUntilTrip();
  let txt, cls = "";
  if (diff > 1) { txt = `Faltan <b>${diff} días</b> para Galicia`; }
  else if (diff === 1) { txt = `¡Mañana empieza el viaje!`; cls = "soon"; }
  else if (diff === 0) { txt = `¡Hoy empieza el viaje! 🎉`; cls = "soon"; }
  else if (diff >= -5) { txt = `¡Estáis en Galicia! Día ${Math.abs(diff) + 1} 🌊`; cls = "soon"; }
  else { txt = `Viaje del 15 al 20 de julio`; }
  el.innerHTML = `🗓️ ${txt}`;
  el.className = "countdown " + cls;
}

function toggleFilter() {
  state.filter = state.filter === "must" ? null : "must";
  const btn = document.getElementById("filterToggle");
  const label = document.getElementById("filterLabel");
  if (state.filter === "must") {
    btn.classList.add("active");
    label.textContent = "Solo imperdibles";
  } else {
    btn.classList.remove("active");
    label.textContent = "Ver todo";
  }
  renderDay();
}

// ---------- NAV ----------
function renderNav() {
  const nav = document.getElementById("daynav");
  nav.innerHTML = "";
  state.days.forEach((d) => {
    const pill = document.createElement("button");
    const meta = DAY_TITLES[d] || {};
    const isInfo = d === 0;
    const isExtra = d === 8;
    pill.className = "day-pill" + (d === state.currentDay ? " active" : "") +
      (isInfo ? " info-pill" : "") + (isExtra ? " extra-pill" : "");
    if (isInfo) {
      pill.innerHTML = "ℹ Info";
    } else if (isExtra) {
      pill.innerHTML = "✦ Extra";
    } else {
      // Día N + fecha corta
      pill.innerHTML = `<span class="dp-num">D${d}</span><span class="dp-date">${shortDate(meta.date)}</span>`;
    }
    pill.onclick = () => { state.currentDay = d; renderNav(); renderDay(); };
    nav.appendChild(pill);
  });
}

function renderProgress() {
  const real = state.stops.filter((s) => s.day !== 0 && s.day !== 8);
  const both = real.filter((s) => s.done_a && s.done_b).length;
  document.getElementById("progressMini").textContent = `${both}/${real.length}`;
}

// ---------- RENDER DÍA ----------
function renderDay() {
  const content = document.getElementById("content");
  const d = state.currentDay;
  const meta = DAY_TITLES[d] || { kicker: `Día ${d}`, title: `Día ${d}`, note: "", date: "" };
  let stops = state.stops.filter((s) => s.day === d);
  // filtro de prioridad (solo afecta a la vista, no borra nada)
  if (state.filter === "must") stops = stops.filter((s) => s.priority === "must");

  const dateLine = meta.date
    ? `<div class="day-date">${capitalize(longDate(meta.date))}</div>`
    : "";

  content.innerHTML = `
    <div class="day-header">
      <div class="day-kicker">${meta.kicker}</div>
      <h2 class="day-title">${meta.title}</h2>
      ${dateLine}
      ${meta.note ? `<p class="day-note">${meta.note}</p>` : ""}
    </div>
    <div class="stops" id="stopsList"></div>
  `;

  const list = document.getElementById("stopsList");
  if (stops.length === 0) {
    const msg = state.filter === "must"
      ? `No hay paradas imperdibles este día.<br/>Quita el filtro para ver todas.`
      : `Aún no hay paradas este día.<br/>Pulsa "Añadir parada" abajo.`;
    list.innerHTML = `<div class="empty">${ICON.map}<p>${msg}</p></div>`;
    return;
  }
  stops.forEach((s) => list.appendChild(renderStop(s)));
  // el drag solo tiene sentido sin filtro y fuera de info
  if (!state.filter && d !== 0) enableDragDrop(list, d);
}

function renderStop(s) {
  const el = document.createElement("div");
  const bothDone = s.done_a && s.done_b;
  el.className = "stop" + (bothDone ? " both-done" : "");
  el.dataset.id = s.id;

  const cat = (s.category || "otros").toLowerCase().replace(/\s/g, "-");
  const nNotes = (s.notes || []).length;
  const nLinks = (s.links || []).length;
  const mapUrl = s.map_query
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(s.map_query)}`
    : null;

  const isInfo = s.day === 0;
  const prio = s.priority || "nice";
  if (prio === "must") el.classList.add("is-must");

  // etiqueta de prioridad (solo "imperdible" se resalta; el resto discreto)
  const prioTag = prio === "must"
    ? `<span class="prio-tag prio-must">★ Imperdible</span>`
    : prio === "optional"
      ? `<span class="prio-tag prio-optional">Opcional</span>`
      : "";

  el.innerHTML = `
    <div class="stop-top">
      ${isInfo ? "" : `<div class="drag-handle" title="Arrastra para reordenar">${ICON.drag}</div>`}
      ${s.time ? `<div class="stop-time">${escapeHtml(s.time)}</div>` : '<div class="stop-time empty"></div>'}
      <div class="stop-main">
        <div class="stop-title">${escapeHtml(s.title)}</div>
        <div class="stop-tags">
          ${s.category ? `<span class="stop-cat cat-${cat}">${escapeHtml(s.category)}</span>` : ""}
          ${prioTag}
        </div>
        ${s.description ? `<div class="stop-desc">${escapeHtml(s.description)}</div>` : ""}
        ${s.tip ? `<div class="stop-tip">💡 ${formatTip(s.tip)}</div>` : ""}
        ${mapUrl ? `<a class="stop-map" href="${mapUrl}" target="_blank" rel="noopener">${ICON.map} Abrir en mapas</a>` : ""}
      </div>
    </div>
    ${isInfo ? "" : `
    <div class="stop-actions">
      <button class="done-btn ${s.done_a ? "on-a" : ""}" data-act="done-a">
        <span class="check">${ICON.check}</span>${escapeHtml(state.names.a)}
      </button>
      <button class="done-btn ${s.done_b ? "on-b" : ""}" data-act="done-b">
        <span class="check">${ICON.check}</span>${escapeHtml(state.names.b)}
      </button>
      <div class="stop-more">
        <button class="icon-btn" data-act="notes" title="Notas">${ICON.note}${nNotes ? `<span class="badge">${nNotes}</span>` : ""}</button>
        <button class="icon-btn" data-act="photos" title="Fotos y enlaces">${ICON.photo}${nLinks ? `<span class="badge">${nLinks}</span>` : ""}</button>
        <button class="icon-btn" data-act="edit" title="Editar">${ICON.edit}</button>
      </div>
    </div>
    <div class="stop-extra hidden" data-extra></div>
    `}
  `;

  if (!isInfo) wireStop(el, s);
  return el;
}

function wireStop(el, s) {
  el.querySelector('[data-act="done-a"]').onclick = () => toggleDone(s, "a");
  el.querySelector('[data-act="done-b"]').onclick = () => toggleDone(s, "b");
  el.querySelector('[data-act="notes"]').onclick = () => toggleExtra(el, s, "notes");
  el.querySelector('[data-act="photos"]').onclick = () => toggleExtra(el, s, "photos");
  el.querySelector('[data-act="edit"]').onclick = () => openEditStop(s);
}

async function toggleDone(s, user) {
  const key = user === "a" ? "done_a" : "done_b";
  const newVal = s[key] ? 0 : 1;
  s[key] = newVal;
  // update local + re-render this stop's state class + progress
  await api.done(s.id, user, newVal);
  const idx = state.stops.findIndex((x) => x.id === s.id);
  if (idx >= 0) state.stops[idx][key] = newVal;
  renderDay();
  renderProgress();
  if (newVal && s.done_a && s.done_b) toast("¡Hecho por los dos! 🎉");
}

// ---------- EXTRA (notas / fotos) ----------
function toggleExtra(el, s, tab) {
  const box = el.querySelector("[data-extra]");
  const alreadyOpen = !box.classList.contains("hidden") && box.dataset.tab === tab;
  if (alreadyOpen) { box.classList.add("hidden"); return; }
  box.classList.remove("hidden");
  box.dataset.tab = tab;
  renderExtra(box, s, tab);
}

function renderExtra(box, s, tab) {
  const notes = s.notes || [];
  const links = s.links || [];
  box.innerHTML = `
    <div class="extra-tabs">
      <button class="extra-tab ${tab === "notes" ? "active" : ""}" data-tab="notes">Notas ${notes.length ? `(${notes.length})` : ""}</button>
      <button class="extra-tab ${tab === "photos" ? "active" : ""}" data-tab="photos">Fotos y enlaces ${links.length ? `(${links.length})` : ""}</button>
    </div>
    <div data-panel></div>
  `;
  box.querySelectorAll(".extra-tab").forEach((t) => {
    t.onclick = () => renderExtra(box, s, t.dataset.tab);
  });
  const panel = box.querySelector("[data-panel]");
  if (tab === "notes") renderNotesPanel(panel, s);
  else renderPhotosPanel(panel, s);
}

function renderNotesPanel(panel, s) {
  const notes = s.notes || [];
  panel.innerHTML = `
    <div class="extra-section-title">Notas compartidas</div>
    <div data-notes-list></div>
    <div class="add-row">
      <input type="text" placeholder="Escribe una nota…" data-note-input />
      <button class="add-send" data-note-send>Enviar</button>
    </div>
  `;
  const listEl = panel.querySelector("[data-notes-list]");
  if (notes.length === 0) {
    listEl.innerHTML = `<p style="color:var(--ink-soft);font-size:13px;margin-bottom:10px;">Sin notas todavía.</p>`;
  } else {
    notes.forEach((n) => {
      const isA = n.author === "a";
      const div = document.createElement("div");
      div.className = "note";
      div.innerHTML = `
        <div class="note-avatar" style="background:${isA ? "var(--user-a)" : "var(--user-b)"}">${initial(state.names[n.author])}</div>
        <div class="note-body">
          <div class="note-text">${escapeHtml(n.body)}</div>
          <div class="note-meta">
            <span>${escapeHtml(state.names[n.author] || n.author)} · ${fmtDate(n.created_at)}</span>
            ${n.author === state.user ? `<span class="note-del" data-del="${n.id}">borrar</span>` : ""}
          </div>
        </div>`;
      listEl.appendChild(div);
    });
    listEl.querySelectorAll("[data-del]").forEach((b) => {
      b.onclick = async () => {
        await api.delNote(b.dataset.del);
        await refreshStop(s.id);
      };
    });
  }
  const input = panel.querySelector("[data-note-input]");
  const send = panel.querySelector("[data-note-send]");
  const doSend = async () => {
    const v = input.value.trim();
    if (!v) return;
    input.value = "";
    await api.addNote(s.id, state.user, v);
    await refreshStop(s.id);
  };
  send.onclick = doSend;
  input.onkeydown = (e) => { if (e.key === "Enter") doSend(); };
}

function renderPhotosPanel(panel, s) {
  const links = s.links || [];
  const photos = links.filter((l) => l.kind === "photo");
  const other = links.filter((l) => l.kind !== "photo");
  panel.innerHTML = `
    <div class="extra-section-title">Fotos y enlaces</div>
    <div data-links-list></div>
    <div class="add-row">
      <input type="text" placeholder="Pega una URL (foto o enlace)…" data-link-input />
      <button class="add-send" data-link-send>Añadir</button>
    </div>
    <p style="color:var(--ink-soft);font-size:12px;margin-top:8px;">Si la URL acaba en .jpg/.png se mostrará como foto.</p>
  `;
  const listEl = panel.querySelector("[data-links-list]");
  if (links.length === 0) {
    listEl.innerHTML = `<p style="color:var(--ink-soft);font-size:13px;margin-bottom:10px;">Sin fotos ni enlaces todavía.</p>`;
  } else {
    if (photos.length) {
      const wrap = document.createElement("div");
      photos.forEach((l) => {
        const t = document.createElement("span");
        t.className = "link-thumb";
        t.innerHTML = `<a href="${escapeAttr(l.url)}" target="_blank" rel="noopener"><img src="${escapeAttr(l.url)}" alt="foto" onerror="this.parentElement.parentElement.innerHTML='<a class=&quot;link-chip&quot; href=&quot;${escapeAttr(l.url)}&quot; target=&quot;_blank&quot;>🔗 enlace roto</a>'"/></a>${l.author === state.user ? `<button class="thumb-del" data-del="${l.id}">×</button>` : ""}`;
        wrap.appendChild(t);
      });
      listEl.appendChild(wrap);
    }
    other.forEach((l) => {
      const a = document.createElement("div");
      a.style.display = "inline-flex";
      a.style.alignItems = "center";
      a.innerHTML = `<a class="link-chip" href="${escapeAttr(l.url)}" target="_blank" rel="noopener">${ICON.link}<span>${escapeHtml(l.label || prettyUrl(l.url))}</span></a>${l.author === state.user ? `<button class="chip-del" data-del="${l.id}">×</button>` : ""}`;
      listEl.appendChild(a);
    });
    listEl.querySelectorAll("[data-del]").forEach((b) => {
      b.onclick = async () => { await api.delLink(b.dataset.del); await refreshStop(s.id); };
    });
  }
  const input = panel.querySelector("[data-link-input]");
  const send = panel.querySelector("[data-link-send]");
  const doSend = async () => {
    let v = input.value.trim();
    if (!v) return;
    if (!/^https?:\/\//i.test(v)) v = "https://" + v;
    const kind = /\.(jpe?g|png|gif|webp|avif)(\?|$)/i.test(v) ? "photo" : "link";
    input.value = "";
    await api.addLink(s.id, state.user, v, "", kind);
    await refreshStop(s.id);
  };
  send.onclick = doSend;
  input.onkeydown = (e) => { if (e.key === "Enter") doSend(); };
}

// re-fetch un solo stop y re-render manteniendo panel abierto
async function refreshStop(id) {
  const fresh = await api.get();
  state.stops = fresh;
  renderDay();
  renderProgress();
  // reabrir el extra del stop editado
  const el = document.querySelector(`.stop[data-id="${id}"]`);
  if (el) {
    const s = state.stops.find((x) => x.id === id);
    const box = el.querySelector("[data-extra]");
    if (box && s) { box.classList.remove("hidden"); renderExtra(box, s, box.dataset.tab || "notes"); }
  }
}

// ---------- DRAG & DROP (táctil + ratón) ----------
function enableDragDrop(list, day) {
  let dragEl = null;

  function getAfterElement(y) {
    const els = [...list.querySelectorAll(".stop:not(.dragging)")];
    return els.reduce((closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) return { offset, element: child };
      return closest;
    }, { offset: -Infinity }).element;
  }

  list.querySelectorAll(".drag-handle").forEach((handle) => {
    const stop = handle.closest(".stop");

    // Puntero unificado (funciona en móvil y escritorio)
    handle.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      dragEl = stop;
      stop.classList.add("dragging");
      handle.setPointerCapture(e.pointerId);

      const onMove = (ev) => {
        const y = ev.clientY;
        const after = getAfterElement(y);
        if (after == null) list.appendChild(dragEl);
        else list.insertBefore(dragEl, after);
      };
      const onUp = async () => {
        handle.removeEventListener("pointermove", onMove);
        handle.removeEventListener("pointerup", onUp);
        handle.removeEventListener("pointercancel", onUp);
        if (dragEl) dragEl.classList.remove("dragging");
        dragEl = null;
        const ids = [...list.querySelectorAll(".stop")].map((s) => parseInt(s.dataset.id));
        await api.reorder(day, ids);
        // actualizar orden local
        const others = state.stops.filter((s) => s.day !== day);
        const reordered = ids.map((id) => state.stops.find((s) => s.id === id));
        state.stops = [...others, ...reordered].sort((a, b) => a.day - b.day);
        toast("Orden guardado");
      };
      handle.addEventListener("pointermove", onMove);
      handle.addEventListener("pointerup", onUp);
      handle.addEventListener("pointercancel", onUp);
    });
  });
}

// ---------- MODALES: añadir / editar ----------
function openAddStop() {
  const dayList = [1, 2, 3, 4, 5, 6];
  const dayOptions = dayList
    .map((d) => {
      const meta = DAY_TITLES[d];
      const lbl = `Día ${d} · ${capitalize(longDate(meta.date))}`;
      return `<option value="${d}" ${d === state.currentDay ? "selected" : ""}>${lbl}</option>`;
    })
    .join("") + `<option value="8" ${state.currentDay === 8 ? "selected" : ""}>Ideas extra (sin fecha)</option>`;
  openModal(`
    <h3>Nueva parada</h3>
    <p class="modal-sub">Se añadirá al final del día elegido.</p>
    <div class="field"><label>Día</label><select id="f-day">${dayOptions}</select></div>
    <div class="field"><label>Título</label><input id="f-title" placeholder="Ej. Faro de Cabo Ortegal" /></div>
    <div class="field"><label>Hora (opcional)</label><input id="f-time" placeholder="Ej. 11:00 o 'Mañana'" /></div>
    <div class="field"><label>Prioridad</label>
      <select id="f-prio">
        <option value="must">★ Imperdible</option>
        <option value="nice" selected>Recomendable</option>
        <option value="optional">Opcional</option>
      </select>
    </div>
    <div class="field"><label>Categoría</label>
      <select id="f-cat">
        <option value="imprescindible">Imprescindible</option>
        <option value="naturaleza">Naturaleza</option>
        <option value="comida">Comida</option>
        <option value="restaurante-top">Restaurante top</option>
        <option value="experiencia">Experiencia local</option>
        <option value="cultura">Cultura</option>
        <option value="logística">Logística</option>
        <option value="otros" selected>Otros</option>
      </select>
    </div>
    <div class="field"><label>Descripción (opcional)</label><textarea id="f-desc" placeholder="Qué es, por qué merece la pena…"></textarea></div>
    <div class="field"><label>Consejo (opcional)</label><input id="f-tip" placeholder="Ej. Reservar antes, mejor al atardecer…" /></div>
    <div class="field"><label>Buscar en mapas (opcional)</label><input id="f-map" placeholder="Nombre para Google Maps" /></div>
    <div class="modal-btns">
      <button class="btn btn-ghost" onclick="closeModal()">Cancelar</button>
      <button class="btn btn-primary" id="f-save">Añadir parada</button>
    </div>
  `);
  document.getElementById("f-save").onclick = async () => {
    const title = val("f-title");
    if (!title) { toast("Ponle un título"); return; }
    const day = parseInt(val("f-day"));
    await api.add({
      day,
      title,
      time: val("f-time"),
      category: val("f-cat"),
      priority: val("f-prio"),
      date: DAY_TITLES[day] ? DAY_TITLES[day].date : "",
      description: val("f-desc"),
      tip: val("f-tip"),
      map_query: val("f-map") || title,
    });
    state.currentDay = day;
    closeModal();
    await load();
    toast("Parada añadida");
  };
}

function openEditStop(s) {
  const prio = s.priority || "nice";
  openModal(`
    <h3>Editar parada</h3>
    <div class="field"><label>Título</label><input id="e-title" value="${escapeAttr(s.title)}" /></div>
    <div class="field"><label>Hora</label><input id="e-time" value="${escapeAttr(s.time || "")}" /></div>
    <div class="field"><label>Prioridad</label>
      <select id="e-prio">
        <option value="must" ${prio === "must" ? "selected" : ""}>★ Imperdible</option>
        <option value="nice" ${prio === "nice" ? "selected" : ""}>Recomendable</option>
        <option value="optional" ${prio === "optional" ? "selected" : ""}>Opcional</option>
      </select>
    </div>
    <div class="field"><label>Categoría</label><input id="e-cat" value="${escapeAttr(s.category || "")}" /></div>
    <div class="field"><label>Descripción</label><textarea id="e-desc">${escapeHtml(s.description || "")}</textarea></div>
    <div class="field"><label>Consejo</label><input id="e-tip" value="${escapeAttr(s.tip || "")}" /></div>
    <div class="field"><label>Buscar en mapas</label><input id="e-map" value="${escapeAttr(s.map_query || "")}" /></div>
    <div class="modal-btns">
      <button class="btn btn-danger" id="e-del">Eliminar</button>
      <button class="btn btn-primary" id="e-save">Guardar</button>
    </div>
  `);
  document.getElementById("e-save").onclick = async () => {
    await api.patch(s.id, {
      title: val("e-title"), time: val("e-time"), category: val("e-cat"),
      priority: val("e-prio"),
      description: val("e-desc"), tip: val("e-tip"), map_query: val("e-map"),
    });
    closeModal();
    await load();
    toast("Guardado");
  };
  document.getElementById("e-del").onclick = async () => {
    if (!confirm("¿Eliminar esta parada?")) return;
    await api.del(s.id);
    closeModal();
    await load();
    toast("Parada eliminada");
  };
}

function openMeMenu() {
  openModal(`
    <h3>Ajustes</h3>
    <p class="modal-sub">Estás usando la app como <b>${escapeHtml(state.names[state.user])}</b>.</p>
    <div class="modal-btns" style="flex-direction:column;">
      <button class="btn btn-ghost" id="me-switch">Cambiar de persona</button>
    </div>
  `);
  document.getElementById("me-switch").onclick = () => {
    closeModal();
    document.getElementById("app").classList.add("hidden");
    document.getElementById("whoScreen").classList.remove("hidden");
  };
}

// ---------- MODAL helpers ----------
function openModal(html) {
  const modal = document.getElementById("modal");
  modal.innerHTML = `<div class="modal-grip"></div>` + html;
  document.getElementById("modalOverlay").classList.remove("hidden");
}
function closeModal() {
  document.getElementById("modalOverlay").classList.add("hidden");
}
window.closeModal = closeModal;

// ---------- utils ----------
function val(id) { const e = document.getElementById(id); return e ? e.value.trim() : ""; }
function toast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.remove("hidden");
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.add("hidden"), 2200);
}
function escapeHtml(str) {
  return String(str || "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
function escapeAttr(str) { return escapeHtml(str).replace(/`/g, "&#96;"); }
function formatTip(str) {
  // resalta palabras clave de reserva
  return escapeHtml(str).replace(/(RESERVA IMPRESCINDIBLE|DATO CLAVE|Cierra [a-záéíóú ,y]+)/gi, "<b>$1</b>");
}
function initial(name) { return (name || "?").trim().charAt(0).toUpperCase(); }
function fmtDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString("es-ES", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}
function prettyUrl(u) { try { return new URL(u).hostname.replace("www.", ""); } catch { return u; } }
function capitalize(str) { return str ? str.charAt(0).toUpperCase() + str.slice(1) : ""; }

// Fecha larga: "miércoles 15 de julio"
function longDate(iso) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return `${WEEKDAYS[date.getDay()]} ${d} de ${MONTHS[m - 1]}`;
}
// Fecha corta para las pills: "15 jul"
function shortDate(iso) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${MONTHS[m - 1].slice(0, 3)}`;
}
// Días que faltan para el viaje (o null si ya empezó/terminó)
function daysUntilTrip() {
  const [y, m, d] = TRIP_START.split("-").map(Number);
  const start = new Date(y, m - 1, d);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.round((start - today) / 86400000);
  return diff;
}

init();
