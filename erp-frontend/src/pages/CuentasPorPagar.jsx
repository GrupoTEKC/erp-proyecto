import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import logo from "../assets/TRANSPARENTE.png"

const API = "https://erp-proyecto-production.up.railway.app"

const styles = {
  page: {
    backgroundColor: '#F8FAFC',
    minHeight: '100vh',
    padding: '24px 32px',
    fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    boxSizing: 'border-box'
  },
  headerRow: {
    display: 'grid',
    gridTemplateColumns: '320px 1fr',
    gap: '28px',
    alignItems: 'center',
    marginBottom: '28px',
    width: '100%'
  },
  backTop: {
    padding: '10px 18px',
    fontSize: '13px',
    backgroundColor: '#FFFFFF',
    color: '#8B1E1E',
    border: '1px solid #8B1E1E',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
  },
  titleCenter: {
    fontSize: '34px',
    fontWeight: '800',
    color: '#8B1E1E',
    margin: 0,
    letterSpacing: '0.5px'
  },
  subTitle: {
    fontSize: '15px',
    fontWeight: '700',
    color: '#8B1E1E',
    margin: '0 0 16px 0',
    borderBottom: '2px solid #8B1E1E',
    paddingBottom: '8px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  field: {
    width: '100%',
    padding: '10px 12px',
    borderRadius: '6px',
    border: '1px solid #CBD5E1',
    marginTop: '6px',
    boxSizing: 'border-box',
    fontSize: '14px',
    outline: 'none',
    backgroundColor: '#FFFFFF'
  },
  selectFiltro: {
    padding: '8px 12px',
    borderRadius: '6px',
    border: '1px solid #CBD5E1',
    color: '#334155',
    fontWeight: '600',
    backgroundColor: '#FFFFFF',
    cursor: 'pointer',
    fontSize: '13px'
  },
  botonAccion: {
    padding: '10px 18px',
    fontSize: '14px',
    backgroundColor: '#8B1E1E',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  },
  botonNav: {
    backgroundColor: '#FFFFFF',
    color: '#8B1E1E',
    border: '1px solid #CBD5E1',
    padding: '8px 14px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '700'
  },
  botonOutlined: {
    backgroundColor: '#FFFFFF',
    color: '#8B1E1E',
    border: '1px solid #8B1E1E',
    padding: '8px 14px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '13px'
  },
  hamburger: {
    position: 'fixed',
    top: 24,
    right: 32,
    background: '#FFFFFF',
    border: '1px solid #E2E8F0',
    borderRadius: '8px',
    color: '#8B1E1E',
    fontSize: '22px',
    cursor: 'pointer',
    zIndex: 1001,
    padding: '8px 12px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.08)'
  },
  menu: {
    position: 'fixed',
    top: 0,
    right: 0,
    width: 300,
    height: '100%',
    background: '#FFFFFF',
    color: '#1E293B',
    boxShadow: '-8px 0 25px rgba(0,0,0,0.15)',
    padding: '24px',
    zIndex: 1000,
    boxSizing: 'border-box'
  },
  menuItem: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '12px 14px',
    marginBottom: 8,
    background: '#FFFFFF',
    color: '#334155',
    border: 'none',
    borderRadius: '6px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    textAlign: 'left'
  },
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(15, 23, 42, 0.4)',
    zIndex: 999
  },
  cardPanel: {
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    padding: '24px',
    border: '1px solid #E2E8F0',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    boxSizing: 'border-box'
  },
  modalBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    padding: '28px',
    width: '520px',
    maxWidth: '92%',
    maxHeight: '90vh',
    overflowY: 'auto',
    border: '1px solid #E2E8F0',
    boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)'
  },
  infoBox: {
    backgroundColor: '#EFF6FF',
    borderLeft: '4px solid #2563EB',
    color: '#1E40AF',
    padding: '10px 14px',
    borderRadius: '6px',
    fontSize: '13px',
    marginTop: '10px',
    lineHeight: '1.4'
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
    tipo_deuda: "FINANCIEROS",
    monto_original: "",
    plazos_meses: "6",
    frecuencia: "MENSUAL",
    fecha_primer_pago: new Date().toISOString().split('T')[0],
    color_identificador: "#8B1E1E",
    cuenta_destino: "TRANSFERENCIA",
    cuenta_bancaria_destino: "Fiscal"
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
          tipo_deuda: "FINANCIEROS",
          monto_original: "",
          plazos_meses: "6",
          frecuencia: "MENSUAL",
          fecha_primer_pago: new Date().toISOString().split('T')[0],
          color_identificador: "#8B1E1E",
          cuenta_destino: "TRANSFERENCIA",
          cuenta_bancaria_destino: "Fiscal"
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

  // Mensaje explicativo para cada tipo de deuda
  const obtenerMensajeTipoDeuda = (tipo) => {
    switch (tipo) {
      case "PROVEEDORES":
        return "Haz seleccionado préstamo de proveedores: Hace énfasis en financiamiento o crédito directo de materia prima, insumos y mercancía para la operación."
      case "FINANCIEROS":
        return "Haz seleccionado créditos financieros: Relacionado con préstamos, líneas de crédito o financiamientos otorgados por instituciones bancarias y financieras."
      case "DIVERSOS":
        return "Haz seleccionado créditos diversos: Aplica para deudas con acreedores varios, préstamos de socios, terceros o financiamientos que no corresponden a proveedores ni bancos."
      default:
        return ""
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
            <h3 style={{ margin: 0, paddingBottom: 18, marginBottom: 18, borderBottom: "1px solid #E2E8F0", fontSize: 20, color: "#8B1E1E", fontWeight: "700" }}>
              MENÚ
            </h3>
            <button style={styles.menuItem} onClick={() => { setMenuAbierto(false); navigate("/"); }}>
              <span style={{ color: "#8B1E1E" }}>🏠</span> Inicio
            </button>
            <button style={{ ...styles.menuItem, backgroundColor: '#F8FAFC', color: '#8B1E1E' }} onClick={() => { setMenuAbierto(false); navigate("/cuentas-por-pagar"); }}>
              <span style={{ color: "#8B1E1E" }}>💳</span> Cuentas por pagar
            </button>
            <button style={styles.menuItem} onClick={() => { setMenuAbierto(false); navigate("/flujo-caja"); }}>
              <span style={{ color: "#8B1E1E" }}>$</span> Flujo de caja
            </button>
            <button style={{ ...styles.menuItem, marginTop: '20px', color: '#64748B' }} onClick={() => setMenuAbierto(false)}>
              <span>✖</span> Salir del menú
            </button>
          </div>
        </>
      )}

      {/* 🔵 CABECERA GENERAL ALINEADA */}
      <div style={styles.headerRow}>
        <div>
          <button style={styles.backTop} onClick={() => navigate("/")}>
            ⬅ Volver
          </button>
        </div>
        <div>
          <h1 style={styles.titleCenter}>CUENTAS POR PAGAR</h1>
        </div>
      </div>

      {/* CONTENEDOR PRINCIPAL */}
      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '28px', width: '100%', alignItems: 'start' }}>
        
        {/* BARRA LATERAL IZQUIERDA */}
        <div style={styles.cardPanel}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
            <img src={logo} alt="Logo" style={{ height: 128, objectFit: "contain" }} />
          </div>

          <button style={{ ...styles.botonAccion, width: '100%', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }} onClick={() => setModalNuevo(true)}>
            ➕ Registrar pasivo / deuda
          </button>

          <h3 style={styles.subTitle}>Deudas activas</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {prestamos.length === 0 ? (
              <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>No hay deudas registradas.</p>
            ) : (
              prestamos.map((p) => {
                const totalPagado = Number(p.monto_pagado || 0)
                const totalMonto = Number(p.monto_original || 1)
                const pct = Math.min(100, Math.round((totalPagado / totalMonto) * 100))
                const colorHex = p.color_identificador || '#8B1E1E'

                return (
                  <div key={p.id_prestamo} style={{ padding: '12px', border: '1px solid #E2E8F0', borderRadius: '8px', backgroundColor: '#F8FAFC' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#1E293B', cursor: 'pointer', fontWeight: '600', flex: 1, overflow: 'hidden' }}>
                        <input
                          type="checkbox"
                          checked={prestamosSeleccionados.includes(p.id_prestamo)}
                          onChange={() => toggleFiltroPrestamo(p.id_prestamo)}
                          style={{ accentColor: '#8B1E1E', cursor: 'pointer' }}
                        />
                        <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: colorHex, flexShrink: 0 }} />
                        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.prestamista}</span>
                      </label>
                      
                      <button
                        style={{ border: 'none', background: 'none', color: '#64748B', cursor: 'pointer', fontSize: '14px', padding: '2px 4px' }}
                        onClick={(e) => { e.preventDefault(); handleVerHistorial(p.id_prestamo); }}
                        title="Ver Historial"
                      >
                        📋
                      </button>
                    </div>

                    {p.tipo_deuda && (
                      <div style={{ fontSize: '10px', fontWeight: '700', color: '#64748B', marginLeft: '24px', marginBottom: '6px' }}>
                        [{p.tipo_deuda}]
                      </div>
                    )}

                    {/* BARRA DE PROGRESO */}
                    <div style={{ width: '100%', height: '6px', backgroundColor: '#E2E8F0', borderRadius: '3px', overflow: 'hidden', marginTop: '6px' }}>
                      <div style={{ width: `${pct}%`, height: '100%', backgroundColor: colorHex, borderRadius: '3px' }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748B', marginTop: '4px' }}>
                      <span>Pagado: ${totalPagado.toLocaleString()}</span>
                      <span>{pct}%</span>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
        
        {/* CALENDARIO MENSUAL PRINCIPAL */}
        <div style={styles.cardPanel}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
            <h2 style={{ margin: 0, fontSize: '22px', color: '#1E293B', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span>📅</span> {nombresMeses[mesSeleccionado]} {anioSeleccionado}
            </h2>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button style={styles.botonNav} onClick={() => cambiarMes(-1)}>◀</button>

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

              <button style={styles.botonNav} onClick={() => cambiarMes(1)}>▶</button>

              <button
                style={{ ...styles.botonOutlined, marginLeft: '8px' }}
                onClick={() => {
                  setMesSeleccionado(hoy.getMonth())
                  setAnioSeleccionado(hoy.getFullYear())
                }}
              >
                Mes Actual
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', backgroundColor: '#8B1E1E', color: '#FFFFFF', borderRadius: '8px 8px 0 0', fontWeight: '700', fontSize: '13px', textAlign: 'center', padding: '12px 0', letterSpacing: '0.5px' }}>
            <span>LUN</span>
            <span>MAR</span>
            <span>MIÉ</span>
            <span>JUE</span>
            <span>VIE</span>
            <span>SÁB</span>
            <span>DOM</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderLeft: '1px solid #E2E8F0', borderBottom: '1px solid #E2E8F0', borderRadius: '0 0 8px 8px', overflow: 'hidden' }}>
            {diasCalendario.map((fechaObj, idx) => {
              if (!fechaObj) {
                return (
                  <div key={idx} style={{ minHeight: '120px', backgroundColor: '#F8FAFC', borderRight: '1px solid #E2E8F0', borderTop: '1px solid #E2E8F0' }} />
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
                    minHeight: '120px',
                    padding: '8px',
                    borderRight: '1px solid #E2E8F0',
                    borderTop: '1px solid #E2E8F0',
                    backgroundColor: esHoy ? '#FEF2F2' : '#FFFFFF',
                    boxSizing: 'border-box'
                  }}
                >
                  <div style={{ textAlign: 'right', marginBottom: '6px' }}>
                    <span
                      style={{
                        fontSize: '12px',
                        fontWeight: '700',
                        padding: '3px 7px',
                        borderRadius: '12px',
                        backgroundColor: esHoy ? '#8B1E1E' : 'transparent',
                        color: esHoy ? '#FFFFFF' : '#64748B'
                      }}
                    >
                      {fechaObj.getDate()}
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {eventosDelDia.map((ev, evIdx) => {
                      const esVencido = ev.fecha_programada < hoyISO && ev.estatus_prestamo !== 'LIQUIDADO' && !ev.pagado
                      const colorHex = ev.color || '#8B1E1E'

                      return (
                        <div
                          key={evIdx}
                          style={{
                            backgroundColor: ev.pagado ? '#F0FDF4' : '#FFFFFF',
                            borderLeft: `4px solid ${ev.pagado ? '#16A34A' : colorHex}`,
                            borderTop: '1px solid #E2E8F0',
                            borderRight: '1px solid #E2E8F0',
                            borderBottom: '1px solid #E2E8F0',
                            borderRadius: '4px',
                            padding: '6px 8px',
                            cursor: 'pointer',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
                          }}
                          onClick={() => {
                            if (ev.pagado) {
                              const confirmar = window.confirm(
                                `El pago de la cuota #${ev.numero_periodo} de este mes ya fue realizado.\n\n¿Desea registrar un nuevo abono para este préstamo?`
                              )
                              if (!confirmar) return
                            }

                            setModalAbono({
                              id_prestamo: ev.id_prestamo,
                              prestamista: ev.prestamista,
                              numero_periodo: ev.numero_periodo,
                              monto_cuota_sugerida: ev.monto_sugerido
                            })
                            setFormAbono((prev) => ({ ...prev, monto_abonado: ev.monto_sugerido }))
                          }}
                        >
                          <div style={{ fontWeight: '700', color: '#1E293B', fontSize: '12px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                            {ev.prestamista}
                          </div>
                          <div style={{ color: '#475569', fontSize: '11px', marginTop: '2px' }}>
                            Cuota #{ev.numero_periodo}: <strong style={{ color: '#0F172A' }}>${Number(ev.monto_sugerido).toLocaleString()}</strong>
                          </div>

                          {ev.pagado ? (
                            <div style={{ color: '#16A34A', fontWeight: '700', fontSize: '10px', marginTop: '3px', display: 'flex', alignItems: 'center', gap: '3px' }}>
                              ✓ Abonado
                            </div>
                          ) : esVencido ? (
                            <div style={{ color: '#DC2626', fontWeight: '700', fontSize: '10px', marginTop: '3px', display: 'flex', alignItems: 'center', gap: '3px' }}>
                              ⚠️ Vencido
                            </div>
                          ) : (
                            <div style={{ color: '#D97706', fontWeight: '600', fontSize: '10px', marginTop: '3px' }}>
                              • Pendiente
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>

                </div>
              )
            })}
          </div>

        </div>

      </div>

      {/* MODAL NUEVA DEUDA / PRÉSTAMO */}
      {modalNuevo && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={styles.modalBox}>
            <h3 style={{ margin: '0 0 20px 0', color: '#8B1E1E', fontSize: '18px', fontWeight: '700' }}>➕ Registrar nueva deuda</h3>
            <form onSubmit={handleCrearPrestamo}>

              {/* TIPO DE DEUDA CON AVISO DINÁMICO */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155' }}>Tipo de deuda *</label>
                <select
                  style={styles.field}
                  required
                  value={formPrestamo.tipo_deuda}
                  onChange={(e) => setFormPrestamo({ ...formPrestamo, tipo_deuda: e.target.value })}
                >
                  <option value="FINANCIEROS">Créditos financieros</option>
                  <option value="PROVEEDORES">Préstamo de proveedores</option>
                  <option value="DIVERSOS">Créditos diversos</option>
                </select>

                {/* MENSAJE EXPLICATIVO SEGÚN LA ELECCIÓN */}
                <div style={styles.infoBox}>
                  ℹ️ {obtenerMensajeTipoDeuda(formPrestamo.tipo_deuda)}
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155' }}>Acreedor / Prestamista / Banco *</label>
                <input
                  style={styles.field}
                  required
                  placeholder="Ej. BBVA, Cemix, Socio X"
                  value={formPrestamo.prestamista}
                  onChange={(e) => setFormPrestamo({ ...formPrestamo, prestamista: e.target.value })}
                />
              </div>

              {/* MÉTODO DE RECEPCIÓN DEL DINERO */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155' }}>¿Cómo ingresó el dinero? *</label>
                  <select
                    style={styles.field}
                    required
                    value={formPrestamo.cuenta_destino}
                    onChange={(e) => setFormPrestamo({ ...formPrestamo, cuenta_destino: e.target.value })}
                  >
                    <option value="TRANSFERENCIA">Transferencia</option>
                    <option value="EFECTIVO">Efectivo</option>
                  </select>
                </div>

                {formPrestamo.cuenta_destino === "TRANSFERENCIA" && (
                  <div>
                    <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155' }}>Cuenta bancaria destino</label>
                    <input
                      style={styles.field}
                      placeholder="Ej. Fiscal"
                      value={formPrestamo.cuenta_bancaria_destino}
                      onChange={(e) => setFormPrestamo({ ...formPrestamo, cuenta_bancaria_destino: e.target.value })}
                    />
                  </div>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155' }}>Monto otorgado ($) *</label>
                  <input
                    type="number"
                    style={styles.field}
                    required
                    value={formPrestamo.monto_original}
                    onChange={(e) => setFormPrestamo({ ...formPrestamo, monto_original: e.target.value })}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155' }}>Plazo (meses) *</label>
                  <input
                    type="number"
                    style={styles.field}
                    required
                    value={formPrestamo.plazos_meses}
                    onChange={(e) => setFormPrestamo({ ...formPrestamo, plazos_meses: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155' }}>Selecciona un color</label>
                  <input
                    type="color"
                    style={{ width: '100%', height: '42px', padding: '4px', border: '1px solid #CBD5E1', borderRadius: '6px', marginTop: '6px', cursor: 'pointer', backgroundColor: '#FFFFFF' }}
                    value={formPrestamo.color_identificador}
                    onChange={(e) => setFormPrestamo({ ...formPrestamo, color_identificador: e.target.value })}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155' }}>Fecha del primer pago</label>
                  <input
                    type="date"
                    style={styles.field}
                    value={formPrestamo.fecha_primer_pago}
                    onChange={(e) => setFormPrestamo({ ...formPrestamo, fecha_primer_pago: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="submit" style={{ ...styles.botonAccion, flex: 1 }}>
                  Guardar deuda
                </button>
                <button type="button" style={{ ...styles.botonOutlined, backgroundColor: '#F1F5F9', borderColor: '#CBD5E1', color: '#475569' }} onClick={() => setModalNuevo(false)}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL ABONO */}
      {modalAbono && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={styles.modalBox}>
            <h3 style={{ margin: '0 0 8px 0', color: '#8B1E1E', fontSize: '18px', fontWeight: '700' }}>💲 Registrar Abono</h3>
            <p style={{ fontSize: '14px', color: '#64748B', margin: '0 0 12px 0' }}>Acreedor: <strong style={{ color: '#0F172A' }}>{modalAbono.prestamista}</strong></p>

            {eventos.find(ev => ev.id_prestamo === modalAbono.id_prestamo && ev.numero_periodo === modalAbono.numero_periodo)?.pagado && (
              <div style={{ backgroundColor: '#FEF3C7', border: '1px solid #F59E0B', color: '#B45309', padding: '8px 12px', borderRadius: '6px', fontSize: '12px', marginBottom: '16px', fontWeight: '600' }}>
                ℹ️ Esta cuota ya cuenta con un pago registrado. El importe ingresado se sumará como un abono adicional.
              </div>
            )}

            <form onSubmit={handleRegistrarAbono}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155' }}>Monto ($ MXN) *</label>
                <input
                  type="number"
                  step="0.01"
                  style={styles.field}
                  required
                  value={formAbono.monto_abonado}
                  onChange={(e) => setFormAbono({ ...formAbono, monto_abonado: e.target.value })}
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155' }}>Persona que realizó el pago *</label>
                <input
                  style={styles.field}
                  required
                  placeholder="Nombre completo"
                  value={formAbono.responsable_pago}
                  onChange={(e) => setFormAbono({ ...formAbono, responsable_pago: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="submit" style={{ ...styles.botonAccion, flex: 1 }}>
                  Confirmar Pago
                </button>
                <button type="button" style={{ ...styles.botonOutlined, backgroundColor: '#F1F5F9', borderColor: '#CBD5E1', color: '#475569' }} onClick={() => setModalAbono(null)}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL HISTORIAL */}
      {modalHistorial && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={styles.modalBox}>
            <h3 style={{ margin: '0 0 20px 0', color: '#8B1E1E', fontSize: '18px', fontWeight: '700' }}>📋 Historial de Abonos</h3>
            
            {historialAbonos.length === 0 ? (
              <p style={{ fontSize: '14px', color: '#64748B', margin: '20px 0' }}>Sin pagos registrados para esta deuda.</p>
            ) : (
              <div style={{ maxHeight: '280px', overflowY: 'auto', border: '1px solid #E2E8F0', borderRadius: '6px', marginBottom: '20px' }}>
                <table style={{ width: '100%', fontSize: '13px', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ textAlign: 'left', backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#475569' }}>
                      <th style={{ padding: '10px 12px' }}>Fecha</th>
                      <th style={{ padding: '10px 12px' }}>Monto</th>
                      <th style={{ padding: '10px 12px' }}>Responsable</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historialAbonos.map((h) => (
                      <tr key={h.id_abono} style={{ borderBottom: '1px solid #F1F5F9' }}>
                        <td style={{ padding: '10px 12px', color: '#334155' }}>{h.fecha_abono}</td>
                        <td style={{ padding: '10px 12px', fontWeight: '700', color: '#8B1E1E' }}>${Number(h.monto_abonado).toLocaleString()}</td>
                        <td style={{ padding: '10px 12px', color: '#334155' }}>{h.responsable_pago}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <button style={{ ...styles.botonAccion, width: '100%' }} onClick={() => setModalHistorial(null)}>
              Cerrar
            </button>
          </div>
        </div>
      )}

    </div>
  )
}

export default CuentasPorPagar
