import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

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
        if (!Array.isArray(data)) throw new Error('Respuesta inválida')

        setClientes(data)
      } catch (err) {
        console.error(err)
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
    <div style={container}>
      {/* HEADER */}
      <div style={header}>
        <button style={btn} onClick={() => navigate('/')}>
          ⬅ Volver
        </button>

        <h2>Clientes</h2>

        <button style={btnPrimary} onClick={() => navigate('/clientes/nuevo')}>
          + Nuevo
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
        <div style={card}>
          <table style={table}>
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

                    {/* 👉 BOTÓN EDITAR */}
                    <td>
                      <button
                        style={btnEdit}
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

export default Clientes

// =========================
// 🎨 ESTILOS
// =========================

const container = {
  padding: '20px',
  maxWidth: '1200px',
  margin: 'auto'
}

const header = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '15px'
}

const card = {
  background: '#fff',
  borderRadius: '6px',
  boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
  overflowX: 'auto'
}

const table = {
  width: '100%',
  borderCollapse: 'collapse'
}

const input = {
  width: '100%',
  padding: '8px',
  marginBottom: '10px',
  borderRadius: '4px',
  border: '1px solid #ccc'
}

const btn = {
  padding: '6px 12px',
  borderRadius: '4px',
  border: 'none',
  cursor: 'pointer'
}

const btnPrimary = {
  ...btn,
  background: '#2d7ef7',
  color: '#fff'
}

const btnEdit = {
  ...btn,
  background: '#f0ad4e',
  color: '#fff'
}
