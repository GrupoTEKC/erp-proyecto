require('dotenv').config()
const express = require('express')
const mysql = require('mysql2/promise')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(express.json())

// =============================
// CONEXIÓN MYSQL
// =============================

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
})

// =============================
// CLIENTES
// =============================

// Obtener todos
app.get('/clientes', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM clientes')
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Obtener por ID
app.get('/clientes/:id_cliente', async (req, res) => {
  try {
    const { id_cliente } = req.params

    const [rows] = await db.query(
      'SELECT * FROM clientes WHERE id_cliente = ?',
      [id_cliente]
    )

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Cliente no encontrado' })
    }

    res.json(rows[0])

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Actualizar cliente
app.put('/clientes/:id_cliente', async (req, res) => {
  try {
    const { id_cliente } = req.params
    const data = req.body

    await db.query(
      `UPDATE clientes SET
      nombre = ?,
      telefono = ?,
      email = ?
      WHERE id_cliente = ?`,
      [data.nombre, data.telefono, data.email, id_cliente]
    )

    res.json({ success: true })

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// =============================
// RUTAS
// =============================

app.get('/rutas', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM rutas')
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// =============================
// VENDEDORES
// =============================

app.get('/vendedores', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM vendedores')
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// =============================
// CREAR PEDIDO
// =============================

app.post('/pedidos', async (req, res) => {

  try {

    const p = req.body

    const [result] = await db.query(`
      INSERT INTO pedidos (
        id_cliente,
        id_vendedor,
        id_ruta,
        fecha,
        total,
        tipo_pedido,
        dias_credito,
        estado_pedido
      )
      VALUES (?,?,?,?,?,?,?,?)
    `,[
      p.id_cliente,
      p.id_vendedor,
      p.id_ruta,
      p.fecha,
      p.total,
      p.tipo_pedido,
      p.dias_credito,
      p.estado_pedido
    ])

    res.json({
      success:true,
      id_pedido: result.insertId
    })

  } catch (err) {

    console.error(err)

    res.status(500).json({
      error: err.message
    })

  }

})

// =============================
// PEDIDOS POR CLIENTE
// =============================
app.get('/pedidos/cliente/:id_cliente', async (req, res) => {
  try {

    const { id_cliente } = req.params

    const [rows] = await db.query(
      `SELECT * FROM pedidos 
       WHERE id_cliente = ? 
       ORDER BY fecha DESC`,
      [id_cliente]
    )

    res.json(rows)

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// =============================
// RUTA 404
// =============================

app.use((req,res)=>{
  res.status(404).json({
    error:'Ruta no encontrada en el ERP'
  })
})

// =============================
// SERVER
// =============================

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log('ERP corriendo en puerto', PORT)
})
