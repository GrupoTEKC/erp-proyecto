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
    width: '720px',
    maxWidth: '95%',
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
  },
  badgeCirculante: {
    display: 'inline-block',
    backgroundColor: '#DCFCE7',
    color: '#15803D',
    fontSize: '11px',
    fontWeight: '700',
    padding: '2px 8px',
    borderRadius: '4px',
    border: '1px solid #86EFAC'
  },
  badgeFijo: {
    display: 'inline-block',
    backgroundColor: '#DBEAFE',
    color: '#1D4ED8',
    fontSize: '11px',
    fontWeight: '700',
    padding: '2px 8px',
    borderRadius: '4px',
    border: '1px solid #93C5FD'
  }
}

function CuentasPorPagar() {
  const navigate = useNavigate()
  const [menuAbierto, setMenuAbierto] = useState(false)
  const [prestamos, setPrestamos] = useState([])
  const [eventos, setEventos] = useState([])
  const [cargando, setCargando] = useState(true)

  // Filtro de Pasivos (TODOS, CIRCULANTES, FIJOS)
  const [filtroTipoPasivo, setFiltroTipoPasivo] = useState("TODOS")

  // Modales
  const [modalNuevo, setModalNuevo] = useState(false)
  const [modalAbono, setModalAbono] = useState(null)
  const [modalHistorial, setModalHistorial] = useState(null)
  const [historialAbonos, setHistorialAbonos] = useState([])
  const [prestamosSeleccionados, setPrestamosSeleccionados] = useState([])

  // Modal de Advertencia de Sobrepago
  const [modalSobrepago, setModalSobrepago] = useState(null)

  // Catálogo de materias primas para proveedores
  const [materiasPrimasCatalogo, setMateriasPrimasCatalogo] = useState([])
  
  // Lista de productos del proveedor con 1 renglón inicial
  const [productosProveedor, setProductosProveedor] = useState([
    { id_materia: "", nombre_material: "", unidad_medida: "BULTOS", cantidad: "", toneladas_equivalentes: 0, precio_unitario: "", subtotal: 0 }
  ])

  // Días de crédito para proveedores
  const [diasCredito, setDiasCredito] = useState("30")

  // Estado del mes/año seleccionado para el calendario
  const hoy = new Date()
  const [mesSeleccionado, setMesSeleccionado] = useState(hoy.getMonth())
  const [anioSeleccionado, setAnioSeleccionado] = useState(hoy.getFullYear())

  // Formularios
  const [formPrestamo, setFormPrestamo] = useState({
    prestamista: "",
    tipo_deuda: "FINANCIEROS",
    numero_nota: "",
    monto_original: "",
    monto_cuota_sugerida: "",
    plazos_meses: "6",
    frecuencia: "MENSUAL",
    fecha_primer_pago: new Date().toISOString().split('T')[0],
    fecha_recepcion: new Date().toISOString().split('T')[0],
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
    fecha_abono: new Date().toISOString().split('T')[0],
    fecha_real_pago: new Date().toISOString().split('T')[0]
  })

  // CÁLCULO AUTOMÁTICO DE FECHA LÍMITE DE PAGO (Visible y de solo lectura para validación)
  useEffect(() => {
    if (formPrestamo.fecha_recepcion && diasCredito !== "") {
      const fechaRec = new Date(formPrestamo.fecha_recepcion + "T00:00:00")
      fechaRec.setDate(fechaRec.getDate() + Number(diasCredito))
      const fechaCalculada = fechaRec.toISOString().split('T')[0]
      setFormPrestamo(prev => ({ ...prev, fecha_primer_pago: fechaCalculada }))
    }
  }, [formPrestamo.fecha_recepcion, diasCredito])

  // DETERMINACIÓN AUTOMÁTICA DE PASIVO CIRCULANTE O FIJO (<= 365 días = Circulante, > 365 días = Fijo)
  const esPasivoCirculanteProveedor = Number(diasCredito || 0) <= 365

  // CÁLCULOS DINÁMICOS PARA FORMULARIO PRÉSTAMO FINANCIERO
  const montoOriginalNum = Number(formPrestamo.monto_original) || 0
  const montoCuotaNum = Number(formPrestamo.monto_cuota_sugerida) || 0
  const plazosMesesNum = Number(formPrestamo.plazos_meses) || 0

  const montoTotalPagarFinanciero = montoCuotaNum * plazosMesesNum
  const interesGenerado = montoTotalPagarFinanciero - montoOriginalNum

  // Cálculo total para Proveedores
  const totalProveedorCalculado = productosProveedor.reduce((acc, p) => acc + (Number(p.subtotal) || 0), 0)

  const esValidoGuardar = formPrestamo.tipo_deuda === "PROVEEDORES" 
    ? (formPrestamo.prestamista.trim() !== "" && productosProveedor.some(p => p.id_materia && Number(p.cantidad) > 0))
    : (montoOriginalNum > 0 && plazosMesesNum > 0 && montoCuotaNum > 0 && montoTotalPagarFinanciero >= montoOriginalNum)

  // Cargar Préstamos y Catálogo de Materias Primas
  const cargarDatos = async () => {
    setCargando(true)
    try {
      const res = await fetch(`${API}/api/prestamos`)
      const data = await res.json()
      const listP = data.prestamos || []
      setPrestamos(listP)
      setEventos(data.eventosCalendario || [])
      setPrestamosSeleccionados(listP.map(p => p.id_prestamo))

      const resMp = await fetch(`${API}/api/materias-primas`)
      const dataMp = await resMp.json()
      if (dataMp.success) {
        setMateriasPrimasCatalogo(dataMp.data || [])
      }
    } catch (err) {
      console.error("Error al cargar datos:", err)
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    cargarDatos()
  }, [])

  // Manejar cambios en los renglones de materias primas
  const handleCambioItemProveedor = (index, campo, valor) => {
    const nuevos = [...productosProveedor]
    nuevos[index][campo] = valor

    if (campo === "id_materia") {
      const encontrada = materiasPrimasCatalogo.find(m => String(m.id_materia) === String(valor))
      if (encontrada) {
        nuevos[index].nombre_material = encontrada.nombre
        nuevos[index].precio_unitario = encontrada.precio_unitario
      } else {
        nuevos[index].nombre_material = ""
        nuevos[index].precio_unitario = ""
      }
    }

    const cant = Number(nuevos[index].cantidad) || 0
    const prec = Number(nuevos[index].precio_unitario) || 0
    nuevos[index].subtotal = cant * prec

    // Cálculo automático de toneladas si elige BULTOS (1 tonelada = 40 bultos)
    if (nuevos[index].unidad_medida === "BULTOS") {
      nuevos[index].toneladas_equivalentes = cant / 40
    } else if (nuevos[index].unidad_medida === "TONELADAS") {
      nuevos[index].toneladas_equivalentes = cant
    } else {
      nuevos[index].toneladas_equivalentes = 0
    }

    setProductosProveedor(nuevos)
  }

  const agregarRenglonProveedor = () => {
    setProductosProveedor([
      ...productosProveedor,
      { id_materia: "", nombre_material: "", unidad_medida: "BULTOS", cantidad: "", toneladas_equivalentes: 0, precio_unitario: "", subtotal: 0 }
    ])
  }

  const eliminarRenglonProveedor = (index) => {
    if (productosProveedor.length === 1) return
    const nuevos = productosProveedor.filter((_, idx) => idx !== index)
    setProductosProveedor(nuevos)
  }

  // Guardar Préstamo
  const handleCrearPrestamo = async (e) => {
    e.preventDefault()
    if (!esValidoGuardar) return

    try {
      if (formPrestamo.tipo_deuda === "PROVEEDORES") {
        const bodyData = {
          prestamista: formPrestamo.prestamista,
          numero_nota: formPrestamo.numero_nota,
          clasificacion_pasivo: esPasivoCirculanteProveedor ? "CIRCULANTE" : "FIJO",
          fecha_recepcion: formPrestamo.fecha_recepcion,
          fecha_limite_pago: formPrestamo.fecha_primer_pago,
          productos: productosProveedor.filter(p => p.id_materia && Number(p.cantidad) > 0)
        }

        const res = await fetch(`${API}/api/prestamos/proveedores`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bodyData)
        })

        const data = await res.json()
        if (res.ok && data.success) {
          setModalNuevo(false)
          setProductosProveedor([
            { id_materia: "", nombre_material: "", unidad_medida: "BULTOS", cantidad: "", toneladas_equivalentes: 0, precio_unitario: "", subtotal: 0 }
          ])
          setFormPrestamo({
            prestamista: "",
            tipo_deuda: "FINANCIEROS",
            numero_nota: "",
            monto_original: "",
            monto_cuota_sugerida: "",
            plazos_meses: "6",
            frecuencia: "MENSUAL",
            fecha_primer_pago: new Date().toISOString().split('T')[0],
            fecha_recepcion: new Date().toISOString().split('T')[0],
            color_identificador: "#8B1E1E",
            cuenta_destino: "TRANSFERENCIA",
            cuenta_bancaria_destino: "Fiscal"
          })
          cargarDatos()
        } else {
          alert(data.error || "Error al registrar préstamo de proveedor.")
        }
      } else {
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
            numero_nota: "",
            monto_original: "",
            monto_cuota_sugerida: "",
            plazos_meses: "6",
            frecuencia: "MENSUAL",
            fecha_primer_pago: new Date().toISOString().split('T')[0],
            fecha_recepcion: new Date().toISOString().split('T')[0],
            color_identificador: "#8B1E1E",
            cuenta_destino: "TRANSFERENCIA",
            cuenta_bancaria_destino: "Fiscal"
          })
          cargarDatos()
        }
      }
    } catch (err) {
      console.error(err)
    }
  }

  // Registrar Abono
  const ejecutarAbono = async (permitirSobrepago = false) => {
    try {
      const res = await fetch(`${API}/api/prestamos/abono`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_prestamo: modalAbono.id_prestamo,
          numero_periodo: modalAbono.numero_periodo || 1,
          ...formAbono,
          permitir_sobrepago: permitirSobrepago
        })
      })

      const data = await res.json()

      if (!res.ok && data.requiere_confirmacion) {
        setModalSobrepago(data)
        return
      }

      if (res.ok) {
        setModalSobrepago(null)
        setModalAbono(null)
        setFormAbono({
          monto_abonado: "",
          origen_pago: "EFECTIVO",
          cuenta_bancaria_salida: "",
          responsable_pago: "",
          num_comprobante: "",
          fecha_abono: new Date().toISOString().split('T')[0],
          fecha_real_pago: new Date().toISOString().split('T')[0]
        })
        cargarDatos()
      } else {
        alert(data.error || "Ocurrió un error al registrar el abono.")
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleRegistrarAbono = (e) => {
    e.preventDefault()
    if (!formAbono.responsable_pago.trim()) {
      alert("El responsable es obligatorio.")
      return
    }
    ejecutarAbono(false)
  }

  const handleConfirmarSobrepago = () => {
    ejecutarAbono(true)
  }

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

  const prestamosFiltrados = prestamos.filter((p) => {
    const clasificacion = p.clasificacion_pasivo || (Number(p.plazos_restantes ?? p.plazos_meses) <= 12 ? 'CIRCULANTE' : 'FIJO')
    if (filtroTipoPasivo === "CIRCULANTES") return clasificacion === 'CIRCULANTE'
    if (filtroTipoPasivo === "FIJOS") return clasificacion === 'FIJO'
    return true
  })

  const idsPrestamosVisibles = prestamosFiltrados.map((p) => p.id_prestamo)

  const nombresMeses = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ]

  const obtenerDiasMes = (mes, anio) => {
    const primerDia = new Date(anio, mes, 1)
    const ultimoDia = new Date(anio, mes + 1, 0)
    let diaSemanaInicio = primerDia.getDay() - 1
    if (diaSemanaInicio === -1) diaSemanaInicio = 6
    const totalDias = ultimoDia.getDate()
    const celdas = []
    for (let i = 0; i < diaSemanaInicio; i++) celdas.push(null)
    for (let d = 1; d <= totalDias; d++) celdas.push(new Date(anio, mes, d))
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

  const obtenerMensajeTipoDeuda = (tipo) => {
    switch (tipo) {
      case "PROVEEDORES":
        return "Haz seleccionado proveedores: Crédito directo de materia prima. La fecha límite y clasificación de pasivo se calculan y validan de forma automática."
      case "FINANCIEROS":
        return "Haz seleccionado créditos financieros: Otorgados por instituciones bancarias."
      case "DIVERSOS":
        return "Haz seleccionado créditos diversos: Acreedores varios o préstamos de terceros."
      default:
        return ""
    }
  }

  return (
    <div style={styles.page}>
      
      {!menuAbierto && (
        <button style={styles.hamburger} onClick={() => setMenuAbierto(true)}>
          ☰
        </button>
      )}

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

      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '28px', width: '100%', alignItems: 'start' }}>
        
        <div style={styles.cardPanel}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
            <img src={logo} alt="Logo" style={{ height: 128, objectFit: "contain" }} />
          </div>

          <button style={{ ...styles.botonAccion, width: '100%', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }} onClick={() => setModalNuevo(true)}>
            ➕ Registrar credito/prestamo
          </button>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '12px', fontWeight: '700', color: '#64748B', display: 'block', marginBottom: '6px', textTransform: 'uppercase' }}>
              Clasificación de pasivo
            </label>
            <select
              style={{ ...styles.selectFiltro, width: '100%' }}
              value={filtroTipoPasivo}
              onChange={(e) => setFiltroTipoPasivo(e.target.value)}
            >
             <option value="TODOS">TODOS (Circulantes y Fijos)</option>
             <option value="CIRCULANTES">PASIVOS CIRCULANTES</option>
             <option value="FIJOS">PASIVOS FIJOS</option>
            </select>
          </div>

          <h3 style={styles.subTitle}>Deudas activas</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {prestamosFiltrados.length === 0 ? (
              <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>No hay deudas en esta clasificación.</p>
            ) : (
              prestamosFiltrados.map((p) => {
                const totalPagado = Number(p.monto_pagado || 0)
                const totalMonto = Number(p.monto_original || 1)
                const pct = Math.min(100, Math.round((totalPagado / totalMonto) * 100))
                const colorHex = p.color_identificador || '#8B1E1E'
                const esCirculante = p.clasificacion_pasivo === 'CIRCULANTE' || (Number(p.plazos_restantes ?? p.plazos_meses) <= 12)

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

                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginLeft: '24px', marginBottom: '6px', flexWrap: 'wrap' }}>
                      {p.tipo_deuda && (
                        <span style={{ fontSize: '10px', fontWeight: '700', color: '#64748B' }}>
                          [{p.tipo_deuda}]
                        </span>
                      )}
                      <span style={esCirculante ? styles.badgeCirculante : styles.badgeFijo}>
                        {esCirculante ? "CIRCULANTE" : "FIJO"}
                      </span>
                    </div>

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
        
        <div style={styles.cardPanel}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
            <h2 style={{ margin: 0, fontSize: '22px', color: '#1E293B', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span>📅</span> {nombresMeses[mesSeleccionado]} {anioSeleccionado}
            </h2>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button style={styles.botonNav} onClick={() => cambiarMes(-1)}>◀</button>
              <select style={styles.selectFiltro} value={mesSeleccionado} onChange={(e) => setMesSeleccionado(parseInt(e.target.value))}>
                {nombresMeses.map((m, idx) => (<option key={idx} value={idx}>{m}</option>))}
              </select>
              <select style={styles.selectFiltro} value={anioSeleccionado} onChange={(e) => setAnioSeleccionado(parseInt(e.target.value))}>
                {[2025, 2026, 2027, 2028].map((a) => (<option key={a} value={a}>{a}</option>))}
              </select>
              <button style={styles.botonNav} onClick={() => cambiarMes(1)}>▶</button>
              <button style={{ ...styles.botonOutlined, marginLeft: '8px' }} onClick={() => { setMesSeleccionado(hoy.getMonth()); setAnioSeleccionado(hoy.getFullYear()) }}>
                Mes Actual
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', backgroundColor: '#8B1E1E', color: '#FFFFFF', borderRadius: '8px 8px 0 0', fontWeight: '700', fontSize: '13px', textAlign: 'center', padding: '12px 0' }}>
            <span>LUN</span><span>MAR</span><span>MIÉ</span><span>JUE</span><span>VIE</span><span>SÁB</span><span>DOM</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderLeft: '1px solid #E2E8F0', borderBottom: '1px solid #E2E8F0', borderRadius: '0 0 8px 8px', overflow: 'hidden' }}>
            {diasCalendario.map((fechaObj, idx) => {
              if (!fechaObj) return <div key={idx} style={{ minHeight: '120px', backgroundColor: '#F8FAFC', borderRight: '1px solid #E2E8F0', borderTop: '1px solid #E2E8F0' }} />

              const y = fechaObj.getFullYear()
              const m = String(fechaObj.getMonth() + 1).padStart(2, '0')
              const d = String(fechaObj.getDate()).padStart(2, '0')
              const isoFecha = `${y}-${m}-${d}`
              const esHoy = isoFecha === hoyISO
              const eventosDelDia = eventos.filter(ev => ev.fecha_programada === isoFecha && prestamosSeleccionados.includes(ev.id_prestamo) && idsPrestamosVisibles.includes(ev.id_prestamo))

              return (
                <div key={idx} style={{ minHeight: '120px', padding: '8px', borderRight: '1px solid #E2E8F0', borderTop: '1px solid #E2E8F0', backgroundColor: esHoy ? '#FEF2F2' : '#FFFFFF', boxSizing: 'border-box' }}>
                  <div style={{ textAlign: 'right', marginBottom: '6px' }}>
                    <span style={{ fontSize: '12px', fontWeight: '700', padding: '3px 7px', borderRadius: '12px', backgroundColor: esHoy ? '#8B1E1E' : 'transparent', color: esHoy ? '#FFFFFF' : '#64748B' }}>
                      {fechaObj.getDate()}
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {eventosDelDia.map((ev, evIdx) => {
                      const esVencido = ev.fecha_programada < hoyISO && ev.estatus_prestamo !== 'LIQUIDADO' && !ev.pagado
                      const colorHex = ev.color || '#8B1E1E'

                      return (
                        <div key={evIdx} style={{ backgroundColor: ev.pagado ? '#F0FDF4' : '#FFFFFF', borderLeft: `4px solid ${ev.pagado ? '#16A34A' : colorHex}`, border: '1px solid #E2E8F0', borderRadius: '4px', padding: '6px 8px', cursor: 'pointer', boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}
                          onClick={() => {
                            if (ev.pagado && !window.confirm(`El pago de la cuota #${ev.numero_periodo} ya fue realizado.\n\n¿Desea registrar un nuevo abono?`)) return
                            setModalAbono({ id_prestamo: ev.id_prestamo, prestamista: ev.prestamista, numero_periodo: ev.numero_periodo, monto_cuota_sugerida: ev.monto_sugerido })
                            setFormAbono((prev) => ({ ...prev, monto_abonado: ev.monto_sugerido }))
                          }}>
                          <div style={{ fontWeight: '700', color: '#1E293B', fontSize: '12px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ev.prestamista}</div>
                          <div style={{ color: '#475569', fontSize: '11px', marginTop: '2px' }}>Cuota #{ev.numero_periodo}: <strong style={{ color: '#0F172A' }}>${Number(ev.monto_sugerido).toLocaleString()}</strong></div>
                          {ev.pagado ? <div style={{ color: '#16A34A', fontWeight: '700', fontSize: '10px', marginTop: '3px' }}>✓ Abonado</div> : esVencido ? <div style={{ color: '#DC2626', fontWeight: '700', fontSize: '10px', marginTop: '3px' }}>⚠️ Vencido</div> : <div style={{ color: '#D97706', fontWeight: '600', fontSize: '10px', marginTop: '3px' }}>• Pendiente</div>}
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

      {modalNuevo && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={styles.modalBox}>
            <h3 style={{ margin: '0 0 20px 0', color: '#8B1E1E', fontSize: '18px', fontWeight: '700' }}>➕ Registrar credito/prestamo</h3>
            <form onSubmit={handleCrearPrestamo}>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155' }}>Tipo de deuda *</label>
                <select style={styles.field} required value={formPrestamo.tipo_deuda} onChange={(e) => setFormPrestamo({ ...formPrestamo, tipo_deuda: e.target.value })}>
                  <option value="FINANCIEROS">CREDITOS FINANCIEROS</option>
                  <option value="PROVEEDORES">PROVEEDORES</option>
                  <option value="DIVERSOS">CREDITOS DIVERSOS</option>
                </select>
                <div style={styles.infoBox}>ℹ {obtenerMensajeTipoDeuda(formPrestamo.tipo_deuda)}</div>
              </div>

              {formPrestamo.tipo_deuda === "PROVEEDORES" ? (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                    <div>
                      <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155' }}>Proveedor / Prestamista *</label>
                      <input style={styles.field} required placeholder="Ej. Cemento y Cal Veracruz" value={formPrestamo.prestamista} onChange={(e) => setFormPrestamo({ ...formPrestamo, prestamista: e.target.value })} />
                    </div>
                    <div>
                      <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155' }}>Número de Nota / Folio</label>
                      <input style={styles.field} placeholder="Ej. A-1049" value={formPrestamo.numero_nota} onChange={(e) => setFormPrestamo({ ...formPrestamo, numero_nota: e.target.value })} />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                    <div>
                      <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155' }}>Fecha Recepción *</label>
                      <input type="date" style={styles.field} required value={formPrestamo.fecha_recepcion} onChange={(e) => setFormPrestamo({ ...formPrestamo, fecha_recepcion: e.target.value })} />
                    </div>
                    <div>
                      <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155' }}>Días de Crédito *</label>
                      <input type="number" style={styles.field} required placeholder="Ej. 30" value={diasCredito} onChange={(e) => setDiasCredito(e.target.value)} />
                    </div>
                    <div>
                      <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155' }}>Fecha Límite (Calculada)</label>
                      <input type="date" style={{ ...styles.field, backgroundColor: '#F8FAFC', fontWeight: 'bold', color: '#8B1E1E' }} readOnly value={formPrestamo.fecha_primer_pago} />
                    </div>
                  </div>

                  {/* ETIQUETA AUTOMÁTICA DE CLASIFICACIÓN DE PASIVO */}
                  <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '13px', fontWeight: '600', color: '#334155' }}>Clasificación detectada:</span>
                    {esPasivoCirculanteProveedor ? (
                      <span style={styles.badgeCirculante}>🟢 PASIVO CIRCULANTE (≤ 365 días)</span>
                    ) : (
                      <span style={styles.badgeFijo}>🔵 PASIVO FIJO (&gt; 365 días)</span>
                    )}
                  </div>

                  {/* SECCIÓN DE MATERIAS PRIMAS */}
                  <div style={{ border: '1px solid #CBD5E1', padding: '16px', borderRadius: '8px', marginBottom: '16px', backgroundColor: '#F8FAFC' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <h4 style={{ margin: 0, color: '#8B1E1E', fontSize: '15px' }}>📦 Materias Primas de la Nota</h4>
                      <button type="button" onClick={agregarRenglonProveedor} style={{ ...styles.botonAccion, padding: '6px 12px', fontSize: '12px' }}>
                        ➕ Agregar otro material
                      </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {productosProveedor.map((prod, pIdx) => (
                        <div key={pIdx} style={{ backgroundColor: '#FFFFFF', padding: '12px', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
                          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr auto', gap: '8px', alignItems: 'center' }}>
                            <div>
                              <label style={{ fontSize: '11px', fontWeight: '600', color: '#64748B', display: 'block' }}>Material *</label>
                              <select style={styles.field} value={prod.id_materia} onChange={(e) => handleCambioItemProveedor(pIdx, "id_materia", e.target.value)}>
                                <option value="">-- Selecciona material --</option>
                                {materiasPrimasCatalogo.map((m) => (
                                  <option key={m.id_materia} value={m.id_materia}>{m.nombre} ({m.categoria})</option>
                                ))}
                              </select>
                            </div>

                            <div>
                              <label style={{ fontSize: '11px', fontWeight: '600', color: '#64748B', display: 'block' }}>Cantidad *</label>
                              <input type="number" step="0.01" style={styles.field} placeholder="Cantidad" value={prod.cantidad} onChange={(e) => handleCambioItemProveedor(pIdx, "cantidad", e.target.value)} />
                            </div>

                            <div>
                              <label style={{ fontSize: '11px', fontWeight: '600', color: '#64748B', display: 'block' }}>Unidad *</label>
                              <select style={styles.field} value={prod.unidad_medida} onChange={(e) => handleCambioItemProveedor(pIdx, "unidad_medida", e.target.value)}>
                                <option value="BULTOS">Bultos</option>
                                <option value="TONELADAS">Toneladas</option>
                                <option value="PIEZAS">Piezas</option>
                                <option value="SUPERSACOS">Supersacos</option>
                              </select>
                            </div>

                            <div>
                              <label style={{ fontSize: '11px', fontWeight: '600', color: '#64748B', display: 'block' }}>Precio Unit. *</label>
                              <input type="number" step="0.0001" style={styles.field} placeholder="Precio Unit." value={prod.precio_unitario} onChange={(e) => handleCambioItemProveedor(pIdx, "precio_unitario", e.target.value)} />
                            </div>

                            <div style={{ textAlign: 'center', paddingTop: '16px' }}>
                              {productosProveedor.length > 1 && (
                                <button type="button" onClick={() => eliminarRenglonProveedor(pIdx)} style={{ border: 'none', background: 'none', color: '#DC2626', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}>
                                  ❌
                                </button>
                              )}
                            </div>
                          </div>

                          {/* INFORMACIÓN VISUAL DE TONELADAS EQUIVALENTES SI ES BULTOS O TONELADAS */}
                          {prod.unidad_medida === "BULTOS" && Number(prod.cantidad) > 0 && (
                            <div style={{ marginTop: '8px', fontSize: '12px', color: '#0369A1', backgroundColor: '#E0F2FE', padding: '4px 8px', borderRadius: '4px' }}>
                              ⚖️ Conversión automática: <strong>{prod.cantidad} bultos</strong> equivalen a <strong>{Number(prod.toneladas_equivalentes).toFixed(4)} toneladas</strong> (división entre 40).
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    <div style={{ marginTop: '14px', textAlign: 'right', fontSize: '15px', fontWeight: '700', color: '#0F172A' }}>
                      Deuda Total Nota: <span style={{ color: '#8B1E1E' }}>${totalProveedorCalculado.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155' }}>Acreedor / Prestamista / Banco *</label>
                    <input style={styles.field} required placeholder="Ej. Banco" value={formPrestamo.prestamista} onChange={(e) => setFormPrestamo({ ...formPrestamo, prestamista: e.target.value })} />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                    <div>
                      <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155' }}>¿Cómo ingresó el dinero? *</label>
                      <select style={styles.field} required value={formPrestamo.cuenta_destino} onChange={(e) => setFormPrestamo({ ...formPrestamo, cuenta_destino: e.target.value })}>
                        <option value="TRANSFERENCIA">Transferencia</option>
                        <option value="EFECTIVO">Efectivo</option>
                      </select>
                    </div>

                    {formPrestamo.cuenta_destino === "TRANSFERENCIA" && (
                      <div>
                        <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155' }}>Cuenta bancaria destino</label>
                        <input style={styles.field} placeholder="Ej. Fiscal" value={formPrestamo.cuenta_bancaria_destino} onChange={(e) => setFormPrestamo({ ...formPrestamo, cuenta_bancaria_destino: e.target.value })} />
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                    <div>
                      <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155' }}>Monto recibido ($) *</label>
                      <input type="number" step="0.01" style={styles.field} required placeholder="Ej. 10.00" value={formPrestamo.monto_original} onChange={(e) => setFormPrestamo({ ...formPrestamo, monto_original: e.target.value })} />
                    </div>

                    <div>
                      <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155' }}>Cuota fija / abono ($) *</label>
                      <input type="number" step="0.01" style={styles.field} required placeholder="Ej. 1.30" value={formPrestamo.monto_cuota_sugerida} onChange={(e) => setFormPrestamo({ ...formPrestamo, monto_cuota_sugerida: e.target.value })} />
                    </div>

                    <div>
                      <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155' }}>N° de mensualidades *</label>
                      <input type="number" style={styles.field} required placeholder="Ej. 10" value={formPrestamo.plazos_meses} onChange={(e) => setFormPrestamo({ ...formPrestamo, plazos_meses: e.target.value })} />
                      {formPrestamo.plazos_meses !== "" && (
                        <div style={{ marginTop: '6px' }}>
                          {Number(formPrestamo.plazos_meses) <= 12 ? (
                            <span style={styles.badgeCirculante}>🟢 Pasivo circulante</span>
                          ) : (
                            <span style={styles.badgeFijo}>🔵 Pasivo fijo</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {montoOriginalNum > 0 && montoCuotaNum > 0 && plazosMesesNum > 0 && (
                    <div style={{ backgroundColor: montoTotalPagarFinanciero >= montoOriginalNum ? '#F0FDF4' : '#FEF2F2', borderLeft: `4px solid ${montoTotalPagarFinanciero >= montoOriginalNum ? '#16A34A' : '#DC2626'}`, color: montoTotalPagarFinanciero >= montoOriginalNum ? '#166534' : '#991B1B', padding: '12px', borderRadius: '6px', fontSize: '13px', marginBottom: '16px', lineHeight: '1.5' }}>
                      <div>El monto que te prestaron es de <strong>${montoOriginalNum.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</strong>.</div>
                      <div>El monto total a pagar es de <strong>${montoTotalPagarFinanciero.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</strong> ({plazosMesesNum} pagos de ${montoCuotaNum.toLocaleString('es-MX', { minimumFractionDigits: 2 })}).</div>
                    </div>
                  )}
                </>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155' }}>Selecciona un color</label>
                  <input type="color" style={{ width: '100%', height: '42px', padding: '4px', border: '1px solid #CBD5E1', borderRadius: '6px', marginTop: '6px', cursor: 'pointer', backgroundColor: '#FFFFFF' }} value={formPrestamo.color_identificador} onChange={(e) => setFormPrestamo({ ...formPrestamo, color_identificador: e.target.value })} />
                </div>
                {formPrestamo.tipo_deuda !== "PROVEEDORES" && (
                  <div>
                    <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155' }}>Fecha del primer pago</label>
                    <input type="date" style={styles.field} value={formPrestamo.fecha_primer_pago} onChange={(e) => setFormPrestamo({ ...formPrestamo, fecha_primer_pago: e.target.value })} />
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="submit" disabled={!esValidoGuardar} style={{ ...styles.botonAccion, flex: 1, opacity: esValidoGuardar ? 1 : 0.5, cursor: esValidoGuardar ? 'pointer' : 'not-allowed' }}>
                  Guardar
                </button>
                <button type="button" style={{ ...styles.botonOutlined, backgroundColor: '#F1F5F9', borderColor: '#CBD5E1', color: '#475569' }} onClick={() => setModalNuevo(false)}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {modalAbono && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={styles.modalBox}>
            <h3 style={{ margin: '0 0 8px 0', color: '#8B1E1E', fontSize: '18px', fontWeight: '700' }}>💲 Registrar Abono</h3>
            <p style={{ fontSize: '14px', color: '#64748B', margin: '0 0 12px 0' }}>Acreedor: <strong style={{ color: '#0F172A' }}>{modalAbono.prestamista}</strong></p>

            <form onSubmit={handleRegistrarAbono}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155' }}>Monto ($ MXN) *</label>
                <input type="number" step="0.01" style={styles.field} required value={formAbono.monto_abonado} onChange={(e) => setFormAbono({ ...formAbono, monto_abonado: e.target.value })} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: formAbono.origen_pago === 'TRANSFERENCIA' ? '1fr 1fr' : '1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155' }}>Método de pago *</label>
                  <select style={styles.field} required value={formAbono.origen_pago} onChange={(e) => setFormAbono({ ...formAbono, origen_pago: e.target.value })}>
                    <option value="EFECTIVO">Efectivo</option>
                    <option value="TRANSFERENCIA">Transferencia</option>
                  </select>
                </div>

                {formAbono.origen_pago === "TRANSFERENCIA" && (
                  <div>
                    <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155' }}>¿Desde qué cuenta? *</label>
                    <input style={styles.field} required placeholder="Ej. Banamex / Fiscal" value={formAbono.cuenta_bancaria_salida} onChange={(e) => setFormAbono({ ...formAbono, cuenta_bancaria_salida: e.target.value })} />
                  </div>
                )}
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155' }}>Persona que realizó el pago *</label>
                <input style={styles.field} required placeholder="Nombre completo" value={formAbono.responsable_pago} onChange={(e) => setFormAbono({ ...formAbono, responsable_pago: e.target.value })} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155' }}>Fecha real del pago *</label>
                  <input type="date" style={styles.field} required value={formAbono.fecha_real_pago} onChange={(e) => setFormAbono({ ...formAbono, fecha_real_pago: e.target.value })} />
                </div>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155' }}>Fecha de registro</label>
                  <input type="date" style={styles.field} value={formAbono.fecha_abono} onChange={(e) => setFormAbono({ ...formAbono, fecha_abono: e.target.value })} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="submit" style={{ ...styles.botonAccion, flex: 1 }}>Confirmar pago</button>
                <button type="button" style={{ ...styles.botonOutlined, backgroundColor: '#F1F5F9', borderColor: '#CBD5E1', color: '#475569' }} onClick={() => setModalAbono(null)}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {modalSobrepago && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100 }}>
          <div style={{ ...styles.modalBox, borderLeft: '6px solid #D97706' }}>
            <h3 style={{ margin: '0 0 12px 0', color: '#B45309', fontSize: '18px', fontWeight: '700' }}>⚠️ Confirmación de sobrepago</h3>
            <p style={{ fontSize: '14px', color: '#334155', lineHeight: '1.5', marginBottom: '16px' }}>El monto ingresado excede la cuota esperada o el saldo restante.</p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button type="button" style={{ ...styles.botonAccion, backgroundColor: '#D97706', flex: 1 }} onClick={handleConfirmarSobrepago}>Sí, confirmar sobrepago</button>
              <button type="button" style={{ ...styles.botonOutlined, backgroundColor: '#F1F5F9', borderColor: '#CBD5E1', color: '#475569' }} onClick={() => setModalSobrepago(null)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {modalHistorial && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={styles.modalBox}>
            <h3 style={{ margin: '0 0 20px 0', color: '#8B1E1E', fontSize: '18px', fontWeight: '700' }}>📋 Historial de Abonos</h3>
            {historialAbonos.length === 0 ? (
              <p style={{ fontSize: '14px', color: '#64748B', margin: '20px 0' }}>Sin pagos registrados.</p>
            ) : (
              <div style={{ maxHeight: '280px', overflowY: 'auto', border: '1px solid #E2E8F0', borderRadius: '6px', marginBottom: '20px' }}>
                <table style={{ width: '100%', fontSize: '13px', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ textAlign: 'left', backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#475569' }}>
                      <th style={{ padding: '10px 12px' }}>Fecha Pago</th>
                      <th style={{ padding: '10px 12px' }}>Monto</th>
                      <th style={{ padding: '10px 12px' }}>Responsable</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historialAbonos.map((h) => (
                      <tr key={h.id_abono} style={{ borderBottom: '1px solid #F1F5F9' }}>
                        <td style={{ padding: '10px 12px', color: '#334155' }}>{h.fecha_real_pago || h.fecha_abono}</td>
                        <td style={{ padding: '10px 12px', fontWeight: '700', color: '#8B1E1E' }}>${Number(h.monto_abonado).toLocaleString()}</td>
                        <td style={{ padding: '10px 12px', color: '#334155' }}>{h.responsable_pago}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <button style={{ ...styles.botonAccion, width: '100%' }} onClick={() => setModalHistorial(null)}>Cerrar</button>
          </div>
        </div>
      )}

    </div>
  )
}

export default CuentasPorPagar
