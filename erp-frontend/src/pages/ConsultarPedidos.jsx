import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ModalEntrega from './ModalEntrega'
import ModalCancelar from './ModalCancelar'

// 👉 Cambia aquí si quieres local o producción
const API = 'https://erp-proyecto-production.up.railway.app'
// const API = 'http://localhost:3001'

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
 const detalleAdaptado = (Array.isArray(data) ? data : []).map(p => ({
  id_producto: p.id_producto,
  nombre: p.nombre,
  cantidad_pedida: Number(p.cantidad),
  cantidad_entregada: Number(p.cantidad),
  precio: Number(p.precio)
}))


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
    if (!res.ok) throw new Error('Detalle no disponible')

    const data = await res.json()

    // 👉 Adaptar datos al formato del modal
   const detalleAdaptado = (Array.isArray(data) ? data : []).map(p => ({
  id_producto: p.id_producto,
  nombre: p.nombre,
  cantidad_pedida: Number(p.cantidad),
  cantidad_entregada: Number(p.cantidad),
  precio: Number(p.precio)
}))

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

    } catch (err) {
      console.error(err)
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

    } catch (err) {
      console.error(err)
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
        placeholder="Buscar pedido o cliente..."
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
