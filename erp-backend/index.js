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
// ROOT
// =========================
app.get('/', (_, res) => {
  res.send('✅ Backend ERP funcionando')
})

// =========================
// CLIENTES
// =========================
app.get('/clientes', async (_, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM clientes')
    res.json(rows)
  } catch (err) {
    console.error('🔥 CLIENTES:', err)
    res.status(500).json(err)
  }
})

// =========================
// CREAR CLIENTE
// =========================
app.post('/clientes', async (req, res) => {
  try {
    console.log('👤 Cliente recibido:', req.body)

    const {
      nombre,
      nombre_tienda,
      direccion,
      telefono,
      email,
      rfc
    } = req.body

    if (!nombre) {
      return res.status(400).json({ error: 'Nombre requerido' })
    }

    const [result] = await db.query(
      `INSERT INTO clientes
       (nombre, nombre_tienda, direccion, telefono, email, rfc)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [nombre, nombre_tienda, direccion, telefono, email, rfc]
    )

    res.json({
      success: true,
      id_cliente: result.insertId
    })

  } catch (err) {
    console.error('🔥 ERROR CLIENTE:', err)
    res.status(500).json({ error: err.message })
  }
})

// =========================
// VENDEDORES
// =========================
app.get('/vendedores', async (_, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM vendedores')
    res.json(rows)
  } catch (err) {
    console.error('🔥 VENDEDORES:', err)
    res.status(500).json(err)
  }
})

// =========================
// RUTAS
// =========================
app.get('/rutas', async (_, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM rutas')
    res.json(rows)
  } catch (err) {
    console.error('🔥 RUTAS:', err)
    res.status(500).json(err)
  }
})

// =========================
// PRODUCTOS
// =========================
app.get('/productos', async (_, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM productos')
    res.json(rows)
  } catch (err) {
    console.error('🔥 PRODUCTOS:', err)
    res.status(500).json(err)
  }
})

// =========================
// 📦 LISTAR PEDIDOS
// =========================
app.get('/pedidos', async (_, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        p.id_pedido,
        p.fecha,
        p.estado,
        p.fecha_entrega,
        p.fecha_cancelacion,
        c.nombre AS cliente
      FROM pedidos p
      JOIN clientes c 
        ON c.id_cliente = p.id_cliente
      ORDER BY p.id_pedido DESC
    `)

    res.json(rows)

  } catch (err) {
    console.error('🔥 PEDIDOS:', err)
    res.status(500).json(err)
  }
})

// =========================
// 📦 DETALLE PEDIDO ← ESTA ERA LA QUE FALTABA
// =========================
app.get('/pedidos/:id/detalle', async (req, res) => {
  try {
    const { id } = req.params

    const [rows] = await db.query(`
      SELECT 
        pd.id_producto,
        pr.nombre,
        pd.cantidad,
        pd.precio
      FROM pedido_detalle pd
      JOIN productos pr 
        ON pr.id_producto = pd.id_producto
      WHERE pd.id_pedido = ?
    `, [id])

    res.json(rows)

  } catch (err) {
    console.error('🔥 DETALLE PEDIDO:', err)
    res.status(500).json({ error: err.message })
  }
})

// =========================
// CREAR PEDIDO
// =========================
app.post('/pedidos', async (req, res) => {
  const conn = await db.getConnection()

  try {
    console.log('📦 Pedido recibido:', req.body)

    const {
      id_cliente,
      id_vendedor,
      id_ruta,
      fecha,
      total,
      tipo_pedido,
      dias_credito,
      productos
    } = req.body

    if (!id_cliente || !productos?.length) {
      return res.status(400).json({ error: 'Datos incompletos' })
    }

    await conn.beginTransaction()

    const [pedido] = await conn.query(`
      INSERT INTO pedidos
      (id_cliente, id_vendedor, id_ruta, fecha, total, tipo_pedido, dias_credito)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
      id_cliente,
      id_vendedor,
      id_ruta,
      fecha,
      total,
      tipo_pedido,
      dias_credito
    ])

    const idPedido = pedido.insertId

    for (const prod of productos) {
      await conn.query(`
        INSERT INTO pedido_detalle
        (id_pedido, id_producto, precio, cantidad)
        VALUES (?, ?, ?, ?)
      `, [
        idPedido,
        prod.id_producto,
        prod.precio,
        prod.cantidad
      ])
    }

    await conn.commit()

    res.json({
      success: true,
      id_pedido: idPedido
    })

  } catch (err) {
    await conn.rollback()
    console.error('🔥 ERROR PEDIDO:', err)
    res.status(500).json(err)

  } finally {
    conn.release()
  }
})

// =========================
// SERVIDOR
// =========================
app.listen(PORT, () => {
  console.log(`✅ Backend corriendo en puerto ${PORT}`)
})
