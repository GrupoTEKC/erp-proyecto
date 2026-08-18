// Ejemplo en Node.js con MySQL / PostgreSQL
app.get('/pedidos/folios-control', async (req, res) => {
  try {
    // 1. Obtener la lista real de pedidos registrados
    const [registrados] = await db.query(`
      SELECT id_pedido AS folio, total, fecha, estado 
      FROM pedidos 
      WHERE id_pedido IS NOT NULL AND id_pedido > 0
      ORDER BY id_pedido ASC
    `);

    // 2. Obtener el mínimo y máximo REAL directo de la BD
    const [rangos] = await db.query(`
      SELECT 
        MIN(id_pedido) AS min_folio, 
        MAX(id_pedido) AS max_folio 
      FROM pedidos 
      WHERE id_pedido IS NOT NULL AND id_pedido > 0
    `);

    res.json({
      min_folio: rangos[0].min_folio || 0,
      max_folio: rangos[0].max_folio || 0,
      registrados
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
