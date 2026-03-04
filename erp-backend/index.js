console.log("🔥 BACKEND ERP - VERSIÓN INTEGRAL 3 MARZO 🔥")
const express = require('express')
const cors = require('cors')
const db = require('./db')
const app = express()

const PORT = process.env.PORT || 8080
app.use(cors())
app.use(express.json())

// TEST CONEXIÓN
;(async () => {
  try {
    await db.query('SELECT 1')
    console.log('✅ Base de datos conectada')
  } catch (error) {
    console.error('❌ Error DB:', error.message)
  }
})()

app.get('/', (_, res) => res.json({ status: 'Servidor Funcionando' }))

/* =====================================================
   MÓDULO CLIENTES (GET, POST, PUT)
===================================================== */

// GET - Ver clientes
app.get('/clientes', async (_, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM clientes ORDER BY nombre ASC')
    res.json(rows)
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// POST - Crear cliente
app.post('/clientes', async (req, res) => {
  try {
    const { nombre, telefono, email, direccion } = req.body
    const [result] = await db.query(
      'INSERT INTO clientes (nombre, telefono, email, direccion) VALUES (?, ?, ?, ?)',
      [nombre, telefono, email, direccion]
    )
    res.json({ success: true, id: result.insertId })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// PUT - Actualizar cliente
app.put('/clientes/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { nombre, telefono, email, direccion } = req.body
    await db.query(
      'UPDATE clientes SET nombre=?, telefono=?, email=?, direccion=? WHERE id_cliente=?',
      [nombre, telefono, email, direccion, id]
    )
    res.json({ success: true })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

/* =====================================================
   MÓDULO PEDIDOS (GET, POST, PUT)
===================================================== */

// GET - Listar pedidos con nombre de cliente
app.get('/pedidos', async (_, res) => {
  try {
    const [rows] = await db.query(`
      SELECT p.*, c.nombre AS cliente
      FROM pedidos p
      JOIN clientes c ON p.id_cliente = c.id_cliente
      ORDER BY p.id_pedido DESC
    `)
    res.json(rows)
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// POST - Guardar nuevo pedido
app.post('/pedidos', async (req, res) => {
  try {
    const { id_cliente, id_vendedor, id_ruta, fecha, total, tipo_pedido, dias_credito, estado_pedido } = req.body
    const [result] = await db.query(
      `INSERT INTO pedidos (id_cliente, id_vendedor, id_ruta, fecha, total, tipo_pedido, dias_credito, estado_pedido) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id_cliente, id_vendedor, id_ruta, fecha, total, tipo_pedido, dias_credito, estado_pedido || 'pendiente']
    )
    res.json({ success: true, id: result.insertId })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// PUT - Actualizar estados (Entregar/Cancelar)
app.put('/pedidos/:id/entregar', async (req, res) => {
  try {
    const { id } = req.params
    await db.query("UPDATE pedidos SET estado_pedido='entregado', fecha_entrega=NOW() WHERE id_pedido=?", [id])
    res.json({ success: true })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

app.put('/pedidos/:id/cancelar', async (req, res) => {
  try {
    const { id } = req.params
    await db.query("UPDATE pedidos SET estado_pedido='cancelado', fecha_cancelacion=NOW() WHERE id_pedido=?", [id])
    res.json({ success: true })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

/* =====================================================
   CATÁLOGOS ADICIONALES (GET)
===================================================== */
app.get('/vendedores', async (_, res) => {
  const [rows] = await db.query('SELECT * FROM vendedores'); res.json(rows)
})
app.get('/rutas', async (_, res) => {
  const [rows] = await db.query('SELECT * FROM rutas'); res.json(rows)
})
app.get('/productos', async (_, res) => {
  const [rows] = await db.query('SELECT * FROM productos'); res.json(rows)
})

app.use((req, res) => res.status(404).json({ error: 'Ruta no encontrada' }))

app.listen(PORT, '0.0.0.0', () => console.log(`🚀 Puerto: ${PORT}`))
