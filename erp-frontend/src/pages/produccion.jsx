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
  const [invSeleccionados, setInvSeleccionados] = useState([])
  const [busquedaInv, setBusquedaInv] = useState('')
  const [calendario, setCalendario] = useState({})
  const anioActual = new Date().getFullYear()
  
  useEffect(() => {
    init()
  }, [])

const init = async () => {
  try {
    const resVal = await fetch(`${API}/produccion/validar`)
    const val = await resVal.json()

    // 🔥 PRIMERO define bloqueo
    setBloqueado(val.faltaAyer)

    await cargarCalendario()
    // 🔥 SOLO si NO está bloqueado carga datos
    if (!val.faltaAyer) {
      await cargarDatos()
      await cargarStock()
    }

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

 const cargarCalendario = async () => {
  try {
    const res = await fetch(`${API}/produccion/calendario-anual?anio=${anioActual}`)
 const data = await res.json()

// 🔥 VALIDACIÓN CRÍTICA
if (!res.ok || typeof data !== 'object' || Array.isArray(data)) {
  console.error('Calendario inválido:', data)
  setCalendario({})
  return
}

setCalendario(data)
    
  } catch {
    console.error('Error calendario')
  }
} 
  // 🔍 FILTRO
  const filtrados = productos.filter(p =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  )
const filtradosInv = stock.filter(p =>
  p.nombre.toLowerCase().includes(busquedaInv.toLowerCase())
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

  const agregarProductoInv = (producto) => {
  const existe = invSeleccionados.find(p => p.id_producto === producto.id_producto)
  if (existe) return

  setInvSeleccionados([
    ...invSeleccionados,
    { ...producto, cantidad: '' }
  ])
}
  
  // ✏️ CAMBIAR CANTIDAD
  const handleCantidad = (index, value) => {
    const nuevos = [...seleccionados]
    nuevos[index].producido = value
    setSeleccionados(nuevos)
  }

  // 👇 AQUÍ VA TU NUEVA FUNCIÓN
const handleCantidadInv = (index, value) => {
  const nuevos = [...invSeleccionados]
  nuevos[index].cantidad = value
  setInvSeleccionados(nuevos)
}

// 💾 GUARDAR PRODUCCIÓN
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
const guardarInventario = async () => {
  try {
    const datos = invSeleccionados.map(p => ({
      id_producto: p.id_producto,
      cantidad: Number(p.cantidad) || 0
    }))

    const res = await fetch(`${API}/inventario-inicial`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
  datos,
  periodo: fecha.slice(0, 7)
})
    })

    const data = await res.json()

    if (!res.ok) {
      alert(data.error || 'Error al guardar inventario')
      return
    }

    alert('✅ Inventario inicial guardado')
    setInvSeleccionados([])
    setBusquedaInv('')
    await cargarStock()

  } catch (error) {
    console.error(error)
    alert('❌ Error al guardar inventario')
  }
}
  
// ⚠️ CONFIRMAR PRODUCCIÓN
const confirmarGuardar = () => {
  if (seleccionados.length === 0) {
    alert('No hay productos')
    return
  }

  const ok = window.confirm('¿Seguro que deseas guardar la producción?')
  if (ok) guardar()
}

// ⚠️ CONFIRMAR INVENTARIO
const confirmarGuardarInv = () => {
  if (invSeleccionados.length === 0) {
    alert('No hay productos')
    return
  }

  const ok = window.confirm('¿Deseas guardar el inventario inicial?')
  if (ok) guardarInventario()
}

// ⏳ LOADING
if (loading) {
  return <div style={styles.page}>Cargando...</div>
}

if (bloqueado) {
  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2 style={{ color: 'red', marginBottom: 10 }}>
          ⚠️ ATENCIÓN
        </h2>

        <p style={{ textAlign: 'center', fontWeight: 'bold' }}>
          LA PRODUCCIÓN DEL DÍA DE AYER NO FUE CAPTURADA
        </p>

        <p style={{ textAlign: 'center' }}>
          ACUDIR CON EL ADMINISTRADOR PARA QUE INGRESE LA PRODUCCIÓN DEL DÍA
        </p>

        <button
          style={styles.modalBtn}
         onClick={init}
        >
          Ir a capturar producción
        </button>
      </div>
    </div>
  )
}
  
  return (
    <div style={styles.page}>
       <div style={styles.header}>
  <button
    style={styles.cancel}
    onClick={() => navigate('/')}
  >
    Volver
  </button>

  <h1 style={styles.mainTitle}>
    MÓDULO DE PRODUCCIÓN
  </h1>

  <img src={logo} alt="logo" style={styles.logo} />
</div>
      <div style={{ marginBottom: 30 }}>
{Object.keys(calendario || {}).map((mes) => (
    <div key={mes} style={{ marginBottom: 10 }}>
      
      <h4 style={{ margin: '5px 0' }}>
        Mes {mes}
      </h4>

      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 5
      }}>
     
        {Array.isArray(calendario[mes]) && calendario[mes].map((diaObj) => (
      
          <div
            key={diaObj.fecha}
            style={{
              width: 25,
              height: 25,
              backgroundColor: diaObj.capturado ? 'green' : 'red',
              borderRadius: 4
            }}
            title={diaObj.fecha}
          />
        ))}
      </div>

    </div>
  ))}
</div>
      
      <h2 style={styles.title}>PRODUCCIÓN DIARIA</h2>

      <div style={styles.top}>
        <label>Fecha:</label>
       <input
  type="date"
  value={fecha}
  disabled
  style={{
    fontWeight: 'bold',
    fontSize: 16,
    padding: 6
  }}
/>
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
  INVENTARIO INICIAL
</h2>

      {/* 🔍 BUSCADOR */}
<input
  placeholder="Buscar producto..."
  value={busquedaInv}
  onChange={(e) => setBusquedaInv(e.target.value)}
  style={{ ...styles.input, marginBottom: 10 }}
/>

<div style={{ maxHeight: 150, overflow: 'auto', marginBottom: 20 }}>
  {filtradosInv.map(p => (
    <div
      key={p.id_producto}
      onClick={() => agregarProductoInv(p)}
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

{/* 📦 TABLA */}
<table style={styles.table}>
  <thead>
    <tr>
      <th>Producto</th>
      <th>Cantidad</th>
    </tr>
  </thead>
  <tbody>
    {invSeleccionados.map((p, i) => (
      <tr key={p.id_producto}>
        <td>{p.nombre}</td>
        <td>
          <input
            type="number"
            value={p.cantidad}
            onChange={(e) => handleCantidadInv(i, e.target.value)}
            style={styles.input}
          />
        </td>
      </tr>
    ))}
  </tbody>
</table>

<div style={{ marginTop: 20, textAlign: 'right' }}>
  <button style={styles.save} onClick={confirmarGuardarInv}>
    Guardar Inventario Inicial
  </button>
</div>

      <h2 style={{ ...styles.title, marginTop: 40 }}>
  INVENTARIO ACTUAL
</h2>

<table style={styles.table}>
  <thead>
  <tr>
    <th style={styles.th}>Producto</th>
    <th style={styles.th}>Inv. Inicial</th> 
    <th style={styles.th}>Entradas</th>
    <th style={styles.th}>Salidas</th>
    <th style={styles.th}>Stock</th>
  </tr>
</thead>
  <tbody>
    {stock.map(p => {
    const stockFinal =
  Number(p.inicial) +
  Number(p.producido) -
  Number(p.salidas)
      return (
        <tr key={p.id_producto}>
       <td style={{
  ...styles.td,
  textAlign: 'left',
  fontWeight: 'bold'
}}>
  {p.nombre}
</td>
         <td style={styles.td}>{p.inicial || 0}</td>
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
  width: '85%',
  margin: '0 auto',
  textAlign: 'left'
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
  border: '1px solid #ccc',
  marginTop: 10
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
  logo: {
  height: 170
},
  mainTitle: {
  color: vino,
  fontSize: 48,
  fontWeight: '900',
  letterSpacing: 2
},
header: {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: 30
},
  overlay: {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0,0,0,0.7)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 9999
},

modal: {
  background: '#fff',
  padding: 30,
  borderRadius: 10,
  width: 400,
  textAlign: 'center',
  boxShadow: '0 0 20px rgba(0,0,0,0.3)'
},

modalBtn: {
  marginTop: 20,
  padding: 10,
  background: '#8B1E1E',
  color: '#fff',
  border: 'none',
  borderRadius: 6,
  cursor: 'pointer'
},
}

export default Produccion
