console.log("🔥 VERSION NUEVA - BACKEND CORREGIDO 🔥")
const express = require('express')
const cors = require('cors')
const db = require('./db')
const app = express()

// =========================
// CONFIG RAILWAY
// =========================
const PORT = process.env.PORT || 3000
app.use(cors())
app.use(express.json())

// =========================
// TEST MYSQL
// =========================
;(async () => {
  try {
    await db.query('SELECT 1')
    console.log('✅ MySQL conectado correctamente')
  } catch (error) {
    console.error('❌ Error crítico en MySQL:', error.message)
  }
})()

// =========================
// ROOT
// =========================
app.get('/', (_, res) => {
  res.json({ status: 'Backend ERP funcionando correctamente' })
})

/* =====================================================
   CLIENTES (Mantenido Funcional)
===================================================== */
app.get('/clientes', async (_, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM clientes')
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.get('/clientes/:id', async (req, res) => {
  try {
    const id = Number(req.params.id)
    const [rows] = await db.query('SELECT * FROM clientes WHERE id_cliente=?', [id])
    if (!rows.length) return res.status(404).json({ error: 'Cliente no encontrado' })
    res.json(rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

/* =====================================================
   PEDIDOS (AQUÍ ESTABAN LOS CAMBIOS NECESARIOS)
===================================================== */

// 1. OBTENER TODOS LOS PEDIDOS
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

// 2. CREAR NUEVO PEDIDO (Esta ruta faltaba para que Pedidos.jsx funcione)
app.post('/pedidos', async (req, res) => {
  try {
    const { id_cliente, id_vendedor, id_ruta, fecha, total, tipo_pedido, dias_credito, estado } = req.body
    
    const [result] = await db.query(`
      INSERT INTO pedidos 
      (id_cliente, id_vendedor, id_ruta, fecha, total, tipo_pedido, dias_credito, estado) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [id_cliente, id_vendedor, id_ruta, fecha, total, tipo_pedido, dias_credito, estado || 'pendiente'])

    res.json({ success: true, id: result.insertId })
  } catch (err) {
    console.error("Error al insertar pedido:", err)
    res.status(500).json({ error: err.message })
  }
})

// 3. ENTREGAR PEDIDO
app.put('/pedidos/:id/entregar', async (req, res) => {
  try {
    const id = Number(req.params.id)
    if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' })

    const [result] = await db.query(`
      UPDATE pedidos
      SET estado = 'entregado',
          fecha_entrega = NOW()
      WHERE id_pedido = ?
    `, [id])

    if (result.affectedRows === 0) return res.status(404).json({ error: 'Pedido no encontrado' })
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// 4. CANCELAR PEDIDO
app.put('/pedidos/:id/cancelar', async (req, res) => {
  try {
    const id = Number(req.params.id)
    if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' })

    const [result] = await db.query(`
      UPDATE pedidos
      SET estado = 'cancelado',
          fecha_cancelacion = NOW()
      WHERE id_pedido = ?
    `, [id])

    if (result.affectedRows === 0) return res.status(404).json({ error: 'Pedido no encontrado' })
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

/* =====================================================
   404 GLOBAL (SIEMPRE AL FINAL)
===================================================== */
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' })
})

/* =====================================================
   SERVIDOR
===================================================== */
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Backend activo en puerto ${PORT}`)
})
