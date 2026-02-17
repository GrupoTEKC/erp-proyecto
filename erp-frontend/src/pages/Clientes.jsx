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
    <div style={container}>

      {/* HEADER */}
      <div style={header}>
        <button
          style={btnVino}
          onClick={() => navigate('/')}
        >
          ← Volver
        </button>

        <h2 style={{ margin: 0 }}>Clientes</h2>

        <button
          style={btnVino}
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
        style={buscador}
      />

      {loading && <p>Cargando clientes...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && !error && (
        <div style={tablaWrapper}>
          <table style={tabla}>
            <thead style={thead}>
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
                  <td colSpan="7" style={sinDatos}>
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

/* =========================
   🎨 ESTILOS
========================= */

const vino = '#7b1e3a'

const container = {
  padding: 20,
  background: '#f5f7fa',
  minHeight: '100vh',
  fontFamily: 'Segoe UI, sans-serif'
}

const header = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 20,
  gap: 10,
  flexWrap: 'wrap'
}

const btnVino = {
  background: 'white',
  color: vino,
  border: `2px solid ${vino}`,
  padding: '10px 16px',
  borderRadius: 6,
  cursor: 'pointer',
  fontWeight: '600',
  fontFamily: 'Segoe UI, sans-serif'
}

const buscador = {
  width: '100%',
  padding: 12,
  borderRadius: 6,
  border: '1px solid #ccc',
  marginBottom: 20,
  fontFamily: 'Segoe UI, sans-serif'
}

const tablaWrapper = {
  background: 'white',
  borderRadius: 10,
  overflowX: 'auto',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
}

const tabla = {
  width: '100%',
  borderCollapse: 'collapse',
  minWidth: 700
}

const thead = {
  background: vino,
  color: 'white'
}

const th = {
  padding: 12,
  textAlign: 'left'
}

const td = {
  padding: 12,
  borderBottom: '1px solid #eee'
}

const sinDatos = {
  padding: 15,
  textAlign: 'center'
}

export default Clientes
