import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import logo from '../assets/TRANSPARENTE.png'

const API = 'https://erp-proyecto-production.up.railway.app'

function ClientePrecios() {
  const { id_cliente } = useParams()
  const navigate = useNavigate()

  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const [historial, setHistorial] = useState([])
  const [verHistorial, setVerHistorial] = useState(false)

  // =========================
  // CARGAR PRECIOS
  // =========================
  useEffect(() => {
    const cargar = async () => {
      try {
        const res = await fetch(`${API}/clientes/${id_cliente}/precios`)
        const data = await res.json()
        setProductos(data)
      } catch (err) {
        console.error(err)
        alert('Error cargando precios')
      } finally {
        setLoading(false)
      }
    }
    if (id_cliente) cargar()
  }, [id_cliente])

  // =========================
  // CAMBIO DE PRECIO
  // =========================
  const handleChange = (id_producto, value) => {
  const precio = value.replace(/[^\d.]/g, '')

  const productoActual = productos.find(p => p.id_producto === id_producto)

  setProductos(prev =>
    prev.map(p => {
      // 🔥 MISMA FAMILIA (ej: boquilla roja, azul, etc)
      const mismaFamilia =
        productoActual?.nombre?.split(' ')[0] === p.nombre?.split(' ')[0]

      return mismaFamilia
        ? { ...p, precio }
        : p
    })
  )
}

  // =========================
  // GUARDAR PRECIO
  // =========================
  const guardarPrecio = async (prod) => {
    const nuevoPrecio = Number(prod.precio)

    if (isNaN(nuevoPrecio) || nuevoPrecio <= 0) {
      alert('Precio inválido')
      return
    }

    const motivo = prompt('Motivo del cambio (opcional)') || ''

    try {
      const res = await fetch(
        `${API}/clientes/${id_cliente}/precios`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id_producto: prod.id_producto,
            precio: nuevoPrecio,
            motivo
          })
        }
      )

      const data = await res.json()

      if (!res.ok) {
        alert(data.error || 'Error al guardar')
        return
      }

      alert('✅ Precio actualizado')
    } catch (err) {
      console.error(err)
      alert('Error al guardar')
    }
  }

  const renderHistorial = () => {
  if (!verHistorial) return null

  return (
    <div style={{ marginTop: 30 }}>
      <h3 style={styles.title}>HISTORIAL DE CAMBIOS</h3>

      <button
        style={styles.backButton}
        onClick={() => setVerHistorial(false)}
      >
        Cerrar
      </button>

      {/* 🔥 MENSAJE SI NO HAY DATOS */}
      {historial.length === 0 && (
        <p style={{ marginTop: 15 }}>
          No hay historial para este cliente
        </p>
      )}

      <div style={{ marginTop: 15, overflowX: 'auto' }}>
        <table style={styles.table}>
          <thead style={styles.thead}>
            <tr>
              <th style={styles.th}>Producto</th>
              <th style={styles.th}>Antes</th>
              <th style={styles.th}>Nuevo</th>
              <th style={styles.th}>Motivo</th>
              <th style={styles.th}>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {historial.map((h, i) => (
              <tr key={h.id || i}>
                <td style={styles.td}>{h.producto}</td>

                <td style={styles.td}>
                  {h.precio_anterior ? `$${h.precio_anterior}` : '-'}
                </td>

                <td style={styles.td}>
                  {h.precio_nuevo ? `$${h.precio_nuevo}` : '-'}
                </td>

                <td style={styles.td}>
                  {h.motivo || 'Sin motivo'}
                </td>

                <td style={styles.td}>
                  {h.fecha_cambio
                    ? new Date(h.fecha_cambio).toLocaleString('es-MX')
                    : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
  
  // =========================
  // CARGAR HISTORIAL
  // =========================
const cargarHistorial = async () => {
  console.log("CLICK HISTORIAL")
  console.log("ID CLIENTE:", id_cliente)

  try {
    const res = await fetch(
      `${API}/clientes/${id_cliente}/precios/historial`
    )

    console.log("STATUS:", res.status)

    if (!res.ok) {
      throw new Error('Error en servidor')
    }

    const data = await res.json()
    console.log("DATA HISTORIAL:", data)

    setHistorial(Array.isArray(data) ? data : [])
    setVerHistorial(true)

  } catch (err) {
    console.error(err)
    alert('Error cargando historial')
  }
}
  // =========================
  // LOADING
  // =========================
  if (loading) return <p style={{ padding: 20 }}>Cargando precios...</p>

  // =========================
  // UI
  // =========================
  return (
    <div style={styles.page}>
      
    <div style={styles.header}>
  
  <div style={styles.headerLeft}>
    <button
      style={styles.backButton}
      onClick={() => navigate('/clientes')}
    >
      ← Volver
    </button>

    <h2 style={styles.title}>PRECIOS POR CLIENTE</h2>
  </div>

  <img src={logo} alt="logo" style={styles.logo} />

</div>
      
      <button style={styles.guardar} onClick={cargarHistorial}>
        📊 Ver historial
      </button>

      {/* TABLA */}
      <div style={{ marginTop: 20, overflowX: 'auto' }}>
        <table style={styles.table}>
          <thead style={styles.thead}>
            <tr>
              <th style={styles.th}>Producto</th>
              <th style={styles.th}>Precio</th>
              <th style={styles.th}>Acción</th>
            </tr>
          </thead>

          <tbody>
            {productos.map((p, i) => (
              <tr key={p.id_producto} style={{ background: i % 2 === 0 ? '#f9f9f9' : 'white' }}>
                <td style={styles.td}>{p.nombre}</td>

                <td style={styles.td}>
               <input
               value={p.precio ? `$${p.precio}` : ''}
               onChange={(e) =>
               handleChange(p.id_producto, e.target.value.replace('$', ''))
               }
               style={styles.field}
               />
                </td>

                <td style={styles.td}>
                  <button
                    style={styles.guardar}
                    onClick={() => guardarPrecio(p)}
                  >
                    Guardar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {renderHistorial()}
    </div>
  )
}

// =========================
// ESTILOS (ALINEADOS A TU SISTEMA)
// =========================
const vino = '#8B1E1E' 
const styles = {
  page: {
    backgroundColor: '#ffffff',
    minHeight: '100vh',
    padding: '20px',
    fontFamily: 'Arial, sans-serif'
  },

  // 🔥 HEADER FLEX
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  },

  logo: {
    width: '130px'
  },

backButton: {
  display: 'inline-block',   // 🔥 clave
  width: 'auto',             // 🔥 evita que se estire
  padding: '6px 10px',       // ajusta ancho fino
  fontSize: '13px',
  backgroundColor: '#fff',
  color: vino,
  border: `1px solid ${vino}`,
  borderRadius: '6px',
  cursor: 'pointer'
},

  headerLeft: {
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  alignItems: 'flex-start' // 🔥 evita que se estire
},
  // 🔥 TÍTULO GRANDE
  title: {
    margin: 0,
    color: '#071849',
    fontWeight: 'bold',
    fontSize: '38px',
    textTransform: 'uppercase'
  },

  field: {
    width: '120px',
    padding: '8px 10px',
    fontSize: '14px',
    borderRadius: '6px',
    border: `1px solid ${vino}`
  },

  guardar: {
    marginTop: '10px',
    padding: '8px 12px',
    fontSize: '14px',
    backgroundColor: vino,
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer'
  },

  table: {
    width: '100%',
    borderCollapse: 'collapse'
  },

  thead: {
    background: vino,
    color: '#fff'
  },

  th: {
    padding: 12,
    textAlign: 'left'
  },

  td: {
    padding: 12,
    borderBottom: '1px solid #eee'
  }
}


export default ClientePrecios
