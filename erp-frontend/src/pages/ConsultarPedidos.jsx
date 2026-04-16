import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API = 'https://erp-proyecto-production.up.railway.app'

const styles = { /* TODO IGUAL, no lo toqué */ }

function ConsultarPedidos() {
  const [pedidos, setPedidos] = useState([])
  const [rutas, setRutas] = useState([])
  const [rutasSeleccionadas, setRutasSeleccionadas] = useState([])
  const [mostrarDropdown, setMostrarDropdown] = useState(false)
  const [busqueda, setBusqueda] = useState('')
  const [estadoSeleccionado, setEstadoSeleccionado] = useState('')

  const [modalEntrega, setModalEntrega] = useState(false)
  const [modalCancelar, setModalCancelar] = useState(false)
  const [modalProgramar, setModalProgramar] = useState(false)

  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null)
  const [detalle, setDetalle] = useState([])
  const [choferes, setChoferes] = useState([])
  const [unidades, setUnidades] = useState([])

  const [comentarioCancelacion, setComentarioCancelacion] = useState('')
  const [fechaProgramada, setFechaProgramada] = useState('')

  const [modalPassword, setModalPassword] = useState(false)
  const [password, setPassword] = useState('')
  const [errorPassword, setErrorPassword] = useState('')

  const [form, setForm] = useState({
    id_chofer: '',
    id_unidad: '',
    comentario: '',
    otro_chofer: false,
    nombre_chofer: '',
    apellido_paterno: '',
    apellido_materno: '',
    productos: []
  })

  const navigate = useNavigate()
  const urlLimpia = API?.endsWith('/') ? API.slice(0, -1) : API

  useEffect(() => {
    cargarPedidos()
    cargarRutas()
  }, [])

  const cargarPedidos = async () => {
    const res = await fetch(`${urlLimpia}/pedidos`)
    const data = await res.json()
    setPedidos(data)
  }

  const cargarRutas = async () => {
    const res = await fetch(`${urlLimpia}/rutas`)
    const data = await res.json()
    setRutas(data)
  }

  const calcularDias = (fecha) => {
    if (!fecha) return 0
    return Math.floor((new Date() - new Date(fecha)) / (1000 * 60 * 60 * 24))
  }

  const pedidosFiltrados = pedidos.filter(p =>
    (p.id_pedido.toString().includes(busqueda) ||
     (p.cliente || '').toLowerCase().includes(busqueda.toLowerCase()))
    &&
    (estadoSeleccionado === '' || estadoSeleccionado === 'todos' || p.estado === estadoSeleccionado)
  )

  const pedidosPorRuta = pedidosFiltrados.reduce((acc, p) => {
    const ruta = p.id_ruta || 'SIN RUTA'
    if (!acc[ruta]) acc[ruta] = []
    acc[ruta].push(p)
    return acc
  }, {})

  const abrirEntrega = async (id) => {
    const res = await fetch(`${urlLimpia}/pedidos/${id}/detalle`)
    const data = await res.json()

    const ch = await fetch(`${urlLimpia}/choferes`)
    const un = await fetch(`${urlLimpia}/unidades`)

    setDetalle(data)
    setChoferes(await ch.json())
    setUnidades(await un.json())

    setForm({
      ...form,
      productos: data.map(p => ({
        id_producto: p.id_producto,
        nombre: p.nombre,
        cantidad_pedida: p.cantidad,
        cantidad_entregada: p.cantidad
      }))
    })

    setPedidoSeleccionado(id)
    setModalEntrega(true)
  }

  const abrirCancelar = (id) => {
    setPedidoSeleccionado(id)
    setModalCancelar(true)
  }

  const programarPedido = async () => {
    if (!fechaProgramada) return alert("Selecciona fecha")

    await fetch(`${urlLimpia}/pedidos/${pedidoSeleccionado}/programar`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fecha: fechaProgramada })
    })

    setModalProgramar(false)
    setFechaProgramada('')
    cargarPedidos()
  }

  return (
    <div style={styles.page}>
      <button style={styles.backButton} onClick={() => navigate('/')}>
        ⬅ Volver
      </button>

      <h2 style={styles.title}>Consultar pedidos</h2>

      <div style={styles.columnas}>
        {Object.entries(pedidosPorRuta).map(([ruta, lista]) => (
          <div key={ruta} style={styles.columna}>
            <h3>Ruta {ruta}</h3>

            {lista.map(p => {
              const dias = calcularDias(p.fecha)
              const alerta = dias > 7

              return (
                <div key={p.id_pedido} style={{
                  ...styles.tarjeta,
                  backgroundColor: alerta ? '#ffe5e5' : '#fff'
                }}>
                  <strong>ID:</strong> {p.id_pedido} <br />
                  <strong>Cliente:</strong> {p.cliente} <br />

                  <div style={{ marginTop: 8 }}>
                    {/* NO TOCADOS */}
                    <button
                      style={{ ...styles.button, ...styles.primary }}
                      disabled={p.estado !== 'pendiente'}
                      onClick={() => abrirEntrega(p.id_pedido)}
                    >
                      Preparar envío
                    </button>

                    <button
                      style={{ ...styles.button, ...styles.secondary }}
                      disabled={p.estado !== 'pendiente'}
                      onClick={() => abrirCancelar(p.id_pedido)}
                    >
                      Cancelar
                    </button>

                    {/* NUEVO */}
                    <button
                      style={{ ...styles.button, backgroundColor: '#f39c12', color: '#fff' }}
                      disabled={p.estado !== 'pendiente'}
                      onClick={() => {
                        setPedidoSeleccionado(p.id_pedido)
                        setModalProgramar(true)
                      }}
                    >
                      Programar envío
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        ))}
      </div>

      {/* MODAL PROGRAMAR (FUERA DEL MAP) */}
      {modalProgramar && (
        <div style={{
          position:'fixed', top:0,left:0,right:0,bottom:0,
          background:'rgba(0,0,0,0.5)',
          display:'flex', justifyContent:'center', alignItems:'center'
        }}>
          <div style={{ background:'#fff', padding:20, width:400 }}>
            <h3>Programar pedido</h3>

            <input
              type="date"
              value={fechaProgramada}
              onChange={e => setFechaProgramada(e.target.value)}
            />

            <button onClick={programarPedido}>Guardar</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ConsultarPedidos
