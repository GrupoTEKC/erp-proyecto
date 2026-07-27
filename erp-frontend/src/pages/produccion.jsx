import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/TRANSPARENTE.png'

const API = 'https://erp-proyecto-production.up.railway.app'

function Produccion() {
  const navigate = useNavigate()

  // 1. Definimos la constante de fecha Mexico al inicio
  const hoyMexico = new Date().toLocaleDateString('en-CA', {
    timeZone: 'America/Mexico_City'
  })
  const hoy = hoyMexico

  // 2. Estados para el Consultor de Salidas
  const [fechaSalidaInicio, setFechaSalidaInicio] = useState(hoyMexico)
  const [fechaSalidaFin, setFechaSalidaFin] = useState(hoyMexico)
  const [salidasReporte, setSalidasReporte] = useState([])

  // 3. Estados principales de Producción
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

  // 4. Función de consulta de Salidas BLINDADA
  const consultarSalidas = async () => {
    try {
      const res = await fetch(`${API}/pedidos/salidas?fechaInicio=${fechaSalidaInicio}&fechaFin=${fechaSalidaFin}`)
      const data = await res.json()
      if (!Array.isArray(data)) {
        setSalidasReporte([])
        return
      }
      setSalidasReporte(data)
    } catch (err) {
      console.error('Error al consultar salidas:', err)
      setSalidasReporte([])
    }
  }

  // 5. Estados del Reporte de Producción
  const [mesSeleccionado, setMesSeleccionado] = useState(
    String(new Date().getMonth() + 1).padStart(2, '0')
  )
  const [reporte, setReporte] = useState([])
  const [totalReporte, setTotalReporte] = useState(0)

  const [fechaInicio, setFechaInicio] = useState(
    hoyMexico.slice(0, 7) + '-01'
  )
  const [fechaFin, setFechaFin] = useState(hoyMexico)
  const [productoReporte, setProductoReporte] = useState([])

  // 6. Configuración de Calendario e Inicializaciones
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

      setBloqueado(val.faltaAyer)

      await cargarCalendario()
      if (!val.faltaAyer) {
        await cargarDatos()
        await cargarStock()
        await consultarReporte()
        await consultarSalidas()
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
    } catch (err) {
      console.error('Error stock', err)
    }
  }

  const validarInventarioMes = async () => {
    try {
      const res = await fetch(`${API}/inventario-inicial/${periodoActual}`)
      const data = await res.json()
      const existe = Array.isArray(data) && data.some(item => Number(item.cantidad) > 0)
      setInventarioCapturado(existe)
    } catch (err) {
      console.error('Error validando inventario', err)
    }
  }

  const cargarCalendario = async () => {
    try {
      const res = await fetch(`${API}/produccion/calendario-anual?anio=${anioActual}`)
      const data = await res.json()
      if (!res.ok || typeof data !== 'object' || Array.isArray(data)) {
        console.error('Calendario inválido:', data)
        setCalendario({})
        return
      }
      setCalendario(data)
    } catch (err) {
      console.error('Error calendario', err)
    }
  }

  const consultarReporte = async () => {
    try {
      const productosSeleccionados = productoReporte.length === 0 ? 'todos' : productoReporte.join(',')
      const res = await fetch(`${API}/produccion/reporte?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}&idProducto=${productosSeleccionados}`)
      const data = await res.json()
      if (!Array.isArray(data)) {
        setReporte([])
        setTotalReporte(0)
        return
      }
      setReporte(data)
      const total = data.reduce((sum, item) => sum + Number(item.cantidad || 0), 0)
      setTotalReporte(total)
    } catch (err) {
      console.error(err)
    }
  }

  const fechaBonita = (fechaStr) => {
    if (!fechaStr) return 'N/A'
    const [anio, mes, dia] = fechaStr.slice(0, 10).split('-')
    const meses = ['enero','febrero','marzo','abril','mayo','junio', 'julio','agosto','septiembre','octubre','noviembre','diciembre']
    return `${Number(dia)} de ${meses[Number(mes) - 1]} de ${anio}`
  }

  const exportarExcel = () => {
    const encabezados = ['Fecha', 'Producto', 'Cantidad']
    const filas = reporte.map(r => [fechaBonita(r.fecha), r.nombre, r.cantidad])
    const csv = [encabezados.join(','), ...filas.map(f => f.join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'produccion.csv'
    link.click()
    URL.revokeObjectURL(url)
  }

  const filtrados = productos.filter(p => p.nombre.toLowerCase().includes(busqueda.toLowerCase()))
  const filtradosInv = productos.filter(p => p.nombre.toLowerCase().includes(busquedaInv.toLowerCase()))

  const agregarProducto = (producto) => {
    const existe = seleccionados.find(p => p.id_producto === producto.id_producto)
    if (existe) return
    setSeleccionados([...seleccionados, { ...producto, producido: '' }])
    setBusqueda('')
  }

  const agregarProductoInv = (producto) => {
    const existe = invSeleccionados.find(p => p.id_producto === producto.id_producto)
    if (existe) {
      setBusquedaInv('')
      return
    }
    setInvSeleccionados([...invSeleccionados, { ...producto, cantidad: '' }])
    setBusquedaInv('')
  }

  const handleCantidad = (index, value) => {
    const nuevos = [...seleccionados]
    nuevos[index].producido = value
    setSeleccionados(nuevos)
  }

  const handleCantidadInv = (index, value) => {
    const nuevos = [...invSeleccionados]
    nuevos[index].cantidad = value
    setInvSeleccionados(nuevos)
  }

  const guardar = async () => {
    try {
      const datos = seleccionados.map(p => ({ id_producto: p.id_producto, cantidad: Number(p.producido) || 0 }))
      const res = await fetch(`${API}/produccion`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ datos, rol: 'supervisor', fecha })
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
      const datos = invSeleccionados.map(p => ({ id_producto: p.id_producto, cantidad: Number(p.cantidad) || 0 }))
      const res = await fetch(`${API}/inventario-inicial`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ datos, periodo: periodoActual })
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
    } catch {
      alert('❌ Error al guardar inventario')
    }
  }

  if (loading) return <div style={{ padding: 20 }}>Cargando módulo de producción...</div>

  return (
    <div style={styles.container}>
      <button style={styles.back} onClick={() => window.history.back()}>
        Volver
      </button>

      <div style={styles.header}>
        <img src={logo} alt="logo" style={styles.logo} />
        <h1 style={styles.mainTitle}>MÓDULO DE PRODUCCIÓN</h1>
      </div>

      {/* 📅 CALENDARIO */}
      <div style={{ marginBottom: 30 }}>
        <div style={{ display: 'flex', gap: 10, overflowX: 'auto', marginBottom: 15 }}>
          {['01','02','03','04','05','06','07','08','09','10','11','12'].map(m => (
            <button
              key={m}
              onClick={() => setMesSeleccionado(m)}
              style={{
                padding: '8px 12px',
                borderRadius: 6,
                border: 'none',
                cursor: 'pointer',
                background: mesSeleccionado === m ? '#8B1E1E' : '#eee',
                color: mesSeleccionado === m ? '#fff' : '#333',
                fontWeight: 'bold'
              }}
            >
              {new Date(2026, Number(m) - 1, 1).toLocaleString('es-MX', { month: 'long' })}
            </button>
          ))}
        </div>

        <div style={styles.calendarGrid}>
          {['L','M','M','J','V','S','D'].map((d, i) => (
            <div key={i} style={styles.calHeader}>{d}</div>
          ))}

          {Array.from({ length: offset }).map((_, i) => (
            <div key={`blank-${i}`} style={styles.calBlank} />
          ))}

          {diasMes.map(d => (
            <div
              key={d.fecha}
              style={{
                ...styles.calDay,
                background: d.capyuro ? '#d4edda' : '#f8d7da',
                border: d.fecha === hoy ? '2px solid #8B1E1E' : '1px solid #ccc'
              }}
            >
              <span>{d.fecha.slice(8, 10)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 📊 CONSULTA TU PRODUCCIÓN */}
      <h2 style={{ ...styles.title, marginTop: 30 }}>CONSULTA TU PRODUCCIÓN</h2>

      <div style={{ display: 'flex', gap: 15, flexWrap: 'wrap', alignItems: 'end', marginBottom: 20 }}>
        <div>
          <label style={styles.filtroLabel}>Fecha inicial</label>
          <br />
          <input
            type="date"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
            style={{ padding: 8, border: '1px solid #ccc', borderRadius: 6, fontWeight: 'bold' }}
          />
        </div>

        <div>
          <label style={styles.filtroLabel}>Fecha final</label>
          <br />
          <input
            type="date"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
            style={{ padding: 8, border: '1px solid #ccc', borderRadius: 6, fontWeight: 'bold' }}
          />
        </div>

        <div>
          <label style={styles.filtroLabel}>Seleccionar productos</label>
          <br />
          <details style={{ minWidth: 250 }}>
            <summary style={{ padding: 8, border: '1px solid #ccc', borderRadius: 6, cursor: 'pointer', background: '#fff' }}>
              Seleccionar productos
            </summary>
            <div style={{ border: '1px solid #ccc', maxHeight: 200, overflowY: 'auto', padding: 10, background: '#fff' }}>
              {productos.map(p => (
                <label key={p.id_producto} style={{ display: 'block', marginBottom: 5 }}>
                  <input
                    type="checkbox"
                    checked={productoReporte.includes(String(p.id_producto))}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setProductoReporte([...productoReporte, String(p.id_producto)])
                      } else {
                        setProductoReporte(productoReporte.filter(id => id !== String(p.id_producto)))
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

        <button style={styles.save} onClick={consultarReporte}>
          CONSULTAR
        </button>

        <button style={styles.save} onClick={exportarExcel}>
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
                backgroundColor: i % 2 === 0 ? '#ffffff' : '#fafafa',
                borderBottom: '1px solid #ececec'
              }}
            >
              <td style={styles.td}>{fechaBonita(r.fecha)}</td>
              <td style={styles.td}>{r.nombre}</td>
              <td style={styles.td}>{r.cantidad}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr style={{ background: '#8B1E1E', color: '#fff', fontWeight: 'bold' }}>
            <td colSpan="2" style={styles.td}>TOTAL</td>
            <td style={{ ...styles.td, textAlign: 'center' }}>{totalReporte}</td>
          </tr>
        </tfoot>
      </table>

      <div style={{ marginTop: 20, background: '#fff3cd', border: '1px solid #ffe69c', color: '#664d03', padding: '12px 15px', borderRadius: 8, marginBottom: 20, fontSize: 15, lineHeight: 1.5 }}>
        ⚠️ Solo cuando aparezca el mensaje <strong>"Producción guardada correctamente en el servidor"</strong> la captura queda registrada en el sistema. Si aparece un error o se pierde la conexión, la producción no se considera guardada.
      </div>

      {/* 🚚 CONSULTA DE SALIDAS (PEDIDOS ENTREGADOS) */}
      <h2 style={{ ...styles.title, marginTop: 40 }}>CONSULTA DE SALIDAS</h2>

      <div style={{ display: 'flex', gap: 15, flexWrap: 'wrap', alignItems: 'end', marginBottom: 20 }}>
        <div>
          <label style={styles.filtroLabel}>Fecha inicial (Salida)</label>
          <br />
          <input
            type="date"
            value={fechaSalidaInicio}
            onChange={(e) => setFechaSalidaInicio(e.target.value)}
            style={{ padding: 8, border: '1px solid #ccc', borderRadius: 6, fontWeight: 'bold' }}
          />
        </div>

        <div>
          <label style={styles.filtroLabel}>Fecha final (Salida)</label>
          <br />
          <input
            type="date"
            value={fechaSalidaFin}
            onChange={(e) => setFechaSalidaFin(e.target.value)}
            style={{ padding: 8, border: '1px solid #ccc', borderRadius: 6, fontWeight: 'bold' }}
          />
        </div>

        <button style={styles.save} onClick={consultarSalidas}>
          CONSULTAR SALIDAS
        </button>
      </div>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Fecha Salida</th>
            <th style={styles.th}>Nº Pedido</th>
            <th style={styles.th}>Cliente</th>
            <th style={styles.th}>Tienda</th>
            <th style={styles.th}>Productos / Cantidad Entregada</th>
            <th style={styles.th}>Municipio</th>
          </tr>
        </thead>
        <tbody>
          {(!salidasReporte || !Array.isArray(salidasReporte) || salidasReporte.length === 0) ? (
            <tr>
              <td colSpan="6" style={{ ...styles.td, textAlign: 'center', color: '#666', padding: '15px' }}>
                No hay salidas registradas para las fechas seleccionadas. Presiona "CONSULTAR SALIDAS".
              </td>
            </tr>
          ) : (
            salidasReporte.map((item, idx) => {
              let prods = []
              try {
                if (typeof item.productos === 'string') {
                  prods = JSON.parse(item.productos)
                } else if (Array.isArray(item.productos)) {
                  prods = item.productos
                }
              } catch (e) {
                prods = []
              }

              return (
                <tr key={item.id_pedido || idx}>
                  <td style={styles.td}>
                    {item.fecha_salida
                      ? new Date(item.fecha_salida + 'T00:00:00').toLocaleDateString('es-MX', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })
                      : 'N/A'}
                  </td>
                  <td style={{ ...styles.td, fontWeight: 'bold' }}>#{item.id_pedido}</td>
                  <td style={{ ...styles.td, textAlign: 'left' }}>{item.cliente || 'N/A'}</td>
                  <td style={{ ...styles.td, textAlign: 'left' }}>{item.tienda || 'N/A'}</td>
                  <td style={{ ...styles.td, textAlign: 'left' }}>
                    {Array.isArray(prods) && prods.length > 0 ? (
                      prods.map((p, pIdx) => (
                        <div key={pIdx} style={{ marginBottom: 2 }}>
                          • <strong>{p.producto || p.nombre}</strong>: {p.cantidad}
                        </div>
                      ))
                    ) : (
                      <span>Sin detalle</span>
                    )}
                  </td>
                  <td style={styles.td}>{item.municipio || 'N/A'}</td>
                </tr>
              )
            })
          )}
        </tbody>
        {Array.isArray(salidasReporte) && salidasReporte.length > 0 && (
          <tfoot>
            <tr style={{ fontWeight: 'bold', backgroundColor: '#f0f0f0' }}>
              <td colSpan="4" style={{ ...styles.td, textAlign: 'right' }}>TOTAL ENTREGADO:</td>
              <td style={{ ...styles.td, textAlign: 'left' }}>
                {salidasReporte.reduce((acc, item) => {
                  let prods = []
                  try {
                    if (typeof item.productos === 'string') {
                      prods = JSON.parse(item.productos)
                    } else if (Array.isArray(item.productos)) {
                      prods = item.productos
                    }
                  } catch (e) {
                    prods = []
                  }
                  const sub = Array.isArray(prods) ? prods.reduce((s, p) => s + (Number(p.cantidad) || 0), 0) : 0
                  return acc + sub
                }, 0)}{' '}
                unidades
              </td>
              <td style={styles.td}></td>
            </tr>
          </tfoot>
        )}
      </table>

      {/* 🏗️ PRODUCCIÓN DIARIA */}
      <h2 style={{ ...styles.title, marginTop: 40 }}>PRODUCCIÓN DIARIA</h2>

      <div style={styles.top}>
        <label style={styles.filtroLabel}>Fecha:</label>
        <input
          type="date"
          value={fecha}
          disabled
          style={{ fontWeight: 'bold', fontSize: 16, padding: 6, borderRadius: 6, border: '1px solid #ccc' }}
        />
      </div>

      <input
        placeholder="Buscar producto..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        style={{ ...styles.input, marginBottom: 10, padding: 8, width: '100%', borderRadius: 6, border: '1px solid #ccc' }}
      />

      <div style={{ maxHeight: 150, overflow: 'auto', marginBottom: 20, border: '1px solid #ccc', borderRadius: 6 }}>
        {filtrados.map(p => (
          <div
            key={p.id_producto}
            onClick={() => agregarProducto(p)}
            style={{ padding: 8, borderBottom: '1px solid #ddd', cursor: 'pointer' }}
          >
            {p.nombre}
          </div>
        ))}
      </div>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Producto</th>
            <th style={styles.th}>Cantidad</th>
          </tr>
        </thead>
        <tbody>
          {seleccionados.map((p, i) => (
            <tr key={p.id_producto}>
              <td style={styles.td}>{p.nombre}</td>
              <td style={styles.td}>
                <input
                  type="number"
                  value={p.producido}
                  onChange={(e) => handleCantidad(i, e.target.value)}
                  style={{ ...styles.input, padding: 6, width: '100px' }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: 20, textAlign: 'right' }}>
        <button style={styles.save} onClick={guardar}>
          Guardar Producción
        </button>
      </div>
    </div>
  )
}

const styles = {
  container: { padding: 20, fontFamily: 'Arial, sans-serif' },
  back: { padding: '8px 16px', background: '#ccc', border: 'none', borderRadius: 4, cursor: 'pointer', marginBottom: 15 },
  header: { display: 'flex', alignItems: 'center', gap: 15, marginBottom: 20 },
  logo: { height: 50 },
  mainTitle: { fontSize: 24, margin: 0, color: '#333' },
  title: { fontSize: 20, color: '#8B1E1E', marginBottom: 15 },
  filtroLabel: { fontWeight: 'bold', fontSize: 14, color: '#333' },
  save: { padding: '9px 18px', background: '#8B1E1E', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 'bold' },
  table: { width: '100%', borderCollapse: 'collapse', marginBottom: 20 },
  th: { background: '#8B1E1E', color: '#fff', padding: 10, textAlign: 'center', border: '1px solid #ddd' },
  td: { padding: 10, border: '1px solid #ddd', textAlign: 'center' },
  input: { padding: 6, borderRadius: 4, border: '1px solid #ccc' },
  calendarGrid: { display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 5, maxWidth: 500 },
  calHeader: { textAlign: 'center', fontWeight: 'bold', padding: 5, background: '#eee' },
  calBlank: { background: '#f9f9f9' },
  calDay: { padding: 10, textAlign: 'center', borderRadius: 4, fontSize: 12 }
}

export default Produccion
