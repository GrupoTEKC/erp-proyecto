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
// CLIENTES — LISTAR
// =========================
app.get('/clientes', async (_, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM clientes')
    res.json(rows)
  } catch (err) {
    console.error('🔥 ERROR CLIENTES:', err)
    res.status(500).json({ error: err.message })
  }
})

// =========================
// CLIENTES — CREAR
// =========================
app.post('/clientes', async (req, res) => {
  try {
    console.log('👤 Cliente recibido:', req.body)

    const {
      nombre,
      apellido1,
      apellido2,
      nombre_tienda,
      telefono_dueno,
      telefono_tienda,
      calle,
      numero,
      cp,
      municipio,
      estado,
      correo,
      rfc
    } = req.body

    if (!nombre || !nombre_tienda || !rfc) {
      return res.status(400).json({
        error: 'Nombre, tienda y RFC son obligatorios'
      })
    }

    // 👉 Construir nombre completo
    const nombreCompleto =
      `${nombre} ${apellido1 || ''} ${apellido2 || ''}`.trim()

    // 👉 Dirección completa
    const direccion =
      `${calle || ''} ${numero || ''}, ${municipio || ''}, ${estado || ''}, CP ${cp || ''}`

    // 👉 Teléfono prioritario
    const telefono = telefono_dueno || telefono_tienda || null

    const [result] = await db.query(`
      INSERT INTO clientes (
        nombre,
        nombre_tienda,
        direccion,
        telefono,
        email,
        rfc
      )
      VALUES (?, ?, ?, ?, ?, ?)
    `, [
      nombreCompleto,
      nombre_tienda,
      direccion,
      telefono,
      correo || null,
      rfc
    ])

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
    res.status(500).json({ error: err.message })
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
    res.status(500).json({ error: err.message })
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
    res.status(500).json({ error: err.message })
  }
})

// =========================
// PEDIDOS — LISTAR
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
    res.status(500).json({ error: err.message })
  }
})

// =========================
// PEDIDO — DETALLE
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
// PEDIDO — CREAR
// =========================
app.post('/pedidos', async (req, res) => {
  const conn = await db.getConnection()

  try {
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
    res.status(500).json({ error: err.message })
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
