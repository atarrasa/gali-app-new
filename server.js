const express = require("express");
const { DatabaseSync } = require("node:sqlite");
const path = require("path");
const fs = require("fs");

// Adaptador ligero: usa el SQLite integrado en Node (node:sqlite), sin compilar nada,
// y expone la misma interfaz que better-sqlite3 (prepare/run/get/all/pragma/transaction).
class Database {
  constructor(p) { this._db = new DatabaseSync(p); }
  pragma(s) { this._db.exec("PRAGMA " + s + ";"); }
  exec(s) { this._db.exec(s); }
  prepare(sql) {
    const st = this._db.prepare(sql);
    return {
      run: (...a) => st.run(...a),
      get: (...a) => st.get(...a),
      all: (...a) => st.all(...a),
    };
  }
  transaction(fn) {
    const self = this;
    return function (...args) {
      self._db.exec("BEGIN");
      try { const r = fn.apply(this, args); self._db.exec("COMMIT"); return r; }
      catch (e) { self._db.exec("ROLLBACK"); throw e; }
    };
  }
}

const app = express();
app.use(express.json({ limit: "8mb" }));
app.use(express.static(path.join(__dirname, "public")));

// --- Base de datos en volumen persistente ---
// En Railway monta un volumen en /data. En local usa ./data
const DATA_DIR = fs.existsSync("/data") ? "/data" : path.join(__dirname, "data");
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
const DB_PATH = path.join(DATA_DIR, "galicia.db");

const db = new Database(DB_PATH);
db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS stops (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    day INTEGER NOT NULL,
    position INTEGER NOT NULL,
    date TEXT DEFAULT '',
    priority TEXT DEFAULT 'nice',
    time TEXT,
    title TEXT NOT NULL,
    category TEXT,
    description TEXT,
    tip TEXT,
    map_query TEXT,
    done_a INTEGER DEFAULT 0,
    done_b INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    stop_id INTEGER NOT NULL,
    author TEXT NOT NULL,
    body TEXT NOT NULL,
    created_at TEXT NOT NULL,
    FOREIGN KEY (stop_id) REFERENCES stops(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS links (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    stop_id INTEGER NOT NULL,
    author TEXT NOT NULL,
    url TEXT NOT NULL,
    label TEXT,
    kind TEXT DEFAULT 'link',
    created_at TEXT NOT NULL,
    FOREIGN KEY (stop_id) REFERENCES stops(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS meta (
    key TEXT PRIMARY KEY,
    value TEXT
  );
`);

// --- Seed: solo la primera vez ---
const seeded = db.prepare("SELECT value FROM meta WHERE key = 'seeded'").get();
if (!seeded) {
  const seed = require("./seed.js");
  // Agrupamos por día y asignamos posición consecutiva dentro de cada día
  const byDay = {};
  seed.forEach((s) => {
    byDay[s.day] = byDay[s.day] || [];
    byDay[s.day].push(s);
  });
  const flat = [];
  Object.keys(byDay).sort((a, b) => a - b).forEach((d) => {
    byDay[d].forEach((s, i) => flat.push({ ...s, position: i }));
  });
  const insertStop = db.prepare(`
    INSERT INTO stops (day, position, date, priority, time, title, category, description, tip, map_query)
    VALUES (@day, @position, @date, @priority, @time, @title, @category, @description, @tip, @map_query)
  `);
  db.transaction((rows) => rows.forEach((r) => insertStop.run(r)))(flat);
  db.prepare("INSERT INTO meta (key, value) VALUES ('seeded', '1')").run();
  console.log(`Seed completado: ${flat.length} paradas.`);
}

// --- Helpers ---
function getStopFull(id) {
  const stop = db.prepare("SELECT * FROM stops WHERE id = ?").get(id);
  if (!stop) return null;
  stop.notes = db.prepare("SELECT * FROM notes WHERE stop_id = ? ORDER BY created_at ASC").all(id);
  stop.links = db.prepare("SELECT * FROM links WHERE stop_id = ? ORDER BY created_at ASC").all(id);
  return stop;
}

// --- API ---

// Todas las paradas, agrupadas por día
app.get("/api/stops", (req, res) => {
  const stops = db.prepare("SELECT * FROM stops ORDER BY day ASC, position ASC").all();
  const notes = db.prepare("SELECT * FROM notes ORDER BY created_at ASC").all();
  const links = db.prepare("SELECT * FROM links ORDER BY created_at ASC").all();
  const notesByStop = {};
  notes.forEach((n) => { (notesByStop[n.stop_id] = notesByStop[n.stop_id] || []).push(n); });
  const linksByStop = {};
  links.forEach((l) => { (linksByStop[l.stop_id] = linksByStop[l.stop_id] || []).push(l); });
  stops.forEach((s) => {
    s.notes = notesByStop[s.id] || [];
    s.links = linksByStop[s.id] || [];
  });
  res.json(stops);
});

// Marcar hecho / no hecho por usuario (a o b)
app.post("/api/stops/:id/done", (req, res) => {
  const { user, done } = req.body; // user: 'a' | 'b'
  if (!["a", "b"].includes(user)) return res.status(400).json({ error: "user inválido" });
  const col = user === "a" ? "done_a" : "done_b";
  db.prepare(`UPDATE stops SET ${col} = ? WHERE id = ?`).run(done ? 1 : 0, req.params.id);
  res.json(getStopFull(req.params.id));
});

// Editar campos de una parada
app.patch("/api/stops/:id", (req, res) => {
  const allowed = ["time", "title", "category", "description", "tip", "map_query", "day", "date", "priority"];
  const fields = Object.keys(req.body).filter((k) => allowed.includes(k));
  if (fields.length === 0) return res.status(400).json({ error: "nada que actualizar" });
  const setClause = fields.map((f) => `${f} = @${f}`).join(", ");
  const payload = {};
  fields.forEach((f) => (payload[f] = req.body[f]));
  payload.id = req.params.id;
  db.prepare(`UPDATE stops SET ${setClause} WHERE id = @id`).run(payload);
  res.json(getStopFull(req.params.id));
});

// Añadir parada nueva a un día
app.post("/api/stops", (req, res) => {
  const { day, title, time, category, description, tip, map_query, date, priority } = req.body;
  if (!day || !title) return res.status(400).json({ error: "day y title obligatorios" });
  const max = db.prepare("SELECT MAX(position) AS m FROM stops WHERE day = ?").get(day);
  const position = (max && max.m != null ? max.m : -1) + 1;
  const info = db.prepare(`
    INSERT INTO stops (day, position, date, priority, time, title, category, description, tip, map_query)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(day, position, date || "", priority || "nice", time || "", title, category || "otros", description || "", tip || "", map_query || title);
  res.json(getStopFull(info.lastInsertRowid));
});

// Borrar parada
app.delete("/api/stops/:id", (req, res) => {
  db.prepare("DELETE FROM notes WHERE stop_id = ?").run(req.params.id);
  db.prepare("DELETE FROM links WHERE stop_id = ?").run(req.params.id);
  db.prepare("DELETE FROM stops WHERE id = ?").run(req.params.id);
  res.json({ ok: true });
});

// Reordenar dentro de un día: recibe array de ids en orden
app.post("/api/reorder", (req, res) => {
  const { day, orderedIds } = req.body;
  if (!Array.isArray(orderedIds)) return res.status(400).json({ error: "orderedIds requerido" });
  const upd = db.prepare("UPDATE stops SET position = ?, day = ? WHERE id = ?");
  db.transaction(() => {
    orderedIds.forEach((id, i) => upd.run(i, day, id));
  })();
  res.json({ ok: true });
});

// Notas
app.post("/api/stops/:id/notes", (req, res) => {
  const { author, body } = req.body;
  if (!author || !body) return res.status(400).json({ error: "author y body requeridos" });
  db.prepare("INSERT INTO notes (stop_id, author, body, created_at) VALUES (?, ?, ?, ?)")
    .run(req.params.id, author, body, new Date().toISOString());
  res.json(getStopFull(req.params.id));
});

app.delete("/api/notes/:id", (req, res) => {
  db.prepare("DELETE FROM notes WHERE id = ?").run(req.params.id);
  res.json({ ok: true });
});

// Links / fotos
app.post("/api/stops/:id/links", (req, res) => {
  const { author, url, label, kind } = req.body;
  if (!author || !url) return res.status(400).json({ error: "author y url requeridos" });
  db.prepare("INSERT INTO links (stop_id, author, url, label, kind, created_at) VALUES (?, ?, ?, ?, ?, ?)")
    .run(req.params.id, author, url, label || "", kind || "link", new Date().toISOString());
  res.json(getStopFull(req.params.id));
});

app.delete("/api/links/:id", (req, res) => {
  db.prepare("DELETE FROM links WHERE id = ?").run(req.params.id);
  res.json({ ok: true });
});

// Reset opcional (protegido por palabra clave simple)
app.post("/api/reset", (req, res) => {
  if (req.body.confirm !== "BORRAR TODO") return res.status(400).json({ error: "confirmación incorrecta" });
  db.exec("DELETE FROM notes; DELETE FROM links; DELETE FROM stops; DELETE FROM meta;");
  res.json({ ok: true, note: "Reinicia el servidor para volver a cargar el itinerario." });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Galicia Planner en puerto ${PORT}`));
