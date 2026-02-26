console.log('🔥 VERSION LIMPIA ERP 🔥')

const express = require('express')
const cors = require('cors')
const db = require('./db')

const app = express()
const PORT = process.env.PORT || 3001

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


// ======================================================
// CLIENTES
// ======================================================

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


// ======================================================
// PEDIDOS — NECESARIO PARA CONSULTAR PEDIDOS
// ======================================================

// LISTAR PEDIDOS
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

// DETALLE PEDIDO
app.get('/pedidos/:id/detalle', async (req, res) => {
  try {
    const id = Number(req.params.id)

    const [rows] = await db.query(`
      SELECT d.*, pr.nombre
      FROM detalle_pedido d
      JOIN productos pr ON d.id_producto = pr.id_producto
      WHERE d.id_pedido=?
    `, [id])

    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.put('/pedidos/:id/entregar', async (req, res) => {
  const connection = await db.getConnection()

  try {
    const id = Number(req.params.id)
    const { productos, comentario, unidad, chofer } = req.body

    if (!productos || !Array.isArray(productos)) {
      return res.status(400).json({ error: 'Productos inválidos' })
    }

    if (!unidad) {
      return res.status(400).json({ error: 'Unidad requerida' })
    }

    if (!chofer) {
      return res.status(400).json({ error: 'Chofer requerido' })
    }

    await connection.beginTransaction()

    // 1️⃣ Validar que el pedido exista y esté pendiente
    const [pedidoRows] = await connection.query(
      'SELECT estado FROM pedidos WHERE id_pedido=? FOR UPDATE',
      [id]
    )

    if (!pedidoRows.length) {
      throw new Error('Pedido no existe')
    }

    if (pedidoRows[0].estado !== 'pendiente') {
      throw new Error('El pedido no está pendiente')
    }

    // 2️⃣ Guardar productos entregados
   // 2️⃣ Guardar productos entregados
    for (const p of productos) {
    await connection.query(
    `UPDATE pedido_detalle
     SET cantidad_entregada=?
     WHERE id_pedido=? AND id_producto=?`,
     [p.cantidad_entregada, id, p.id_producto]
  )
}

    // 3️⃣ Manejar chofer
    let idChoferFinal = null

    if (chofer.tipo === 'interno') {
      idChoferFinal = chofer.id_chofer
    }

    if (chofer.tipo === 'externo') {
      const [result] = await connection.query(
        `INSERT INTO choferes 
         (nombre, apellido1, apellido2, correo, tipo)
         VALUES (?, ?, ?, ?, 'externo')`,
        [
          chofer.nombre,
          chofer.apellido1,
          chofer.apellido2 || '',
          chofer.correo
        ]
      )

      idChoferFinal = result.insertId
    }

    // 4️⃣ Actualizar pedido
    await connection.query(
      `UPDATE pedidos
       SET estado='entregado',
           fecha_entrega=NOW(),
           comentario_entrega=?,
           id_unidad=?,
           id_chofer=?
       WHERE id_pedido=?`,
      [
        comentario || '',
        unidad,
        idChoferFinal,
        id
      ]
    )

    await connection.commit()
    res.json({ success: true })

  } catch (err) {
    await connection.rollback()
    res.status(500).json({ error: err.message })
  } finally {
    connection.release()
  }
})
// CANCELAR PEDIDO
app.put('/pedidos/:id/cancelar', async (req, res) => {
  try {
    const id = Number(req.params.id)

    await db.query(`
      UPDATE pedidos
      SET estado='cancelado',
          fecha_cancelacion=NOW()
      WHERE id_pedido=?
    `, [id])

    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})


// ======================================================
// CHOFERES
// ======================================================

app.get('/choferes', async (_, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM choferes')
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})


// ======================================================
// UNIDADES
// ======================================================

app.get('/unidades', async (_, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM unidades')
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})


// =========================
// 404 GLOBAL
// =========================
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' })
})


// =========================
// SERVIDOR
// =========================
app.listen(PORT, () => {
  console.log(`✅ Backend activo en puerto ${PORT}`)
})
