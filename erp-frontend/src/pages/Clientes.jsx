import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

// 👉 URL DEL BACKEND
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
    <div style={styles.page}>
      {/* HEADER */}
      <div style={styles.header}>
        <button
          style={styles.btnVolver}
          onClick={() => navigate('/')}
        >
          ← Volver al menú
        </button>

        <h2 style={styles.title}>CLIENTES</h2>

        <button
          style={styles.btnNuevo}
          onClick={() => navigate('/clientes/nuevo')}
        >
          + Nuevo
        </button>
      </div>

      {/* BUSCADOR */}
      <input
        type="text"
        placeholder="Buscar cliente..."
        value={busqueda}
        onChange={e => setBusqueda(e.target.value)}
        style={styles.input}
      />

      {loading && <p>Cargando clientes...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* TABLA */}
      {!loading && !error && (
        <div style={styles.tableContainer}>
          <table style={styles.table}>
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
                  <td colSpan="7">No hay clientes</td>
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
        </div>
      )}
    </div>
  )
}

// =========================
// 🎨 ESTILOS
// =========================
const styles = {
  page: {
    background: '#efefef',
    minHeight: '100vh',
    padding: '30px',
    fontFamily: 'Arial'
  },

  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20
  },

  title: {
    margin: 0,
    color: '#0d2c5c'
  },

  btnVolver: {
    padding: '8px 14px',
    border: '1px solid #b00',
    background: 'white',
    borderRadius: 6,
    cursor: 'pointer'
  },

  btnNuevo: {
    padding: '8px 14px',
    background: '#8b1a1a',
    color: 'white',
    border: 'none',
    borderRadius: 6,
    cursor: 'pointer'
  },

  input: {
    width: '100%',
    padding: 10,
    marginBottom: 15,
    borderRadius: 6,
    border: '1px solid #ccc'
  },

  tableContainer: {
    background: 'white',
    borderRadius: 6,
    overflow: 'hidden',
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
  },

  table: {
    width: '100%',
    borderCollapse: 'collapse'
  }
}

export default Clientes
