console.log('🚀 INDEX CORRECTO CARGADO')

const express = require('express')
const cors = require('cors')
const db = require('./db')

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

// =========================
// 🔥 TEST MYSQL
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
// 🔹 RUTA RAÍZ
// =========================
app.get('/', (req, res) => {
  res.send('✅ Backend ERP funcionando')
})

// =========================
// 🔹 CLIENTES
// =========================
app.get('/clientes', async (req, res) => {
  try {
    const [results] = await db.query(`
      SELECT
        id_cliente,
        nombre,
        nombre_tienda,
        direccion,
        telefono,
        email,
        rfc,
        saldo_actual
      FROM clientes
    `)

    res.json(results)

  } catch (err) {
    console.error('🔥 ERROR CLIENTES:', err.message)
    res.status(500).json({ error: err.message })
  }
})

// =========================
// 🔹 VENDEDORES
// =========================
app.get('/vendedores', async (req, res) => {
  try {
    const [results] = await db.query(`
      SELECT id_vendedor, nombre FROM vendedores
    `)

    res.json(results)

  } catch (err) {
    console.error('🔥 ERROR VENDEDORES:', err.message)
    res.status(500).json({ error: err.message })
  }
})

// =========================
// 🔹 PRODUCTOS
// =========================
app.get('/productos', async (req, res) => {
  try {
    const [results] = await db.query(`
      SELECT id_producto, nombre, precio
      FROM productos
      ORDER BY nombre
    `)

    res.json(results)

  } catch (err) {
    console.error('🔥 ERROR PRODUCTOS:', err.message)
    res.status(500).json({ error: err.message })
  }
})

// =========================
// 🔹 RUTAS
// =========================
app.get('/rutas', async (req, res) => {
  try {
    const [results] = await db.query(`
      SELECT id_ruta, nombre FROM rutas
    `)

    res.json(results)

  } catch (err) {
    console.error('🔥 ERROR RUTAS:', err.message)
    res.status(500).json({ error: err.message })
  }
})

// =========================
// 🔹 LISTAR PEDIDOS
// =========================
app.get('/pedidos', async (req, res) => {
  try {
    const [results] = await db.query(`
      SELECT
        p.id_pedido,
        c.nombre AS cliente,
        p.fecha,
        p.estado
      FROM pedidos p
      JOIN clientes c ON c.id_cliente = p.id_cliente
      ORDER BY p.fecha DESC
    `)

    res.json(results)

  } catch (err) {
    console.error('🔥 ERROR PEDIDOS:', err.message)
    res.status(500).json({ error: err.message })
  }
})

// =========================
// 🔹 CREAR PEDIDO
// =========================
app.post('/pedidos', async (req, res) => {
  try {
    const { id_cliente, fecha, estado } = req.body

    if (!id_cliente || !fecha || !estado) {
      return res.status(400).json({
        error: 'Faltan datos del pedido'
      })
    }

    const [result] = await db.query(`
      INSERT INTO pedidos (id_cliente, fecha, estado)
      VALUES (?, ?, ?)
    `, [id_cliente, fecha, estado])

    res.json({
      success: true,
      id_pedido: result.insertId
    })

  } catch (err) {
    console.error('🔥 ERROR GUARDAR PEDIDO:', err.message)
    res.status(500).json({ error: err.message })
  }
})

// =========================
// 🔹 SERVIDOR
// =========================
app.listen(PORT, () => {
  console.log(`✅ Backend corriendo en puerto ${PORT}`)
})
