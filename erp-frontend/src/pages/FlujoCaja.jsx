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
  blockTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: vino,
    marginBottom: '15px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  cardsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '20px',
    marginBottom: '25px'
  },
  card: {
    backgroundColor: '#fff',
    border: '2px solid #e0e0e0',
    borderRadius: '10px',
    padding: '20px',
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
    boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
  },
  cardActive: {
    borderColor: vino,
    backgroundColor: '#fff9f9',
    boxShadow: '0 4px 12px rgba(139,30,30,0.15)'
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '10px'
  },
  cardIcon: {
    fontSize: '28px'
  },
  cardName: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#2c3e50',
    margin: 0
  },
  cardDesc: {
    fontSize: '13px',
    color: '#666',
    margin: '5px 0 0 0'
  },
  formContainer: {
    backgroundColor: '#fff',
    border: `1px solid ${vino}`,
    borderRadius: '8px',
    padding: '25px',
    boxShadow: '0 3px 10px rgba(0,0,0,0.1)',
    marginTop: '10px'
  },
  formTitle: {
    fontSize: '17px',
    fontWeight: 'bold',
    color: vino,
    borderBottom: '1px solid #eee',
    paddingBottom: '10px',
    marginBottom: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: '#888',
    fontSize: '14px',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px'
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  label: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#333'
  },
  input: {
    padding: '10px 12px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '14px',
    outline: 'none'
  },
  select: {
    padding: '10px 12px',
    borderRadius: '6px',
    border: '1px solid #ccc',
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
    cursor: 'pointer'
  }
}

function FlujoCaja() {
  const navigate = useNavigate()

  // Estado para controlar qué tarjeta está abierta (1: Materias Primas, 2: EPP, 3: Empaque/Bolsas)
  const [apartadoActivo, setApartadoActivo] = useState(null)

  // Catálogo de Productos desde la BD
  const [productosBD, setProductosBD] = useState([])

  // Campos del Formulario
  const [subopcionSeleccionada, setSubopcionSeleccionada] = useState('')
  const [productoSeleccionado, setProductoSeleccionado] = useState('')
  const [origenPago, setOrigenPago] = useState('EFECTIVO')
  const [cuentaBancaria, setCuentaBancaria] = useState('')
  const [monto, setMonto] = useState('')
  const [concepto, setConcepto] = useState('')
  const [comprobante, setComprobante] = useState('')

  // Cargar lista de productos activos desde el backend Node.js
  useEffect(() => {
    fetch('/productos')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setProductosBD(data)
      })
      .catch((err) => console.error('Error al cargar productos:', err))
  }, [])

  // Seleccionar apartado (Tarjetas)
  const handleSelectApartado = (idCat) => {
    setApartadoActivo(idCat)
    // Limpiar campos
    setSubopcionSeleccionada('')
    setProductoSeleccionado('')
    setMonto('')
    setConcepto('')
    setComprobante('')
  }

  // Guardar Egreso
  const handleSubmit = async (e) => {
    e.preventDefault()

    // Construcción del concepto final agregando el ítem específico si aplica
    let detalleFinal = concepto
    if (apartadoActivo === 1 && subopcionSeleccionada) {
      detalleFinal = `[MATERIA PRIMA: ${subopcionSeleccionada}] - ${concepto}`
    } else if (apartadoActivo === 2 && subopcionSeleccionada) {
      detalleFinal = `[EPP: ${subopcionSeleccionada}] - ${concepto}`
    }

    const payload = {
      id_categoria: apartadoActivo,
      monto: parseFloat(monto),
      origen_pago: origenPago,
      cuenta_bancaria: origenPago === 'TRANSFERENCIA' ? cuentaBancaria : null,
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
        setApartadoActivo(null) // Cerrar formulario
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

      {/* SUBTÍTULO Y TEXTO INFORMATIVO */}
      <div style={styles.subHeaderCard}>
        <h2 style={styles.subtitle}>Control de Gastos Operativos</h2>
        <p style={styles.descriptionText}>
          Módulo de registro y fiscalización de egresos diarios. Captura aquí los costos operativos, insumos de producción y salidas corrientes de efectivo o banco.
        </p>
      </div>

      {/* TÍTULO DEL BLOQUE 1 */}
      <div style={styles.blockTitle}>
        <span>🏭</span> COSTOS DIRECTOS DE FABRICACIÓN
      </div>

      {/* TARJETAS DE APARTADOS DE PRODUCCIÓN */}
      <div style={styles.cardsContainer}>
        {/* TARJETA 1: MATERIAS PRIMAS */}
        <div
          style={{
            ...styles.card,
            ...(apartadoActivo === 1 ? styles.cardActive : {})
          }}
          onClick={() => handleSelectApartado(1)}
        >
          <div style={styles.cardHeader}>
            <span style={styles.cardName}>Materias Primas</span>
            <span style={styles.cardIcon}>📦</span>
          </div>
          <p style={styles.cardDesc}>
            Cemento blanco, cemento gris, cal, impalpable, aditivos, malla.
          </p>
        </div>

        {/* TARJETA 2: EPP */}
        <div
          style={{
            ...styles.card,
            ...(apartadoActivo === 2 ? styles.cardActive : {})
          }}
          onClick={() => handleSelectApartado(2)}
        >
          <div style={styles.cardHeader}>
            <span style={styles.cardName}>Protección Personal (EPP)</span>
            <span style={styles.cardIcon}>🥽</span>
          </div>
          <p style={styles.cardDesc}>
            Mascarillas y equipo de protección antipolvo para operadores.
          </p>
        </div>

        {/* TARJETA 3: EMPAQUE Y BOLSAS */}
        <div
          style={{
            ...styles.card,
            ...(apartadoActivo === 3 ? styles.cardActive : {})
          }}
          onClick={() => handleSelectApartado(3)}
        >
          <div style={styles.cardHeader}>
            <span style={styles.cardName}>Empaque y Bolsas</span>
            <span style={styles.cardIcon}>🛍️</span>
          </div>
          <p style={styles.cardDesc}>
            Bolsas asociadas a productos específicos (Pega, Estuco, etc.).
          </p>
        </div>
      </div>

      {/* FORMULARIO DINÁMICO SEGÚN TARJETA SELECCIONADA */}
      {apartadoActivo && (
        <div style={styles.formContainer}>
          <div style={styles.formTitle}>
            <span>
              Capturando gasto en:{' '}
              {apartadoActivo === 1 && '📦 Materias Primas'}
              {apartadoActivo === 2 && '🥽 Equipo de Protección Personal (EPP)'}
              {apartadoActivo === 3 && '🛍️ Insumos de Empaque y Bolsas'}
            </span>
            <button
              type="button"
              style={styles.closeBtn}
              onClick={() => setApartadoActivo(null)}
            >
              ✕ Cerrar Formulario
            </button>
          </div>

          <form onSubmit={handleSubmit} style={styles.grid}>
            {/* OPCIÓN ESPECÍFICA DE MATERIAS PRIMAS */}
            {apartadoActivo === 1 && (
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Insumo de Materia Prima *</label>
                <select
                  style={styles.select}
                  value={subopcionSeleccionada}
                  onChange={(e) => setSubopcionSeleccionada(e.target.value)}
                  required
                >
                  <option value="">-- Seleccionar Insumo --</option>
                  <option value="Cemento Blanco">Cemento Blanco</option>
                  <option value="Cemento Gris">Cemento Gris</option>
                  <option value="Cal">Cal</option>
                  <option value="Impalpable">Impalpable</option>
                  <option value="Aditivos">Aditivos</option>
                  <option value="Malla">Malla</option>
                </select>
              </div>
            )}

            {/* OPCIÓN ESPECÍFICA DE EPP */}
            {apartadoActivo === 2 && (
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Tipo de Equipo / Protección *</label>
                <select
                  style={styles.select}
                  value={subopcionSeleccionada}
                  onChange={(e) => setSubopcionSeleccionada(e.target.value)}
                  required
                >
                  <option value="">-- Seleccionar Tipo --</option>
                  <option value="Mascarillas Antipolvo">Mascarillas Antipolvo</option>
                  <option value="Filtros y Respiradores">Filtros y Respiradores</option>
                  <option value="Protección Ocular / Lentes">Protección Ocular / Lentes</option>
                </select>
              </div>
            )}

            {/* OPCIÓN ESPECÍFICA DE EMPAQUE (CONECTADO A LA BD DE PRODUCTOS) */}
            {apartadoActivo === 3 && (
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Producto para Empaque / Bolsa *</label>
                <select
                  style={styles.select}
                  value={productoSeleccionado}
                  onChange={(e) => setProductoSeleccionado(e.target.value)}
                  required
                >
                  <option value="">-- Seleccionar Producto del Catálogo --</option>
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
              <label style={styles.label}>Origen de Pago *</label>
              <select
                style={styles.select}
                value={origenPago}
                onChange={(e) => setOrigenPago(e.target.value)}
              >
                <option value="EFECTIVO">Efectivo (Caja Chica)</option>
                <option value="TRANSFERENCIA">Transferencia / Cheque (Banco)</option>
              </select>
            </div>

            {/* CUENTA BANCARIA (SÓLO SI ES TRANSFERENCIA) */}
            {origenPago === 'TRANSFERENCIA' && (
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Cuenta Bancaria de Salida *</label>
                <select
                  style={styles.select}
                  value={cuentaBancaria}
                  onChange={(e) => setCuentaBancaria(e.target.value)}
                  required
                >
                  <option value="">-- Seleccionar Cuenta --</option>
                  <option value="Cuenta Fiscal">Cuenta Fiscal</option>
                  <option value="Cuenta Eli">Cuenta Eli</option>
                </select>
              </div>
            )}

            {/* MONTO */}
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Monto Pagado ($) *</label>
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

            {/* NO. COMPROBANTE */}
            <div style={styles.fieldGroup}>
              <label style={styles.label}>No. Ticket / Factura (Opcional)</label>
              <input
                type="text"
                placeholder="Ej. F-10293"
                style={styles.input}
                value={comprobante}
                onChange={(e) => setComprobante(e.target.value)}
              />
            </div>

            {/* CONCEPTO / DETALLE */}
            <div style={{ ...styles.fieldGroup, ...styles.fullRow }}>
              <label style={styles.label}>Concepto / Descripción del Gasto *</label>
              <textarea
                rows="2"
                placeholder="Escribe el detalle del gasto realizado..."
                style={{ ...styles.input, resize: 'vertical' }}
                value={concepto}
                onChange={(e) => setConcepto(e.target.value)}
                required
              />
            </div>

            {/* BOTÓN DE ENVÍO */}
            <div style={styles.fullRow}>
              <button type="submit" style={styles.submitButton}>
                Guardar Registro de Gasto
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

export default FlujoCaja
