console.log("🔥 VERSION:", "22 JUNIO");
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
    const [rows] = await db.query(
      'SELECT * FROM clientes WHERE activo = 1'
    )
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

    let {
      nombre,
      apellido1,
      apellido2,
      telefono,
      telefono_local,
      nombre_tienda,
      apodo,
      rfc,
      categoria,
      categoria_otro,
      calle,
      numero,
      cp,
      municipio,
      estado,
      entre_calles,
      referencia,
      email,
      id_ruta
    } = req.body

    const toUpper = (val) => val ? val.toUpperCase() : null

    // 🔠 NORMALIZAR
    nombre = toUpper(nombre)
    apellido1 = toUpper(apellido1)
    apellido2 = toUpper(apellido2)
    nombre_tienda = nombre_tienda
      ? nombre_tienda.trim().replace(/\s+/g, ' ').toUpperCase()
      : null
    apodo = toUpper(apodo)
    rfc = toUpper(rfc)
    categoria = toUpper(categoria)
    categoria_otro = toUpper(categoria_otro)
    calle = toUpper(calle)
    numero = toUpper(numero)
    cp = toUpper(cp)
    municipio = toUpper(municipio)
    estado = toUpper(estado)
    entre_calles = toUpper(entre_calles)
    referencia = toUpper(referencia)

    // 🔥 VALIDAR NOMBRE TIENDA ÚNICO (EXCLUYENDO EL MISMO CLIENTE)
    const [existe] = await db.query(`
      SELECT id_cliente 
      FROM clientes 
      WHERE TRIM(UPPER(nombre_tienda)) = ?
      AND id_cliente != ?
    `, [nombre_tienda, id_cliente])

    if (existe.length > 0) {
      return res.status(400).json({ 
        error: 'Ya existe una tienda con ese nombre' 
      })
    }

    // 💾 UPDATE COMPLETO
    await db.query(`
      UPDATE clientes SET
        nombre=?,
        apellido1=?,
        apellido2=?,
        telefono=?,
        telefono_local=?,
        nombre_tienda=?,
        apodo=?,
        rfc=?,
        categoria=?,
        categoria_otro=?,
        calle=?,
        numero=?,
        cp=?,
        municipio=?,
        estado=?,
        entre_calles=?,
        referencia=?,
        email=?,
        id_ruta=?
      WHERE id_cliente=?
    `, [
      nombre,
      apellido1,
      apellido2,
      telefono || null,
      telefono_local || null,
      nombre_tienda,
      apodo || null,
      rfc || null,
      categoria,
      categoria === 'OTROS' ? categoria_otro : null,
      calle,
      numero,
      cp,
      municipio,
      estado,
      entre_calles,
      referencia,
      email || null,
      id_ruta,
      id_cliente
    ])

    res.json({ success: true })

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.delete('/clientes/:id_cliente', async (req, res) => {
  try {
    const { id_cliente } = req.params

    await db.query(
      'UPDATE clientes SET activo = 0 WHERE id_cliente = ?',
      [id_cliente]
    )

    res.json({ success: true })

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.post('/clientes', async (req, res) => {
  try {
    let {
      nombre,
      apellido1,
      apellido2,
      telefono,
      telefono_local,
      nombre_tienda,
      apodo,
      rfc,
      categoria,
      categoria_otro,
      calle,
      numero,
      cp,
      municipio,
      estado,
      entre_calles,
      referencia,
      email,
      id_ruta
    } = req.body

    const toUpper = (val) => val ? val.toUpperCase() : null

    // =============================
    // 🔠 NORMALIZAR
    // =============================
    nombre = toUpper(nombre)
    apellido1 = toUpper(apellido1)
    apellido2 = toUpper(apellido2)

    nombre_tienda = nombre_tienda
      ? nombre_tienda.trim().replace(/\s+/g, ' ').toUpperCase()
      : null

    apodo = toUpper(apodo)
    rfc = toUpper(rfc)
    categoria = toUpper(categoria)
    categoria_otro = toUpper(categoria_otro)

    calle = toUpper(calle)
    numero = toUpper(numero)
    cp = toUpper(cp)
    municipio = toUpper(municipio)
    estado = toUpper(estado)
    entre_calles = toUpper(entre_calles)
    referencia = toUpper(referencia)

    // =============================
    // ✅ VALIDACIONES PRIMERO
    // =============================
    if (!nombre || !apellido1 || !apellido2) {
      return res.status(400).json({ error: 'Nombre completo obligatorio' })
    }

    if (!categoria) {
      return res.status(400).json({ error: 'Categoría obligatoria' })
    }

    if (categoria === 'OTROS' && !categoria_otro) {
      return res.status(400).json({ 
        error: 'Debe especificar la categoría en "otros"' 
      })
    }

    if (!nombre_tienda) {
      return res.status(400).json({ error: 'Nombre de negocio obligatorio' })
    }

    if (!calle || !numero || !cp || !municipio || !estado) {
      return res.status(400).json({ error: 'Dirección incompleta' })
    }

    if (!entre_calles) {
      return res.status(400).json({ error: 'Entre calles obligatorio' })
    }

    if (!referencia) {
      return res.status(400).json({ error: 'Referencia obligatoria' })
    }

    if (!id_ruta) {
      return res.status(400).json({ error: 'Ruta obligatoria' })
    }

    // =============================
    // 📞 TELÉFONOS
    // =============================
    if (!telefono && !telefono_local) {
      return res.status(400).json({ 
        error: 'Debe capturar al menos un teléfono' 
      })
    }

    const validarTel = (tel) => /^\d{10}$/.test(tel)

    if (telefono && !validarTel(telefono)) {
      return res.status(400).json({ 
        error: 'Teléfono dueño inválido' 
      })
    }

    if (telefono_local && !validarTel(telefono_local)) {
      return res.status(400).json({ 
        error: 'Teléfono tienda inválido' 
      })
    }

    if (rfc && (rfc.length < 12 || rfc.length > 13)) {
      return res.status(400).json({ error: 'RFC inválido' })
    }

    // =============================
    // 🔥 VALIDACIÓN NOMBRE TIENDA ÚNICO
    // =============================
    const [existe] = await db.query(`
      SELECT id_cliente 
      FROM clientes 
      WHERE TRIM(UPPER(nombre_tienda)) = ?
    `, [nombre_tienda])

    if (existe.length > 0) {
      return res.status(400).json({ 
        error: 'Ya existe una tienda con ese nombre' 
      })
    }

    // =============================
    // 💾 INSERT
    // =============================
    const [result] = await db.query(`
      INSERT INTO clientes (
        nombre,
        apellido1,
        apellido2,
        telefono,
        telefono_local,
        nombre_tienda,
        apodo,
        rfc,
        categoria,
        categoria_otro,
        calle,
        numero,
        cp,
        municipio,
        estado,
        entre_calles,
        referencia,
        email,
        id_ruta
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      nombre,
      apellido1,
      apellido2,
      telefono || null,
      telefono_local || null,
      nombre_tienda,
      apodo || null,
      rfc || null,
      categoria,
      categoria === 'OTROS' ? categoria_otro : null,
      calle,
      numero,
      cp,
      municipio,
      estado,
      entre_calles,
      referencia,
      email || null,
      id_ruta
    ])

    res.json({
      success: true,
      id_cliente: result.insertId
    })

  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
})


// =============================
// 💰 PRECIOS POR CLIENTE
// =============================
app.post('/clientes/:id_cliente/precios', async (req, res) => {
  const conn = await db.getConnection()
  try {
    const { id_cliente } = req.params
    const { id_producto, precio, motivo } = req.body

    if (!id_producto || !precio) {
      return res.status(400).json({ error: 'Datos incompletos' })
    }

    await conn.beginTransaction()

    // 🔎 Ver si ya existe precio
    const [existe] = await conn.query(`
      SELECT precio 
      FROM precios_cliente_producto
      WHERE id_cliente = ? AND id_producto = ? AND activo = 1
    `, [id_cliente, id_producto])

    if (existe.length > 0) {
      const precioAnterior = existe[0].precio

      // 🔥 Guardar historial SOLO si cambia
      if (Number(precioAnterior) !== Number(precio)) {
        await conn.query(`
          INSERT INTO historial_precios_cliente (
            id_cliente,
            id_producto,
            precio_anterior,
            precio_nuevo,
            motivo
          )
          VALUES (?, ?, ?, ?, ?)
        `, [
          id_cliente,
          id_producto,
          precioAnterior,
          precio,
          motivo || null
        ])
      }

      // 🔄 Update precio
      await conn.query(`
        UPDATE precios_cliente_producto
        SET precio = ?, fecha_actualizacion = NOW()
        WHERE id_cliente = ? AND id_producto = ?
      `, [precio, id_cliente, id_producto])

    } else {
      // 🆕 Insert nuevo
      await conn.query(`
        INSERT INTO precios_cliente_producto (
          id_cliente,
          id_producto,
          precio
        )
        VALUES (?, ?, ?)
      `, [id_cliente, id_producto, precio])
    }

    await conn.commit()
    res.json({ success: true })

  } catch (err) {
    await conn.rollback()
    res.status(500).json({ error: err.message })
  } finally {
    conn.release()
  }
})

app.get('/clientes/:id_cliente/precios', async (req, res) => {
  try {
    const { id_cliente } = req.params

    const [rows] = await db.query(`
      SELECT 
        p.id_producto,
        p.nombre,
        COALESCE(pc.precio, p.precio) AS precio
      FROM productos p
      LEFT JOIN precios_cliente_producto pc
        ON pc.id_producto = p.id_producto
        AND pc.id_cliente = ?
        AND pc.activo = 1
      WHERE p.activo = 1
      ORDER BY p.nombre ASC
    `, [id_cliente])

    res.json(rows)

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.get('/clientes/:id_cliente/precios/historial', async (req, res) => {
  try {
    const { id_cliente } = req.params

    const [rows] = await db.query(`
      SELECT 
        h.*,
        p.nombre AS producto
      FROM historial_precios_cliente h
      INNER JOIN productos p 
        ON p.id_producto = h.id_producto
      WHERE h.id_cliente = ?
      ORDER BY h.fecha_cambio DESC
    `, [id_cliente])

    res.json(rows)

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

const pedido_url = `${req.protocol}://${req.get('host')}/pedidos/${id_pedido}`

res.json({
  success: true,
  id_pedido,
  total,
  pedido_url
})

  } catch (err) {
    await conn.rollback()
    res.status(500).json({ error: err.message })
  } finally {
    conn.release()
  }
})

// =============================
// 🔥 PEDIDO MANUAL (NUEVO)
// =============================
app.post('/pedidos/manual', async (req, res) => {
  const conn = await db.getConnection()
  try {
    const {
      id_cliente,
      id_vendedor,
      productos,
      fecha_entrega
    } = req.body

    if (!id_cliente || !productos || productos.length === 0) {
      return res.status(400).json({ error: 'Datos incompletos' })
    }

    await conn.beginTransaction()

    let total = 0

    // 🔹 calcular total
    for (const item of productos) {
      total += Number(item.cantidad) * Number(item.precio)
    }

    // 🔥 INSERT PEDIDO
    const [pedidoResult] = await conn.query(`
      INSERT INTO pedidos (
        id_cliente,
        id_vendedor,
        tipo_pedido,
        total,
        fecha,
        fecha_entrega,
        estado,
        total_pagado
      )
      VALUES (?, ?, 'credito', ?, NOW(), ?, 'entregado', 0)
    `, [
      id_cliente,
      id_vendedor || null,
      total,
      fecha_entrega || null
    ])

    const id_pedido = pedidoResult.insertId

    // 🔹 INSERT DETALLE
    for (const item of productos) {
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

    await conn.commit()

    res.json({
      success: true,
      id_pedido,
      total
    })

  } catch (err) {
    await conn.rollback()
    console.error('❌ ERROR PEDIDO MANUAL:', err)
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
    e.fecha_salida,
    CONCAT(c.nombre,' ',c.apellido1) AS cliente,
    c.nombre_tienda,
    r.nombre AS ruta
    FROM pedidos p
    LEFT JOIN clientes c
    ON p.id_cliente = c.id_cliente
    LEFT JOIN rutas r
    ON p.id_ruta = r.id_ruta
    LEFT JOIN (
    SELECT
    id_pedido,
    MAX(fecha_salida) AS fecha_salida
    FROM entregas
    GROUP BY id_pedido
    ) e
    ON p.id_pedido = e.id_pedido
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
      SELECT 
        p.*,
        e.folio,
        e.fecha_entrega
      FROM pedidos p
      INNER JOIN entregas e 
        ON p.id_pedido = e.id_pedido
      WHERE p.id_cliente = ?
      AND p.estado IN ('entregado','pagado') -- 🔥 CORRECCIÓN CLAVE
      AND e.estado = 'entregado'
      ORDER BY e.fecha_entrega DESC
    `, [id_cliente])

    res.json(rows)

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// =============================
// 🔥 PEDIDO EN CURSO (CORREGIDO)
// =============================

app.post('/pedidos/:id/en-curso', async (req, res) => {
  const conn = await db.getConnection()
  try {
    const { id } = req.params
    // 🔥 NUEVO: recibimos campos extra
    const { 
      id_chofer, 
      id_unidad, 
      productos, 
      comentario,
      otro_chofer,
      nombre_chofer,
      apellido_paterno,
      apellido_materno
    } = req.body
    await conn.beginTransaction()
    const [programacion] = await conn.query(`
    SELECT 
      id_programacion,
      id_chofer,
      id_unidad
     FROM programaciones_pedido
     WHERE id_pedido = ?
     AND activo = 1
  LIMIT 1 
`, [id])
    
    let idChoferFinal = id_chofer || null
let idUnidadFinal = id_unidad || null
if (programacion.length) {
  idChoferFinal = id_chofer || programacion[0].id_chofer || null
  idUnidadFinal = id_unidad || programacion[0].id_unidad || null
}
if (!idChoferFinal || !idUnidadFinal) {
  throw new Error('Debe seleccionar chofer y unidad')
}
    
    if (otro_chofer) {
      if (!nombre_chofer || !apellido_paterno || !apellido_materno) {
        throw new Error('Datos de chofer incompletos')
      }
      const [nuevoChofer] = await conn.query(`
        INSERT INTO choferes (nombre, apellido1, apellido2, activo)
        VALUES (?, ?, ?, 1)
      `, [
        nombre_chofer,
        apellido_paterno,
        apellido_materno
      ])
      idChoferFinal = nuevoChofer.insertId
    }
    // 🔥 SOLO cambiamos id_chofer por idChoferFinal
    const [entregaResult] = await conn.query(`
      INSERT INTO entregas (
        id_pedido,
        id_chofer,
        id_unidad,
        comentario,
        estado
      )
      VALUES (?, ?, ?, ?, 'en_ruta')
      `, [id, idChoferFinal, idUnidadFinal, comentario || null])
        const id_entrega = entregaResult.insertId
        for (const item of productos) {
  if (
    Number(item.cantidad_entregada) !== Number(item.cantidad_planeada) &&
    !comentario
  ) {
    throw new Error('Comentario obligatorio por diferencia de cantidades')
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
    item.cantidad_planeada,
    item.cantidad_entregada
  ])
    
    }
        await conn.query(`
      UPDATE pedidos
      SET 
        id_chofer = ?,
        estado = 'en_ruta'
      WHERE id_pedido = ?
    `, [idChoferFinal, id]) // 🔥 aquí también
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

// ENTREGAR PEDIDO (MEJORADO)
// =============================
app.put('/pedidos/:id/entregar', async (req, res) => {
  try {
    const { id } = req.params

    const [result] = await db.query(`
      UPDATE pedidos
      SET estado = 'entregado',
          fecha_entrega = CURRENT_DATE()
      WHERE id_pedido = ?
      AND estado IN ('pendiente','en_ruta')
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
// DETALLE DE PEDIDO
// =============================
app.get('/pedidos/:id/detalle', async (req, res) => {
  try {
    const { id } = req.params

    const [rows] = await db.query(`
SELECT
  pd.id_producto,
  p.nombre,
  pd.precio_unitario AS precio,

  pd.cantidad AS cantidad_pedida,

  COALESCE(prd.cantidad_planeada, pd.cantidad) AS cantidad_planeada,

  ed.cantidad_entregada,

  COALESCE(e.id_chofer, pp.id_chofer) AS id_chofer,
  COALESCE(e.id_unidad, pp.id_unidad) AS id_unidad,

  c.municipio,

  CONCAT(ch.nombre,' ',ch.apellido1,' ',ch.apellido2) AS chofer,

  u.nombre AS unidad

FROM pedido_detalle pd

INNER JOIN productos p
  ON p.id_producto = pd.id_producto

INNER JOIN pedidos pe
  ON pe.id_pedido = pd.id_pedido

INNER JOIN clientes c
  ON c.id_cliente = pe.id_cliente

LEFT JOIN programaciones_pedido pp
  ON pp.id_pedido = pd.id_pedido
  AND pp.activo = 1

LEFT JOIN programacion_detalle prd
  ON prd.id_programacion = pp.id_programacion
  AND prd.id_producto = pd.id_producto

LEFT JOIN entregas e
  ON e.id_pedido = pd.id_pedido
  AND e.estado IN ('en_ruta','entregado')

LEFT JOIN entrega_detalle ed
  ON ed.id_entrega = e.id_entrega
  AND ed.id_producto = pd.id_producto

LEFT JOIN choferes ch
  ON ch.id_chofer = COALESCE(e.id_chofer, pp.id_chofer)

LEFT JOIN unidades u
  ON u.id_unidad = COALESCE(e.id_unidad, pp.id_unidad)

WHERE pd.id_pedido = ?
    `, [id])

    res.json(rows)
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
    const { comentario } = req.body

    if (!comentario || !comentario.trim()) {
      return res.status(400).json({ error: 'Comentario obligatorio' })
    }

    const [result] = await db.query(`
      UPDATE pedidos
      SET 
        estado = 'cancelado',
        fecha_cancelacion = NOW(),
        observaciones_cancelacion = ?
      WHERE id_pedido = ?
      AND estado = 'pendiente'
    `, [comentario, id])

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

app.post('/pedidos/modificar', async (req, res) => {
  const conn = await db.getConnection()

  try {
    const {
      id_pedido,
      password,
      motivo,
      usuario,
      productos
    } = req.body

    if (!id_pedido) {
      throw new Error('id_pedido requerido')
    }

    if (password !== 'Modific00.1') {
      throw new Error('Contraseña incorrecta')
    }

    if (!motivo || motivo.trim() === '') {
      throw new Error('Motivo obligatorio')
    }

    if (!Array.isArray(productos) || productos.length === 0) {
      throw new Error('Productos inválidos')
    }

    await conn.beginTransaction()

    // Validar pedido y estado
    const [[pedido]] = await conn.query(`
      SELECT id_pedido, estado
      FROM pedidos
      WHERE id_pedido = ?
    `, [id_pedido])

    if (!pedido) {
      throw new Error('Pedido no existe')
    }

    if (
      pedido.estado !== 'pendiente' &&
      pedido.estado !== 'programado'
    ) {
      throw new Error(
        'Solo pueden modificarse pedidos en estado pendiente o programado'
      )
    }

    for (const item of productos) {

      const [detalleActual] = await conn.query(`
        SELECT
          id_detalle,
          cantidad,
          precio_unitario
        FROM pedido_detalle
        WHERE id_pedido = ?
        AND id_producto = ?
      `, [
        id_pedido,
        item.id_producto
      ])

      // PRODUCTO NUEVO
      if (detalleActual.length === 0) {

        if (item.cantidad <= 0) {
          continue
        }

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
          item.precio_unitario
        ])

        await conn.query(`
          INSERT INTO pedido_modificaciones (
            id_pedido,
            id_producto,
            cantidad_anterior,
            cantidad_nueva,
            precio_anterior,
            precio_nuevo,
            accion,
            motivo,
            usuario
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          id_pedido,
          item.id_producto,
          0,
          item.cantidad,
          0,
          item.precio_unitario,
          'agregado',
          motivo,
          usuario || null
        ])

        continue
      }

      const anterior = detalleActual[0]

      let accion = null

      if (item.cantidad === 0) {
        accion = 'eliminado'
      } else if (item.cantidad > anterior.cantidad) {
        accion = 'incrementado'
      } else if (item.cantidad < anterior.cantidad) {
        accion = 'disminuido'
      }

      if (
        Number(item.precio_unitario) !==
        Number(anterior.precio_unitario)
      ) {
        accion = 'precio_modificado'
      }

      // Eliminar producto
      if (item.cantidad === 0) {

        await conn.query(`
          DELETE FROM pedido_detalle
          WHERE id_pedido = ?
          AND id_producto = ?
        `, [
          id_pedido,
          item.id_producto
        ])

      } else {

        await conn.query(`
          UPDATE pedido_detalle
          SET
            cantidad = ?,
            precio_unitario = ?
          WHERE id_pedido = ?
          AND id_producto = ?
        `, [
          item.cantidad,
          item.precio_unitario,
          id_pedido,
          item.id_producto
        ])
      }

      if (accion) {
        await conn.query(`
          INSERT INTO pedido_modificaciones (
            id_pedido,
            id_producto,
            cantidad_anterior,
            cantidad_nueva,
            precio_anterior,
            precio_nuevo,
            accion,
            motivo,
            usuario
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          id_pedido,
          item.id_producto,
          anterior.cantidad,
          item.cantidad,
          anterior.precio_unitario,
          item.precio_unitario,
          accion,
          motivo,
          usuario || null
        ])
      }
    }

    // Recalcular total
    await conn.query(`
      UPDATE pedidos p
      SET total = (
        SELECT COALESCE(
          SUM(cantidad * precio_unitario),
          0
        )
        FROM pedido_detalle pd
        WHERE pd.id_pedido = p.id_pedido
      )
      WHERE p.id_pedido = ?
    `, [id_pedido])

    await conn.commit()

    res.json({
      success: true,
      message: 'Pedido modificado correctamente'
    })

  } catch (err) {

    await conn.rollback()

    res.status(500).json({
      success: false,
      error: err.message
    })

  } finally {

    conn.release()

  }
})


// =============================
// CHOFERES
// =============================
app.get('/choferes', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM choferes WHERE activo = 1')
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
    const [rows] = await db.query('SELECT * FROM unidades WHERE activo = 1')
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.get('/control-envios/:id_chofer', async (req, res) => {
  const conn = await db.getConnection()
  try {
    const { id_chofer } = req.params

    // 🔹 Obtener pedidos en ruta con info general
    const [pedidos] = await conn.query(`
      SELECT 
        p.id_pedido,
        c.nombre AS cliente,
        c.nombre_tienda AS tienda,
        r.nombre AS ruta,
        e.fecha_salida,
        e.id_entrega
      FROM pedidos p
      INNER JOIN clientes c ON p.id_cliente = c.id_cliente
      LEFT JOIN rutas r ON p.id_ruta = r.id_ruta
      INNER JOIN entregas e ON p.id_pedido = e.id_pedido
      WHERE p.id_chofer = ?
      AND p.estado = 'en_ruta'
    `, [id_chofer])

    // 🔹 Para cada pedido, traer productos
    for (const pedido of pedidos) {

      const [productos] = await conn.query(`
        SELECT 
        ed.id_producto,
        pr.nombre,
        ed.cantidad_pedida,
        ed.cantidad_entregada,
        ed.cantidad_final,
        ed.tipo,
        COALESCE(pd.precio_unitario, pr.precio) AS precio_unitario
        FROM entrega_detalle ed
        INNER JOIN productos pr 
          ON ed.id_producto = pr.id_producto
        INNER JOIN entregas e 
          ON ed.id_entrega = e.id_entrega
        LEFT JOIN pedido_detalle pd 
          ON pd.id_pedido = e.id_pedido 
          AND pd.id_producto = ed.id_producto
        WHERE ed.id_entrega = ?
      `, [pedido.id_entrega])

      pedido.productos = productos

      let totalPedido = 0
      let totalDescuento = 0

      for (const item of productos) {
        const precio = item.precio_unitario || 0
        const pedida = item.cantidad_pedida || 0
        const entregada = item.cantidad_entregada || 0

        // 🔹 Pedido original
        totalPedido += pedida * precio

        // 🔥 AGREGADOS SUMAN COMO VENTA EXTRA
        if (item.tipo === 'agregado') {
          totalPedido += entregada * precio
        }

        const diferencia = pedida - entregada

        // 🔥 NO descontar prestamos NI agregados
        if (
          diferencia > 0 &&
          item.tipo !== 'prestamo' &&
          item.tipo !== 'agregado'
        ) {
          totalDescuento += diferencia * precio
        }
      }

      pedido.total_pedido = totalPedido
      pedido.total_descuento = totalDescuento
      pedido.total_final = totalPedido - totalDescuento
    }

    res.json(pedidos)

  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  } finally {
    conn.release()
  }
})

app.post('/control-envios/finalizar', async (req, res) => {
  const conn = await db.getConnection()
  try {
    console.log('🚀 INICIO FINALIZAR')
    const { id_entrega, productos, folio } = req.body
    if (!id_entrega) throw new Error('id_entrega requerido')
    if (!folio) throw new Error('Folio obligatorio')
    if (!Array.isArray(productos) || productos.length === 0) {
      throw new Error('Productos inválidos')
    }
    console.log('📦 DATA:', { id_entrega, folio, productos: productos.length })
    await conn.beginTransaction()
    console.log('🟡 TX START')
    const [entregaCheck] = await conn.query(
      'SELECT estado FROM entregas WHERE id_entrega = ?',
      [id_entrega]
    )
    if (entregaCheck.length === 0) {
      throw new Error('Entrega no existe')
    }
    console.log('✅ CHECK ENTREGA')
    const [folioExiste] = await conn.query(
      'SELECT id_entrega FROM entregas WHERE folio = ? AND id_entrega != ?',
      [folio, id_entrega]
    )
    if (folioExiste.length > 0) {
      throw new Error('Folio ya existe')
    }
    console.log('✅ CHECK FOLIO')
    const [[pedidoInfo]] = await conn.query(`
    SELECT id_pedido
    FROM entregas
    WHERE id_entrega = ?
    `, [id_entrega])
const id_pedido = pedidoInfo.id_pedido
    // 🔥 PROCESO DE PRODUCTOS
    for (const item of productos) {
      console.log('🔄 PRODUCTO', item.id_producto)
      if (item.tipo === 'agregado') {
        // 🔥 VALIDACIÓN EXTRA (no rompe nada)
       if (!item.cantidad_final || item.cantidad_final <= 0) {
       throw new Error('Cantidad inválida en producto agregado')
       }
        console.log('🆕 INSERT/UPDATE AGREGADO')
        const [existe] = await conn.query(`
          SELECT id_producto 
          FROM entrega_detalle
          WHERE id_entrega = ? 
          AND id_producto = ? 
          AND tipo = 'agregado'
        `, [id_entrega, item.id_producto])
        if (existe.length > 0) {
          // 🔁 YA EXISTE → SUMAR
          await conn.query(`
           UPDATE entrega_detalle
SET cantidad_final = cantidad_final + ?
WHERE id_entrega = ?
AND id_producto = ?
AND tipo = 'agregado'
          `, [
            item.cantidad_final || 0,
            id_entrega,
            item.id_producto
          ])
        }
        else {
          // 🆕 NUEVO
          await conn.query(`
          INSERT INTO entrega_detalle (
  id_entrega,
  id_producto,
  cantidad_pedida,
  cantidad_entregada,
  cantidad_final,
  tipo,
  motivo
)
VALUES (?, ?, 0, 0, ?, 'agregado', ?)
          `,[
  id_entrega,
  item.id_producto,
  item.cantidad_final,
  item.motivo || null
]
                          )
        }
      const [productoPedido] = await conn.query(`
  SELECT id_detalle
  FROM pedido_detalle
  WHERE id_pedido = ?
  AND id_producto = ?
`, [
  id_pedido,
  item.id_producto
])

if (productoPedido.length === 0) {
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
    item.cantidad_final,
    item.precio_unitario
  ])
}
        
        // 🔥 ACTUALIZAR PEDIDO_DETALLE
      } else {
        console.log('✏️ UPDATE NORMAL')
      await conn.query(`
UPDATE entrega_detalle
SET
cantidad_final = ?,
tipo = ?,
motivo = ?,
id_cliente_destino = ?
WHERE id_entrega = ? AND id_producto = ?
`, [
item.cantidad_final || 0,
item.tipo || 'ninguno',
(item.tipo === 'roto' || item.tipo === 'con_incremento')
  ? (item.motivo || null)
  : null,
item.tipo === 'prestamo'
  ? (item.id_cliente_destino || null)
  : null,
id_entrega,
item.id_producto
])
      
      }
    }
    console.log('✅ PRODUCTOS OK')
    await conn.query(`
      UPDATE entregas 
      SET estado = 'entregado', folio = ?, fecha_entrega = NOW() 
      WHERE id_entrega = ?
    `, [folio, id_entrega])
    console.log('✅ ENTREGA CERRADA')
   await conn.query(`
  UPDATE pedidos
  SET 
    estado = 'entregado',
    fecha_entrega = NOW()
  WHERE id_pedido = (
    SELECT id_pedido FROM entregas WHERE id_entrega = ?
  )
`, [id_entrega])
    console.log('✅ PEDIDO CERRADO')
   
    await conn.query(`
UPDATE pedidos p
SET total = (
  SELECT COALESCE(
    SUM(
      ed.cantidad_final *
      COALESCE(pd.precio_unitario, 0)
    ),
    0
  )
  FROM entrega_detalle ed
  INNER JOIN pedido_detalle pd
    ON pd.id_pedido = p.id_pedido
   AND pd.id_producto = ed.id_producto
  WHERE ed.id_entrega = ?
)
WHERE p.id_pedido = ?
`, [
  id_entrega,
  id_pedido
])
    
    await conn.commit()
    console.log('🎉 COMMIT')
    res.json({ success: true })
  } catch (err) {
    console.error('❌ ERROR FINALIZAR:', err)
    await conn.rollback()
    res.status(500).json({
      error: err.message
    })
  } finally {
    conn.release()
  }
})

app.post('/control-envios/cancelar', async (req, res) => {
  const conn = await db.getConnection()
  try {
    const { id_entrega, comentario } = req.body

    if (!id_entrega) {
      return res.status(400).json({ error: 'id_entrega requerido' })
    }

    if (!comentario || !comentario.trim()) {
      return res.status(400).json({ error: 'Comentario obligatorio' })
    }

    await conn.beginTransaction()

    // 🔍 validar entrega
    const [entrega] = await conn.query(`
      SELECT id_pedido, estado FROM entregas WHERE id_entrega = ?
    `, [id_entrega])

    if (!entrega.length) {
      throw new Error('Entrega no existe')
    }

    if (entrega[0].estado === 'entregado') {
      throw new Error('No se puede cancelar, ya fue entregado')
    }

    const id_pedido = entrega[0].id_pedido

    // 🚚 cancelar entrega (PROTEGIDO)
    await conn.query(`
      UPDATE entregas
      SET estado = 'no_entregado'
      WHERE id_entrega = ?
      AND estado != 'entregado'
    `, [id_entrega])

    // 📄 cancelar pedido (PROTEGIDO)
    await conn.query(`
      UPDATE pedidos
      SET 
        estado = 'cancelado',
        fecha_cancelacion = NOW(),
        observaciones_cancelacion = ?
      WHERE id_pedido = ?
      AND estado IN ('pendiente','en_ruta')
    `, [comentario, id_pedido])

    await conn.commit()

    res.json({ success: true })

  } catch (err) {
    await conn.rollback()
    res.status(500).json({ error: err.message })
  } finally {
    conn.release()
  }
})

// =============================
// 💰 PAGOS (ABONOS)
// =============================
app.post('/pagos', async (req, res) => {
  const conn = await db.getConnection()

  try {
    let {
      id_pedido,
      monto,
      metodo,
      cuenta_destino,
      id_usuario,
      tipo_usuario,
      nombre_usuario,
      fecha_pago
    } = req.body

    // =============================
    // 🔥 NORMALIZAR
    // =============================
    const montoNum = Number(monto)
    metodo = metodo?.toLowerCase()
    tipo_usuario = tipo_usuario?.toLowerCase()
    nombre_usuario = nombre_usuario?.trim()

    // =============================
    // 🔥 VALIDACIONES BASE
    // =============================
    if (!id_pedido || !metodo || !id_usuario || !tipo_usuario) {
      return res.status(400).json({ error: 'Datos incompletos' })
    }

    if (isNaN(montoNum) || montoNum <= 0) {
      return res.status(400).json({ error: 'Monto inválido' })
    }

    if (!['efectivo', 'transferencia'].includes(metodo)) {
      return res.status(400).json({ error: 'Método inválido' })
    }

    if (!['chofer', 'vendedor'].includes(tipo_usuario)) {
      return res.status(400).json({ error: 'Tipo usuario inválido' })
    }

    if (!fecha_pago) {
    return res.status(400).json({ error: 'Fecha de abono requerida' })
    }
    // =============================
    // 🔥 VALIDAR CUENTA
    // =============================
    if (metodo === 'transferencia') {
      const cuentasValidas = ['fiscal', 'yair', 'rosario', 'giovanny', 'natanael']

      if (!cuenta_destino || !cuentasValidas.includes(cuenta_destino)) {
        return res.status(400).json({ error: 'Cuenta destino inválida' })
      }
  }

    // =============================
    // 🔥 EFECTIVO: OBLIGAR NOMBRE
    // =============================
    if (metodo === 'efectivo') {
      if (!nombre_usuario) {
        return res.status(400).json({
          error: 'Debe especificar quién entrega el dinero'
        })
      }
    }

    const cuentaFinal = metodo === 'efectivo' ? null : cuenta_destino

    await conn.beginTransaction()

    // =============================
    // 🔎 OBTENER PEDIDO
    // =============================
    const [pedidoRows] = await conn.query(`
      SELECT total, total_pagado, estado
      FROM pedidos 
      WHERE id_pedido = ?
    `, [id_pedido])

    if (!pedidoRows.length) {
      return res.status(404).json({ error: 'Pedido no existe' })
    }

    const pedido = pedidoRows[0]

    if (pedido.estado === 'cancelado') {
      return res.status(400).json({
        error: 'No se puede pagar un pedido cancelado'
      })
    }

    const total = Number(pedido.total || 0)
    const total_pagado = Number(pedido.total_pagado || 0)
    const saldoActual = total - total_pagado

    if (saldoActual <= 0) {
      return res.status(400).json({
        error: 'Este pedido ya está liquidado'
      })
    }

    if (montoNum > saldoActual) {
      return res.status(400).json({
        error: 'El monto excede el saldo pendiente'
      })
    }

    const nuevoTotalPagado = total_pagado + montoNum

    // =============================
    // 💾 INSERT
    // =============================
    await conn.query(`
      INSERT INTO pagos (
        id_pedido,
        fecha_pago,
        monto,
        metodo,
        cuenta_destino,
        id_usuario,
        tipo_usuario,
        nombre_usuario
      )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      id_pedido,
      fecha_pago, 
      montoNum,
      metodo,
      cuentaFinal,
      id_usuario,
      tipo_usuario,
      metodo === 'efectivo' ? nombre_usuario : null
    ])

    // =============================
    // 🔄 UPDATE PEDIDO (PRO)
    // =============================
    await conn.query(`
      UPDATE pedidos
      SET 
        total_pagado = ?,
        estado = CASE 
          WHEN ? >= total THEN 'pagado'
          ELSE estado
        END
      WHERE id_pedido = ?
    `, [
      nuevoTotalPagado,
      nuevoTotalPagado,
      id_pedido
    ])

    await conn.commit()

    res.json({
      success: true,
      total,
      total_pagado: nuevoTotalPagado,
      saldo_restante: total - nuevoTotalPagado,
      pagado: (total - nuevoTotalPagado) <= 0
    })

  } catch (err) {
    await conn.rollback()
    res.status(500).json({ error: err.message })
  } finally {
    conn.release()
  }
})

/* =============================
   🔎 OBTENER PAGOS (DETALLE)
============================= */
app.get('/pagos/:id_pedido', async (req, res) => {
  try {
    const { id_pedido } = req.params

    const [rows] = await db.query(`
      SELECT 
        id_pago,
        fecha_pago,
        fecha_registro,
        monto,
        metodo,
        cuenta_destino,
        tipo_usuario,
        nombre_usuario
      FROM pagos
      WHERE id_pedido = ?
      ORDER BY fecha_pago DESC, fecha_registro DESC
    `, [id_pedido])

    res.json(rows)

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// =============================
// 📊 ESTADO DE CUENTA PEDIDO
// =============================
app.get('/pedidos/:id/estado-cuenta', async (req, res) => {
  try {
    const { id } = req.params

    // 🔹 1. Pedido
    const [pedidoRows] = await db.query(`
      SELECT 
        p.id_pedido,
        p.total,
        p.total_pagado,
        p.estado,
        p.fecha,
        p.fecha_vencimiento,
        c.nombre_tienda,
        CONCAT(c.nombre,' ',c.apellido1) AS cliente
      FROM pedidos p
      LEFT JOIN clientes c ON c.id_cliente = p.id_cliente
      WHERE p.id_pedido = ?
    `, [id])

    if (!pedidoRows.length) {
      return res.status(404).json({ error: 'Pedido no existe' })
    }

    const pedido = pedidoRows[0]

    // 🔹 2. Pagos
    const [pagos] = await db.query(`
      SELECT 
        id_pago,
        fecha_pago,
        monto,
        metodo,
        cuenta_destino,
        nombre_usuario
      FROM pagos
      WHERE id_pedido = ?
      ORDER BY fecha_pago ASC
    `, [id])

    // 🔹 3. Cálculo
    let totalPagado = 0

    const pagosConSaldo = pagos.map(p => {
      totalPagado += Number(p.monto)

      return {
        ...p,
        acumulado: totalPagado,
        saldo_restante: Number(pedido.total) - totalPagado
      }
    })

    res.json({
      pedido,
      pagos: pagosConSaldo,
      resumen: {
        total: Number(pedido.total),
        total_pagado: totalPagado,
        saldo: Number(pedido.total) - totalPagado
      }
    })

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.post('/pedidos/:id/programar', async (req, res) => {
  const conn = await db.getConnection()

  try {
    const { id } = req.params
    const {
     fecha_programada,
     comentario='',
     id_chofer=null,
     id_unidad=null,
     productos=[]
     } = req.body
    
    if (!fecha_programada) {
      return res.status(400).json({ error: 'Fecha requerida' })
    }

    if (isNaN(new Date(fecha_programada).getTime())) {
      return res.status(400).json({ error: 'Fecha inválida' })
    }

    await conn.beginTransaction()

    // 1. Validar pedido
    const [pedidoRows] = await conn.query(`
      SELECT id_pedido, estado
      FROM pedidos
      WHERE id_pedido = ?
    `, [id])

    if (!pedidoRows.length) {
      await conn.rollback()
      return res.status(404).json({ error: 'Pedido no existe' })
    }

    const estadoActual = pedidoRows[0].estado

    if (['cancelado', 'entregado', 'pagado'].includes(estadoActual)) {
      await conn.rollback()
      return res.status(400).json({
        error: 'No se puede programar este pedido'
      })
    }

    // 2. Buscar última programación activa
    const [progActiva] = await conn.query(`
      SELECT id_programacion
      FROM programaciones_pedido
      WHERE id_pedido = ?
      AND activo = 1
      ORDER BY id_programacion DESC
      LIMIT 1
    `, [id])

     let productosFinal = []
    // 3. Si existe programación previa, copiar cantidades anteriores
   if (progActiva.length) {
  const idAnterior = progActiva[0].id_programacion

  await conn.query(`
    UPDATE programaciones_pedido
    SET activo = 0
    WHERE id_programacion = ?
  `, [idAnterior])
}

const [detallePedido] = await conn.query(`
  SELECT
    id_producto,
    cantidad AS cantidad_pedida
  FROM pedido_detalle
  WHERE id_pedido = ?
`, [id])

productosFinal = detallePedido.map(p => {

  const enviado = productos.find(
    x => Number(x.id_producto) === Number(p.id_producto)
  )

  return {
    id_producto: p.id_producto,
    cantidad_pedida: p.cantidad_pedida,
    cantidad_planeada: enviado
      ? Number(enviado.cantidad_planeada)
      : Number(p.cantidad_pedida)
  }
})

    if (!productosFinal.length) {
      throw new Error('No hay productos para programar')
    }

     const [insertProg] = await conn.query(`
     INSERT INTO programaciones_pedido (
     id_pedido,
     fecha_programada,
     activo,
     estado,
     comentario,
     id_chofer,
     id_unidad
     )
     VALUES (?, ?, 1, 'planeado', ?, ?, ?)
     `, [
     id,
     fecha_programada,
     comentario,
     id_chofer,
     id_unidad
    ])
    
    const id_programacion = insertProg.insertId

    // 5. Insertar detalle
   for (const p of productosFinal){
      await conn.query(`
        INSERT INTO programacion_detalle (
          id_programacion,
          id_producto,
          cantidad_pedida,
          cantidad_planeada
        )
        VALUES (?, ?, ?, ?)
      `, [
        id_programacion,
        p.id_producto,
        p.cantidad_pedida,
        p.cantidad_planeada
      ])
    }

    // 6. Cambiar estado pedido
    await conn.query(`
      UPDATE pedidos
      SET estado = 'programado'
      WHERE id_pedido = ?
    `, [id])

    await conn.commit()

    res.json({
      success: true,
      message: 'Pedido programado correctamente',
      id_programacion,
      fecha_programada
    })

  } catch (err) {
    await conn.rollback()
    res.status(500).json({
      error: err.message
    })
  } finally {
    conn.release()
  }
})

app.get('/pedidos-filtrados', async (req, res) => {
  try {
    const { fecha, tipo } = req.query

    let query = `
      SELECT 
        p.id_pedido,
        p.estado,
        p.fecha,
        CONCAT(c.nombre,' ',c.apellido1) AS cliente,
        c.nombre_tienda,
        r.nombre AS ruta,
        pp.id_programacion,
        pp.fecha_programada,
        pd.id_producto,
        pr.nombre AS producto,
        pd.cantidad_pedida,
        pd.cantidad_planeada
      FROM pedidos p
      LEFT JOIN clientes c 
        ON p.id_cliente = c.id_cliente
      LEFT JOIN rutas r
        ON p.id_ruta = r.id_ruta
      LEFT JOIN programaciones_pedido pp
        ON p.id_pedido = pp.id_pedido
        AND pp.activo = 1
      LEFT JOIN programacion_detalle pd
        ON pd.id_programacion = pp.id_programacion
      LEFT JOIN productos pr
        ON pr.id_producto = pd.id_producto
      WHERE 1=1
    `

    const params = []

    if (tipo && !['normal', 'programado', 'todos'].includes(tipo)) {
      return res.status(400).json({ error: 'Tipo inválido' })
    }

    if (tipo === 'programado') {
      query += ` AND p.estado = 'programado'`
    }

    if (tipo === 'normal') {
      query += ` AND (p.estado != 'programado' OR p.estado IS NULL)`
    }

    if (fecha) {
      if (isNaN(new Date(fecha))) {
        return res.status(400).json({ error: 'Fecha inválida' })
      }

      query += `
        AND (
          DATE(p.fecha) = ?
          OR pp.fecha_programada = ?
        )
      `
      params.push(fecha, fecha)
    }

    query += ` ORDER BY p.fecha DESC`

    const [rows] = await db.query(query, params)

    res.json(rows)

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// =============================
// 📅 SOLO PROGRAMADOS (PRO)
// =============================
app.get('/pedidos-programados', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        p.*,
        CONCAT(c.nombre,' ',c.apellido1) AS cliente,
        c.nombre_tienda,
        r.nombre AS ruta,
        pp.fecha_programada
      FROM pedidos p
      INNER JOIN programaciones_pedido pp
        ON p.id_pedido = pp.id_pedido
      LEFT JOIN clientes c 
        ON p.id_cliente = c.id_cliente
      LEFT JOIN rutas r
        ON p.id_ruta = r.id_ruta
      WHERE pp.activo = 1
      AND p.estado = 'programado'
      GROUP BY p.id_pedido
      ORDER BY pp.fecha_programada ASC, p.id_pedido ASC
    `)

    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.post('/programaciones/:id/detalle', async (req, res) => {
  const conn = await db.getConnection()
  try {
    const { id } = req.params
    const { productos } = req.body

    if (!Array.isArray(productos) || productos.length === 0) {
      return res.status(400).json({ error: 'Productos inválidos' })
    }

    await conn.beginTransaction()

    // 🔥 validar programación activa
    const [prog] = await conn.query(`
      SELECT id_programacion 
      FROM programaciones_pedido 
      WHERE id_programacion = ? AND activo = 1
    `, [id])

    if (!prog.length) {
      throw new Error('Programación no existe o inactiva')
    }

    // 🔥 validar duplicados
    const ids = productos.map(p => p.id_producto)
    const duplicados = ids.filter((id, i) => ids.indexOf(id) !== i)

    if (duplicados.length > 0) {
      throw new Error('Productos duplicados')
    }

    // 🔥 borrar anterior
    await conn.query(`
      DELETE FROM programacion_detalle
      WHERE id_programacion = ?
    `, [id])

    for (const p of productos) {

      if (!p.id_producto) {
        throw new Error('Producto inválido')
      }

      if (p.cantidad_pedida == null || p.cantidad_planeada == null) {
        throw new Error('Cantidades requeridas')
      }

      if (p.cantidad_planeada < 0 || p.cantidad_pedida < 0) {
        throw new Error('Cantidades inválidas')
      }

      if (!Number.isInteger(p.cantidad_pedida) || !Number.isInteger(p.cantidad_planeada)) {
        throw new Error('Cantidades deben ser enteros')
      }

      // 🔥 validar producto existe
      const [existe] = await conn.query(
        `SELECT id_producto FROM productos WHERE id_producto = ?`,
        [p.id_producto]
      )

      if (!existe.length) {
        throw new Error(`Producto no existe: ${p.id_producto}`)
      }

      await conn.query(`
        INSERT INTO programacion_detalle (
          id_programacion,
          id_producto,
          cantidad_pedida,
          cantidad_planeada
        )
        VALUES (?, ?, ?, ?)
      `, [
        id,
        p.id_producto,
        p.cantidad_pedida,
        p.cantidad_planeada
      ])
    }

    // 🔥 estado automático
    const parcial = productos.some(
      p => p.cantidad_planeada < p.cantidad_pedida
    )

    await conn.query(`
      UPDATE programaciones_pedido
      SET estado = ?
      WHERE id_programacion = ?
    `, [
      parcial ? 'parcial' : 'completado',
      id
    ])

    await conn.commit()

    res.json({ success: true })

  } catch (err) {
    await conn.rollback()
    res.status(500).json({ error: err.message })
  } finally {
    conn.release()
  }
})

// =============================
// 📦 OBTENER DETALLE PROGRAMACIÓN
// =============================
app.get('/programaciones/:id/detalle', async (req, res) => {
  try {
    const { id } = req.params

    const [rows] = await db.query(`
      SELECT 
        pd.id_producto,
        pr.nombre,
        pd.cantidad AS cantidad_pedida,
        COALESCE(pg.cantidad_planeada, 0) AS cantidad_planeada
      FROM pedido_detalle pd
      LEFT JOIN productos pr 
        ON pd.id_producto = pr.id_producto
      LEFT JOIN programacion_detalle pg
        ON pd.id_producto = pg.id_producto
        AND pg.id_programacion = ?
      WHERE pd.id_pedido = (
        SELECT id_pedido 
        FROM programaciones_pedido 
        WHERE id_programacion = ?
      )
    `, [id, id])

    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})


// =============================
// 📅 HISTORIAL PROGRAMACIONES PEDIDO
// =============================
app.get('/pedidos/:id/programaciones', async (req, res) => {
  try {
    const { id } = req.params

    const [rows] = await db.query(`
      SELECT
        pp.id_programacion,
        pp.id_pedido,
        pp.fecha_programada,
        pp.fecha_creacion,
        pp.activo,
        pp.estado,
        pp.comentario,
        (
          SELECT COUNT(*)
          FROM programacion_detalle pd
          WHERE pd.id_programacion = pp.id_programacion
        ) AS total_productos,
        (
          SELECT COALESCE(SUM(pd.cantidad_planeada),0)
          FROM programacion_detalle pd
          WHERE pd.id_programacion = pp.id_programacion
        ) AS total_planeado
      FROM programaciones_pedido pp
      WHERE pp.id_pedido = ?
      ORDER BY pp.id_programacion DESC
    `, [id])

    res.json(rows)

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// =============================
// 📦 PRODUCTOS DE PROGRAMACIÓN
// =============================
app.get('/programaciones/:id/productos', async (req, res) => {
  try {
    const { id } = req.params

    // 🔥 validar que exista la programación
    const [prog] = await db.query(`
      SELECT id_programacion, id_pedido, activo
      FROM programaciones_pedido
      WHERE id_programacion = ?
    `, [id])

    if (!prog.length) {
      return res.status(404).json({ error: 'Programación no encontrada' })
    }

    // 🔥 traer productos reales de esa programación
    const [rows] = await db.query(`
      SELECT
        pd.id_producto,
        pr.nombre,
        pd.cantidad_pedida,
        pd.cantidad_planeada
      FROM programacion_detalle pd
      INNER JOIN productos pr
        ON pr.id_producto = pd.id_producto
      WHERE pd.id_programacion = ?
      ORDER BY pr.nombre ASC
    `, [id])

    res.json({
      id_programacion: Number(id),
      id_pedido: prog[0].id_pedido,
      activo: prog[0].activo,
      productos: rows
    })

  } catch (err) {
    console.error('ERROR /programaciones/:id/productos', err)
    res.status(500).json({ error: err.message })
  }
})

app.post('/programaciones/:id/produccion', async (req, res) => {
  const conn = await db.getConnection()

  try {
    const { id } = req.params

    await conn.beginTransaction()

    const [rows] = await conn.query(`
      SELECT pp.id_programacion, pp.id_pedido, pp.activo, p.estado
      FROM programaciones_pedido pp
      INNER JOIN pedidos p ON p.id_pedido = pp.id_pedido
      WHERE pp.id_programacion = ?
      LIMIT 1
    `, [id])

    if (!rows.length) {
      throw new Error('Programación no existe')
    }

    const prog = rows[0]

    if (prog.activo != 1) {
      throw new Error('Programación inactiva')
    }

    if (prog.estado === 'cancelado') {
      throw new Error('Pedido cancelado')
    }

    await conn.query(`
      UPDATE programaciones_pedido
      SET estado = 'produccion'
      WHERE id_programacion = ?
    `, [id])

    await conn.query(`
      UPDATE pedidos
      SET estado = 'produccion'
      WHERE id_pedido = ?
    `, [prog.id_pedido])

    await conn.commit()

    res.json({
      success: true,
      message: 'Enviado a producción'
    })

  } catch (err) {
    await conn.rollback()
    res.status(500).json({ error: err.message })
  } finally {
    conn.release()
  }
})

// =============================
// 🚚 ENVIAR PROGRAMACIÓN A RUTA (CORREGIDO)
// Solo manda a ruta lo que YA está producido
// =============================
app.post('/programaciones/:id/enviar', async (req, res) => {
  const conn = await db.getConnection()

  try {
    const { id } = req.params
    const {
      id_chofer,
      id_unidad,
      comentario = ''
    } = req.body

    if (!id_chofer) {
      return res.status(400).json({ error: 'Chofer requerido' })
    }

    if (!id_unidad) {
      return res.status(400).json({ error: 'Unidad requerida' })
    }

    await conn.beginTransaction()

    // 🔍 Buscar programación
    const [progRows] = await conn.query(`
      SELECT
        pp.id_programacion,
        pp.id_pedido,
        pp.activo,
        pp.estado,
        p.estado AS estado_pedido
      FROM programaciones_pedido pp
      INNER JOIN pedidos p
        ON p.id_pedido = pp.id_pedido
      WHERE pp.id_programacion = ?
      LIMIT 1
    `, [id])

    if (!progRows.length) {
      throw new Error('Programación no existe')
    }

    const prog = progRows[0]

    if (prog.activo != 1) {
      throw new Error('La programación está inactiva')
    }

    if (prog.estado_pedido === 'cancelado') {
      throw new Error('Pedido cancelado')
    }

    // 🔥 SOLO permitir enviar si ya fue producido
    if (!['produccion', 'completado', 'parcial'].includes(prog.estado))
    {
      throw new Error('Primero debe pasar por producción')
    }

    // 🔍 Validar que no esté ya en ruta
    const [existeEntrega] = await conn.query(`
      SELECT id_entrega
      FROM entregas
      WHERE id_pedido = ?
      AND estado = 'en_ruta'
      LIMIT 1
    `, [prog.id_pedido])

    if (existeEntrega.length) {
      throw new Error('El pedido ya está en ruta')
    }

    // 📦 Traer productos producidos
    const [productos] = await conn.query(`
      SELECT
        id_producto,
        cantidad_planeada
      FROM programacion_detalle
      WHERE id_programacion = ?
      AND cantidad_planeada > 0
    `, [id])

    if (!productos.length) {
      throw new Error('No hay producto listo para enviar')
    }

    // 🚚 Crear entrega
    const [entregaResult] = await conn.query(`
      INSERT INTO entregas (
        id_pedido,
        id_chofer,
        id_unidad,
        comentario,
        estado
      )
      VALUES (?, ?, ?, ?, 'en_ruta')
    `, [
      prog.id_pedido,
      id_chofer,
      id_unidad,
      comentario || null
    ])

    const id_entrega = entregaResult.insertId

    // 📦 Pasar productos a entrega
    for (const item of productos) {
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
        item.cantidad_planeada,
        item.cantidad_planeada
      ])
    }

    // 🔄 Pedido a ruta
    await conn.query(`
      UPDATE pedidos
      SET estado = 'en_ruta',
          id_chofer = ?
      WHERE id_pedido = ?
    `, [
      id_chofer,
      prog.id_pedido
    ])

    // 🔄 Programación enviada
    await conn.query(`
      UPDATE programaciones_pedido
      SET estado = 'enviado'
      WHERE id_programacion = ?
    `, [id])

    await conn.commit()

    res.json({
      success: true,
      id_entrega,
      id_pedido: prog.id_pedido
    })

  } catch (err) {
    await conn.rollback()

    res.status(500).json({
      error: err.message
    })

  } finally {
    conn.release()
  }
})

app.post('/produccion', async (req, res) => {
  try {
    const { datos, rol, fecha } = req.body

    if (!Array.isArray(datos)) {
      return res.status(400).json({ error: 'datos inválidos' })
    }

    const fechaFinal = fecha || new Date().toISOString().slice(0, 10)

    // VALIDAR PRIMERO
    for (const item of datos) {
      if (!item.id_producto) {
        return res.status(400).json({ error: 'id_producto faltante' })
      }
      if (item.cantidad == null || isNaN(item.cantidad)) {
        return res.status(400).json({ error: 'cantidad inválida' })
      }
    }

    // INSERT MASIVO
    await Promise.all(datos.map(item => {
      return db.query(`
        INSERT INTO produccion_diaria 
        (id_producto, fecha, cantidad, capturado_por)
        VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE 
        cantidad = cantidad + VALUES(cantidad),
        capturado_por = VALUES(capturado_por)
      `, [
        item.id_producto,
        fechaFinal,
        item.cantidad,
        rol || 'supervisor'
      ])
    }))

    res.json({ ok: true })

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.get('/produccion/calendario-anual', async (req, res) => {
  try {
    // 🔥 1. Convertir y validar año
    const anio = Number(req.query.anio)

    if (!anio || isNaN(anio)) {
      return res.status(400).json({ error: 'Año inválido' })
    }

    // 🔥 2. Rango de fechas
    const inicio = `${anio}-01-01`
    const fin = `${anio}-12-31`

    // 🔥 3. Query segura (evita problemas de hora)
    const [rows] = await db.query(`
      SELECT DISTINCT DATE(fecha) as fecha
      FROM produccion_diaria
      WHERE fecha BETWEEN ? AND ?
    `, [inicio, fin])

    // 🔥 4. Set de días capturados (SIN timezone bug)
    const diasCapturados = new Set(
      rows
        .filter(r => r.fecha)
        .map(r => {
          const f = new Date(r.fecha)
          if (isNaN(f)) return null

          const year = f.getFullYear()
          const month = String(f.getMonth() + 1).padStart(2, '0')
          const day = String(f.getDate()).padStart(2, '0')

          return `${year}-${month}-${day}`
        })
        .filter(Boolean)
    )

    // 🔥 5. Construir calendario completo
    const resultado = {}

    for (let mes = 1; mes <= 12; mes++) {
      const mesStr = String(mes).padStart(2, '0')
      const totalDias = new Date(anio, mes, 0).getDate()

      resultado[mesStr] = []

      for (let d = 1; d <= totalDias; d++) {
        const dia = String(d).padStart(2, '0')
        const fecha = `${anio}-${mesStr}-${dia}`

        resultado[mesStr].push({
          dia: d,
          fecha,
          capturado: diasCapturados.has(fecha)
        })
      }
    }

    // ✅ 6. Respuesta limpia
    res.json(resultado)

  } catch (err) {
    console.error('❌ ERROR CALENDARIO:', err)
    res.status(500).json({ error: err.message })
  }
})

app.get('/produccion/validar', async (req, res) => {
  try {
    // 🔓 YA NO VALIDAMOS NADA
    // Siempre dejamos trabajar libremente

    return res.json({
      faltaAyer: false
    })

  } catch (error) {
    console.error('Error validar producción:', error)
    res.status(500).json({ error: 'Error en validación' })
  }
})

app.get('/produccion/reporte', async (req, res) => {
  try {
    const { fechaInicio, fechaFin, idProducto } = req.query

    if (!fechaInicio || !fechaFin) {
      return res.status(400).json({
        error: 'fechaInicio y fechaFin son obligatorias'
      })
    }

    let sql = `
      SELECT
        DATE_FORMAT(pd.fecha,'%Y-%m-%d') AS fecha,
        pd.id_producto,
        p.nombre,
        SUM(pd.cantidad) AS cantidad
      FROM produccion_diaria pd
      INNER JOIN productos p
        ON p.id_producto = pd.id_producto
      WHERE pd.fecha BETWEEN ? AND ?
    `

    const params = [fechaInicio, fechaFin]

   if (idProducto && idProducto !== 'todos') {

  const ids = idProducto.split(',')

  sql += `
    AND pd.id_producto IN (${ids.map(() => '?').join(',')})
  `

  params.push(...ids)
}

    sql += `
      GROUP BY pd.fecha, pd.id_producto, p.nombre
      ORDER BY p.nombre, pd.fecha
    `

    console.log('SQL:', sql)
    console.log('PARAMS:', params)
    
    const [rows] = await db.query(sql, params)

    res.json(rows)

  } catch (err) {
  console.error('ERROR REPORTE PRODUCCION:')
  console.error(err)

  res.status(500).json({
    error: err.message
  })
}
})


//OBTENER PRODUCCION DEL DIA 
app.get('/produccion/:fecha', async (req, res) => {
  try {
    const { fecha } = req.params

    const [rows] = await db.query(`
      SELECT 
        p.id_producto,
        p.nombre,
        COALESCE(pd.cantidad, 0) AS producido
      FROM productos p
      LEFT JOIN produccion_diaria pd
        ON pd.id_producto = p.id_producto
        AND pd.fecha = ?
      WHERE p.activo = 1
    `, [fecha])

    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})



app.post('/inventario-inicial', async (req, res) => {
  try {
    const { datos, periodo } = req.body

    if (!periodo) {
      return res.status(400).json({ error: 'Periodo requerido' })
    }

    if (!Array.isArray(datos)) {
      return res.status(400).json({ error: 'Datos inválidos' })
    }

    for (const item of datos) {
      if (!item.id_producto) continue

      await db.query(`
        INSERT INTO inventario_inicial (id_producto, periodo, cantidad)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE cantidad = VALUES(cantidad)
      `, [
        item.id_producto,
        periodo,
        item.cantidad || 0
      ])
    }

    res.json({ ok: true })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al guardar inventario' })
  }
})
app.get('/inventario-inicial/:periodo', async (req, res) => {
  try {
    const { periodo } = req.params

    const [rows] = await db.query(`
      SELECT 
        p.id_producto, 
        p.nombre, 
        IFNULL(i.cantidad, 0) as cantidad
      FROM productos p
      LEFT JOIN inventario_inicial i 
        ON p.id_producto = i.id_producto 
        AND i.periodo = ?
      WHERE p.activo = 1
      ORDER BY p.nombre
    `, [periodo])

    res.json(rows)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al obtener inventario' })
  }
})

app.get('/stock', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        p.id_producto,
        p.nombre,

        COALESCE(ii.inicial, 0) AS inicial,
        COALESCE(pd.producido, 0) AS producido,
        COALESCE(ed.salidas, 0) AS salidas,

      COALESCE(ii.inicial, 0) + 
      COALESCE(pd.producido, 0) - 
      COALESCE(ed.salidas, 0) AS stock

      FROM productos p

      LEFT JOIN (
        SELECT id_producto, SUM(cantidad) AS inicial
        FROM inventario_inicial
        GROUP BY id_producto
      ) ii ON ii.id_producto = p.id_producto

      LEFT JOIN (
        SELECT id_producto, SUM(cantidad) AS producido
        FROM produccion_diaria
        GROUP BY id_producto
      ) pd ON pd.id_producto = p.id_producto

      LEFT JOIN (
        SELECT id_producto, SUM(cantidad_entregada) AS salidas
        FROM entrega_detalle
        GROUP BY id_producto
      ) ed ON ed.id_producto = p.id_producto

      WHERE p.activo = 1
      ORDER BY p.nombre
    `)

    res.json(rows)
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
