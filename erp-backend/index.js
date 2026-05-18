app.get('/stock', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        p.id_producto,
        p.nombre,

        -- INVENTARIO INICIAL
        COALESCE(ii.inicial, 0) AS inicial,

        -- ENTRADAS (SOLO MES ACTUAL)
        COALESCE(pd.producido, 0) AS producido,

        -- SALIDAS
        COALESCE(ed.salidas, 0) AS salidas,

        -- STOCK (NO SE TOCA)
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
        WHERE DATE_FORMAT(fecha, '%Y-%m') = DATE_FORMAT(CURDATE(), '%Y-%m')
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
