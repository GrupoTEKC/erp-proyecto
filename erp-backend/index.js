console.log("🔥 VERSION:", "18 MARZO");
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

app.get('/clientes/:id_cliente', async (req, res) => {
  try {
    const { id_cliente } = req.params
    const [rows] = await db.query(
      'SELECT * FROM clientes WHERE id_cliente = ?',
      [id_cliente]
    )
    if (!rows.length) return res.status(404).json({ error: 'No encontrado' })
    res.json(rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.put('/clientes/:id_cliente', async (req, res) => {
  try {
    const { id_cliente } = req.params
    const { nombre, telefono, email } = req.body
    await db.query(`
      UPDATE clientes 
      SET nombre=?, telefono=?, email=?
      WHERE id_cliente=?
    `, [nombre, telefono, email, id_cliente])
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
// PRODUCTOS
// =============================
app.get('/productos', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        id_producto,
        nombre,
        precio,
        activo
      FROM productos
      WHERE activo = 1
      ORDER BY nombre ASC
    `)
    res.json(rows)
  } catch (err) {
    console.error("ERROR PRODUCTOS:", err)
    res.status(500).json({ error: err.message })
  }
})

// =============================
// PEDIDO COMPLETO (PRO)
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

    if (p.tipo_pedido === 'credito') {
      await conn.query(`
        UPDATE pedidos
        SET fecha_vencimiento = DATE_ADD(fecha, INTERVAL ? DAY)
        WHERE id_pedido = ?
      `, [p.dias_credito || 0, id_pedido])
    }

    await conn.commit()

    res.json({
      success: true,
      id_pedido,
      total
    })

  } catch (err) {
    await conn.rollback()
    res.status(500).json({ error: err.message })
  } finally {
    conn.release()
  }
})

// =============================
// LISTAR PEDIDOS
// =============================
app.get('/pedidos', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        p.*,
        CONCAT(c.nombre,' ',c.apellido1) AS cliente
      FROM pedidos p
      LEFT JOIN clientes c 
      ON p.id_cliente = c.id_cliente
      ORDER BY p.fecha DESC
    `)
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// =============================
// PEDIDOS POR CLIENTE
// =============================
app.get('/pedidos/cliente/:id_cliente', async (req, res) => {
  try {
    const { id_cliente } = req.params
    const [rows] = await db.query(`
      SELECT *
      FROM pedidos
      WHERE id_cliente = ?
      AND estado = 'entregado'
      ORDER BY fecha DESC
    `,[id_cliente])
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// =============================
// 🔥 NUEVO: PEDIDO EN CURSO (EMBARQUE)
// =============================
app.post('/pedidos/:id/en-curso', async (req, res) => {
  const conn = await db.getConnection()

  try {
    const { id } = req.params
    const { id_chofer, id_unidad, productos, comentario } = req.body

    await conn.beginTransaction()

    const [entregaResult] = await conn.query(`
      INSERT INTO entregas (
        id_pedido,
        id_chofer,
        id_unidad,
        comentario,
        estado
      )
      VALUES (?, ?, ?, ?, 'en_ruta')
    `, [id, id_chofer, id_unidad, comentario || null])

    const id_entrega = entregaResult.insertId

    for (const item of productos) {

      const diferencia = item.cantidad_entregada - item.cantidad_pedida

      if (diferencia !== 0 && !item.comentario) {
        throw new Error(`Comentario obligatorio en producto ${item.id_producto}`)
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

    await conn.query(`
      UPDATE pedidos
      SET id_chofer = ?
      WHERE id_pedido = ?
    `, [id_chofer, id])

    await conn.commit()

    res.json({
      success: true,
      id_entrega
    })

  } catch (err) {
    await conn.rollback()
    res.status(500).json({ error: err.message })
  } finally {
    conn.release()
  }
})

// =============================
// ENTREGAR PEDIDO (NO SE TOCA)
// =============================
app.put('/pedidos/:id/entregar', async (req, res) => {
  try {
    const { id } = req.params
    const [result] = await db.query(`
      UPDATE pedidos
      SET estado = 'entregado',
          fecha_entrega = CURRENT_DATE()
      WHERE id_pedido = ?
      AND estado = 'pendiente'
    `,[id])

    if (!result.affectedRows) {
      return res.status(400).json({ error: 'Ya procesado' })
    }

    const [rows] = await db.query(
      'SELECT * FROM pedidos WHERE id_pedido = ?',
      [id]
    )

    res.json(rows[0])

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// =============================
// CANCELAR PEDIDO
// =============================
app.put('/pedidos/:id/cancelar', async (req, res) => {
  try {
    const { id } = req.params
    const [result] = await db.query(`
      UPDATE pedidos
      SET estado = 'cancelado',
          fecha_cancelacion = NOW()
      WHERE id_pedido = ?
      AND estado = 'pendiente'
    `,[id])

    if (!result.affectedRows) {
      return res.status(400).json({ error: 'Ya procesado' })
    }

    const [rows] = await db.query(
      'SELECT * FROM pedidos WHERE id_pedido = ?',
      [id]
    )

    res.json(rows[0])

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// =============================
// 404
// =============================
app.use((req,res)=>{
  res.status(404).json({ error:'Ruta no encontrada' })
})

// =============================
// SERVER
// =============================
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log('ERP corriendo en puerto', PORT)
})
