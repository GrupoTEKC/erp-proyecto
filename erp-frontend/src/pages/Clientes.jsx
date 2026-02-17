import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

const API = 'https://erp-proyecto-production.up.railway.app'

// =========================
// 🎨 ESTILOS (IGUAL PEDIDOS)
// =========================
const styles = {
  page: {
    backgroundColor: '#ffffff',
    minHeight: '100vh',
    padding: '20px',
    fontFamily: 'Arial, sans-serif'
  },

  header: {
    marginBottom: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '10px'
  },

  backButton: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '10px 14px',
    fontSize: '14px',
    backgroundColor: '#fff',
    color: '#8B1E1E',
    border: '1px solid #8B1E1E',
    borderRadius: '6px',
    cursor: 'pointer'
  },

  title: {
    marginTop: '10px',
    marginBottom: '15px',
    color: '#071849',
    fontWeight: 'bold'
  },

  buscador: {
    width: '100%',
    padding: '10px',
    fontSize: '14px',
    borderRadius: '6px',
    border: '1px solid #8B1E1E',
    marginBottom: '20px'
  },

  tablaWrap: {
    overflowX: 'auto',
    borderRadius: '8px',
    border: '1px solid #ddd'
  },

  tabla: {
    width: '100%',
    borderCollapse: 'collapse',
    minWidth: '700px'
  },

  thead: {
    backgroundColor: '#8B1E1E',
    color: 'white'
  },

  th: {
    padding: '10px',
    textAlign: 'left',
    fontSize: '14px'
  },

  td: {
    padding: '10px',
    borderBottom: '1px solid #eee',
    fontSize: '14px'
  },

  sinDatos: {
    padding: '15px',
    textAlign: 'center'
  }
}

// =========================
// 📋 COMPONENTE CLIENTES
// =========================
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
  // 🧩 UI
  // =========================
  return (

    <div style={styles.page}>

      {/* HEADER */}
      <div style={styles.header}>

        <button
          style={styles.backButton}
          onClick={() => navigate('/')}
        >
          ← Volver
        </button>

        <h2 style={styles.title}>
          CLIENTES
        </h2>

        <button
          style={styles.backButton}
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
        style={styles.buscador}
      />

      {loading && <p>Cargando clientes...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* TABLA */}
      {!loading && !error && (

        <div style={styles.tablaWrap}>

          <table style={styles.tabla}>

            <thead style={styles.thead}>
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
                  <td colSpan="7" style={styles.sinDatos}>
                    No hay clientes
                  </td>
                </tr>

              ) : (

                clientesFiltrados.map((c, i) => (

                  <tr
                    key={c.id_cliente}
                    style={{
                      background: i % 2 === 0 ? '#fafafa' : 'white'
                    }}
                  >

                    <td style={styles.td}>{c.nombre}</td>
                    <td style={styles.td}>{c.nombre_tienda}</td>
                    <td style={styles.td}>{c.telefono}</td>
                    <td style={styles.td}>{c.rfc}</td>
                    <td style={styles.td}>{c.email}</td>
                    <td style={styles.td}>{c.direccion}</td>
                    <td style={styles.td}>
                      ${c.saldo_actual || 0}
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
