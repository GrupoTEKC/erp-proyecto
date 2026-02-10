console.log('🚀 INDEX CORRECTO CARGADO')

const express = require('express')
const cors = require('cors')
const db = require('./db')

const app = express()
app.use(cors())
app.use(express.json())

// =========================
// 🔹 RUTA RAÍZ
// =========================
app.get('/', (req, res) => {
  res.send('Backend ERP funcionando')
})

// =========================
// 🔹 CLIENTES
// =========================
app.get('/clientes', (req, res) => {
  const sql = `
    SELECT
      id_cliente,
      nombre,
      nombre_tienda,
      direccion,
      telefono,
      email,
      rfc,
      saldo_actual
    FROM clientes
  `
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: 'Error clientes' })
    res.json(results)
  })
})

// =========================
// 🔹 VENDEDORES
// =========================
app.get('/vendedores', (req, res) => {
  const sql = `
    SELECT id_vendedor, nombre
    FROM vendedores
  `
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: 'Error vendedores' })
    res.json(results)
  })
})

// =========================
// 🔹 LISTAR PEDIDOS (SIN TOTAL)
// =========================
app.get('/pedidos', (req, res) => {
  const sql = `
    SELECT
      p.id_pedido,
      c.nombre AS cliente,
      p.fecha,
      p.estado,
      p.fecha_entrega,
      p.fecha_cancelacion
    FROM pedidos p
    JOIN clientes c ON c.id_cliente = p.id_cliente
    ORDER BY p.fecha DESC
  `
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: 'Error pedidos' })
    res.json(results)
  })
})

// =========================
// 🔹 CREAR PEDIDO
// (TOTAL SE GUARDA PERO NO SE EXPONE)
// =========================
app.post('/pedidos', (req, res) => {
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

  if (
    !id_cliente ||
    !id_vendedor ||
    !id_ruta ||
    !fecha ||
    total === undefined ||
    !tipo_pedido ||
    !Array.isArray(productos) ||
    productos.length === 0
  ) {
    return res.status(400).json({ error: 'Datos incompletos' })
  }

  const sqlPedido = `
    INSERT INTO pedidos
    (id_cliente, id_vendedor, id_ruta, fecha, total, tipo_pedido, dias_credito, estado)
    VALUES (?, ?, ?, ?, ?, ?, ?, 'pendiente')
  `

  db.query(
    sqlPedido,
    [
      id_cliente,
      id_vendedor,
      id_ruta,
      fecha,
      total,
      tipo_pedido,
      dias_credito || 0
    ],
    (err, result) => {
      if (err) {
        console.error('❌ Error pedido:', err)
        return res.status(500).json({ error: 'Error al guardar pedido' })
      }

      const idPedido = result.insertId

      const detalle = productos.map(p => [
        idPedido,
        p.id_producto,
        p.cantidad,
        p.precio
      ])

      const sqlDetalle = `
        INSERT INTO pedido_detalle
        (id_pedido, id_producto, cantidad, precio)
        VALUES ?
      `

      db.query(sqlDetalle, [detalle], err2 => {
        if (err2) {
          console.error('❌ Error detalle:', err2)
          return res.status(500).json({ error: 'Error al guardar productos' })
        }

        res.json({ mensaje: 'Pedido guardado correctamente' })
      })
    }
  )
})

// =========================
// 🔹 DETALLE PEDIDO
// =========================
app.get('/pedidos/:id/detalle', (req, res) => {
  const sql = `
    SELECT
      pd.id_producto,
      pr.nombre,
      pd.cantidad AS cantidad_pedida,
      pd.precio
    FROM pedido_detalle pd
    JOIN productos pr ON pr.id_producto = pd.id_producto
    WHERE pd.id_pedido = ?
  `
  db.query(sql, [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: 'Error detalle' })
    res.json(results)
  })
})

// =========================
// 🔹 CONFIRMAR ENTREGA
// =========================
app.put('/pedidos/:id/entregar', (req, res) => {
  const { id } = req.params
  const { productos, comentario } = req.body

  const sqlEstado = `
    SELECT estado
    FROM pedidos
    WHERE id_pedido = ?
  `

  db.query(sqlEstado, [id], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Error validando estado' })
    if (rows.length === 0)
      return res.status(404).json({ error: 'Pedido no encontrado' })

    if (rows[0].estado !== 'pendiente') {
      return res.status(400).json({ error: 'Pedido no entregable' })
    }

    const hayDiferencias = productos?.some(
      p => Number(p.cantidad_pedida) !== Number(p.cantidad_entregada)
    )

    if (hayDiferencias && (!comentario || comentario.trim() === '')) {
      return res.status(400).json({
        error: 'Comentario obligatorio cuando hay diferencias'
      })
    }

    const sqlUpdate = `
      UPDATE pedidos
      SET estado = 'entregado',
          fecha_entrega = NOW(),
          observaciones_entrega = ?
      WHERE id_pedido = ?
    `

    db.query(sqlUpdate, [comentario || '', id], err2 => {
      if (err2)
        return res.status(500).json({ error: 'Error al entregar pedido' })

      res.json({ mensaje: 'Pedido entregado correctamente' })
    })
  })
})

// =========================
// 🔹 CANCELAR PEDIDO
// =========================
app.put('/pedidos/:id/cancelar', (req, res) => {
  const { id } = req.params
  const { comentario } = req.body

  if (!comentario || comentario.trim() === '') {
    return res.status(400).json({ error: 'Comentario obligatorio' })
  }

  const sql = `
    UPDATE pedidos
    SET estado = 'cancelado',
        fecha_cancelacion = NOW(),
        observaciones_cancelacion = ?
    WHERE id_pedido = ?
      AND estado = 'pendiente'
  `

  db.query(sql, [comentario, id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Error al cancelar pedido' })

    if (result.affectedRows === 0) {
      return res.status(400).json({ error: 'Pedido no cancelable' })
    }

    res.json({ mensaje: 'Pedido cancelado correctamente' })
  })
})

// =========================
// 🔹 PRODUCTOS
// =========================
app.get('/productos', (req, res) => {
  const sql = `
    SELECT id_producto, nombre, precio
    FROM productos
    ORDER BY nombre
  `
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: 'Error productos' })
    res.json(results)
  })
})

// =========================
// 🔹 RUTAS
// =========================
app.get('/rutas', (req, res) => {
  const sql = `
    SELECT id_ruta, nombre
    FROM rutas
    ORDER BY id_ruta
  `
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: 'Error rutas' })
    res.json(results)
  })
})

// =========================
// 🔹 SERVIDOR
// =========================
app.listen(3001, () => {
  console.log('✅ Backend en http://localhost:3001')
})
