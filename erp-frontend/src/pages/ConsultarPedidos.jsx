import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ModalEntrega from './ModalEntrega'
import ModalCancelar from './ModalCancelar'

const API = import.meta.env.VITE_API_URL

function ConsultarPedidos() {
  const [pedidos, setPedidos] = useState([])
  const [detallePedido, setDetallePedido] = useState([])
  const [mostrarModal, setMostrarModal] = useState(false)
  const [mostrarCancelar, setMostrarCancelar] = useState(false)
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null)
  const [busqueda, setBusqueda] = useState('')
  const navigate = useNavigate()

  // =========================
  // CARGAR PEDIDOS
  // =========================
  const cargarPedidos = async () => {
    if (!API) {
      console.error('API no definida')
      return
    }

    try {
      const res = await fetch(`${API}/pedidos`)
      if (!res.ok) throw new Error('Error al obtener pedidos')

      const data = await res.json()
      setPedidos(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Error cargando pedidos:', err)
      setPedidos([])
    }
  }

  useEffect(() => {
    cargarPedidos()
  }, [])

  // =========================
  // FILTRO
  // =========================
  const pedidosFiltrados = pedidos.filter(p => {
    const id = p?.id_pedido?.toString() || ''
    const cliente = p?.cliente?.toLowerCase() || ''
    const texto = busqueda.toLowerCase()

    return id.includes(texto) || cliente.includes(texto)
  })

  // =========================
  // CARGAR DETALLE
  // =========================
  const cargarDetallePedido = async id => {
    try {
      const res = await fetch(`${API}/pedidos/${id}/detalle`)
      if (!res.ok) throw new Error()

      const data = await res.json()

      const detalle = Array.isArray(data)
        ? data.map(p => ({
            id_producto: p.id_producto,
            nombre: p.nombre,
            cantidad: Number(p.cantidad) || 0,
            precio: Number(p.precio) || 0
          }))
        : []

      setDetallePedido(detalle)
      return true
    } catch (err) {
      console.error('Error detalle:', err)
      alert('Error cargando detalle')
      return false
    }
  }

  // =========================
  // ENTREGAR
  // =========================
  const confirmarEntrega = async dataEntrega => {
    if (!pedidoSeleccionado) return

    try {
      const res = await fetch(
        `${API}/pedidos/${pedidoSeleccionado.id_pedido}/entregar`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dataEntrega)
        }
      )

      if (!res.ok) throw new Error()

      await cargarPedidos()
      setMostrarModal(false)
      setPedidoSeleccionado(null)
      setDetallePedido([])
    } catch {
      alert('Error al confirmar entrega')
    }
  }

  // =========================
  // CANCELAR
  // =========================
  const confirmarCancelacion = async ({ comentario }) => {
    if (!pedidoSeleccionado) return

    try {
      const res = await fetch(
        `${API}/pedidos/${pedidoSeleccionado.id_pedido}/cancelar`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ comentario })
        }
      )

      if (!res.ok) throw new Error()

      await cargarPedidos()
      setMostrarCancelar(false)
      setPedidoSeleccionado(null)
    } catch {
      alert('Error al cancelar pedido')
    }
  }

  // =========================
  // UI
  // =========================
  return (
    <div>
      <button onClick={() => navigate('/')}>⬅ Volver</button>

      <h2>Consultar pedidos</h2>

      <input
        type="text"
        placeholder="Buscar pedido o cliente..."
        value={busqueda}
        onChange={e => setBusqueda(e.target.value)}
        style={{ marginBottom: 10, width: '100%', padding: 6 }}
      />

      <table border="1" cellPadding="8" width="100%">
        <thead>
          <tr>
            <th>Pedido</th>
            <th>Cliente</th>
            <th>Fecha pedido</th>
            <th>Fecha entrega</th>
            <th>Fecha cancelación</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {pedidosFiltrados.map(p => (
            <tr key={p.id_pedido}>
              <td>{p.id_pedido}</td>

              <td>{p.cliente}</td>

              <td>
                {p.fecha
                  ? new Date(p.fecha).toLocaleDateString()
                  : '-'}
              </td>

              <td>
                {p.fecha_entrega
                  ? new Date(p.fecha_entrega).toLocaleDateString()
                  : '-'}
              </td>

              <td>
                {p.fecha_cancelacion
                  ? new Date(p.fecha_cancelacion).toLocaleDateString()
                  : '-'}
              </td>

              <td>{p.estado}</td>

              <td>
                <button
                  disabled={p.estado !== 'pendiente'}
                  onClick={async () => {
                    setPedidoSeleccionado(p)
                    const ok = await cargarDetallePedido(p.id_pedido)
                    if (ok) setMostrarModal(true)
                  }}
                >
                  Entregar
                </button>

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
          onClose={() => setMostrarCancelar(false)}
          onConfirmar={confirmarCancelacion}
        />
      )}
    </div>
  )
}

export default ConsultarPedidos
