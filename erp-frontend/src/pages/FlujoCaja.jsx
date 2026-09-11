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

  // ESTADO - RESUMEN DE CAJA Y MOVIMIENTOS
  const [saldos, setSaldos] = useState({ efectivo: 0, banco: 0, total_ingresos: 0, total_egresos: 0, saldo_tekc: 0 })
  const [movimientos, setMovimientos] = useState([])
  const [cargandoResumen, setCargandoResumen] = useState(true)

  // ESTADO - FILTRO TIPO DE PEDIDO ('TODOS', 'NORMAL', 'REZAGADO')
  const [filtroPedido, setFiltroPedido] = useState('TODOS')

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

  // FILTRADO DINÁMICO DE MOVIMIENTOS POR TIPO DE PEDIDO
  const movimientosFiltrados = movimientos.filter((m) => {
    if (filtroPedido === 'TODOS') return true

    const tipoUpper = m.tipo?.toUpperCase() || ''
    const esIngreso = tipoUpper === 'INGRESO'
    const esRezagado =
      m.es_rezagado === true ||
      m.tipo_pedido === 'REZAGADO' ||
      m.es_pedido_rezagado ||
      (m.concepto && m.concepto.toLowerCase().includes('rezagado'))

    if (filtroPedido === 'REZAGADO') {
      return esIngreso && esRezagado
    }

    if (filtroPedido === 'NORMAL') {
      return esIngreso && !esRezagado
    }

    return true
  })

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

      {/* TABLA DE HISTORIAL DE MOVIMIENTOS DE CAJA */}
      <div style={styles.movimientosCard}>
        <h3 style={{ color: vino, marginTop: 0, marginBottom: '10px' }}>
          📜 Historial de Movimientos de Caja
        </h3>
        {cargandoResumen ? (
          <p style={{ color: '#64748b' }}>Cargando movimientos...</p>
        ) : movimientos.length === 0 ? (
          <p style={{ color: '#64748b' }}>No hay movimientos registrados en la caja actual.</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Tipo</th>
                <th style={styles.th}>Tienda / Cliente</th>
                <th style={styles.th}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span>Origen / Tipo Pedido</span>
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
                      <option value="NORMAL">🛒 Pedidos Normales</option>
                      <option value="REZAGADO">📦 Pedidos Rezagados</option>
                    </select>
                  </div>
                </th>
                <th style={styles.th}>Forma de Pago</th>
                <th style={styles.th}>Monto</th>
                <th style={styles.th}>Fecha y Hora</th>
              </tr>
            </thead>
            <tbody>
              {movimientosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ ...styles.td, textAlign: 'center', color: '#64748b' }}>
                    No se encontraron movimientos para el filtro seleccionado.
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
                            {m.concepto}
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
                        {m.fecha ? new Date(m.fecha).toLocaleString('es-MX') : 'N/A'}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
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
                        3. Seleccionar trabajador ({puestoTab}) *
                      </label>
                      <div style={styles.empleadosGrid}>
                        {empleadosFiltrados.length === 0 ? (
                          <p style={{ color: '#64748b', fontSize: '13.5px', gridColumn: '1 / -1' }}>
                            No hay empleados registrados en este puesto.
                          </p>
                        ) : (
                          empleadosFiltrados.map((emp) => {
                            const pagado = empleadosPagados.includes(emp.id_empleado)
                            const estaSeleccionado = String(empleadoSeleccionado) === String(emp.id_empleado)

                            return (
                              <div
                                key={emp.id_empleado}
                                style={{
                                  ...styles.empleadoCard,
                                  ...(estaSeleccionado ? styles.empleadoCardSelected : {})
                                }}
                                onClick={() => setEmpleadoSeleccionado(emp.id_empleado)}
                              >
                                <span style={{ fontWeight: 'bold', fontSize: '13.5px' }}>
                                  {emp.nombre_completo || `${emp.nombre || ''} ${emp.apellido1 || ''}`}
                                </span>
                                <span
                                  style={{
                                    ...styles.statusBadge,
                                    ...(pagado ? styles.badgePagado : styles.badgePendiente)
                                  }}
                                >
                                  {pagado ? '🟢 Pagado' : '🔴 Pendiente'}
                                </span>
                              </div>
                            )
                          })
                        )}
                      </div>
                    </div>
                  )}

                  {subPersonalActivo === 5 && (
                    <>
                      <div style={styles.fieldGroup}>
                        <label style={styles.label}>Tipo de gasto*</label>
                        <select
                          style={styles.select}
                          value={subTipoImpuesto}
                          onChange={(e) => setSubTipoImpuesto(e.target.value)}
                        >
                          <option value="IMSS">IMSS</option>
                          <option value="ISR">ISR</option>
                        </select>
                      </div>

                      <div style={styles.fieldGroup}>
                        <label style={styles.label}>Empleado beneficiado*</label>
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
                    </>
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
                        <label style={styles.label}>
                          Ruta {esChofer ? <span style={{ color: '#dc2626' }}>* (Obligatorio Chofer)</span> : '(Opcional)'}
                        </label>
                        <select
                          style={styles.select}
                          value={idRutaSeleccionada}
                          onChange={(e) => setIdRutaSeleccionada(e.target.value)}
                        >
                          <option value="">-- Seleccionar Ruta --</option>
                          {rutas.map((r) => (
                            <option key={r.id_ruta} value={r.id_ruta}>
                              {r.nombre}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div style={{ ...styles.fieldGroup, ...styles.fullRow }}>
                        <label style={styles.label}>
                          Unidad relacionada {esChofer ? <span style={{ color: '#dc2626' }}>* (Obligatorio Chofer)</span> : '(Opcional)'}
                        </label>
                        <select
                          style={styles.select}
                          value={idUnidadSeleccionada}
                          onChange={(e) => setIdUnidadSeleccionada(e.target.value)}
                        >
                          <option value="">-- Seleccionar Unidad --</option>
                          {unidades.map((u) => (
                            <option key={u.id_unidad} value={u.id_unidad}>
                              {u.nombre || u.placas} {u.placas ? `(${u.placas})` : ''}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div style={{ ...styles.fullRow, ...styles.dynamicBlock }}>
                        <div style={styles.dynamicHeader}>
                          <span>🚗 Casetas — Total: ${totalCasetas.toFixed(2)}</span>
                          <button type="button" style={styles.addBtn} onClick={() => handleAgregarCampo(setCasetas, casetas)}>+</button>
                        </div>
                        {casetas.map((val, idx) => (
                          <div key={idx} style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
                            <input
                              type="number"
                              step="any"
                              placeholder="Monto caseta"
                              style={styles.input}
                              value={val}
                              onChange={(e) => handleCambioCampo(setCasetas, casetas, idx, e.target.value)}
                            />
                            {casetas.length > 1 && (
                              <button type="button" style={styles.removeBtn} onClick={() => handleEliminarCampo(setCasetas, casetas, idx)}>✕</button>
                            )}
                          </div>
                        ))}
                      </div>

                      <div style={{ ...styles.fullRow, ...styles.dynamicBlock }}>
                        <div style={styles.dynamicHeader}>
                          <span>⛽ Gasolina / Diesel — Total: ${totalGasolina.toFixed(2)}</span>
                          <button type="button" style={styles.addBtn} onClick={() => handleAgregarCampo(setGasolina, gasolina)}>+</button>
                        </div>
                        {gasolina.map((val, idx) => (
                          <div key={idx} style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
                            <input
                              type="number"
                              step="any"
                              placeholder="Monto gasolina"
                              style={styles.input}
                              value={val}
                              onChange={(e) => handleCambioCampo(setGasolina, gasolina, idx, e.target.value)}
                            />
                            {gasolina.length > 1 && (
                              <button type="button" style={styles.removeBtn} onClick={() => handleEliminarCampo(setGasolina, gasolina, idx)}>✕</button>
                            )}
                          </div>
                        ))}
                      </div>

                      <div style={{ ...styles.fullRow, ...styles.dynamicBlock }}>
                        <div style={styles.dynamicHeader}>
                          <span>🍽️ Comidas — Total: ${totalComidas.toFixed(2)}</span>
                          <button type="button" style={styles.addBtn} onClick={() => handleAgregarCampo(setComidas, comidas)}>+</button>
                        </div>
                        {comidas.map((val, idx) => (
                          <div key={idx} style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
                            <input
                              type="number"
                              step="any"
                              placeholder="Monto comida"
                              style={styles.input}
                              value={val}
                              onChange={(e) => handleCambioCampo(setComidas, comidas, idx, e.target.value)}
                            />
                            {comidas.length > 1 && (
                              <button type="button" style={styles.removeBtn} onClick={() => handleEliminarCampo(setComidas, comidas, idx)}>✕</button>
                            )}
                          </div>
                        ))}
                      </div>

                      <div style={{ ...styles.fullRow, ...styles.dynamicBlock }}>
                        <div style={styles.dynamicHeader}>
                          <span>
                            📄 Folios / Comprobantes{' '}
                            {esChofer && <span style={{ color: '#dc2626', fontSize: '12px' }}>* (Obligatorio Chofer)</span>}
                          </span>
                          <button type="button" style={styles.addBtn} onClick={() => handleAgregarCampo(setFolios, folios)}>+</button>
                        </div>
                        {folios.map((val, idx) => (
                          <div key={idx} style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
                            <input
                              type="text"
                              placeholder="Número de folio"
                              style={styles.input}
                              value={val}
                              onChange={(e) => handleCambioCampo(setFolios, folios, idx, e.target.value)}
                            />
                            {folios.length > 1 && (
                              <button type="button" style={styles.removeBtn} onClick={() => handleEliminarCampo(setFolios, folios, idx)}>✕</button>
                            )}
                          </div>
                        ))}
                      </div>

                      <div style={{ ...styles.fullRow, ...styles.totalSummaryBox }}>
                        <span style={{ fontSize: '20px', fontWeight: '900', color: vino }}>
                          MONTO TOTAL VIÁTICOS: ${totalViaticosGeneral.toFixed(2)}
                        </span>
                      </div>
                    </>
                  )}

                  {subPersonalActivo !== 88 && (
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
                          <label style={styles.label}>Cuenta de banco *</label>
                          <select
                            style={styles.select}
                            value={cuentaBancaria}
                            onChange={(e) => {
                              setCuentaBancaria(e.target.value)
                              if (e.target.value !== 'OTRO') setNombreDuenioCuenta('')
                            }}
                            required
                          >
                            <option value="">-- Seleccionar cuenta --</option>
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

                      {subPersonalActivo !== 7 && (
                        <div style={styles.fieldGroup}>
                          <label style={styles.label}>Monto ($) *</label>
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
                      )}

                      <div style={{ ...styles.fieldGroup, ...styles.fullRow }}>
                        <label style={styles.label}>Observaciones / Destino / Motivo</label>
                        <textarea
                          rows="2"
                          placeholder="Escribe detalles adicionales sobre este egreso..."
                          style={{ ...styles.input, resize: 'vertical' }}
                          value={concepto}
                          onChange={(e) => setConcepto(e.target.value)}
                        />
                      </div>

                      <div style={styles.fullRow}>
                        <button type="button" onClick={handleGuardarPersonal} style={styles.submitButton}>
                          {subPersonalActivo === 7 ? 'Guardar Viáticos' : 'Guardar gasto'}
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

      {/* 🏛️ TARJETA PRINCIPAL 3: GASTOS DE PLANTA Y MANTENIMIENTO */}
      <div style={styles.parentCard}>
        <div style={styles.parentHeader} onClick={() => setPlantaAbierto(!plantaAbierto)}>
          <div style={styles.parentTitleGroup}>
            <span style={{ fontSize: '28px' }}>🏛️</span>
            <div>
              <h3 style={styles.parentTitle}>GASTOS DE PLANTA Y MANTENIMIENTO</h3>
              <p style={styles.parentSubtitle}>
                Servicios públicos, mantenimiento de vehículos/montacargas y herramientas.
              </p>
            </div>
          </div>
          <span style={styles.toggleBadge}>{plantaAbierto ? '▼ Ocultar' : '▶ Desplegar'}</span>
        </div>

        {plantaAbierto && (
          <div>
            <div style={styles.cardsContainer}>
              <div
                style={{ ...styles.card, ...(subPlantaActivo === 8 ? styles.cardActive : {}) }}
                onClick={() => handleSelectSubPlanta(8)}
              >
                <div style={styles.cardHeader}>
                  <span style={styles.cardName}>Servicios públicos</span>
                  <span style={styles.cardIcon}>⚡</span>
                </div>
                <p style={styles.cardDesc}>Pago de luz (CFE), Agua, Gas e Internet/Telefonía.</p>
              </div>

              <div
                style={{ ...styles.card, ...(subPlantaActivo === 9 ? styles.cardActive : {}) }}
                onClick={() => handleSelectSubPlanta(9)}
              >
                <div style={styles.cardHeader}>
                  <span style={styles.cardName}>Servicios vehiculares</span>
                  <span style={styles.cardIcon}>🛠️</span>
                </div>
                <p style={styles.cardDesc}>Mantenimiento y reparaciones de vehículos y montacargas.</p>
              </div>

              <div
                style={{ ...styles.card, ...(subPlantaActivo === 10 ? styles.cardActive : {}) }}
                onClick={() => handleSelectSubPlanta(10)}
              >
                <div style={styles.cardHeader}>
                  <span style={styles.cardName}>Compra de herramientas</span>
                  <span style={styles.cardIcon}>🧰</span>
                </div>
                <p style={styles.cardDesc}>Compra de herramientas generales desde el pastero hasta Liz etc.</p>
              </div>
            </div>

            {subPlantaActivo && (
              <div style={styles.formContainer}>
                <div style={styles.formTitle}>
                  <span>
                    Estás capturando:{' '}
                    {subPlantaActivo === 8 && '⚡ Servicios Públicos'}
                    {subPlantaActivo === 9 && '🛠️ Operaciones y Mantenimiento'}
                    {subPlantaActivo === 10 && '🧰 Compra de Herramientas y Consumibles'}
                  </span>
                  <button type="button" style={styles.closeBtn} onClick={() => setSubPlantaActivo(null)}>
                    ✕ Cerrar
                  </button>
                </div>

                <form onSubmit={(e) => e.preventDefault()} style={styles.grid}>
                  <div style={{ ...styles.fieldGroup, ...styles.fullRow }}>
                    <label style={styles.label}>Fecha de pago (Seleccionable) *</label>
                    <input
                      type="date"
                      style={styles.input}
                      value={fechaPago}
                      onChange={(e) => setFechaPago(e.target.value)}
                      required
                    />
                  </div>

                  {subPlantaActivo === 8 && (
                    <>
                      <div style={{ ...styles.fieldGroup, ...styles.fullRow }}>
                        <label style={styles.label}>Tipo de Servicio *</label>
                        <select
                          style={styles.select}
                          value={tipoServicioPublico}
                          onChange={(e) => setTipoServicioPublico(e.target.value)}
                          required
                        >
                          <option value="">-- Seleccionar Servicio --</option>
                          <option value="Luz">⚡ Luz / Energía Eléctrica (CFE)</option>
                          <option value="Agua">💧 Agua </option>
                          <option value="Gas">⛽ Gas </option>
                          <option value="Internet">📶 Internet / Telefonía</option>
                        </select>
                      </div>

                      <div style={{ ...styles.fullRow, ...styles.dynamicBlock }}>
                        <div style={styles.dynamicHeader}>
                          <span>Escribe que compraste..</span>
                          <button
                            type="button"
                            style={styles.addBtn}
                            onClick={() => handleAgregarObjeto(setLineasServicios, lineasServicios, { concepto: '', monto: '' })}
                          >
                            +
                          </button>
                        </div>
                        {lineasServicios.map((item, idx) => (
                          <div key={idx} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                            <input
                              type="text"
                              placeholder="Comentarios..."
                              style={{ ...styles.input, flex: 2 }}
                              value={item.concepto}
                              onChange={(e) => handleCambioObjeto(setLineasServicios, lineasServicios, idx, 'concepto', e.target.value)}
                            />
                            <input
                              type="number"
                              step="any"
                              placeholder="Monto ($)"
                              style={{ ...styles.input, flex: 1 }}
                              value={item.monto}
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
                        <span style={{ fontSize: '18px', fontWeight: 'bold', color: vino }}>
                          TOTAL SERVICIOS: ${totalServiciosPublicos.toFixed(2)}
                        </span>
                      </div>
                    </>
                  )}

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
                          <option value="Unidad">Unidades / Vehículos</option>
                          <option value="Montacargas">Montacargas</option>
                        </select>
                      </div>

                      <div style={styles.fieldGroup}>
                        <label style={styles.label}>
                          {tipoEquipo === 'Unidad' ? 'Seleccionar Unidad *' : 'Seleccionar Montacargas *'}
                        </label>
                        <select
                          style={styles.select}
                          value={equipoSeleccionado}
                          onChange={(e) => setEquipoSeleccionado(e.target.value)}
                          required
                        >
                          <option value="">-- Seleccionar del catálogo --</option>
                          {tipoEquipo === 'Unidad'
                            ? unidades.map((u) => (
                                <option key={u.id_unidad} value={u.id_unidad}>
                                  {u.nombre || u.placas} {u.placas ? `(${u.placas})` : ''}
                                </option>
                              ))
                            : montacargas.map((m) => (
                                <option key={m.id_montacargas} value={m.id_montacargas}>
                                  {m.nombre || m.num_serie || `Montacargas #${m.id_montacargas}`}
                                </option>
                              ))}
                        </select>
                      </div>

                      <div style={{ ...styles.fieldGroup, ...styles.fullRow }}>
                        <label style={styles.label}>Tipo de Servicio *</label>
                        <select
                          style={styles.select}
                          value={tipoServicioMantenimiento}
                          onChange={(e) => setTipoServicioMantenimiento(e.target.value)}
                          required
                        >
                          <option value="">-- Seleccionar tipo de servicio --</option>
                          <option value="Servicio mecánico / Taller">Servicio mecánico / Taller</option>
                          <option value="Refacciones (balatas, filtros, aceites, etc.)">Refacciones (balatas, filtros, aceites, etc.)</option>
                          <option value="Llantas">Llantas</option>
                          <option value="Afinación">Afinación</option>
                          <option value="Hojalatería y pintura">Hojalatería y pintura</option>
                          <option value="Tenencias y verificaciones">Tenencias y verificaciones</option>
                          <option value="Otro">Otro</option>
                        </select>
                      </div>

                      <div style={{ ...styles.fullRow, ...styles.dynamicBlock }}>
                        <div style={styles.dynamicHeader}>
                          <span>
                            Detalle de la reparación / mantenimiento {tipoServicioMantenimiento === 'Otro' && '*'}
                          </span>
                          <button
                            type="button"
                            style={styles.addBtn}
                            onClick={() => handleAgregarObjeto(setLineasMantenimiento, lineasMantenimiento, { concepto: '', monto: '' })}
                          >
                            +
                          </button>
                        </div>
                        {lineasMantenimiento.map((item, idx) => (
                          <div key={idx} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                            <input
                              type="text"
                              placeholder="Ej. Cambio de llantas debido a que se poncho"
                              style={{ ...styles.input, flex: 2 }}
                              value={item.concepto}
                              onChange={(e) => handleCambioObjeto(setLineasMantenimiento, lineasMantenimiento, idx, 'concepto', e.target.value)}
                              required={tipoServicioMantenimiento === 'Otro'}
                            />
                            <input
                              type="number"
                              step="any"
                              placeholder="Monto ($)"
                              style={{ ...styles.input, flex: 1 }}
                              value={item.monto}
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
                        <span style={{ fontSize: '18px', fontWeight: 'bold', color: vino }}>
                          TOTAL MANTENIMIENTO: ${totalMantenimiento.toFixed(2)}
                        </span>
                      </div>
                    </>
                  )}

                  {subPlantaActivo === 10 && (
                    <>
                      <div style={{ ...styles.fullRow, ...styles.dynamicBlock }}>
                        <div style={styles.dynamicHeader}>
                          <span>¿Qué compraste? *</span>
                          <button
                            type="button"
                            style={styles.addBtn}
                            onClick={() => handleAgregarObjeto(setLineasHerramientas, lineasHerramientas, { cantidad: '1', concepto: '', precio: '' })}
                          >
                            +
                          </button>
                        </div>
                        {lineasHerramientas.map((item, idx) => (
                          <div key={idx} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                            <input
                              type="number"
                              min="1"
                              placeholder="Cant"
                              style={{ ...styles.input, flex: '0.5' }}
                              value={item.cantidad}
                              onChange={(e) => handleCambioObjeto(setLineasHerramientas, lineasHerramientas, idx, 'cantidad', e.target.value)}
                            />
                            <input
                              type="text"
                              placeholder="Ej. Pastero, Brocas, Llaves..."
                              style={{ ...styles.input, flex: 2 }}
                              value={item.concepto}
                              onChange={(e) => handleCambioObjeto(setLineasHerramientas, lineasHerramientas, idx, 'concepto', e.target.value)}
                              required
                            />
                            <input
                              type="number"
                              step="any"
                              placeholder="Precio ($)"
                              style={{ ...styles.input, flex: 1 }}
                              value={item.precio}
                              onChange={(e) => handleCambioObjeto(setLineasHerramientas, lineasHerramientas, idx, 'precio', e.target.value)}
                              required
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
                        <span style={{ fontSize: '18px', fontWeight: 'bold', color: vino }}>
                          TOTAL HERRAMIENTAS: ${totalHerramientas.toFixed(2)}
                        </span>
                      </div>
                    </>
                  )}

                  <div style={styles.fieldGroup}>
                    <label style={styles.label}>Origen de Pago *</label>
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
                    <div style={{ ...styles.fieldGroup, ...styles.fullRow }}>
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

                  <div style={styles.fullRow}>
                    <button type="button" onClick={handleGuardarPlanta} style={styles.submitButton}>
                      Guardar registro de planta
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 🏢 TARJETA PRINCIPAL 4: GASTOS DEPARTAMENTALES */}
      <div style={styles.parentCard}>
        <div style={styles.parentHeader} onClick={() => setDeptosAbierto(!deptosAbierto)}>
          <div style={styles.parentTitleGroup}>
            <span style={{ fontSize: '28px' }}>🏢</span>
            <div>
              <h3 style={styles.parentTitle}>GASTOS DEPARTAMENTALES</h3>
              <p style={styles.parentSubtitle}>
                Gastos asociados a Marketing, Caja Chica y Servicios Profesionales.
              </p>
            </div>
          </div>
          <span style={styles.toggleBadge}>{deptosAbierto ? '▼ Ocultar' : '▶ Desplegar'}</span>
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
                <p style={styles.cardDesc}>Eventos, capacitaciones, ferias, souvenirs, perifoneo, lonas.</p>
              </div>

              <div
                style={{ ...styles.card, ...(subDeptoActivo === 13 ? styles.cardActive : {}) }}
                onClick={() => handleSelectSubDepto(13)}
              >
                <div style={styles.cardHeader}>
                  <span style={styles.cardName}>Caja Chica</span>
                  <span style={styles.cardIcon}>🪙</span>
                </div>
                <p style={styles.cardDesc}>Papelería, consumibles de oficina, insumos de limpieza y imprevistos.</p>
              </div>

              <div
                style={{ ...styles.card, ...(subDeptoActivo === 14 ? styles.cardActive : {}) }}
                onClick={() => handleSelectSubDepto(14)}
              >
                <div style={styles.cardHeader}>
                  <span style={styles.cardName}>Servicios Profesionales</span>
                  <span style={styles.cardIcon}>📋</span>
                </div>
                <p style={styles.cardDesc}>Honorarios de Contaduría / Contadora Alma Nely Hernández Minor.</p>
              </div>
            </div>

            {subDeptoActivo && (
              <div style={styles.formContainer}>
                <div style={styles.formTitle}>
                  <span>
                    Estás capturando:{' '}
                    {subDeptoActivo === 12 && '📢 Marketing'}
                    {subDeptoActivo === 13 && '🪙 Caja Chica'}
                    {subDeptoActivo === 14 && '📋 Servicios Profesionales (Contaduría)'}
                  </span>
                  <button type="button" style={styles.closeBtn} onClick={() => setSubDeptoActivo(null)}>
                    ✕ Cerrar
                  </button>
                </div>

                <form onSubmit={(e) => e.preventDefault()} style={styles.grid}>
                  {subDeptoActivo === 12 && (
                    <>
                      <div style={{ ...styles.fieldGroup, ...styles.fullRow }}>
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
                          <span>Gastos de Marketing *</span>
                          <button
                            type="button"
                            style={styles.addBtn}
                            onClick={() => handleAgregarObjeto(setLineasMarketing, lineasMarketing, { tipoGasto: '', monto: '', comentario: '' })}
                          >
                            +
                          </button>
                        </div>
                        {lineasMarketing.map((item, idx) => (
                          <div key={idx} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                            <select
                              style={{ ...styles.select, flex: 1.5 }}
                              value={item.tipoGasto}
                              onChange={(e) => handleCambioObjeto(setLineasMarketing, lineasMarketing, idx, 'tipoGasto', e.target.value)}
                              required
                            >
                              <option value="">-- Seleccionar concepto --</option>
                              <option value="Eventos">Eventos</option>
                              <option value="Capacitaciones">Capacitaciones</option>
                              <option value="Ferias">Ferias</option>
                              <option value="Souvenirs">Souvenirs</option>
                              <option value="Perifoneo">Perifoneo</option>
                            </select>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
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
