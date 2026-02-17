import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ModalEntrega from './ModalEntrega'
import ModalCancelar from './ModalCancelar'

const API = 'https://erp-proyecto-production.up.railway.app'

function ConsultarPedidos() {
  const [pedidos, setPedidos] = useState([])
  const [detallePedido, setDetallePedido] = useState([])
  const [mostrarModal, setMostrarModal] = useState(false)
  const [mostrarCancelar, setMostrarCancelar] = useState(false)
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null)
  const [busqueda, setBusqueda] = useState('')

  const navigate = useNavigate()

  // =========================
  // 🔄 CARGAR PEDIDOS
  // =========================
  const cargarPedidos = async () => {
    try {
      const res = await fetch(`${API}/pedidos`)
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
  // 🔍 FILTRO
  // =========================
  const pedidosFiltrados = pedidos.filter(p =>
    p?.id_pedido?.toString().includes(busqueda) ||
    p?.cliente?.toLowerCase().includes(busqueda.toLowerCase())
  )

  // =========================
  // 📦 CARGAR DETALLE
  // =========================
  const cargarDetallePedido = async id => {
    try {
      const res = await fetch(`${API}/pedidos/${id}/detalle`)
      const data = await res.json()

      setDetallePedido(Array.isArray(data) ? data : [])
      return true
    } catch (err) {
      console.error('Error detalle:', err)
      alert('Error cargando detalle del pedido')
      return false
    }
  }

  // =========================
  // 🚚 ENTREGAR
  // =========================
  const confirmarEntrega = async dataEntrega => {
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
  // ❌ CANCELAR
  // =========================
  const confirmarCancelacion = async ({ comentario }) => {
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
  // 🧩 UI
  // =========================
  return (
    <div>
      <button onClick={() => navigate('/')}>⬅ Volver</button>

      <h2>Consultar pedidos</h2>

      <input
        type="text"
        placeholder="Buscar..."
        value={busqueda}
        onChange={e => setBusqueda(e.target.value)}
        style={{ marginBottom: 10, width: '100%', padding: 6 }}
      />

      <table border="1" cellPadding="8" width="100%">
        <thead>
          <tr>
            <th>Pedido #</th>
            <th>Cliente</th>
            <th>Fecha pedido</th>
            <th>Entrega / Cancelación</th>
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

                    const ok = await cargarDetallePedido(p.id_pedido)

                    if (ok) setMostrarModal(true)
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

      {/* MODAL ENTREGA */}
      {mostrarModal && pedidoSeleccionado && (
        <ModalEntrega
          pedido={pedidoSeleccionado}
          productos={detallePedido}
          onClose={() => setMostrarModal(false)}
          onConfirmar={confirmarEntrega}
        />
      )}

      {/* MODAL CANCELAR */}
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
