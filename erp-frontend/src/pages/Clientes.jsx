import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

const API = 'https://erp-proyecto-production.up.railway.app'

function Clientes() {
  const navigate = useNavigate()
  const [clientes, setClientes] = useState([])
  const [busqueda, setBusqueda] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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
        setError(err.message)
        setClientes([])
      } finally {
        setLoading(false)
      }
    }

    cargarClientes()
  }, [])

  const clientesFiltrados = clientes.filter(c =>
    `${c.nombre || ''} ${c.nombre_tienda || ''} ${c.telefono || ''} ${c.rfc || ''}`
      .toLowerCase()
      .includes(busqueda.toLowerCase())
  )

  return (
    <div style={styles.page}>

      {/* HEADER */}
      <div style={styles.header}>
        <button
          onClick={() => navigate('/')}
          style={styles.btnBack}
        >
          ← Volver
        </button>

        <h2 style={styles.title}>Clientes</h2>

        <button
          onClick={() => navigate('/clientes/nuevo')}
          style={styles.btnPrimary}
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
        style={styles.search}
      />

      {loading && <p>Cargando clientes...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* TABLA RESPONSIVE */}
      {!loading && !error && (
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeader}>
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
                  <td colSpan="7" style={styles.empty}>
                    No hay clientes
                  </td>
                </tr>
              ) : (
                clientesFiltrados.map((c, i) => (
                  <tr
                    key={c.id_cliente}
                    style={{
                      background: i % 2 === 0 ? '#fdf6f6' : 'white'
                    }}
                  >
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

/* ======================
   🎨 ESTILOS
====================== */

const styles = {

  page: {
    padding: 20,
    background: '#f6f6f6',
    minHeight: '100vh',
    fontFamily: 'Segoe UI, sans-serif'
  },

  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20
  },

  title: {
    margin: 0,
    fontSize: 22,
    color: '#1b2a57'
  },

  btnBack: {
    background: '#8b1d1d',
    color: 'white',
    border: 'none',
    padding: '10px 16px',
    borderRadius: 6,
    cursor: 'pointer'
  },

  btnPrimary: {
    background: '#8b1d1d',
    color: 'white',
    border: 'none',
    padding: '10px 16px',
    borderRadius: 6,
    cursor: 'pointer'
  },

  search: {
    width: '100%',
    padding: 12,
    borderRadius: 6,
    border: '1px solid #ccc',
    marginBottom: 20
  },

  tableWrapper: {
    overflowX: 'auto',
    background: 'white',
    borderRadius: 8,
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
  },

  table: {
    width: '100%',
    borderCollapse: 'collapse',
    minWidth: 700
  },

  tableHeader: {
    background: '#d7bcbc',
    textAlign: 'left'
  },

  empty: {
    padding: 15,
    textAlign: 'center'
  }

}

export default Clientes
