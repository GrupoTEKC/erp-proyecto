import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import logo from "../assets/TRANSPARENTE.png"

const API = "https://erp-proyecto-production.up.railway.app"

// 🎨 OBJETO DE ESTILOS UNIFICADO CON LA PALETA GUINDA/VINO
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
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  titleCenter: {
    textAlign: "center",
    fontSize: "28px",
    fontWeight: "bold",
    color: "#8B1E1E",
    margin: 0,
    letterSpacing: "1px"
  },
  subTitle: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#8B1E1E',
    margin: '0 0 12px 0',
    borderBottom: '2px solid #8B1E1E',
    paddingBottom: '6px'
  },
  field: {
    width: '100%',
    padding: '8px',
    borderRadius: '6px',
    border: '1px solid #8B1E1E',
    marginTop: '4px',
    boxSizing: 'border-box'
  },
  selectFiltro: {
    padding: '6px 10px',
    borderRadius: '4px',
    border: '1px solid #8B1E1E',
    color: '#8B1E1E',
    fontWeight: 'bold',
    backgroundColor: '#fff',
    cursor: 'pointer'
  },
  botonAccion: {
    padding: '8px 14px',
    fontSize: '13px',
    backgroundColor: '#8B1E1E',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  botonNav: {
    backgroundColor: '#8B1E1E',
    color: '#fff',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  botonOutlined: {
    backgroundColor: '#fff',
    color: '#8B1E1E',
    border: '1px solid #8B1E1E',
    padding: '6px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  hamburger: {
    position: "fixed",
    top: 18,
    right: 18,
    background: "transparent",
    border: "none",
    color: "#C62828",
    fontSize: 30,
    cursor: "pointer",
    zIndex: 1001,
    padding: 0,
    lineHeight: 1
  },
  menu: {
    position: "fixed",
    top: 0,
    right: 0,
    width: 290,
    height: "100%",
    background: "#ffffff",
    color: "#222",
    boxShadow: "-8px 0 25px rgba(0,0,0,.18)",
    padding: "20px 18px",
    zIndex: 1000,
    transition: "transform .25s ease"
  },
  menuItem: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "14px 12px",
    marginBottom: 8,
    background: "#fff",
    color: "#333",
    border: "none",
    borderBottom: "1px solid #ececec",
    fontSize: "17px",
    cursor: "pointer",
    textAlign: "left"
  },
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(139,30,30,.12)",
    zIndex: 999
  },
  cardPanel: {
    backgroundColor: '#fff',
    borderRadius: '10px',
    padding: '18px',
    border: '1px solid #e5e5e5',
    height: 'fit-content'
  },
  modalBox: {
    backgroundColor: '#fff',
    borderRadius: '10px',
    padding: '24px',
    width: '420px',
    maxWidth: '90%',
    border: '2px solid #8B1E1E'
  }
}

function CuentasPorPagar() {
  const navigate = useNavigate()
  const [menuAbierto, setMenuAbierto] = useState(false)
  const [prestamos, setPrestamos] = useState([])
  const [eventos, setEventos] = useState([])
  const [cargando, setCargando] = useState(true)

  // Modales
  const [modalNuevo, setModalNuevo] = useState(false)
  const [modalAbono, setModalAbono] = useState(null)
  const [modalHistorial, setModalHistorial] = useState(null)
  const [historialAbonos, setHistorialAbonos] = useState([])
  const [prestamosSeleccionados, setPrestamosSeleccionados] = useState([])

  // Estado del mes/año seleccionado para el calendario
  const hoy = new Date()
  const [mesSeleccionado, setMesSeleccionado] = useState(hoy.getMonth())
  const [anioSeleccionado, setAnioSeleccionado] = useState(hoy.getFullYear())

  // Formularios
  const [formPrestamo, setFormPrestamo] = useState({
    prestamista: "",
    monto_original: "",
    plazos_meses: "6",
    frecuencia: "MENSUAL",
    fecha_primer_pago: new Date().toISOString().split('T')[0],
    color_identificador: "#8B1E1E",
    cuenta_destino: "TRANSFERENCIA",
    cuenta_bancaria_destino: "BBVA Fiscal"
  })

  const [formAbono, setFormAbono] = useState({
    monto_abonado: "",
    origen_pago: "EFECTIVO",
    cuenta_bancaria_salida: "",
    responsable_pago: "",
    num_comprobante: "",
    fecha_abono: new Date().toISOString().split('T')[0]
  })

  // Cargar Préstamos
  const cargarDatos = async () => {
    setCargando(true)
    try {
      const res = await fetch(`${API}/api/prestamos`)
      const data = await res.json()
      const listP = data.prestamos || []
      setPrestamos(listP)
      setEventos(data.eventosCalendario || [])
      setPrestamosSeleccionados(listP.map(p => p.id_prestamo))
    } catch (err) {
      console.error("Error al cargar datos:", err)
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    cargarDatos()
  }, [])

  // Guardar Préstamo
  const handleCrearPrestamo = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch(`${API}/api/prestamos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formPrestamo)
      })
      if (res.ok) {
        setModalNuevo(false)
        setFormPrestamo({
          prestamista: "",
          monto_original: "",
          plazos_meses: "6",
          frecuencia: "MENSUAL",
          fecha_primer_pago: new Date().toISOString().split('T')[0],
          color_identificador: "#8B1E1E",
          cuenta_destino: "TRANSFERENCIA",
          cuenta_bancaria_destino: "BBVA Fiscal"
        })
        cargarDatos()
      }
    } catch (err) {
      console.error(err)
    }
  }

  // Registrar Abono
  const handleRegistrarAbono = async (e) => {
    e.preventDefault()
    if (!formAbono.responsable_pago.trim()) {
      alert("El responsable es obligatorio.")
      return
    }

    try {
      const res = await fetch(`${API}/api/prestamos/abono`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_prestamo: modalAbono.id_prestamo,
          numero_periodo: modalAbono.numero_periodo || 1,
          ...formAbono
        })
      })

      if (res.ok) {
        setModalAbono(null)
        setFormAbono({
          monto_abonado: "",
          origen_pago: "EFECTIVO",
          cuenta_bancaria_salida: "",
          responsable_pago: "",
          num_comprobante: "",
          fecha_abono: new Date().toISOString().split('T')[0]
        })
        cargarDatos()
      }
    } catch (err) {
      console.error(err)
    }
  }

  // Ver Historial
  const handleVerHistorial = async (id) => {
    try {
      const res = await fetch(`${API}/api/prestamos/${id}/historial`)
      const data = await res.json()
      setHistorialAbonos(data || [])
      setModalHistorial(id)
    } catch (err) {
      console.error(err)
    }
  }

  const toggleFiltroPrestamo = (id) => {
    if (prestamosSeleccionados.includes(id)) {
      setPrestamosSeleccionados(prestamosSeleccionados.filter(item => item !== id))
    } else {
      setPrestamosSeleccionados([...prestamosSeleccionados, id])
    }
  }

  // Lógica de Generación de Días para Calendario Mensual
  const nombresMeses = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ]

  const obtenerDiasMes = (mes, anio) => {
    const primerDia = new Date(anio, mes, 1)
    const ultimoDia = new Date(anio, mes + 1, 0)

    let diaSemanaInicio = primerDia.getDay() - 1 // Lunes = 0
    if (diaSemanaInicio === -1) diaSemanaInicio = 6 // Domingo = 6

    const totalDias = ultimoDia.getDate()
    const celdas = []

    for (let i = 0; i < diaSemanaInicio; i++) {
      celdas.push(null)
    }

    for (let d = 1; d <= totalDias; d++) {
      celdas.push(new Date(anio, mes, d))
    }

    return celdas
  }

  const diasCalendario = obtenerDiasMes(mesSeleccionado, anioSeleccionado)
  const hoyISO = new Date().toISOString().split('T')[0]

  const cambiarMes = (direccion) => {
    if (direccion === -1) {
      if (mesSeleccionado === 0) {
        setMesSeleccionado(11)
        setAnioSeleccionado(anioSeleccionado - 1)
      } else {
        setMesSeleccionado(mesSeleccionado - 1)
      }
    } else {
      if (mesSeleccionado === 11) {
        setMesSeleccionado(0)
        setAnioSeleccionado(anioSeleccionado + 1)
      } else {
        setMesSeleccionado(mesSeleccionado + 1)
      }
    }
  }

  return (
    <div style={styles.page}>
      
      {/* 🍔 BOTÓN DE MENÚ */}
      {!menuAbierto && (
        <button style={styles.hamburger} onClick={() => setMenuAbierto(true)}>
          ☰
        </button>
      )}

      {/* 📂 DESPLEGABLE DE MENÚ */}
      {menuAbierto && (
        <>
          <div style={styles.overlay} onClick={() => setMenuAbierto(false)} />
          <div style={styles.menu}>
            <h3 style={{ margin: 0, paddingBottom: 18, marginBottom: 18, borderBottom: "1px solid #E5E5E5", fontSize: 24, color: "#8B1E1E", fontWeight: "700" }}>
              ☰ MENÚ
            </h3>
            <button style={styles.menuItem} onClick={() => { setMenuAbierto(false); navigate("/"); }}>
              <span style={{ color: "#C62828" }}>🏠</span> Inicio
            </button>
            <button style={styles.menuItem} onClick={() => { setMenuAbierto(false); navigate("/cuentas-por-pagar"); }}>
              <span style={{ color: "#C62828" }}>💳</span> Cuentas por pagar
            </button>
            <button style={styles.menuItem} onClick={() => { setMenuAbierto(false); navigate("/flujo-caja"); }}>
              <span style={{ color: "#C62828" }}>$</span> Flujo de caja
            </button>
            <button style={styles.menuItem} onClick={() => setMenuAbierto(false)}>
              <span style={{ color: "#C62828" }}>✖</span> Salir del menú
            </button>
          </div>
        </>
      )}

      {/* ⬅ BOTÓN VOLVER */}
      <button style={styles.backTop} onClick={() => navigate("/")}>
        ⬅ Volver
      </button>

     {/* 🔵 ENCABEZADO Y LOGO */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: -5, marginBottom: 20 }}>
        <img src={logo} alt="Pegatek" style={{ width: 140, objectFit: "contain", marginBottom: 6 }} />
        <h1 style={{ ...styles.titleCenter, fontSize: "48px" }}>
          CUENTAS POR PAGAR
        </h1>
      </div>
      

      {/* CONTENEDOR DOS COLUMNAS */}
      <div style={{ display: 'flex', gap: '20px', maxWidth: '1400px', margin: '0 auto', flexWrap: 'wrap' }}>
        
        {/* BARRA LATERAL IZQUIERDA */}
        <div style={{ ...styles.cardPanel, width: '280px' }}>
          
          <button style={{ ...styles.botonAccion, width: '100%', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }} onClick={() => setModalNuevo(true)}>
            ➕ Registrar préstamo
          </button>

          <h3 style={styles.subTitle}>
            Prestamos activos
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {prestamos.length === 0 ? (
              <p style={{ fontSize: '13px', color: '#666' }}>No hay préstamos registrados.</p>
            ) : (
              prestamos.map((p) => (
                <label key={p.id_prestamo} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#333', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={prestamosSeleccionados.includes(p.id_prestamo)}
                    onChange={() => toggleFiltroPrestamo(p.id_prestamo)}
                    style={{ accentColor: '#8B1E1E' }}
                  />
                  <span style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: p.color_identificador || '#8B1E1E' }} />
                  <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: 'bold' }}>{p.prestamista}</span>
                  <button
                    style={{ border: 'none', background: 'none', color: '#8B1E1E', cursor: 'pointer', fontSize: '12px' }}
                    onClick={(e) => { e.preventDefault(); handleVerHistorial(p.id_prestamo); }}
                    title="Ver Historial"
                  >
                    📋
                  </button>
                </label>
              ))
            )}
          </div>
        </div>

        {/* CALENDARIO MENSUAL PRINCIPAL */}
        <div style={{ ...styles.cardPanel, flex: 1, minWidth: '320px', padding: '20px' }}>
          
          {/* CONTROL Y FILTRO DEL MES */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
            <h2 style={{ margin: 0, fontSize: '22px', color: '#8B1E1E', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' }}>
              📅 {nombresMeses[mesSeleccionado]} {anioSeleccionado}
            </h2>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button style={styles.botonNav} onClick={() => cambiarMes(-1)}>
                ◀
              </button>

              {/* SELECTORES DE MES Y AÑO */}
              <select
                style={styles.selectFiltro}
                value={mesSeleccionado}
                onChange={(e) => setMesSeleccionado(parseInt(e.target.value))}
              >
                {nombresMeses.map((m, idx) => (
                  <option key={idx} value={idx}>{m}</option>
                ))}
              </select>

              <select
                style={styles.selectFiltro}
                value={anioSeleccionado}
                onChange={(e) => setAnioSeleccionado(parseInt(e.target.value))}
              >
                {[2025, 2026, 2027, 2028].map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>

              <button style={styles.botonNav} onClick={() => cambiarMes(1)}>
                ▶
              </button>

              <button
                style={{ ...styles.botonOutlined, marginLeft: '6px' }}
                onClick={() => {
                  setMesSeleccionado(hoy.getMonth())
                  setAnioSeleccionado(hoy.getFullYear())
                }}
              >
                MES ACTUAL
              </button>
            </div>
          </div>

          {/* CABECERA DÍAS DE LA SEMANA */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', backgroundColor: '#8B1E1E', color: '#fff', borderRadius: '6px 6px 0 0', fontWeight: 'bold', fontSize: '12px', textAlign: 'center', padding: '10px 0' }}>
            <span>LUN</span>
            <span>MAR</span>
            <span>MIÉ</span>
            <span>JUE</span>
            <span>VIE</span>
            <span>SÁB</span>
            <span>DOM</span>
          </div>

          {/* GRILLA DE CELDAS DEL MES COMPLETO */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderLeft: '1px solid #e5e5e5', borderBottom: '1px solid #e5e5e5' }}>
            {diasCalendario.map((fechaObj, idx) => {
              if (!fechaObj) {
                return (
                  <div key={idx} style={{ minHeight: '100px', backgroundColor: '#fcfcfc', borderRight: '1px solid #e5e5e5', borderTop: '1px solid #e5e5e5' }} />
                )
              }

              const y = fechaObj.getFullYear()
              const m = String(fechaObj.getMonth() + 1).padStart(2, '0')
              const d = String(fechaObj.getDate()).padStart(2, '0')
              const isoFecha = `${y}-${m}-${d}`

              const esHoy = isoFecha === hoyISO
              const eventosDelDia = eventos.filter(ev => ev.fecha_programada === isoFecha && prestamosSeleccionados.includes(ev.id_prestamo))

              return (
                <div
                  key={idx}
                  style={{
                    minHeight: '100px',
                    padding: '6px',
                    borderRight: '1px solid #e5e5e5',
                    borderTop: '1px solid #e5e5e5',
                    backgroundColor: esHoy ? '#fff8f8' : '#fff'
                  }}
                >
                  <div style={{ textAlign: 'right', marginBottom: '4px' }}>
                    <span
                      style={{
                        fontSize: '12px',
                        fontWeight: 'bold',
                        padding: '2px 6px',
                        borderRadius: '50%',
                        backgroundColor: esHoy ? '#8B1E1E' : 'transparent',
                        color: esHoy ? '#fff' : '#444'
                      }}
                    >
                      {fechaObj.getDate()}
                    </span>
                  </div>

                  {/* EVENTOS DEL DÍA */}
                  {eventosDelDia.map((ev, evIdx) => {
                    const esVencido = ev.fecha_programada < hoyISO && ev.estatus_prestamo !== 'LIQUIDADO'

                    return (
                      <div
                        key={evIdx}
                        style={{
                          backgroundColor: `${ev.color || '#8B1E1E'}18`,
                          borderLeft: `3px solid ${ev.color || '#8B1E1E'}`,
                          borderRadius: '4px',
                          padding: '4px 6px',
                          marginBottom: '4px',
                          fontSize: '11px',
                          cursor: 'pointer'
                        }}
                        onClick={() => {
                          setModalAbono({
                            id_prestamo: ev.id_prestamo,
                            prestamista: ev.prestamista,
                            numero_periodo: ev.numero_periodo,
                            monto_cuota_sugerida: ev.monto_sugerido
                          })
                          setFormAbono((prev) => ({ ...prev, monto_abonado: ev.monto_sugerido }))
                        }}
                      >
                        <div style={{ fontWeight: 'bold', color: '#8B1E1E', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                          {ev.prestamista}
                        </div>
                        <div style={{ color: '#333', fontSize: '10px' }}>
                          Cuota #{ev.numero_periodo}: <strong>${Number(ev.monto_sugerido).toLocaleString()}</strong>
                        </div>
                        {esVencido && (
                          <div style={{ color: '#C62828', fontWeight: 'bold', fontSize: '9px', marginTop: '2px' }}>
                            ⚠️ Vencido
                          </div>
                        )}
                      </div>
                    )
                  })}

                </div>
              )
            })}
          </div>

        </div>

      </div>

      {/* MODAL NUEVO PRÉSTAMO */}
      {modalNuevo && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={styles.modalBox}>
            <h3 style={{ margin: '0 0 16px 0', color: '#8B1E1E' }}>➕ Registrar Nuevo Préstamo</h3>
            <form onSubmit={handleCrearPrestamo}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#444' }}>Acreedor / Prestamista *</label>
                <input
                  style={styles.field}
                  required
                  placeholder="Ej. YADESA"
                  value={formPrestamo.prestamista}
                  onChange={(e) => setFormPrestamo({ ...formPrestamo, prestamista: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#444' }}>Monto del prestamo*</label>
                  <input
                    type="number"
                    style={styles.field}
                    required
                    value={formPrestamo.monto_original}
                    onChange={(e) => setFormPrestamo({ ...formPrestamo, monto_original: e.target.value })}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#444' }}> Plazo de pago (meses)*</label>
                  <input
                    type="number"
                    style={styles.field}
                    required
                    value={formPrestamo.plazos_meses}
                    onChange={(e) => setFormPrestamo({ ...formPrestamo, plazos_meses: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#444' }}>Selecciona un color</label>
                  <input
                    type="color"
                    style={{ width: '100%', height: '36px', padding: '2px', border: '1px solid #8B1E1E', borderRadius: '6px', marginTop: '4px' }}
                    value={formPrestamo.color_identificador}
                    onChange={(e) => setFormPrestamo({ ...formPrestamo, color_identificador: e.target.value })}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#444' }}>Fecha Primer Pago</label>
                  <input
                    type="date"
                    style={styles.field}
                    value={formPrestamo.fecha_primer_pago}
                    onChange={(e) => setFormPrestamo({ ...formPrestamo, fecha_primer_pago: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button type="submit" style={{ ...styles.botonAccion, flex: 1 }}>
                  Guardar Préstamo
                </button>
                <button type="button" style={{ backgroundColor: '#ccc', border: 'none', padding: '10px', borderRadius: '6px', cursor: 'pointer' }} onClick={() => setModalNuevo(false)}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL ABONO */}
      {modalAbono && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={styles.modalBox}>
            <h3 style={{ margin: '0 0 10px 0', color: '#8B1E1E' }}>💲 Registrar abono</h3>
            <p style={{ fontSize: '13px', color: '#555', margin: '0 0 16px 0' }}>Préstamo: <strong>{modalAbono.prestamista}</strong></p>

            <form onSubmit={handleRegistrarAbono}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#444' }}>Monto ($ MXN) *</label>
                <input
                  type="number"
                  step="0.01"
                  style={styles.field}
                  required
                  value={formAbono.monto_abonado}
                  onChange={(e) => setFormAbono({ ...formAbono, monto_abonado: e.target.value })}
                />
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#444' }}>Persona que realizo el pago*</label>
                <input
                  style={styles.field}
                  required
                  placeholder="Nombre completo"
                  value={formAbono.responsable_pago}
                  onChange={(e) => setFormAbono({ ...formAbono, responsable_pago: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button type="submit" style={{ ...styles.botonAccion, flex: 1 }}>
                  Confirmar Pago
                </button>
                <button type="button" style={{ backgroundColor: '#ccc', border: 'none', padding: '10px', borderRadius: '6px', cursor: 'pointer' }} onClick={() => setModalAbono(null)}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL HISTORIAL */}
      {modalHistorial && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={styles.modalBox}>
            <h3 style={{ margin: '0 0 16px 0', color: '#8B1E1E' }}>📋 Historial de abonos</h3>
            
            {historialAbonos.length === 0 ? (
              <p style={{ fontSize: '13px', color: '#666' }}>Sin pagos registrados para este préstamo.</p>
            ) : (
              <table style={{ width: '100%', fontSize: '12px', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ textAlign: 'left', borderBottom: '2px solid #8B1E1E', color: '#8B1E1E' }}>
                    <th style={{ padding: '8px' }}>Fecha</th>
                    <th style={{ padding: '8px' }}>Monto</th>
                    <th style={{ padding: '8px' }}>Responsable</th>
                  </tr>
                </thead>
                <tbody>
                  {historialAbonos.map((h) => (
                    <tr key={h.id_abono} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '8px' }}>{h.fecha_abono}</td>
                      <td style={{ padding: '8px', fontWeight: 'bold', color: '#8B1E1E' }}>${Number(h.monto_abonado).toLocaleString()}</td>
                      <td style={{ padding: '8px' }}>{h.responsable_pago}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            <button style={{ ...styles.botonAccion, width: '100%', marginTop: '20px' }} onClick={() => setModalHistorial(null)}>
              Cerrar
            </button>
          </div>
        </div>
      )}

    </div>
  )
}

export default CuentasPorPagar
