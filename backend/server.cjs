const express = require("express")
const bcrypt = require("bcryptjs")
const db = require("./database.cjs")

const app = express()
const PORT = Number(process.env.PORT || 3001)

app.use(express.json())

function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

function nowISO() {
  return new Date().toISOString()
}

app.get("/api/status", (req, res) => {
  res.json({
    ok: true,
    message: "API do REalimenta funcionando!",
    database: "SQLite",
  })
})

app.post("/api/register", async (req, res) => {
  const ra = String(req.body.ra || "").trim()
  const name = String(req.body.name || "").trim()
  const password = String(req.body.password || "")

  if (!ra || !name || !password) {
    return res.status(400).json({
      success: false,
      error: "Preencha RA, nome e senha.",
    })
  }

  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      error: "A senha deve ter pelo menos 6 caracteres.",
    })
  }

  try {
    const passwordHash = await bcrypt.hash(password, 10)

    db.run(
      `INSERT INTO students (ra, name, password_hash, created_at)
       VALUES (?, ?, ?, ?)`,
      [ra, name, passwordHash, nowISO()],
      function (err) {
        if (err) {
          if (err.message.includes("UNIQUE")) {
            return res.status(409).json({
              success: false,
              error: "Este RA já possui cadastro.",
            })
          }

          console.error(err)
          return res.status(500).json({
            success: false,
            error: "Não foi possível criar o cadastro.",
          })
        }

        res.status(201).json({
          success: true,
          ra,
          student: {
            id: this.lastID,
            ra,
            name,
          },
        })
      },
    )
  } catch (err) {
    console.error(err)
    res.status(500).json({
      success: false,
      error: "Erro interno ao criar o cadastro.",
    })
  }
})

app.post("/api/login", (req, res) => {
  const ra = String(req.body.ra || "").trim()
  const password = String(req.body.password || "")

  if (!ra || !password) {
    return res.status(400).json({
      success: false,
      error: "Informe RA e senha.",
    })
  }

  db.get(
    "SELECT * FROM students WHERE ra = ?",
    [ra],
    async (err, student) => {
      if (err) {
        console.error(err)
        return res.status(500).json({
          success: false,
          error: "Erro ao consultar o banco.",
        })
      }

      if (!student) {
        return res.status(401).json({
          success: false,
          error: "RA ou senha incorretos.",
        })
      }

      const correct = await bcrypt.compare(password, student.password_hash)

      if (!correct) {
        return res.status(401).json({
          success: false,
          error: "RA ou senha incorretos.",
        })
      }

      res.json({
        success: true,
        ra: student.ra,
        student: {
          id: student.id,
          ra: student.ra,
          name: student.name,
        },
      })
    },
  )
})

app.post("/api/admin/login", (req, res) => {
  const username = String(req.body.username || "").trim()
  const password = String(req.body.password || "")

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      error: "Informe usuário e senha.",
    })
  }

  db.get(
    "SELECT * FROM admins WHERE username = ?",
    [username],
    async (err, admin) => {
      if (err) {
        console.error(err)
        return res.status(500).json({ error: "Erro ao consultar o banco." })
      }

      if (!admin) {
        return res.status(401).json({ error: "Usuário ou senha incorretos." })
      }

      const correct = await bcrypt.compare(password, admin.password_hash)
      if (!correct) {
        return res.status(401).json({ error: "Usuário ou senha incorretos." })
      }

      res.json({
        success: true,
        admin: {
          id: admin.id,
          username: admin.username,
          name: admin.name,
        },
      })
    },
  )
})

app.get("/api/meals/today", (req, res) => {
  db.get(
    "SELECT * FROM meals WHERE date = ? LIMIT 1",
    [todayISO()],
    (err, meal) => {
      if (err) {
        console.error(err)
        return res.status(500).json({ error: "Erro ao buscar o cardápio." })
      }
      res.json(meal || null)
    },
  )
})

app.get("/api/meals", (req, res) => {
  db.all(
    "SELECT * FROM meals ORDER BY date DESC, id DESC",
    [],
    (err, rows) => {
      if (err) {
        console.error(err)
        return res.status(500).json({ error: "Erro ao buscar cardápios." })
      }
      res.json(rows)
    },
  )
})

app.post("/api/meals", (req, res) => {
  const { date, name, description, protein, carbohydrates, calories, icon } = req.body

  if (!date || !String(name || "").trim()) {
    return res.status(400).json({ error: "Data e nome da refeição são obrigatórios." })
  }

  const createdAt = nowISO()

  db.run(
    `INSERT INTO meals
      (date, name, description, protein, carbohydrates, calories, icon, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(date) DO UPDATE SET
       name = excluded.name,
       description = excluded.description,
       protein = excluded.protein,
       carbohydrates = excluded.carbohydrates,
       calories = excluded.calories,
       icon = excluded.icon,
       updated_at = ?`,
    [
      date,
      String(name).trim(),
      description || null,
      Number(protein) || 0,
      Number(carbohydrates) || 0,
      Number(calories) || 0,
      icon || "🍽️",
      createdAt,
      createdAt,
    ],
    function (err) {
      if (err) {
        console.error(err)
        return res.status(500).json({ error: "Não foi possível salvar o cardápio." })
      }
      res.json({ success: true, message: "Cardápio salvo com sucesso." })
    },
  )
})

app.put("/api/meals/:id", (req, res) => {
  const id = Number(req.params.id)
  const { date, name, description, protein, carbohydrates, calories, icon } = req.body

  if (!id || !date || !String(name || "").trim()) {
    return res.status(400).json({ error: "Dados do cardápio inválidos." })
  }

  db.run(
    `UPDATE meals SET
      date = ?, name = ?, description = ?, protein = ?, carbohydrates = ?,
      calories = ?, icon = ?, updated_at = ?
     WHERE id = ?`,
    [
      date,
      String(name).trim(),
      description || null,
      Number(protein) || 0,
      Number(carbohydrates) || 0,
      Number(calories) || 0,
      icon || "🍽️",
      nowISO(),
      id,
    ],
    function (err) {
      if (err) {
        if (err.message.includes("UNIQUE")) {
          return res.status(409).json({ error: "Já existe um cardápio nessa data." })
        }
        console.error(err)
        return res.status(500).json({ error: "Não foi possível atualizar o cardápio." })
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: "Cardápio não encontrado." })
      }

      res.json({ success: true, message: "Cardápio atualizado com sucesso." })
    },
  )
})

app.delete("/api/meals/:id", (req, res) => {
  const id = Number(req.params.id)
  db.run("DELETE FROM meals WHERE id = ?", [id], function (err) {
    if (err) {
      console.error(err)
      return res.status(500).json({ error: "Não foi possível excluir o cardápio." })
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: "Cardápio não encontrado." })
    }
    res.json({ success: true, message: "Cardápio excluído com sucesso." })
  })
})

app.get("/api/votes/today", (req, res) => {
  db.all(
    "SELECT ra, vote FROM votes WHERE date = ?",
    [todayISO()],
    (err, rows) => {
      if (err) {
        console.error(err)
        return res.status(500).json({ error: "Erro ao buscar os votos." })
      }
      const result = {}
      rows.forEach((row) => {
        result[row.ra] = row.vote
      })
      res.json(result)
    },
  )
})

app.post("/api/votar", (req, res) => {
  const ra = String(req.body.ra || "").trim()
  const vote = req.body.vote

  if (!ra) {
    return res.status(400).json({ error: "RA não informado." })
  }
  if (vote !== "yes" && vote !== "no") {
    return res.status(400).json({ error: "Voto inválido." })
  }

  db.get("SELECT id FROM students WHERE ra = ?", [ra], (err, student) => {
    if (err) {
      console.error(err)
      return res.status(500).json({ error: "Erro ao validar o aluno." })
    }
    if (!student) {
      return res.status(401).json({ error: "Aluno não autenticado." })
    }

    db.run(
      `INSERT INTO votes (student_id, ra, date, vote, created_at)
       VALUES (?, ?, ?, ?, ?)`,
      [student.id, ra, todayISO(), vote, nowISO()],
      function (voteErr) {
        if (voteErr) {
          if (voteErr.message.includes("UNIQUE")) {
            return res.status(409).json({ error: "Este RA já votou hoje." })
          }
          console.error(voteErr)
          return res.status(500).json({ error: "Não foi possível registrar o voto." })
        }

        res.status(201).json({ success: true, message: "Voto registrado com sucesso." })
      },
    )
  })
})

app.use((req, res) => {
  res.status(404).json({ error: "Rota não encontrada." })
})

app.listen(PORT, "0.0.0.0", () => {
  console.log("================================")
  console.log(" REalimenta API + SQLite")
  console.log("================================")
  console.log(`API: http://localhost:${PORT}`)
  console.log("Aluno demo: RA 123456 / senha 123456")
  console.log("Admin demo: admin / admin123")
})
