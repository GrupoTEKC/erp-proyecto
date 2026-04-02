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
      SELECT 
        p.*,
        e.folio,
        e.fecha_entrega
      FROM pedidos p
      INNER JOIN entregas e 
        ON p.id_pedido = e.id_pedido
      WHERE p.id_cliente = ?
      AND p.estado = 'entregado'
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

    // 🔥 NUEVO: determinar chofer final
    let idChoferFinal = id_chofer

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
    `, [id, idChoferFinal, id_unidad, comentario || null])

    const id_entrega = entregaResult.insertId

    for (const item of productos) {

      // ❌ ELIMINADO: comentario obligatorio (ya no aplica)

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
        pd.*,
        p.nombre
      FROM pedido_detalle pd
      LEFT JOIN productos p 
      ON pd.id_producto = p.id_producto
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

    // 🔥 PROCESO DE PRODUCTOS
    for (const item of productos) {
      console.log('🔄 PRODUCTO', item.id_producto)

      if (item.tipo === 'agregado') {

        // 🔥 VALIDACIÓN EXTRA (no rompe nada)
        if (!item.cantidad_entregada || item.cantidad_entregada <= 0) {
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
            SET cantidad_entregada = cantidad_entregada + ?
            WHERE id_entrega = ? 
            AND id_producto = ? 
            AND tipo = 'agregado'
          `, [
            item.cantidad_entregada || 0,
            id_entrega,
            item.id_producto
          ])
        } else {
          // 🆕 NUEVO
          await conn.query(`
            INSERT INTO entrega_detalle (
              id_entrega,
              id_producto,
              cantidad_pedida,
              cantidad_entregada,
              tipo,
              motivo
            )
            VALUES (?, ?, 0, ?, 'agregado', ?)
          `, [
            id_entrega,
            item.id_producto,
            item.cantidad_entregada || 0,
            item.motivo || null
          ])
        }

      } else {

        console.log('✏️ UPDATE NORMAL')

        await conn.query(`
          UPDATE entrega_detalle
          SET 
            cantidad_entregada = ?,
            tipo = ?,
            motivo = ?,
            id_cliente_destino = ?
          WHERE id_entrega = ? AND id_producto = ?
        `, [
          item.cantidad_entregada || 0,
          item.tipo || 'ninguno',
          item.tipo === 'roto' ? (item.motivo || null) : null,
          item.tipo === 'prestamo' ? (item.id_cliente_destino || null) : null,
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
      nombre_usuario
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

    // =============================
    // 🔥 VALIDAR CUENTA
    // =============================
    if (metodo === 'transferencia') {
      const cuentasValidas = ['fiscal', 'yair', 'rosario']

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
      VALUES (?, CURRENT_DATE(), ?, ?, ?, ?, ?, ?)
    `, [
      id_pedido,
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
        monto,
        metodo,
        cuenta_destino,
        tipo_usuario,
        nombre_usuario
      FROM pagos
      WHERE id_pedido = ?
      ORDER BY fecha_pago DESC
    `, [id_pedido])

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
