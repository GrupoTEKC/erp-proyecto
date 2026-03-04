import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

const API = 'https://erp-proyecto-production.up.railway.app'

function Clientes() {
  const navigate = useNavigate()

  const [clientes, setClientes] = useState([])
  const [busqueda, setBusqueda] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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
  // Agregamos "?" para evitar errores si algún campo es null
  const term = busqueda.toLowerCase()
  const clientesFiltrados = clientes.filter(c =>
    `${c.nombre} ${c.apellido1} ${c.apellido2} ${c.nombre_tienda} ${c.apodo}`
      .toLowerCase()
      .includes(term)
  )

  /* ================= ELIMINAR ================= */
  const eliminarCliente = async (id) => {
    const confirmar = window.confirm('¿Eliminar cliente definitivamente?')
    if (!confirmar) return

    try {
      const res = await fetch(`${API}/clientes/${id}`, {
        method: 'DELETE'
      })

      if (!res.ok) throw new Error('Error al eliminar')

      setClientes(prev =>
        prev.filter(c => c.id_cliente !== id)
      )

      alert('✅ Cliente eliminado correctamente')

    } catch (err) {
      console.error('🔥 ERROR:', err)
      alert('❌ No se pudo eliminar el cliente')
    }
  }

  return (
    <div style={container}>
      <div style={header}>
        <button style={btnVino} onClick={() => navigate('/')}>
          ← Volver
        </button>

        <h2 style={{ margin: 0 }}>Gestión de Clientes</h2>

        <button
          style={btnVino}
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

      {loading && <p>Cargando información de clientes...</p>}
      {error && <p style={{ color: 'red' }}>⚠️ Error: {error}</p>}

      {!loading && !error && (
        <div style={tablaWrapper}>
          <table style={tabla}>
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
                <th style={th}>Ruta</th>
                <th style={th}>Saldo</th>
                <th style={th}>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {clientesFiltrados.length === 0 ? (
                <tr>
                  <td colSpan="18" style={sinDatos}>
                    No se encontraron clientes que coincidan con la búsqueda
                  </td>
                </tr>
              ) : (
                clientesFiltrados.map((c, i) => (
                  <tr
                    key={c.id_cliente}
                    style={{
                      background: i % 2 === 0 ? '#f9f9f9' : 'white'
                    }}
                  >
                    <td style={td}>
                      {c.nombre} {c.apellido1} {c.apellido2}
                    </td>
                    <td style={td}>{c.apodo}</td>
                    <td style={td}>{c.rfc}</td>
                    <td style={td}>
                      {c.categoria}
                      {c.categoria_otro ? ` (${c.categoria_otro})` : ''}
                    </td>
                    <td style={td}>{c.nombre_tienda}</td>
                    <td style={td}>{c.telefono_dueno}</td>
                    <td style={td}>{c.telefono_tienda}</td>
                    <td style={td}>{c.calle}</td>
                    <td style={td}>{c.numero}</td>
                    <td style={td}>{c.cp}</td>
                    <td style={td}>{c.municipio}</td>
                    <td style={td}>{c.estado}</td>
                    <td style={td}>{c.entre_calles}</td>
                    <td style={td}>{c.referencia}</td>
                    <td style={td}>{c.email}</td>
                    {/* ✅ Mostramos el nombre de la ruta que viene del JOIN del backend */}
                    <td style={td}>
                      {c.ruta ? c.ruta : <span style={{color: '#ccc'}}>No asignada</span>}
                    </td>
                    <td style={td}>
                      <b style={{color: c.saldo_actual > 0 ? 'red' : 'green'}}>
                        ${Number(c.saldo_actual || 0).toLocaleString()}
                      </b>
                    </td>
                    <td style={td}>
                      <div style={{display: 'flex', gap: '5px'}}>
                        <button
                          style={btnEditar}
                          onClick={() => navigate(`/clientes/editar/${c.id_cliente}`)}
                        >
                          Editar
                        </button>

                        <button
                          style={{
                            ...btnEditar,
                            color: 'red',
                            borderColor: 'red'
                          }}
                          onClick={() => eliminarCliente(c.id_cliente)}
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

/* ================= ESTILOS (Sin cambios) ================= */
const vino = '#8B1E1E'
const container = { padding: 20, background: '#ffffff', minHeight: '100vh', fontFamily: 'Arial' }
const header = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 10 }
const btnVino = { background: '#fff', color: vino, border: `1px solid ${vino}`, padding: '10px 14px', borderRadius: 6, cursor: 'pointer' }
const btnEditar = { ...btnVino, padding: '6px 10px', fontSize: 13 }
const buscador = { width: '100%', padding: 10, borderRadius: 6, border: `1px solid ${vino}`, marginBottom: 20 }
const tablaWrapper = { background: '#fff', borderRadius: 8, overflowX: 'auto', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }
const tabla = { width: '100%', borderCollapse: 'collapse', minWidth: 1500 }
const thead = { background: vino, color: '#fff' }
const th = { padding: 12, textAlign: 'left' }
const td = { padding: 12, borderBottom: '1px solid #eee' }
const sinDatos = { padding: 15, textAlign: 'center' }

export default Clientes
