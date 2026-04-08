import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API = 'https://erp-proyecto-production.up.railway.app'

const styles = {
  page: { backgroundColor: '#ffffff', minHeight: '100vh', padding: '20px', fontFamily: 'Arial, sans-serif' },
  header: { marginBottom: '20px' },
  backButton: { display: 'inline-flex', alignItems: 'center', padding: '10px 14px', fontSize: '14px', backgroundColor: '#fff', color: '#8B1E1E', border: '1px solid #8B1E1E', borderRadius: '6px', cursor: 'pointer' },
  title: { marginTop: '20px', marginBottom: '15px', color: '#071849', fontWeight: 'bold' },
  field: { width: '260px', padding: '8px 10px', fontSize: '14px', borderRadius: '6px', border: '1px solid #8B1E1E', boxSizing: 'border-box', marginBottom: 15 },

  // 🔥 NUEVO DISEÑO
  columnas: {
    display: 'flex',
    gap: '15px',
    overflowX: 'auto'
  },
  columna: {
    minWidth: '320px',
    background: '#f4f6f8',
    borderRadius: '10px',
    padding: '10px'
  },
  tarjeta: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '10px',
    marginBottom: '10px',
    backgroundColor: '#fff'
  },

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
  })
}

function ConsultarPedidos() {
  const [pedidos, setPedidos] = useState([])
  const [busqueda, setBusqueda] = useState('')
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

  const cargarPedidos = async () => {
    const res = await fetch(`${urlLimpia}/pedidos`)
    const data = await res.json()
    setPedidos(data)
  }

  useEffect(() => {
    cargarPedidos()
  }, [])

  const calcularDias = (fecha) => {
    if (!fecha) return 0
    const inicio = new Date(fecha)
    const hoy = new Date()
    const diff = hoy - inicio
    return Math.floor(diff / (1000 * 60 * 60 * 24))
  }

  // 🔥 AGRUPAR POR RUTA
  const pedidosFiltrados = pedidos.filter(p =>
    p.id_pedido.toString().includes(busqueda) ||
    (p.cliente || '').toLowerCase().includes(busqueda.toLowerCase())
  )

  const pedidosPorRuta = pedidosFiltrados.reduce((acc, pedido) => {
    const ruta = pedido.id_ruta || 'SIN RUTA'
    if (!acc[ruta]) acc[ruta] = []
    acc[ruta].push(pedido)
    return acc
  }, {})

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

  const guardarEntrega = async () => {
    if (form.otro_chofer) {
      if (!form.nombre_chofer || !form.apellido_paterno || !form.apellido_materno) {
        return alert("Completa los datos del chofer")
      }
    }

    if (!form.id_unidad) return alert("Selecciona unidad")
    if (!form.id_chofer && !form.otro_chofer) return alert("Selecciona chofer")

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

  const abrirCancelar = (id) => {
    setPedidoSeleccionado(id)
    setComentarioCancelacion('')
    setModalCancelar(true)
  }

  const confirmarCancelacion = async () => {
    if (!comentarioCancelacion.trim()) {
      return alert("Debes escribir el motivo de cancelación")
    }

    const res = await fetch(`${urlLimpia}/pedidos/${pedidoSeleccionado}/cancelar`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        comentario: comentarioCancelacion
      })
    })

    if (!res.ok) {
      const err = await res.json()
      return alert(err.error)
    }

    setModalCancelar(false)
    cargarPedidos()
  }

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <button style={styles.backButton} onClick={() => navigate('/')}>
          ⬅ Volver
        </button>
      </div>

      <h2 style={styles.title}>Consultar pedidos</h2>

      <input
        style={styles.field}
        placeholder="Buscar..."
        value={busqueda}
        onChange={e => setBusqueda(e.target.value)}
      />

      {/* 🔥 COLUMNAS POR RUTA */}
      <div style={styles.columnas}>
        {Object.entries(pedidosPorRuta).map(([ruta, lista]) => (
          <div key={ruta} style={styles.columna}>
            <h3 style={{ textAlign: 'center' }}>Ruta {ruta}</h3>

            {lista.map(p => {
              const dias = calcularDias(p.fecha)
              const alerta = dias > 7

              return (
                <div
                  key={p.id_pedido}
                  style={{
                    ...styles.tarjeta,
                    backgroundColor: alerta ? '#ffe5e5' : '#fff'
                  }}
                >
                  <strong>ID:</strong> {p.id_pedido} <br />
                  <strong>Cliente:</strong> {p.cliente} <br />
                  <strong>Tienda:</strong> {p.nombre_tienda || '-'} <br />
                  <strong>Fecha:</strong> {p.fecha ? new Date(p.fecha).toLocaleDateString() : '-'} <br />
                  <strong>Días:</strong> {dias} <br />

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

      {/* 🔥 MODALES (NO SE TOCAN) */}
      {modalEntrega && (
        <div style={{
          position:'fixed', top:0,left:0,right:0,bottom:0,
          background:'rgba(0,0,0,0.5)',
          display:'flex', justifyContent:'center', alignItems:'center'
        }}>
          <div style={{ background:'#fff', padding:20, width:600, borderRadius:10 }}>
            <h3 style={styles.title}>Preparar entrega</h3>

            {form.productos.map((p, i) => (
              <div key={i} style={{ marginBottom: 10 }}>
                <strong>{p.nombre}</strong>
                <br />
                Pedido: {p.cantidad_pedida}

                <input
                  style={styles.field}
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

            <select
              style={styles.field}
              onChange={e => {
                const value = e.target.value
                if (value === 'otro') {
                  setForm({ ...form, id_chofer: '', otro_chofer: true })
                } else {
                  setForm({ ...form, id_chofer: value, otro_chofer: false })
                }
              }}
            >
              <option value="">Chofer</option>
              {choferes.map(c => (
                <option key={c.id_chofer} value={c.id_chofer}>
                  {c.nombre}
                </option>
              ))}
              <option value="otro">Otro</option>
            </select>

            {form.otro_chofer && (
              <div>
                <input style={styles.field} placeholder="Nombre" onChange={e => setForm({ ...form, nombre_chofer: e.target.value })} />
                <input style={styles.field} placeholder="Apellido paterno" onChange={e => setForm({ ...form, apellido_paterno: e.target.value })} />
                <input style={styles.field} placeholder="Apellido materno" onChange={e => setForm({ ...form, apellido_materno: e.target.value })} />
              </div>
            )}

            <select
              style={styles.field}
              onChange={e => setForm({ ...form, id_unidad: e.target.value })}
            >
              <option value="">Unidad</option>
              {unidades.map(u => (
                <option key={u.id_unidad} value={u.id_unidad}>
                  {u.nombre}
                </option>
              ))}
            </select>

            <textarea
              style={{ ...styles.field, width:'100%', height:80 }}
              placeholder="Comentario"
              onChange={e => setForm({ ...form, comentario: e.target.value })}
            />

            <button style={{ ...styles.button, ...styles.primary }} onClick={guardarEntrega}>
              Guardar
            </button>

            <button style={{ ...styles.button, ...styles.secondary }} onClick={() => setModalEntrega(false)}>
              Cerrar
            </button>
          </div>
        </div>
      )}

      {modalCancelar && (
        <div style={{
          position:'fixed', top:0,left:0,right:0,bottom:0,
          background:'rgba(0,0,0,0.5)',
          display:'flex', justifyContent:'center', alignItems:'center'
        }}>
          <div style={{ background:'#fff', padding:20, width:400, borderRadius:10 }}>
            <h3 style={styles.title}>Cancelar pedido</h3>

            <textarea
              style={{ ...styles.field, width:'100%', height:100 }}
              placeholder="Motivo"
              value={comentarioCancelacion}
              onChange={e => setComentarioCancelacion(e.target.value)}
            />

            <button style={{ ...styles.button, ...styles.primary }} onClick={confirmarCancelacion}>
              Confirmar
            </button>

            <button style={{ ...styles.button, ...styles.secondary }} onClick={() => setModalCancelar(false)}>
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ConsultarPedidos
