console.log("🔥 VERSION:", "ENTREGAS PRO");
console.log("🌐 DB:", process.env.DB_NAME);

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
app.get('/clientes', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM clientes')
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// =============================
// PRODUCTOS
// =============================
app.get('/productos', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT id_producto, nombre, precio
      FROM productos
      WHERE activo = 1
      ORDER BY nombre ASC
    `)
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// =============================
// CHOFERES
// =============================
app.get('/choferes', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT id_chofer, nombre, apellido1, apellido2
      FROM choferes
      WHERE activo = 1
    `)
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// =============================
// UNIDADES
// =============================
app.get('/unidades', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT id_unidad, nombre, placas
      FROM unidades
      WHERE activo = 1
    `)
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// =============================
// PEDIDOS
// =============================
app.get('/pedidos', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        p.*,
        CONCAT(c.nombre,' ',c.apellido1) AS cliente
      FROM pedidos p
      LEFT JOIN clientes c ON p.id_cliente = c.id_cliente
      ORDER BY p.fecha DESC
    `)
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// =============================
// DETALLE PEDIDO (para modal)
// =============================
app.get('/pedidos/:id/detalle', async (req, res) => {
  try {
    const { id } = req.params

    const [rows] = await db.query(`
      SELECT 
        pd.id_producto,
        pr.nombre,
        pd.cantidad AS cantidad_pedida,
        pd.precio_unitario
      FROM pedido_detalle pd
      JOIN productos pr ON pd.id_producto = pr.id_producto
      WHERE pd.id_pedido = ?
    `, [id])

    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// =============================
// CREAR PEDIDO
// =============================
app.post('/pedidos-completo', async (req, res) => {
  const conn = await db.getConnection()
  try {
    const p = req.body
    await conn.beginTransaction()

    const [pedidoResult] = await conn.query(`
      INSERT INTO pedidos (
        id_cliente,
        id_vendedor,
        id_ruta,
        fecha,
        tipo_pedido,
        dias_credito,
        total,
        estado
      )
      VALUES (?, ?, ?, NOW(), ?, ?, 0, 'pendiente')
    `, [
      p.id_cliente,
      p.id_vendedor,
      p.id_ruta,
      p.tipo_pedido,
      p.dias_credito || 0
    ])

    const id_pedido = pedidoResult.insertId

    let total = 0

    for (const item of p.productos) {
      total += item.cantidad * item.precio

      await conn.query(`
        INSERT INTO pedido_detalle (
          id_pedido,
          id_producto,
          cantidad,
          precio_unitario
        )
        VALUES (?, ?, ?, ?)
      `, [
        id_pedido,
        item.id_producto,
        item.cantidad,
        item.precio
      ])
    }

    await conn.query(`
      UPDATE pedidos
      SET total = ?
      WHERE id_pedido = ?
    `, [total, id_pedido])

    await conn.commit()

    res.json({ success: true, id_pedido, total })

  } catch (err) {
    await conn.rollback()
    res.status(500).json({ error: err.message })
  } finally {
    conn.release()
  }
})

// =============================
// 🚚 CREAR ENTREGA (OFICINA)
// =============================
app.post('/entregas', async (req, res) => {
  const conn = await db.getConnection()
  try {
    const e = req.body
    await conn.beginTransaction()

    // 1. Crear entrega
    const [entregaResult] = await conn.query(`
      INSERT INTO entregas (
        id_pedido,
        id_chofer,
        id_unidad,
        comentario
      )
      VALUES (?, ?, ?, ?)
    `, [
      e.id_pedido,
      e.id_chofer,
      e.id_unidad,
      e.comentario || null
    ])

    const id_entrega = entregaResult.insertId

    // 2. Insertar detalle
    for (const item of e.productos) {

      if (item.cantidad_entregada !== item.cantidad_pedida && !e.comentario) {
        throw new Error('Debes agregar comentario por diferencias')
      }

      await conn.query(`
        INSERT INTO entrega_detalle (
          id_entrega,
          id_producto,
          cantidad_pedida,
          cantidad_entregada
        )
        VALUES (?, ?, ?, ?)
      `, [
        id_entrega,
        item.id_producto,
        item.cantidad_pedida,
        item.cantidad_entregada
      ])
    }

    // 3. Pedido → en ruta
    await conn.query(`
      UPDATE pedidos
      SET estado = 'en_ruta',
          id_chofer = ?
      WHERE id_pedido = ?
    `, [e.id_chofer, e.id_pedido])

    await conn.commit()

    res.json({ success: true, id_entrega })

  } catch (err) {
    await conn.rollback()
    res.status(500).json({ error: err.message })
  } finally {
    conn.release()
  }
})

// =============================
// FINALIZAR ENTREGA (REAL)
// =============================
app.put('/pedidos/:id/entregar', async (req, res) => {
  try {
    const { id } = req.params

    await db.query(`
      UPDATE pedidos
      SET estado = 'entregado',
          fecha_entrega = CURRENT_DATE()
      WHERE id_pedido = ?
    `, [id])

    res.json({ success: true })

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// =============================
// SERVER
// =============================
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log('ERP corriendo en puerto', PORT)
})
