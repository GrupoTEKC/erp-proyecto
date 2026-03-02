import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ModalEntrega from './ModalEntrega'
import ModalCancelar from './ModalCancelar'

const API = import.meta.env.VITE_API_URL

/* ===== ESTILOS ===== */
const vino = '#8B1E1E'

const container = {
  padding: 20,
  background: '#ffffff',
  minHeight: '100vh',
  fontFamily: 'Arial'
}

const header = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 20,
  flexWrap: 'wrap',
  gap: 10
}

const btnVino = {
  background: '#fff',
  color: vino,
  border: `1px solid ${vino}`,
  padding: '8px 12px',
  borderRadius: 6,
  cursor: 'pointer',
  marginRight: 5
}

const buscador = {
  width: '100%',
  padding: 10,
  borderRadius: 6,
  border: `1px solid ${vino}`,
  marginBottom: 15
}

const tablaWrapper = {
  background: '#fff',
  borderRadius: 8,
  overflowX: 'auto',
  boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
}

const tabla = {
  width: '100%',
  borderCollapse: 'collapse',
  minWidth: 1500
}

const thead = {
  background: vino,
  color: '#fff'
}

const th = { padding: 12, textAlign: 'left' }
const td = { padding: 12, borderBottom: '1px solid #eee' }

const estadoPendiente = {
  background: '#ffdede',
  borderRadius: 6,
  padding: '6px 10px'
}

const estadoEntregado = {
  background: '#d4f8d4',
  borderRadius: 6,
  padding: '6px 10px'
}

const estadoCancelado = {
  background: '#eeeeee',
  borderRadius: 6,
  padding: '6px 10px'
}

function ConsultarPedidos() {
  const [pedidos, setPedidos] = useState([])
  const [detallePedido, setDetallePedido] = useState([])
  const [mostrarModal, setMostrarModal] = useState(false)
  const [mostrarCancelar, setMostrarCancelar] = useState(false)
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null)
  const [busqueda, setBusqueda] = useState('')
  const [filtroDias, setFiltroDias] = useState('')
  const navigate = useNavigate()

  /* =========================
     CARGAR PEDIDOS
  ========================= */
  const cargarPedidos = async () => {
    try {
      const res = await fetch(`${API}/pedidos`)
      const data = await res.json()
      setPedidos(Array.isArray(data) ? data : [])
    } catch {
      setPedidos([])
    }
  }

  useEffect(() => {
    cargarPedidos()
  }, [])

  /* =========================
     CALCULAR DÍAS
  ========================= */
  const calcularDias = pedido => {
    if (!pedido.fecha) return 0

    const inicio = new Date(pedido.fecha)

    const cierre =
      pedido.estado === 'entregado'
        ? pedido.fecha_entrega
        : pedido.estado === 'cancelado'
        ? pedido.fecha_cancelacion
        : null

    const fin = cierre ? new Date(cierre) : new Date()

    const diff = fin - inicio
    return Math.floor(diff / (1000 * 60 * 60 * 24))
  }

  /* =========================
     FILTRO
  ========================= */
  const pedidosFiltrados = pedidos.filter(p => {
    const dias = calcularDias(p)

    const cumpleFiltro =
      filtroDias === ''
        ? true
        : filtroDias === 'retrasados'
        ? dias > 7 && p.estado === 'pendiente'
        : filtroDias === 'pendientes'
        ? p.estado === 'pendiente'
        : filtroDias === 'entregados'
        ? p.estado === 'entregado'
        : true

    const texto = busqueda.toLowerCase()

    return (
      cumpleFiltro &&
      (
        p.id_pedido?.toString().includes(texto) ||
        p.cliente?.toLowerCase().includes(texto)
      )
    )
  })

  /* =========================
     ENTREGAR / CANCELAR (VERSIÓN SIMPLE)
  ========================= */

  const confirmarEntrega = async () => {
    if (!pedidoSeleccionado) return

    try {
      await fetch(`${API}/pedidos/${pedidoSeleccionado.id_pedido}/entregar`, {
        method: 'PUT'
      })

      await cargarPedidos()
      setMostrarModal(false)
      setPedidoSeleccionado(null)

    } catch (error) {
      console.error(error)
    }
  }

  const confirmarCancelacion = async () => {
    if (!pedidoSeleccionado) return

    try {
      await fetch(`${API}/pedidos/${pedidoSeleccionado.id_pedido}/cancelar`, {
        method: 'PUT'
      })

      await cargarPedidos()
      setMostrarCancelar(false)
      setPedidoSeleccionado(null)

    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div style={container}>
      <div style={header}>
        <button style={btnVino} onClick={() => navigate('/')}>
          ⬅ Volver
        </button>
        <h2>Consultar pedidos</h2>
      </div>

      <input
        style={buscador}
        placeholder="Buscar pedido o cliente..."
        value={busqueda}
        onChange={e => setBusqueda(e.target.value)}
      />

      <div style={tablaWrapper}>
        <table style={tabla}>
          <thead style={thead}>
            <tr>
              <th style={th}>Pedido</th>
              <th style={th}>Cliente</th>
              <th style={th}>Fecha pedido</th>
              <th style={th}>Fecha entrega</th>
              <th style={th}>Fecha cancelación</th>
              <th style={th}>Estado</th>
              <th style={th}>Días</th>
              <th style={th}>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {pedidosFiltrados.map(p => {
              const dias = calcularDias(p)

              const estiloEstado =
                p.estado === 'entregado'
                  ? estadoEntregado
                  : p.estado === 'pendiente'
                  ? estadoPendiente
                  : estadoCancelado

              return (
                <tr key={p.id_pedido}>
                  <td style={td}>{p.id_pedido}</td>
                  <td style={td}>{p.cliente}</td>

                  <td style={td}>
                    {p.fecha
                      ? new Date(p.fecha).toLocaleDateString()
                      : '-'}
                  </td>

                  <td style={td}>
                    {p.fecha_entrega
                      ? new Date(p.fecha_entrega).toLocaleDateString()
                      : '-'}
                  </td>

                  <td style={td}>
                    {p.fecha_cancelacion
                      ? new Date(p.fecha_cancelacion).toLocaleDateString()
                      : '-'}
                  </td>

                  <td style={td}>
                    <span style={estiloEstado}>{p.estado}</span>
                  </td>

                  <td style={td}>{dias}</td>

                  <td style={td}>
                    <button
                      style={btnVino}
                      disabled={p.estado !== 'pendiente'}
                      onClick={() => {
                        setPedidoSeleccionado(p)
                        setMostrarModal(true)
                      }}
                    >
                      Entregar
                    </button>

                    <button
                      style={btnVino}
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
              )
            })}
          </tbody>
        </table>
      </div>

      {mostrarModal && pedidoSeleccionado && (
        <ModalEntrega
          pedido={pedidoSeleccionado}
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
