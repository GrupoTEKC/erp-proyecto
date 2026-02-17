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

        if (!res.ok) {
          throw new Error(`Error servidor: ${res.status}`)
        }

        const data = await res.json()

        if (!Array.isArray(data)) {
          throw new Error('Respuesta inválida del servidor')
        }

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
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '15px'
      }}>
        <button onClick={() => navigate('/')}>
          Volver
        </button>

        <h2>Clientes</h2>

        <button onClick={() => navigate('/clientes/nuevo')}>
          Nuevo
        </button>
      </div>

      <input
        type="text"
        placeholder="Buscar cliente..."
        value={busqueda}
        onChange={e => setBusqueda(e.target.value)}
        style={{
          width: '100%',
          padding: '8px',
          marginBottom: '10px'
        }}
      />

      {loading && <p>Cargando clientes...</p>}

      {error && (
        <p style={{ color: 'red' }}>
          {error}
        </p>
      )}

      {!loading && !error && (
        <table border="1" cellPadding="8" width="100%">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Tienda</th>
              <th>Teléfono</th>
              <th>RFC</th>
              <th>Email</th>
              <th>Dirección</th>
              <th>Saldo</th>
            </tr>
          </thead>

          <tbody>
            {clientesFiltrados.length === 0 ? (
              <tr>
                <td colSpan="7">
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
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  )
}
<h2 style={{color:'red'}}>CLIENTES NUEVO</h2>

export default Clientes
