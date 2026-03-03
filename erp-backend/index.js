console.log("🔥 VERSION RESTAURADA TOTAL - 3 MARZO 🔥")
const express = require('express')
const cors = require('cors')
const db = require('./db')
const app = express()

// =========================
// CONFIG RAILWAY
// =========================
const PORT = process.env.PORT || 8080 
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

app.get('/', (_, res) => {
  res.json({ status: 'Backend ERP funcionando' })
})

/* =====================================================
   CLIENTES (Tu código original)
===================================================== */
app.get('/clientes', async (_, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM clientes')
    res.json(rows)
  } catch (err) { res.status(500).json({ error: err.message }) }
})

app.get('/clientes/:id', async (req, res) => {
  try {
    const id = Number(req.params.id)
    const [rows] = await db.query('SELECT * FROM clientes WHERE id_cliente=?', [id])
    if (!rows.length) return res.status(404).json({ error: 'Cliente no encontrado' })
    res.json(rows[0])
  } catch (err) { res.status(500).json({ error: err.message }) }
})

/* =====================================================
   RUTAS, VENDEDORES Y PRODUCTOS (Las que faltaban)
===================================================== */
app.get('/rutas', async (_, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM rutas')
    res.json(rows)
  } catch (err) { res.status(500).json({ error: err.message }) }
})

app.get('/vendedores', async (_, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM vendedores')
    res.json(rows)
  } catch (err) { res.status(500).json({ error: err.message }) }
})

app.get('/productos', async (_, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM productos')
    res.json(rows)
  } catch (err) { res.status(500).json({ error: err.message }) }
})

/* =====================================================
   PEDIDOS (Tu código original con SET estado)
===================================================== */
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

app.put('/pedidos/:id/entregar', async (req, res) => {
  try {
    const id = Number(req.params.id)
    await db.query(`UPDATE pedidos SET estado = 'entregado', fecha_entrega = NOW() WHERE id_pedido = ?`, [id])
    res.json({ success: true })
  } catch (error) { res.status(500).json({ error: error.message }) }
})

app.put('/pedidos/:id/cancelar', async (req, res) => {
  try {
    const id = Number(req.params.id)
    await db.query(`UPDATE pedidos SET estado = 'cancelado', fecha_cancelacion = NOW() WHERE id_pedido = ?`, [id])
    res.json({ success: true })
  } catch (error) { res.status(500).json({ error: error.message }) }
})

/* =====================================================
   404 GLOBAL Y SERVIDOR
===================================================== */
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' })
})

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Backend activo en puerto ${PORT}`)
})
