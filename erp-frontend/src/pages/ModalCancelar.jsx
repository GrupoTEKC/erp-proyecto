import { useState } from 'react'

function ModalCancelar({ pedido, onClose, onConfirmar }) {
  const [comentario, setComentario] = useState('')

  // Si no hay pedido, no renderiza nada
  if (!pedido) return null

  const handleConfirmar = () => {
    if (comentario.trim() === '') {
      alert('El comentario es obligatorio')
      return
    }

    onConfirmar({ comentario })
    setComentario('') // limpiar textarea
  }

  return (
    <div style={overlay}>
      <div style={modal}>
        <h3>Cancelar pedido</h3>

        <p><strong>Folio:</strong> {pedido.folio}</p>
        <p><strong>Cliente:</strong> {pedido.cliente}</p>

        <label>
          Motivo de cancelación <span style={{ color: 'red' }}>*</span>
        </label>

        <textarea
          rows="4"
          value={comentario}
          onChange={e => setComentario(e.target.value)}
          style={{ width: '100%', marginTop: 8 }}
        />

        <div style={acciones}>
          <button onClick={onClose}>Cerrar</button>
          <button onClick={handleConfirmar}>
            Confirmar cancelación
          </button>
        </div>
      </div>
    </div>
  )
}

const overlay = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 9999
}

const modal = {
  background: '#fff',
  padding: 20,
  width: 400,
  borderRadius: 6,
  boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
}

const acciones = {
  marginTop: 15,
  display: 'flex',
  justifyContent: 'space-between'
}

export default ModalCancelar
