import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
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
  formContainer: {
    backgroundColor: '#ffffff',
    border: `2px solid ${vino}`,
    borderRadius: '10px',
    padding: '22px',
    marginTop: '20px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)'
  },
  formTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: vino,
    borderBottom: '1px solid #e2e8f0',
    paddingBottom: '10px',
    marginBottom: '18px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
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
  },
  infoBanner: {
    backgroundColor: '#e0f2fe',
    border: '1px solid #0284c7',
    color: '#0369a1',
    padding: '12px 16px',
    borderRadius: '8px',
    marginBottom: '18px',
    fontSize: '14px',
    fontWeight: '500'
  }
}

export default function Viaticos() {
  const navigate = useNavigate()
  const location = useLocation()
  const initialData = location.state || {}

  // ESTADOS CATALOGOS
  const [empleados, setEmpleados] = useState([])
  const [rutas, setRutas] = useState([])
  const [unidades, setUnidades] = useState([])

  // ESTADOS FORMULARIO
  const [idGastoTemporal] = useState(initialData.id_gasto_temporal || null)
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState(initialData.id_empleado ? String(initialData.id_empleado) : '')
  const [montoEntregado] = useState(initialData.monto_entregado || 0)
  const [origenPago, setOrigenPago] = useState(initialData.origen_pago || 'EFECTIVO')
  const [cuentaBancaria, setCuentaBancaria] = useState('')
  const [nombreDuenioCuenta, setNombreDuenioCuenta] = useState('')
  const [idRutaSeleccionada, setIdRutaSeleccionada] = useState('')
  const [idUnidadSeleccionada, setIdUnidadSeleccionada] = useState('')
  const [esChofer, setEsChofer] = useState(false)
  const [concepto, setConcepto] = useState('')

  // DESGLOSE DINÁMICO VIÁTICOS
  const [casetas, setCasetas] = useState([''])
  const [gasolina, setGasolina] = useState([''])
  const [comidas, setComidas] = useState([''])
  const [folios, setFolios] = useState([''])

  useEffect(() => {
    fetch(`${API}/empleados`).then(r => r.json()).then(d => Array.isArray(d) && setEmpleados(d)).catch(console.error)
    fetch(`${API}/rutas`).then(r => r.json()).then(d => Array.isArray(d) && setRutas(d)).catch(console.error)
    fetch(`${API}/unidades`).then(r => r.json()).then(d => Array.isArray(d) && setUnidades(d)).catch(console.error)
  }, [])

  useEffect(() => {
    if (empleadoSeleccionado && empleados.length > 0) {
      const emp = empleados.find((e) => String(e.id_empleado) === String(empleadoSeleccionado))
      if (emp && emp.puesto) {
        const puestoUpper = emp.puesto.toUpperCase().trim()
        setEsChofer(puestoUpper === 'CHOFER' || puestoUpper === 'CHOFERES')
      } else {
        setEsChofer(false)
      }
    }
  }, [empleadoSeleccionado, empleados])

  const handleEmpleadoChange = (idEmp) => {
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

  // Totales
  const totalCasetas = casetas.reduce((acc, v) => acc + (parseFloat(v) || 0), 0)
  const totalGasolina = gasolina.reduce((acc, v) => acc + (parseFloat(v) || 0), 0)
  const totalComidas = comidas.reduce((acc, v) => acc + (parseFloat(v) || 0), 0)
  const totalViaticosGeneral = totalCasetas + totalGasolina + totalComidas
  const diferenciaMonto = parseFloat(montoEntregado) - totalViaticosGeneral

  const handleGuardarViaticos = async () => {
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

    let cuentaFinal = null
    if (origenPago === 'TRANSFERENCIA') {
      cuentaFinal = cuentaBancaria === 'OTRO'
        ? `OTRO (${nombreDuenioCuenta.trim()})`
        : cuentaBancaria
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

    const numComprobanteFinal = foliosLimpios.length > 0 ? foliosLimpios.join(', ') : null

    let url = ''
    let payload = {}

    if (idGastoTemporal) {
      // 🚀 RUTA A: COMPROBACIÓN DE GASTO TEMPORAL
      url = `${API}/gastos-temporales/${idGastoTemporal}/comprobar`
      payload = {
        id_categoria: 8,
        monto_comprobado: totalViaticosGeneral,
        num_comprobante: numComprobanteFinal,
        concepto: conceptoPayload,
        cuenta_bancaria: cuentaFinal,
        id_unidad_relacionada: idUnidadSeleccionada ? parseInt(idUnidadSeleccionada) : null,
        unidad_relacionada: nombreUnidad,
        id_ruta_relacionada: idRutaSeleccionada ? parseInt(idRutaSeleccionada) : null
      }
    } else {
      // 💵 RUTA B: EGRESO DIRECTO E INMEDIATO
      url = `${API}/egresos`
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
        num_comprobante: numComprobanteFinal
      }
    }

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!res.ok) {
        alert('Error al comprobar y registrar los viáticos.')
        return
      }

      const data = await res.json()
      if (data.success || data.ok) {
        alert('¡Viáticos registrados y comprobados exitosamente!')
        navigate(-1)
      } else {
        alert(`Error: ${data.error || 'No se pudo guardar la comprobación'}`)
      }
    } catch (error) {
      console.error('Error al registrar viáticos:', error)
      alert('Error de conexión con el servidor.')
    }
  }

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div style={styles.leftSection}>
          <button style={styles.cancel} onClick={() => navigate(-1)}>
            Volver
          </button>
        </div>
        <div style={styles.centerSection}>
          <h1 style={styles.mainTitle}>COMPROBACIÓN DE VIÁTICOS</h1>
        </div>
        <div style={styles.rightSection}>
          <img src={logo} alt="Logo SCAE" style={styles.logo} />
        </div>
      </header>

      {idGastoTemporal && (
        <div style={styles.infoBanner}>
          ℹ️ Comprobando Gasto Temporal #{idGastoTemporal} — Monto originalmente entregado: ${parseFloat(montoEntregado).toFixed(2)}
        </div>
      )}

      <div style={styles.formContainer}>
        <div style={styles.formTitle}>
          <span>✈️ Formulario de Captura de Viáticos</span>
        </div>

        <form onSubmit={(e) => e.preventDefault()} style={styles.grid}>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Empleado que recibe viáticos *</label>
            <select
              style={styles.select}
              value={empleadoSeleccionado}
              onChange={(e) => handleEmpleadoChange(e.target.value)}
              disabled={!!idGastoTemporal}
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

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Origen de pago *</label>
            <select
              style={styles.select}
              value={origenPago}
              disabled={!!idGastoTemporal}
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

          <div style={{ ...styles.fullRow, ...styles.totalSummaryBox }}>
            <div style={{ fontSize: '20px', fontWeight: '900', color: vino }}>
              MONTO TOTAL COMPROBADO: ${totalViaticosGeneral.toFixed(2)}
            </div>
            {idGastoTemporal && (
              <div style={{ fontSize: '14px', marginTop: '6px', color: diferenciaMonto < 0 ? '#dc2626' : '#16a34a', fontWeight: 'bold' }}>
                {diferenciaMonto >= 0 
                  ? `Sobrante a devolver/ajustar: $${diferenciaMonto.toFixed(2)}`
                  : `Excedente a reembolsar: $${Math.abs(diferenciaMonto).toFixed(2)}`}
              </div>
            )}
          </div>

          <div style={styles.fullRow}>
            <button type="button" onClick={handleGuardarViaticos} style={styles.submitButton}>
              {idGastoTemporal ? 'Guardar y Comprobar Gasto Temporal' : 'Guardar Registro de Viáticos'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
