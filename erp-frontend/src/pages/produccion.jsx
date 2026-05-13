import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/TRANSPARENTE.png'

const API = 'https://erp-proyecto-production.up.railway.app'

function Produccion() {
  const navigate = useNavigate()
  const hoy = new Date().toISOString().slice(0, 10)

  const [productos, setProductos] = useState([])
  const [seleccionados, setSeleccionados] = useState([])
  const [busqueda, setBusqueda] = useState('')
  const [fecha, setFecha] = useState(hoy)
  const [bloqueado, setBloqueado] = useState(false)
  const [loading, setLoading] = useState(true)
  const [stock, setStock] = useState([])
  
  useEffect(() => {
    init()
  }, [])

 const init = async () => {
  try {
    const resVal = await fetch(`${API}/produccion/validar`)
    const val = await resVal.json()

    if (val.faltaAyer) {
      setBloqueado(true)
      setLoading(false)
      return
    }

    await cargarDatos()
    await cargarStock()

  } catch {
    alert('Error inicial')
  } finally {
    setLoading(false)
  }
}
  const cargarDatos = async () => {
    try {
      const res = await fetch(`${API}/produccion/${fecha}`)
      const data = await res.json()

      if (!res.ok || !Array.isArray(data)) {
        setProductos([])
        return
      }

      setProductos(data)
    } catch {
      alert('Error al cargar producción')
      setProductos([])
    }
  }

  const cargarStock = async () => {
  try {
    const res = await fetch(`${API}/stock`)
    const data = await res.json()
    setStock(data)
  } catch {
    console.error('Error stock')
  }
}
  // 🔍 FILTRO
  const filtrados = productos.filter(p =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  )

  // ➕ AGREGAR PRODUCTO
  const agregarProducto = (producto) => {
    const existe = seleccionados.find(p => p.id_producto === producto.id_producto)
    if (existe) return

    setSeleccionados([
      ...seleccionados,
      { ...producto, producido: '' }
    ])
  }

  // ✏️ CAMBIAR CANTIDAD
  const handleCantidad = (index, value) => {
    const nuevos = [...seleccionados]
    nuevos[index].producido = value
    setSeleccionados(nuevos)
  }

  // 💾 GUARDAR
  const guardar = async () => {
    try {
      const datos = seleccionados.map(p => ({
        id_producto: p.id_producto,
        cantidad: Number(p.producido) || 0
      }))

      const res = await fetch(`${API}/produccion`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          datos: datos,
          rol: 'supervisor'
        })
      })

      const data = await res.json()

      if (!res.ok) {
        alert(data.error || 'Error al guardar')
        return
      }

      alert('✅ Producción guardada')
      setSeleccionados([])
      await cargarDatos()
      await cargarStock()
    } catch {
      alert('❌ Error al guardar')
    }
  }

  // ⚠️ CONFIRMAR
  const confirmarGuardar = () => {
    if (seleccionados.length === 0) {
      alert('No hay productos')
      return
    }

    const ok = window.confirm('¿Seguro que deseas guardar la producción?')
    if (ok) guardar()
  }

  // ⏳ LOADING
  if (loading) {
    return <div style={styles.page}>Cargando...</div>
  }

  // 🚨 BLOQUEO
  if (bloqueado) {
    return (
      <div style={styles.page}>
        <h2 style={styles.title}>⚠️</h2>
        <p style={{ textAlign: 'center' }}>
          No se capturó la producción de ayer <br />
          Acudir con el programador
        </p>
      </div>
    )
  }
  
  return (
    <div style={styles.page}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
  
  <button
    style={styles.cancel}
    onClick={() => navigate('/')}
  >
    Volver
  </button>

  <img src={logo} alt="logo" style={{ height: 50 }} />

</div>

      <h2 style={styles.title}>PRODUCCIÓN DIARIA</h2>

      <div style={styles.top}>
        <label>Fecha:</label>
        <input type="date" value={fecha} disabled />
      </div>

      {/* 🔍 BUSCADOR */}
      <input
        placeholder="Buscar producto..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        style={{ ...styles.input, marginBottom: 10 }}
      />

      <div style={{ maxHeight: 150, overflow: 'auto', marginBottom: 20 }}>
        {filtrados.map(p => (
          <div
            key={p.id_producto}
            onClick={() => agregarProducto(p)}
            style={{
              padding: 8,
              borderBottom: '1px solid #ddd',
              cursor: 'pointer'
            }}
          >
            {p.nombre}
          </div>
        ))}
              </div>

      {/* 📦 TABLA SELECCIONADOS */}
      <table style={styles.table}>
        <thead>
          <tr>
            <th>Producto</th>
            <th>Cantidad</th>
          </tr>
        </thead>
        <tbody>
          {seleccionados.map((p, i) => (
            <tr key={p.id_producto}>
              <td>{p.nombre}</td>
              <td>
                <input
                  type="number"
                  value={p.producido}
                  onChange={(e) => handleCantidad(i, e.target.value)}
                  style={styles.input}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
 <div style={{ marginTop: 20, textAlign: 'right' }}>
  <button style={styles.save} onClick={confirmarGuardar}>
    Guardar Producción
  </button>
</div>
      
<h2 style={{ ...styles.title, marginTop: 40 }}>
  INVENTARIO
</h2>

<table style={styles.table}>
  <thead>
    <tr>
      <th style={styles.th}>Producto</th>
      <th style={styles.th}>Entradas</th>
      <th style={styles.th}>Salidas</th>
      <th style={styles.th}>Stock</th>
    </tr>
  </thead>
  <tbody>
    {stock.map(p => {
      const stockFinal = (p.producido || 0) - (p.salidas || 0)

      return (
        <tr key={p.id_producto}>
          <td style={styles.td}>{p.nombre}</td>
         <td style={styles.td}>{p.producido || 0}</td>
         <td style={styles.td}>{p.salidas || 0}</td>
          <td style={{
            ...styles.td,
            color: stockFinal < 0 ? 'red' : 'black',
            fontWeight: 'bold'
          }}>
            {stockFinal}
          </td>
        </tr>
      )
    })}
  </tbody>
</table>
</div>
  )
}

// 🎨 ESTILOS
const vino = '#8B1E1E'

const styles = {
  page: {
    padding: 20,
    maxWidth: 1200,
    width: '95%',
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
  borderCollapse: 'collapse',
  border: '1px solid #ccc'
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
  }, 
  
th: {
  textAlign: 'center',
  padding: 10,
  border: '1px solid #ccc',
  background: '#f5f5f5'
},
  
td: {
  textAlign: 'center',
  padding: 10,
  border: '1px solid #ccc'
},
}

export default Produccion
