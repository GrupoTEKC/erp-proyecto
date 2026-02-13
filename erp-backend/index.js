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
    const [rows] = await pool.query("SELECT 1")
    console.log("✅ MySQL conectado")
  } catch (error) {
    console.error("❌ Error MySQL:", error)
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
app.get('/clientes', (req, res) => {
  const sql = `
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
  `

  db.query(sql, (err, results) => {
    if (err) {
      console.error('🔥 ERROR CLIENTES:', err)
      return res.status(500).json({
        error: 'Error consultando clientes',
        detalle: err.message
      })
    }

    res.json(results)
  })
})

// =========================
// 🔹 VENDEDORES
// =========================
app.get('/vendedores', (req, res) => {
  const sql = `SELECT id_vendedor, nombre FROM vendedores`

  db.query(sql, (err, results) => {
    if (err) {
      console.error('🔥 ERROR VENDEDORES:', err)
      return res.status(500).json(err)
    }

    res.json(results)
  })
})

// =========================
// 🔹 PRODUCTOS
// =========================
app.get('/productos', (req, res) => {
  const sql = `
    SELECT id_producto, nombre, precio
    FROM productos
    ORDER BY nombre
  `

  db.query(sql, (err, results) => {
    if (err) {
      console.error('🔥 ERROR PRODUCTOS:', err)
      return res.status(500).json(err)
    }

    res.json(results)
  })
})

// =========================
// 🔹 RUTAS
// =========================
app.get('/rutas', (req, res) => {
  const sql = `SELECT id_ruta, nombre FROM rutas`

  db.query(sql, (err, results) => {
    if (err) {
      console.error('🔥 ERROR RUTAS:', err)
      return res.status(500).json(err)
    }

    res.json(results)
  })
})

// =========================
// 🔹 PEDIDOS (LISTAR)
// =========================
app.get('/pedidos', (req, res) => {
  const sql = `
    SELECT
      p.id_pedido,
      c.nombre AS cliente,
      p.fecha,
      p.estado
    FROM pedidos p
    JOIN clientes c ON c.id_cliente = p.id_cliente
    ORDER BY p.fecha DESC
  `

  db.query(sql, (err, results) => {
    if (err) {
      console.error('🔥 ERROR PEDIDOS:', err)
      return res.status(500).json(err)
    }

    res.json(results)
  })
})

// =========================
// 🔹 SERVIDOR
// =========================
app.listen(PORT, () => {
  console.log(`✅ Backend corriendo en puerto ${PORT}`)
})
