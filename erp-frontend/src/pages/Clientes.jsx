import { useNavigate } from 'react-router-dom'
import { useEffect, useState, useRef } from 'react'
import logo from '../assets/TRANSPARENTE.png'

const API = 'https://erp-proyecto-production.up.railway.app'

function Clientes() {
  const navigate = useNavigate()

  const [clientes, setClientes] = useState([])
  const [busqueda, setBusqueda] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  /* ================= SINCRONIZACIÓN DE SCROLL ================= */
  const topScrollRef = useRef(null)
  const bottomScrollRef = useRef(null)
  const [anchoTabla, setAnchoTabla] = useState(0)

  const handleTopScroll = () => {
    if (bottomScrollRef.current && topScrollRef.current) {
      bottomScrollRef.current.scrollLeft = topScrollRef.current.scrollLeft
    }
  }

  const handleBottomScroll = () => {
    if (topScrollRef.current && bottomScrollRef.current) {
      topScrollRef.current.scrollLeft = bottomScrollRef.current.scrollLeft
    }
  }

  /* ================= CARGAR CLIENTES ================= */
  useEffect(() => {
    const cargarClientes = async () => {
      try {
        setLoading(true)
        setError(null)

        const res = await fetch(`${API}/clientes`)
        if (!res.ok) throw new Error('Error cargando clientes')

        const data = await res.json()
        setClientes(data)

      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    cargarClientes()
  }, [])

  /* ================= FILTRO MEJORADO ================= */
  const term = busqueda.toLowerCase()
  const clientesFiltrados = clientes.filter(c =>
    `${c.nombre} ${c.apellido1} ${c.apellido2} ${c.nombre_tienda} ${c.apodo}`
      .toLowerCase()
      .includes(term)
  )

  /* 🟢 MEDIMOS EL ANCHO DE LA TABLA (AQUÍ YA EXISTE clientesFiltrados) */
  useEffect(() => {
    if (bottomScrollRef.current) {
      setAnchoTabla(bottomScrollRef.current.scrollWidth)
    }
  }, [clientesFiltrados, loading])

  /* ================= ELIMINAR ================= */
  const eliminarCliente = async (id) => {
    const confirmar = window.confirm('¿Eliminar cliente definitivamente?')
    if (!confirmar) return

    try {
      const res = await fetch(`${API}/clientes/${id}`, {
        method: 'DELETE'
      })

      if (!res.ok) throw new Error('Error al eliminar')

      setClientes(prev => prev.filter(c => c.id_cliente !== id))
      alert('✅ Cliente eliminado')

    } catch (err) {
      console.error('🔥 ERROR:', err)
      alert('❌ No se pudo eliminar')
    }
  }

  return (
    <div style={container}>
      {/* 🔴 ENCABEZADO IDÉNTICO A PRODUCCIÓN */}
      <div style={header}>
        <button
          style={cancel}
          onClick={() => navigate('/')}
        >
          Volver
        </button>

        <h1 style={mainTitle}>
          GESTIÓN DE CLIENTES
        </h1>

        <img src={logo} alt="logo" style={logoStyle} />
      </div>

      {/* 🟢 BOTÓN DE NUEVO CLIENTE */}
      <div style={{ marginBottom: 20 }}>
        <button 
          style={{ ...btnVino, background: vino, color: '#fff', fontWeight: 'bold' }} 
          onClick={() => navigate('/clientes/nuevo')}
        >
          + Nuevo Cliente
        </button>
      </div>

      <input
        type="text"
        placeholder="Buscar por nombre, tienda o apodo..."
        value={busqueda}
        onChange={e => setBusqueda(e.target.value)}
        style={buscador}
      />

      {loading && <p>Cargando información...</p>}
      {error && <p style={{ color: 'red' }}>⚠️ Error: {error}</p>}

      {!loading && !error && (
        <div style={tablaWrapper}>

          <div
            ref={topScrollRef}
            onScroll={handleTopScroll}
            style={{
              overflowX: 'auto',
              overflowY: 'hidden',
              marginBottom: '10px',
              width: '100%'
            }}
          >
            {/* Usa dinámicamente los píxeles exactos de la tabla */}
            <div style={{ width: `${anchoTabla}px`, height: '1px' }} />
          </div>

          {/* 🟢 ABAJO SIGUE LA TABLA DE SIEMPRE */}
          <div
            ref={bottomScrollRef}
            onScroll={handleBottomScroll}
            style={{ overflowX: 'auto', width: '100%' }}
          >
            <table style={{ ...tabla, minWidth: '2200px' }}>
              <thead style={thead}>
                <tr>
                  <th style={th}>Nombre Completo</th>
                  <th style={th}>Apodo</th>
                  <th style={th}>RFC</th>
                  <th style={th}>Categoría</th>
                  <th style={th}>Tienda</th>
                  <th style={th}>Tel. Dueño</th>
                  <th style={th}>Tel. Tienda</th>
                  <th style={th}>Calle</th>
                  <th style={th}>Nº</th>
                  <th style={th}>CP</th>
                  <th style={th}>Municipio</th>
                  <th style={th}>Estado</th>
                  <th style={th}>Entre calles</th>
                  <th style={th}>Referencia</th>
                  <th style={th}>Email</th>
                  <th style={th}>ID Ruta</th>
                  <th style={th}>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {clientesFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan="17" style={sinDatos}>
                      No se encontraron clientes
                    </td>
                  </tr>
                ) : (
                  clientesFiltrados.map((c, i) => (
                    <tr
                      key={c.id_cliente}
                      style={{ background: i % 2 === 0 ? '#f9f9f9' : 'white' }}
                    >
                      <td style={td}>{c.nombre} {c.apellido1} {c.apellido2}</td>
                      <td style={td}>{c.apodo}</td>
                      <td style={td}>{c.rfc}</td>
                      <td style={td}>
                        {c.categoria}{c.categoria_otro ? ` (${c.categoria_otro})` : ''}
                      </td>
                      <td style={td}>{c.nombre_tienda}</td>
                      <td style={td}>{c.telefono || '-'}</td>
                      <td style={td}>{c.telefono_local || '-'}</td>
                      <td style={td}>{c.calle}</td>
                      <td style={td}>{c.numero}</td>
                      <td style={td}>{c.cp}</td>
                      <td style={td}>{c.municipio}</td>
                      <td style={td}>{c.estado}</td>
                      <td style={td}>{c.entre_calles}</td>
                      <td style={td}>{c.referencia}</td>
                      <td style={td}>{c.email}</td>
                      <td style={td}>{c.id_ruta || 'N/A'}</td>
                      <td style={td}>
                        <div style={{ display: 'flex', gap: '5px' }}>
                          <button
                            style={btnEditar}
                            onClick={() => navigate(`/clientes/editar/${c.id_cliente}`)}
                          >
                            Editar
                          </button>
                          <button
                            style={{ ...btnEditar, color: 'red', borderColor: 'red' }}
                            onClick={() => eliminarCliente(c.id_cliente)}
                          >
                            Eliminar
                          </button>
                          <button
                            style={{ ...btnEditar, borderColor: '#071849', color: '#071849' }}
                            onClick={() => navigate(`/clientes/${c.id_cliente}/precios`)}
                          >
                            + Precios
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}


/* ================= ESTILOS ================= */
const vino = '#8B1E1E'

const container = {
  padding: 20,
  width: '85%',
  margin: '0 auto',
  textAlign: 'left',
  fontFamily: 'Arial, sans-serif'
}

const cancel = {
  background: '#fff',
  color: vino,
  border: `1px solid ${vino}`,
  padding: 10,
  borderRadius: 6,
  cursor: 'pointer',
  fontWeight: 'bold'
}

const header = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: 30
}

const btnVino = {
  background: '#fff',
  color: vino,
  border: `1px solid ${vino}`,
  padding: '10px 14px',
  borderRadius: 6,
  cursor: 'pointer'
}

const btnEditar = {
  ...btnVino,
  padding: '6px 10px',
  fontSize: 13
}

const buscador = {
  width: '100%',
  padding: 10,
  borderRadius: 6,
  border: `1px solid ${vino}`,
  marginBottom: 20
}

const tablaWrapper = {
  background: '#fff',
  borderRadius: 8,
  overflow: 'hidden',
  boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
  padding: '10px'
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

const th = {
  padding: 12,
  textAlign: 'left'
}

const td = {
  padding: 12,
  borderBottom: '1px solid #eee'
}

const sinDatos = {
  padding: 15,
  textAlign: 'center'
}

const logoStyle = {
  height: 170
}

const mainTitle = {
  color: vino,
  fontSize: 48,
  fontWeight: '900',
  letterSpacing: 2,
  margin: 0
}

export default Clientes
