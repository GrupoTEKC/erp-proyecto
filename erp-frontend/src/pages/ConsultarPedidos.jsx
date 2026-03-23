import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API = 'https://erp-proyecto-production.up.railway.app'
const vino = '#8B1E1E'

function ConsultarPedidos() {
  const [pedidos, setPedidos] = useState([])
  const [busqueda, setBusqueda] = useState('')
  const [modalEntrega, setModalEntrega] = useState(false)
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null)
  const [detalle, setDetalle] = useState([])
  const [choferes, setChoferes] = useState([])
  const [unidades, setUnidades] = useState([])
  const [form, setForm] = useState({
    id_chofer: '',
    id_unidad: '',
    comentario: '',
    productos: []
  })

  const navigate = useNavigate()
  const urlLimpia = API?.endsWith('/') ? API.slice(0, -1) : API

  // =============================
  // CARGAR PEDIDOS
  // =============================
  const cargarPedidos = async () => {
    const res = await fetch(`${urlLimpia}/pedidos`)
    const data = await res.json()
    setPedidos(data)
  }

  useEffect(() => {
    cargarPedidos()
  }, [])

  // =============================
  // CALCULAR DIAS 🔥
  // =============================
  const calcularDias = (fecha) => {
    if (!fecha) return 0
    const inicio = new Date(fecha)
    const hoy = new Date()
    const diff = hoy - inicio
    return Math.floor(diff / (1000 * 60 * 60 * 24))
  }

  // =============================
  // ABRIR MODAL ENTREGA
  // =============================
  const abrirEntrega = async (id) => {
    const res = await fetch(`${urlLimpia}/pedidos/${id}/detalle`)
    const data = await res.json()

    const ch = await fetch(`${urlLimpia}/choferes`)
    const chData = await ch.json()

    const un = await fetch(`${urlLimpia}/unidades`)
    const unData = await un.json()

    setDetalle(data)
    setChoferes(chData)
    setUnidades(unData)

    setForm({
      id_chofer: '',
      id_unidad: '',
      comentario: '',
      productos: data.map(p => ({
        id_producto: p.id_producto,
        cantidad_pedida: p.cantidad,
        cantidad_entregada: p.cantidad
      }))
    })

    setPedidoSeleccionado(id)
    setModalEntrega(true)
  }

  // =============================
  // GUARDAR ENTREGA (USA TU ENDPOINT)
  // =============================
  const guardarEntrega = async () => {
    if (!form.id_chofer || !form.id_unidad) {
      return alert("Selecciona chofer y unidad")
    }

    const hayDiferencias = form.productos.some(
      p => p.cantidad_entregada !== p.cantidad_pedida
    )

    if (hayDiferencias && !form.comentario) {
      return alert("Debes agregar comentario por diferencias")
    }

    const res = await fetch(`${urlLimpia}/pedidos/${pedidoSeleccionado}/en-curso`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })

    if (!res.ok) {
      const err = await res.json()
      return alert(err.error)
    }

    setModalEntrega(false)
    cargarPedidos()
  }

  // =============================
  // CANCELAR
  // =============================
  const cancelarPedido = async (id) => {
    await fetch(`${urlLimpia}/pedidos/${id}/cancelar`, {
      method: 'PUT'
    })
    cargarPedidos()
  }

  // =============================
  // FILTRO
  // =============================
  const pedidosFiltrados = pedidos.filter(p =>
    p.id_pedido.toString().includes(busqueda) ||
    (p.cliente || '').toLowerCase().includes(busqueda.toLowerCase())
  )

  // =============================
  // UI
  // =============================
  return (
    <div style={{ padding: 20 }}>
      <button onClick={() => navigate('/')}>⬅ Volver</button>
      <h2>Consultar pedidos</h2>

      <input
        placeholder="Buscar..."
        value={busqueda}
        onChange={e => setBusqueda(e.target.value)}
      />

      <table border="1" width="100%">
        <thead style={{ background: vino, color: '#fff' }}>
          <tr>
            <th>ID</th>
            <th>Cliente</th>
            <th>Fecha</th> {/* 🔥 agregado */}
            <th>Días</th>  {/* 🔥 agregado */}
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {pedidosFiltrados.map(p => (
            <tr key={p.id_pedido}>
              <td>{p.id_pedido}</td>
              <td>{p.cliente}</td>

              {/* 🔥 FECHA */}
              <td>
                {p.fecha
                  ? new Date(p.fecha).toLocaleDateString()
                  : '-'}
              </td>

              {/* 🔥 DIAS */}
              <td>{calcularDias(p.fecha)}</td>

              <td>{p.estado}</td>

              <td>
                <button
                  disabled={p.estado !== 'pendiente'}
                  onClick={() => abrirEntrega(p.id_pedido)}
                >
                  Preparar envío
                </button>

                <button
                  disabled={p.estado !== 'pendiente'}
                  onClick={() => cancelarPedido(p.id_pedido)}
                >
                  Cancelar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* =============================
          MODAL ENTREGA
      ============================= */}
      {modalEntrega && (
        <div style={{
          position:'fixed',
          top:0,left:0,right:0,bottom:0,
          background:'rgba(0,0,0,0.5)',
          display:'flex',
          justifyContent:'center',
          alignItems:'center'
        }}>
          <div style={{ background:'#fff', padding:20, width:600 }}>
            <h3>Preparar entrega</h3>

            {form.productos.map((p, i) => (
              <div key={i}>
                <span>{p.cantidad_pedida}</span>
                <input
                  type="number"
                  value={p.cantidad_entregada}
                  onChange={e => {
                    const copia = [...form.productos]
                    copia[i].cantidad_entregada = Number(e.target.value)
                    setForm({ ...form, productos: copia })
                  }}
                />
              </div>
            ))}

            <select onChange={e => setForm({ ...form, id_chofer: e.target.value })}>
              <option value="">Chofer</option>
              {choferes.map(c => (
                <option key={c.id_chofer} value={c.id_chofer}>
                  {c.nombre}
                </option>
              ))}
            </select>

            <select onChange={e => setForm({ ...form, id_unidad: e.target.value })}>
              <option value="">Unidad</option>
              {unidades.map(u => (
                <option key={u.id_unidad} value={u.id_unidad}>
                  {u.nombre}
                </option>
              ))}
            </select>

            <textarea
              placeholder="Comentario (obligatorio si hay diferencias)"
              onChange={e => setForm({ ...form, comentario: e.target.value })}
            />

            <br /><br />

            <button onClick={guardarEntrega}>Guardar</button>
            <button onClick={() => setModalEntrega(false)}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ConsultarPedidos
