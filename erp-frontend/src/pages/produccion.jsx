import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API = 'https://erp-proyecto-production.up.railway.app'

function Produccion() {
  const navigate = useNavigate()

  const [productos, setProductos] = useState([])
  const [fecha, setFecha] = useState(
    new Date().toISOString().slice(0, 10)
  )

  useEffect(() => {
    cargarDatos()
  }, [fecha])

  const cargarDatos = async () => {
    try {
      const res = await fetch(`${API}/produccion/${fecha}`)
      const data = await res.json()
      setProductos(Array.isArray(data) ? data : [])
    } catch {
      alert('Error al cargar producción')
    }
  }

  const handleChange = (index, value) => {
    const nuevos = [...productos]
    nuevos[index].producido = value
    setProductos(nuevos)
  }

  const guardar = async () => {
    try {
      const datos = productos.map(p => ({
        id_producto: p.id_producto,
        cantidad: Number(p.producido) || 0
      }))

      const res = await fetch(`${API}/produccion`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fecha, datos })
      })

      const data = await res.json()

      if (!res.ok) {
        alert(data.error || 'Error al guardar')
        return
      }

      alert('✅ Producción guardada')
      cargarDatos()
    } catch {
      alert('❌ Error al guardar')
    }
  }

  return (
    <div style={styles.page}>
      
      <h2 style={styles.title}>PRODUCCIÓN DIARIA</h2>

      <div style={styles.top}>
        <label>Fecha:</label>
        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
        />
      </div>

      <table style={styles.table}>
        <thead>
          <tr>
            <th>Producto</th>
            <th>Producción del día</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((p, i) => (
            <tr key={p.id_producto}>
              <td>{p.nombre}</td>
              <td>
                <input
                  type="number"
                  value={p.producido || ''}
                  onChange={(e) =>
                    handleChange(i, e.target.value)
                  }
                  style={styles.input}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={styles.buttons}>
        <button style={styles.save} onClick={guardar}>
          Guardar Producción
        </button>

        <button
          style={styles.cancel}
          onClick={() => navigate('/')}
        >
          Volver
        </button>
      </div>
    </div>
  )
}

// =========================
// 🎨 ESTILOS (igual línea que tu sistema)
// =========================
const vino = '#8B1E1E'

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
    marginBottom: 20,
    display: 'flex',
    gap: 10,
    alignItems: 'center'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse'
  },
  input: {
    width: '100%',
    padding: 6
  },
  buttons: {
    marginTop: 20,
    display: 'flex',
    gap: 10
  },
  save: {
    background: vino,
    color: '#fff',
    border: 'none',
    padding: 10,
    borderRadius: 6,
    cursor: 'pointer'
  },
  cancel: {
    background: '#fff',
    color: vino,
    border: `1px solid ${vino}`,
    padding: 10,
    borderRadius: 6,
    cursor: 'pointer'
  }
}

export default Produccion
