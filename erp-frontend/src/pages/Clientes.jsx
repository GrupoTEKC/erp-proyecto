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
    <div style={{
      padding: 20,
      background: '#f5f7fa',
      minHeight: '100vh',
      fontFamily: 'Segoe UI, sans-serif'
    }}>

      {/* HEADER */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: 20
      }}>
        <button
          onClick={() => navigate('/')}
          style={{
            background: '#444',
            color: 'white',
            border: 'none',
            padding: '10px 16px',
            borderRadius: 6,
            cursor: 'pointer'
          }}
        >
          ← Volver
        </button>

        <h2 style={{ margin: 0 }}>Clientes</h2>

        <button
          onClick={() => navigate('/clientes/nuevo')}
          style={{
            background: '#007bff',
            color: 'white',
            border: 'none',
            padding: '10px 16px',
            borderRadius: 6,
            cursor: 'pointer'
          }}
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
        style={{
          width: '100%',
          padding: 12,
          borderRadius: 6,
          border: '1px solid #ccc',
          marginBottom: 20
        }}
      />

      {loading && <p>Cargando clientes...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && !error && (
        <div style={{
          background: 'white',
          borderRadius: 10,
          overflow: 'hidden',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>

          <table style={{
            width: '100%',
            borderCollapse: 'collapse'
          }}>

            <thead style={{
              background: '#007bff',
              color: 'white'
            }}>
              <tr>
                <th style={th}>Nombre</th>
                <th style={th}>Tienda</th>
                <th style={th}>Teléfono</th>
                <th style={th}>RFC</th>
                <th style={th}>Email</th>
                <th style={th}>Dirección</th>
                <th style={th}>Saldo</th>
              </tr>
            </thead>

            <tbody>
              {clientesFiltrados.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ padding: 15, textAlign: 'center' }}>
                    No hay clientes
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
                    <td style={td}>{c.nombre}</td>
                    <td style={td}>{c.nombre_tienda}</td>
                    <td style={td}>{c.telefono}</td>
                    <td style={td}>{c.rfc}</td>
                    <td style={td}>{c.email}</td>
                    <td style={td}>{c.direccion}</td>
                    <td style={td}>${c.saldo_actual || 0}</td>
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

const th = {
  padding: 12,
  textAlign: 'left'
}

const td = {
  padding: 12,
  borderBottom: '1px solid #eee'
}

export default Clientes
