import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import logo from "../assets/TRANSPARENTE.png"

const API = "https://erp-proyecto-production.up.railway.app"

// 🎨 ESTILOS ACTUALIZADOS SEGÚN TU SOLICITUD
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
  },
  // Clases auxiliares para mantener compatibilidad con las tablas y campos existentes
  field: {
    width: '100%',
    maxWidth: '300px',
    padding: '8px 10px',
    borderRadius: '6px',
    border: '1px solid #8B1E1E',
    marginTop: '5px'
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

function hoyISO() {
  const d = new Date()
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function normalizarFechaISO(valor) {
  if (!valor) return ''
  if (typeof valor === 'string') {
    return valor.slice(0, 10)
  }
  const d = new Date(valor)
  if (Number.isNaN(d.getTime())) return ''
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function construirFechaMes(baseFechaISO, offsetMeses, diaPago) {
  const base = normalizarFechaISO(baseFechaISO) || hoyISO()
  const [yStr, mStr] = base.split('-')
  const yearBase = Number(yStr)
  const monthIndexBase = Number(mStr) - 1 + Number(offsetMeses)

  const targetYear = yearBase + Math.floor(monthIndexBase / 12)
  const targetMonthIndex = ((monthIndexBase % 12) + 12) % 12
  const ultimoDiaMes = new Date(targetYear, targetMonthIndex + 1, 0).getDate()
  const diaDeseado = diaPago ? Math.min(Math.max(Number(diaPago), 1), ultimoDiaMes) : ultimoDiaMes

  const mm = String(targetMonthIndex + 1).padStart(2, '0')
  const dd = String(diaDeseado).padStart(2, '0')
  return `${targetYear}-${mm}-${dd}`
}

function formatoMoneda(valor) {
  const num = Number(valor) || 0
  return `$${num.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function CuentasPorCobrarDiversas() {
  const navigate = useNavigate()

  const [vistaActiva, setVistaActiva] = useState('cartera') // 'cartera' | 'calendario' | 'abonos'
  const [ventas, setVentas] = useState([])
  const [abonos, setAbonos] = useState([])
  const [loading, setLoading] = useState(false)
  const [mensaje, setMensaje] = useState(null)

  const [mesCalendario, setMesCalendario] = useState(() => hoyISO().slice(0, 7))

  const [formVenta, setFormVenta] = useState({
    deudor_nombre: '',
    concepto: '',
    monto_total: '',
    fecha_venta: hoyISO(),
    tipo_cuota: 'fija',
    num_abonos: '',
    dia_pago: '',
    monto_cuota: ''
  })

  const [modalEditar, setModalEditar] = useState({
    visible: false,
    venta: null,
    monto_total: '',
    monto_cuota: '',
    num_abonos: '',
    dia_pago: ''
  })

  const [modalAbono, setModalAbono] = useState({
    visible: false,
    venta: null,
    monto_abono: '',
    fecha_ingreso: hoyISO(),
    origen_pago: 'EFECTIVO',
    cuenta_bancaria: '',
    fiscal: false,
    observaciones: ''
  })

  const cargarDatos = async () => {
    setLoading(true)
    try {
      const [resVentas, resAbonos] = await Promise.all([
        fetch(`${API}/cxc-diversas`),
        fetch(`${API}/cxc-diversas/abonos`)
      ])

      if (resVentas.ok) {
        const dataVentas = await resVentas.json()
        setVentas(Array.isArray(dataVentas) ? dataVentas : [])
      }

      if (resAbonos.ok) {
        const dataAbonos = await resAbonos.json()
        setAbonos(Array.isArray(dataAbonos) ? dataAbonos : [])
      }
    } catch {
      setMensaje({ tipo: 'error', texto: 'No se pudieron cargar las cuentas por cobrar diversas' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    cargarDatos()
  }, [])

  const handleVentaChange = (campo, valor) => {
    setFormVenta(prev => {
      const next = { ...prev, [campo]: valor }
      if (next.tipo_cuota === 'fija' && (campo === 'monto_total' || campo === 'num_abonos')) {
        const total = Number(next.monto_total) || 0
        const cant = Number(next.num_abonos) || 0
        if (total > 0 && cant > 0 && campo === 'num_abonos') {
          next.monto_cuota = (total / cant).toFixed(2)
        }
      }
      return next
    })
  }

  const crearVenta = async (e) => {
    e.preventDefault()
    setMensaje(null)

    const montoTotal = Number(formVenta.monto_total)
    if (!formVenta.deudor_nombre.trim()) {
      return setMensaje({ tipo: 'error', texto: 'Ingresa el nombre del deudor' })
    }
    if (!formVenta.concepto.trim()) {
      return setMensaje({ tipo: 'error', texto: 'Ingresa el concepto de la deuda' })
    }
    if (!montoTotal || montoTotal <= 0) {
      return setMensaje({ tipo: 'error', texto: 'Ingresa un monto de venta válido' })
    }
    if (!formVenta.fecha_venta) {
      return setMensaje({ tipo: 'error', texto: 'Selecciona la fecha de la venta' })
    }

    let numAbonos = null
    let diaPago = null
    let montoCuota = null

    if (formVenta.tipo_cuota === 'fija') {
      numAbonos = Number(formVenta.num_abonos)
      diaPago = Number(formVenta.dia_pago)
      montoCuota = Number(formVenta.monto_cuota)

      if (!numAbonos || numAbonos < 1) {
        return setMensaje({ tipo: 'error', texto: 'Especifica el número de abonos para cuota fija' })
      }
      if (!diaPago || diaPago < 1 || diaPago > 31) {
        return setMensaje({ tipo: 'error', texto: 'Selecciona un día de pago válido (1 a 31)' })
      }
      if (!montoCuota || montoCuota <= 0) {
        return setMensaje({ tipo: 'error', texto: 'Especifica el monto de la cuota' })
      }
    }

    const payload = {
      deudor_nombre: formVenta.deudor_nombre.trim(),
      concepto: formVenta.concepto.trim(),
      monto_total: montoTotal,
      saldo_pendiente: montoTotal,
      fecha_venta: formVenta.fecha_venta,
      tipo_cuota: formVenta.tipo_cuota,
      num_abonos: numAbonos,
      dia_pago: diaPago,
      monto_cuota: montoCuota
    }

    try {
      const res = await fetch(`${API}/cxc-diversas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const data = await res.json()
      if (!res.ok) {
        return setMensaje({ tipo: 'error', texto: data.error || 'Error al registrar la cuenta' })
      }

      const nuevaVenta = {
        ...payload,
        id_venta: data.id_venta || Date.now(),
        fecha_captura: data.fecha_captura || new Date().toISOString(),
        estado: 'PENDIENTE'
      }

      setVentas(prev => [nuevaVenta, ...prev])
      setFormVenta({
        deudor_nombre: '',
        concepto: '',
        monto_total: '',
        fecha_venta: hoyISO(),
        tipo_cuota: formVenta.tipo_cuota,
        num_abonos: '',
        dia_pago: '',
        monto_cuota: ''
      })
      setMensaje({ tipo: 'ok', texto: 'Cuenta por cobrar diversa registrada correctamente' })
    } catch {
      setMensaje({ tipo: 'error', texto: 'Error de conexión al guardar la cuenta' })
    }
  }

  const abrirModalAbono = (venta) => {
    const sugerido =
      venta.tipo_cuota === 'fija' && Number(venta.monto_cuota) > 0
        ? Math.min(Number(venta.monto_cuota), Number(venta.saldo_pendiente) || Number(venta.monto_cuota)).toFixed(2)
        : ''

    setModalAbono({
      visible: true,
      venta,
      monto_abono: sugerido,
      fecha_ingreso: hoyISO(),
      origen_pago: 'EFECTIVO',
      cuenta_bancaria: '',
      fiscal: false,
      observaciones: ''
    })
  }

  const guardarAbono = async (e) => {
    e.preventDefault()
    setMensaje(null)

    const venta = modalAbono.venta
    const montoAbono = Number(modalAbono.monto_abono)

    if (!venta) return
    if (!montoAbono || montoAbono <= 0) {
      return setMensaje({ tipo: 'error', texto: 'Ingresa un monto de abono válido' })
    }
    if (!modalAbono.fecha_ingreso) {
      return setMensaje({ tipo: 'error', texto: 'Selecciona la fecha en que se recibió el dinero' })
    }

    const payload = {
      id_venta: venta.id_venta,
      monto_abono: montoAbono,
      fecha_ingreso: modalAbono.fecha_ingreso,
      origen_pago: modalAbono.origen_pago,
      cuenta_bancaria: modalAbono.origen_pago === 'TRANSFERENCIA' ? modalAbono.cuenta_bancaria.trim() || null : null,
      fiscal: modalAbono.fiscal ? 1 : 0,
      observaciones: modalAbono.observaciones.trim() || null
    }

    try {
      const res = await fetch(`${API}/cxc-diversas/abonos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const data = await res.json()
      if (!res.ok) {
        return setMensaje({ tipo: 'error', texto: data.error || 'Error al registrar el abono' })
      }

      const nuevoAbono = {
        ...payload,
        id_abono: data.id_abono || Date.now(),
        fecha_captura: data.fecha_captura || new Date().toISOString()
      }

      setAbonos(prev => [nuevoAbono, ...prev])
      setVentas(prev =>
        prev.map(v => {
          if (v.id_venta !== venta.id_venta) return v
          const abonadoPrev = Number(v.monto_total) - (Number(v.saldo_pendiente) ?? Number(v.monto_total))
          const nuevoAbonado = abonadoPrev + montoAbono
          const nuevoSaldo = Math.max(0, Number(v.monto_total) - nuevoAbonado)
          const nuevoEstado = nuevoSaldo <= 0 ? 'LIQUIDADA' : 'PARCIAL'
          return {
            ...v,
            saldo_pendiente: nuevoSaldo,
            estado: nuevoEstado
          }
        })
      )

      setModalAbono(prev => ({ ...prev, visible: false, venta: null }))
      setMensaje({ tipo: 'ok', texto: 'Abono registrado y reflejado en el calendario' })
    } catch {
      setMensaje({ tipo: 'error', texto: 'Error de conexión al registrar el abono' })
    }
  }

  const guardarEdicionVenta = async (e) => {
    e.preventDefault()
    setMensaje(null)
    const venta = modalEditar.venta
    if (!venta) return

    const nuevoMontoTotal = Number(modalEditar.monto_total)
    if (!nuevoMontoTotal || nuevoMontoTotal <= 0) {
      return setMensaje({ tipo: 'error', texto: 'Ingresa un monto de deuda válido' })
    }

    const totalAbonadoVenta = abonos
      .filter(a => a.id_venta === venta.id_venta)
      .reduce((acc, a) => acc + (Number(a.monto_abono) || 0), 0)

    const nuevoSaldo = Math.max(0, nuevoMontoTotal - totalAbonadoVenta)
    const nuevoEstado = nuevoSaldo <= 0 ? 'LIQUIDADA' : totalAbonadoVenta > 0 ? 'PARCIAL' : 'PENDIENTE'

    const payload = {
      monto_total: nuevoMontoTotal,
      saldo_pendiente: nuevoSaldo,
      num_abonos: venta.tipo_cuota === 'fija' ? Number(modalEditar.num_abonos) || venta.num_abonos : null,
      dia_pago: venta.tipo_cuota === 'fija' ? Number(modalEditar.dia_pago) || venta.dia_pago : null,
      monto_cuota: venta.tipo_cuota === 'fija' ? Number(modalEditar.monto_cuota) || venta.monto_cuota : null,
      estado: nuevoEstado
    }

    try {
      const res = await fetch(`${API}/cxc-diversas/${venta.id_venta}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        return setMensaje({ tipo: 'error', texto: data.error || 'No se pudo actualizar la deuda' })
      }
    } catch {
      return setMensaje({ tipo: 'error', texto: 'Error de conexión al actualizar la deuda' })
    }

    setVentas(prev =>
      prev.map(v => (v.id_venta === venta.id_venta ? { ...v, ...payload } : v))
    )
    setModalEditar({
      visible: false,
      venta: null,
      monto_total: '',
      monto_cuota: '',
      num_abonos: '',
      dia_pago: ''
    })
    setMensaje({ tipo: 'ok', texto: 'Monto de la deuda actualizado' })
  }

  const elementosCalendario = useMemo(() => {
    const hoy = hoyISO()
    const items = []

    ventas
      .filter(v => v.tipo_cuota === 'fija' && Number(v.num_abonos) > 0)
      .forEach(v => {
        const totalAbonadoVenta = abonos
          .filter(a => a.id_venta === v.id_venta)
          .reduce((acc, a) => acc + (Number(a.monto_abono) || 0), 0)

        const cuotaMonto = Number(v.monto_cuota) || (Number(v.monto_total) / Number(v.num_abonos))
        let restanteCubierto = totalAbonadoVenta

        for (let idx = 0; idx < Number(v.num_abonos); idx++) {
          const fechaProgramada = construirFechaMes(v.fecha_venta, idx + 1, v.dia_pago)
          const cubiertoEnCuota = Math.min(cuotaMonto, Math.max(0, restanteCubierto))
          restanteCubierto = Math.max(0, restanteCubierto - cuotaMonto)

          const estaPagada = cubiertoEnCuota + 0.009 >= cuotaMonto
          const estaVencida = !estaPagada && fechaProgramada < hoy

          if (fechaProgramada.startsWith(mesCalendario)) {
            items.push({
              key: `fija-${v.id_venta}-${idx + 1}`,
              fecha: fechaProgramada,
              deudor: v.deudor_nombre,
              concepto: v.concepto,
              tipoLabel: `Cuota fija (${idx + 1}/${v.num_abonos})`,
              monto: cuotaMonto,
              cubierto: cubiertoEnCuota,
              color: estaPagada ? 'verde' : estaVencida ? 'rojo' : 'neutro',
              estadoTexto: estaPagada ? 'Cubierta' : estaVencida ? 'Vencida' : 'Programada'
            })
          }
        }
      })

    abonos.forEach(ab => {
      const ventaAsociada = ventas.find(v => v.id_venta === ab.id_venta)
      if (!ventaAsociada || ventaAsociada.tipo_cuota !== 'libre') return

      const fechaEfectiva = normalizarFechaISO(ab.fecha_ingreso)
      if (fechaEfectiva && fechaEfectiva.startsWith(mesCalendario)) {
        items.push({
          key: `libre-${ab.id_abono}`,
          fecha: fechaEfectiva,
          deudor: ventaAsociada.deudor_nombre,
          concepto: ventaAsociada.concepto,
          tipoLabel: `Cuota libre (${ab.origen_pago})`,
          monto: Number(ab.monto_abono) || 0,
          cubierto: Number(ab.monto_abono) || 0,
          color: 'verde',
          estadoTexto: 'Abono recibido'
        })
      }
    })

    return items.sort((a, b) => a.fecha.localeCompare(b.fecha))
  }, [ventas, abonos, mesCalendario])

  return (
    <div style={styles.page}>
      <div style={styles.top}>
        <button style={styles.cancel} onClick={() => navigate(-1)}>
          ⬅ Volver
        </button>
        <button style={styles.botonAccion} onClick={cargarDatos}>
          🔄 Actualizar
        </button>
      </div>

      <div style={styles.header}>
        <div></div>
        <h1 style={styles.mainTitle}>CUENTAS POR COBRAR DIVERSAS</h1>
        <img src={logo} alt="Pegatek" style={styles.logo} />
      </div>

      <div style={styles.navBar}>
        <button
          style={styles.navTab(vistaActiva === 'cartera')}
          onClick={() => setVistaActiva('cartera')}
        >
          📋 Cartera y registro
        </button>
        <button
          style={styles.navTab(vistaActiva === 'calendario')}
          onClick={() => setVistaActiva('calendario')}
        >
          📅 Calendario mensual
        </button>
        <button
          style={styles.navTab(vistaActiva === 'abonos')}
          onClick={() => setVistaActiva('abonos')}
        >
          💰 Historial de abonos
        </button>
      </div>

      {mensaje && (
        <div
          style={{
            padding: 12,
            marginBottom: 15,
            borderRadius: 6,
            fontWeight: 'bold',
            backgroundColor: mensaje.tipo === 'error' ? '#f8d7da' : '#d4edda',
            color: mensaje.tipo === 'error' ? '#721c24' : '#155724'
          }}
        >
          {mensaje.texto}
        </div>
      )}

      {vistaActiva === 'cartera' && (
        <>
          <div style={styles.cardDiscrepancia}>
            <h2 style={styles.title}>Registrar venta / deuda diversa</h2>
            <form onSubmit={crearVenta}>
              <div style={{ display: 'flex', gap: 15, flexWrap: 'wrap' }}>
                <div style={{ flex: '1 1 220px' }}>
                  <label style={styles.filtroLabel}>Nombre del deudor</label>
                  <input
                    type="text"
                    placeholder="Ej. Juan Pérez"
                    style={styles.field}
                    value={formVenta.deudor_nombre}
                    onChange={e => handleVentaChange('deudor_nombre', e.target.value)}
                  />
                </div>

                <div style={{ flex: '1 1 220px' }}>
                  <label style={styles.filtroLabel}>Concepto de la deuda</label>
                  <input
                    type="text"
                    placeholder="Ej. Venta del Versa / Venta de montacargas"
                    style={styles.field}
                    value={formVenta.concepto}
                    onChange={e => handleVentaChange('concepto', e.target.value)}
                  />
                </div>

                <div style={{ flex: '1 1 180px' }}>
                  <label style={styles.filtroLabel}>Monto de la venta / deuda</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    placeholder="0.00"
                    style={styles.field}
                    value={formVenta.monto_total}
                    onChange={e => handleVentaChange('monto_total', e.target.value)}
                  />
                </div>

                <div style={{ flex: '1 1 180px' }}>
                  <label style={styles.filtroLabel}>Fecha de la venta</label>
                  <input
                    type="date"
                    style={styles.dateField}
                    value={formVenta.fecha_venta}
                    onChange={e => handleVentaChange('fecha_venta', e.target.value)}
                  />
                </div>

                <div style={{ flex: '1 1 180px' }}>
                  <label style={styles.filtroLabel}>Tipo de cuota</label>
                  <select
                    style={styles.dateField}
                    value={formVenta.tipo_cuota}
                    onChange={e => handleVentaChange('tipo_cuota', e.target.value)}
                  >
                    <option value="fija">Cuota fija</option>
                    <option value="libre">Cuota libre</option>
                  </select>
                </div>
              </div>

              {formVenta.tipo_cuota === 'fija' && (
                <div style={{ display: 'flex', gap: 15, flexWrap: 'wrap', marginTop: 15 }}>
                  <div style={{ flex: '1 1 180px' }}>
                    <label style={styles.filtroLabel}>Número de abonos</label>
                    <input
                      type="number"
                      min="1"
                      placeholder="Ej. 6"
                      style={styles.field}
                      value={formVenta.num_abonos}
                      onChange={e => handleVentaChange('num_abonos', e.target.value)}
                    />
                  </div>

                  <div style={{ flex: '1 1 180px' }}>
                    <label style={styles.filtroLabel}>Día de pago (1 - 31)</label>
                    <input
                      type="number"
                      min="1"
                      max="31"
                      placeholder="Ej. 15"
                      style={styles.field}
                      value={formVenta.dia_pago}
                      onChange={e => handleVentaChange('dia_pago', e.target.value)}
                    />
                  </div>

                  <div style={{ flex: '1 1 180px' }}>
                    <label style={styles.filtroLabel}>Monto de cuota (editable)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      placeholder="0.00"
                      style={styles.field}
                      value={formVenta.monto_cuota}
                      onChange={e => handleVentaChange('monto_cuota', e.target.value)}
                    />
                  </div>
                </div>
              )}

              <div style={styles.buttons}>
                <button type="submit" style={styles.save}>
                  Guardar cuenta
                </button>
              </div>
            </form>
          </div>

          <h2 style={styles.title}>Deudores diversos registrados</h2>
          {loading ? (
            <p>Cargando registros...</p>
          ) : (
            <table style={styles.tablaContenedor}>
              <thead>
                <tr>
                  <th style={styles.thStyle}>Deudor</th>
                  <th style={styles.thStyle}>Concepto</th>
                  <th style={styles.thStyle}>Fecha venta</th>
                  <th style={styles.thStyle}>Tipo cuota</th>
                  <th style={styles.thStyle}>Plan / Día</th>
                  <th style={styles.thStyle}>Monto deuda</th>
                  <th style={styles.thStyle}>Saldo pendiente</th>
                  <th style={styles.thStyle}>Estado</th>
                  <th style={styles.thStyle}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {ventas.length === 0 ? (
                  <tr>
                    <td colSpan="9" style={{ ...styles.tdStyle, textAlign: 'center' }}>
                      No hay cuentas por cobrar diversas registradas.
                    </td>
                  </tr>
                ) : (
                  ventas.map((v, idx) => {
                    const totalAbonado = abonos
                      .filter(a => a.id_venta === v.id_venta)
                      .reduce((acc, a) => acc + (Number(a.monto_abono) || 0), 0)
                    const saldoActual =
                      v.saldo_pendiente !== undefined && v.saldo_pendiente !== null
                        ? Number(v.saldo_pendiente)
                        : Math.max(0, (Number(v.monto_total) || 0) - totalAbonado)

                    return (
                      <tr key={v.id_venta || idx}>
                        <td style={styles.tdStyle}><strong>{v.deudor_nombre}</strong></td>
                        <td style={styles.tdStyle}>{v.concepto}</td>
                        <td style={styles.tdStyle}>{normalizarFechaISO(v.fecha_venta)}</td>
                        <td style={styles.tdStyle}>
                          {v.tipo_cuota === 'fija' ? 'Cuota fija' : 'Cuota libre'}
                        </td>
                        <td style={styles.tdStyle}>
                          {v.tipo_cuota === 'fija'
                            ? `${v.num_abonos} abonos · Día ${v.dia_pago} (${formatoMoneda(v.monto_cuota)})`
                            : 'Por abonos'}
                        </td>
                        <td style={styles.tdStyle}>{formatoMoneda(v.monto_total)}</td>
                        <td style={{ ...styles.tdStyle, fontWeight: 'bold', color: vino }}>
                          {formatoMoneda(saldoActual)}
                        </td>
                        <td style={styles.tdStyle}>{v.estado || 'PENDIENTE'}</td>
                        <td style={styles.tdStyle}>
                          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                            <button
                              type="button"
                              style={styles.botonAccion}
                              onClick={() => abrirModalAbono(v)}
                            >
                              + Agregar abono
                            </button>
                            <button
                              type="button"
                              style={styles.cancel}
                              onClick={() =>
                                setModalEditar({
                                  visible: true,
                                  venta: v,
                                  monto_total: v.monto_total,
                                  monto_cuota: v.monto_cuota || '',
                                  num_abonos: v.num_abonos || '',
                                  dia_pago: v.dia_pago || ''
                                })
                              }
                            >
                              Editar
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          )}
        </>
      )}

      {vistaActiva === 'calendario' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
            <h2 style={styles.title}>Calendario mensual</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <label style={{ ...styles.filtroLabel, marginBottom: 0 }}>Mes:</label>
              <input
                type="month"
                style={styles.dateField}
                value={mesCalendario}
                onChange={e => setMesCalendario(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 10, fontSize: 13 }}>
            <span>🟢 <strong>Verde:</strong> Cuota cubierta o abono libre confirmado</span>
            <span>🔴 <strong>Rojo:</strong> Cuota fija vencida sin cubrir</span>
            <span>⚪ <strong>Pendiente:</strong> Cuota fija futura</span>
          </div>

          <table style={styles.tablaContenedor}>
            <thead>
              <tr>
                <th style={styles.thStyle}>Fecha</th>
                <th style={styles.thStyle}>Deudor</th>
                <th style={styles.thStyle}>Concepto</th>
                <th style={styles.thStyle}>Modalidad</th>
                <th style={styles.thStyle}>Monto</th>
                <th style={styles.thStyle}>Estado</th>
              </tr>
            </thead>
            <tbody>
              {elementosCalendario.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ ...styles.tdStyle, textAlign: 'center' }}>
                    Sin cuotas ni abonos libres confirmados para este mes.
                  </td>
                </tr>
              ) : (
                elementosCalendario.map(item => {
                  const bgColor =
                    item.color === 'verde'
                      ? '#e9f7ef'
                      : item.color === 'rojo'
                        ? '#fdecea'
                        : '#fff'
                  const txtColor =
                    item.color === 'verde'
                      ? '#155724'
                      : item.color === 'rojo'
                        ? vino
                        : '#333'
                  const icono =
                    item.color === 'verde' ? '🟢' : item.color === 'rojo' ? '🔴' : '⚪'

                  return (
                    <tr key={item.key} style={{ backgroundColor: bgColor }}>
                      <td style={styles.tdStyle}><strong>{item.fecha}</strong></td>
                      <td style={styles.tdStyle}>{item.deudor}</td>
                      <td style={styles.tdStyle}>{item.concepto}</td>
                      <td style={styles.tdStyle}>{item.tipoLabel}</td>
                      <td style={styles.tdStyle}>{formatoMoneda(item.monto)}</td>
                      <td style={{ ...styles.tdStyle, fontWeight: 'bold', color: txtColor }}>
                        {icono} {item.estadoTexto}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {vistaActiva === 'abonos' && (
        <div>
          <h2 style={styles.title}>Historial de abonos (auditoría)</h2>
          <table style={styles.tablaContenedor}>
            <thead>
              <tr>
                <th style={styles.thStyle}>Fecha ingreso</th>
                <th style={styles.thStyle}>Fecha captura (auditoría)</th>
                <th style={styles.thStyle}>Deudor / Concepto</th>
                <th style={styles.thStyle}>Origen</th>
                <th style={styles.thStyle}>Cuenta bancaria</th>
                <th style={styles.thStyle}>Fiscal</th>
                <th style={styles.thStyle}>Monto</th>
              </tr>
            </thead>
            <tbody>
              {abonos.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ ...styles.tdStyle, textAlign: 'center' }}>
                    Aún no hay abonos registrados.
                  </td>
                </tr>
              ) : (
                abonos.map((ab, idx) => {
                  const v = ventas.find(item => item.id_venta === ab.id_venta)
                  return (
                    <tr key={ab.id_abono || idx}>
                      <td style={styles.tdStyle}><strong>{normalizarFechaISO(ab.fecha_ingreso)}</strong></td>
                      <td style={styles.tdStyle}>
                        {ab.fecha_captura ? new Date(ab.fecha_captura).toLocaleString('es-MX') : '-'}
                      </td>
                      <td style={styles.tdStyle}>
                        {v ? `${v.deudor_nombre} — ${v.concepto}` : `Venta #${ab.id_venta}`}
                      </td>
                      <td style={styles.tdStyle}>{ab.origen_pago}</td>
                      <td style={styles.tdStyle}>{ab.cuenta_bancaria || '-'}</td>
                      <td style={styles.tdStyle}>{ab.fiscal ? 'Sí' : 'No'}</td>
                      <td style={{ ...styles.tdStyle, fontWeight: 'bold', color: '#155724' }}>
                        {formatoMoneda(ab.monto_abono)}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {modalAbono.visible && modalAbono.venta && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h3 style={{ ...styles.title, marginTop: 0 }}>
              Agregar abono — {modalAbono.venta.deudor_nombre}
            </h3>
            <p style={{ fontSize: 13, marginBottom: 15 }}>{modalAbono.venta.concepto}</p>

            <form onSubmit={guardarAbono} style={{ textAlign: 'left' }}>
              <div style={{ marginBottom: 12 }}>
                <label style={styles.filtroLabel}>Monto recibido</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  style={styles.input}
                  value={modalAbono.monto_abono}
                  onChange={e => setModalAbono(prev => ({ ...prev, monto_abono: e.target.value }))}
                />
              </div>

              <div style={{ marginBottom: 12 }}>
                <label style={styles.filtroLabel}>Fecha en que ingresó el dinero</label>
                <input
                  type="date"
                  style={styles.dateField}
                  value={modalAbono.fecha_ingreso}
                  onChange={e => setModalAbono(prev => ({ ...prev, fecha_ingreso: e.target.value }))}
                />
              </div>

              <div style={{ marginBottom: 12 }}>
                <label style={styles.filtroLabel}>Origen del ingreso</label>
                <select
                  style={styles.dateField}
                  value={modalAbono.origen_pago}
                  onChange={e => setModalAbono(prev => ({ ...prev, origen_pago: e.target.value }))}
                >
                  <option value="EFECTIVO">EFECTIVO</option>
                  <option value="TRANSFERENCIA">TRANSFERENCIA</option>
                </select>
              </div>

              {modalAbono.origen_pago === 'TRANSFERENCIA' && (
                <div style={{ marginBottom: 12 }}>
                  <label style={styles.filtroLabel}>Cuenta bancaria predeterminada</label>
                  <input
                    type="text"
                    placeholder="Ej. BBVA / Banorte"
                    style={styles.input}
                    value={modalAbono.cuenta_bancaria}
                    onChange={e => setModalAbono(prev => ({ ...prev, cuenta_bancaria: e.target.value }))}
                  />
                </div>
              )}

              <div style={{ marginBottom: 12 }}>
                <label style={{ cursor: 'pointer', fontSize: 13, fontWeight: 'bold' }}>
                  <input
                    type="checkbox"
                    checked={modalAbono.fiscal}
                    onChange={e => setModalAbono(prev => ({ ...prev, fiscal: e.target.checked }))}
                  />{' '}
                  Fiscal
                </label>
              </div>

              <div style={styles.buttons}>
                <button
                  type="button"
                  style={styles.cancel}
                  onClick={() => setModalAbono(prev => ({ ...prev, visible: false, venta: null }))}
                >
                  Cancelar
                </button>
                <button type="submit" style={styles.save}>
                  Confirmar abono
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {modalEditar.visible && modalEditar.venta && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h3 style={{ ...styles.title, marginTop: 0 }}>
              Editar deuda — {modalEditar.venta.deudor_nombre}
            </h3>

            <form onSubmit={guardarEdicionVenta} style={{ textAlign: 'left' }}>
              <div style={{ marginBottom: 12 }}>
                <label style={styles.filtroLabel}>Monto de la deuda</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  style={styles.input}
                  value={modalEditar.monto_total}
                  onChange={e => setModalEditar(prev => ({ ...prev, monto_total: e.target.value }))}
                />
              </div>

              {modalEditar.venta.tipo_cuota === 'fija' && (
                <>
                  <div style={{ marginBottom: 12 }}>
                    <label style={styles.filtroLabel}>Monto de cuota</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      style={styles.input}
                      value={modalEditar.monto_cuota}
                      onChange={e => setModalEditar(prev => ({ ...prev, monto_cuota: e.target.value }))}
                    />
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <label style={styles.filtroLabel}>Número de abonos</label>
                    <input
                      type="number"
                      min="1"
                      style={styles.input}
                      value={modalEditar.num_abonos}
                      onChange={e => setModalEditar(prev => ({ ...prev, num_abonos: e.target.value }))}
                    />
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <label style={styles.filtroLabel}>Día de pago (1 - 31)</label>
                    <input
                      type="number"
                      min="1"
                      max="31"
                      style={styles.input}
                      value={modalEditar.dia_pago}
                      onChange={e => setModalEditar(prev => ({ ...prev, dia_pago: e.target.value }))}
                    />
                  </div>
                </>
              )}

              <div style={styles.buttons}>
                <button
                  type="button"
                  style={styles.cancel}
                  onClick={() =>
                    setModalEditar({
                      visible: false,
                      venta: null,
                      monto_total: '',
                      monto_cuota: '',
                      num_abonos: '',
                      dia_pago: ''
                    })
                  }
                >
                  Cancelar
                </button>
                <button type="submit" style={styles.save}>
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default CuentasPorCobrarDiversas
