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
    if (err) {
      console.error("🔥 ERROR CLIENTES:", err)
      return res.status(500).json(err)
    }

    res.json(results)
  })
})
