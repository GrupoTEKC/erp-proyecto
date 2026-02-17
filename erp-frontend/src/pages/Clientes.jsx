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
  // 🎨 ESTILOS
  // =========================
  const styles = {
    page: {
      fontFamily: 'Segoe UI, sans-serif',
      padding: 20,
      background: '#f4f6f8',
      minHeight: '100vh'
    },

    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20
    },

    button: {
      padding: '8px 14px',
      border: 'none',
      borderRadius: 6,
      cursor: 'pointer',
      fontWeight: 'bold',
      background: '#1f2937',
      color: 'white'
    },

    search: {
      width: '100%',
      padding: 10,
      borderRadius: 6,
      border: '1px solid #ccc',
      marginBottom: 15
    },

    tableContainer: {
      background: 'white',
      borderRadius: 10,
      overflow: 'hidden',
      boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
    },

    table: {
      width: '100%',
      borderCollapse: 'collapse'
    },

    th: {
      background: '#1f2937',
      color: 'white',
      padding: 12,
      textAlign: 'left'
    },

    td: {
      padding: 12,
      borderBottom: '1px solid #eee'
    }
  }

  // =========================
  // 🎨 UI
  // =========================
  return (
    <div style={styles.page}>

      <div style={styles.header}>
        <button style={styles.button} onClick={() => navigate('/')}>
          ← Volver
        </button>

        <h2>Clientes</h2>

        <button
          style={styles.button}
          onClick={() => navigate('/clientes/nuevo')}
        >
          + Nuevo
        </button>
      </div>

      <input
        style={styles.search}
        placeholder="Buscar cliente..."
        value={busqueda}
        onChange={e => setBusqueda(e.target.value)}
      />

      {loading && <p>Cargando clientes...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && !error && (
        <div style={styles.tableContainer}>
          <table style={styles.table}>

            <thead>
              <tr>
                <th style={styles.th}>Nombre</th>
                <th style={styles.th}>Tienda</th>
                <th style={styles.th}>Teléfono</th>
                <th style={styles.th}>RFC</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Dirección</th>
                <th style={styles.th}>Saldo</th>
              </tr>
            </thead>

            <tbody>
              {clientesFiltrados.length === 0 ? (
                <tr>
                  <td style={styles.td} colSpan="7">
                    No hay clientes
                  </td>
                </tr>
              ) : (
                clientesFiltrados.map(c => (
                  <tr
                    key={c.id_cliente}
                    style={{ transition: '0.2s' }}
                    onMouseEnter={e =>
                      (e.currentTarget.style.background = '#f9fafb')
                    }
                    onMouseLeave={e =>
                      (e.currentTarget.style.background = 'white')
                    }
                  >
                    <td style={styles.td}>{c.nombre}</td>
                    <td style={styles.td}>{c.nombre_tienda}</td>
                    <td style={styles.td}>{c.telefono}</td>
                    <td style={styles.td}>{c.rfc}</td>
                    <td style={styles.td}>{c.email}</td>
                    <td style={styles.td}>{c.direccion}</td>
                    <td style={styles.td}>${c.saldo_actual || 0}</td>
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
