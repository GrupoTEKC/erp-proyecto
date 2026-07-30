import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/TRANSPARENTE.png'


const API = 'https://erp-proyecto-production.up.railway.app'

function Produccion() {
  const navigate = useNavigate()
  const hoy = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Mexico_City' })
  const [productos, setProductos] = useState([])
  const [seleccionados, setSeleccionados] = useState([])
  const [busqueda, setBusqueda] = useState('')
  const [fecha, setFecha] = useState(hoy)
  const [periodoActual] = useState(hoy.slice(0, 7))
  const [bloqueado, setBloqueado] = useState(false)
  const [loading, setLoading] = useState(true)
  const [stock, setStock] = useState([])
  const [invSeleccionados, setInvSeleccionados] = useState([])
  const [busquedaInv, setBusquedaInv] = useState('')
  const [inventarioCapturado, setInventarioCapturado] = useState(false)
  const [calendario, setCalendario] = useState({})

  // 🚚 CONSULTOR DE SALIDAS
  const [fechaSalidaInicio, setFechaSalidaInicio] = useState(hoy)
  const [fechaSalidaFin, setFechaSalidaFin] = useState(hoy)
  const [salidasReporte, setSalidasReporte] = useState([])
  const [cargandoSalidas, setCargandoSalidas] = useState(false)

  const consultarSalidas = async () => {
    try {
      setCargandoSalidas(true)
      const res = await fetch(`${API}/pedidos/salidas?fechaInicio=${fechaSalidaInicio}&fechaFin=${fechaSalidaFin}`)
      const data = await res.json()
      if (Array.isArray(data)) {
        setSalidasReporte(data)
      } else {
        setSalidasReporte([])
      }
    } catch (err) {
      console.error('Error al consultar salidas:', err)
      setSalidasReporte([])
    } finally {
      setCargandoSalidas(false)
    }
  }

  // REPORTE DE PRODUCCIÓN
  const [mesSeleccionado, setMesSeleccionado] = useState(
    String(new Date().getMonth() + 1).padStart(2, '0')
  )
  const [reporte, setReporte] = useState([])
  const [totalReporte, setTotalReporte] = useState(0)

  const hoyMexico = hoy

  const [fechaInicio, setFechaInicio] = useState(
    hoyMexico.slice(0, 7) + '-01'
  )
  const [fechaFin, setFechaFin] = useState(hoyMexico)
  const [productoReporte, setProductoReporte] = useState([])

  const anioActual = new Date().getFullYear()

  const diasMes = (calendario[mesSeleccionado] || [])
    .slice()
    .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))

  const primerDiaReal = new Date(anioActual, Number(mesSeleccionado) - 1, 1).getDay()

  const offset = (primerDiaReal + 6) % 7
  
  useEffect(() => {
    init()
  }, [])

  useEffect(() => {
  if (!bloqueado) {
    cargarDatos()
  }
}, [fecha])
  
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
  await consultarReporte()
  await validarInventarioMes()
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

const validarInventarioMes = async () => {
  try {
    const res = await fetch(
      `${API}/inventario-inicial/${periodoActual}`
    )

    const data = await res.json()

    const existe = data.some(item => Number(item.cantidad) > 0)

    setInventarioCapturado(existe)
  } catch (err) {
    console.error('Error validando inventario', err)
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

 const consultarReporte = async () => {
  try {

    const productosSeleccionados =
      productoReporte.length === 0
        ? 'todos'
        : productoReporte.join(',')

    const res = await fetch(
      `${API}/produccion/reporte?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}&idProducto=${productosSeleccionados}`
    )

    const data = await res.json()

    if (!Array.isArray(data)) {
      setReporte([])
      setTotalReporte(0)
      return
    }

    setReporte(data)

    const total = data.reduce(
      (sum, item) => sum + Number(item.cantidad || 0),
      0
    )

    setTotalReporte(total)

  } catch (err) {
    console.error(err)
  }
}

  const fechaBonita = (fecha) => {
  const [anio, mes, dia] = fecha.slice(0, 10).split('-')

  const meses = [
    'enero','febrero','marzo','abril','mayo','junio',
    'julio','agosto','septiembre','octubre','noviembre','diciembre'
  ]

  return `${Number(dia)} de ${meses[Number(mes) - 1]} de ${anio}`
}
  
  const exportarExcel = () => {
  const encabezados = ['Fecha', 'Producto', 'Cantidad']

  const filas = reporte.map(r => [
    fechaBonita(r.fecha),
    r.nombre,
    r.cantidad
  ])

  const csv = [
    encabezados.join(','),
    ...filas.map(f => f.join(','))
  ].join('\n')

  const blob = new Blob([csv], {
    type: 'text/csv;charset=utf-8;'
  })

  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = 'produccion.csv'
  link.click()

  URL.revokeObjectURL(url)
}
  
  // 🔍 FILTRO
  const filtrados = productos.filter(p =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  )
 const filtradosInv = productos.filter(p =>
  p.nombre.toLowerCase().includes(busquedaInv.toLowerCase())
)
  // ➕ AGREGAR PRODUCTO
const agregarProducto = (producto) => {
  const existe = seleccionados.find(
    p => p.id_producto === producto.id_producto
  )

  if (existe) return

  setSeleccionados([
    ...seleccionados,
    {
      ...producto,
      producido: ''
    }
  ])

  setBusqueda('')
}
const agregarProductoInv = (producto) => {
  const existe = invSeleccionados.find(
    p => p.id_producto === producto.id_producto
  )

  if (existe) {
    setBusquedaInv('')
    return
  }

  setInvSeleccionados([
    ...invSeleccionados,
    {
      ...producto,
      cantidad: ''
    }
  ])

  setBusquedaInv('')
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
      datos,
      rol: 'supervisor',
      fecha
      })
    })

    const data = await res.json()

    if (!res.ok) {
      alert(data.error || 'Error al guardar')
      return
    }

    alert('✅ Producción guardada correctamente en el servidor') 
    setSeleccionados([])

    await cargarDatos()
    await cargarStock()
    await consultarReporte()

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
      periodo: periodoActual
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
await cargarDatos()
await validarInventarioMes()
    
    
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

        <div style={{ marginBottom: 30 }}>

  {/* 🔽 SELECTOR DE MES */}
  <select
    value={mesSeleccionado}
    onChange={(e) => setMesSeleccionado(e.target.value)}
    style={{ padding: 8, marginBottom: 10 }}
  >
    {Object.keys(calendario).map(m => (
      <option key={m} value={m}>
        {new Date(anioActual, m - 1).toLocaleString('es-MX', { month: 'long' })} {anioActual}
      </option>
    ))}
  </select>

  {/* 📅 TITULO */}
  <h3 style={{ textTransform: 'capitalize' }}>
    {new Date(anioActual, mesSeleccionado - 1).toLocaleString('es-MX', { month: 'long' })} {anioActual}
  </h3>

  {/* 📅 CALENDARIO */}
  <div style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 40px)',
    gap: 5,
    marginTop: 10
  }}>

    {/* DÍAS */}
 {['L','M','M','J','V','S','D'].map(d => (
      <div key={d} style={{ fontWeight: 'bold', textAlign: 'center' }}>
        {d}
      </div>
    ))}

    {/* ESPACIOS VACÍOS */}
{Array.from({ length: offset }).map((_, i) => (
  <div key={'vacio-' + i}></div>
))}
  
  {/* DÍAS DEL MES */}
{diasMes.map(d => (
    <div
    key={d.fecha}
    title={d.fecha}
    onClick={() => setFecha(d.fecha)}
    style={{
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: d.capturado ? '#16a34a' : '#dc2626',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    fontWeight: 'bold',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
    border: fecha === d.fecha ? '3px solid #000' : 'none'
  }}
>
        {d.dia}
      </div>
    ))}

  </div>
</div>
</div>


<h2 style={{ ...styles.title, marginTop: 30 }}>
  CONSULTA TU PRODUCCIÓN
</h2>

<div
  style={{
    display: 'flex',
    gap: 15,
    flexWrap: 'wrap',
    alignItems: 'end',
    marginBottom: 20
  }}
>

  <div>
  <label style={styles.filtroLabel}>
    Fecha inicial
  </label>
    
    <br />
    <input
  type="date"
  value={fechaInicio}
  onChange={(e) => setFechaInicio(e.target.value)}
  style={{
    padding: 8,
    border: '1px solid #ccc',
    borderRadius: 6,
    fontWeight: 'bold'
  }}
/>
  </div>

  <div>
  <label style={styles.filtroLabel}>
  Fecha final
  </label>
    <br />
   <input
  type="date"
  value={fechaFin}
  onChange={(e) => setFechaFin(e.target.value)}
  style={{
    padding: 8,
    border: '1px solid #ccc',
    borderRadius: 6,
    fontWeight: 'bold'
  }}
/>
  </div>

  <div>
    <label style={styles.filtroLabel}>
    Seleccionar productos
    </label>
    <br />

<details style={{ minWidth: 250 }}>
  <summary
    style={{
      padding: 8,
      border: '1px solid #ccc',
      borderRadius: 6,
      cursor: 'pointer',
      background: '#fff'
    }}
  >
    Seleccionar productos 
  </summary>

  <div
    style={{
      border: '1px solid #ccc',
      maxHeight: 200,
      overflowY: 'auto',
      padding: 10,
      background: '#fff'
    }}
  >
    {productos.map(p => (
      <label
        key={p.id_producto}
        style={{
          display: 'block',
          marginBottom: 5
        }}
      >
        <input
          type="checkbox"
          checked={productoReporte.includes(
            String(p.id_producto)
          )}
          onChange={(e) => {
            if (e.target.checked) {
              setProductoReporte([
                ...productoReporte,
                String(p.id_producto)
              ])
            } else {
              setProductoReporte(
                productoReporte.filter(
                  id => id !== String(p.id_producto)
                )
              )
            }
          }}
        />
        {' '}
        {p.nombre}
      </label>
    ))}
  </div>
</details>
    </div>

  <button
    style={styles.save}
    onClick={consultarReporte}
  >
    CONSULTAR
  </button>

  <button
  style={styles.save}
  onClick={exportarExcel}
>
  DESCARGAR EXCEL
</button>
  
</div>

      <table style={styles.table}>
  <thead>
    <tr>
     <th style={styles.th}>Fecha</th>
     <th style={styles.th}>Producto</th>
     <th style={styles.th}>Cantidad</th>
    </tr>
  </thead>

 <tbody>
  {reporte.map((r, i) => (
  <tr
  key={i}
  style={{
    backgroundColor:
      i % 2 === 0
        ? '#ffffff'
        : '#fafafa',
    borderBottom: '1px solid #ececec'
  }}
>
      <td style={styles.td}>
      {fechaBonita(r.fecha)}
      </td>
      <td style={styles.td}>{r.nombre}</td>
      <td style={styles.td}>{r.cantidad}</td>
    </tr>
  ))}
</tbody>

<tfoot>
  <tr
    style={{
      background: '#8B1E1E',
      color: '#fff',
      fontWeight: 'bold'
    }}
  >
    <td colSpan="2">
      TOTAL
    </td>
    <td style={{ textAlign: 'center' }}>
    {totalReporte}
    </td>
  </tr>
</tfoot>
</table>
      
<div
  style={{
    marginTop: 20,
    background: '#fff3cd',
    border: '1px solid #ffe69c',
    color: '#664d03',
    padding: '12px 15px',
    borderRadius: 8,
    marginBottom: 20,
    fontSize: 15,
    lineHeight: 1.5

    }}
   >
    ⚠️ Solo cuando aparezca el mensaje <strong>"Producción guardada correctamente en el servidor"</strong> la captura queda registrada en el sistema. Si aparece un error o se pierde la conexión, la producción no se considera guardada.
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


      {inventarioCapturado && (
  <div
    style={{
      marginBottom: 15,
      padding: '12px',
      background: '#fff3cd',
      border: '1px solid #ffe69c',
      color: '#856404',
      borderRadius: 6,
      fontWeight: 'bold'
    }}
  >
    ⚠️ El inventario inicial de este mes ya fue capturado. Por favor consulte con el programador antes de realizar cualquier modificación.
  </div>
)}
{busquedaInv.trim() !== '' && (
  <div
    style={{
      maxHeight: 150,
      overflow: 'auto',
      marginBottom: 20,
      border: '1px solid #ccc',
      borderRadius: 6,
      background: '#fff'
    }}
  >
    {filtradosInv.map(p => (
      <div
        key={p.id_producto}
        onClick={() => {
          agregarProductoInv(p)
          setBusquedaInv('')
        }}
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
)}
      

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
            onChange={(e) =>
              handleCantidadInv(i, e.target.value)
            }
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

      {/* 🚚 CONSULTOR DE SALIDAS (PEDIDOS ENTREGADOS) */}
      <div style={{ marginTop: 40, marginBottom: 40, padding: 20, backgroundColor: '#fff', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <h2 style={{ color: '#8B1E1E', fontSize: 20, marginBottom: 15, display: 'flex', alignItems: 'center', gap: 10 }}>
          🚚 CONSULTA DE SALIDAS (ENTREGAS)
        </h2>

        {/* Controles de Filtro */}
        <div style={{ display: 'flex', gap: 15, flexWrap: 'wrap', alignItems: 'flex-end', marginBottom: 20 }}>
          <div>
            <label style={{ fontWeight: 'bold', fontSize: 14, display: 'block', marginBottom: 5 }}>Fecha Inicial:</label>
            <input 
              type="date" 
              value={fechaSalidaInicio} 
              onChange={(e) => setFechaSalidaInicio(e.target.value)} 
              style={{ padding: 8, borderRadius: 6, border: '1px solid #ccc', fontWeight: 'bold' }} 
            />
          </div>

          <div>
            <label style={{ fontWeight: 'bold', fontSize: 14, display: 'block', marginBottom: 5 }}>Fecha Final:</label>
            <input 
              type="date" 
              value={fechaSalidaFin} 
              onChange={(e) => setFechaSalidaFin(e.target.value)} 
              style={{ padding: 8, borderRadius: 6, border: '1px solid #ccc', fontWeight: 'bold' }} 
            />
          </div>

          <button 
            onClick={consultarSalidas}
            disabled={cargandoSalidas}
            style={{ 
              padding: '9px 18px', 
              background: cargandoSalidas ? '#ccc' : '#8B1E1E', 
              color: '#fff', 
              border: 'none', 
              borderRadius: 6, 
              cursor: cargandoSalidas ? 'not-allowed' : 'pointer', 
              fontWeight: 'bold' 
            }}
          >
            {cargandoSalidas ? 'CARGANDO...' : 'CONSULTAR SALIDAS'}
          </button>
        </div>

        {/* Tabla de Resultados */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 10 }}>
            <thead>
            <tr style={{ background: '#8B1E1E', color: '#fff' }}>
            <th style={{ padding: 10, border: '1px solid #ddd' }}>Fecha Salida</th>
            <th style={{ padding: 10, border: '1px solid #ddd' }}>Nº Pedido</th>
            <th style={{ padding: 10, border: '1px solid #ddd' }}>Estado</th> {/* 👈 NUEVA COLUMNA */}
            <th style={{ padding: 10, border: '1px solid #ddd' }}>Cliente</th>
            <th style={{ padding: 10, border: '1px solid #ddd' }}>Tienda</th>
            <th style={{ padding: 10, border: '1px solid #ddd' }}>Productos / Cantidad</th>
            <th style={{ padding: 10, border: '1px solid #ddd' }}>Municipio</th>
            </tr>
            </thead>
          <tbody>
  {salidasReporte.length === 0 ? (
    <tr>
      <td colSpan="7" style={{ padding: 20, textAlign: 'center', color: '#666', border: '1px solid #ddd' }}>
        No hay salidas registradas en las fechas seleccionadas.
      </td>
    </tr>
  ) : (
    salidasReporte.map((item, idx) => {
      let productosLista = [];
      try {
        productosLista = typeof item.productos === 'string' ? JSON.parse(item.productos) : (item.productos || []);
      } catch (e) {
        productosLista = [];
      }
      const fechaLimpia = item.fecha_salida ? item.fecha_salida.split('T')[0] : 'N/A';
      
      // 🎨 Función para definir color e icono del Estado
      const estadoActual = item.estado_pedido || item.estado_entrega || 'pendiente';
      let badgeBg = '#6c757d';
      let estadoTexto = estadoActual.toUpperCase().replace('_', ' ');

      if (estadoActual === 'en_ruta') {
        badgeBg = '#d97706'; // Naranja / Ámbar
      } else if (estadoActual === 'entregado') {
        badgeBg = '#2563eb'; // Azul
      } else if (estadoActual === 'pagado') {
        badgeBg = '#16a34a'; // Verde
      }

      return (
        <tr key={item.id_pedido || idx} style={{ backgroundColor: idx % 2 === 0 ? '#ffffff' : '#fafafa' }}>
          <td style={{ padding: 10, border: '1px solid #ddd', textAlign: 'center', fontWeight: 'bold' }}>
            {fechaLimpia}
          </td>
          <td style={{ padding: 10, border: '1px solid #ddd', textAlign: 'center', fontWeight: 'bold', color: '#071849' }}>
            #{item.id_pedido}
          </td>
          
          {/* 🔹 CELDA CON EL ESTADO ILUSTRADO */}
          <td style={{ padding: 10, border: '1px solid #ddd', textAlign: 'center' }}>
            <span style={{
              backgroundColor: badgeBg,
              color: '#fff',
              padding: '4px 10px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: 'bold',
              display: 'inline-block'
            }}>
              {estadoTexto}
            </span>
          </td>

          <td style={{ padding: 10, border: '1px solid #ddd' }}>{item.cliente || 'N/A'}</td>
          <td style={{ padding: 10, border: '1px solid #ddd' }}>{item.tienda || 'N/A'}</td>
          <td style={{ padding: 10, border: '1px solid #ddd' }}>
            {Array.isArray(productosLista) && productosLista.length > 0 ? (
              productosLista.map((p, pIdx) => (
                <div key={pIdx} style={{ marginBottom: 3 }}>
                  • <strong>{p.producto || p.nombre}</strong>: <span style={{ color: '#8B1E1E', fontWeight: 'bold' }}>{p.cantidad}</span>
                </div>
              ))
            ) : (
              <span>Sin detalles</span>
            )}
          </td>
          <td style={{ padding: 10, border: '1px solid #ddd', textAlign: 'center' }}>{item.municipio || 'N/A'}</td>
        </tr>
      );
    })
  )}
</tbody>
          </table>
        </div>
      </div> 
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

filtroLabel:{
  fontWeight:'700',
  color:'#8B1E1E',
  marginBottom:5,
  display:'block'
},
}

export default Produccion
