console.log('🔥 VERSION LIMPIA ERP 🔥')

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
// CLIENTES
// =========================

// LISTAR
app.get('/clientes', async (_, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM clientes')
    res.json(rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
})

// OBTENER POR ID
app.get('/clientes/:id', async (req, res) => {
  try {
    const id = Number(req.params.id)
    if (!id) return res.status(400).json({ error: 'ID inválido' })

    const [rows] = await db.query(
      'SELECT * FROM clientes WHERE id_cliente=?',
      [id]
    )

    if (!rows.length)
      return res.status(404).json({ error: 'Cliente no encontrado' })

    res.json(rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ACTUALIZAR
app.put('/clientes/:id', async (req, res) => {
  try {
    const id = Number(req.params.id)
    const { nombre, telefono, email, direccion } = req.body

    await db.query(
      `UPDATE clientes 
       SET nombre=?, telefono=?, email=?, direccion=? 
       WHERE id_cliente=?`,
      [nombre, telefono, email, direccion, id]
    )

    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ELIMINAR
app.delete('/clientes/:id', async (req, res) => {
  try {
    const id = Number(req.params.id)

    await db.query(
      'DELETE FROM clientes WHERE id_cliente=?',
      [id]
    )

    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// =========================
// CHOFERES
// =========================

// LISTAR
app.get('/choferes', async (_, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM choferes')
    res.json(rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
})


// =========================
// UNIDADES
// =========================
app.get('/unidades', async (_, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM unidades')
    res.json(rows)
  } catch (err) {
    console.error('🔥 ERROR UNIDADES:', err)
    res.status(500).json({ error: err.message })
  }
})
// =========================
// 404 GLOBAL
// =========================
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' })
})

// =========================
// SERVIDOR
// =========================
app.listen(PORT, () => {
  console.log(`✅ Backend activo en puerto ${PORT}`)
})
