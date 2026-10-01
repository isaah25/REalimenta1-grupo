const sqlite3 = require("sqlite3").verbose()
const path = require("path")
const bcrypt = require("bcryptjs")

const dbPath = path.join(__dirname, "realimenta.db")
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Erro ao abrir o banco:", err.message)
  } else {
    console.log("Banco SQLite conectado:", dbPath)
  }
})

db.serialize(() => {
  db.run("PRAGMA foreign_keys = ON")

  db.run(`
    CREATE TABLE IF NOT EXISTS students (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ra TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL
    )
  `)

  db.run(`
    CREATE TABLE IF NOT EXISTS admins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL
    )
  `)

  db.run(`
    CREATE TABLE IF NOT EXISTS meals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      description TEXT,
      protein REAL NOT NULL DEFAULT 0,
      carbohydrates REAL NOT NULL DEFAULT 0,
      calories REAL NOT NULL DEFAULT 0,
      icon TEXT NOT NULL DEFAULT '🍽️',
      created_at TEXT NOT NULL,
      updated_at TEXT
    )
  `)

  db.run(`
    CREATE TABLE IF NOT EXISTS votes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER NOT NULL,
      ra TEXT NOT NULL,
      date TEXT NOT NULL,
      vote TEXT NOT NULL CHECK(vote IN ('yes','no')),
      created_at TEXT NOT NULL,
      UNIQUE(ra, date),
      FOREIGN KEY(student_id) REFERENCES students(id)
    )
  `)
})

async function seedDemoData() {
  const now = new Date().toISOString()
  const today = new Date().toISOString().slice(0, 10)

  const studentHash = await bcrypt.hash("123456", 10)
  const adminHash = await bcrypt.hash("admin123", 10)

  db.run(
    `INSERT OR IGNORE INTO students (ra, name, password_hash, created_at)
     VALUES (?, ?, ?, ?)`,
    ["123456", "Aluno Demonstração", studentHash, now],
  )

  db.run(
    `INSERT OR IGNORE INTO admins (username, name, password_hash, created_at)
     VALUES (?, ?, ?, ?)`,
    ["admin", "Administrador REalimenta", adminHash, now],
  )

  db.run(
    `INSERT OR IGNORE INTO meals
      (date, name, description, protein, carbohydrates, calories, icon, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      today,
      "Arroz, feijão, frango e salada",
      "Refeição demonstrativa cadastrada automaticamente para o dia atual.",
      28,
      65,
      520,
      "🍛",
      now,
    ],
  )
}

seedDemoData().catch((err) => {
  console.error("Erro ao criar dados de demonstração:", err)
})

module.exports = db
