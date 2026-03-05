const express = require('express')
const cors = require('cors')
const db = require('./db')

const app = express()
const PORT = process.env.PORT || 8080

app.use(cors())
app.use(express.json())

// GET - Listar todos los clientes
app.get('/clientes', async (_, res) => {
  try {
    const [rows] = await db.query(`
      SELECT c.*, r.nombre AS ruta 
      FROM clientes c
      LEFT JOIN rutas r ON c.id_ruta = r.id_ruta
      ORDER BY c.nombre ASC
    `)
    res.json(rows)
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// =====================================================
// NUEVA RUTA: GET - Obtener un solo cliente por ID 
// (ESTO ES LO QUE ARREGLA EL ERROR 404)
// =====================================================
app.get('/clientes/:id', async (req, res) => {
  try {
    const { id } = req.params
    const [rows] = await db.query('SELECT * FROM clientes WHERE id_cliente = ?', [id])
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Cliente no encontrado' })
    }
    res.json(rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PUT - Actualizar cliente
app.put('/clientes/:id', async (req, res) => {
  try {
    const { id } = req.params
    const v = req.body
    await db.query(`
      UPDATE clientes SET
        nombre=?, apellido1=?, apellido2=?, nombre_tienda=?, apodo=?,
        rfc=?, email=?, telefono_dueno=?, telefono_tienda=?,
        categoria=?, categoria_otro=?, calle=?, numero=?, cp=?,
        municipio=?, estado=?, entre_calles=?, referencia=?, id_ruta=?
      WHERE id_cliente=?
    `, [
      v.nombre, v.apellido1, v.apellido2, v.nombre_tienda, v.apodo,
      v.rfc, v.email, v.telefono_dueno, v.telefono_tienda,
      v.categoria, v.categoria_otro, v.calle, v.numero, v.cp,
      v.municipio, v.estado, v.entre_calles, v.referencia, v.id_ruta,
      id
    ])
    res.json({ success: true })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// Rutas de catálogos (Asegúrate de que existan para evitar errores en consola)
app.get('/rutas', async (_, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM rutas')
    res.json(rows)
  } catch (err) { res.status(500).json({ error: err.message }) }
})

app.get('/vendedores', async (_, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM vendedores')
    res.json(rows)
  } catch (err) { res.status(500).json({ error: err.message }) }
})

app.listen(PORT, '0.0.0.0', () => console.log(`🚀 Server en puerto ${PORT}`))
