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
app.get('/clientes', async (_, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM clientes')
    res.json(rows)
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
      rfc
    } = req.body

    if (!nombre || !nombre_tienda || !rfc) {
      return res.status(400).json({ error: 'Campos obligatorios faltantes' })
    }

    // 👉 Nombre completo
    const nombreCompleto =
      `${nombre} ${apellido1 || ''} ${apellido2 || ''}`.trim()

    // 👉 Dirección
    const direccion =
      `${calle || ''} ${numero || ''}, ${municipio || ''}, ${estado || ''}, CP ${cp || ''}`

    // 👉 Teléfono
    const telefono = telefono_dueno || telefono_tienda || null

    const [result] = await db.query(
      `INSERT INTO clientes
      (nombre, nombre_tienda, direccion, telefono, email, rfc)
      VALUES (?, ?, ?, ?, ?, ?)`,
      [
        nombreCompleto,
        nombre_tienda,
        direccion,
        telefono,
        correo || null,
        rfc
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
