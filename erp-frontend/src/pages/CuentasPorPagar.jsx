import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import logo from "../assets/TRANSPARENTE.png"

const API = "https://erp-proyecto-production.up.railway.app"

function CuentasPorPagar() {
  const navigate = useNavigate()
  const [menuAbierto, setMenuAbierto] = useState(false)
  const [prestamos, setPrestamos] = useState([])
  const [eventos, setEventos] = useState([])
  const [cargando, setCargando] = useState(true)

  // Modales y Estados de Filtros
  const [modalNuevo, setModalNuevo] = useState(false)
  const [modalAbono, setModalAbono] = useState(null)
  const [modalHistorial, setModalHistorial] = useState(null)
  const [historialAbonos, setHistorialAbonos] = useState([])
  const [prestamosSeleccionados, setPrestamosSeleccionados] = useState([])

  // Fecha de referencia para el calendario semanal
  const [fechaReferencia, setFechaReferencia] = useState(new Date())

  // Formularios
  const [formPrestamo, setFormPrestamo] = useState({
    prestamista: "",
    monto_original: "",
    plazos_meses: "6",
    frecuencia: "MENSUAL",
    fecha_primer_pago: new Date().toISOString().split('T')[0],
    color_identificador: "#4A90E2",
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
          color_identificador: "#4A90E2",
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

  // Helpers de Fechas para la Semana
  const obtenerDiasSemana = (fechaRef) => {
    const d = new Date(fechaRef)
    const day = d.getDay()
    const diff = d.getDate() - day + (day === 0 ? -6 : 1) // Lunes
    const lunes = new Date(d.setDate(diff))

    const dias = []
    for (let i = 0; i < 5; i++) {
      const temp = new Date(lunes)
      temp.setDate(lunes.getDate() + i)
      dias.push(temp)
    }
    return dias
  }

  const diasSemana = obtenerDiasSemana(fechaReferencia)
  const nombresDias = ['LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES']
  const hoyISO = new Date().toISOString().split('T')[0]

  const toggleFiltroPrestamo = (id) => {
    if (prestamosSeleccionados.includes(id)) {
      setPrestamosSeleccionados(prestamosSeleccionados.filter(item => item !== id))
    } else {
      setPrestamosSeleccionados([...prestamosSeleccionados, id])
    }
  }

  return (
    <div style={{ backgroundColor: '#F4F6F9', minHeight: '100vh', fontFamily: 'Segoe UI, Roboto, sans-serif' }}>
      
      {/* HEADER SUPERIOR APP */}
      <header style={{ backgroundColor: '#fff', borderBottom: '1px solid #E2E8F0', padding: '12px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#8B1E1E' }} onClick={() => navigate("/")}>
            ⬅
          </button>
          <img src={logo} alt="Logo" style={{ height: '32px', objectFit: 'contain' }} />
          <h2 style={{ margin: 0, fontSize: '18px', color: '#2D3748', fontWeight: '600' }}>Cuentas por Pagar</h2>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            style={{ backgroundColor: '#4A90E2', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}
            onClick={() => setModalNuevo(true)}
          >
            + Nuevo Préstamo
          </button>
        </div>
      </header>

      {/* CONTENEDOR PRINCIPAL DOS COLUMNAS */}
      <div style={{ display: 'flex', padding: '20px', gap: '20px', maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* BARRA LATERAL IZQUIERDA (MINI CALENDARIO & FILTROS) */}
        <div style={{ width: '280px', backgroundColor: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', height: 'fit-content' }}>
          
          <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', color: '#1A202C' }}>Junio 2026</h3>
          
          {/* Mini Grilla Mes */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', textAlign: 'center', fontSize: '11px', color: '#A0AEC0', marginBottom: '20px' }}>
            <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>
            {[...Array(30)].map((_, i) => (
              <div
                key={i}
                style={{
                  padding: '6px 0',
                  borderRadius: '50%',
                  fontSize: '12px',
                  color: (i + 1) === 27 ? '#fff' : '#4A5568',
                  backgroundColor: (i + 1) === 27 ? '#4A90E2' : 'transparent',
                  fontWeight: (i + 1) === 27 ? 'bold' : 'normal'
                }}
              >
                {i + 1}
              </div>
            ))}
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #EDF2F7', margin: '16px 0' }} />

          {/* LISTA / FILTRO DE PRÉSTAMOS */}
          <h4 style={{ fontSize: '12px', letterSpacing: '0.5px', color: '#A0AEC0', margin: '0 0 12px 0', textTransform: 'uppercase' }}>
            Acreedores / Préstamos
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {prestamos.map((p) => (
              <label key={p.id_prestamo} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#2D3748', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={prestamosSeleccionados.includes(p.id_prestamo)}
                  onChange={() => toggleFiltroPrestamo(p.id_prestamo)}
                  style={{ accentColor: p.color_identificador }}
                />
                <span style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: p.color_identificador }} />
                <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.prestamista}</span>
                <button
                  style={{ border: 'none', background: 'none', color: '#A0AEC0', cursor: 'pointer', fontSize: '11px' }}
                  onClick={(e) => { e.preventDefault(); handleVerHistorial(p.id_prestamo); }}
                >
                  📋
                </button>
              </label>
            ))}
          </div>
        </div>

        {/* CALENDARIO DE VISTA SEMANAL PRINCIPAL */}
        <div style={{ flex: 1, backgroundColor: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          
          {/* HEADER DEL CALENDARIO */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ margin: 0, fontSize: '22px', color: '#1A202C', fontWeight: '600' }}>
              Semana Actual de Pagos
            </h2>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                style={{ border: '1px solid #E2E8F0', background: '#fff', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}
                onClick={() => {
                  const d = new Date(fechaReferencia)
                  d.setDate(d.getDate() - 7)
                  setFechaReferencia(d)
                }}
              >
                ◀
              </button>
              <button
                style={{ border: '1px solid #E2E8F0', background: '#fff', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}
                onClick={() => setFechaReferencia(new Date())}
              >
                HOY
              </button>
              <button
                style={{ border: '1px solid #E2E8F0', background: '#fff', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}
                onClick={() => {
                  const d = new Date(fechaReferencia)
                  d.setDate(d.getDate() + 7)
                  setFechaReferencia(d)
                }}
              >
                ▶
              </button>
            </div>
          </div>

          {/* CABECERA DE DÍAS (COLUMNAS) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', borderBottom: '1px solid #E2E8F0', paddingBottom: '12px', textAlign: 'center' }}>
            {diasSemana.map((d, index) => {
              const iso = d.toISOString().split('T')[0]
              const esHoy = iso === hoyISO
              return (
                <div key={index} style={{ padding: '4px' }}>
                  <div style={{ fontSize: '14px', fontWeight: 'bold', color: esHoy ? '#fff' : '#2D3748', backgroundColor: esHoy ? '#4A90E2' : 'transparent', borderRadius: '6px', padding: '4px 8px', display: 'inline-block' }}>
                    {d.getDate()} <span style={{ fontSize: '11px', fontWeight: 'normal', textTransform: 'uppercase' }}>{nombresDias[index]}</span>
                  </div>
                </div>
              )
            })}
          </div>

          {/* CUERPO DEL CALENDARIO / GRILLA DE TARJETAS */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px', minHeight: '480px', paddingTop: '16px', position: 'relative' }}>
            
            {diasSemana.map((d, colIndex) => {
              const fechaColISO = d.toISOString().split('T')[0]
              
              // Eventos que coinciden en este día
              const eventosDelDia = eventos.filter(ev => ev.fecha_programada === fechaColISO && prestamosSeleccionados.includes(ev.id_prestamo))

              return (
                <div key={colIndex} style={{ borderRight: colIndex < 4 ? '1px dashed #EDF2F7' : 'none', paddingRight: '8px', minHeight: '100%' }}>
                  
                  {eventosDelDia.map((ev, evIndex) => {
                    const esVencido = ev.fecha_programada < hoyISO && ev.estatus_prestamo !== 'LIQUIDADO'

                    return (
                      <div
                        key={evIndex}
                        style={{
                          backgroundColor: `${ev.color}15`,
                          borderLeft: `4px solid ${ev.color}`,
                          borderRadius: '8px',
                          padding: '10px',
                          marginBottom: '10px',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
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
                        <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#2D3748' }}>
                          {ev.prestamista}
                        </div>
                        <div style={{ fontSize: '11px', color: '#718096', margin: '4px 0' }}>
                          Cuota #{ev.numero_periodo}
                        </div>
                        <div style={{ fontSize: '12px', fontWeight: 'bold', color: ev.color }}>
                          ${Number(ev.monto_sugerido).toLocaleString()} MXN
                        </div>

                        {esVencido && (
                          <span style={{ fontSize: '10px', color: '#E53E3E', fontWeight: 'bold', backgroundColor: '#FFF5F5', padding: '2px 6px', borderRadius: '4px', display: 'inline-block', marginTop: '6px' }}>
                            ⚠️ Pendiente
                          </span>
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
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '24px', width: '420px', maxWidth: '90%' }}>
            <h3 style={{ margin: '0 0 16px 0', color: '#2D3748' }}>➕ Registrar Nuevo Préstamo</h3>
            <form onSubmit={handleCrearPrestamo}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#4A5568' }}>Acreedor *</label>
                <input
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #CBD5E0', marginTop: '4px' }}
                  required
                  placeholder="Ej. Banco / Proveedor"
                  value={formPrestamo.prestamista}
                  onChange={(e) => setFormPrestamo({ ...formPrestamo, prestamista: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#4A5568' }}>Monto Original *</label>
                  <input
                    type="number"
                    style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #CBD5E0', marginTop: '4px' }}
                    required
                    value={formPrestamo.monto_original}
                    onChange={(e) => setFormPrestamo({ ...formPrestamo, monto_original: e.target.value })}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#4A5568' }}>Plazo (Meses) *</label>
                  <input
                    type="number"
                    style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #CBD5E0', marginTop: '4px' }}
                    required
                    value={formPrestamo.plazos_meses}
                    onChange={(e) => setFormPrestamo({ ...formPrestamo, plazos_meses: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#4A5568' }}>Color Identificador</label>
                  <input
                    type="color"
                    style={{ width: '100%', height: '36px', padding: '2px', border: 'none', borderRadius: '6px', marginTop: '4px' }}
                    value={formPrestamo.color_identificador}
                    onChange={(e) => setFormPrestamo({ ...formPrestamo, color_identificador: e.target.value })}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#4A5568' }}>Fecha Primer Pago</label>
                  <input
                    type="date"
                    style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #CBD5E0', marginTop: '4px' }}
                    value={formPrestamo.fecha_primer_pago}
                    onChange={(e) => setFormPrestamo({ ...formPrestamo, fecha_primer_pago: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button type="submit" style={{ flex: 1, backgroundColor: '#4A90E2', color: '#fff', border: 'none', padding: '10px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
                  Guardar
                </button>
                <button type="button" style={{ backgroundColor: '#EDF2F7', border: 'none', padding: '10px', borderRadius: '6px', cursor: 'pointer' }} onClick={() => setModalNuevo(false)}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL ABONO */}
      {modalAbono && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '24px', width: '400px', maxWidth: '90%' }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#2D3748' }}>💲 Registrar Pago / Abono</h3>
            <p style={{ fontSize: '13px', color: '#718096', margin: '0 0 16px 0' }}>Préstamo: <strong>{modalAbono.prestamista}</strong></p>

            <form onSubmit={handleRegistrarAbono}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#4A5568' }}>Monto ($ MXN) *</label>
                <input
                  type="number"
                  step="0.01"
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #CBD5E0', marginTop: '4px' }}
                  required
                  value={formAbono.monto_abonado}
                  onChange={(e) => setFormAbono({ ...formAbono, monto_abonado: e.target.value })}
                />
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#4A5568' }}>Responsable que Entrega / Autoriza *</label>
                <input
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #CBD5E0', marginTop: '4px' }}
                  required
                  placeholder="Nombre completo"
                  value={formAbono.responsable_pago}
                  onChange={(e) => setFormAbono({ ...formAbono, responsable_pago: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button type="submit" style={{ flex: 1, backgroundColor: '#48BB78', color: '#fff', border: 'none', padding: '10px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
                  Confirmar Pago
                </button>
                <button type="button" style={{ backgroundColor: '#EDF2F7', border: 'none', padding: '10px', borderRadius: '6px', cursor: 'pointer' }} onClick={() => setModalAbono(null)}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL HISTORIAL */}
      {modalHistorial && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '24px', width: '500px', maxWidth: '90%' }}>
            <h3 style={{ margin: '0 0 16px 0', color: '#2D3748' }}>📋 Historial de Pagos</h3>
            
            {historialAbonos.length === 0 ? (
              <p style={{ fontSize: '13px', color: '#718096' }}>Sin pagos registrados.</p>
            ) : (
              <table style={{ width: '100%', fontSize: '12px', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ textAlign: 'left', borderBottom: '1px solid #E2E8F0' }}>
                    <th style={{ padding: '8px' }}>Fecha</th>
                    <th style={{ padding: '8px' }}>Monto</th>
                    <th style={{ padding: '8px' }}>Responsable</th>
                  </tr>
                </thead>
                <tbody>
                  {historialAbonos.map((h) => (
                    <tr key={h.id_abono} style={{ borderBottom: '1px solid #EDF2F7' }}>
                      <td style={{ padding: '8px' }}>{h.fecha_abono}</td>
                      <td style={{ padding: '8px', fontWeight: 'bold', color: '#38A169' }}>${Number(h.monto_abonado).toLocaleString()}</td>
                      <td style={{ padding: '8px' }}>{h.responsable_pago}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            <button style={{ width: '100%', marginTop: '20px', backgroundColor: '#EDF2F7', border: 'none', padding: '8px', borderRadius: '6px', cursor: 'pointer' }} onClick={() => setModalHistorial(null)}>
              Cerrar
            </button>
          </div>
        </div>
      )}

    </div>
  )
}

export default CuentasPorPagar
