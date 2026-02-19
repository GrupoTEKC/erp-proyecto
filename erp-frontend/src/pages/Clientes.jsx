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

  // 🔍 búsqueda ampliada
  const clientesFiltrados = clientes.filter(c =>
    JSON.stringify(c)
      .toLowerCase()
      .includes(busqueda.toLowerCase())
  )

  return (
    <div style={container}>

      {/* HEADER */}
      <div style={header}>
        <button style={btnVino} onClick={() => navigate('/')}>
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
                <th style={th}>Apodo</th>
                <th style={th}>RFC</th>

                <th style={th}>Categoría</th>

                <th style={th}>Tienda</th>

                <th style={th}>Tel. Dueño</th>
                <th style={th}>Tel. Tienda</th>

                <th style={th}>Calle</th>
                <th style={th}>Número</th>
                <th style={th}>CP</th>
                <th style={th}>Municipio</th>
                <th style={th}>Estado</th>

                <th style={th}>Entre calles</th>
                <th style={th}>Referencia</th>

                <th style={th}>Email</th>
                <th style={th}>N. Ruta</th>
                <th style={th}>Nombre Ruta</th>



                <th style={th}>Saldo</th>

                <th style={th}>Acción</th>

              </tr>
            </thead>

            <tbody>

              {clientesFiltrados.length === 0 ? (
                <tr>
                  <td colSpan="18" style={sinDatos}>
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

                    <td style={td}>
                      {c.nombre} {c.apellido1} {c.apellido2}
                    </td>

                    <td style={td}>{c.apodo}</td>

                    <td style={td}>{c.rfc}</td>

                    <td style={td}>
                      {c.categoria}
                      {c.categoria_otro ? ` (${c.categoria_otro})` : ''}
                    </td>

                    <td style={td}>{c.nombre_tienda}</td>

                    <td style={td}>{c.telefono_dueno}</td>
                    <td style={td}>{c.telefono_tienda}</td>

                    <td style={td}>{c.calle}</td>
                    <td style={td}>{c.numero}</td>
                    <td style={td}>{c.cp}</td>
                    <td style={td}>{c.municipio}</td>
                    <td style={td}>{c.estado}</td>

                    <td style={td}>{c.entre_calles}</td>
                    <td style={td}>{c.referencia}</td>

                    <td style={td}>{c.email}</td>
                    <td style={td}>{c.id_ruta ?? ''}</td>
                    <td style={td}>{c.ruta_nombre ?? ''}</td>


                    <td style={td}>${c.saldo_actual || 0}</td>

                    <td style={td}>
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

/* 🎨 ESTILOS */

const vino = '#8B1E1E'

const container = {
  padding: 20,
  background: '#ffffff',
  minHeight: '100vh',
  fontFamily: 'Arial, sans-serif'
}

const header = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 20,
  flexWrap: 'wrap',
  gap: 10
}

const btnVino = {
  background: '#fff',
  color: vino,
  border: `1px solid ${vino}`,
  padding: '10px 14px',
  borderRadius: 6,
  cursor: 'pointer',
  fontSize: '14px'
}

const btnEditar = {
  ...btnVino,
  padding: '6px 10px',
  fontSize: '13px'
}

const buscador = {
  width: '100%',
  padding: 10,
  borderRadius: 6,
  border: `1px solid ${vino}`,
  marginBottom: 20,
  fontSize: '14px'
}

const tablaWrapper = {
  background: '#fff',
  borderRadius: 8,
  overflowX: 'auto',
  boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
}

const tabla = {
  width: '100%',
  borderCollapse: 'collapse',
  minWidth: 1500
}

const thead = {
  background: vino,
  color: '#fff'
}

const th = {
  padding: 12,
  textAlign: 'left',
  fontSize: '14px'
}

const td = {
  padding: 12,
  borderBottom: '1px solid #eee',
  fontSize: '14px'
}

const sinDatos = {
  padding: 15,
  textAlign: 'center'
}

export default Clientes
