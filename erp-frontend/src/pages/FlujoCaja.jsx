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
  const [subPersonalActivo, setSubPersonalActivo] = useState(null) // 4=Nómina, 5=IMSS/ISR, 6=Comedor, 7=Viáticos
  const [empleados, setEmpleados] = useState([])
  const [empleadosPagados, setEmpleadosPagados] = useState([])
  const [puestoTab, setPuestoTab] = useState('ADMINISTRATIVOS')
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState('')
  const [subTipoImpuesto, setSubTipoImpuesto] = useState('IMSS') // 'IMSS' o 'ISR'
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

  // ESTADOS - GASTOS DE PLANTA Y MANTENIMIENTO (TARJETA 3)
  const [plantaAbierto, setPlantaAbierto] = useState(false)
  const [subPlantaActivo, setSubPlantaActivo] = useState(null) // 8=Servicios Públicos, 9=Operaciones y Mantenimiento, 10=Herramientas y Consumibles
  const [fechaPago, setFechaPago] = useState('')
  const [tipoServicioPublico, setTipoServicioPublico] = useState('')
  const [lineasServicios, setLineasServicios] = useState([{ concepto: '', monto: '' }])
  
  // Sub-tarjeta 2 Planta
  const [tipoEquipo, setTipoEquipo] = useState('Unidad') // 'Unidad' o 'Montacargas'
  const [montacargas, setMontacargas] = useState([])
  const [equipoSeleccionado, setEquipoSeleccionado] = useState('')
  const [tipoServicioMantenimiento, setTipoServicioMantenimiento] = useState('')
  const [lineasMantenimiento, setLineasMantenimiento] = useState([{ concepto: '', monto: '' }])

  // Sub-tarjeta 3 Planta
  const [lineasHerramientas, setLineasHerramientas] = useState([{ cantidad: '1', concepto: '', precio: '' }])

  // ESTADOS - GASTOS ADMINISTRATIVOS Y DIVERSOS (TARJETA 4)
  const [adminAbierto, setAdminAbierto] = useState(false)
  const [subAdminActivo, setSubAdminActivo] = useState(null) // 11=Papelería, 12=Honorarios, 13=Tramites/Permisos, 14=Otros
  const [tipoGastoAdmin, setTipoGastoAdmin] = useState('')

  // Cargar productos de la base de datos
  useEffect(() => {
    fetch(`${API}/productos`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then((data) => {
        if (Array.isArray(data)) setProductosBD(data)
      })
      .catch((err) => console.error('Error al cargar productos:', err))
  }, [])

  // Cargar empleados de la base de datos
  useEffect(() => {
    fetch(`${API}/empleados`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then((data) => {
        if (Array.isArray(data)) setEmpleados(data)
      })
      .catch((err) => console.error('Error al cargar empleados:', err))
  }, [])

  // Cargar rutas de la base de datos
  useEffect(() => {
    fetch(`${API}/rutas`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setRutas(data)
      })
      .catch((err) => console.error('Error al cargar rutas:', err))
  }, [])

  // Cargar unidades de la base de datos
  useEffect(() => {
    fetch(`${API}/unidades`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setUnidades(data)
      })
      .catch((err) => console.error('Error al cargar unidades:', err))
  }, [])

  // Cargar montacargas de la base de datos
  useEffect(() => {
    fetch(`${API}/montacargas`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setMontacargas(data)
      })
      .catch((err) => console.error('Error al cargar montacargas:', err))
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

    // Reset especifico para Viáticos
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

    // Reset Sub 1
    setTipoServicioPublico('')
    setLineasServicios([{ concepto: '', monto: '' }])

    // Reset Sub 2
    setTipoEquipo('Unidad')
    setEquipoSeleccionado('')
    setTipoServicioMantenimiento('')
    setLineasMantenimiento([{ concepto: '', monto: '' }])

    // Reset Sub 3
    setLineasHerramientas([{ cantidad: '1', concepto: '', precio: '' }])
  }

  const handleSelectSubAdmin = (idSub) => {
    setSubAdminActivo(idSub)
    setMonto('')
    setConcepto('')
    setComprobante('')
    setOrigenPago('EFECTIVO')
    setCuentaBancaria('')
    setNombreDuenioCuenta('')
    setTipoGastoAdmin('')
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

  // Auxiliares para manipular arreglos dinámicos de viáticos
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

  // Auxiliares dinámicos para Planta y Mantenimiento
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

  // Totales en tiempo real para viáticos
  const totalCasetas = casetas.reduce((acc, v) => acc + (parseFloat(v) || 0), 0)
  const totalGasolina = gasolina.reduce((acc, v) => acc + (parseFloat(v) || 0), 0)
  const totalComidas = comidas.reduce((acc, v) => acc + (parseFloat(v) || 0), 0)
  const totalViaticosGeneral = totalCasetas + totalGasolina + totalComidas

  // Totales en tiempo real Planta
  const totalServiciosPublicos = lineasServicios.reduce((acc, item) => acc + (parseFloat(item.monto) || 0), 0)
  const totalMantenimiento = lineasMantenimiento.reduce((acc, item) => acc + (parseFloat(item.monto) || 0), 0)
  const totalHerramientas = lineasHerramientas.reduce((acc, item) => {
    const cant = parseFloat(item.cantidad) || 0
    const prec = parseFloat(item.precio) || 0
    return acc + (cant * prec)
  }, 0)

  // SUBMIT - GASTOS OPERATIVOS
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
        const errorText = await res.text()
        try {
          const errorJson = JSON.parse(errorText)
          alert(`Error (${res.status}): ${errorJson.error || 'No se pudo registrar el gasto'}`)
        } catch {
          alert(`Error del servidor (${res.status}): El endpoint no aceptó la petición.`)
        }
        return
      }

      const data = await res.json()
      if (data.success) {
        alert('¡Gasto registrado con éxito!')
        setApartadoActivo(null)
      } else {
        alert(`Error: ${data.error || 'No se pudo registrar el gasto'}`)
      }
    } catch (error) {
      console.error('Error al enviar registro:', error)
      alert('Ocurrió un error de conexión con el servidor.')
    }
  }

  // SUBMIT - GASTOS DE PERSONAL Y VIÁTICOS
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

    // CASO ESPECÍFICO: SUB-TARJETA 7 (VIÁTICOS)
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

      // Validaciones para Chofer (Obligatorios: Ruta, Unidad y Folios)
      if (esChofer) {
        if (!idRutaSeleccionada) {
          alert('⚠️ Para los choferes es obligatorio seleccionar una Ruta.')
          return
        }
        if (!idUnidadSeleccionada) {
          alert('⚠️ Para los choferes es obligatorio seleccionar una Unidad.')
          return
        }
        if (foliosLimpios.length === 0) {
          alert('⚠️ Para los choferes es obligatorio capturar al menos un folio.')
          return
        }
      } else {
        // Validaciones para otros puestos (Opcionales con confirmación)
        if (!idRutaSeleccionada || !idUnidadSeleccionada) {
          const confirma = window.confirm('¿Estás seguro que deseas continuar sin seleccionar Ruta / Unidad?')
          if (!confirma) return
        }

        if (foliosLimpios.length === 0) {
          const confirma = window.confirm('¿Estás seguro que no deseas capturar los folios?')
          if (!confirma) return
        }
      }

      const empObj = empleados.find(emp => String(emp.id_empleado) === String(empleadoSeleccionado))
      const nombreEmpleado = empObj ? (empObj.nombre_completo || `${empObj.nombre || ''} ${empObj.apellido1 || ''}`) : null

      const uniObj = unidades.find(u => String(u.id_unidad) === String(idUnidadSeleccionada))
      const nombreUnidad = uniObj ? (uniObj.nombre || uniObj.placas) : null

      const casetasArr = casetas.map(Number).filter(n => n > 0)
      const gasolinaArr = gasolina.map(Number).filter(n => n > 0)
      const comidasArr = comidas.map(Number).filter(n => n > 0)

      const conceptoPayload = JSON.stringify({
        resumen: `VIÁTICOS: Casetas $${totalCasetas} | Gasolina $${totalGasolina} | Comidas $${totalComidas}`,
        desglose: {
          casetas: casetasArr,
          gasolina: gasolinaArr,
          comidas: comidasArr
        },
        comentario: concepto.trim() || null
      })

      payload = {
        id_categoria: 8, // Viáticos
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
      // CASOS 4 (NÓMINA), 5 (IMSS/ISR), 6 (COMEDOR)
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
      const endpoint = `${API}/egresos`
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!res.ok) {
        const errorText = await res.text()
        alert(`Error (${res.status}): ${errorText}`)
        return
      }

      const data = await res.json()
      if (data.success) {
        alert('¡Gasto registrado con éxito!')
        
        // Actualizar array de empleados pagados en tiempo real si es nómina
        if (subPersonalActivo === 4 && empleadoSeleccionado) {
          setEmpleadosPagados(prev => [...prev, parseInt(empleadoSeleccionado)])
        }

        // Limpieza de campos
        setEmpleadoSeleccionado('')
        setMonto('')
        setConcepto('')
        setComprobante('')
        setNombreDuenioCuenta('')
        setIdRutaSeleccionada('')
        setIdUnidadSeleccionada('')
        setEsChofer(false)
        setCasetas([''])
        setGasolina([''])
        setComidas([''])
        setFolios([''])
      } else {
        alert(`Error: ${data.error || 'No se pudo registrar el gasto'}`)
      }
    } catch (error) {
      console.error('Error al registrar gasto:', error)
      alert('Error de conexión con el servidor.')
    }
  }

  // SUBMIT - GASTOS DE PLANTA Y MANTENIMIENTO (TARJETA 3)
  const handleGuardarPlanta = async () => {
    // Validación para Sub-Tarjeta Operaciones y Mantenimiento (ID: 9)
    if (subPlantaActivo === 9) {
      if (tipoServicioMantenimiento === 'Otro') {
        const faltaDetalle = lineasMantenimiento.some((item) => !item.concepto || item.concepto.trim() === '');
        if (faltaDetalle) {
          alert('Es necesario definir ese otro gasto en el detalle de la reparación.');
          return;
        }
      }

      const faltaMonto = lineasMantenimiento.some((item) => !item.monto || Number(item.monto) <= 0);
      if (faltaMonto) {
        alert('Por favor ingresa un monto válido para todas las líneas de mantenimiento.');
        return;
      }
    }

    // Validación para Sub-Tarjeta Herramientas (ID: 10)
    if (subPlantaActivo === 10) {
      const camposIncompletos = lineasHerramientas.some(
        (item) => !item.concepto || item.concepto.trim() === '' || !item.precio || Number(item.precio) <= 0
      );

      if (camposIncompletos) {
        alert('Es obligatorio especificar qué compraste y ingresar un precio válido.');
        return;
      }
    }

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
      cuentaFinal = cuentaBancaria === 'OTRO'
        ? `OTRO (${nombreDuenioCuenta.trim()})`
        : cuentaBancaria
    }

    let payload = {}

    // 1️⃣ SUB-TARJETA 1: SERVICIOS PÚBLICOS
    if (subPlantaActivo === 8) {
      if (!tipoServicioPublico) {
        alert('⚠️ Selecciona el tipo de servicio público.')
        return
      }
      if (totalServiciosPublicos <= 0) {
        alert('⚠️ Ingresa al menos un concepto y monto válido.')
        return
      }

      const lineasFiltradas = lineasServicios.filter(l => parseFloat(l.monto) > 0)

      payload = {
        id_categoria: 9, // Servicios Públicos
        fecha_pago: fechaPago,
        tipo_servicio: tipoServicioPublico,
        monto: totalServiciosPublicos,
        origen_pago: origenPago,
        cuenta_bancaria: cuentaFinal,
        concepto: JSON.stringify({
          tipo_servicio: tipoServicioPublico,
          desglose: lineasFiltradas
        })
      }
    }

    // 2️⃣ SUB-TARJETA 2: OPERACIONES Y MANTENIMIENTO
    else if (subPlantaActivo === 9) {
      if (!equipoSeleccionado) {
        alert(`⚠️ Selecciona un(a) ${tipoEquipo.toLowerCase()}.`)
        return
      }
      if (!tipoServicioMantenimiento) {
        alert('⚠️ Selecciona el tipo de servicio de mantenimiento.')
        return
      }
      if (totalMantenimiento <= 0) {
        alert('⚠️ Ingresa al menos un concepto y monto válido de reparación.')
        return
      }

      const lineasFiltradas = lineasMantenimiento.filter(l => parseFloat(l.monto) > 0)
      const equipoObj = tipoEquipo === 'Unidad'
        ? unidades.find(u => String(u.id_unidad) === String(equipoSeleccionado))
        : montacargas.find(m => String(m.id_montacargas) === String(equipoSeleccionado))

      const nombreEquipo = equipoObj ? (equipoObj.nombre || equipoObj.placas || equipoObj.num_serie) : null

      payload = {
        id_categoria: 10, // Operaciones y Mantenimiento
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
          desglose: lineasFiltradas
        })
      }
    }

    // 3️⃣ SUB-TARJETA 3: HERRAMIENTAS Y CONSUMIBLES
    else if (subPlantaActivo === 10) {
      if (totalHerramientas <= 0) {
        alert('⚠️ Ingresa al menos una herramienta con cantidad y precio válido.')
        return
      }

      const lineasFiltradas = lineasHerramientas.filter(l => (parseFloat(l.cantidad) * parseFloat(l.precio)) > 0)

      payload = {
        id_categoria: 11, // Herramientas y Consumibles
        fecha_pago: fechaPago,
        monto: totalHerramientas,
        origen_pago: origenPago,
        cuenta_bancaria: cuentaFinal,
        concepto: JSON.stringify({
          desglose: lineasFiltradas
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
        const errorText = await res.text()
        alert(`Error (${res.status}): ${errorText}`)
        return
      }

      const data = await res.json()
      if (data.success) {
        alert('¡Gasto de Planta y Mantenimiento registrado exitosamente!')
        setSubPlantaActivo(null)
      } else {
        alert(`Error: ${data.error || 'No se pudo guardar el gasto'}`)
      }
    } catch (error) {
      console.error('Error al enviar registro de planta:', error)
      alert('Ocurrió un error de conexión con el servidor.')
    }
  }

  // SUBMIT - GASTOS ADMINISTRATIVOS Y DIVERSOS (TARJETA 4)
  const handleGuardarAdmin = async () => {
    if (!monto || parseFloat(monto) <= 0) {
      alert('Por favor ingresa un monto válido.')
      return
    }

    let cuentaFinal = null
    if (origenPago === 'TRANSFERENCIA') {
      if (!cuentaBancaria) {
        alert('Por favor selecciona la cuenta bancaria.')
        return
      }
      cuentaFinal = cuentaBancaria === 'OTRO'
        ? `OTRO (${nombreDuenioCuenta.trim()})`
        : cuentaBancaria
    }

    const baseConcepto = concepto.trim() ? concepto.trim() : 'Gasto Administrativo'
    let etiquetaSub = ''
    if (subAdminActivo === 11) etiquetaSub = 'PAPELERÍA Y OFICINA'
    else if (subAdminActivo === 12) etiquetaSub = 'HONORARIOS Y SERVICIOS'
    else if (subAdminActivo === 13) etiquetaSub = 'TRÁMITES Y PERMISOS'
    else if (subAdminActivo === 14) etiquetaSub = 'GASTOS DIVERSOS'

    const detalleFinal = `[${etiquetaSub}] - ${baseConcepto}`

    const payload = {
      id_categoria: 12, // Categoría Gastos Administrativos
      monto: parseFloat(monto),
      origen_pago: origenPago,
      cuenta_bancaria: cuentaFinal,
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
        const errorText = await res.text()
        alert(`Error (${res.status}): ${errorText}`)
        return
      }

      const data = await res.json()
      if (data.success) {
        alert('¡Gasto administrativo registrado exitosamente!')
        setSubAdminActivo(null)
        setMonto('')
        setConcepto('')
        setComprobante('')
        setCuentaBancaria('')
        setNombreDuenioCuenta('')
      } else {
        alert(`Error: ${data.error || 'No se pudo guardar el gasto'}`)
      }
    } catch (error) {
      console.error('Error al enviar registro administrativo:', error)
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
          <h1 style={styles.mainTitle}>DESGLOSE DE CAJA</h1>
        </div>
        <div style={styles.rightSection}>
          <img src={logo} alt="Logo SCAE" style={styles.logo} />
        </div>
      </header>

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

        {/* SUB-TARJETAS PRODUCCIÓN */}
        {produccionAbierto && (
          <div>
            <div style={styles.cardsContainer}>
              {/* SUB-TARJETA 1: MATERIAS PRIMAS */}
              <div
                style={{
                  ...styles.card,
                  ...(apartadoActivo === 1 ? styles.cardActive : {})
                }}
                onClick={() => handleSelectApartado(1)}
              >
                <div style={styles.cardHeader}>
                  <span style={styles.cardName}>Materias primas</span>
                  <span style={styles.cardIcon}>📦</span>
                </div>
                <p style={styles.cardDesc}>
                  Cemento blanco, cemento gris, cal, impalpable, aditivos, malla.
                </p>
              </div>

              {/* SUB-TARJETA 2: EPP */}
              <div
                style={{
                  ...styles.card,
                  ...(apartadoActivo === 2 ? styles.cardActive : {})
                }}
                onClick={() => handleSelectApartado(2)}
              >
                <div style={styles.cardHeader}>
                  <span style={styles.cardName}>Protección personal (EPP)</span>
                  <span style={styles.cardIcon}>🥽</span>
                </div>
                <p style={styles.cardDesc}>
                  Mascarillas y equipo de protección para operadores.
                </p>
              </div>

              {/* SUB-TARJETA 3: EMPAQUE Y BOLSAS */}
              <div
                style={{
                  ...styles.card,
                  ...(apartadoActivo === 3 ? styles.cardActive : {})
                }}
                onClick={() => handleSelectApartado(3)}
              >
                <div style={styles.cardHeader}>
                  <span style={styles.cardName}>Bolsa</span>
                  <span style={styles.cardIcon}>🛍️</span>
                </div>
                <p style={styles.cardDesc}>
                  Bolsa de cada uno de nuestros productos.
                </p>
              </div>
            </div>

            {/* FORMULARIO GASTOS OPERATIVOS */}
            {apartadoActivo && (
              <div style={styles.formContainer}>
                <div style={styles.formTitle}>
                  <span>
                    Estás capturando gasto en:{' '}
                    {apartadoActivo === 1 && '📦 Materias primas'}
                    {apartadoActivo === 2 && '🥽 Equipo de protección personal (EPP)'}
                    {apartadoActivo === 3 && '🛍️ Insumos de bolsa'}
                  </span>
                  <button
                    type="button"
                    style={styles.closeBtn}
                    onClick={() => setApartadoActivo(null)}
                  >
                    ✕ Cerrar
                  </button>
                </div>

                <form onSubmit={(e) => e.preventDefault()} style={styles.grid}>
                  {/* OPCIÓN MATERIAS PRIMAS */}
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

                  {/* OPCIÓN EPP */}
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

                  {/* OPCIÓN EMPAQUE Y BOLSAS */}
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

                  {/* ORIGEN DE PAGO */}
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

                  {/* CUENTA BANCARIA */}
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

                  {/* CAMPO DINÁMICO OTRO EN CUENTA BANCARIA */}
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

                  {/* MONTO */}
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

                  {/* CONCEPTO / COMENTARIOS (OPCIONAL) */}
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

                  {/* BOTÓN REGISTRAR */}
                  <div style={styles.fullRow}>
                    <button 
                      type="button" 
                      onClick={handleGuardarOperativos} 
                      style={styles.submitButton}
                    >
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
                Pago de nómina base, IMSS , ISR , comedor y viáticos.
              </p>
            </div>
          </div>
          <span style={styles.toggleBadge}>
            {personalAbierto ? '▼ Ocultar' : '▶ Desplegar'}
          </span>
        </div>

        {/* SUB-TARJETAS PERSONAL */}
        {personalAbierto && (
          <div>
            <div style={styles.cardsContainer}>
              {/* SUB-TARJETA 1: NÓMINA BASE */}
              <div
                style={{
                  ...styles.card,
                  ...(subPersonalActivo === 4 ? styles.cardActive : {})
                }}
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

              {/* SUB-TARJETA 2: IMSS E ISR */}
              <div
                style={{
                  ...styles.card,
                  ...(subPersonalActivo === 5 ? styles.cardActive : {})
                }}
                onClick={() => handleSelectSubPersonal(5)}
              >
                <div style={styles.cardHeader}>
                  <span style={styles.cardName}>IMSS e ISR</span>
                  <span style={styles.cardIcon}>🏥</span>
                </div>
                <p style={styles.cardDesc}>
                  Gastos de IMSS y ISR en los trabajadores.
                </p>
              </div>

              {/* SUB-TARJETA 3: COMEDOR */}
              <div
                style={{
                  ...styles.card,
                  ...(subPersonalActivo === 6 ? styles.cardActive : {})
                }}
                onClick={() => handleSelectSubPersonal(6)}
              >
                <div style={styles.cardHeader}>
                  <span style={styles.cardName}>Comedor</span>
                  <span style={styles.cardIcon}>🍽️</span>
                </div>
                <p style={styles.cardDesc}>
                  Gasto semanal en desayunos (PAGO A DOÑA LUCI)
                </p>
              </div>

              {/* SUB-TARJETA 4: VIÁTICOS */}
              <div
                style={{
                  ...styles.card,
                  ...(subPersonalActivo === 7 ? styles.cardActive : {})
                }}
                onClick={() => handleSelectSubPersonal(7)}
              >
                <div style={styles.cardHeader}>
                  <span style={styles.cardName}>Viáticos</span>
                  <span style={styles.cardIcon}>✈️</span>
                </div>
                <p style={styles.cardDesc}>
                  Asignaciones para gastos de transporte, comidas y despensa del personal.
                </p>
              </div>
            </div>

            {/* FORMULARIO GASTOS DE PERSONAL */}
            {subPersonalActivo && (
              <div style={styles.formContainer}>
                <div style={styles.formTitle}>
                  <span>
                    Estás capturando:{' '}
                    {subPersonalActivo === 4 && '💵 Nómina Base'}
                    {subPersonalActivo === 5 && '🏥 IMSS / ISR'}
                    {subPersonalActivo === 6 && '🍽️ Comedor'}
                    {subPersonalActivo === 7 && '✈️ Viáticos'}
                  </span>
                  <button
                    type="button"
                    style={styles.closeBtn}
                    onClick={() => setSubPersonalActivo(null)}
                  >
                    ✕ Cerrar
                  </button>
                </div>

                <form onSubmit={(e) => e.preventDefault()} style={styles.grid}>
                  
                  {/* CASO 1: NÓMINA BASE */}
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

                  {/* CASO 2: IMSS / ISR */}
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

                  {/* CASO 4: VIÁTICOS (FORMULARIO DINÁMICO COMPLETO) */}
                  {subPersonalActivo === 7 && (
                    <>
                      {/* EMPLEADO Y RUTA / UNIDAD */}
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

                      {/* CASETAS DINÁMICAS */}
                      <div style={{ ...styles.fullRow, ...styles.dynamicBlock }}>
                        <div style={styles.dynamicHeader}>
                          <span>🚗 Casetas — Total: ${totalCasetas.toFixed(2)}</span>
                          <button
                            type="button"
                            style={styles.addBtn}
                            onClick={() => handleAgregarCampo(setCasetas, casetas)}
                          >
                            +
                          </button>
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

                      {/* GASOLINA DINÁMICA */}
                      <div style={{ ...styles.fullRow, ...styles.dynamicBlock }}>
                        <div style={styles.dynamicHeader}>
                          <span>⛽ Gasolina / Diesel — Total: ${totalGasolina.toFixed(2)}</span>
                          <button
                            type="button"
                            style={styles.addBtn}
                            onClick={() => handleAgregarCampo(setGasolina, gasolina)}
                          >
                            +
                          </button>
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

                      {/* COMIDAS DINÁMICAS */}
                      <div style={{ ...styles.fullRow, ...styles.dynamicBlock }}>
                        <div style={styles.dynamicHeader}>
                          <span>🍽️ Comidas — Total: ${totalComidas.toFixed(2)}</span>
                          <button
                            type="button"
                            style={styles.addBtn}
                            onClick={() => handleAgregarCampo(setComidas, comidas)}
                          >
                            +
                          </button>
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

                      {/* FOLIOS DINÁMICOS */}
                      <div style={{ ...styles.fullRow, ...styles.dynamicBlock }}>
                        <div style={styles.dynamicHeader}>
                          <span>
                            📄 Folios / Comprobantes{' '}
                            {esChofer && <span style={{ color: '#dc2626', fontSize: '12px' }}>* (Obligatorio Chofer)</span>}
                          </span>
                          <button
                            type="button"
                            style={styles.addBtn}
                            onClick={() => handleAgregarCampo(setFolios, folios)}
                          >
                            +
                          </button>
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

                      {/* MONTO TOTAL DE VIÁTICOS */}
                      <div style={{ ...styles.fullRow, ...styles.totalSummaryBox }}>
                        <span style={{ fontSize: '20px', fontWeight: '900', color: vino }}>
                          MONTO TOTAL VIÁTICOS: ${totalViaticosGeneral.toFixed(2)}
                        </span>
                      </div>
                    </>
                  )}

                  {/* ORIGEN DE PAGO (PARA CASOS 4, 5, 6 Y 7) */}
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

                  {/* CUENTA BANCARIA */}
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

                  {/* CAMPO DINÁMICO OTRO EN CUENTA BANCARIA */}
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

                  {/* MONTO PARA NÓMINA, IMSS/ISR Y COMEDOR */}
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

                  {/* CONCEPTO / DETALLES */}
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

                  {/* BOTÓN SUBMIT */}
                  <div style={styles.fullRow}>
                    <button 
                      type="button" 
                      onClick={handleGuardarPersonal} 
                      style={styles.submitButton}
                    >
                      {subPersonalActivo === 7 ? 'Guardar Viáticos' : 'Guardar gasto'}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 🏛️ TARJETA PRINCIPAL 3: GASTOS DE PLANTA Y MANTENIMIENTO */}
      <div style={styles.parentCard}>
        <div
          style={styles.parentHeader}
          onClick={() => setPlantaAbierto(!plantaAbierto)}
        >
          <div style={styles.parentTitleGroup}>
            <span style={{ fontSize: '28px' }}>🏛️</span>
            <div>
              <h3 style={styles.parentTitle}>GASTOS DE PLANTA Y MANTENIMIENTO</h3>
              <p style={styles.parentSubtitle}>
                Servicios públicos, mantenimiento de vehículos/montacargas y herramientas.
              </p>
            </div>
          </div>
          <span style={styles.toggleBadge}>
            {plantaAbierto ? '▼ Ocultar' : '▶ Desplegar'}
          </span>
        </div>

        {/* SUB-TARJETAS PLANTA */}
        {plantaAbierto && (
          <div>
            <div style={styles.cardsContainer}>
              {/* SUB-TARJETA 1: SERVICIOS PÚBLICOS */}
              <div
                style={{
                  ...styles.card,
                  ...(subPlantaActivo === 8 ? styles.cardActive : {})
                }}
                onClick={() => handleSelectSubPlanta(8)}
              >
                <div style={styles.cardHeader}>
                  <span style={styles.cardName}>Servicios públicos</span>
                  <span style={styles.cardIcon}>⚡</span>
                </div>
                <p style={styles.cardDesc}>
                  Pago de luz (CFE), Agua, Gas e Internet/Telefonía.
                </p>
              </div>

              {/* SUB-TARJETA 2: OPERACIONES Y MANTENIMIENTO */}
              <div
                style={{
                  ...styles.card,
                  ...(subPlantaActivo === 9 ? styles.cardActive : {})
                }}
                onClick={() => handleSelectSubPlanta(9)}
              >
                <div style={styles.cardHeader}>
                  <span style={styles.cardName}>Servicios vehiculares</span>
                  <span style={styles.cardIcon}>🛠️</span>
                </div>
                <p style={styles.cardDesc}>
                  Mantenimiento y reparaciones de vehículos y montacargas.
                </p>
              </div>

              {/* SUB-TARJETA 3: HERRAMIENTAS Y CONSUMIBLES */}
              <div
                style={{
                  ...styles.card,
                  ...(subPlantaActivo === 10 ? styles.cardActive : {})
                }}
                onClick={() => handleSelectSubPlanta(10)}
              >
                <div style={styles.cardHeader}>
                  <span style={styles.cardName}>Compra de herramientas</span>
                  <span style={styles.cardIcon}>🧰</span>
                </div>
                <p style={styles.cardDesc}>
                  Compra de herramientas generales desde el pastero hasta Liz etc.
                </p>
              </div>
            </div>

            {/* FORMULARIO GASTOS DE PLANTA */}
            {subPlantaActivo && (
              <div style={styles.formContainer}>
                <div style={styles.formTitle}>
                  <span>
                    Estás capturando:{' '}
                    {subPlantaActivo === 8 && '⚡ Servicios Públicos'}
                    {subPlantaActivo === 9 && '🛠️ Operaciones y Mantenimiento'}
                    {subPlantaActivo === 10 && '🧰 Compra de Herramientas y Consumibles'}
                  </span>
                  <button
                    type="button"
                    style={styles.closeBtn}
                    onClick={() => setSubPlantaActivo(null)}
                  >
                    ✕ Cerrar
                  </button>
                </div>

                <form onSubmit={(e) => e.preventDefault()} style={styles.grid}>
                  
                  {/* FECHA DE PAGO (GLOBAL PARA LAS 3 SUB-TARJETAS DE PLANTA) */}
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

                  {/* 1️⃣ SUB-TARJETA 1: SERVICIOS PÚBLICOS */}
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

                      {/* LÍNEAS DINÁMICAS SERVICIOS */}
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

                  {/* 2️⃣ SUB-TARJETA 2: OPERACIONES Y MANTENIMIENTO */}
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

                      {/* LÍNEAS DINÁMICAS MANTENIMIENTO */}
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
                              required
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

                  {/* 3️⃣ SUB-TARJETA 3: COMPRA DE HERRAMIENTAS Y CONSUMIBLES */}
                  {subPlantaActivo === 10 && (
                    <>
                      {/* LÍNEAS DINÁMICAS HERRAMIENTAS */}
                      <div style={{ ...styles.fullRow, ...styles.dynamicBlock }}>
                        <div style={styles.dynamicHeader}>
                          <span>Compra de herramientas *</span>
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
                              placeholder="Cant."
                              style={{ ...styles.input, flex: '0.5 1 0%' }}
                              value={item.cantidad}
                              onChange={(e) => handleCambioObjeto(setLineasHerramientas, lineasHerramientas, idx, 'cantidad', e.target.value)}
                              required
                            />
                            <input
                              type="text"
                              placeholder="¿Cuál fue tu compra?"
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
                          MONTO TOTAL: ${totalHerramientas.toFixed(2)}
                        </span>
                      </div>
                    </>
                  )}
                  
                  {/* ORIGEN DE PAGO (COMÚN PARA LAS 3 SUB-TARJETAS DE PLANTA) */}
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

                  {/* CUENTA BANCARIA */}
                  {origenPago === 'TRANSFERENCIA' && (
                    <div style={styles.fieldGroup}>
                      <label style={styles.label}>Cuenta bancaria de salida *</label>
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

                  {/* CAMPO OTRO EN CUENTA BANCARIA */}
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

                  {/* BOTÓN SUBMIT PLANTA */}
                  <div style={styles.fullRow}>
                    <button 
                      type="button" 
                      onClick={handleGuardarPlanta} 
                      style={styles.submitButton}
                    >
                      Guardar gasto
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 📁 TARJETA PRINCIPAL 4: GASTOS ADMINISTRATIVOS Y DIVERSOS */}
      <div style={styles.parentCard}>
        <div
          style={styles.parentHeader}
          onClick={() => setAdminAbierto(!adminAbierto)}
        >
          <div style={styles.parentTitleGroup}>
            <span style={{ fontSize: '28px' }}>📁</span>
            <div>
              <h3 style={styles.parentTitle}>GASTOS ADMINISTRATIVOS Y DIVERSOS</h3>
              <p style={styles.parentSubtitle}>
                Papelería, honorarios profesionales, licencias, trámites gubernamentales y gastos varios.
              </p>
            </div>
          </div>
          <span style={styles.toggleBadge}>
            {adminAbierto ? '▼ Ocultar' : '▶ Desplegar'}
          </span>
        </div>

        {/* SUB-TARJETAS ADMINISTRATIVAS */}
        {adminAbierto && (
          <div>
            <div style={styles.cardsContainer}>
              {/* SUB-TARJETA 1: PAPELERÍA Y OFICINA */}
              <div
                style={{
                  ...styles.card,
                  ...(subAdminActivo === 11 ? styles.cardActive : {})
                }}
                onClick={() => handleSelectSubAdmin(11)}
              >
                <div style={styles.cardHeader}>
                  <span style={styles.cardName}>Papelería e Insumos</span>
                  <span style={styles.cardIcon}>📄</span>
                </div>
                <p style={styles.cardDesc}>
                  Hojas, tintas, carpetas y artículos de oficina en general.
                </p>
              </div>

              {/* SUB-TARJETA 2: HONORARIOS Y SERVICIOS */}
              <div
                style={{
                  ...styles.card,
                  ...(subAdminActivo === 12 ? styles.cardActive : {})
                }}
                onClick={() => handleSelectSubAdmin(12)}
              >
                <div style={styles.cardHeader}>
                  <span style={styles.cardName}>Honorarios y Asesorías</span>
                  <span style={styles.cardIcon}>💼</span>
                </div>
                <p style={styles.cardDesc}>
                  Contadores, abogados, licencias de software y consultoría externa.
                </p>
              </div>

              {/* SUB-TARJETA 3: TRÁMITES Y PERMISOS */}
              <div
                style={{
                  ...styles.card,
                  ...(subAdminActivo === 13 ? styles.cardActive : {})
                }}
                onClick={() => handleSelectSubAdmin(13)}
              >
                <div style={styles.cardHeader}>
                  <span style={styles.cardName}>Trámites y Permisos</span>
                  <span style={styles.cardIcon}>🏛️</span>
                </div>
                <p style={styles.cardDesc}>
                  Licencias de funcionamiento, derechos municipies/estatales y notaría.
                </p>
              </div>

              {/* SUB-TARJETA 4: GASTOS DIVERSOS */}
              <div
                style={{
                  ...styles.card,
                  ...(subAdminActivo === 14 ? styles.cardActive : {})
                }}
                onClick={() => handleSelectSubAdmin(14)}
              >
                <div style={styles.cardHeader}>
                  <span style={styles.cardName}>Gastos Diversos</span>
                  <span style={styles.cardIcon}>📌</span>
                </div>
                <p style={styles.cardDesc}>
                  Cualquier otro gasto operativo no catalogado anteriormente.
                </p>
              </div>
            </div>

            {/* FORMULARIO GASTOS ADMINISTRATIVOS */}
            {subAdminActivo && (
              <div style={styles.formContainer}>
                <div style={styles.formTitle}>
                  <span>
                    Estás capturando:{' '}
                    {subAdminActivo === 11 && '📄 Papelería e Insumos de Oficina'}
                    {subAdminActivo === 12 && '💼 Honorarios y Asesorías'}
                    {subAdminActivo === 13 && '🏛️ Trámites, Licencias y Permisos'}
                    {subAdminActivo === 14 && '📌 Gastos Diversos'}
                  </span>
                  <button
                    type="button"
                    style={styles.closeBtn}
                    onClick={() => setSubAdminActivo(null)}
                  >
                    ✕ Cerrar
                  </button>
                </div>

                <form onSubmit={(e) => e.preventDefault()} style={styles.grid}>
                  {/* ORIGEN DE PAGO */}
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

                  {/* CUENTA BANCARIA */}
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

                  {/* CAMPO OTRO EN CUENTA BANCARIA */}
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

                  {/* MONTO */}
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

                  {/* FOLIO O NÚMERO DE COMPROBANTE */}
                  <div style={styles.fieldGroup}>
                    <label style={styles.label}>Número de Folio / Comprobante (Opcional)</label>
                    <input
                      type="text"
                      placeholder="Ej. Factura F-102"
                      style={styles.input}
                      value={comprobante}
                      onChange={(e) => setComprobante(e.target.value)}
                    />
                  </div>

                  {/* CONCEPTO O OBSERVACIONES */}
                  <div style={{ ...styles.fieldGroup, ...styles.fullRow }}>
                    <label style={styles.label}>Concepto / Detalle del Gasto *</label>
                    <textarea
                      rows="2"
                      placeholder="Describe el gasto realizado..."
                      style={{ ...styles.input, resize: 'vertical' }}
                      value={concepto}
                      onChange={(e) => setConcepto(e.target.value)}
                      required
                    />
                  </div>

                  {/* BOTÓN REGISTRAR */}
                  <div style={styles.fullRow}>
                    <button 
                      type="button" 
                      onClick={handleGuardarAdmin} 
                      style={styles.submitButton}
                    >
                      Guardar gasto administrativo
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
