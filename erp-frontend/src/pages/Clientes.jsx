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
  // CARGAR CLIENTES
  // =========================
  useEffect(() => {
    const cargarClientes = async () => {
      try {
        setLoading(true)
        setError(null)

        const res = await fetch(`${API}/clientes`)
        if (!res.ok) throw new Error('Error servidor')

        const data = await res.json()
        setClientes(Array.isArray(data) ? data : [])

      } catch (err) {
        console.error(err)
        setError('Error cargando clientes')
      } finally {
        setLoading(false)
      }
    }

    cargarClientes()
  }, [])

  // =========================
  // FILTRO
  // =========================
  const clientesFiltrados = clientes.filter(c =>
    `${c.nombre || ''} ${c.nombre_tienda || ''} ${c.telefono || ''} ${c.rfc || ''}`
      .toLowerCase()
      .includes(busqueda.toLowerCase())
  )

  // =========================
  // UI
  // =========================
  return (
    <div style={styles.container}>

      {/* HEADER */}
      <div style={styles.header}>
        <button style={styles.btnVolver} onClick={() => navigate('/')}>
          ← Volver
        </button>

        <h2 style={styles.titulo}>Clientes</h2>

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
        style={styles.search}
      />

      {/* ESTADOS */}
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
                  <tr key={c.id_cliente} style={styles.row}>
                    <td>{c.nombre}</td>
                    <td>{c.nombre_tienda}</td>
                    <td>{c.telefono}</td>
                    <td>{c.rfc}</td>
                    <td>{c.email}</td>
                    <td>{c.direccion}</td>
                    <td>${c.saldo_actual || 0}</td>

                    <td>
                      <button
                        style={styles.btnEditar}
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

const styles = {

  container: {
    padding: 20,
    fontFamily: 'Segoe UI, sans-serif',
    background: '#f4f6f9',
    minHeight: '100vh'
  },

  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20
  },

  titulo: {
    margin: 0,
    fontWeight: 600
  },

  btnVolver: {
    background: '#555',
    color: '#fff',
    border: 'none',
    padding: '8px 14px',
    borderRadius: 6,
    cursor: 'pointer'
  },

  btnNuevo: {
    background: '#007bff',
    color: '#fff',
    border: 'none',
    padding: '8px 14px',
    borderRadius: 6,
    cursor: 'pointer'
  },

  btnEditar: {
    background: '#28a745',
    color: '#fff',
    border: 'none',
    padding: '6px 10px',
    borderRadius: 5,
    cursor: 'pointer'
  },

  search: {
    width: '100%',
    padding: 10,
    marginBottom: 15,
    borderRadius: 6,
    border: '1px solid #ccc'
  },

  tableContainer: {
    background: '#fff',
    borderRadius: 8,
    boxShadow: '0 3px 10px rgba(0,0,0,0.1)',
    overflow: 'hidden'
  },

  table: {
    width: '100%',
    borderCollapse: 'collapse'
  },

  row: {
    transition: 'background 0.2s'
  }

}
