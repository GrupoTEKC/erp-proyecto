console.log("🔥 VERSION FINAL CORREGIDA - 3 MARZO 🔥")
const express = require('express')
const cors = require('cors')
const db = require('./db')
const app = express()

const PORT = process.env.PORT || 8080

app.use(cors())
app.use(express.json())

// LOG DE DEPURACIÓN
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleString()}] ${req.method} ${req.url}`);
  next();
});

// TEST MYSQL
;(async () => {
  try {
    await db.query('SELECT 1')
    console.log('✅ MySQL conectado')
  } catch (error) {
    console.error('❌ Error MySQL:', error.message)
  }
})()

app.get('/', (_, res) => res.json({ status: 'OK' }))

/* --- CLIENTES --- */
app.get('/clientes', async (_, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM clientes')
    res.json(rows)
  } catch (err) { res.status(500).json({ error: err.message }) }
})

/* --- PEDIDOS --- */
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

app.post('/pedidos', async (req, res) => {
  try {
    const { id_cliente, id_vendedor, id_ruta, fecha, total, tipo_pedido, dias_credito, estado_pedido } = req.body
    const [result] = await db.query(`
      INSERT INTO pedidos (id_cliente, id_vendedor, id_ruta, fecha, total, tipo_pedido, dias_credito, estado_pedido) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [id_cliente, id_vendedor, id_ruta, fecha, total, tipo_pedido, dias_credito, estado_pedido || 'pendiente'])
    res.json({ success: true, id: result.insertId })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// ACTUALIZACIÓN DE ESTADO (ENTREGAR)
app.put('/pedidos/:id/entregar', async (req, res) => {
  try {
    const id = Number(req.params.id)
    const [result] = await db.query("UPDATE pedidos SET estado_pedido='entregado', fecha_entrega=NOW() WHERE id_pedido=?", [id])
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Pedido no encontrado' })
    res.json({ success: true })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// ACTUALIZACIÓN DE ESTADO (CANCELAR)
app.put('/pedidos/:id/cancelar', async (req, res) => {
  try {
    const id = Number(req.params.id)
    const [result] = await db.query("UPDATE pedidos SET estado_pedido='cancelado', fecha_cancelacion=NOW() WHERE id_pedido=?", [id])
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Pedido no encontrado' })
    res.json({ success: true })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' })
})

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Backend activo en puerto ${PORT}`);
});
