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

  // 🧭 ESTADO PARA EL MENÚ SUPERIOR (VISTAS)
  const [vistaActiva, setVistaActiva] = useState('produccion') // 'produccion' | 'rotos'

  // 🔴 ESTADOS PARA EL HISTORIAL DE ROTOS EN PRODUCCIÓN
  const [historialRotos, setHistorialRotos] = useState([])
  const [mesRotos, setMesRotos] = useState("todos")
  const [busquedaDetalleRotos, setBusquedaDetalleRotos] = useState("")
  const [fechaInicioRotos, setFechaInicioRotos] = useState("")
  const [fechaFinRotos, setFechaFinRotos] = useState("")

  // Estados para el Modal y Formulario de Mermas
  const [mostrarModalMerma, setMostrarModalMerma] = useState(false)
  const [mermaForm, setMermaForm] = useState({
    id_producto: '',
    tipo_merma: 'produccion',
    cantidad: '',
    motivo: ''
  })
  const [guardandoMerma, setGuardandoMerma] = useState(false)
  
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

      setBloqueado(val.faltaAyer)

      await cargarCalendario()
      await cargarDatosRotos() // 🔴 Cargar datos de rotos al iniciar
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

  const cargarDatosRotos = async () => {
    try {
      const res = await fetch(`${API}/api/rotos-devueltos/historial`)
      const data = await res.json()
      if (data.success) {
        setHistorialRotos(Array.isArray(data.data) ? data.data : [])
      } else {
        setHistorialRotos([])
      }
    } catch (err) {
      console.error('Error al cargar historial de rotos:', err)
      setHistorialRotos([])
    }
  }

  // 🟢 FUNCIÓN PARA CONFIRMAR INCIDENCIA DE BULTOS ROTOS
  const confirmarIncidenciaRoto = async (id) => {
    try {
      const res = await fetch(`${API}/api/rotos-devueltos/confirmar/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
      })
      const data = await res.json()

      if (res.ok && data.success) {
        // Actualizar el estado localmente para reflejar el cambio al instante
        setHistorialRotos(prev => prev.map(item => {
          if (item.id === id) {
            return {
              ...item,
              estatus: 'CONFIRMADO',
              fecha_confirmacion: data.fecha_confirmacion || new Date().toISOString()
            }
          }
          return item
        }))
      } else {
        alert(data.error || 'Error al confirmar la incidencia.')
      }
    } catch (err) {
      console.error('Error al confirmar incidencia:', err)
      alert('Error de conexión con el servidor.')
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
  
  // 🔍 FILTROS CORREGIDOS
  const filtrados = productos.filter(p =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  )

  const filtradosInv = stock.filter(p =>
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

 const handleGuardarMerma = async (e) => {
  e.preventDefault()

  if (!mermaForm.id_producto || !mermaForm.cantidad || Number(mermaForm.cantidad) <= 0) {
    alert('Por favor selecciona un producto e ingresa una cantidad válida mayor a 0.')
    return
  }

  if (!mermaForm.motivo || !mermaForm.motivo.trim()) {
    alert('Por favor ingresa el motivo u observación de la merma. Este campo es obligatorio.')
    return
  }

  setGuardandoMerma(true)
  try {
    const res = await fetch(`${API}/mermas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id_producto: Number(mermaForm.id_producto),
        tipo_merma: mermaForm.tipo_merma,
        cantidad: Number(mermaForm.cantidad),
        motivo: mermaForm.motivo.trim()
      })
    })

    const data = await res.json()

    if (res.ok) {
      alert('✅ Merma registrada exitosamente')
      setMermaForm({
        id_producto: '',
        tipo_merma: 'produccion',
        cantidad: '',
        motivo: ''
      })
      setMostrarModalMerma(false)
      
      if (typeof cargarStock === 'function') {
        cargarStock()
      } else {
        window.location.reload()
      }
    } else {
      alert(`❌ Error al guardar merma: ${data.error || 'Error desconocido'}`)
    }
  } catch (err) {
    console.error('Error al guardar merma:', err)
    alert('❌ Ocurrió un error de conexión al guardar la merma.')
  } finally {
    setGuardandoMerma(false)
  }
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

  // 🧮 LÓGICA DE FILTRADO Y RESUMEN PARA LAS TABLAS DE ROTOS
  const rotosFiltradosPorMes = historialRotos.filter(row => {
    if (mesRotos === "todos") return true
    if (!row.fecha_salida) return false
    return row.fecha_salida.startsWith(mesRotos)
  })

  const resumenRotosDinamico = (() => {
    const mapa = {}
    rotosFiltradosPorMes.forEach(item => {
      const prod = item.producto
      if (!mapa[prod]) {
        mapa[prod] = { producto: prod, total_acumulado: 0, foliosSet: new Set() }
      }
      mapa[prod].total_acumulado += Number(item.cantidad_rota || 0)
      mapa[prod].foliosSet.add(item.folio)
    })
    return Object.values(mapa)
      .map(item => ({ ...item, total_folios: item.foliosSet.size }))
      .sort((a, b) => b.total_acumulado - a.total_acumulado)
  })()

  const totalGeneralRotos = resumenRotosDinamico.reduce((acc, curr) => acc + curr.total_acumulado, 0)

  const rotosDetalleFiltrado = historialRotos.filter(row => {
    const textoMatch = `${row.folio || ''} ${row.tienda_cliente || ''}`
      .toLowerCase()
      .includes(busquedaDetalleRotos.toLowerCase())

    if (!textoMatch) return false
    if (!row.fecha_salida) return true

    const fechaItem = new Date(row.fecha_salida)
    if (fechaInicioRotos) {
      const inicio = new Date(fechaInicioRotos + "T00:00:00")
      if (fechaItem < inicio) return false
    }
    if (fechaFinRotos) {
      const fin = new Date(fechaFinRotos + "T23:59:59")
      if (fechaItem > fin) return false
    }
    return true
  })
  
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

      {/* 🧭 MENÚ DE NAVEGACIÓN SUPERIOR ESTILIZADO Y DELGADO */}
      <div style={styles.navBar}>
        <button 
          style={styles.navTab(vistaActiva === 'produccion')}
          onClick={() => setVistaActiva('produccion')}
        >
          📊 Módulo principal
        </button>
        <button 
          style={styles.navTab(vistaActiva === 'rotos')}
          onClick={() => setVistaActiva('rotos')}
        >
          🔴 Historial de bultos rotos
        </button>
      </div>

      {/* ======================================================== */}
      {/* VISTA 1: MÓDULO PRINCIPAL DE PRODUCCIÓN (ORIGINAL) */}
      {/* ======================================================== */}
      {vistaActiva === 'produccion' && (
        <>
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
                  {stock.map(p => (
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

          {/* 🔍 BUSCADOR PRODUCCIÓN */}
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

          {/* 🔍 BUSCADOR INVENTARIO INICIAL */}
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

          <div style={{ marginTop: 40 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h2 style={styles.title}>INVENTARIO ACTUAL / STOCK</h2>
              <button 
                type="button" 
                style={styles.save}
                onClick={() => setMostrarModalMerma(true)}
              >
                + Registrar Merma
              </button>
            </div>

            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Productos</th>
                  <th style={styles.th}>Inv. Inicial</th> 
                  <th style={styles.th}>Producido</th>
                  <th style={styles.th}>Embarcado</th>
                  <th style={styles.th}>Merma en producción</th>
                  <th style={styles.th}>Merma de almacén</th>
                  <th style={styles.th}>Stock</th>
                </tr>
              </thead>
              <tbody>
                {stock.map(p => {
                  const mermaProd = Number(p.merma_produccion || 0)
                  const mermaAlm = Number(p.merma_almacen || 0)
                  const stockFinal = Number(p.inicial || 0) + Number(p.producido || 0) - Number(p.salidas || 0) - mermaAlm
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
                      
                      <td style={styles.td}>{mermaProd}</td>
                      <td style={styles.td}>{mermaAlm}</td>

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

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 10 }}>
                  <thead>
                    <tr style={{ background: '#8B1E1E', color: '#fff' }}>
                      <th style={{ padding: 10, border: '1px solid #ddd' }}>Fecha Salida</th>
                      <th style={{ padding: 10, border: '1px solid #ddd' }}>Nº Pedido</th>
                      <th style={{ padding: 10, border: '1px solid #ddd' }}>Estado</th>
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
                        
                        const estadoActual = item.estado_pedido || item.estado_entrega || 'pendiente';
                        let badgeBg = '#6c757d';
                        let estadoTexto = estadoActual.toUpperCase().replace('_', ' ');

                        if (estadoActual === 'en_ruta') {
                          badgeBg = '#d97706';
                        } else if (estadoActual === 'entregado') {
                          badgeBg = '#2563eb';
                        } else if (estadoActual === 'pagado') {
                          badgeBg = '#16a34a';
                        }

                        return (
                          <tr key={item.id_pedido || idx} style={{ backgroundColor: idx % 2 === 0 ? '#ffffff' : '#fafafa' }}>
                            <td style={{ padding: 10, border: '1px solid #ddd', textAlign: 'center', fontWeight: 'bold' }}>
                              {fechaLimpia}
                            </td>
                            <td style={{ padding: 10, border: '1px solid #ddd', textAlign: 'center', fontWeight: 'bold', color: '#071849' }}>
                              #{item.id_pedido}
                            </td>
                            
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
        </>
      )}

      {/* ======================================================== */}
      {/* VISTA 2: HISTORIAL DE BULTOS ROTOS (LAS DOS TABLAS) */}
      {/* ======================================================== */}
      {vistaActiva === 'rotos' && (
        <div style={{ marginTop: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', flexWrap: 'wrap', gap: '10px' }}>
            <h2 style={{ color: '#8B1E1E', fontSize: '22px', margin: 0 }}>🔴 Resumen de bultos rotos</h2>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <label style={{ fontSize: '14px', fontWeight: 'bold', color: '#444' }}>Filtrar por mes:</label>
              <select 
                value={mesRotos} 
                onChange={e => setMesRotos(e.target.value)}
                style={styles.dateField}
              >
                <option value="todos">📅 Todos los meses</option>
                <option value="2026-10">Octubre 2026</option>
                <option value="2026-09">Septiembre 2026</option>
                <option value="2026-08">Agosto 2026</option>
              </select>
            </div>
          </div>

          {/* TABLA 1: RESUMEN ACUMULADO */}
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Producto</th>
                <th style={styles.th}>Total de rotos por producto</th>
                <th style={styles.th}>Numero de folios afectados</th>
              </tr>
            </thead>
            <tbody>
              {resumenRotosDinamico.length === 0 ? (
                <tr><td colSpan="3" style={{ ...styles.td, textAlign: 'center' }}>No hay registros para este mes.</td></tr>
              ) : (
                resumenRotosDinamico.map((row, idx) => (
                  <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? '#ffffff' : '#fafafa' }}>
                    <td style={{ ...styles.td, textAlign: 'left', fontWeight: 'bold' }}>{row.producto}</td>
                    <td style={{ ...styles.td, color: '#dc3545', fontWeight: 'bold' }}>{row.total_acumulado} pzas</td>
                    <td style={styles.td}>{row.total_folios} folio(s)</td>
                  </tr>
                ))
              )}
            </tbody>
            {resumenRotosDinamico.length > 0 && (
              <tfoot>
                <tr style={{ background: '#f1f3f5', fontWeight: 'bold', color: '#071849' }}>
                  <td style={{ ...styles.td, textAlign: 'right' }}>TOTAL GENERAL:</td>
                  <td style={{ ...styles.td, color: '#dc3545' }}>{totalGeneralRotos} pzas</td>
                  <td style={styles.td}></td>
                </tr>
              </tfoot>
            )}
          </table>

          {/* BARRA DE FILTROS PARA EL DESGLOSE */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginTop: '30px', 
            marginBottom: '10px', 
            flexWrap: 'wrap', 
            gap: '12px',
            backgroundColor: '#f8f9fa',
            padding: '12px 16px',
            borderRadius: '8px',
            border: '1px solid #e9ecef'
          }}>
            <h2 style={{ color: '#8B1E1E', fontSize: '22px', margin: 0 }}>📋 Desglose de incidencias por folio</h2>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <input
                placeholder="Buscar folio o tienda..."
                value={busquedaDetalleRotos}
                onChange={e => setBusquedaDetalleRotos(e.target.value)}
                style={{ ...styles.input, marginTop: 0, maxWidth: '220px' }}
              />
              <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#444' }}>Desde:</span>
              <input
                type="date"
                value={fechaInicioRotos}
                onChange={e => setFechaInicioRotos(e.target.value)}
                style={styles.dateField}
              />
              <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#444' }}>Hasta:</span>
              <input
                type="date"
                value={fechaFinRotos}
                onChange={e => setFechaFinRotos(e.target.value)}
                style={styles.dateField}
              />
            </div>
          </div>

          {/* TABLA 2: DESGLOSE DETALLADO CON LAS NUEVAS COLUMNAS */}
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Folio</th>
                <th style={styles.th}>Tienda</th>
                <th style={styles.th}>Fecha salida</th>
                <th style={styles.th}>Producto</th>
                <th style={styles.th}>Cant. Bultos rotos</th>
                <th style={styles.th}>Estatus</th>
                <th style={styles.th}>Fecha de Confirmación</th>
                <th style={styles.th}>Acción</th>
              </tr>
            </thead>
            <tbody>
              {rotosDetalleFiltrado.length === 0 ? (
                <tr><td colSpan="8" style={{ ...styles.td, textAlign: 'center' }}>Sin movimientos registrados que coincidan con la búsqueda.</td></tr>
              ) : (
                rotosDetalleFiltrado.map((row) => {
                  const estaConfirmado = row.estatus === 'CONFIRMADO';
                  return (
                    <tr key={row.id}>
                      <td style={{ ...styles.td, fontWeight: 'bold' }}>{row.folio}</td>
                      <td style={styles.td}>{row.tienda_cliente}</td>
                      <td style={styles.td}>{new Date(row.fecha_salida).toLocaleString('es-MX')}</td>
                      <td style={styles.td}>{row.producto}</td>
                      <td style={{ ...styles.td, color: '#dc3545', fontWeight: 'bold' }}>{row.cantidad_rota}</td>
                      
                      {/* Estatus */}
                      <td style={styles.td}>
                        <span style={{
                          backgroundColor: estaConfirmado ? '#d4edda' : '#fff3cd',
                          color: estaConfirmado ? '#155724' : '#856404',
                          padding: '4px 8px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: 'bold',
                          display: 'inline-block'
                        }}>
                          {estaConfirmado ? '🟢 Confirmado' : '🟡 Pendiente de confirmar'}
                        </span>
                      </td>

                      {/* Fecha de Confirmación */}
                      <td style={styles.td}>
                        {row.fecha_confirmacion ? new Date(row.fecha_confirmacion).toLocaleString('es-MX') : '—'}
                      </td>

                      {/* Acción (Botón de confirmar o etiqueta OK) */}
                      <td style={styles.td}>
                        {estaConfirmado ? (
                          <span style={{ fontWeight: 'bold', color: '#28a745', fontSize: '14px' }}>✅ OK</span>
                        ) : (
                          <button
                            onClick={() => confirmarIncidenciaRoto(row.id)}
                            style={{
                              backgroundColor: '#28a745',
                              color: '#fff',
                              border: 'none',
                              padding: '6px 12px',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontWeight: 'bold',
                              fontSize: '12px'
                            }}
                          >
                            🟢 Confirmar
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* 🔴 MODAL DE REGISTRO DE MERMA */}
      {mostrarModalMerma && (
        <div style={styles.overlay}>
          <div style={{ ...styles.modal, width: 450, textAlign: 'left' }}>
            <h2 style={{ color: vino, marginBottom: 15 }}>Registrar Merma</h2>

            <form onSubmit={handleGuardarMerma}>
              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: 5 }}>Producto:</label>
                <select
                  value={mermaForm.id_producto}
                  onChange={(e) => setMermaForm({ ...mermaForm, id_producto: e.target.value })}
                  required
                  style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
                >
                  <option value="">-- Selecciona un producto --</option>
                  {stock.map((p) => (
                    <option key={p.id_producto} value={p.id_producto}>
                      {p.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: 5 }}>Tipo de Merma:</label>
                <select
                  value={mermaForm.tipo_merma}
                  onChange={(e) => setMermaForm({ ...mermaForm, tipo_merma: e.target.value })}
                  style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
                >
                  <option value="produccion">Producción</option>
                  <option value="almacen">Almacén</option>
                </select>
              </div>

              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: 5 }}>Cantidad:</label>
                <input
                  type="number"
                  min="1"
                  placeholder="Ej: 10"
                  value={mermaForm.cantidad}
                  onChange={(e) => setMermaForm({ ...mermaForm, cantidad: e.target.value })}
                  required
                  style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
                />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: 5 }}>
                  Motivo / Observación <span style={{ color: 'red' }}>*</span>:
                </label>
                <textarea
                  placeholder="Escribe la causa de la pérdida (obligatorio)..."
                  value={mermaForm.motivo}
                  onChange={(e) => setMermaForm({ ...mermaForm, motivo: e.target.value })}
                  rows="3"
                  required
                  style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <button
                  type="button"
                  onClick={() => setMostrarModalMerma(false)}
                  disabled={guardandoMerma}
                  style={styles.cancel}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={guardandoMerma}
                  style={styles.save}
                >
                  {guardandoMerma ? 'Guardando...' : 'Guardar Merma'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
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
  filtroLabel: {
    fontWeight: '700',
    color: '#8B1E1E',
    marginBottom: 5,
    display: 'block'
  },
  // 🧭 Estilos para el menú superior delgado
  navBar: {
    display: 'flex',
    gap: '8px',
    marginBottom: '20px',
    borderBottom: '1px solid #dee2e6',
    paddingBottom: '8px',
    justifyContent: 'center',
    flexWrap: 'wrap'
  },
  navTab: (activa) => ({
    padding: '6px 14px',
    fontSize: '14px',
    fontWeight: 'bold',
    backgroundColor: activa ? '#8B1E1E' : '#f8f9fa',
    color: activa ? '#fff' : '#495057',
    border: activa ? '1px solid #8B1E1E' : '1px solid #ced4da',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  }),
  dateField: {
    padding: '8px 10px',
    borderRadius: '6px',
    border: '1px solid #8B1E1E',
    fontSize: '13px',
    backgroundColor: '#fff',
    color: '#333'
  }
}

export default Produccion
