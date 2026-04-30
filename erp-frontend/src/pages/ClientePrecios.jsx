import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

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

    setProductos(prev =>
      prev.map(p =>
        p.id_producto === id_producto
          ? { ...p, precio }
          : p
      )
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

  // =========================
  // CARGAR HISTORIAL
  // =========================
  const cargarHistorial = async () => {
    try {
      const res = await fetch(
        `${API}/clientes/${id_cliente}/precios/historial`
      )
      const data = await res.json()
      setHistorial(data)
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
      <h2 style={styles.title}>PRECIOS POR CLIENTE</h2>

      <div style={styles.top}>
        <button onClick={() => navigate('/clientes')}>
          ← Volver
        </button>

        <button onClick={cargarHistorial}>
          📊 Ver historial
        </button>
      </div>

      {/* =========================
          TABLA PRECIOS
      ========================= */}
      <table style={styles.table}>
        <thead>
          <tr>
            <th>Producto</th>
            <th>Precio</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {productos.map(p => (
            <tr key={p.id_producto}>
              <td>{p.nombre}</td>

              <td>
                <input
                  value={p.precio}
                  onChange={(e) =>
                    handleChange(p.id_producto, e.target.value)
                  }
                  style={styles.input}
                />
              </td>

              <td>
                <button
                  style={styles.save}
                  onClick={() => guardarPrecio(p)}
                >
                  Guardar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* =========================
          HISTORIAL
      ========================= */}
      {verHistorial && (
        <div style={styles.historial}>
          <h3>Historial de cambios</h3>

          <button onClick={() => setVerHistorial(false)}>
            Cerrar
          </button>

          <table style={styles.table}>
            <thead>
              <tr>
                <th>Producto</th>
                <th>Antes</th>
                <th>Nuevo</th>
                <th>Motivo</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {historial.map((h, i) => (
                <tr key={i}>
                  <td>{h.producto}</td>
                  <td>{h.precio_anterior}</td>
                  <td>{h.precio_nuevo}</td>
                  <td>{h.motivo || '-'}</td>
                  <td>{new Date(h.fecha_cambio).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// =========================
// ESTILOS
// =========================
const styles = {
  page: {
    padding: 20,
    maxWidth: 900,
    margin: 'auto',
    fontFamily: 'Arial'
  },
  title: {
    color: '#071849'
  },
  top: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse'
  },
  input: {
    width: 100,
    padding: 5
  },
  save: {
    background: '#8B1E1E',
    color: '#fff',
    border: 'none',
    padding: '5px 10px',
    cursor: 'pointer'
  },
  historial: {
    marginTop: 30
  }
}

export default ClientePrecios
