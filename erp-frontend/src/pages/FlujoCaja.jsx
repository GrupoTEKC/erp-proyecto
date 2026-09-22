import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/TRANSPARENTE.png'

const API = 'https://erp-proyecto-production.up.railway.app'

const vino = '#8B1E1E'

const styles = {
  page: {
    padding: 20,
    width: '85%',
    margin: '0 auto',
    textAlign: 'left',
    fontFamily: 'Arial, sans-serif'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20
  },
  leftSection: {
    flex: '1 1 0%',
    display: 'flex',
    justifyContent: 'flex-start'
  },
  centerSection: {
    flex: '2 1 0%',
    textAlign: 'center'
  },
  rightSection: {
    flex: '1 1 0%',
    display: 'flex',
    justifyContent: 'flex-end'
  },
  mainTitle: {
    color: vino,
    fontSize: 48,
    fontWeight: '900',
    letterSpacing: 2,
    margin: 0
  },
  subTitle: {
    color: vino,
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: 1.5,
    margin: '30px 0 15px 0',
    textAlign: 'center'
  },
  logo: {
    height: 160
  },
  cancel: {
    background: '#fff',
    color: vino,
    border: `1px solid ${vino}`,
    padding: '10px 18px',
    borderRadius: 6,
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  /* TARJETAS DE SALDO (KPIs) */
  kpiGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '15px',
    marginBottom: '25px'
  },
  kpiCard: {
    backgroundColor: '#ffffff',
    border: `2px solid ${vino}`,
    borderRadius: '10px',
    padding: '16px',
    textAlign: 'center',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
  },
  kpiTitle: {
    fontSize: '13px',
    fontWeight: 'bold',
    color: '#64748b',
    margin: '0 0 6px 0',
    textTransform: 'uppercase'
  },
  kpiValue: {
    fontSize: '22px',
    fontWeight: '900',
    color: vino,
    margin: 0
  },
  /* SECCIÓN HISTORIAL MOVIMIENTOS DE CAJA */
  movimientosCard: {
    backgroundColor: '#ffffff',
    border: '2px solid #cbd5e1',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '30px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '15px',
    fontSize: '14px'
  },
  th: {
    backgroundColor: '#f1f5f9',
    color: '#334155',
    textAlign: 'left',
    padding: '12px',
    borderBottom: '2px solid #cbd5e1',
    fontWeight: 'bold'
  },
  td: {
    padding: '12px',
    borderBottom: '1px solid #e2e8f0',
    color: '#1e293b'
  },
  tf: {
    padding: '12px',
    borderTop: '2px solid #cbd5e1',
    backgroundColor: '#f8fafc',
    color: '#1e293b',
    fontWeight: 'bold'
  },
  badgeIngreso: {
    backgroundColor: '#dcfce7',
    color: '#15803d',
    padding: '4px 10px',
    borderRadius: '12px',
    fontWeight: 'bold',
    fontSize: '12px',
    display: 'inline-block'
  },
  badgeEgreso: {
    backgroundColor: '#fee2e2',
    color: '#b91c1c',
    padding: '4px 10px',
    borderRadius: '12px',
    fontWeight: 'bold',
    fontSize: '12px',
    display: 'inline-block'
  },
  badgeTemporal: {
    backgroundColor: '#fef3c7',
    color: '#b45309',
    padding: '4px 10px',
    borderRadius: '12px',
    fontWeight: 'bold',
    fontSize: '12px',
    display: 'inline-block'
  },
  montoIngreso: {
    color: '#16a34a',
    fontWeight: 'bold'
  },
  montoEgreso: {
    color: '#dc2626',
    fontWeight: 'bold'
  },
  /* TARJETA PRINCIPAL (BLOQUE PADRE) */
  parentCard: {
    backgroundColor: '#ffffff',
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '30px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
  },
  parentHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    cursor: 'pointer',
    userSelect: 'none',
    paddingBottom: '12px',
    borderBottom: '2px solid #f1f5f9'
  },
  parentTitleGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  parentTitle: {
    fontSize: '22px',
    fontWeight: '800',
    color: vino,
    margin: 0
  },
  parentSubtitle: {
    fontSize: '13px',
    color: '#64748b',
    margin: '4px 0 0 0'
  },
  toggleBadge: {
    backgroundColor: '#f1f5f9',
    color: '#475569',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: 'bold'
  },
  /* SUB-TARJETAS (HIJAS) */
  cardsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '20px',
    marginTop: '20px'
  },
  card: {
    backgroundColor: '#f8fafc',
    border: '1.5px solid #cbd5e1',
    borderRadius: '10px',
    padding: '18px',
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out'
  },
  cardActive: {
    borderColor: vino,
    backgroundColor: '#fff5f5',
    boxShadow: '0 4px 12px rgba(139,30,30,0.12)'
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '8px'
  },
  cardName: {
    fontSize: '15px',
    fontWeight: 'bold',
    color: '#1e293b',
    margin: 0
  },
  cardIcon: {
    fontSize: '24px'
  },
  cardDesc: {
    fontSize: '12.5px',
    color: '#64748b',
    margin: 0,
    lineHeight: '1.3'
  },
  /* FORMULARIO DE CAPTURA */
  formContainer: {
    backgroundColor: '#ffffff',
    border: `2px solid ${vino}`,
    borderRadius: '10px',
    padding: '22px',
    marginTop: '20px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)'
  },
  formTitle: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: vino,
    borderBottom: '1px solid #e2e8f0',
    paddingBottom: '10px',
    marginBottom: '18px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: '#64748b',
    fontSize: '13px',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '18px'
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  label: {
    fontSize: '13.5px',
    fontWeight: 'bold',
    color: '#334155'
  },
  input: {
    padding: '10px 12px',
    borderRadius: '6px',
    border: '1px solid #cbd5e1',
    fontSize: '14px',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box'
  },
  select: {
    padding: '10px 12px',
    borderRadius: '6px',
    border: '1px solid #cbd5e1',
    fontSize: '14px',
    backgroundColor: '#fff',
    width: '100%',
    boxSizing: 'border-box'
  },
  fullRow: {
    gridColumn: '1 / -1'
  },
  submitButton: {
    backgroundColor: vino,
    color: '#fff',
    border: 'none',
    padding: '12px 24px',
    fontSize: '15px',
    fontWeight: 'bold',
    borderRadius: '6px',
    cursor: 'pointer',
    width: '100%'
  },
  actionBtn: {
    backgroundColor: vino,
    color: '#fff',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: 'bold',
    cursor: 'pointer'
  },
  /* ESTILOS ESPECÍFICOS PARA GASTOS DE PERSONAL */
  puestoTabs: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
    marginBottom: '15px',
    borderBottom: '1px solid #e2e8f0',
    paddingBottom: '10px'
  },
  puestoTabBtn: {
    padding: '8px 14px',
    borderRadius: '20px',
    border: '1px solid #cbd5e1',
    backgroundColor: '#f8fafc',
    color: '#475569',
    fontSize: '13px',
    fontWeight: 'bold',
    cursor: 'pointer'
  },
  puestoTabActive: {
    backgroundColor: vino,
    color: '#ffffff',
    borderColor: vino
  },
  empleadosGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '12px',
    marginBottom: '20px'
  },
  empleadoCard: {
    padding: '12px',
    borderRadius: '8px',
    border: '1.5px solid #e2e8f0',
    backgroundColor: '#ffffff',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    transition: 'all 0.15s ease'
  },
  empleadoCardSelected: {
    borderColor: vino,
    backgroundColor: '#fff5f5',
    boxShadow: '0 2px 8px rgba(139,30,30,0.15)'
  },
  statusBadge: {
    fontSize: '12px',
    fontWeight: 'bold',
    padding: '2px 8px',
    borderRadius: '12px'
  },
  badgePagado: {
    backgroundColor: '#dcfce7',
    color: '#15803d'
  },
  badgePendiente: {
    backgroundColor: '#fee2e2',
    color: '#b91c1c'
  },
  /* ESTILOS SECCIONES DINÁMICAS */
  dynamicBlock: {
    border: '1px solid #e2e8f0',
    backgroundColor: '#f8fafc',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '10px'
  },
  dynamicHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
    fontWeight: 'bold',
    fontSize: '13.5px',
    color: '#334155'
  },
  addBtn: {
    backgroundColor: vino,
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    width: '28px',
    height: '28px',
    fontWeight: 'bold',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  removeBtn: {
    backgroundColor: '#ef4444',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    width: '28px',
    height: '38px',
    fontWeight: 'bold',
    cursor: 'pointer'
  },
  totalSummaryBox: {
    backgroundColor: '#f1f5f9',
    border: `2px solid ${vino}`,
    padding: '15px',
    borderRadius: '8px',
    textAlign: 'right',
    marginTop: '10px'
  }
}

function FlujoCaja() {
  const navigate = useNavigate()

  // ESTADO - CONTROL PLEGABLE DE HISTORIAL DE MOVIMIENTOS
  const [historialAbierto, setHistorialAbierto] = useState(false)

  // ESTADO - RESUMEN DE CAJA Y MOVIMIENTOS
  const [saldos, setSaldos] = useState({ efectivo: 0, banco: 0, total_ingresos: 0, total_egresos: 0, saldo_tekc: 0 })
  const [movimientos, setMovimientos] = useState([])
  const [cargandoResumen, setCargandoResumen] = useState(true)

  // ESTADO - FILTROS DE HISTORIAL MOVIMIENTOS
  const [filtroTipo, setFiltroTipo] = useState('TODOS')
  const [filtroPedido, setFiltroPedido] = useState('TODOS')
  const [busquedaTienda, setBusquedaTienda] = useState('')
  const [filtroFormaPago, setFiltroFormaPago] = useState('TODOS')
  const [fechaDesde, setFechaDesde] = useState('')
  const [fechaHasta, setFechaHasta] = useState('')

  // ESTADO - GASTOS TEMPORALES (ENTREGAS PENDIENTES)
  const [gastosTemporales, setGastosTemporales] = useState([])

  // ESTADOS - GASTOS OPERATIVOS (PRODUCCIÓN)
  const [produccionAbierto, setProduccionAbierto] = useState(false)
  const [apartadoActivo, setApartadoActivo] = useState(null)
  const [productosBD, setProductosBD] = useState([])
  const [subopcionSeleccionada, setSubopcionSeleccionada] = useState('')
  const [productoSeleccionado, setProductoSeleccionado] = useState('')
  const [origenPago, setOrigenPago] = useState('EFECTIVO')
  const [cuentaBancaria, setCuentaBancaria] = useState('')
  const [nombreDuenioCuenta, setNombreDuenioCuenta] = useState('')
  const [monto, setMonto] = useState('')
  const [concepto, setConcepto] = useState('')
  const [comprobante, setComprobante] = useState('')

  // ESTADOS - GASTOS DE PERSONAL
  const [personalAbierto, setPersonalAbierto] = useState(false)
  const [subPersonalActivo, setSubPersonalActivo] = useState(null)
  const [empleados, setEmpleados] = useState([])
  const [empleadosPagados, setEmpleadosPagados] = useState([])
  const [puestoTab, setPuestoTab] = useState('ADMINISTRATIVOS')
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState('')
  const [subTipoImpuesto, setSubTipoImpuesto] = useState('IMSS')
  const [fechaInicioSemana, setFechaInicioSemana] = useState('')
  const [fechaFinSemana, setFechaFinSemana] = useState('')

  // ESTADOS COMPLEMENTARIOS - CATALOGOS VIÁTICOS
  const [rutas, setRutas] = useState([])
  const [unidades, setUnidades] = useState([])
  const [idRutaSeleccionada, setIdRutaSeleccionada] = useState('')
  const [idUnidadSeleccionada, setIdUnidadSeleccionada] = useState('')
  const [esChofer, setEsChofer] = useState(false)

  // ESTADOS DESGLOSE DINÁMICO VIÁTICOS
  const [casetas, setCasetas] = useState([''])
  const [gasolina, setGasolina] = useState([''])
  const [comidas, setComidas] = useState([''])
  const [folios, setFolios] = useState([''])

  // ESTADOS - GASTOS DE PLANTA Y MANTENIMIENTO
  const [plantaAbierto, setPlantaAbierto] = useState(false)
  const [subPlantaActivo, setSubPlantaActivo] = useState(null)
  const [fechaPago, setFechaPago] = useState('')
  const [tipoServicioPublico, setTipoServicioPublico] = useState('')
  const [lineasServicios, setLineasServicios] = useState([{ concepto: '', monto: '' }])
  
  // Sub-tarjeta 2 Planta
  const [tipoEquipo, setTipoEquipo] = useState('Unidad')
  const [montacargas, setMontacargas] = useState([])
  const [equipoSeleccionado, setEquipoSeleccionado] = useState('')
  const [tipoServicioMantenimiento, setTipoServicioMantenimiento] = useState('')
  const [lineasMantenimiento, setLineasMantenimiento] = useState([{ concepto: '', monto: '' }])

  // Sub-tarjeta 3 Planta
  const [lineasHerramientas, setLineasHerramientas] = useState([{ cantidad: '1', concepto: '', precio: '' }])

  // ESTADOS - GASTOS DEPARTAMENTALES
  const [deptosAbierto, setDeptosAbierto] = useState(false)
  const [subDeptoActivo, setSubDeptoActivo] = useState(null)
  const [fechaPagoDepto, setFechaPagoDepto] = useState('')
  
  // Sub 1 Marketing
  const [lineasMarketing, setLineasMarketing] = useState([{ tipoGasto: '', monto: '', comentario: '' }])
  
  // Sub 2 Caja Chica
  const [cantidadCajaChica, setCantidadCajaChica] = useState('')
  const [detalleCajaChica, setDetalleCajaChica] = useState('')
  const [montoCajaChica, setMontoCajaChica] = useState('')

  // Sub 3 Servicios Profesionales
  const [empleadoServicios, setEmpleadoServicios] = useState('')
  const [montoServicios, setMontoServicios] = useState('')

  // OBTENER RESUMEN Y MOVIMIENTOS AL CARGAR EL COMPONENTE
  const cargarResumenCaja = async () => {
    setCargandoResumen(true)
    try {
      const res = await fetch(`${API}/api/caja/resumen`)
      if (res.ok) {
        const data = await res.json()
        if (data) {
          if (data.saldos) {
            setSaldos({
              efectivo: data.saldos.efectivo || 0,
              banco: data.saldos.banco || 0,
              total_ingresos: data.saldos.total_ingresos || data.saldos.ingresos || 0,
              total_egresos: data.saldos.total_egresos || data.saldos.egresos || 0,
              saldo_tekc: data.saldos.saldo_tekc || 0
            })
          }
          if (Array.isArray(data.movimientos)) {
            setMovimientos(data.movimientos)
          }
        }
      }
    } catch (err) {
      console.error('Error al obtener el resumen de caja:', err)
    } finally {
      setCargandoResumen(false)
    }
  }

  // Cargar lista de Gastos Temporales pendientes
  const cargarGastosTemporales = async () => {
    try {
      const res = await fetch(`${API}/api/gastos-temporales?estatus=PENDIENTE`)
      if (res.ok) {
        const data = await res.json()
        if (data.ok && Array.isArray(data.gastos)) {
          setGastosTemporales(data.gastos)
        }
      }
    } catch (err) {
      console.error('Error al obtener gastos temporales:', err)
    }
  }

  // Cargar catálogo de datos y resumen
  useEffect(() => {
    cargarResumenCaja()
    cargarGastosTemporales()
    fetch(`${API}/productos`).then(r => r.json()).then(d => Array.isArray(d) && setProductosBD(d)).catch(console.error)
    fetch(`${API}/empleados`).then(r => r.json()).then(d => Array.isArray(d) && setEmpleados(d)).catch(console.error)
    fetch(`${API}/rutas`).then(r => r.json()).then(d => Array.isArray(d) && setRutas(d)).catch(console.error)
    fetch(`${API}/unidades`).then(r => r.json()).then(d => Array.isArray(d) && setUnidades(d)).catch(console.error)
    fetch(`${API}/montacargas`).then(r => r.json()).then(d => Array.isArray(d) && setMontacargas(d)).catch(console.error)
  }, [])

  // Verificar status de pagos de nómina por fechas
  useEffect(() => {
    if (fechaInicioSemana && fechaFinSemana) {
      fetch(`${API}/empleados/pagos-semana?fecha_inicio=${fechaInicioSemana}&fecha_fin=${fechaFinSemana}`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) setEmpleadosPagados(data)
        })
        .catch((err) => console.error('Error al verificar pagos de semana:', err))
    }
  }, [fechaInicioSemana, fechaFinSemana])

  // Handlers para la selección de categorías
  const handleSelectApartado = (idCat) => {
    setApartadoActivo(idCat)
    setSubopcionSeleccionada('')
    setProductoSeleccionado('')
    setMonto('')
    setConcepto('')
    setComprobante('')
    setCuentaBancaria('')
    setNombreDuenioCuenta('')
  }

  const handleSelectSubPersonal = (idSub) => {
    setSubPersonalActivo(idSub)
    setEmpleadoSeleccionado('')
    setMonto('')
    setConcepto('')
    setComprobante('')
    setOrigenPago('EFECTIVO')
    setCuentaBancaria('')
    setNombreDuenioCuenta('')
    setIdRutaSeleccionada('')
    setIdUnidadSeleccionada('')
    setEsChofer(false)
    setCasetas([''])
    setGasolina([''])
    setComidas([''])
    setFolios([''])
  }

  const handleSelectSubPlanta = (idSub) => {
    setSubPlantaActivo(idSub)
    setFechaPago('')
    setOrigenPago('EFECTIVO')
    setCuentaBancaria('')
    setNombreDuenioCuenta('')
    setTipoServicioPublico('')
    setLineasServicios([{ concepto: '', monto: '' }])
    setTipoEquipo('Unidad')
    setEquipoSeleccionado('')
    setTipoServicioMantenimiento('')
    setLineasMantenimiento([{ concepto: '', monto: '' }])
    setLineasHerramientas([{ cantidad: '1', concepto: '', precio: '' }])
  }

  const handleSelectSubDepto = (idSub) => {
    setSubDeptoActivo(idSub)
    setFechaPagoDepto('')
    setOrigenPago('EFECTIVO')
    setCuentaBancaria('')
    setNombreDuenioCuenta('')
    setLineasMarketing([{ tipoGasto: '', monto: '', comentario: '' }])
    setCantidadCajaChica('')
    setDetalleCajaChica('')
    setMontoCajaChica('')
    const almaEmp = empleados.find((e) =>
      (e.nombre_completo || `${e.nombre} ${e.apellido1}`).toLowerCase().includes('alma nely')
    )
    setEmpleadoServicios(almaEmp ? String(almaEmp.id_empleado) : '')
    setMontoServicios('')
  }

  // PASO B: Navegar a la pantalla de Viáticos con los datos iniciales
  const handleComprobarGastoTemporal = (gasto) => {
    navigate('/viaticos', {
      state: {
        id_gasto_temporal: gasto.id_temporal,
        id_empleado: gasto.id_empleado,
        empleado_nombre: gasto.empleado_nombre,
        monto_entregado: gasto.monto_entregado,
        origen_pago: gasto.origen_pago,
        concepto: gasto.concepto
      }
    })
  }

  // PASO A: Registrar una entrega/gasto temporal
  const handleGuardarGastoTemporal = async () => {
    if (!empleadoSeleccionado || !monto || parseFloat(monto) <= 0 || !concepto.trim()) {
      alert('⚠️ Por favor completa los datos obligatorios del gasto temporal.')
      return
    }

    try {
      const res = await fetch(`${API}/api/gastos-temporales`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_empleado: parseInt(empleadoSeleccionado),
          monto_entregado: parseFloat(monto),
          origen_pago: origenPago,
          concepto: concepto.trim()
        })
      })

      const data = await res.json()
      if (data.ok) {
        alert('¡Gasto temporal registrado con éxito!')
        setSubPersonalActivo(null)
        setEmpleadoSeleccionado('')
        setMonto('')
        setConcepto('')
        cargarResumenCaja()
        cargarGastosTemporales()
      } else {
        alert(`Error: ${data.error || 'No se pudo registrar el gasto temporal'}`)
      }
    } catch (err) {
      console.error('Error al registrar gasto temporal:', err)
      alert('Error de conexión al servidor.')
    }
  }

  // Detectar cambio de empleado en Viáticos
  const handleEmpleadoViaticosChange = (idEmp) => {
    setEmpleadoSeleccionado(idEmp)
    const emp = empleados.find((e) => String(e.id_empleado) === String(idEmp))
    if (emp && emp.puesto) {
      const puestoUpper = emp.puesto.toUpperCase().trim()
      setEsChofer(puestoUpper === 'CHOFER' || puestoUpper === 'CHOFERES')
    } else {
      setEsChofer(false)
    }
  }

  // Auxiliares dinámicos
  const handleAgregarCampo = (setter, lista) => setter([...lista, ''])
  const handleCambioCampo = (setter, lista, index, valor) => {
    const nueva = [...lista]
    nueva[index] = valor
    setter(nueva)
  }
  const handleEliminarCampo = (setter, lista, index) => {
    if (lista.length === 1) return
    setter(lista.filter((_, i) => i !== index))
  }

  const handleAgregarObjeto = (setter, lista, objetoInicial) => setter([...lista, { ...objetoInicial }])
  const handleCambioObjeto = (setter, lista, index, campo, valor) => {
    const nueva = [...lista]
    nueva[index][campo] = valor
    setter(nueva)
  }
  const handleEliminarObjeto = (setter, lista, index) => {
    if (lista.length === 1) return
    setter(lista.filter((_, i) => i !== index))
  }

  // Totales
  const totalCasetas = casetas.reduce((acc, v) => acc + (parseFloat(v) || 0), 0)
  const totalGasolina = gasolina.reduce((acc, v) => acc + (parseFloat(v) || 0), 0)
  const totalComidas = comidas.reduce((acc, v) => acc + (parseFloat(v) || 0), 0)
  const totalViaticosGeneral = totalCasetas + totalGasolina + totalComidas

  const totalServiciosPublicos = lineasServicios.reduce((acc, item) => acc + (parseFloat(item.monto) || 0), 0)
  const totalMantenimiento = lineasMantenimiento.reduce((acc, item) => acc + (parseFloat(item.monto) || 0), 0)
  const totalHerramientas = lineasHerramientas.reduce((acc, item) => {
    const cant = parseFloat(item.cantidad) || 0
    const prec = parseFloat(item.precio) || 0
    return acc + (cant * prec)
  }, 0)

  const totalMarketing = lineasMarketing.reduce((acc, item) => acc + (parseFloat(item.monto) || 0), 0)

  // SUBMIT HANDLERS
  const handleGuardarOperativos = async () => {
    if (!monto || parseFloat(monto) <= 0) {
      alert('Por favor ingresa un monto válido.')
      return
    }

    const baseConcepto = concepto.trim() ? concepto.trim() : 'S/C'
    let detalleFinal = baseConcepto

    const prodEncontrado = productosBD.find(
      (p) => String(p.id_producto) === String(productoSeleccionado)
    )

    if (apartadoActivo === 1 && subopcionSeleccionada) {
      detalleFinal = `[MATERIA PRIMA: ${subopcionSeleccionada}] - ${baseConcepto}`
    } else if (apartadoActivo === 2 && subopcionSeleccionada) {
      detalleFinal = `[EPP: ${subopcionSeleccionada}] - ${baseConcepto}`
    } else if (apartadoActivo === 3 && prodEncontrado) {
      detalleFinal = `[BOLSA: ${prodEncontrado.nombre}] - ${baseConcepto}`
    }

    let cuentaFinal = null
    if (origenPago === 'TRANSFERENCIA') {
      cuentaFinal = cuentaBancaria === 'OTRO' 
        ? `OTRO (${nombreDuenioCuenta.trim()})` 
        : cuentaBancaria
    }

    const payload = {
      id_categoria: apartadoActivo,
      monto: parseFloat(monto),
      origen_pago: origenPago,
      cuenta_bancaria: cuentaFinal,
      id_producto_relacionado: apartadoActivo === 3 ? parseInt(productoSeleccionado) : null,
      concepto: detalleFinal,
      num_comprobante: comprobante ? comprobante.trim() : null
    }

    try {
      const res = await fetch(`${API}/egresos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!res.ok) {
        alert('Error al registrar el gasto de producción.')
        return
      }

      const data = await res.json()
      if (data.success) {
        alert('¡Gasto registrado con éxito!')
        setApartadoActivo(null)
        cargarResumenCaja()
      } else {
        alert(`Error: ${data.error || 'No se pudo registrar el gasto'}`)
      }
    } catch (error) {
      console.error('Error al enviar registro:', error)
      alert('Ocurrió un error de conexión con el servidor.')
    }
  }

  const handleGuardarPersonal = async () => {
    let idCategoriaFinal = 4
    let baseConcepto = ''
    let payload = {}

    let cuentaFinal = null
    if (origenPago === 'TRANSFERENCIA') {
      cuentaFinal = cuentaBancaria === 'OTRO'
        ? `OTRO (${nombreDuenioCuenta.trim()})`
        : cuentaBancaria
    }

    if (subPersonalActivo === 7) {
      if (!empleadoSeleccionado) {
        alert('⚠️ Por favor selecciona el empleado que recibe los viáticos.')
        return
      }

      if (totalViaticosGeneral <= 0) {
        alert('⚠️ Debe ingresar al menos un monto de gasto (Caseta, Gasolina o Comida).')
        return
      }

      const foliosLimpios = folios.map(f => f.trim()).filter(Boolean)

      if (esChofer) {
        if (!idRutaSeleccionada || !idUnidadSeleccionada || foliosLimpios.length === 0) {
          alert('⚠️ Para los choferes es obligatorio seleccionar Ruta, Unidad y capturar folios.')
          return
        }
      }

      const empObj = empleados.find(emp => String(emp.id_empleado) === String(empleadoSeleccionado))
      const nombreEmpleado = empObj ? (empObj.nombre_completo || `${empObj.nombre || ''} ${empObj.apellido1 || ''}`) : null

      const uniObj = unidades.find(u => String(u.id_unidad) === String(idUnidadSeleccionada))
      const nombreUnidad = uniObj ? (uniObj.nombre || uniObj.placas) : null

      const conceptoPayload = JSON.stringify({
        resumen: `VIÁTICOS: Casetas $${totalCasetas} | Gasolina $${totalGasolina} | Comidas $${totalComidas}`,
        desglose: {
          casetas: casetas.map(Number).filter(n => n > 0),
          gasolina: gasolina.map(Number).filter(n => n > 0),
          comidas: comidas.map(Number).filter(n => n > 0)
        },
        comentario: concepto.trim() || null
      })

      payload = {
        id_categoria: 8,
        monto: totalViaticosGeneral,
        origen_pago: origenPago,
        cuenta_bancaria: cuentaFinal,
        id_empleado: parseInt(empleadoSeleccionado),
        empleado_relacionado: nombreEmpleado,
        id_unidad_relacionada: idUnidadSeleccionada ? parseInt(idUnidadSeleccionada) : null,
        unidad_relacionada: nombreUnidad,
        id_ruta_relacionada: idRutaSeleccionada ? parseInt(idRutaSeleccionada) : null,
        concepto: conceptoPayload,
        num_comprobante: foliosLimpios.length > 0 ? foliosLimpios.join(', ') : null
      }

    } else {
      if (!empleadoSeleccionado && (subPersonalActivo === 4 || subPersonalActivo === 5)) {
        alert('Por favor selecciona un trabajador.')
        return
      }
      if (!monto || parseFloat(monto) <= 0) {
        alert('Por favor ingresa un monto válido.')
        return
      }

      const empObj = empleados.find(emp => String(emp.id_empleado) === String(empleadoSeleccionado))
      const nombreEmpleado = empObj ? empObj.nombre_completo : null

      baseConcepto = concepto.trim() ? concepto.trim() : 'Pago de gasto de personal'

      if (subPersonalActivo === 5) {
        idCategoriaFinal = subTipoImpuesto === 'IMSS' ? 5 : 6
        baseConcepto = `[${subTipoImpuesto}] - ${baseConcepto}`
      } else if (subPersonalActivo === 6) {
        idCategoriaFinal = 7
        baseConcepto = `[COMEDOR] - ${baseConcepto}`
      } else if (subPersonalActivo === 4 && empObj) {
        baseConcepto = `[NÓMINA BASE - ${empObj.puesto}] - ${baseConcepto}`
      }

      payload = {
        id_categoria: idCategoriaFinal,
        monto: parseFloat(monto),
        origen_pago: origenPago,
        cuenta_bancaria: cuentaFinal,
        id_empleado: empleadoSeleccionado ? parseInt(empleadoSeleccionado) : null,
        empleado_relacionado: nombreEmpleado,
        concepto: baseConcepto,
        num_comprobante: comprobante ? comprobante.trim() : null
      }
    }

    try {
      const res = await fetch(`${API}/egresos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!res.ok) {
        alert('Error al registrar el gasto de personal.')
        return
      }

      const data = await res.json()
      if (data.success) {
        alert('¡Gasto registrado con éxito!')
        if (subPersonalActivo === 4 && empleadoSeleccionado) {
          setEmpleadosPagados(prev => [...prev, parseInt(empleadoSeleccionado)])
        }
        setSubPersonalActivo(null)
        cargarResumenCaja()
      } else {
        alert(`Error: ${data.error || 'No se pudo registrar el gasto'}`)
      }
    } catch (error) {
      console.error('Error al registrar gasto:', error)
      alert('Error de conexión con el servidor.')
    }
  }

  const handleGuardarPlanta = async () => {
    if (!fechaPago) {
      alert('⚠️ Por favor selecciona la fecha de pago.')
      return
    }

    let cuentaFinal = null
    if (origenPago === 'TRANSFERENCIA') {
      if (!cuentaBancaria) {
        alert('⚠️ Por favor selecciona la cuenta bancaria.')
        return
      }
      cuentaFinal = cuentaBancaria === 'OTRO' ? `OTRO (${nombreDuenioCuenta.trim()})` : cuentaBancaria
    }

    let payload = {}

    if (subPlantaActivo === 8) {
      if (!tipoServicioPublico || totalServiciosPublicos <= 0) {
        alert('⚠️ Ingresa un servicio y un monto válido.')
        return
      }

      payload = {
        id_categoria: 9,
        fecha_pago: fechaPago,
        tipo_servicio: tipoServicioPublico,
        monto: totalServiciosPublicos,
        origen_pago: origenPago,
        cuenta_bancaria: cuentaFinal,
        concepto: JSON.stringify({
          tipo_servicio: tipoServicioPublico,
          desglose: lineasServicios.filter(l => parseFloat(l.monto) > 0)
        })
      }
    } else if (subPlantaActivo === 9) {
      if (!equipoSeleccionado || !tipoServicioMantenimiento || totalMantenimiento <= 0) {
        alert('⚠️ Ingresa los datos completos del mantenimiento.')
        return
      }

      const equipoObj = tipoEquipo === 'Unidad'
        ? unidades.find(u => String(u.id_unidad) === String(equipoSeleccionado))
        : montacargas.find(m => String(m.id_montacargas) === String(equipoSeleccionado))

      const nombreEquipo = equipoObj ? (equipoObj.nombre || equipoObj.placas || equipoObj.num_serie) : null

      payload = {
        id_categoria: 10,
        fecha_pago: fechaPago,
        tipo_equipo: tipoEquipo,
        id_equipo_relacionado: parseInt(equipoSeleccionado),
        equipo_relacionado: nombreEquipo,
        tipo_servicio: tipoServicioMantenimiento,
        monto: totalMantenimiento,
        origen_pago: origenPago,
        cuenta_bancaria: cuentaFinal,
        concepto: JSON.stringify({
          tipo_equipo: tipoEquipo,
          equipo: nombreEquipo,
          tipo_servicio: tipoServicioMantenimiento,
          desglose: lineasMantenimiento.filter(l => parseFloat(l.monto) > 0)
        })
      }
    } else if (subPlantaActivo === 10) {
      if (totalHerramientas <= 0) {
        alert('⚠️ Ingresa herramientas válidas.')
        return
      }

      payload = {
        id_categoria: 11,
        fecha_pago: fechaPago,
        monto: totalHerramientas,
        origen_pago: origenPago,
        cuenta_bancaria: cuentaFinal,
        concepto: JSON.stringify({
          desglose: lineasHerramientas.filter(l => (parseFloat(l.cantidad) * parseFloat(l.precio)) > 0)
        })
      }
    }

    try {
      const res = await fetch(`${API}/egresos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!res.ok) {
        alert('Error al registrar el gasto de planta.')
        return
      }

      const data = await res.json()
      if (data.success) {
        alert('¡Gasto registrado exitosamente!')
        setSubPlantaActivo(null)
        cargarResumenCaja()
      } else {
        alert(`Error: ${data.error || 'No se pudo guardar el gasto'}`)
      }
    } catch (error) {
      console.error('Error al enviar registro de planta:', error)
      alert('Ocurrió un error de conexión con el servidor.')
    }
  }

  const handleGuardarDeptos = async () => {
    let cuentaFinal = null
    if (origenPago === 'TRANSFERENCIA') {
      if (!cuentaBancaria) {
        alert('⚠️ Por favor selecciona la cuenta bancaria de salida.')
        return
      }
      cuentaFinal = cuentaBancaria === 'OTRO' ? `OTRO (${nombreDuenioCuenta.trim()})` : cuentaBancaria
    }

    let payload = {}

    if (subDeptoActivo === 12) {
      if (!fechaPagoDepto || totalMarketing <= 0) {
        alert('⚠️ Completa la fecha y montos de Marketing.')
        return
      }

      payload = {
        id_categoria: 12,
        fecha_pago: fechaPagoDepto,
        monto: totalMarketing,
        origen_pago: origenPago,
        cuenta_bancaria: cuentaFinal,
        concepto: JSON.stringify({
          departamento: 'Marketing',
          fecha_evento: fechaPagoDepto,
          desglose: lineasMarketing.filter((item) => item.tipoGasto && parseFloat(item.monto) > 0)
        })
      }
    } else if (subDeptoActivo === 13) {
      if (!detalleCajaChica.trim() || !montoCajaChica || parseFloat(montoCajaChica) <= 0) {
        alert('⚠️ Ingresa los detalles completos de la Caja Chica.')
        return
      }

      const cant = cantidadCajaChica ? `[Cantidad: ${cantidadCajaChica}] ` : ''

      payload = {
        id_categoria: 13,
        monto: parseFloat(montoCajaChica),
        origen_pago: origenPago,
        cuenta_bancaria: cuentaFinal,
        concepto: `${cant}${detalleCajaChica.trim()}`
      }
    } else if (subDeptoActivo === 14) {
      if (!fechaPagoDepto || !empleadoServicios || !montoServicios || parseFloat(montoServicios) <= 0) {
        alert('⚠️ Ingresa todos los datos requeridos.')
        return
      }

      const empObj = empleados.find((e) => String(e.id_empleado) === String(empleadoServicios))
      const nombreEmpleado = empObj
        ? (empObj.nombre_completo || `${empObj.nombre || ''} ${empObj.apellido1 || ''}`).trim()
        : 'Alma Nely Hernández Minor'

      payload = {
        id_categoria: 14,
        fecha_pago: fechaPagoDepto,
        monto: parseFloat(montoServicios),
        origen_pago: origenPago,
        cuenta_bancaria: cuentaFinal,
        id_empleado: parseInt(empleadoServicios),
        empleado_relacionado: nombreEmpleado,
        concepto: `[SERVICIOS PROFESIONALES] - Honorarios pagados a ${nombreEmpleado}`
      }
    }

    try {
      const res = await fetch(`${API}/egresos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!res.ok) {
        alert('Error al registrar el gasto departamental.')
        return
      }

      const data = await res.json()
      if (data.success) {
        alert('¡Gasto departamental registrado con éxito!')
        setSubDeptoActivo(null)
        cargarResumenCaja()
      } else {
        alert(`Error: ${data.error || 'No se pudo guardar el gasto'}`)
      }
    } catch (error) {
      console.error('Error al registrar gasto departamental:', error)
      alert('Ocurrió un error de conexión con el servidor.')
    }
  }

  // Filtrar empleados reactivamente por el puesto de la pestaña activa
  const empleadosFiltrados = empleados.filter(e => {
    if (!e.puesto) return false
    const puestoEmp = e.puesto.toUpperCase().trim()
    const tabActual = puestoTab.toUpperCase().trim()

    if (tabActual === 'ADMINISTRATIVOS' && (puestoEmp === 'ADMINISTRATIVO' || puestoEmp === 'ADMINISTRATIVOS')) return true
    if (tabActual === 'OPERADORES' && (puestoEmp === 'OPERADOR' || puestoEmp === 'OPERADORES')) return true
    if (tabActual === 'CHOFERES' && (puestoEmp === 'CHOFER' || puestoEmp === 'CHOFERES')) return true
    if (tabActual === 'VENDEDORES' && (puestoEmp === 'VENDEDOR' || puestoEmp === 'VENDEDORES')) return true
    if (tabActual === 'CHALANES' && (puestoEmp === 'CHALAN' || puestoEmp === 'CHALANES')) return true

    return puestoEmp === tabActual
  })

  // FILTRADO DINÁMICO DE MOVIMIENTOS
  const movimientosFiltrados = movimientos.filter((m) => {
    const tipoUpper = m.tipo?.toUpperCase() || ''
    const esIngreso = tipoUpper === 'INGRESO'
    const esEgreso = tipoUpper === 'EGRESO'
    const esTemporal = tipoUpper === 'GASTO TEMPORAL'

    // 1. Filtrado por Tipo de Movimiento
    if (filtroTipo === 'INGRESO' && !esIngreso) return false
    if (filtroTipo === 'EGRESO' && !esEgreso) return false
    if (filtroTipo === 'GASTO TEMPORAL' && !esTemporal) return false

    // 2. Filtrado por Tienda / Cliente (Buscador)
    if (busquedaTienda.trim() !== '') {
      const nombreTienda = (
        m.tienda ||
        m.cliente ||
        m.tienda_cliente ||
        m.nombre_tienda ||
        'Venta General'
      ).toLowerCase()
      const terminoBusqueda = busquedaTienda.trim().toLowerCase()
      if (!nombreTienda.includes(terminoBusqueda)) return false
    }

    // 3. Filtrado por Tipo de Pedido
    if (filtroPedido !== 'TODOS') {
      const esRezagado =
        m.es_rezagado === true ||
        m.tipo_pedido === 'REZAGADO' ||
        m.es_pedido_rezagado ||
        (m.concepto && m.concepto.toLowerCase().includes('rezagado'))

      if (filtroPedido === 'REZAGADO' && (!esIngreso || !esRezagado)) return false
      if (filtroPedido === 'NORMAL' && (!esIngreso || esRezagado)) return false
    }

    // 4. Filtrado por Forma de Pago (Efectivo / Transferencia)
    if (filtroFormaPago !== 'TODOS') {
      const formaPagoUpper = (m.forma_pago || m.origen_pago || 'EFECTIVO').toUpperCase()
      if (filtroFormaPago === 'EFECTIVO' && !formaPagoUpper.includes('EFECTIVO')) return false
      if (filtroFormaPago === 'TRANSFERENCIA' && !formaPagoUpper.includes('TRANSFERENCIA') && !formaPagoUpper.includes('BANCO')) return false
    }

    // 5. Filtrado por Rango de Fecha y Hora
    if (fechaDesde || fechaHasta) {
      if (!m.fecha) return false
      const fechaMov = new Date(m.fecha)
      
      if (fechaDesde) {
        const fDesde = new Date(`${fechaDesde}T00:00:00`)
        if (fechaMov < fDesde) return false
      }
      
      if (fechaHasta) {
        const fHasta = new Date(`${fechaHasta}T23:59:59`)
        if (fechaMov > fHasta) return false
      }
    }

    return true
  })

  // CÁLCULOS DINÁMICOS PARA LA FILA DE TOTALES
  const conteoTipos = movimientosFiltrados.reduce(
    (acc, m) => {
      const tipoUpper = m.tipo?.toUpperCase() || ''
      if (tipoUpper === 'INGRESO') acc.ingresos += 1
      else if (tipoUpper === 'EGRESO') acc.egresos += 1
      else if (tipoUpper === 'GASTO TEMPORAL') acc.temporales += 1
      return acc
    },
    { ingresos: 0, egresos: 0, temporales: 0 }
  )

  const montoTotalFiltrado = movimientosFiltrados.reduce((acc, m) => {
    const tipoUpper = m.tipo?.toUpperCase() || ''
    const val = parseFloat(m.monto || 0)
    if (tipoUpper === 'INGRESO') return acc + val
    return acc - val
  }, 0)

  // DESCARGAR HISTORIAL FILTRADO EN CSV / EXCEL
  const descargarCSV = () => {
    if (movimientosFiltrados.length === 0) {
      alert('No hay movimientos cargados o filtrados para descargar.')
      return
    }

    // Definición de las cabeceras respetando el orden original de las 6 columnas
    const headers = [
      'Tipo',
      'Tienda / Cliente / Concepto',
      'Origen / Tipo Pedido',
      'Forma de Pago',
      'Monto',
      'Fecha y Hora'
    ]

    // Construcción de las filas respetando la lógica de los datos aplicados
    const rows = movimientosFiltrados.map((m) => {
      const tipoUpper = m.tipo?.toUpperCase() || ''
      const esIngreso = tipoUpper === 'INGRESO'

      const tipo = m.tipo || ''

      const nombreTienda =
        m.tienda ||
        m.cliente ||
        m.tienda_cliente ||
        m.nombre_tienda ||
        'Venta General'
      const tiendaConcepto = m.concepto ? `${nombreTienda} - ${m.concepto}` : nombreTienda

      const esRezagado =
        m.es_rezagado === true ||
        m.tipo_pedido === 'REZAGADO' ||
        m.es_pedido_rezagado ||
        (m.concepto && m.concepto.toLowerCase().includes('rezagado'))
      
      const tipoPedido = esIngreso 
        ? (esRezagado ? 'Pedido Rezagado' : 'Pedido Normal')
        : 'N/A'

      const formaPago = m.forma_pago || m.origen_pago || 'Efectivo'

      const val = parseFloat(m.monto || 0)
      const montoFormatted = esIngreso ? val : -val

      const fechaHora = m.fecha ? new Date(m.fecha).toLocaleString('es-MX') : 'N/A'

      // Escapar dobles comillas para evitar rupturas en el formato CSV
      const cleanField = (val) => `"${String(val ?? '').replace(/"/g, '""')}"`

      return [
        cleanField(tipo),
        cleanField(tiendaConcepto),
        cleanField(tipoPedido),
        cleanField(formaPago),
        montoFormatted,
        cleanField(fechaHora)
      ].join(',')
    })

    // UTF-8 BOM (\uFEFF) para forzar a Excel a leer tildes y caracteres especiales correctamente
    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `historial_flujo_caja_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <div style={styles.page}>
      {/* ENCABEZADO CORPORATIVO */}
      <header style={styles.header}>
        <div style={styles.leftSection}>
          <button style={styles.cancel} onClick={() => navigate(-1)}>
            Volver
          </button>
        </div>
        <div style={styles.centerSection}>
          <h1 style={styles.mainTitle}>SALDO TEKC</h1>
        </div>
        <div style={styles.rightSection}>
          <img src={logo} alt="Logo SCAE" style={styles.logo} />
        </div>
      </header>

      {/* TARJETAS DE SALDOS (KPIs) */}
      <div style={styles.kpiGrid}>
        <div style={styles.kpiCard}>
          <p style={styles.kpiTitle}>Saldo general TEKC</p>
          <p style={styles.kpiValue}>${saldos.saldo_tekc.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>
        <div style={styles.kpiCard}>
          <p style={styles.kpiTitle}>Total en efectivo</p>
          <p style={styles.kpiValue}>${saldos.efectivo.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>
        <div style={styles.kpiCard}>
          <p style={styles.kpiTitle}>Total en banco</p>
          <p style={styles.kpiValue}>${saldos.banco.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>
        <div style={styles.kpiCard}>
          <p style={styles.kpiTitle}>Total de ingresos</p>
          <p style={styles.kpiValue}>${saldos.total_ingresos.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>
        <div style={styles.kpiCard}>
          <p style={styles.kpiTitle}>Total de egresos</p>
          <p style={styles.kpiValue}>${saldos.total_egresos.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>
      </div>

      {/* TABLA DE GASTOS TEMPORALES PENDIENTES DE COMPROBAR */}
      {gastosTemporales.length > 0 && (
        <div style={styles.movimientosCard}>
          <h3 style={{ color: vino, marginTop: 0, marginBottom: '10px' }}>
            ⏳ Gastos Temporales Pendientes por Comprobar
          </h3>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Empleado</th>
                <th style={styles.th}>Concepto</th>
                <th style={styles.th}>Origen Pago</th>
                <th style={styles.th}>Monto Entregado</th>
                <th style={styles.th}>Fecha Entrega</th>
                <th style={styles.th}>Acción</th>
              </tr>
            </thead>
            <tbody>
              {gastosTemporales.map((gt) => (
                <tr key={gt.id_temporal}>
                  <td style={styles.td}>
                    <strong>{gt.empleado_nombre}</strong> ({gt.puesto})
                  </td>
                  <td style={styles.td}>{gt.concepto}</td>
                  <td style={styles.td}>{gt.origen_pago}</td>
                  <td style={{ ...styles.td, ...styles.montoEgreso }}>
                    -${parseFloat(gt.monto_entregado).toFixed(2)}
                  </td>
                  <td style={styles.td}>
                    {new Date(gt.fecha_entrega).toLocaleString()}
                  </td>
                  <td style={styles.td}>
                    <button
                      style={styles.actionBtn}
                      onClick={() => handleComprobarGastoTemporal(gt)}
                    >
                      Comprobar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TABLA DE HISTORIAL DE MOVIMIENTOS DE CAJA (DESPLEGABLE / PLEGABLE) */}
      <div style={styles.movimientosCard}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            userSelect: 'none'
          }}
          onClick={() => setHistorialAbierto(!historialAbierto)}
        >
          <h3 style={{ color: vino, margin: 0 }}>
            📜 Historial de movimientos de caja
          </h3>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            {historialAbierto && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  descargarCSV()
                }}
                style={{
                  backgroundColor: '#16a34a',
                  color: '#ffffff',
                  border: 'none',
                  padding: '6px 14px',
                  borderRadius: '20px',
                  fontSize: '13px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                📥 Descargar hoja de calculo 
              </button>
            )}
            <button
              type="button"
              style={{
                backgroundColor: vino,
                color: '#ffffff',
                border: 'none',
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '13px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              {historialAbierto ? '▲ Ocultar Detalles' : '▼ Ver Detalles'}
            </button>
          </div>
        </div>

        {historialAbierto && (
          <div style={{ marginTop: '15px' }}>
            {cargandoResumen ? (
              <p style={{ color: '#64748b' }}>Cargando movimientos...</p>
            ) : movimientos.length === 0 ? (
              <p style={{ color: '#64748b' }}>No hay movimientos registrados en la caja actual.</p>
            ) : (
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span>Tipo</span>
                        <select
                          value={filtroTipo}
                          onChange={(e) => setFiltroTipo(e.target.value)}
                          style={{
                            padding: '4px 8px',
                            borderRadius: '6px',
                            border: '1px solid #cbd5e1',
                            fontSize: '12px',
                            backgroundColor: '#ffffff',
                            color: '#334155',
                            cursor: 'pointer',
                            fontWeight: 'normal'
                          }}
                        >
                          <option value="TODOS">🔍 Todos los tipos</option>
                          <option value="INGRESO">🟢 INGRESO</option>
                          <option value="EGRESO">🔴 EGRESO</option>
                          <option value="GASTO TEMPORAL">🟡 GASTO TEMPORAL</option>
                        </select>
                      </div>
                    </th>
                    <th style={styles.th}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span>Tienda</span>
                        <input
                          type="text"
                          placeholder="🔍 Buscar tienda..."
                          value={busquedaTienda}
                          onChange={(e) => setBusquedaTienda(e.target.value)}
                          style={{
                            padding: '4px 8px',
                            borderRadius: '6px',
                            border: '1px solid #cbd5e1',
                            fontSize: '12px',
                            backgroundColor: '#ffffff',
                            color: '#334155',
                            fontWeight: 'normal',
                            outline: 'none',
                            boxSizing: 'border-box'
                          }}
                        />
                      </div>
                    </th>
                    <th style={styles.th}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span>Tipo Pedido</span>
                        <select
                          value={filtroPedido}
                          onChange={(e) => setFiltroPedido(e.target.value)}
                          style={{
                            padding: '4px 8px',
                            borderRadius: '6px',
                            border: '1px solid #cbd5e1',
                            fontSize: '12px',
                            backgroundColor: '#ffffff',
                            color: '#334155',
                            cursor: 'pointer',
                            fontWeight: 'normal'
                          }}
                        >
                          <option value="TODOS">🔍 Todos los pedidos</option>
                          <option value="NORMAL">🛒 Pedidos normales</option>
                          <option value="REZAGADO">📦 Pedidos rezagados</option>
                        </select>
                      </div>
                    </th>
                    <th style={styles.th}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span>Forma de pago</span>
                        <select
                          value={filtroFormaPago}
                          onChange={(e) => setFiltroFormaPago(e.target.value)}
                          style={{
                            padding: '4px 8px',
                            borderRadius: '6px',
                            border: '1px solid #cbd5e1',
                            fontSize: '12px',
                            backgroundColor: '#ffffff',
                            color: '#334155',
                            cursor: 'pointer',
                            fontWeight: 'normal'
                          }}
                        >
                          <option value="TODOS">🔍 Todas las formas</option>
                          <option value="EFECTIVO">💵 Efectivo</option>
                          <option value="TRANSFERENCIA">💳 Transferencia</option>
                        </select>
                      </div>
                    </th>
                    <th style={styles.th}>Monto</th>
                    <th style={styles.th}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span>Fecha y Hora</span>
                        <div style={{ display: 'flex', gap: '4px' }}>
                          <input
                            type="date"
                            value={fechaDesde}
                            onChange={(e) => setFechaDesde(e.target.value)}
                            title="Fecha Desde"
                            style={{
                              padding: '3px 4px',
                              borderRadius: '6px',
                              border: '1px solid #cbd5e1',
                              fontSize: '11px',
                              backgroundColor: '#ffffff',
                              color: '#334155',
                              fontWeight: 'normal',
                              outline: 'none',
                              width: '50%'
                            }}
                          />
                          <input
                            type="date"
                            value={fechaHasta}
                            onChange={(e) => setFechaHasta(e.target.value)}
                            title="Fecha Hasta"
                            style={{
                              padding: '3px 4px',
                              borderRadius: '6px',
                              border: '1px solid #cbd5e1',
                              fontSize: '11px',
                              backgroundColor: '#ffffff',
                              color: '#334155',
                              fontWeight: 'normal',
                              outline: 'none',
                              width: '50%'
                            }}
                          />
                        </div>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {movimientosFiltrados.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ ...styles.td, textAlign: 'center', color: '#64748b' }}>
                        No se encontraron movimientos para los filtros seleccionados.
                      </td>
                    </tr>
                  ) : (
                    movimientosFiltrados.map((m, idx) => {
                      const tipoUpper = m.tipo?.toUpperCase() || ''
                      const esIngreso = tipoUpper === 'INGRESO'
                      const esTemporal = tipoUpper === 'GASTO TEMPORAL'

                      // 1. Detección dinámica de Tienda / Cliente
                      const nombreTienda =
                        m.tienda ||
                        m.cliente ||
                        m.tienda_cliente ||
                        m.nombre_tienda ||
                        'Venta General'

                      // 2. Detección de Pedido Rezagado vs Pedido Normal
                      const esRezagado =
                        m.es_rezagado === true ||
                        m.tipo_pedido === 'REZAGADO' ||
                        m.es_pedido_rezagado ||
                        (m.concepto && m.concepto.toLowerCase().includes('rezagado'))

                      return (
                        <tr key={m.id_movimiento || idx}>
                          <td style={styles.td}>
                            <span
                              style={
                                esIngreso
                                  ? styles.badgeIngreso
                                  : esTemporal
                                  ? styles.badgeTemporal
                                  : styles.badgeEgreso
                              }
                            >
                              {m.tipo}
                            </span>
                          </td>

                          {/* Columna Tienda / Cliente */}
                          <td style={styles.td}>
                            <strong>{nombreTienda}</strong>
                            {m.concepto && (
                              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                                {m.concepto.split('-')[0].trim()}
                              </div>
                            )}
                          </td>

                          {/* Columna Tipo de Pedido */}
                          <td style={styles.td}>
                            {esIngreso ? (
                              <span
                                style={{
                                  padding: '4px 10px',
                                  borderRadius: '10px',
                                  fontSize: '11px',
                                  fontWeight: 'bold',
                                  backgroundColor: esRezagado ? '#dcfce7' : '#e0f2fe',
                                  color: esRezagado ? '#15803d' : '#0369a1',
                                  border: esRezagado ? '1px solid #86efac' : 'none'
                                }}
                              >
                                {esRezagado ? '📦 Pedido Rezagado' : '🛒 Pedido Normal'}
                              </span>
                            ) : (
                              <span style={{ color: '#94a3b8', fontSize: '12px' }}>N/A</span>
                            )}
                          </td>

                          <td style={styles.td}>
                            {m.forma_pago || m.origen_pago || 'Efectivo'}
                          </td>

                          <td
                            style={{
                              ...styles.td,
                              ...(esIngreso ? styles.montoIngreso : styles.montoEgreso)
                            }}
                          >
                            {esIngreso
                              ? `+$${parseFloat(m.monto || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}`
                              : `-$${parseFloat(m.monto || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}`}
                          </td>

                          <td style={styles.td}>
                            {m.fecha
                              ? new Date(m.fecha).toLocaleDateString('es-MX', {
                                  day: '2-digit',
                                  month: '2-digit',
                                  year: 'numeric'
                                })
                              : 'N/A'}
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>

                {/* FILA DE TOTALES EN EL PIE DE LA TABLA */}
                <tfoot>
                  <tr>
                    <td style={styles.tf}>
                      <div style={{ fontSize: '12px', lineHeight: '1.4' }}>
                        <div>🟢 Ingresos: <strong>{conteoTipos.ingresos}</strong></div>
                        <div>🔴 Egresos: <strong>{conteoTipos.egresos}</strong></div>
                        {conteoTipos.temporales > 0 && (
                          <div>🟡 Temp: <strong>{conteoTipos.temporales}</strong></div>
                        )}
                      </div>
                    </td>
                    <td style={styles.tf}>
                      TOTAL FILTRADO ({movimientosFiltrados.length} registros)
                    </td>
                    <td style={styles.tf}>-</td>
                    <td style={styles.tf}>-</td>
                    <td
                      style={{
                        ...styles.tf,
                        color: montoTotalFiltrado >= 0 ? '#16a34a' : '#dc2626',
                        fontSize: '15px'
                      }}
                    >
                      {montoTotalFiltrado >= 0 ? '+' : ''}$
                      {montoTotalFiltrado.toLocaleString('es-MX', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </td>
                    <td style={styles.tf}>-</td>
                  </tr>
                </tfoot>
              </table>
            )}
          </div>
        )}
      </div>

      {/* SUBTÍTULO DESGLOSE DE CAJA */}
      <h2 style={styles.subTitle}>DESGLOSE DE CAJA</h2>

      {/* 🏭 TARJETA PRINCIPAL 1: GASTOS OPERATIVOS (PRODUCCIÓN) */}
      <div style={styles.parentCard}>
        <div
          style={styles.parentHeader}
          onClick={() => setProduccionAbierto(!produccionAbierto)}
        >
          <div style={styles.parentTitleGroup}>
            <span style={{ fontSize: '28px' }}>🏭</span>
            <div>
              <h3 style={styles.parentTitle}>GASTOS OPERATIVOS (PRODUCCIÓN)</h3>
              <p style={styles.parentSubtitle}>
                Gastos asociados a materias primas, bolsa y equipo de protección del personal de planta.
              </p>
            </div>
          </div>
          <span style={styles.toggleBadge}>
            {produccionAbierto ? '▼ Ocultar' : '▶ Desplegar'}
          </span>
        </div>

        {produccionAbierto && (
          <div>
            <div style={styles.cardsContainer}>
              <div
                style={{ ...styles.card, ...(apartadoActivo === 1 ? styles.cardActive : {}) }}
                onClick={() => handleSelectApartado(1)}
              >
                <div style={styles.cardHeader}>
                  <span style={styles.cardName}>Materias primas</span>
                  <span style={styles.cardIcon}>📦</span>
                </div>
                <p style={styles.cardDesc}>Cemento blanco, cemento gris, cal, impalpable, aditivos, malla.</p>
              </div>

              <div
                style={{ ...styles.card, ...(apartadoActivo === 2 ? styles.cardActive : {}) }}
                onClick={() => handleSelectApartado(2)}
              >
                <div style={styles.cardHeader}>
                  <span style={styles.cardName}>Protección personal (EPP)</span>
                  <span style={styles.cardIcon}>🥽</span>
                </div>
                <p style={styles.cardDesc}>Mascarillas y equipo de protección para operadores.</p>
              </div>

              <div
                style={{ ...styles.card, ...(apartadoActivo === 3 ? styles.cardActive : {}) }}
                onClick={() => handleSelectApartado(3)}
              >
                <div style={styles.cardHeader}>
                  <span style={styles.cardName}>Bolsa</span>
                  <span style={styles.cardIcon}>🛍️</span>
                </div>
                <p style={styles.cardDesc}>Bolsa de cada uno de nuestros productos.</p>
              </div>
            </div>

            {apartadoActivo && (
              <div style={styles.formContainer}>
                <div style={styles.formTitle}>
                  <span>
                    Estás capturando gasto en:{' '}
                    {apartadoActivo === 1 && '📦 Materias primas'}
                    {apartadoActivo === 2 && '🥽 Equipo de protección personal (EPP)'}
                    {apartadoActivo === 3 && '🛍️ Insumos de bolsa'}
                  </span>
                  <button type="button" style={styles.closeBtn} onClick={() => setApartadoActivo(null)}>
                    ✕ Cerrar
                  </button>
                </div>

                <form onSubmit={(e) => e.preventDefault()} style={styles.grid}>
                  {apartadoActivo === 1 && (
                    <div style={styles.fieldGroup}>
                      <label style={styles.label}>Insumo de materia prima *</label>
                      <select
                        style={styles.select}
                        value={subopcionSeleccionada}
                        onChange={(e) => setSubopcionSeleccionada(e.target.value)}
                        required
                      >
                        <option value="">-- Seleccionar insumo --</option>
                        <option value="Cemento Blanco">Cemento blanco</option>
                        <option value="Cemento Gris">Cemento gris</option>
                        <option value="Cal">Cal</option>
                        <option value="Impalpable">Impalpable</option>
                        <option value="Aditivos">Aditivos</option>
                        <option value="Malla">Malla</option>
                      </select>
                    </div>
                  )}

                  {apartadoActivo === 2 && (
                    <div style={styles.fieldGroup}>
                      <label style={styles.label}>Tipo de equipo de protección *</label>
                      <select
                        style={styles.select}
                        value={subopcionSeleccionada}
                        onChange={(e) => setSubopcionSeleccionada(e.target.value)}
                        required
                      >
                        <option value="">-- Seleccionar tipo --</option>
                        <option value="Mascarillas Antipolvo">Mascarillas antipolvo</option>
                      </select>
                    </div>
                  )}

                  {apartadoActivo === 3 && (
                    <div style={styles.fieldGroup}>
                      <label style={styles.label}>Bolsa *</label>
                      <select
                        style={styles.select}
                        value={productoSeleccionado}
                        onChange={(e) => setProductoSeleccionado(e.target.value)}
                        required
                      >
                        <option value="">-- Seleccionar producto del catálogo --</option>
                        {productosBD.map((prod) => (
                          <option key={prod.id_producto} value={prod.id_producto}>
                            {prod.nombre} ({prod.unidad_medida})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div style={styles.fieldGroup}>
                    <label style={styles.label}>Origen de pago *</label>
                    <select
                      style={styles.select}
                      value={origenPago}
                      onChange={(e) => {
                        setOrigenPago(e.target.value)
                        if (e.target.value !== 'TRANSFERENCIA') {
                          setCuentaBancaria('')
                          setNombreDuenioCuenta('')
                        }
                      }}
                    >
                      <option value="EFECTIVO">Efectivo</option>
                      <option value="TRANSFERENCIA">Transferencia</option>
                    </select>
                  </div>

                  {origenPago === 'TRANSFERENCIA' && (
                    <div style={styles.fieldGroup}>
                      <label style={styles.label}>Cuenta Bancaria de Salida *</label>
                      <select
                        style={styles.select}
                        value={cuentaBancaria}
                        onChange={(e) => {
                          setCuentaBancaria(e.target.value)
                          if (e.target.value !== 'OTRO') setNombreDuenioCuenta('')
                        }}
                        required
                      >
                        <option value="">-- Seleccionar Cuenta --</option>
                        <option value="Cuenta Fiscal">Cuenta fiscal</option>
                        <option value="OTRO">Otro</option>
                      </select>
                    </div>
                  )}

                  {origenPago === 'TRANSFERENCIA' && cuentaBancaria === 'OTRO' && (
                    <div style={styles.fieldGroup}>
                      <label style={styles.label}>Nombre y Apellido del dueño de la cuenta *</label>
                      <input
                        type="text"
                        placeholder="Ej. Eli Maravillas"
                        style={styles.input}
                        value={nombreDuenioCuenta}
                        onChange={(e) => setNombreDuenioCuenta(e.target.value)}
                        required
                      />
                    </div>
                  )}

                  <div style={styles.fieldGroup}>
                    <label style={styles.label}>Monto pagado ($) *</label>
                    <input
                      type="number"
                      step="any"
                      min="0.01"
                      placeholder="0.00"
                      style={styles.input}
                      value={monto}
                      onChange={(e) => setMonto(e.target.value)}
                      required
                    />
                  </div>

                  <div style={{ ...styles.fieldGroup, ...styles.fullRow }}>
                    <label style={styles.label}>Comentarios (Opcional)</label>
                    <textarea
                      rows="2"
                      placeholder="Escribe un comentario si se requiere..."
                      style={{ ...styles.input, resize: 'vertical' }}
                      value={concepto}
                      onChange={(e) => setConcepto(e.target.value)}
                    />
                  </div>

                  <div style={styles.fullRow}>
                    <button type="button" onClick={handleGuardarOperativos} style={styles.submitButton}>
                      Guardar registro de gasto
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 👥 TARJETA PRINCIPAL 2: GASTOS DE PERSONAL */}
      <div style={styles.parentCard}>
        <div
          style={styles.parentHeader}
          onClick={() => setPersonalAbierto(!personalAbierto)}
        >
          <div style={styles.parentTitleGroup}>
            <span style={{ fontSize: '28px' }}>👥</span>
            <div>
              <h3 style={styles.parentTitle}>GASTOS DE PERSONAL</h3>
              <p style={styles.parentSubtitle}>
                Pago de nómina base, IMSS, ISR, comedor, entrega de gastos temporales y viáticos.
              </p>
            </div>
          </div>
          <span style={styles.toggleBadge}>
            {personalAbierto ? '▼ Ocultar' : '▶ Desplegar'}
          </span>
        </div>

        {personalAbierto && (
          <div>
            <div style={styles.cardsContainer}>
              <div
                style={{ ...styles.card, ...(subPersonalActivo === 4 ? styles.cardActive : {}) }}
                onClick={() => handleSelectSubPersonal(4)}
              >
                <div style={styles.cardHeader}>
                  <span style={styles.cardName}>Nómina Base</span>
                  <span style={styles.cardIcon}>💵</span>
                </div>
                <p style={styles.cardDesc}>
                  Sueldos de Administrativos, Operadores, Choferes, Vendedores y Chalanes.
                </p>
              </div>

              <div
                style={{ ...styles.card, ...(subPersonalActivo === 5 ? styles.cardActive : {}) }}
                onClick={() => handleSelectSubPersonal(5)}
              >
                <div style={styles.cardHeader}>
                  <span style={styles.cardName}>IMSS e ISR</span>
                  <span style={styles.cardIcon}>🏥</span>
                </div>
                <p style={styles.cardDesc}>Gastos de IMSS y ISR en los trabajadores.</p>
              </div>

              <div
                style={{ ...styles.card, ...(subPersonalActivo === 6 ? styles.cardActive : {}) }}
                onClick={() => handleSelectSubPersonal(6)}
              >
                <div style={styles.cardHeader}>
                  <span style={styles.cardName}>Comedor</span>
                  <span style={styles.cardIcon}>🍽️</span>
                </div>
                <p style={styles.cardDesc}>Gasto semanal en desayunos (PAGO A DOÑA LUCI)</p>
              </div>

              <div
                style={{ ...styles.card, ...(subPersonalActivo === 7 ? styles.cardActive : {}) }}
                onClick={() => handleSelectSubPersonal(7)}
              >
                <div style={styles.cardHeader}>
                  <span style={styles.cardName}>Viáticos</span>
                  <span style={styles.cardIcon}>✈️</span>
                </div>
                <p style={styles.cardDesc}>
                  Asignaciones directas para gastos de transporte, comidas y despensa del personal.
                </p>
              </div>

              <div
                style={{ ...styles.card, ...(subPersonalActivo === 88 ? styles.cardActive : {}) }}
                onClick={() => handleSelectSubPersonal(88)}
              >
                <div style={styles.cardHeader}>
                  <span style={styles.cardName}>Entrega Temporal</span>
                  <span style={styles.cardIcon}>⏳</span>
                </div>
                <p style={styles.cardDesc}>
                  Entrega de efectivo pendiente por comprobar que reduce la caja activa.
                </p>
              </div>
            </div>

            {subPersonalActivo && (
              <div style={styles.formContainer}>
                <div style={styles.formTitle}>
                  <span>
                    Estás capturando:{' '}
                    {subPersonalActivo === 4 && '💵 Nómina Base'}
                    {subPersonalActivo === 5 && '🏥 IMSS / ISR'}
                    {subPersonalActivo === 6 && '🍽️ Comedor'}
                    {subPersonalActivo === 7 && '✈️ Viáticos'}
                    {subPersonalActivo === 88 && '⏳ Entrega de Dinero Temporal'}
                  </span>
                  <button type="button" style={styles.closeBtn} onClick={() => setSubPersonalActivo(null)}>
                    ✕ Cerrar
                  </button>
                </div>

                <form onSubmit={(e) => e.preventDefault()} style={styles.grid}>
                  {subPersonalActivo === 88 && (
                    <>
                      <div style={styles.fieldGroup}>
                        <label style={styles.label}>Empleado que recibe dinero *</label>
                        <select
                          style={styles.select}
                          value={empleadoSeleccionado}
                          onChange={(e) => setEmpleadoSeleccionado(e.target.value)}
                          required
                        >
                          <option value="">-- Seleccionar empleado --</option>
                          {empleados.map((emp) => (
                            <option key={emp.id_empleado} value={emp.id_empleado}>
                              {emp.nombre_completo || `${emp.nombre || ''} ${emp.apellido1 || ''}`} ({emp.puesto})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div style={styles.fieldGroup}>
                        <label style={styles.label}>Monto Entregado ($) *</label>
                        <input
                          type="number"
                          step="any"
                          min="0.01"
                          placeholder="0.00"
                          style={styles.input}
                          value={monto}
                          onChange={(e) => setMonto(e.target.value)}
                          required
                        />
                      </div>

                      <div style={styles.fieldGroup}>
                        <label style={styles.label}>Origen de pago *</label>
                        <select
                          style={styles.select}
                          value={origenPago}
                          onChange={(e) => setOrigenPago(e.target.value)}
                        >
                          <option value="EFECTIVO">Efectivo</option>
                          <option value="TRANSFERENCIA">Transferencia</option>
                        </select>
                      </div>

                      <div style={{ ...styles.fieldGroup, ...styles.fullRow }}>
                        <label style={styles.label}>Concepto / Motivo de la entrega *</label>
                        <textarea
                          rows="2"
                          placeholder="Ej. Entrega para viáticos de viaje a Veracruz..."
                          style={{ ...styles.input, resize: 'vertical' }}
                          value={concepto}
                          onChange={(e) => setConcepto(e.target.value)}
                          required
                        />
                      </div>

                      <div style={styles.fullRow}>
                        <button type="button" onClick={handleGuardarGastoTemporal} style={styles.submitButton}>
                          Registrar Entrega Temporal
                        </button>
                      </div>
                    </>
                  )}

                  {subPersonalActivo === 4 && (
                    <div style={{ ...styles.fullRow, marginBottom: '10px' }}>
                      <label style={styles.label}>1. Seleccionar semana a pagar</label>
                      <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                        <input
                          type="date"
                          style={styles.input}
                          value={fechaInicioSemana}
                          onChange={(e) => setFechaInicioSemana(e.target.value)}
                        />
                        <span style={{ alignSelf: 'center', fontWeight: 'bold' }}>a</span>
                        <input
                          type="date"
                          style={styles.input}
                          value={fechaFinSemana}
                          onChange={(e) => setFechaFinSemana(e.target.value)}
                        />
                      </div>

                      <label style={{ ...styles.label, marginTop: '18px', display: 'block' }}>
                        2. Puesto del personal
                      </label>
                      <div style={styles.puestoTabs}>
                        {['ADMINISTRATIVOS', 'OPERADORES', 'CHOFERES', 'VENDEDORES', 'CHALANES'].map((puesto) => (
                          <button
                            key={puesto}
                            type="button"
                            style={{
                              ...styles.puestoTabBtn,
                              ...(puestoTab === puesto ? styles.puestoTabActive : {})
                            }}
                            onClick={() => {
                              setPuestoTab(puesto)
                              setEmpleadoSeleccionado('')
                            }}
                          >
                            {puesto}
                          </button>
                        ))}
                      </div>

                      <label style={{ ...styles.label, marginBottom: '8px', display: 'block' }}>
                        3. Seleccionar trabajador
                      </label>
                      <div style={styles.empleadosGrid}>
                        {empleadosFiltrados.map((emp) => {
                          const estaPagado = empleadosPagados.includes(emp.id_empleado)
                          const estaSeleccionado = String(empleadoSeleccionado) === String(emp.id_empleado)
                          const nombreCompleto = emp.nombre_completo || `${emp.nombre || ''} ${emp.apellido1 || ''}`

                          return (
                            <div
                              key={emp.id_empleado}
                              style={{
                                ...styles.empleadoCard,
                                ...(estaSeleccionado ? styles.empleadoCardSelected : {})
                              }}
                              onClick={() => {
                                setEmpleadoSeleccionado(emp.id_empleado)
                                if (emp.sueldo_base) setMonto(emp.sueldo_base)
                              }}
                            >
                              <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#1e293b' }}>
                                {nombreCompleto}
                              </span>
                              <span
                                style={{
                                  ...styles.statusBadge,
                                  ...(estaPagado ? styles.badgePagado : styles.badgePendiente)
                                }}
                              >
                                {estaPagado ? 'Pagado' : 'Pendiente'}
                              </span>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {subPersonalActivo === 5 && (
                    <div style={styles.fieldGroup}>
                      <label style={styles.label}>Tipo de Impuesto *</label>
                      <select
                        style={styles.select}
                        value={subTipoImpuesto}
                        onChange={(e) => setSubTipoImpuesto(e.target.value)}
                      >
                        <option value="IMSS">IMSS</option>
                        <option value="ISR">ISR</option>
                      </select>
                    </div>
                  )}

                  {subPersonalActivo === 5 && (
                    <div style={styles.fieldGroup}>
                      <label style={styles.label}>Empleado asignado (Opcional)</label>
                      <select
                        style={styles.select}
                        value={empleadoSeleccionado}
                        onChange={(e) => setEmpleadoSeleccionado(e.target.value)}
                      >
                        <option value="">-- Pago General / Global --</option>
                        {empleados.map((emp) => (
                          <option key={emp.id_empleado} value={emp.id_empleado}>
                            {emp.nombre_completo || `${emp.nombre || ''} ${emp.apellido1 || ''}`}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {subPersonalActivo === 7 && (
                    <>
                      <div style={styles.fieldGroup}>
                        <label style={styles.label}>Empleado que recibe viáticos *</label>
                        <select
                          style={styles.select}
                          value={empleadoSeleccionado}
                          onChange={(e) => handleEmpleadoViaticosChange(e.target.value)}
                          required
                        >
                          <option value="">-- Seleccionar empleado --</option>
                          {empleados.map((emp) => (
                            <option key={emp.id_empleado} value={emp.id_empleado}>
                              {emp.nombre_completo || `${emp.nombre || ''} ${emp.apellido1 || ''}`} ({emp.puesto})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div style={styles.fieldGroup}>
                        <label style={styles.label}>Ruta de Viaje {esChofer && '*'}</label>
                        <select
                          style={styles.select}
                          value={idRutaSeleccionada}
                          onChange={(e) => setIdRutaSeleccionada(e.target.value)}
                          required={esChofer}
                        >
                          <option value="">-- Seleccionar ruta --</option>
                          {rutas.map((r) => (
                            <option key={r.id_ruta} value={r.id_ruta}>
                              {r.nombre || r.origen_destino}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div style={styles.fieldGroup}>
                        <label style={styles.label}>Unidad Vehicular {esChofer && '*'}</label>
                        <select
                          style={styles.select}
                          value={idUnidadSeleccionada}
                          onChange={(e) => setIdUnidadSeleccionada(e.target.value)}
                          required={esChofer}
                        >
                          <option value="">-- Seleccionar unidad --</option>
                          {unidades.map((u) => (
                            <option key={u.id_unidad} value={u.id_unidad}>
                              {u.nombre || u.placas}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* CASETAS */}
                      <div style={{ ...styles.fullRow, ...styles.dynamicBlock }}>
                        <div style={styles.dynamicHeader}>
                          <span>🚘 Casetas ($)</span>
                          <button
                            type="button"
                            style={styles.addBtn}
                            onClick={() => handleAgregarCampo(setCasetas, casetas)}
                          >
                            +
                          </button>
                        </div>
                        {casetas.map((montoCaseta, idx) => (
                          <div key={idx} style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
                            <input
                              type="number"
                              step="any"
                              placeholder="Monto de caseta"
                              style={styles.input}
                              value={montoCaseta}
                              onChange={(e) => handleCambioCampo(setCasetas, casetas, idx, e.target.value)}
                            />
                            {casetas.length > 1 && (
                              <button
                                type="button"
                                style={styles.removeBtn}
                                onClick={() => handleEliminarCampo(setCasetas, casetas, idx)}
                              >
                                ✕
                              </button>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* GASOLINA */}
                      <div style={{ ...styles.fullRow, ...styles.dynamicBlock }}>
                        <div style={styles.dynamicHeader}>
                          <span>⛽ Gasolina / Combustible ($)</span>
                          <button
                            type="button"
                            style={styles.addBtn}
                            onClick={() => handleAgregarCampo(setGasolina, gasolina)}
                          >
                            +
                          </button>
                        </div>
                        {gasolina.map((montoGasolina, idx) => (
                          <div key={idx} style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
                            <input
                              type="number"
                              step="any"
                              placeholder="Monto de gasolina"
                              style={styles.input}
                              value={montoGasolina}
                              onChange={(e) => handleCambioCampo(setGasolina, gasolina, idx, e.target.value)}
                            />
                            {gasolina.length > 1 && (
                              <button
                                type="button"
                                style={styles.removeBtn}
                                onClick={() => handleEliminarCampo(setGasolina, gasolina, idx)}
                              >
                                ✕
                              </button>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* COMIDAS */}
                      <div style={{ ...styles.fullRow, ...styles.dynamicBlock }}>
                        <div style={styles.dynamicHeader}>
                          <span>🍔 Comidas / Alimentos ($)</span>
                          <button
                            type="button"
                            style={styles.addBtn}
                            onClick={() => handleAgregarCampo(setComidas, comidas)}
                          >
                            +
                          </button>
                        </div>
                        {comidas.map((montoComida, idx) => (
                          <div key={idx} style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
                            <input
                              type="number"
                              step="any"
                              placeholder="Monto de alimentos"
                              style={styles.input}
                              value={montoComida}
                              onChange={(e) => handleCambioCampo(setComidas, comidas, idx, e.target.value)}
                            />
                            {comidas.length > 1 && (
                              <button
                                type="button"
                                style={styles.removeBtn}
                                onClick={() => handleEliminarCampo(setComidas, comidas, idx)}
                              >
                                ✕
                              </button>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* FOLIOS */}
                      <div style={{ ...styles.fullRow, ...styles.dynamicBlock }}>
                        <div style={styles.dynamicHeader}>
                          <span>📄 Folios / Comprobantes {esChofer && '*'}</span>
                          <button
                            type="button"
                            style={styles.addBtn}
                            onClick={() => handleAgregarCampo(setFolios, folios)}
                          >
                            +
                          </button>
                        </div>
                        {folios.map((folio, idx) => (
                          <div key={idx} style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
                            <input
                              type="text"
                              placeholder="Número de folio o ticket"
                              style={styles.input}
                              value={folio}
                              onChange={(e) => handleCambioCampo(setFolios, folios, idx, e.target.value)}
                              required={esChofer && idx === 0}
                            />
                            {folios.length > 1 && (
                              <button
                                type="button"
                                style={styles.removeBtn}
                                onClick={() => handleEliminarCampo(setFolios, folios, idx)}
                              >
                                ✕
                              </button>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* RESUMEN DE TOTAL DE VIÁTICOS */}
                      <div style={{ ...styles.fullRow, ...styles.totalSummaryBox }}>
                        <div style={{ fontSize: '13px', color: '#64748b' }}>
                          Casetas: ${totalCasetas.toFixed(2)} | Gasolina: ${totalGasolina.toFixed(2)} | Comidas: ${totalComidas.toFixed(2)}
                        </div>
                        <div style={{ fontSize: '18px', fontWeight: 'bold', color: vino, marginTop: '4px' }}>
                          Total Viáticos: ${totalViaticosGeneral.toFixed(2)}
                        </div>
                      </div>
                    </>
                  )}

                  {subPersonalActivo !== 88 && subPersonalActivo !== 7 && (
                    <>
                      <div style={styles.fieldGroup}>
                        <label style={styles.label}>Origen de pago *</label>
                        <select
                          style={styles.select}
                          value={origenPago}
                          onChange={(e) => {
                            setOrigenPago(e.target.value)
                            if (e.target.value !== 'TRANSFERENCIA') {
                              setCuentaBancaria('')
                              setNombreDuenioCuenta('')
                            }
                          }}
                        >
                          <option value="EFECTIVO">Efectivo</option>
                          <option value="TRANSFERENCIA">Transferencia</option>
                        </select>
                      </div>

                      {origenPago === 'TRANSFERENCIA' && (
                        <div style={styles.fieldGroup}>
                          <label style={styles.label}>Cuenta Bancaria de Salida *</label>
                          <select
                            style={styles.select}
                            value={cuentaBancaria}
                            onChange={(e) => {
                              setCuentaBancaria(e.target.value)
                              if (e.target.value !== 'OTRO') setNombreDuenioCuenta('')
                            }}
                            required
                          >
                            <option value="">-- Seleccionar Cuenta --</option>
                            <option value="Cuenta Fiscal">Cuenta fiscal</option>
                            <option value="OTRO">Otro</option>
                          </select>
                        </div>
                      )}

                      {origenPago === 'TRANSFERENCIA' && cuentaBancaria === 'OTRO' && (
                        <div style={styles.fieldGroup}>
                          <label style={styles.label}>Nombre y Apellido del dueño de la cuenta *</label>
                          <input
                            type="text"
                            placeholder="Ej. Eli Maravillas"
                            style={styles.input}
                            value={nombreDuenioCuenta}
                            onChange={(e) => setNombreDuenioCuenta(e.target.value)}
                            required
                          />
                        </div>
                      )}

                      <div style={styles.fieldGroup}>
                        <label style={styles.label}>Monto Pagado ($) *</label>
                        <input
                          type="number"
                          step="any"
                          min="0.01"
                          placeholder="0.00"
                          style={styles.input}
                          value={monto}
                          onChange={(e) => setMonto(e.target.value)}
                          required
                        />
                      </div>
                    </>
                  )}

                  {subPersonalActivo !== 88 && (
                    <>
                      <div style={{ ...styles.fieldGroup, ...styles.fullRow }}>
                        <label style={styles.label}>Comentarios u Observaciones (Opcional)</label>
                        <textarea
                          rows="2"
                          placeholder="Notas sobre el pago de personal..."
                          style={{ ...styles.input, resize: 'vertical' }}
                          value={concepto}
                          onChange={(e) => setConcepto(e.target.value)}
                        />
                      </div>

                      <div style={styles.fullRow}>
                        <button type="button" onClick={handleGuardarPersonal} style={styles.submitButton}>
                          Guardar Registro de Personal
                        </button>
                      </div>
                    </>
                  )}
                </form>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 🏢 TARJETA PRINCIPAL 3: PLANTA Y MANTENIMIENTO */}
      <div style={styles.parentCard}>
        <div
          style={styles.parentHeader}
          onClick={() => setPlantaAbierto(!plantaAbierto)}
        >
          <div style={styles.parentTitleGroup}>
            <span style={{ fontSize: '28px' }}>🏢</span>
            <div>
              <h3 style={styles.parentTitle}>PLANTA Y MANTENIMIENTO</h3>
              <p style={styles.parentSubtitle}>
                Pago de servicios públicos de la fábrica, mantenimientos de vehículos y compra de herramientas.
              </p>
            </div>
          </div>
          <span style={styles.toggleBadge}>
            {plantaAbierto ? '▼ Ocultar' : '▶ Desplegar'}
          </span>
        </div>

        {plantaAbierto && (
          <div>
            <div style={styles.cardsContainer}>
              <div
                style={{ ...styles.card, ...(subPlantaActivo === 8 ? styles.cardActive : {}) }}
                onClick={() => handleSelectSubPlanta(8)}
              >
                <div style={styles.cardHeader}>
                  <span style={styles.cardName}>Servicios Públicos</span>
                  <span style={styles.cardIcon}>⚡</span>
                </div>
                <p style={styles.cardDesc}>Pago de Luz (CFE) y Agua potable de la planta.</p>
              </div>

              <div
                style={{ ...styles.card, ...(subPlantaActivo === 9 ? styles.cardActive : {}) }}
                onClick={() => handleSelectSubPlanta(9)}
              >
                <div style={styles.cardHeader}>
                  <span style={styles.cardName}>Mantenimientos</span>
                  <span style={styles.cardIcon}>🔧</span>
                </div>
                <p style={styles.cardDesc}>Mantenimiento preventivo o correctivo de unidades y montacargas.</p>
              </div>

              <div
                style={{ ...styles.card, ...(subPlantaActivo === 10 ? styles.cardActive : {}) }}
                onClick={() => handleSelectSubPlanta(10)}
              >
                <div style={styles.cardHeader}>
                  <span style={styles.cardName}>Herramientas y Refacciones</span>
                  <span style={styles.cardIcon}>🛠️</span>
                </div>
                <p style={styles.cardDesc}>Compra de herramientas de trabajo y accesorios de planta.</p>
              </div>
            </div>

            {subPlantaActivo && (
              <div style={styles.formContainer}>
                <div style={styles.formTitle}>
                  <span>
                    Estás capturando:{' '}
                    {subPlantaActivo === 8 && '⚡ Servicios Públicos de Planta'}
                    {subPlantaActivo === 9 && '🔧 Mantenimiento de Equipos / Unidades'}
                    {subPlantaActivo === 10 && '🛠️ Herramientas y Refacciones'}
                  </span>
                  <button type="button" style={styles.closeBtn} onClick={() => setSubPlantaActivo(null)}>
                    ✕ Cerrar
                  </button>
                </div>

                <form onSubmit={(e) => e.preventDefault()} style={styles.grid}>
                  <div style={styles.fieldGroup}>
                    <label style={styles.label}>Fecha del Pago *</label>
                    <input
                      type="date"
                      style={styles.input}
                      value={fechaPago}
                      onChange={(e) => setFechaPago(e.target.value)}
                      required
                    />
                  </div>

                  <div style={styles.fieldGroup}>
                    <label style={styles.label}>Origen de pago *</label>
                    <select
                      style={styles.select}
                      value={origenPago}
                      onChange={(e) => {
                        setOrigenPago(e.target.value)
                        if (e.target.value !== 'TRANSFERENCIA') {
                          setCuentaBancaria('')
                          setNombreDuenioCuenta('')
                        }
                      }}
                    >
                      <option value="EFECTIVO">Efectivo</option>
                      <option value="TRANSFERENCIA">Transferencia</option>
                    </select>
                  </div>

                  {origenPago === 'TRANSFERENCIA' && (
                    <div style={styles.fieldGroup}>
                      <label style={styles.label}>Cuenta Bancaria de Salida *</label>
                      <select
                        style={styles.select}
                        value={cuentaBancaria}
                        onChange={(e) => {
                          setCuentaBancaria(e.target.value)
                          if (e.target.value !== 'OTRO') setNombreDuenioCuenta('')
                        }}
                        required
                      >
                        <option value="">-- Seleccionar Cuenta --</option>
                        <option value="Cuenta Fiscal">Cuenta fiscal</option>
                        <option value="OTRO">Otro</option>
                      </select>
                    </div>
                  )}

                  {origenPago === 'TRANSFERENCIA' && cuentaBancaria === 'OTRO' && (
                    <div style={styles.fieldGroup}>
                      <label style={styles.label}>Nombre y Apellido del dueño de la cuenta *</label>
                      <input
                        type="text"
                        placeholder="Ej. Eli Maravillas"
                        style={styles.input}
                        value={nombreDuenioCuenta}
                        onChange={(e) => setNombreDuenioCuenta(e.target.value)}
                        required
                      />
                    </div>
                  )}

                  {/* FORMULARIO SUB 8: SERVICIOS PÚBLICOS */}
                  {subPlantaActivo === 8 && (
                    <>
                      <div style={styles.fieldGroup}>
                        <label style={styles.label}>Tipo de Servicio *</label>
                        <select
                          style={styles.select}
                          value={tipoServicioPublico}
                          onChange={(e) => setTipoServicioPublico(e.target.value)}
                          required
                        >
                          <option value="">-- Seleccionar --</option>
                          <option value="LUZ (CFE)">Luz (CFE)</option>
                          <option value="AGUA POTABLE">Agua Potable</option>
                        </select>
                      </div>

                      <div style={{ ...styles.fullRow, ...styles.dynamicBlock }}>
                        <div style={styles.dynamicHeader}>
                          <span>Desglose de Conceptos de Servicio</span>
                          <button
                            type="button"
                            style={styles.addBtn}
                            onClick={() => handleAgregarObjeto(setLineasServicios, lineasServicios, { concepto: '', monto: '' })}
                          >
                            +
                          </button>
                        </div>
                        {lineasServicios.map((linea, idx) => (
                          <div key={idx} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr auto', gap: '8px', marginBottom: '6px' }}>
                            <input
                              type="text"
                              placeholder="Ej. Recibo Bimestral Planta 1"
                              style={styles.input}
                              value={linea.concepto}
                              onChange={(e) => handleCambioObjeto(setLineasServicios, lineasServicios, idx, 'concepto', e.target.value)}
                            />
                            <input
                              type="number"
                              step="any"
                              placeholder="Monto $"
                              style={styles.input}
                              value={linea.monto}
                              onChange={(e) => handleCambioObjeto(setLineasServicios, lineasServicios, idx, 'monto', e.target.value)}
                            />
                            {lineasServicios.length > 1 && (
                              <button
                                type="button"
                                style={styles.removeBtn}
                                onClick={() => handleEliminarObjeto(setLineasServicios, lineasServicios, idx)}
                              >
                                ✕
                              </button>
                            )}
                          </div>
                        ))}
                      </div>

                      <div style={{ ...styles.fullRow, ...styles.totalSummaryBox }}>
                        <div style={{ fontSize: '18px', fontWeight: 'bold', color: vino }}>
                          Total Servicio: ${totalServiciosPublicos.toFixed(2)}
                        </div>
                      </div>
                    </>
                  )}

                  {/* FORMULARIO SUB 9: MANTENIMIENTOS */}
                  {subPlantaActivo === 9 && (
                    <>
                      <div style={styles.fieldGroup}>
                        <label style={styles.label}>Tipo de Equipo *</label>
                        <select
                          style={styles.select}
                          value={tipoEquipo}
                          onChange={(e) => {
                            setTipoEquipo(e.target.value)
                            setEquipoSeleccionado('')
                          }}
                        >
                          <option value="Unidad">Unidad Vehicular</option>
                          <option value="Montacargas">Montacargas</option>
                        </select>
                      </div>

                      <div style={styles.fieldGroup}>
                        <label style={styles.label}>Seleccionar {tipoEquipo} *</label>
                        <select
                          style={styles.select}
                          value={equipoSeleccionado}
                          onChange={(e) => setEquipoSeleccionado(e.target.value)}
                          required
                        >
                          <option value="">-- Seleccionar --</option>
                          {tipoEquipo === 'Unidad'
                            ? unidades.map((u) => (
                                <option key={u.id_unidad} value={u.id_unidad}>
                                  {u.nombre || u.placas}
                                </option>
                              ))
                            : montacargas.map((m) => (
                                <option key={m.id_montacargas} value={m.id_montacargas}>
                                  {m.nombre || m.num_serie}
                                </option>
                              ))}
                        </select>
                      </div>

                      <div style={styles.fieldGroup}>
                        <label style={styles.label}>Tipo de Mantenimiento *</label>
                        <select
                          style={styles.select}
                          value={tipoServicioMantenimiento}
                          onChange={(e) => setTipoServicioMantenimiento(e.target.value)}
                          required
                        >
                          <option value="">-- Seleccionar --</option>
                          <option value="PREVENTIVO">Preventivo (Afinación, Aceite)</option>
                          <option value="CORRECTIVO">Correctivo (Reparación de falla)</option>
                        </select>
                      </div>

                      <div style={{ ...styles.fullRow, ...styles.dynamicBlock }}>
                        <div style={styles.dynamicHeader}>
                          <span>Desglose de Trabajos / Refacciones</span>
                          <button
                            type="button"
                            style={styles.addBtn}
                            onClick={() => handleAgregarObjeto(setLineasMantenimiento, lineasMantenimiento, { concepto: '', monto: '' })}
                          >
                            +
                          </button>
                        </div>
                        {lineasMantenimiento.map((linea, idx) => (
                          <div key={idx} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr auto', gap: '8px', marginBottom: '6px' }}>
                            <input
                              type="text"
                              placeholder="Ej. Cambio de balatas / filtro"
                              style={styles.input}
                              value={linea.concepto}
                              onChange={(e) => handleCambioObjeto(setLineasMantenimiento, lineasMantenimiento, idx, 'concepto', e.target.value)}
                            />
                            <input
                              type="number"
                              step="any"
                              placeholder="Monto $"
                              style={styles.input}
                              value={linea.monto}
                              onChange={(e) => handleCambioObjeto(setLineasMantenimiento, lineasMantenimiento, idx, 'monto', e.target.value)}
                            />
                            {lineasMantenimiento.length > 1 && (
                              <button
                                type="button"
                                style={styles.removeBtn}
                                onClick={() => handleEliminarObjeto(setLineasMantenimiento, lineasMantenimiento, idx)}
                              >
                                ✕
                              </button>
                            )}
                          </div>
                        ))}
                      </div>

                      <div style={{ ...styles.fullRow, ...styles.totalSummaryBox }}>
                        <div style={{ fontSize: '18px', fontWeight: 'bold', color: vino }}>
                          Total Mantenimiento: ${totalMantenimiento.toFixed(2)}
                        </div>
                      </div>
                    </>
                  )}

                  {/* FORMULARIO SUB 10: HERRAMIENTAS */}
                  {subPlantaActivo === 10 && (
                    <>
                      <div style={{ ...styles.fullRow, ...styles.dynamicBlock }}>
                        <div style={styles.dynamicHeader}>
                          <span>Lista de Herramientas Adquiridas</span>
                          <button
                            type="button"
                            style={styles.addBtn}
                            onClick={() => handleAgregarObjeto(setLineasHerramientas, lineasHerramientas, { cantidad: '1', concepto: '', precio: '' })}
                          >
                            +
                          </button>
                        </div>
                        {lineasHerramientas.map((linea, idx) => (
                          <div key={idx} style={{ display: 'grid', gridTemplateColumns: '80px 2fr 1fr auto', gap: '8px', marginBottom: '6px' }}>
                            <input
                              type="number"
                              placeholder="Cant."
                              style={styles.input}
                              value={linea.cantidad}
                              onChange={(e) => handleCambioObjeto(setLineasHerramientas, lineasHerramientas, idx, 'cantidad', e.target.value)}
                            />
                            <input
                              type="text"
                              placeholder="Ej. Pala cuadrada, marro, flexómetro"
                              style={styles.input}
                              value={linea.concepto}
                              onChange={(e) => handleCambioObjeto(setLineasHerramientas, lineasHerramientas, idx, 'concepto', e.target.value)}
                            />
                            <input
                              type="number"
                              step="any"
                              placeholder="Precio Unit $"
                              style={styles.input}
                              value={linea.precio}
                              onChange={(e) => handleCambioObjeto(setLineasHerramientas, lineasHerramientas, idx, 'precio', e.target.value)}
                            />
                            {lineasHerramientas.length > 1 && (
                              <button
                                type="button"
                                style={styles.removeBtn}
                                onClick={() => handleEliminarObjeto(setLineasHerramientas, lineasHerramientas, idx)}
                              >
                                ✕
                              </button>
                            )}
                          </div>
                        ))}
                      </div>

                      <div style={{ ...styles.fullRow, ...styles.totalSummaryBox }}>
                        <div style={{ fontSize: '18px', fontWeight: 'bold', color: vino }}>
                          Total Herramientas: ${totalHerramientas.toFixed(2)}
                        </div>
                      </div>
                    </>
                  )}

                  <div style={styles.fullRow}>
                    <button type="button" onClick={handleGuardarPlanta} style={styles.submitButton}>
                      Guardar Gasto de Planta
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 📊 TARJETA PRINCIPAL 4: GASTOS DEPARTAMENTALES */}
      <div style={styles.parentCard}>
        <div
          style={styles.parentHeader}
          onClick={() => setDeptosAbierto(!deptosAbierto)}
        >
          <div style={styles.parentTitleGroup}>
            <span style={{ fontSize: '28px' }}>📊</span>
            <div>
              <h3 style={styles.parentTitle}>GASTOS DEPARTAMENTALES</h3>
              <p style={styles.parentSubtitle}>
                Gastos de Marketing, Caja Chica y Servicios Profesionales / Honorarios externos.
              </p>
            </div>
          </div>
          <span style={styles.toggleBadge}>
            {deptosAbierto ? '▼ Ocultar' : '▶ Desplegar'}
          </span>
        </div>

        {deptosAbierto && (
          <div>
            <div style={styles.cardsContainer}>
              <div
                style={{ ...styles.card, ...(subDeptoActivo === 12 ? styles.cardActive : {}) }}
                onClick={() => handleSelectSubDepto(12)}
              >
                <div style={styles.cardHeader}>
                  <span style={styles.cardName}>Marketing</span>
                  <span style={styles.cardIcon}>📢</span>
                </div>
                <p style={styles.cardDesc}>Publicidad en redes, eventos, lonas y material promocional.</p>
              </div>

              <div
                style={{ ...styles.card, ...(subDeptoActivo === 13 ? styles.cardActive : {}) }}
                onClick={() => handleSelectSubDepto(13)}
              >
                <div style={styles.cardHeader}>
                  <span style={styles.cardName}>Caja Chica</span>
                  <span style={styles.cardIcon}>📦</span>
                </div>
                <p style={styles.cardDesc}>Gastos menores imprevistos de oficina o insumos de limpieza.</p>
              </div>

              <div
                style={{ ...styles.card, ...(subDeptoActivo === 14 ? styles.cardActive : {}) }}
                onClick={() => handleSelectSubDepto(14)}
              >
                <div style={styles.cardHeader}>
                  <span style={styles.cardName}>Servicios Profesionales</span>
                  <span style={styles.cardIcon}>💼</span>
                </div>
                <p style={styles.cardDesc}>Honorarios externos (Asesoría Contable por Alma Nely).</p>
              </div>
            </div>

            {subDeptoActivo && (
              <div style={styles.formContainer}>
                <div style={styles.formTitle}>
                  <span>
                    Estás capturando:{' '}
                    {subDeptoActivo === 12 && '📢 Gastos de Marketing'}
                    {subDeptoActivo === 13 && '📦 Gastos de Caja Chica'}
                    {subDeptoActivo === 14 && '💼 Servicios Profesionales'}
                  </span>
                  <button type="button" style={styles.closeBtn} onClick={() => setSubDeptoActivo(null)}>
                    ✕ Cerrar
                  </button>
                </div>

                <form onSubmit={(e) => e.preventDefault()} style={styles.grid}>
                  <div style={styles.fieldGroup}>
                    <label style={styles.label}>Origen de pago *</label>
                    <select
                      style={styles.select}
                      value={origenPago}
                      onChange={(e) => {
                        setOrigenPago(e.target.value)
                        if (e.target.value !== 'TRANSFERENCIA') {
                          setCuentaBancaria('')
                          setNombreDuenioCuenta('')
                        }
                      }}
                    >
                      <option value="EFECTIVO">Efectivo</option>
                      <option value="TRANSFERENCIA">Transferencia</option>
                    </select>
                  </div>

                  {origenPago === 'TRANSFERENCIA' && (
                    <div style={styles.fieldGroup}>
                      <label style={styles.label}>Cuenta Bancaria de Salida *</label>
                      <select
                        style={styles.select}
                        value={cuentaBancaria}
                        onChange={(e) => {
                          setCuentaBancaria(e.target.value)
                          if (e.target.value !== 'OTRO') setNombreDuenioCuenta('')
                        }}
                        required
                      >
                        <option value="">-- Seleccionar Cuenta --</option>
                        <option value="Cuenta Fiscal">Cuenta fiscal</option>
                        <option value="OTRO">Otro</option>
                      </select>
                    </div>
                  )}

                  {origenPago === 'TRANSFERENCIA' && cuentaBancaria === 'OTRO' && (
                    <div style={styles.fieldGroup}>
                      <label style={styles.label}>Nombre y Apellido del dueño de la cuenta *</label>
                      <input
                        type="text"
                        placeholder="Ej. Eli Maravillas"
                        style={styles.input}
                        value={nombreDuenioCuenta}
                        onChange={(e) => setNombreDuenioCuenta(e.target.value)}
                        required
                      />
                    </div>
                  )}

                  {/* FORMULARIO SUB 12: MARKETING */}
                  {subDeptoActivo === 12 && (
                    <>
                      <div style={styles.fieldGroup}>
                        <label style={styles.label}>Fecha del Evento / Campaña *</label>
                        <input
                          type="date"
                          style={styles.input}
                          value={fechaPagoDepto}
                          onChange={(e) => setFechaPagoDepto(e.target.value)}
                          required
                        />
                      </div>

                      <div style={{ ...styles.fullRow, ...styles.dynamicBlock }}>
                        <div style={styles.dynamicHeader}>
                          <span>Desglose de Gastos de Publicidad</span>
                          <button
                            type="button"
                            style={styles.addBtn}
                            onClick={() => handleAgregarObjeto(setLineasMarketing, lineasMarketing, { tipoGasto: '', monto: '', comentario: '' })}
                          >
                            +
                          </button>
                        </div>
                        {lineasMarketing.map((item, idx) => (
                          <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 2fr auto', gap: '8px', marginBottom: '6px' }}>
                            <select
                              style={styles.select}
                              value={item.tipoGasto}
                              onChange={(e) => handleCambioObjeto(setLineasMarketing, lineasMarketing, idx, 'tipoGasto', e.target.value)}
                            >
                              <option value="">-- Concepto --</option>
                              <option value="Facebook Ads">Facebook / Meta Ads</option>
                              <option value="Lonas / Impresos">Lonas / Impresos</option>
                              <option value="Uniformes / Merch">Uniformes / Merch</option>
                              <option value="Evento / Exposición">Evento / Exposición</option>
                            </select>
                            <input
                              type="number"
                              step="any"
                              placeholder="Monto $"
                              style={styles.input}
                              value={item.monto}
                              onChange={(e) => handleCambioObjeto(setLineasMarketing, lineasMarketing, idx, 'monto', e.target.value)}
                            />
                            <input
                              type="text"
                              placeholder="Notas opcionales"
                              style={styles.input}
                              value={item.comentario}
                              onChange={(e) => handleCambioObjeto(setLineasMarketing, lineasMarketing, idx, 'comentario', e.target.value)}
                            />
                            {lineasMarketing.length > 1 && (
                              <button
                                type="button"
                                style={styles.removeBtn}
                                onClick={() => handleEliminarObjeto(setLineasMarketing, lineasMarketing, idx)}
                              >
                                ✕
                              </button>
                            )}
                          </div>
                        ))}
                      </div>

                      <div style={{ ...styles.fullRow, ...styles.totalSummaryBox }}>
                        <div style={{ fontSize: '18px', fontWeight: 'bold', color: vino }}>
                          Total Marketing: ${totalMarketing.toFixed(2)}
                        </div>
                      </div>
                    </>
                  )}

                  {/* FORMULARIO SUB 13: CAJA CHICA */}
                  {subDeptoActivo === 13 && (
                    <>
                      <div style={styles.fieldGroup}>
                        <label style={styles.label}>Cantidad Adquirida (Opcional)</label>
                        <input
                          type="text"
                          placeholder="Ej. 2 paquetes, 5 pzs"
                          style={styles.input}
                          value={cantidadCajaChica}
                          onChange={(e) => setCantidadCajaChica(e.target.value)}
                        />
                      </div>

                      <div style={styles.fieldGroup}>
                        <label style={styles.label}>Monto Total ($) *</label>
                        <input
                          type="number"
                          step="any"
                          min="0.01"
                          placeholder="0.00"
                          style={styles.input}
                          value={montoCajaChica}
                          onChange={(e) => setMontoCajaChica(e.target.value)}
                          required
                        />
                      </div>

                      <div style={{ ...styles.fieldGroup, ...styles.fullRow }}>
                        <label style={styles.label}>Detalle del Gasto de Caja Chica *</label>
                        <textarea
                          rows="2"
                          placeholder="Ej. Compra de hojas de papel, garrafones de agua, artículos de limpieza..."
                          style={{ ...styles.input, resize: 'vertical' }}
                          value={detalleCajaChica}
                          onChange={(e) => setDetalleCajaChica(e.target.value)}
                          required
                        />
                      </div>
                    </>
                  )}

                  {/* FORMULARIO SUB 14: SERVICIOS PROFESIONALES */}
                  {subDeptoActivo === 14 && (
                    <>
                      <div style={styles.fieldGroup}>
                        <label style={styles.label}>Fecha de Pago *</label>
                        <input
                          type="date"
                          style={styles.input}
                          value={fechaPagoDepto}
                          onChange={(e) => setFechaPagoDepto(e.target.value)}
                          required
                        />
                      </div>

                      <div style={styles.fieldGroup}>
                        <label style={styles.label}>Profesional / Proveedor *</label>
                        <select
                          style={styles.select}
                          value={empleadoServicios}
                          onChange={(e) => setEmpleadoServicios(e.target.value)}
                          required
                        >
                          {empleados.map((e) => (
                            <option key={e.id_empleado} value={e.id_empleado}>
                              {e.nombre_completo || `${e.nombre} ${e.apellido1}`}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div style={styles.fieldGroup}>
                        <label style={styles.label}>Monto de Honorarios ($) *</label>
                        <input
                          type="number"
                          step="any"
                          min="0.01"
                          placeholder="0.00"
                          style={styles.input}
                          value={montoServicios}
                          onChange={(e) => setMontoServicios(e.target.value)}
                          required
                        />
                      </div>
                    </>
                  )}

                  <div style={styles.fullRow}>
                    <button type="button" onClick={handleGuardarDeptos} style={styles.submitButton}>
                      Guardar Gasto Departamental
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default FlujoCaja
