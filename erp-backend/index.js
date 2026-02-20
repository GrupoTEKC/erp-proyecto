console.log('🔥 VERSION NUEVA CON CHOFERES 🔥')

const express = require('express')
const cors = require('cors')
const db = require('./db')

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

// =========================
// TEST MYSQL
// =========================
;(async () => {
  try {
    await db.query('SELECT 1')
    console.log('✅ MySQL conectado')
  } catch (error) {
    console.error('❌ Error MySQL:', error.message)
  }
})()

// =========================
// ROOT
// =========================
app.get('/', (_, res) => {
  res.json({ status: 'Backend ERP funcionando' })
})

// =========================
// LISTAR CLIENTES
// =========================
app.get('/clientes', async (_, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM clientes')
    res.json(rows)
  } catch (err) {
    console.error('🔥 ERROR LISTAR:', err)
    res.status(500).json({ error: err.message })
  }
})

// =========================
// OBTENER CLIENTE POR ID
// =========================
app.get('/clientes/:id', async (req, res) => {
  try {
    const id = Number(req.params.id)

    if (!id) {
      return res.status(400).json({ error: 'ID inválido' })
    }

    const [rows] = await db.query(
      'SELECT * FROM clientes WHERE id_cliente = ?',
      [id]
    )

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Cliente no encontrado' })
    }

    res.json(rows[0])
  } catch (err) {
    console.error('🔥 ERROR CLIENTE:', err)
    res.status(500).json({ error: err.message })
  }
})

// =========================
// ACTUALIZAR CLIENTE
// =========================
app.put('/clientes/:id', async (req, res) => {
  try {
    const id = Number(req.params.id)
    const { nombre, telefono, email, direccion } = req.body

    if (!id) {
      return res.status(400).json({ error: 'ID inválido' })
    }

    const [result] = await db.query(
      `
      UPDATE clientes
      SET nombre=?, telefono=?, email=?, direccion=?
      WHERE id_cliente=?
      `,
      [nombre, telefono, email, direccion, id]
    )

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Cliente no encontrado' })
    }

    res.json({ success: true })
  } catch (err) {
    console.error('🔥 ERROR UPDATE:', err)
    res.status(500).json({ error: err.message })
  }
})

// =========================
// ELIMINAR CLIENTE
// =========================
app.delete('/clientes/:id', async (req, res) => {
  try {
    const id = Number(req.params.id)

    if (!id) {
      return res.status(400).json({ error: 'ID inválido' })
    }

    const [result] = await db.query(
      'DELETE FROM clientes WHERE id_cliente = ?',
      [id]
    )

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Cliente no encontrado' })
    }

    res.json({ success: true })
  } catch (err) {
    console.error('🔥 ERROR ELIMINAR:', err)
    res.status(500).json({ error: err.message })
  }
})


// =========================
// CHOFERES
// =========================
app.get('/choferes', async (_, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM choferes')
    res.json(rows)
  } catch (err) {
    console.error('🔥 ERROR CHOFERES:', err)
    res.status(500).json({ error: err.message })
  }
})

// =========================
// 404 GLOBAL — SIEMPRE ÚLTIMO
// =========================
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' })
})

// =========================
// SERVIDOR
// =========================
app.listen(PORT, () => {
  console.log('🔥 VERSION CON CHOFERES ACTIVA 🔥')
  console.log(`✅ Backend corriendo en puerto ${PORT}`)
})
