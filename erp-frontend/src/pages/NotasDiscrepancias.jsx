import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import logo from "../assets/TRANSPARENTE.png"

const API = "https://erp-proyecto-production.up.railway.app"

const styles = {
  page: {
    backgroundColor: '#ffffff',
    minHeight: '100vh',
    padding: '20px',
    fontFamily: 'Arial, sans-serif'
  },
  backTop: {
    padding: '8px 12px',
    fontSize: '13px',
    backgroundColor: '#fff',
    color: '#8B1E1E',
    border: '1px solid #8B1E1E',
    borderRadius: '6px',
    cursor: 'pointer'
  },
  field: {
    width: '100%',
    maxWidth: '300px',
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #8B1E1E',
    marginTop: '5px'
  },
  dateField: {
    padding: '8px 10px',
    borderRadius: '6px',
    border: '1px solid #8B1E1E',
    fontSize: '13px',
    backgroundColor: '#fff',
    color: '#333'
  },
  cardDiscrepancia: {
    border: '1px solid #ddd',
    borderRadius: '6px',
    padding: '16px',
    marginBottom: '12px',
    backgroundColor: '#fff',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
  },
  botonAccion: {
    marginTop: '8px',
    padding: '8px 12px',
    fontSize: '13px',
    backgroundColor: '#8B1E1E',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer'
  },
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(139,30,30,.12)",
    zIndex: 999
  },
  // 🧭 Menú estilizado más delgado y estilizado
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
  tablaContenedor: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '15px',
    backgroundColor: '#fff',
    borderRadius: '6px',
    overflow: 'hidden',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
  },
  thStyle: {
    backgroundColor: '#071849',
    color: '#fff',
    padding: '12px',
    textAlign: 'left',
    fontSize: '14px'
  },
  tdStyle: {
    padding: '10px 12px',
    borderBottom: '1px solid #dee2e6',
    fontSize: '14px',
    color: '#333'
  },
  tfootStyle: {
    backgroundColor: '#f1f3f5',
    fontWeight: 'bold',
    fontSize: '14px',
    color: '#071849'
  }
}

function NotasDiscrepancias() {
  const navigate = useNavigate()
  
  // ESTADO DE PESTAÑAS (VISTAS)
  const [vistaActiva, setVistaActiva] = useState('alertas') // 'alertas' | 'rotos' | 'justificados'

  const [discrepancias, setDiscrepancias] = useState([])
  const [loading, setLoading] = useState(false)
  const [busquedaFolio, setBusquedaFolio] = useState("")

  // ESTADOS PARA HISTORIALES (ROTOS / JUSTIFICADOS)
  const [historialRotos, setHistorialRotos] = useState([])
  const [historialJustificados, setHistorialJustificados] = useState([])

  // ESTADOS PARA FILTROS DE MES EN LOS RESÚMENES
  const [mesRotos, setMesRotos] = useState("todos")
  const [mesJustificados, setMesJustificados] = useState("todos")

  // ESTADOS DE BÚSQUEDA Y FECHAS PARA LAS TABLAS DE DETALLE (ROTOS)
  const [busquedaDetalleRotos, setBusquedaDetalleRotos] = useState("")
  const [fechaInicioRotos, setFechaInicioRotos] = useState("")
  const [fechaFinRotos, setFechaFinRotos] = useState("")

  // ESTADOS DE BÚSQUEDA Y FECHAS PARA LAS TABLAS DE DETALLE (JUSTIFICADOS)
  const [busquedaDetalleJust, setBusquedaDetalleJust] = useState("")
  const [fechaInicioJust, setFechaInicioJust] = useState("")
  const [fechaFinJust, setFechaFinJust] = useState("")

  // ESTADOS PARA EL FILTRO DE FECHAS PERSONALIZADO EN ALERTAS
  const [fechaInicio, setFechaInicio] = useState("2026-08-01")
  const [fechaFin, setFechaFin] = useState("")

  // ESTADOS DEL MODAL DE REVISIÓN
  const [modalAbierto, setModalAbierto] = useState(false)
  const [itemSeleccionado, setItemSeleccionado] = useState(null)
  const [tipoResolucion, setTipoResolucion] = useState('')
  const [passwordAdmin, setPasswordAdmin] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [procesando, setProcesando] = useState(false)

  // Cargar notas con discrepancias desde el backend
  const cargarDiscrepancias = async () => {
    setLoading(true)
    setErrorMsg('')
    try {
      const res = await fetch(`${API}/api/notas-discrepancias`)
      const data = await res.json()
      if (data.success) {
        setDiscrepancias(Array.isArray(data.data) ? data.data : [])
      } else {
        setDiscrepancias([])
      }
    } catch (error) {
      console.error("Error al cargar discrepancias:", error)
      setDiscrepancias([])
    } finally {
      setLoading(false)
    }
  }

  // Cargar datos de historiales completos
  const cargarDatosHistoricos = async () => {
    try {
      const resRotos = await fetch(`${API}/api/rotos-devueltos/historial`)
      const dataRotos = await resRotos.json()
      if (dataRotos.success) setHistorialRotos(dataRotos.data)

      const resJust = await fetch(`${API}/api/justificados-devueltos/historial`)
      const dataJust = await resJust.json()
      if (dataJust.success) setHistorialJustificados(dataJust.data)
    } catch (error) {
      console.error("Error al cargar datos históricos:", error)
    }
  }

  useEffect(() => {
    cargarDiscrepancias()
    cargarDatosHistoricos()
  }, [])

  const abrirModal = (item) => {
    setItemSeleccionado(item)
    setTipoResolucion('')
    setPasswordAdmin('')
    setErrorMsg('')
    setSuccessMsg('')
    setModalAbierto(true)
  }

  const cerrarModal = () => {
    setModalAbierto(false)
    setItemSeleccionado(null)
  }

  // Enviar resolución conectada al endpoint de backend
  const handleResolver = async () => {
    setErrorMsg('')
    setSuccessMsg('')

    if (!tipoResolucion) {
      setErrorMsg('⚠️ Debe seleccionar obligatoriamente una opción (Roto o Justificado).')
      return
    }

    const esExceso = itemSeleccionado.cantidad_final > itemSeleccionado.cantidad_entregada

    if (esExceso && passwordAdmin !== 'ingemt2404_') {
      setErrorMsg('⚠️ Estos productos exceden la cantidad entregada. Debe corregirse desde la base de datos consulte con el programador')
      return
    }

    setProcesando(true)
    try {
      const fechaOriginal = new Date(itemSeleccionado.fecha_salida);
      const fechaMySQL = !isNaN(fechaOriginal.getTime()) 
        ? fechaOriginal.toISOString().slice(0, 19).replace('T', ' ') 
        : itemSeleccionado.fecha_salida;

      const res = await fetch(`${API}/api/notas-discrepancias/resolver`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          folio: itemSeleccionado.folio,
          tienda_cliente: itemSeleccionado.tienda_cliente,
          fecha_salida: fechaMySQL,
          producto: itemSeleccionado.producto,
          cantidad_entregada: itemSeleccionado.cantidad_entregada,
          cantidad_final: itemSeleccionado.cantidad_final,
          tipo_resolucion: tipoResolucion,
          password_admin: passwordAdmin
        })
      })

      const data = await res.json()

      if (!res.ok) {
        setErrorMsg(data.error || "Error al procesar la solicitud.")
        return
      }

      setSuccessMsg(data.message || "Procesado correctamente ✅")
      setTimeout(() => {
        cerrarModal()
        cargarDiscrepancias()
        cargarDatosHistoricos()
      }, 1500)

    } catch (error) {
      console.error("Error:", error)
      setErrorMsg("Error de conexión con el servidor.")
    } finally {
      setProcesando(false)
    }
  }

  // FILTRADO COMBINADO DE ALERTAS
  const discrepanciasFiltradas = discrepancias.filter(item => {
    const cumpleTexto = `${item.folio || ''} ${item.tienda_cliente || ''} ${item.producto || ''}`
      .toLowerCase()
      .includes(busquedaFolio.toLowerCase())

    if (!item.fecha_salida) return false
    const fechaItem = new Date(item.fecha_salida)

    if (fechaInicio) {
      const inicio = new Date(fechaInicio + "T00:00:00")
      if (fechaItem < inicio) return false
    }

    if (fechaFin) {
      const fin = new Date(fechaFin + "T23:59:59")
      if (fechaItem > fin) return false
    }

    return cumpleTexto
  })

  // 🧮 LÓGICA DE FILTRADO POR MES Y AGRUPACIÓN DINÁMICA (ROTOS)
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

  // 🔍 FILTRADO ESPECÍFICO PARA LA TABLA DETALLADA DE ROTOS
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

  // 🧮 LÓGICA DE FILTRADO POR MES Y AGRUPACIÓN DINÁMICA (JUSTIFICADOS)
  const justificadosFiltradosPorMes = historialJustificados.filter(row => {
    if (mesJustificados === "todos") return true
    if (!row.fecha_salida) return false
    return row.fecha_salida.startsWith(mesJustificados)
  })

  const resumenJustificadosDinamico = (() => {
    const mapa = {}
    justificadosFiltradosPorMes.forEach(item => {
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

  const totalGeneralJustificados = resumenJustificadosDinamico.reduce((acc, curr) => acc + curr.total_acumulado, 0)

  // 🔍 FILTRADO ESPECÍFICO PARA LA TABLA DETALLADA DE JUSTIFICADOS
  const justificadosDetalleFiltrado = historialJustificados.filter(row => {
    const textoMatch = `${row.folio || ''} ${row.tienda_cliente || ''}`
      .toLowerCase()
      .includes(busquedaDetalleJust.toLowerCase())

    if (!textoMatch) return false
    if (!row.fecha_salida) return true

    const fechaItem = new Date(row.fecha_salida)
    if (fechaInicioJust) {
      const inicio = new Date(fechaInicioJust + "T00:00:00")
      if (fechaItem < inicio) return false
    }
    if (fechaFinJust) {
      const fin = new Date(fechaFinJust + "T23:59:59")
      if (fechaItem > fin) return false
    }
    return true
  })

  return (
    <div style={styles.page}>
      {/* BOTÓN VOLVER */}
      <button
        style={styles.backTop}
        onClick={() => navigate(-1)}
      >
        ⬅ Volver
      </button>
      
      {/* ENCABEZADO Y LOGO */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: -5,
          marginBottom: 15
        }}
      >
        <img
          src={logo}
          alt="Pegatek"
          style={{
            width: 140,
            objectFit: "contain",
            marginBottom: 6
          }}
        />

        <h1
          style={{
            margin: 0,
            color: "#8B1E1E",
            fontSize: "48px",
            fontWeight: "bold",
            letterSpacing: "1px",
            textAlign: "center"
          }}
        >
          NOTAS CON DIFERENCIAS
        </h1>
      </div>

      {/* 🧭 MENÚ DE NAVEGACIÓN SUPERIOR (PESTAÑAS ESTILIZADAS) */}
      <div style={styles.navBar}>
        <button 
          style={styles.navTab(vistaActiva === 'alertas')}
          onClick={() => setVistaActiva('alertas')}
        >
          🔍 Alertas pendientes
        </button>
        <button 
          style={styles.navTab(vistaActiva === 'rotos')}
          onClick={() => setVistaActiva('rotos')}
        >
          🔴 Historial de rotos
        </button>
        <button 
          style={styles.navTab(vistaActiva === 'justificados')}
          onClick={() => setVistaActiva('justificados')}
        >
          🟡 Historial de justificados
        </button>
      </div>

      {/* ======================================================== */}
      {/* VISTA 1: ALERTAS PENDIENTES */}
      {/* ======================================================== */}
      {vistaActiva === 'alertas' && (
        <>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: '20px', 
            flexWrap: 'wrap', 
            gap: '12px',
            backgroundColor: '#f8f9fa',
            padding: '12px 16px',
            borderRadius: '8px',
            border: '1px solid #e9ecef'
          }}>
            <input
              placeholder="Buscar por folio, tienda o producto..."
              value={busquedaFolio}
              onChange={e => setBusquedaFolio(e.target.value)}
              style={{ ...styles.field, marginTop: 0 }}
            />

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#444' }}>Desde:</span>
              <input
                type="date"
                value={fechaInicio}
                onChange={e => setFechaInicio(e.target.value)}
                style={styles.dateField}
              />

              <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#444' }}>Hasta:</span>
              <input
                type="date"
                value={fechaFin}
                onChange={e => setFechaFin(e.target.value)}
                style={styles.dateField}
              />
            </div>

            <button
              onClick={() => { cargarDiscrepancias(); cargarDatosHistoricos(); }}
              style={{
                ...styles.botonAccion,
                marginTop: 0,
                backgroundColor: '#071849',
                fontWeight: 'bold'
              }}
            >
              🔄 Actualizar
            </button>
          </div>

          {loading ? (
            <p style={{ textAlign: 'center', padding: '20px' }}>Cargando notas con discrepancias...</p>
          ) : discrepanciasFiltradas.length === 0 ? (
            <div style={{ padding: '20px', backgroundColor: '#d4edda', color: '#155724', borderRadius: '6px', textAlign: 'center', fontWeight: 'bold' }}>
              ✅ ¡Excelente! No hay notas con discrepancias que coincidan con los filtros de búsqueda o fechas seleccionados.
            </div>
          ) : (
            discrepanciasFiltradas.map((item, index) => {
              const esExceso = item.cantidad_final > item.cantidad_entregada
              return (
                <div
                  key={index}
                  style={{
                    ...styles.cardDiscrepancia,
                    borderLeft: esExceso ? '6px solid #ffc107' : '6px solid #dc3545',
                    backgroundColor: esExceso ? '#fff9c4' : '#ffe5e5'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                    <div>
                      <div style={{ fontWeight: 'bold', fontSize: '16px', color: '#071849' }}>
                        Folio: {item.folio} (Pedido #{item.id_pedido})
                      </div>
                      <div style={{ fontSize: '14px', color: '#333', marginTop: '4px' }}>
                        🏪 <strong>Tienda:</strong> {item.tienda_cliente || 'SIN TIENDA REGISTRADA'}
                      </div>
                      <div style={{ fontSize: '14px', color: '#333', marginTop: '4px' }}>
                        📦 <strong>Producto:</strong> {item.producto}
                      </div>
                      <div style={{ fontSize: '13px', color: '#666', marginTop: '4px' }}>
                        📅 <strong>Fecha salida:</strong> {new Date(item.fecha_salida).toLocaleString('es-MX')}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '14px', fontWeight: 'bold' }}>
                        Embarcado: <span style={{ color: '#002B49' }}>{item.cantidad_entregada}</span> | Final: <span style={{ color: '#002B49' }}>{item.cantidad_final}</span>
                      </div>
                      <div style={{ marginTop: '5px', fontSize: '14px', fontWeight: 'bold', color: esExceso ? '#b78103' : '#a71d2a' }}>
                        {esExceso ? `⚠️ Sobran ${Math.abs(item.diferencia)}` : `❌ Faltan ${item.diferencia}`}
                      </div>
                      <button
                        onClick={() => abrirModal(item)}
                        style={styles.botonAccion}
                      >
                        🔍 Ver detalles
                      </button>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </>
      )}

     
      {vistaActiva === 'rotos' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', flexWrap: 'wrap', gap: '10px' }}>
            <h2 style={{ color: '#8B1E1E', fontSize: '22px', margin: 0 }}>🔴 Resumen de bultos rotos </h2>
            
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

          <table style={styles.tablaContenedor}>
            <thead>
              <tr>
                <th style={styles.thStyle}>Producto</th>
                <th style={styles.thStyle}>Total de rotos por producto</th>
                <th style={styles.thStyle}>Numero de folios afectados</th>
              </tr>
            </thead>
            <tbody>
              {resumenRotosDinamico.length === 0 ? (
                <tr><td colSpan="3" style={{ ...styles.tdStyle, textAlign: 'center' }}>No hay registros para este mes.</td></tr>
              ) : (
                resumenRotosDinamico.map((row, idx) => (
                  <tr key={idx}>
                    <td style={styles.tdStyle}><strong>{row.producto}</strong></td>
                    <td style={{ ...styles.tdStyle, color: '#dc3545', fontWeight: 'bold' }}>{row.total_acumulado} pzas</td>
                    <td style={styles.tdStyle}>{row.total_folios} folio(s)</td>
                  </tr>
                ))
              )}
            </tbody>
            {resumenRotosDinamico.length > 0 && (
              <tfoot>
                <tr>
                  <td style={{ ...styles.tdStyle, ...styles.tfootStyle, textAlign: 'right' }}>TOTAL GENERAL:</td>
                  <td style={{ ...styles.tdStyle, ...styles.tfootStyle, color: '#dc3545' }}>{totalGeneralRotos} pzas</td>
                  <td style={styles.tfootStyle}></td>
                </tr>
              </tfoot>
            )}
          </table>

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
                style={{ ...styles.field, marginTop: 0, maxWidth: '220px' }}
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

          <table style={styles.tablaContenedor}>
            <thead>
              <tr>
                <th style={styles.thStyle}>Folio</th>
                <th style={styles.thStyle}>Tienda</th>
                <th style={styles.thStyle}>Fecha salida</th>
                <th style={styles.thStyle}>Producto</th>
                <th style={styles.thStyle}>Cant. Bultos rotos</th>
              </tr>
            </thead>
            <tbody>
              {rotosDetalleFiltrado.length === 0 ? (
                <tr><td colSpan="6" style={{ ...styles.tdStyle, textAlign: 'center' }}>Sin movimientos registrados que coincidan con la búsqueda.</td></tr>
              ) : (
                rotosDetalleFiltrado.map((row) => (
                  <tr key={row.id}>
                    <td style={styles.tdStyle}><strong>{row.folio}</strong></td>
                    <td style={styles.tdStyle}>{row.tienda_cliente}</td>
                    <td style={styles.tdStyle}>{new Date(row.fecha_salida).toLocaleString('es-MX')}</td>
                    <td style={styles.tdStyle}>{row.producto}</td>
                    <td style={{ ...styles.tdStyle, color: '#dc3545', fontWeight: 'bold' }}>{row.cantidad_rota}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      
      {vistaActiva === 'justificados' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', flexWrap: 'wrap', gap: '10px' }}>
            <h2 style={{ color: '#071849', fontSize: '22px', margin: 0 }}>🟡 Resumen de productos justificados</h2>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <label style={{ fontSize: '14px', fontWeight: 'bold', color: '#444' }}>Filtrar por mes:</label>
              <select 
                value={mesJustificados} 
                onChange={e => setMesJustificados(e.target.value)}
                style={styles.dateField}
              >
                <option value="todos">📅 Todos los meses</option>
                <option value="2026-10">Octubre 2026</option>
                <option value="2026-09">Septiembre 2026</option>
                <option value="2026-08">Agosto 2026</option>
              </select>
            </div>
          </div>

          <table style={styles.tablaContenedor}>
            <thead>
              <tr>
                <th style={styles.thStyle}>Producto</th>
                <th style={styles.thStyle}>Bultos justificado</th>
                <th style={styles.thStyle}>Folios afectados</th>
              </tr>
            </thead>
            <tbody>
              {resumenJustificadosDinamico.length === 0 ? (
                <tr><td colSpan="3" style={{ ...styles.tdStyle, textAlign: 'center' }}>No hay registros para este mes.</td></tr>
              ) : (
                resumenJustificadosDinamico.map((row, idx) => (
                  <tr key={idx}>
                    <td style={styles.tdStyle}><strong>{row.producto}</strong></td>
                    <td style={{ ...styles.tdStyle, color: '#2b580c', fontWeight: 'bold' }}>{row.total_acumulado} pzas</td>
                    <td style={styles.tdStyle}>{row.total_folios} folio(s)</td>
                  </tr>
                ))
              )}
            </tbody>
            {resumenJustificadosDinamico.length > 0 && (
              <tfoot>
                <tr>
                  <td style={{ ...styles.tdStyle, ...styles.tfootStyle, textAlign: 'right' }}>TOTAL GENERAL:</td>
                  <td style={{ ...styles.tdStyle, ...styles.tfootStyle, color: '#2b580c' }}>{totalGeneralJustificados} pzas</td>
                  <td style={styles.tfootStyle}></td>
                </tr>
              </tfoot>
            )}
          </table>

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
            <h2 style={{ color: '#071849', fontSize: '22px', margin: 0 }}>📋 Detalle Completo de Justificados por Folio</h2>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <input
                placeholder="Buscar folio o tienda..."
                value={busquedaDetalleJust}
                onChange={e => setBusquedaDetalleJust(e.target.value)}
                style={{ ...styles.field, marginTop: 0, maxWidth: '220px' }}
              />
              <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#444' }}>Desde:</span>
              <input
                type="date"
                value={fechaInicioJust}
                onChange={e => setFechaInicioJust(e.target.value)}
                style={styles.dateField}
              />
              <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#444' }}>Hasta:</span>
              <input
                type="date"
                value={fechaFinJust}
                onChange={e => setFechaFinJust(e.target.value)}
                style={styles.dateField}
              />
            </div>
          </div>

          <table style={styles.tablaContenedor}>
            <thead>
              <tr>
                <th style={styles.thStyle}>Folio</th>
                <th style={styles.thStyle}>Tienda / Cliente</th>
                <th style={styles.thStyle}>Fecha Salida</th>
                <th style={styles.thStyle}>Producto</th>
                <th style={styles.thStyle}>Cantidad Ajustada</th>
                <th style={styles.thStyle}>Motivo</th>
              </tr>
            </thead>
            <tbody>
              {justificadosDetalleFiltrado.length === 0 ? (
                <tr><td colSpan="6" style={{ ...styles.tdStyle, textAlign: 'center' }}>Sin movimientos registrados que coincidan con la búsqueda.</td></tr>
              ) : (
                justificadosDetalleFiltrado.map((row) => (
                  <tr key={row.id}>
                    <td style={styles.tdStyle}><strong>{row.folio}</strong></td>
                    <td style={styles.tdStyle}>{row.tienda_cliente}</td>
                    <td style={styles.tdStyle}>{new Date(row.fecha_salida).toLocaleString('es-MX')}</td>
                    <td style={styles.tdStyle}>{row.producto}</td>
                    <td style={{ ...styles.tdStyle, color: '#2b580c', fontWeight: 'bold' }}>{row.cantidad_rota}</td>
                    <td style={styles.tdStyle}>{row.motivo}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL DE REVISIÓN */}
      {modalAbierto && itemSeleccionado && (
        <div style={styles.overlay}>
          <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: '#fff',
            padding: '24px',
            borderRadius: '8px',
            width: '500px',
            maxWidth: '95%',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
            zIndex: 1000
          }}>
            <h2 style={{ color: '#8B1E1E', marginBottom: '15px', borderBottom: '2px solid #8B1E1E', paddingBottom: '8px', fontSize: '20px' }}>
              ⚙️ Revisar Discrepancia - Folio: {itemSeleccionado.folio}
            </h2>

            <div style={{ background: '#f8f9fa', padding: '12px', borderRadius: '6px', marginBottom: '15px', fontSize: '14px' }}>
              <p style={{ margin: '4px 0' }}><strong>Tienda:</strong> {itemSeleccionado.tienda_cliente || 'SIN TIENDA'}</p>
              <p style={{ margin: '4px 0' }}><strong>Producto:</strong> {itemSeleccionado.producto}</p>
              <p style={{ margin: '4px 0' }}><strong>Cantidad embarcada:</strong> {itemSeleccionado.cantidad_entregada}</p>
              <p style={{ margin: '4px 0' }}><strong>Cantidad final:</strong> {itemSeleccionado.cantidad_final}</p>
            </div>

            {itemSeleccionado.cantidad_final > itemSeleccionado.cantidad_entregada ? (
              <div style={{ marginBottom: '15px', padding: '12px', border: '1px solid #dc3545', borderRadius: '6px', backgroundColor: '#f8d7da' }}>
                <p style={{ color: '#721c24', fontSize: '13px', marginBottom: '8px', fontWeight: 'bold' }}>
                  ⚠️ Estos productos exceden la cantidad entregada. Debe corregirse desde la base de datos consulte con el programador
                </p>
                <label style={{ display: 'block', fontWeight: 'bold', fontSize: '12px', color: '#721c24' }}>
                  Para liberar este folio como justificado, ingrese la contraseña de administrador:
                </label>

                <form onSubmit={e => e.preventDefault()} style={{ margin: 0, padding: 0 }}>
                  <input
                    type="password"
                    name="admin_password"
                    autoComplete="current-password"
                    value={passwordAdmin}
                    onChange={e => setPasswordAdmin(e.target.value)}
                    placeholder="Introduce contraseña..."
                    style={{ 
                      width: '100%', 
                      padding: '8px', 
                      marginTop: '5px', 
                      boxSizing: 'border-box', 
                      borderRadius: '4px', 
                      border: '1px solid #dc3545' 
                    }}
                  />
                </form>
              </div>
            ) : (
              <div style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#e2f0cb', borderRadius: '6px', color: '#2b580c', fontSize: '13px', fontWeight: 'bold' }}>
                ℹ️ Diferencia detectada: {itemSeleccionado.diferencia} bulto(s) faltantes.
              </div>
            )}

            <p style={{ fontWeight: 'bold', marginBottom: '8px', fontSize: '14px', color: '#071849' }}>
              Seleccione una opción obligatoria para procesar:
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
              <label style={{ cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="radio"
                  name="resolucion"
                  value="ROTO"
                  checked={tipoResolucion === 'ROTO'}
                  onChange={e => setTipoResolucion(e.target.value)}
                />
                🔴 <strong>Marcar como Roto</strong>
              </label>

              <label style={{ cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="radio"
                  name="resolucion"
                  value="JUSTIFICADO"
                  checked={tipoResolucion === 'JUSTIFICADO'}
                  onChange={e => setTipoResolucion(e.target.value)}
                />
                🟡 <strong>Marcar como justificado</strong>
              </label>
            </div>

            {errorMsg && <div style={{ color: 'red', marginBottom: '15px', fontSize: '13px', fontWeight: 'bold' }}>{errorMsg}</div>}
            {successMsg && <div style={{ color: 'green', marginBottom: '15px', fontSize: '13px', fontWeight: 'bold' }}>{successMsg}</div>}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                onClick={cerrarModal}
                disabled={procesando}
                style={{ padding: '8px 15px', backgroundColor: '#6c757d', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Cancelar
              </button>
              <button
                onClick={handleResolver}
                disabled={procesando}
                style={{ padding: '8px 15px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                {procesando ? 'Procesando...' : 'Confirmar y Procesar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default NotasDiscrepancias
