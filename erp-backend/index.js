console.log('🚀 INDEX CORRECTO CARGADO')

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
  res.send('✅ Backend ERP funcionando')
})

// =========================
// CLIENTES
// =========================
// =========================
// OBTENER CLIENTE POR ID
// =========================
app.get('/clientes/:id', async (req, res) => {
  try {
    const { id } = req.params

    const [rows] = await db.query(
      `
      SELECT *
      FROM clientes
      WHERE id_cliente = ?
      `,
      [id]
    )

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Cliente no encontrado' })
    }

    res.json(rows[0])

  } catch (err) {
    console.error('🔥 ERROR CLIENTE:', err)
    res.status(500).json({ error: err.message })
  }
})


app.post('/clientes', async (req, res) => {
  try {
    console.log('📥 Cliente recibido:', req.body)

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
      rfc,
      id_ruta
    } = req.body

    if (!nombre || !nombre_tienda || !rfc) {
      return res.status(400).json({ error: 'Campos obligatorios faltantes' })
    }

    // 👉 Nombre completo (igual que antes)
    const nombreCompleto =
      `${nombre} ${apellido1 || ''} ${apellido2 || ''}`.trim()

    // 👉 Dirección (igual que antes)
    const direccion =
      `${calle || ''} ${numero || ''}, ${municipio || ''}, ${estado || ''}, CP ${cp || ''}`

    // 👉 Teléfono (igual que antes)
    const telefono = telefono_dueno || telefono_tienda || null

    // ✅ SOLO agregamos id_ruta al INSERT
    const [result] = await db.query(
      `INSERT INTO clientes
      (nombre, nombre_tienda, direccion, telefono, email, rfc, id_ruta)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        nombreCompleto,
        nombre_tienda,
        direccion,
        telefono,
        correo || null,
        rfc,
        id_ruta || null
      ]
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

app.put('/clientes/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { nombre, telefono, email, direccion } = req.body

    await db.query(
      `
      UPDATE clientes
      SET nombre = ?, telefono = ?, email = ?, direccion = ?
      WHERE id_cliente = ?
      `,
      [nombre, telefono, email, direccion, id]
    )

    res.json({ success: true })

  } catch (err) {
    console.error('🔥 ERROR ACTUALIZAR CLIENTE:', err)
    res.status(500).json({ error: err.message })
  }
})


app.put('/clientes/:id/ruta', async (req, res) => {
  try {
    const { id } = req.params
    const { id_ruta } = req.body

    await db.query(
      'UPDATE clientes SET id_ruta = ? WHERE id_cliente = ?',
      [id_ruta, id]
    )

    res.json({ success: true })
  } catch (err) {
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
// SERVIDOR
// =========================
app.listen(PORT, () => {
  console.log(`✅ Backend corriendo en puerto ${PORT}`)
})
