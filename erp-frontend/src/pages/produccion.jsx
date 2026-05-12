import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API = 'https://erp-proyecto-production.up.railway.app'

function Produccion() {
  const navigate = useNavigate()

  const hoy = new Date().toISOString().slice(0, 10)

  const [productos, setProductos] = useState([])
  const [fecha, setFecha] = useState(hoy)
  const [bloqueado, setBloqueado] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    init()
  }, [])

  const init = async () => {
    try {
      // 🔥 VALIDAR AYER
      const resVal = await fetch(`${API}/produccion/validar`)
      const val = await resVal.json()

      if (val.faltaAyer) {
        setBloqueado(true)
        setLoading(false)
        return
      }

      // 🔥 CARGAR SOLO HOY
      cargarDatos(hoy)

    } catch {
      alert('Error inicial')
    } finally {
      setLoading(false)
    }
  }

  const cargarDatos = async (fechaActual) => {
    try {
      const res = await fetch(`${API}/produccion/${fechaActual}`)
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
        body: JSON.stringify({
          data: datos,
          rol: 'supervisor' // 🔥 CAMBIA A 'admin' SI ERES TÚ
        })
      })

      const data = await res.json()

      if (!res.ok) {
        alert(data.error || 'Error al guardar')
        return
      }

      alert('✅ Producción guardada')
      cargarDatos(hoy)

    } catch {
      alert('❌ Error al guardar')
    }
  }

  // ⏳ LOADING
  if (loading) {
    return <div style={styles.page}>Cargando...</div>
  }

  // 🚨 BLOQUEO TOTAL
  if (bloqueado) {
    return (
      <div style={styles.page}>
        <h2 style={styles.title}>⚠️</h2>
        <p style={{ textAlign: 'center' }}>
          No se capturó la producción de ayer <br />
          Acudir directamente con el programador del sistema
        </p>
      </div>
    )
  }

  return (
    <div style={styles.page}>
      
      <h2 style={styles.title}>PRODUCCIÓN DIARIA</h2>

      <div style={styles.top}>
        <label>Fecha:</label>
        <input
          type="date"
          value={fecha}
          disabled // 🔥 BLOQUEADO
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
// 🎨 ESTILOS (NO TOCADOS)
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
