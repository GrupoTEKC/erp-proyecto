import { useEffect, useState } from 'react'

function ModalEntrega({ pedido, productos = [], onClose, onConfirmar }) {
  const [entregas, setEntregas] = useState([])
  const [comentario, setComentario] = useState('')

  // =========================
  // CARGAR PRODUCTOS
  // =========================
useEffect(() => {
  if (productos.length > 0) {
    setEntregas(
      productos.map(p => ({
        id_producto: p.id_producto,
        nombre: p.nombre,
        cantidad_pedida: Number(p.cantidad), // ← AQUÍ EL FIX
        cantidad_entregada: Number(p.cantidad)
      }))
    )
  }
}, [productos])
  // =========================
  // VALIDAR DIFERENCIAS
  // =========================
  const hayDiferencias = entregas.some(
    p => Number(p.cantidad_entregada) !== Number(p.cantidad_pedida)
  )

  // =========================
  // CONFIRMAR ENTREGA
  // =========================
  const confirmar = () => {
    if (hayDiferencias && comentario.trim() === '') {
      alert('Debes indicar un comentario por la diferencia')
      return
    }

    // Convertir al formato que espera el backend
    const productosParaBackend = entregas.map(p => ({
  id_producto: p.id_producto,
  cantidad_pedida: p.cantidad_pedida,
  cantidad_entregada: p.cantidad_entregada
}))
    onConfirmar({
      productos: productosParaBackend,
      comentario
    })
  }

  if (!pedido) return null

  return (
    <div style={overlay}>
      <div style={modal}>
        <h3>Confirmar entrega</h3>

        <p><strong>Folio:</strong> {pedido.folio}</p>
        <p><strong>Cliente:</strong> {pedido.cliente}</p>

        <table border="1" width="100%" cellPadding="6">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Pedida</th>
              <th>Entregar</th>
            </tr>
          </thead>
          <tbody>
            {entregas.map((p, i) => (
              <tr key={p.id_producto}>
                <td>{p.nombre}</td>
                <td>{p.cantidad_pedida}</td>
                <td>
                  <input
                    type="number"
                    min="0"
                    max={p.cantidad_pedida}
                    value={p.cantidad_entregada}
                    onChange={e => {
                      const copia = [...entregas]
                      copia[i].cantidad_entregada = Number(e.target.value)
                      setEntregas(copia)
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <label>
          Comentario
          {hayDiferencias && <strong style={{ color: 'red' }}> *</strong>}
        </label>

        <textarea
          value={comentario}
          onChange={e => setComentario(e.target.value)}
          rows="3"
          style={{ width: '100%' }}
        />

        <div style={{ marginTop: 15, display: 'flex', justifyContent: 'space-between' }}>
          <button onClick={onClose}>Cerrar</button>
          <button onClick={confirmar}>Confirmar entrega</button>
        </div>
      </div>
    </div>
  )
}

const overlay = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,0.4)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000
}

const modal = {
  background: '#fff',
  padding: '20px',
  width: '520px',
  borderRadius: '4px'
}

export default ModalEntrega
