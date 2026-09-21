import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import logo from "../assets/TRANSPARENTE.png"

const API = "https://erp-proyecto-production.up.railway.app"

const styles = {
  page: {
    backgroundColor: '#f8f9fa',
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
    background: "rgba(0,0,0,0.4)",
    zIndex: 999
  },
  btnPrimary: {
    backgroundColor: '#8B1E1E',
    color: '#fff',
    border: 'none',
    padding: '10px 18px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  modal: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#fff',
    padding: '24px',
    borderRadius: '12px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
    zIndex: 1000,
    width: '90%',
    maxWidth: '520px',
    maxHeight: '90vh',
    overflowY: 'auto'
  },
  inputGroup: {
    marginBottom: '14px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  label: {
    fontSize: '13px',
    fontWeight: 'bold',
    color: '#444'
  },
  input: {
    padding: '9px 12px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '14px'
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
  const [modalAbono, setModalAbono] = useState(null) // almacena objeto evento/préstamo
  const [modalHistorial, setModalHistorial] = useState(null)
  const [historialAbonos, setHistorialAbonos] = useState([])

  // Formularios
  const [formPrestamo, setFormPrestamo] = useState({
    prestamista: "",
    monto_original: "",
    plazos_meses: "6",
    frecuencia: "MENSUAL",
    fecha_primer_pago: new Date().toISOString().split('T')[0],
    color_identificador: "#007bff",
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

  // Cargar préstamos y calendario
  const cargarDatos = async () => {
    setCargando(true)
    try {
      const res = await fetch(`${API}/api/prestamos`)
      const data = await res.json()
      setPrestamos(data.prestamos || [])
      setEventos(data.eventosCalendario || [])
    } catch (err) {
      console.error("Error al cargar préstamos:", err)
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    cargarDatos()
  }, [])

  // Guardar nuevo préstamo
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
          color_identificador: "#007bff",
          cuenta_destino: "TRANSFERENCIA",
          cuenta_bancaria_destino: "BBVA Fiscal"
        })
        cargarDatos()
      } else {
        alert("Error al registrar el préstamo")
      }
    } catch (err) {
      console.error(err)
    }
  }

  // Registrar abono
  const handleRegistrarAbono = async (e) => {
    e.preventDefault()
    if (!formAbono.responsable_pago.trim()) {
      alert("El nombre del responsable que entrega/autoriza el dinero es obligatorio.")
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
      } else {
        alert("Ocurrió un error al registrar el abono")
      }
    } catch (err) {
      console.error(err)
    }
  }

  // Abrir Historial
  const handleVerHistorial = async (id_prestamo) => {
    try {
      const res = await fetch(`${API}/api/prestamos/${id_prestamo}/historial`)
      const data = await res.json()
      setHistorialAbonos(data || [])
      setModalHistorial(id_prestamo)
    } catch (err) {
      console.error(err)
    }
  }

  // Render del Calendario simple (Organizado por eventos)
  const hoyStr = new Date().toISOString().split('T')[0]

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
        ⬅ Volver al Menú Principal
      </button>

      {/* 🔵 ENCABEZADO Y LOGO */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: -5, marginBottom: 20 }}>
        <img src={logo} alt="Pegatek" style={{ width: 140, objectFit: "contain", marginBottom: 6 }} />
        <h1 style={{ margin: 0, color: "#8B1E1E", fontSize: "28px", fontWeight: "bold", letterSpacing: "1px" }}>
          CUENTAS POR PAGAR
        </h1>
      </div>

      {/* ACCIONES Y BOTÓN NUEVO PRÉSTAMO */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '20px', color: '#333', margin: 0 }}>
          📌 Préstamos Activos & Control
        </h2>
        <button style={styles.btnPrimary} onClick={() => setModalNuevo(true)}>
          ➕ Registrar Nuevo Préstamo
        </button>
      </div>

      {/* 💳 TARJETAS DE PRÉSTAMOS */}
      {cargando ? (
        <p style={{ textAlign: 'center', color: '#666' }}>Cargando préstamos...</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px', marginBottom: '30px' }}>
          {prestamos.map((p) => {
            const pagado = parseFloat(p.monto_original) - parseFloat(p.saldo_pendiente)
            const porcentaje = Math.min(100, Math.round((pagado / parseFloat(p.monto_original)) * 100))
            const esLiquidado = p.estatus === 'LIQUIDADO' || parseFloat(p.saldo_pendiente) === 0

            return (
              <div
                key={p.id_prestamo}
                style={{
                  backgroundColor: '#fff',
                  borderRadius: '10px',
                  padding: '16px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  borderLeft: `6px solid ${p.color_identificador}`,
                  position: 'relative'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <h3 style={{ margin: 0, fontSize: '16px', color: '#222' }}>{p.prestamista}</h3>
                  <span
                    style={{
                      fontSize: '11px',
                      padding: '3px 8px',
                      borderRadius: '12px',
                      fontWeight: 'bold',
                      backgroundColor: esLiquidado ? '#d4edda' : '#cce5ff',
                      color: esLiquidado ? '#155724' : '#004085'
                    }}
                  >
                    {esLiquidado ? '✔️ LIQUIDADO' : 'ACTIVO'}
                  </span>
                </div>

                <div style={{ fontSize: '13px', color: '#555', marginBottom: '10px' }}>
                  <p style={{ margin: '2px 0' }}>Monto: <strong>${Number(p.monto_original).toLocaleString()} MXN</strong></p>
                  <p style={{ margin: '2px 0', color: esLiquidado ? '#155724' : '#c62828' }}>
                    Saldo Restante: <strong>${Number(p.saldo_pendiente).toLocaleString()} MXN</strong>
                  </p>
                  <p style={{ margin: '2px 0', fontSize: '12px', color: '#777' }}>
                    Cuota Sugerida: ${Number(p.monto_cuota_sugerida).toLocaleString()} / {p.frecuencia.toLowerCase()}
                  </p>
                </div>

                {/* Barra de progreso */}
                <div style={{ backgroundColor: '#e9ecef', borderRadius: '4px', height: '8px', overflow: 'hidden', marginBottom: '12px' }}>
                  <div style={{ backgroundColor: p.color_identificador, height: '100%', width: `${porcentaje}%`, transition: 'width 0.3s' }} />
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  {!esLiquidado && (
                    <button
                      style={{ ...styles.btnPrimary, padding: '6px 10px', fontSize: '12px', flex: 1, justifyContent: 'center' }}
                      onClick={() => {
                        setModalAbono({ id_prestamo: p.id_prestamo, prestamista: p.prestamista, monto_cuota_sugerida: p.monto_cuota_sugerida })
                        setFormAbono((prev) => ({ ...prev, monto_abonado: p.monto_cuota_sugerida }))
                      }}
                    >
                      💲 Abono Rápido
                    </button>
                  )}
                  <button
                    style={{ backgroundColor: '#f1f3f5', color: '#333', border: '1px solid #ced4da', padding: '6px 10px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', fontWeight: 'bold' }}
                    onClick={() => handleVerHistorial(p.id_prestamo)}
                  >
                    📋 Historial
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* 📅 CALENDARIO DE PAGOS UNIFICADO */}
      <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}>
        <h3 style={{ margin: '0 0 16px 0', color: '#8B1E1E', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          📅 Calendario Unificado de Cuotas Programadas
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px' }}>
          {eventos.map((ev, index) => {
            const esVencido = ev.fecha_programada < hoyStr && ev.estatus_prestamo !== 'LIQUIDADO'
            return (
              <div
                key={index}
                style={{
                  padding: '12px',
                  borderRadius: '8px',
                  backgroundColor: esVencido ? '#fff0f0' : '#f8f9fa',
                  borderLeft: `5px solid ${ev.color}`,
                  border: esVencido ? '1px solid #f5c6cb' : '1px solid #e9ecef'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#555' }}>
                    {ev.fecha_programada}
                  </span>
                  {esVencido ? (
                    <span style={{ color: '#d9534f', fontSize: '12px', fontWeight: 'bold' }}>⚠️ Vencido</span>
                  ) : (
                    <span style={{ color: '#28a745', fontSize: '12px', fontWeight: 'bold' }}>✔️ Vigente</span>
                  )}
                </div>
                <div style={{ fontWeight: 'bold', color: '#222', fontSize: '14px' }}>{ev.prestamista}</div>
                <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                  Cuota #{ev.numero_periodo}: <strong>${Number(ev.monto_sugerido).toLocaleString()}</strong>
                </div>
                <button
                  style={{
                    marginTop: '8px',
                    width: '100%',
                    padding: '4px 0',
                    backgroundColor: ev.color,
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '11px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
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
                  Registrar Pago Cuota #{ev.numero_periodo}
                </button>
              </div>
            )
          })}
        </div>
      </div>

      {/* 🔴 MODAL NUEVO PRÉSTAMO */}
      {modalNuevo && (
        <>
          <div style={styles.overlay} onClick={() => setModalNuevo(false)} />
          <div style={styles.modal}>
            <h3 style={{ margin: '0 0 16px 0', color: '#8B1E1E' }}>➕ Registrar Nuevo Préstamo</h3>
            <form onSubmit={handleCrearPrestamo}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Acreedor / Prestamista *</label>
                <input
                  style={styles.input}
                  required
                  placeholder="Ej. Prestamista Cementera"
                  value={formPrestamo.prestamista}
                  onChange={(e) => setFormPrestamo({ ...formPrestamo, prestamista: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Monto Recibido *</label>
                  <input
                    type="number"
                    step="0.01"
                    style={styles.input}
                    required
                    placeholder="50000"
                    value={formPrestamo.monto_original}
                    onChange={(e) => setFormPrestamo({ ...formPrestamo, monto_original: e.target.value })}
                  />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Plazo (Meses) *</label>
                  <input
                    type="number"
                    style={styles.input}
                    required
                    value={formPrestamo.plazos_meses}
                    onChange={(e) => setFormPrestamo({ ...formPrestamo, plazos_meses: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Frecuencia *</label>
                  <select
                    style={styles.input}
                    value={formPrestamo.frecuencia}
                    onChange={(e) => setFormPrestamo({ ...formPrestamo, frecuencia: e.target.value })}
                  >
                    <option value="MENSUAL">Mensual</option>
                    <option value="QUINCENAL">Quincenal</option>
                    <option value="SEMANAL">Semanal</option>
                  </select>
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Color Identificador</label>
                  <input
                    type="color"
                    style={{ ...styles.input, height: '38px', padding: '2px' }}
                    value={formPrestamo.color_identificador}
                    onChange={(e) => setFormPrestamo({ ...formPrestamo, color_identificador: e.target.value })}
                  />
                </div>
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Fecha Primer Pago *</label>
                <input
                  type="date"
                  style={styles.input}
                  required
                  value={formPrestamo.fecha_primer_pago}
                  onChange={(e) => setFormPrestamo({ ...formPrestamo, fecha_primer_pago: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Cuenta Destino *</label>
                  <select
                    style={styles.input}
                    value={formPrestamo.cuenta_destino}
                    onChange={(e) => setFormPrestamo({ ...formPrestamo, cuenta_destino: e.target.value })}
                  >
                    <option value="TRANSFERENCIA">Banco / Transferencia</option>
                    <option value="EFECTIVO">Caja / Efectivo</option>
                  </select>
                </div>
                {formPrestamo.cuenta_destino === "TRANSFERENCIA" && (
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Nombre Cuenta Banco</label>
                    <input
                      style={styles.input}
                      placeholder="BBVA Fiscal"
                      value={formPrestamo.cuenta_bancaria_destino}
                      onChange={(e) => setFormPrestamo({ ...formPrestamo, cuenta_bancaria_destino: e.target.value })}
                    />
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                <button type="submit" style={{ ...styles.btnPrimary, flex: 1, justifyContent: 'center' }}>
                  Guardar Préstamo
                </button>
                <button
                  type="button"
                  style={{ backgroundColor: '#ccc', border: 'none', padding: '10px 16px', borderRadius: '6px', cursor: 'pointer' }}
                  onClick={() => setModalNuevo(false)}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </>
      )}

      {/* 🔴 MODAL REGISTRAR ABONO */}
      {modalAbono && (
        <>
          <div style={styles.overlay} onClick={() => setModalAbono(null)} />
          <div style={styles.modal}>
            <h3 style={{ margin: '0 0 10px 0', color: '#8B1E1E' }}>💲 Registrar Abono</h3>
            <p style={{ margin: '0 0 16px 0', fontSize: '13px', color: '#666' }}>
              Prestamista: <strong>{modalAbono.prestamista}</strong>
            </p>

            <form onSubmit={handleRegistrarAbono}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Monto a Abonar ($ MXN) *</label>
                <input
                  type="number"
                  step="0.01"
                  style={styles.input}
                  required
                  value={formAbono.monto_abonado}
                  onChange={(e) => setFormAbono({ ...formAbono, monto_abonado: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Origen del Dinero *</label>
                  <select
                    style={styles.input}
                    value={formAbono.origen_pago}
                    onChange={(e) => setFormAbono({ ...formAbono, origen_pago: e.target.value })}
                  >
                    <option value="EFECTIVO">Efectivo / Caja</option>
                    <option value="TRANSFERENCIA">Transferencia / Banco</option>
                  </select>
                </div>
                {formAbono.origen_pago === "TRANSFERENCIA" && (
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Cuenta Salida</label>
                    <input
                      style={styles.input}
                      placeholder="BBVA Fiscal"
                      value={formAbono.cuenta_bancaria_salida}
                      onChange={(e) => setFormAbono({ ...formAbono, cuenta_bancaria_salida: e.target.value })}
                    />
                  </div>
                )}
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Responsable que Entrega / Autoriza *</label>
                <input
                  style={styles.input}
                  required
                  placeholder="Nombre de quien entregó el dinero"
                  value={formAbono.responsable_pago}
                  onChange={(e) => setFormAbono({ ...formAbono, responsable_pago: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Fecha del Abono *</label>
                  <input
                    type="date"
                    style={styles.input}
                    required
                    value={formAbono.fecha_abono}
                    onChange={(e) => setFormAbono({ ...formAbono, fecha_abono: e.target.value })}
                  />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Comprobante / Folio</label>
                  <input
                    style={styles.input}
                    placeholder="Opción o folio"
                    value={formAbono.num_comprobante}
                    onChange={(e) => setFormAbono({ ...formAbono, num_comprobante: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                <button type="submit" style={{ ...styles.btnPrimary, flex: 1, justifyContent: 'center' }}>
                  Confirmar Abono
                </button>
                <button
                  type="button"
                  style={{ backgroundColor: '#ccc', border: 'none', padding: '10px 16px', borderRadius: '6px', cursor: 'pointer' }}
                  onClick={() => setModalAbono(null)}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </>
      )}

      {/* 🔴 MODAL HISTORIAL DE ABONOS */}
      {modalHistorial && (
        <>
          <div style={styles.overlay} onClick={() => setModalHistorial(null)} />
          <div style={{ ...styles.modal, maxWidth: '600px' }}>
            <h3 style={{ margin: '0 0 16px 0', color: '#8B1E1E' }}>📋 Historial de Abonos Realizados</h3>

            {historialAbonos.length === 0 ? (
              <p style={{ color: '#666', textAlign: 'center' }}>Aún no se han registrado abonos para este préstamo.</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f1f3f5', borderBottom: '2px solid #dee2e6', textAlign: 'left' }}>
                      <th style={{ padding: '8px' }}>Fecha Abono</th>
                      <th style={{ padding: '8px' }}>Monto</th>
                      <th style={{ padding: '8px' }}>Origen</th>
                      <th style={{ padding: '8px' }}>Responsable</th>
                      <th style={{ padding: '8px' }}>Folio</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historialAbonos.map((h) => (
                      <tr key={h.id_abono} style={{ borderBottom: '1px solid #e9ecef' }}>
                        <td style={{ padding: '8px' }}>{h.fecha_abono}</td>
                        <td style={{ padding: '8px', fontWeight: 'bold', color: '#155724' }}>
                          ${Number(h.monto_abonado).toLocaleString()}
                        </td>
                        <td style={{ padding: '8px' }}>{h.origen_pago}</td>
                        <td style={{ padding: '8px' }}>{h.responsable_pago}</td>
                        <td style={{ padding: '8px' }}>{h.num_comprobante || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <button
              style={{ ...styles.btnPrimary, width: '100%', justifyContent: 'center', marginTop: '20px' }}
              onClick={() => setModalHistorial(null)}
            >
              Cerrar Historial
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default CuentasPorPagar
