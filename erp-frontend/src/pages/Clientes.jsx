import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

// 👉 URL BACKEND
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
  // 🔍 FILTRO
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
        <button style={btnSecundario} onClick={() => navigate('/')}>
          ⬅ Volver
        </button>

        <h2 style={{ margin: 0 }}>Clientes</h2>

        <button
          style={btnPrimario}
          onClick={() => navigate('/clientes/nuevo')}
        >
          + Nuevo Cliente
        </button>
      </div>

      {/* BUSCADOR */}
      <input
        type="text"
        placeholder="Buscar cliente..."
        value={busqueda}
        onChange={e => setBusqueda(e.target.value)}
        style={buscador}
      />

      {/* ESTADOS */}
      {loading && <p>Cargando clientes...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* TABLA */}
      {!loading && !error && (
        <div style={tablaWrapper}>
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
                  <td colSpan="8">No hay clientes</td>
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

export default Clientes

// =========================
// 🎨 ESTILOS
// =========================

const container = {
  padding: '20px',
  fontFamily: 'Arial'
}

const header = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '15px'
}

const buscador = {
  width: '100%',
  padding: '10px',
  marginBottom: '15px',
  fontSize: '14px'
}

const tablaWrapper = {
  overflowX: 'auto',
  background: '#fff',
  borderRadius: '6px',
  boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
}

const tabla = {
  width: '100%',
  borderCollapse: 'collapse'
}

const btnPrimario = {
  padding: '8px 14px',
  background: '#007bff',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer'
}

const btnSecundario = {
  padding: '8px 14px',
  background: '#6c757d',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer'
}

const btnEditar = {
  padding: '6px 10px',
  background: '#28a745',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer'
}
