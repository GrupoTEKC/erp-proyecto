import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

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
  minWidth: 1200
}

const thead = {
  background: vino,
  color: '#fff'
}

const th = {
  padding: 12,
  textAlign: 'left'
}

const td = {
  padding: 12,
  borderBottom: '1px solid #eee'
}

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
  const [busqueda, setBusqueda] = useState('')

  const navigate = useNavigate()

  const urlLimpia = API?.endsWith('/') ? API.slice(0, -1) : API

  /* ============================= */
  /* CARGAR PEDIDOS */
  /* ============================= */

  const cargarPedidos = async () => {
    try {

      const res = await fetch(`${urlLimpia}/pedidos`)

      if (!res.ok) {
        throw new Error('Error obteniendo pedidos')
      }

      const data = await res.json()

      setPedidos(Array.isArray(data) ? data : [])

    } catch (error) {

      console.error("Error cargando pedidos:", error)

      setPedidos([])

    }
  }

  useEffect(() => {
    cargarPedidos()
  }, [])

  /* ============================= */
  /* CALCULAR DIAS */
  /* ============================= */

  const calcularDias = (pedido) => {

    if (!pedido.fecha) return 0

    const estado = (pedido.estado_pedido || '')
      .trim()
      .toLowerCase()

    const inicio = new Date(pedido.fecha)

    const cierre =
      estado === 'entregado'
        ? pedido.fecha_entrega
        : estado === 'cancelado'
        ? pedido.fecha_cancelacion
        : null

    const fin = cierre ? new Date(cierre) : new Date()

    const diff = fin - inicio

    return Math.floor(diff / (1000 * 60 * 60 * 24))
  }

  /* ============================= */
  /* ENTREGAR */
  /* ============================= */

  const confirmarEntrega = async (id) => {

    if (!window.confirm(`¿Marcar pedido #${id} como ENTREGADO?`)) return

    try {

      const res = await fetch(`${urlLimpia}/pedidos/${id}/entregar`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
      })

      if (!res.ok) {
        throw new Error("Error actualizando pedido")
      }

      await cargarPedidos()

    } catch (error) {

      console.error(error)

      alert("Error al actualizar")

    }
  }

  /* ============================= */
  /* CANCELAR */
  /* ============================= */

  const confirmarCancelacion = async (id) => {

    if (!window.confirm(`¿Seguro que deseas CANCELAR el pedido #${id}?`)) return

    try {

      const res = await fetch(`${urlLimpia}/pedidos/${id}/cancelar`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
      })

      if (!res.ok) {
        throw new Error("Error cancelando pedido")
      }

      await cargarPedidos()

    } catch (error) {

      console.error(error)

      alert("Error al cancelar")

    }
  }

  /* ============================= */
  /* FILTRO BUSQUEDA */
  /* ============================= */

  const pedidosFiltrados = pedidos.filter(p => {

    const texto = busqueda.toLowerCase()

    return (
      p.id_pedido?.toString().includes(texto) ||
      (p.cliente || '').toLowerCase().includes(texto)
    )

  })

  /* ============================= */
  /* RENDER */
  /* ============================= */

  return (

    <div style={container}>

      <div style={header}>

        <button
          style={btnVino}
          onClick={() => navigate('/')}
        >
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

              const est = (p.estado_pedido || 'pendiente')
                .trim()
                .toLowerCase()

              const estilo =
                est === 'entregado'
                  ? estadoEntregado
                  : est === 'pendiente'
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
                    <span style={estilo}>{est}</span>
                  </td>

                  <td style={td}>{dias}</td>

                  <td style={td}>

                    <button
                      style={{
                        ...btnVino,
                        opacity: est !== 'pendiente' ? 0.5 : 1
                      }}
                      disabled={est !== 'pendiente'}
                      onClick={() => confirmarEntrega(p.id_pedido)}
                    >
                      Entregar
                    </button>

                    <button
                      style={{
                        ...btnVino,
                        opacity: est !== 'pendiente' ? 0.5 : 1
                      }}
                      disabled={est !== 'pendiente'}
                      onClick={() => confirmarCancelacion(p.id_pedido)}
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

    </div>

  )
}

export default ConsultarPedidos
