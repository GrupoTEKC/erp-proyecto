console.log("🔥 BACKEND ERP - VERSION INTEGRAL CORREGIDA 🔥")

const express = require('express')
const cors = require('cors')
const db = require('./db')

const app = express()
const PORT = process.env.PORT || 8080

app.use(cors())
app.use(express.json())

/* =====================================================
   TEST CONEXIÓN
===================================================== */
;(async () => {
  try {
    await db.query('SELECT 1')
    console.log('✅ Base de datos conectada')
  } catch (error) {
    console.error('❌ Error DB:', error.message)
  }
})()

app.get('/', (_, res) => res.json({ status: 'Servidor ERP Funcionando' }))

/* =====================================================
   ================= MÓDULO CLIENTES ==================
===================================================== */

// GET - Listar clientes con nombre de ruta
app.get('/clientes', async (_, res) => {
  try {
    const [rows] = await db.query(`
      SELECT c.*, r.nombre AS ruta
      FROM clientes c
      LEFT JOIN rutas r ON c.id_ruta = r.id_ruta
      ORDER BY c.nombre ASC
    `)
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST - Crear cliente (estructura completa)
app.post('/clientes', async (req, res) => {
  try {
    const {
      nombre,
      apellido1,
      apellido2,
      nombre_tienda,
      apodo,
      rfc,
      email,
      telefono_dueno,
      telefono_tienda,
      categoria,
      categoria_otro,
      calle,
      numero,
      cp,
      municipio,
      estado,
      entre_calles,
      referencia,
      id_ruta
    } = req.body

    const [result] = await db.query(`
      INSERT INTO clientes (
        nombre, apellido1, apellido2, nombre_tienda, apodo,
        rfc, email, telefono_dueno, telefono_tienda,
        categoria, categoria_otro,
        calle, numero, cp, municipio, estado,
        entre_calles, referencia, id_ruta,
        saldo_actual
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
    `, [
      nombre, apellido1, apellido2, nombre_tienda, apodo,
      rfc, email, telefono_dueno, telefono_tienda,
      categoria, categoria_otro,
      calle, numero, cp, municipio, estado,
      entre_calles, referencia, id_ruta
    ])

    res.json({ success: true, id: result.insertId })

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PUT - Actualizar cliente
app.put('/clientes/:id', async (req, res) => {
  try {
    const { id } = req.params

    const {
      nombre,
      apellido1,
      apellido2,
      nombre_tienda,
      apodo,
      rfc,
      email,
      telefono_dueno,
      telefono_tienda,
      categoria,
      categoria_otro,
      calle,
      numero,
      cp,
      municipio,
      estado,
      entre_calles,
      referencia,
      id_ruta
    } = req.body

    await db.query(`
      UPDATE clientes SET
        nombre=?, apellido1=?, apellido2=?, nombre_tienda=?, apodo=?,
        rfc=?, email=?, telefono_dueno=?, telefono_tienda=?,
        categoria=?, categoria_otro=?,
        calle=?, numero=?, cp=?, municipio=?, estado=?,
        entre_calles=?, referencia=?, id_ruta=?
      WHERE id_cliente=?
    `, [
      nombre, apellido1, apellido2, nombre_tienda, apodo,
      rfc, email, telefono_dueno, telefono_tienda,
      categoria, categoria_otro,
      calle, numero, cp, municipio, estado,
      entre_calles, referencia, id_ruta,
      id
    ])

    res.json({ success: true })

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

/* =====================================================
   ================= MÓDULO PEDIDOS ===================
===================================================== */

// GET - Listar pedidos con nombre cliente
app.get('/pedidos', async (_, res) => {
  try {
    const [rows] = await db.query(`
      SELECT p.*, c.nombre AS cliente
      FROM pedidos p
      JOIN clientes c ON p.id_cliente = c.id_cliente
      ORDER BY p.id_pedido DESC
    `)
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST - Crear pedido
app.post('/pedidos', async (req, res) => {
  try {
    const {
      id_cliente,
      id_vendedor,
      id_ruta,
      fecha,
      total,
      tipo_pedido,
      dias_credito,
      estado_pedido
    } = req.body

    const [result] = await db.query(`
      INSERT INTO pedidos (
        id_cliente, id_vendedor, id_ruta,
        fecha, total, tipo_pedido,
        dias_credito, estado_pedido
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      id_cliente,
      id_vendedor,
      id_ruta,
      fecha,
      total,
      tipo_pedido,
      dias_credito,
      estado_pedido || 'pendiente'
    ])

    res.json({ success: true, id: result.insertId })

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PUT - Entregar pedido
app.put('/pedidos/:id/entregar', async (req, res) => {
  try {
    const { id } = req.params

    await db.query(`
      UPDATE pedidos 
      SET estado_pedido='entregado', fecha_entrega=NOW()
      WHERE id_pedido=?
    `, [id])

    res.json({ success: true })

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PUT - Cancelar pedido
app.put('/pedidos/:id/cancelar', async (req, res) => {
  try {
    const { id } = req.params

    await db.query(`
      UPDATE pedidos 
      SET estado_pedido='cancelado', fecha_cancelacion=NOW()
      WHERE id_pedido=?
    `, [id])

    res.json({ success: true })

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

/* =====================================================
   ================= CATÁLOGOS ========================
===================================================== */

app.get('/vendedores', async (_, res) => {
  const [rows] = await db.query('SELECT * FROM vendedores')
  res.json(rows)
})

app.get('/rutas', async (_, res) => {
  const [rows] = await db.query('SELECT * FROM rutas')
  res.json(rows)
})

app.get('/productos', async (_, res) => {
  const [rows] = await db.query('SELECT * FROM productos')
  res.json(rows)
})

/* =====================================================
   404 GLOBAL
===================================================== */
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' })
})

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Backend activo en puerto ${PORT}`)
})
