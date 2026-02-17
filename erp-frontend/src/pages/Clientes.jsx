import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

// 👉 URL DEL BACKEND EN PRODUCCIÓN
const API = 'https://erp-proyecto-production.up.railway.app'

function Clientes() {
  const navigate = useNavigate()

  const [clientes, setClientes] = useState([])
  const [busqueda, setBusqueda] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // =========================
  // 🔄 CARGAR CLIENTES
  // =========================
  useEffect(() => {
    const cargarClientes = async () => {
      try {
        setLoading(true)
        setError(null)

        const res = await fetch(`${API}/clientes`)
        if (!res.ok) throw new Error(`Error servidor: ${res.status}`)

        const data = await res.json()
        if (!Array.isArray(data))
          throw new Error('Respuesta inválida del servidor')

        setClientes(data)
      } catch (err) {
        console.error('Error cargando clientes:', err)
        setError(err.message)
        setClientes([])
      } finally {
        setLoading(false)
      }
    }

    cargarClientes()
  }, [])

  // =========================
  // 🔎 FILTRO
  // =========================
  const clientesFiltrados = clientes.filter(c =>
    `${c.nombre || ''} ${c.nombre_tienda || ''} ${c.telefono || ''} ${c.rfc || ''}`
      .toLowerCase()
      .includes(busqueda.toLowerCase())
  )

  // =========================
  // 🎨 UI
  // =========================
  return (
    <div style={page}>
      {/* HEADER */}
      <div style={header}>
        <button style={btnVolver} onClick={() => navigate('/')}>
          ⬅ Volver
        </button>

        <h2 style={titulo}>Clientes</h2>

        <button
          style={btnPrincipal}
          onClick={() => navigate('/clientes/nuevo')}
        >
          + Nuevo cliente
        </button>
      </div>

      {/* BUSCADOR */}
      <input
        type="text"
        placeholder="Buscar cliente..."
        value={busqueda}
        onChange={e => setBusqueda(e.target.value)}
        style={input}
      />

      {/* ESTADOS */}
      {loading && <p>Cargando clientes...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* TABLA */}
      {!loading && !error && (
        <div style={panel}>
          <table style={tabla}>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Tienda</th>
                <th>Teléfono</th>
                <th>RFC</th>
                <th>Email</th>
                <th>Dirección</th>
                <th>Saldo</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {clientesFiltrados.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center' }}>
                    No hay clientes
                  </td>
                </tr>
              ) : (
                clientesFiltrados.map(c => (
                  <tr key={c.id_cliente}>
                    <td>{c.nombre}</td>
                    <td>{c.nombre_tienda}</td>
                    <td>{c.telefono}</td>
                    <td>{c.rfc}</td>
                    <td>{c.email}</td>
                    <td>{c.direccion}</td>
                    <td>${c.saldo_actual || 0}</td>

                    <td>
                      <button
                        style={btnEditar}
                        onClick={() =>
                          navigate(`/clientes/editar/${c.id_cliente}`)
                        }
                      >
                        Editar
                      </button>
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

// =========================
// 🎨 ESTILOS
// =========================

const page = {
  background: '#f4f6f9',
  minHeight: '100vh',
  padding: 25,
  fontFamily: 'Segoe UI, sans-serif'
}

const header = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 20
}

const titulo = {
  margin: 0,
  fontWeight: 600
}

const panel = {
  background: '#fff',
  borderRadius: 6,
  padding: 15,
  boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
  overflowX: 'auto'
}

const tabla = {
  width: '100%',
  borderCollapse: 'collapse'
}

const input = {
  width: '100%',
  padding: 10,
  marginBottom: 15,
  borderRadius: 4,
  border: '1px solid #ccc',
  fontSize: 14
}

const btnVolver = {
  background: '#6c757d',
  color: '#fff',
  border: 'none',
  padding: '8px 14px',
  borderRadius: 4,
  cursor: 'pointer'
}

const btnPrincipal = {
  background: '#007bff',
  color: '#fff',
  border: 'none',
  padding: '8px 14px',
  borderRadius: 4,
  cursor: 'pointer'
}

const btnEditar = {
  background: '#f0ad4e',
  color: '#fff',
  border: 'none',
  padding: '6px 10px',
  borderRadius: 4,
  cursor: 'pointer'
}

export default Clientes
