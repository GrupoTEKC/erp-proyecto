import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ModalEntrega from './ModalEntrega'
import ModalCancelar from './ModalCancelar'

function ConsultarPedidos() {
  const [pedidos, setPedidos] = useState([])
  const [detallePedido, setDetallePedido] = useState([])
  const [mostrarModal, setMostrarModal] = useState(false)
  const [mostrarCancelar, setMostrarCancelar] = useState(false)
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null)
  const [busqueda, setBusqueda] = useState('')

  const navigate = useNavigate()

  // =========================
  // OBTENER PEDIDOS
  // =========================
  useEffect(() => {
    fetch('http://localhost:3001/pedidos')
      .then(res => res.json())
      .then(data => {
        setPedidos(Array.isArray(data) ? data : [])
      })
      .catch(err => {
        console.error('Error al cargar pedidos', err)
        setPedidos([])
      })
  }, [])

  // =========================
  // FILTRO
  // =========================
  const pedidosFiltrados = pedidos.filter(p =>
    p.id_pedido.toString().includes(busqueda) ||
    p.cliente.toLowerCase().includes(busqueda.toLowerCase())
  )

  const cargarDetallePedido = async id_pedido => {
    const res = await fetch(`http://localhost:3001/pedidos/${id_pedido}/detalle`)
    const data = await res.json()
    setDetallePedido(Array.isArray(data) ? data : [])
  }

  const confirmarEntrega = async dataEntrega => {
    const res = await fetch(
      `http://localhost:3001/pedidos/${pedidoSeleccionado.id_pedido}/entregar`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataEntrega)
      }
    )

    if (!res.ok) {
      alert('Error al confirmar entrega')
      return
    }

    const nuevos = await fetch('http://localhost:3001/pedidos')
    setPedidos(await nuevos.json())

    setMostrarModal(false)
    setPedidoSeleccionado(null)
    setDetallePedido([])
  }

  const confirmarCancelacion = async ({ comentario }) => {
    const res = await fetch(
      `http://localhost:3001/pedidos/${pedidoSeleccionado.id_pedido}/cancelar`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comentario })
      }
    )

    if (!res.ok) {
      alert('Error al cancelar')
      return
    }

    const nuevos = await fetch('http://localhost:3001/pedidos')
    setPedidos(await nuevos.json())

    setMostrarCancelar(false)
    setPedidoSeleccionado(null)
  }

  return (
    <div>
      <button onClick={() => navigate('/')}>⬅ Volver</button>

      <h2>Consultar pedidos</h2>

      <input
        type="text"
        placeholder="Buscar por número de pedido o cliente..."
        value={busqueda}
        onChange={e => setBusqueda(e.target.value)}
        style={{ marginBottom: '10px', width: '100%', padding: '6px' }}
      />

      <table border="1" cellPadding="8" width="100%">
        <thead>
          <tr>
            <th>Pedido #</th>
            <th>Cliente</th>
            <th>Fecha pedido</th>
            <th>Fecha entrega / cancelación</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {pedidosFiltrados.map(p => (
            <tr key={p.id_pedido}>
              <td>{p.id_pedido}</td>
              <td>{p.cliente}</td>

              {/* Fecha de creación */}
              <td>{new Date(p.fecha).toLocaleDateString()}</td>

              {/* Fecha según estado */}
              <td>
                {p.estado === 'entregado' && p.fecha_entrega
                  ? new Date(p.fecha_entrega).toLocaleDateString()
                  : p.estado === 'cancelado' && p.fecha_cancelacion
                  ? new Date(p.fecha_cancelacion).toLocaleDateString()
                  : '-'}
              </td>

              <td>{p.estado}</td>

              <td>
                <button
                  disabled={p.estado !== 'pendiente'}
                  onClick={async () => {
                    setPedidoSeleccionado(p)
                    await cargarDetallePedido(p.id_pedido)
                    setMostrarModal(true)
                  }}
                >
                  Entregar
                </button>

                {' '}

                <button
                  disabled={p.estado !== 'pendiente'}
                  onClick={() => {
                    setPedidoSeleccionado(p)
                    setMostrarCancelar(true)
                  }}
                >
                  Cancelar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {mostrarModal && pedidoSeleccionado && (
        <ModalEntrega
          pedido={pedidoSeleccionado}
          productos={detallePedido}
          onClose={() => setMostrarModal(false)}
          onConfirmar={confirmarEntrega}
        />
      )}

      {mostrarCancelar && pedidoSeleccionado && (
        <ModalCancelar
          pedido={pedidoSeleccionado}
          onClose={() => {
            setMostrarCancelar(false)
            setPedidoSeleccionado(null)
          }}
          onConfirmar={confirmarCancelacion}
        />
      )}
    </div>
  )
}

export default ConsultarPedidos
