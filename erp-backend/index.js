app.post('/pedidos', async (req, res) => {
  try {
    console.log('📦 Datos recibidos:', req.body)

    const { id_cliente, fecha, estado } = req.body

    if (!id_cliente || !fecha || !estado) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Faltan datos',
        recibido: req.body
      })
    }

    const [result] = await db.query(
      `INSERT INTO pedidos (id_cliente, fecha, estado)
       VALUES (?, ?, ?)`,
      [id_cliente, fecha, estado]
    )

    res.json({
      ok: true,
      pedido_creado: result.insertId
    })

  } catch (err) {
    console.error('🔥 ERROR PEDIDO:', err.message)

    res.status(500).json({
      ok: false,
      error: err.message
    })
  }
})
