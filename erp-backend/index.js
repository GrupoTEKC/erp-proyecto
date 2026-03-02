console.log("🔥 VERSION NUEVA 2 MARZO 🔥")
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

/* =====================================================
   CLIENTES
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

/* =====================================================
   PEDIDOS
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
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ======================================
// ENTREGAR PEDIDO (CORREGIDO Y ALINEADO)
// ======================================
// ======================================
// ENTREGAR PEDIDO (VERSIÓN PROFESIONAL)
// ======================================

app.put('/pedidos/:id/entregar', async (req, res) => {
  try {
    const id = Number(req.params.id)
    const { comentario, unidad, chofer } = req.body

    if (!unidad) {
      return res.status(400).json({ error: "La unidad es obligatoria" })
    }

    if (!chofer) {
      return res.status(400).json({ error: "El chofer es obligatorio" })
    }

    let chofer_id = null
    let chofer_externo_nombre = null
    let chofer_externo_apellido1 = null
    let chofer_externo_apellido2 = null
    let chofer_externo_email = null

    if (chofer.tipo === 'interno') {
      chofer_id = chofer.id_chofer
    }

    if (chofer.tipo === 'externo') {
      chofer_externo_nombre = chofer.nombre
      chofer_externo_apellido1 = chofer.apellido1
      chofer_externo_apellido2 = chofer.apellido2
      chofer_externo_email = chofer.correo
    }

    await db.query(`
      UPDATE pedidos
      SET estado = 'entregado',
          fecha_entrega = NOW(),
          observaciones_entrega = ?,
          unidad = ?,
          chofer_id = ?,
          chofer_externo_nombre = ?,
          chofer_externo_apellido1 = ?,
          chofer_externo_apellido2 = ?,
          chofer_externo_email = ?
      WHERE id_pedido = ?
    `, [
      comentario || null,
      unidad,
      chofer_id,
      chofer_externo_nombre,
      chofer_externo_apellido1,
      chofer_externo_apellido2,
      chofer_externo_email,
      id
    ])

    res.json({ success: true })

  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// ======================================
// CANCELAR PEDIDO
// ======================================

app.put('/pedidos/:id/cancelar', async (req, res) => {
  try {
    const id = Number(req.params.id)
    const { comentario } = req.body

    if (!comentario || comentario.trim() === "") {
      return res.status(400).json({ error: "El comentario es obligatorio" })
    }

    await db.query(`
      UPDATE pedidos
      SET estado = 'cancelado',
          fecha_cancelacion = NOW(),
          observaciones_cancelacion = ?
      WHERE id_pedido = ?
    `, [comentario, id])

    res.json({ success: true })

  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

/* =====================================================
   CHOFERES
===================================================== */

app.get('/choferes', async (_, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM choferes')
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

/* =====================================================
   UNIDADES
===================================================== */

app.get('/unidades', async (_, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM unidades')
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
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
