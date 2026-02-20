import { useEffect, useState } from 'react'

function ModalEntrega({ pedido, productos = [], onClose, onConfirmar }) {
  const [entregas, setEntregas] = useState([])
  const [comentario, setComentario] = useState('')

  // =========================
  // CARGAR PRODUCTOS
  // =========================
  useEffect(() => {
    if (!Array.isArray(productos)) return

    const data = productos.map(p => {
      const cantidad = Number(p.cantidad) || 0

      return {
        id_producto: p.id_producto,
        nombre: p.nombre || "Sin nombre",
        cantidad_pedida: cantidad,
        cantidad_entregada: cantidad
      }
    })

    setEntregas(data)
  }, [productos])

  // =========================
  // VALIDAR DIFERENCIAS
  // =========================
  const hayDiferencias = entregas.some(
    p => p.cantidad_entregada !== p.cantidad_pedida
  )

  // =========================
  // CAMBIAR CANTIDAD
  // =========================
  const cambiarCantidad = (index, valor) => {
    let nueva = Number(valor)

    if (isNaN(nueva) || nueva < 0) nueva = 0
    if (nueva > entregas[index].cantidad_pedida)
      nueva = entregas[index].cantidad_pedida

    const copia = [...entregas]
    copia[index].cantidad_entregada = nueva

    setEntregas(copia)
  }
<hr />

<label>Chofer *</label>
<select
  value={chofer}
  onChange={e => setChofer(e.target.value)}
  style={{ width: '100%', marginBottom: 10 }}
>
  <option value="">Seleccionar chofer</option>
  {choferes.map(c => (
    <option key={c.id_chofer} value={c.id_chofer}>
      {c.nombre} {c.apellido1}
    </option>
  ))}
</select>

<label>Unidad *</label>
<input
  type="text"
  value={unidad}
  onChange={e => setUnidad(e.target.value)}
  placeholder="Ej. Camión 3"
  style={{ width: '100%', marginBottom: 10 }}
/>
  
  // =========================
  // CONFIRMAR ENTREGA
  // =========================
  const confirmar = () => {
    if (hayDiferencias && comentario.trim() === '') {
      alert(
        'En caso de no entregar lo solicitado por el cliente, se deberá registrar el motivo específico que originó la situación.'
      )
      return
    }

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

  // =========================
  // UI
  // =========================
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
                    onChange={e =>
                      cambiarCantidad(i, e.target.value)
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {hayDiferencias && (
          <p style={{ color: 'red', marginTop: 10 }}>
            ⚠ Si la entrega no coincide, debes registrar el motivo.
          </p>
        )}

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

        <div style={acciones}>
          <button onClick={onClose}>Cancelar</button>

          <button onClick={confirmar}>
            Confirmar entrega
          </button>
        </div>
      </div>
    </div>
  )
}

// =========================
// ESTILOS
// =========================

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
  width: '540px',
  borderRadius: '6px'
}

const acciones = {
  marginTop: 15,
  display: 'flex',
  justifyContent: 'space-between'
}

export default ModalEntrega
