import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/TRANSPARENTE.png'

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
  subHeaderCard: {
    backgroundColor: '#f8f9fa',
    borderLeft: `5px solid ${vino}`,
    padding: '16px 20px',
    borderRadius: '4px',
    marginBottom: '25px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
  },
  subtitle: {
    margin: 0,
    fontSize: '20px',
    color: '#2c3e50',
    fontWeight: 'bold'
  },
  descriptionText: {
    margin: '6px 0 0 0',
    fontSize: '14px',
    color: '#555',
    lineHeight: '1.4'
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
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
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
    outline: 'none'
  },
  select: {
    padding: '10px 12px',
    borderRadius: '6px',
    border: '1px solid #cbd5e1',
    fontSize: '14px',
    backgroundColor: '#fff'
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
  }
}

function FlujoCaja() {
  const navigate = useNavigate()

  // 1. Inicia en false para mantener la vista limpia hasta dar clic
  const [produccionAbierto, setProduccionAbierto] = useState(false)

  const [apartadoActivo, setApartadoActivo] = useState(null)
  const [productosBD, setProductosBD] = useState([])
  const [subopcionSeleccionada, setSubopcionSeleccionada] = useState('')
  const [productoSeleccionado, setProductoSeleccionado] = useState('')
  const [origenPago, setOrigenPago] = useState('EFECTIVO')
  const [cuentaBancaria, setCuentaBancaria] = useState('')
  
  // Estado para capturar Nombre y Apellido si selecciona "Otro"
  const [nombreDuenioCuenta, setNombreDuenioCuenta] = useState('')

  const [monto, setMonto] = useState('')
  const [concepto, setConcepto] = useState('')
  const [comprobante, setComprobante] = useState('')

  useEffect(() => {
    fetch('/productos')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setProductosBD(data)
      })
      .catch((err) => console.error('Error al cargar productos:', err))
  }, [])

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

  // Guardar Egreso
  const handleSubmit = async (e) => {
    e.preventDefault()

    let detalleFinal = concepto
    if (apartadoActivo === 1 && subopcionSeleccionada) {
      detalleFinal = `[MATERIA PRIMA: ${subopcionSeleccionada}] - ${concepto}`
    } else if (apartadoActivo === 2 && subopcionSeleccionada) {
      detalleFinal = `[EPP: ${subopcionSeleccionada}] - ${concepto}`
    }

    // Definición de la cuenta de salida a registrar
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
      num_comprobante: comprobante
    }

    try {
      const res = await fetch('/egresos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const data = await res.json()
      if (res.ok && data.success) {
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
          <h1 style={styles.mainTitle}>FLUJO DE CAJA</h1>
        </div>
        <div style={styles.rightSection}>
          <img src={logo} alt="Logo SCAE" style={styles.logo} />
        </div>
      </header>

      {/* TARJETA PRINCIPAL (SOLO MOSTRARÁ CONTENIDO AL DAR CLIC) */}
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

        {/* CONTENIDO INTERNO: LAS 3 SUB-TARJETAS (SE MUESTRAN SÓLO SI ESTÁ DESPLEGADO) */}
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

            {/* FORMULARIO INTERNO DE LA SUB-TARJETA SELECCIONADA */}
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

                <form onSubmit={handleSubmit} style={styles.grid}>
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

                  {/* CAMPO DINÁMICO SI SE SELECCIONA "OTRO" EN CUENTA BANCARIA */}
                  {origenPago === 'TRANSFERENCIA' && cuentaBancaria === 'OTRO' && (
                    <div style={styles.fieldGroup}>
                      <label style={styles.label}>Nombre y Apellido del dueño de la cuenta *</label>
                      <input
                        type="text"
                        placeholder="Ej. Juan Pérez"
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
                      step="0.01"
                      placeholder="0.00"
                      style={styles.input}
                      value={monto}
                      onChange={(e) => setMonto(e.target.value)}
                      required
                    />
                  </div>

                  {/* CONCEPTO / COMENTARIOS */}
                  <div style={{ ...styles.fieldGroup, ...styles.fullRow }}>
                    <label style={styles.label}>Comentarios *</label>
                    <textarea
                      rows="2"
                      placeholder="Escribe un comentario si se requiere..."
                      style={{ ...styles.input, resize: 'vertical' }}
                      value={concepto}
                      onChange={(e) => setConcepto(e.target.value)}
                      required
                    />
                  </div>

                  {/* BOTÓN REGISTRAR */}
                  <div style={styles.fullRow}>
                    <button type="submit" style={styles.submitButton}>
                      Guardar registro de gasto
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
