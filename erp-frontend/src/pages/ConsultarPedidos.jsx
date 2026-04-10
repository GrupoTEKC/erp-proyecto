import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API = 'https://erp-proyecto-production.up.railway.app'

const styles = {
  page: { backgroundColor: '#ffffff', minHeight: '100vh', padding: '20px', fontFamily: 'Arial, sans-serif' },
  header: { marginBottom: '20px' },
  backButton: { display: 'inline-flex', alignItems: 'center', padding: '10px 14px', fontSize: '14px', backgroundColor: '#fff', color: '#8B1E1E', border: '1px solid #8B1E1E', borderRadius: '6px', cursor: 'pointer' },
  title: { marginTop: '20px', marginBottom: '15px', color: '#071849', fontWeight: 'bold' },
  field: { width: '260px', padding: '8px 10px', fontSize: '14px', borderRadius: '6px', border: '1px solid #8B1E1E', boxSizing: 'border-box', marginBottom: 15 },
  columnas: { display: 'flex', gap: '15px', overflowX: 'auto' },
  columna: { minWidth: '320px', background: '#f4f6f8', borderRadius: '10px', padding: '10px' },
  tarjeta: { border: '1px solid #ddd', borderRadius: '8px', padding: '10px', marginBottom: '10px', backgroundColor: '#fff' },
  button: { padding: '6px 10px', margin: '2px', borderRadius: '6px', border: 'none', cursor: 'pointer' },
  primary: { backgroundColor: '#8B1E1E', color: '#fff' },
  secondary: { backgroundColor: '#fff', border: '1px solid #8B1E1E', color: '#8B1E1E' },
  estado: (estado) => ({
    color: '#fff',
    padding: '4px 8px',
    borderRadius: '6px',
    fontSize: '12px',
    backgroundColor:
      estado === 'pendiente' ? '#c0392b' :
      estado === 'en_ruta' ? '#27ae60' :
      estado === 'cancelado' ? '#7f8c8d' :
      '#34495e'
  }),
  topBar: { display: 'flex', gap: '10px', alignItems: 'center' },
  dropdown: { position: 'relative', width: '260px' },
  dropdownButton: {
    width: '100%',
    padding: '8px 10px',
    fontSize: '14px',
    borderRadius: '6px',
    border: '1px solid #8B1E1E',
    background: '#fff',
    cursor: 'pointer',
    textAlign: 'left'
  },
  dropdownContent: {
    position: 'absolute',
    top: '100%',
    left: 0,
    width: '100%',
    background: '#fff',
    border: '1px solid #ddd',
    borderRadius: '6px',
    padding: '10px',
    zIndex: 10,
    maxHeight: '200px',
    overflowY: 'auto'
  },
  empty: {
    width: '100%',
    textAlign: 'center',
    padding: '40px',
    color: '#777',
    fontSize: '16px'
  }
}

function ConsultarPedidos() {
  const [pedidos, setPedidos] = useState([])
  const [rutas, setRutas] = useState([])
  const [rutasSeleccionadas, setRutasSeleccionadas] = useState([])
  const [mostrarDropdown, setMostrarDropdown] = useState(false)
  const [busqueda, setBusqueda] = useState('')
  const [estadoSeleccionado, setEstadoSeleccionado] = useState('')

  const [modalEntrega, setModalEntrega] = useState(false)
  const [modalCancelar, setModalCancelar] = useState(false)
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null)
  const [detalle, setDetalle] = useState([])
  const [choferes, setChoferes] = useState([])
  const [unidades, setUnidades] = useState([])
  const [comentarioCancelacion, setComentarioCancelacion] = useState('')

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
    const inicio = new Date(fecha)
    const hoy = new Date()
    return Math.floor((hoy - inicio) / (1000 * 60 * 60 * 24))
  }

  const obtenerNombreRuta = (id) => {
    const ruta = rutas.find(r => r.id_ruta === Number(id))
    return ruta ? ruta.nombre : ''
  }

  const toggleRuta = (id) => {
    if (rutasSeleccionadas.includes(id)) {
      setRutasSeleccionadas(rutasSeleccionadas.filter(r => r !== id))
    } else {
      setRutasSeleccionadas([...rutasSeleccionadas, id])
    }
  }

  // 🔥 FILTRO COMPLETO
  const pedidosFiltrados = pedidos.filter(p =>
    (
      p.id_pedido.toString().includes(busqueda) ||
      (p.cliente || '').toLowerCase().includes(busqueda.toLowerCase())
    )
    &&
    (
      estadoSeleccionado === '' ||
      estadoSeleccionado === 'todos' ||
      p.estado === estadoSeleccionado
    )
  )

  const pedidosPorRuta = pedidosFiltrados.reduce((acc, pedido) => {
    const ruta = pedido.id_ruta || 'SIN RUTA'
    if (!acc[ruta]) acc[ruta] = []
    acc[ruta].push(pedido)
    return acc
  }, {})

  // 🔥 FUNCIONES BOTONES (RESTAURADAS)
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
      otro_chofer: false,
      nombre_chofer: '',
      apellido_paterno: '',
      apellido_materno: '',
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
    setComentarioCancelacion('')
    setModalCancelar(true)
  }

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <button style={styles.backButton} onClick={() => navigate('/')}>
          ⬅ Volver
        </button>
      </div>

      <h2 style={styles.title}>Consultar pedidos</h2>

      <div style={styles.topBar}>
        <input
          style={{ ...styles.field, marginBottom: 0 }}
          placeholder="Buscar..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
        />

        <select
          style={{ ...styles.field, marginBottom: 0 }}
          value={estadoSeleccionado}
          onChange={e => setEstadoSeleccionado(e.target.value)}
        >
          <option value="">Seleccionar por estatus</option>
          <option value="todos">Todos</option>
          <option value="pendiente">Pendiente</option>
          <option value="programado">Programado</option>
          <option value="en_ruta">En ruta</option>
          <option value="entregado">Entregado</option>
          <option value="cancelado">Cancelado</option>
          <option value="pagado">Pagado</option>
        </select>

        <div style={styles.dropdown}>
          <div
            style={styles.dropdownButton}
            onClick={() => setMostrarDropdown(!mostrarDropdown)}
          >
            Seleccionar rutas ▼
          </div>

          {mostrarDropdown && (
            <div style={styles.dropdownContent}>
              {rutas.map(r => (
                <label key={r.id_ruta} style={{ display: 'block' }}>
                  <input
                    type="checkbox"
                    checked={rutasSeleccionadas.includes(r.id_ruta)}
                    onChange={() => toggleRuta(r.id_ruta)}
                  />
                  {' '}Ruta {r.id_ruta} - {r.nombre}
                </label>
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={styles.columnas}>
        {Object.keys(pedidosPorRuta).length === 0 && (
          <div style={styles.empty}>
            📭 No hay pedidos en este estado
          </div>
        )}

        {Object.entries(pedidosPorRuta)
          .filter(([ruta]) =>
            rutasSeleccionadas.length === 0 ||
            rutasSeleccionadas.includes(Number(ruta))
          )
          .map(([ruta, lista]) => (
            <div key={ruta} style={styles.columna}>
              <h3 style={{ textAlign: 'center' }}>
                Ruta {ruta}
              </h3>

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

                    <span style={styles.estado(p.estado)}>
                      {p.estado}
                    </span>

                    <div style={{ marginTop: 8 }}>
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
                    </div>
                  </div>
                )
              })}
            </div>
          ))}
      </div>
    </div>
  )
}

export default ConsultarPedidos
