import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import logo from "../assets/TRANSPARENTE.png"

const API = "https://erp-proyecto-production.up.railway.app"

const styles = {
  page: {
    backgroundColor: '#ffffff',
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
    cursor: 'pointer'
  },
  field: {
    width: '100%',
    maxWidth: '400px',
    padding: '10px',
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
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(139,30,30,.12)",
    zIndex: 999
  }
}

function NotasDiscrepancias() {
  const navigate = useNavigate()
  
  const [discrepancias, setDiscrepancias] = useState([])
  const [loading, setLoading] = useState(false)
  const [busquedaFolio, setBusquedaFolio] = useState("")

  // ESTADOS DEL MODAL DE REVISIÓN
  const [modalAbierto, setModalAbierto] = useState(false)
  const [itemSeleccionado, setItemSeleccionado] = useState(null)
  const [tipoResolucion, setTipoResolucion] = useState('') // 'ROTO' o 'JUSTIFICADO'
  const [passwordAdmin, setPasswordAdmin] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [procesando, setProcesando] = useState(false)

  // Cargar notas con discrepancias desde el backend
  const cargarDiscrepancias = async () => {
    setLoading(true)
    setErrorMsg('')
    try {
      const res = await fetch(`${API}/api/notas-discrepancias`)
      const data = await res.json()
      if (data.success) {
        setDiscrepancias(Array.isArray(data.data) ? data.data : [])
      } else {
        setDiscrepancias([])
      }
    } catch (error) {
      console.error("Error al cargar discrepancias:", error)
      setDiscrepancias([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    cargarDiscrepancias()
  }, [])

  const abrirModal = (item) => {
    setItemSeleccionado(item)
    setTipoResolucion('')
    setPasswordAdmin('')
    setErrorMsg('')
    setSuccessMsg('')
    setModalAbierto(true)
  }

  const cerrarModal = () => {
    setModalAbierto(false)
    setItemSeleccionado(null)
  }

  // Enviar resolución conectada al endpoint de backend
  const handleResolver = async () => {
    setErrorMsg('')
    setSuccessMsg('')

    if (!tipoResolucion) {
      setErrorMsg('⚠️ Debe seleccionar obligatoriamente una opción (Roto o Justificado).')
      return
    }

    const esExceso = itemSeleccionado.cantidad_final > itemSeleccionado.cantidad_entregada

    if (esExceso && passwordAdmin !== 'ingemt2404_') {
      setErrorMsg('⚠️ Estos productos exceden la cantidad entregada. Debe corregirse desde la base de datos consulte con el programador')
      return
    }

    setProcesando(true)
    try {
      const res = await fetch(`${API}/api/notas-discrepancias/resolver`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          folio: itemSeleccionado.folio,
          tienda_cliente: itemSeleccionado.tienda_cliente,
          fecha_salida: itemSeleccionado.fecha_salida,
          producto: itemSeleccionado.producto,
          cantidad_entregada: itemSeleccionado.cantidad_entregada,
          cantidad_final: itemSeleccionado.cantidad_final,
          tipo_resolucion: tipoResolucion,
          password_admin: passwordAdmin
        })
      })

      const data = await res.json()

      if (!res.ok) {
        setErrorMsg(data.error || "Error al procesar la solicitud.")
        return
      }

      setSuccessMsg(data.message || "Procesado correctamente ✅")
      setTimeout(() => {
        cerrarModal()
        cargarDiscrepancias() // Recargar tabla automáticamente tras procesar
      }, 1500)

    } catch (error) {
      console.error("Error:", error)
      setErrorMsg("Error de conexión con el servidor.")
    } finally {
      setProcesando(false)
    }
  }

  const discrepanciasFiltradas = discrepancias.filter(item =>
    `${item.folio || ''} ${item.tienda_cliente || ''} ${item.producto || ''}`
      .toLowerCase()
      .includes(busquedaFolio.toLowerCase())
  )

  return (
    <div style={styles.page}>
      {/* BOTÓN VOLVER */}
      <button
        style={styles.backTop}
        onClick={() => navigate(-1)}
      >
        ⬅ Volver
      </button>
      
      {/* ENCABEZADO Y LOGO */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: -5,
          marginBottom: 25
        }}
      >
        <img
          src={logo}
          alt="Pegatek"
          style={{
            width: 140,
            objectFit: "contain",
            marginBottom: 6
          }}
        />

        <h1
          style={{
            margin: 0,
            color: "#8B1E1E",
            fontSize: "26px",
            fontWeight: "bold",
            letterSpacing: "1px",
            textAlign: "center"
          }}
        >
          NOTAS CON DIFERENCIAS (⚠️)
        </h1>
      </div>

      {/* BARRA DE ACCIÓN Y BÚSQUEDA */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
        <input
          placeholder="Buscar por folio, tienda o producto..."
          value={busquedaFolio}
          onChange={e => setBusquedaFolio(e.target.value)}
          style={{ ...styles.field, marginTop: 0 }}
        />
        <button
          onClick={cargarDiscrepancias}
          style={{ ...styles.botonAccion, marginTop: 0, backgroundColor: '#071849' }}
        >
          🔄 Actualizar / Recargar
        </button>
      </div>

      {/* LISTADO / SEMÁFORO DE ALERTAS */}
      {loading ? (
        <p style={{ textAlign: 'center', padding: '20px' }}>Cargando notas con discrepancias...</p>
      ) : discrepanciasFiltradas.length === 0 ? (
        <div style={{ padding: '20px', backgroundColor: '#d4edda', color: '#155724', borderRadius: '6px', textAlign: 'center', fontWeight: 'bold' }}>
          ✅ ¡Excelente! No hay notas con discrepancias pendientes por revisar.
        </div>
      ) : (
        discrepanciasFiltradas.map((item, index) => {
          const esExceso = item.cantidad_final > item.cantidad_entregada
          return (
            <div
              key={index}
              style={{
                ...styles.cardDiscrepancia,
                borderLeft: esExceso ? '6px solid #ffc107' : '6px solid #dc3545',
                backgroundColor: esExceso ? '#fff9c4' : '#ffe5e5'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '16px', color: '#071849' }}>
                    Folio: {item.folio} (Pedido #{item.id_pedido})
                  </div>
                  <div style={{ fontSize: '14px', color: '#333', marginTop: '4px' }}>
                    🏪 <strong>Tienda:</strong> {item.tienda_cliente || 'SIN TIENDA REGISTRADA'}
                  </div>
                  <div style={{ fontSize: '14px', color: '#333', marginTop: '4px' }}>
                    📦 <strong>Producto:</strong> {item.producto}
                  </div>
                  <div style={{ fontSize: '13px', color: '#666', marginTop: '4px' }}>
                    📅 <strong>Fecha Salida:</strong> {new Date(item.fecha_salida).toLocaleString('es-MX')}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '14px', fontWeight: 'bold' }}>
                    Embarcado: <span style={{ color: '#002B49' }}>{item.cantidad_entregada}</span> | Final: <span style={{ color: '#002B49' }}>{item.cantidad_final}</span>
                  </div>
                  <div style={{ marginTop: '5px', fontSize: '14px', fontWeight: 'bold', color: esExceso ? '#b78103' : '#a71d2a' }}>
                    {esExceso ? `⚠️ Sobran ${Math.abs(item.diferencia)}` : `❌ Faltan ${item.diferencia}`}
                  </div>
                  <button
                    onClick={() => abrirModal(item)}
                    style={styles.botonAccion}
                  >
                    🔍 Revisar
                  </button>
                </div>
              </div>
            </div>
          )
        })
      )}

      {/* MODAL DE REVISIÓN */}
      {modalAbierto && itemSeleccionado && (
        <div style={styles.overlay}>
          <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: '#fff',
            padding: '24px',
            borderRadius: '8px',
            width: '500px',
            maxWidth: '95%',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
            zIndex: 1000
          }}>
            <h2 style={{ color: '#8B1E1E', marginBottom: '15px', borderBottom: '2px solid #8B1E1E', paddingBottom: '8px', fontSize: '20px' }}>
              ⚙️ Revisar Discrepancia - Folio: {itemSeleccionado.folio}
            </h2>

            <div style={{ background: '#f8f9fa', padding: '12px', borderRadius: '6px', marginBottom: '15px', fontSize: '14px' }}>
              <p style={{ margin: '4px 0' }}><strong>Tienda:</strong> {itemSeleccionado.tienda_cliente || 'SIN TIENDA'}</p>
              <p style={{ margin: '4px 0' }}><strong>Producto:</strong> {itemSeleccionado.producto}</p>
              <p style={{ margin: '4px 0' }}><strong>Cantidad Embarcada:</strong> {itemSeleccionado.cantidad_entregada}</p>
              <p style={{ margin: '4px 0' }}><strong>Cantidad Final:</strong> {itemSeleccionado.cantidad_final}</p>
            </div>

            {/* CASO EXCESO (BLOQUEO + LLAVE MAESTRA) */}
            {itemSeleccionado.cantidad_final > itemSeleccionado.cantidad_entregada ? (
              <div style={{ marginBottom: '15px', padding: '12px', border: '1px solid #dc3545', borderRadius: '6px', backgroundColor: '#f8d7da' }}>
                <p style={{ color: '#721c24', fontSize: '13px', marginBottom: '8px', fontWeight: 'bold' }}>
                  ⚠️ Estos productos exceden la cantidad entregada. Debe corregirse desde la base de datos consulte con el programador
                </p>
                <label style={{ display: 'block', fontWeight: 'bold', fontSize: '12px', color: '#721c24' }}>
                  Llave Maestra / Contraseña de Administrador:
                </label>
                <input
                  type="password"
                  value={passwordAdmin}
                  onChange={e => setPasswordAdmin(e.target.value)}
                  placeholder="Introduce password..."
                  style={{ width: '100%', padding: '8px', marginTop: '5px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #dc3545' }}
                />
              </div>
            ) : (
              <div style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#e2f0cb', borderRadius: '6px', color: '#2b580c', fontSize: '13px', fontWeight: 'bold' }}>
                ℹ️ Diferencia detectada automáticamente: {itemSeleccionado.diferencia} bulto(s) faltantes (Cero captura manual).
              </div>
            )}

            <p style={{ fontWeight: 'bold', marginBottom: '8px', fontSize: '14px', color: '#071849' }}>
              Seleccione una opción obligatoria para procesar:
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
              <label style={{ cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="radio"
                  name="resolucion"
                  value="ROTO"
                  checked={tipoResolucion === 'ROTO'}
                  onChange={e => setTipoResolucion(e.target.value)}
                />
                🔴 <strong>Marcar como Roto</strong> (Mueve los datos automáticamente a la tabla de auditoría `rotos_devueltos`).
              </label>

              <label style={{ cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="radio"
                  name="resolucion"
                  value="JUSTIFICADO"
                  checked={tipoResolucion === 'JUSTIFICADO'}
                  onChange={e => setTipoResolucion(e.target.value)}
                />
                🟡 <strong>Marcar como Justificado</strong> (Archiva el movimiento y limpia la alerta principal).
              </label>
            </div>

            {errorMsg && <div style={{ color: 'red', marginBottom: '15px', fontSize: '13px', fontWeight: 'bold' }}>{errorMsg}</div>}
            {successMsg && <div style={{ color: 'green', marginBottom: '15px', fontSize: '13px', fontWeight: 'bold' }}>{successMsg}</div>}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                onClick={cerrarModal}
                disabled={procesando}
                style={{ padding: '8px 15px', backgroundColor: '#6c757d', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Cancelar
              </button>
              <button
                onClick={handleResolver}
                disabled={procesando}
                style={{ padding: '8px 15px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                {procesando ? 'Procesando...' : 'Confirmar y Procesar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default NotasDiscrepancias
