import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import logo from '../assets/TRANSPARENTE.png'
import Buscador from "../components/Buscador"
import ProductosPedido from '../components/ProductosPedido'

// ✅ URL DEL BACKEND
const API = import.meta.env.VITE_API_URL

// =========================
// 🎨 ESTILOS
// =========================
const styles = {
  page: {
    backgroundColor: '#ffffff',
    minHeight: '100vh',
    padding: '20px',
    fontFamily: 'Arial, sans-serif'
  },
  header: { marginBottom: '20px' },
  backButton: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '10px 14px',
    fontSize: '14px',
    backgroundColor: '#fff',
    color: '#8B1E1E',
    border: '1px solid #8B1E1E',
    borderRadius: '6px',
    cursor: 'pointer'
  },
  logo: {
    display: 'block',
    width: '100px',
    marginTop: '10px'
  },
  title: {
    marginTop: '20px',
    marginBottom: '15px',
    color: '#071849',
    fontWeight: 'bold'
  },
  section: { marginBottom: '15px' },
  label: {
    fontSize: '14px',
    marginBottom: '4px',
    display: 'block'
  },
  field: {
    width: '260px',
    padding: '8px 10px',
    fontSize: '14px',
    borderRadius: '6px',
    border: '1px solid #8B1E1E',
    boxSizing: 'border-box'
  },
  clienteTexto: {
    fontSize: '14px',
    marginBottom: '15px'
  },
  total: {
    marginTop: '15px',
    color: '#071849'
  },
  guardar: {
    marginTop: '10px',
    padding: '10px 16px',
    fontSize: '14px',
    backgroundColor: '#8B1E1E',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer'
  }
}

// =========================
// 📋 COMPONENTE
// =========================
function Pedidos() {
  const [cliente, setCliente] = useState(null)
  const [fecha, setFecha] = useState('')
  const [tipoPedido, setTipoPedido] = useState('')
  const [diasCredito, setDiasCredito] = useState(0)
  const [total, setTotal] = useState(0)
  const [productos, setProductos] = useState([])
  const [rutas, setRutas] = useState([])
  const [idRuta, setIdRuta] = useState('')
  const [vendedores, setVendedores] = useState([])
  const [idVendedor, setIdVendedor] = useState('')

  // =========================
  // 🔄 CARGAR DATOS INICIALES
  // =========================
  useEffect(() => {
    if (!API) {
      console.error('❌ API no definida')
      return
    }
    const cargarDatos = async () => {
      try {
        const [resRutas, resVendedores] = await Promise.all([
          fetch(`${API}/rutas`),
          fetch(`${API}/vendedores`)
        ])
        const rutasData = await resRutas.json()
        const vendedoresData = await resVendedores.json()
        setRutas(Array.isArray(rutasData) ? rutasData : [])
        setVendedores(Array.isArray(vendedoresData) ? vendedoresData : [])
      } catch (error) {
        console.error('Error cargando datos:', error)
      }
    }
    cargarDatos()
  }, [])

  // =========================
  // 💾 GUARDAR PEDIDO
  // =========================
  const guardarPedido = async () => {
    if (!cliente || !fecha || !tipoPedido || productos.length === 0) {
      alert('Todos los campos son obligatorios')
      return
    }
    if (!idVendedor || !idRuta) {
      alert('Seleccione vendedor y ruta')
      return
    }
    if (tipoPedido === 'credito' && diasCredito > 31) {
      alert('El crédito máximo es de 31 días')
      return
    }

    // ✅ CORRECCIÓN: Se añade el campo 'estado' para que el botón de entregar funcione
    const pedido = {
      id_cliente: cliente.id_cliente,
      id_vendedor: idVendedor,
      id_ruta: idRuta,
      fecha,
      total,
      tipo_pedido: tipoPedido,
      dias_credito: tipoPedido === 'credito' ? diasCredito : 0,
      productos,
      estado: 'pendiente' 
    }

    try {
      const res = await fetch(`${API}/pedidos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pedido)
      })
      if (!res.ok) throw new Error()
      alert('✅ Pedido guardado correctamente')
      
      // RESET
      setCliente(null)
      setFecha('')
      setTipoPedido('')
      setDiasCredito(0)
      setProductos([])
      setTotal(0)
      setIdVendedor('')
      setIdRuta('')
    } catch {
      alert('❌ Error al guardar pedido')
    }
  }

  // =========================
  // 🧩 UI
  // =========================
  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <Link to="/">
          <button style={styles.backButton}>⬅ Volver al menú</button>
        </Link>
        <img src={logo} alt="Logo" style={styles.logo} />
      </div>

      <h2 style={styles.title}>NUEVO PEDIDO</h2>

      {!cliente ? (
        <Buscador onSelectCliente={setCliente} />
      ) : (
        <>
          <p style={styles.clienteTexto}>
            Cliente: {cliente.nombre}
          </p>

          {/* VENDEDOR */}
          <div style={styles.section}>
            <label style={styles.label}>Vendedor</label>
            <select
              style={styles.field}
              value={idVendedor}
              onChange={e => setIdVendedor(e.target.value)}
            >
              <option value="">Seleccione vendedor</option>
              {vendedores.map(v => (
                <option key={v.id_vendedor} value={v.id_vendedor}>
                  {v.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* RUTA */}
          <div style={styles.section}>
            <label style={styles.label}>Ruta</label>
            <select
              style={styles.field}
              value={idRuta}
              onChange={e => setIdRuta(e.target.value)}
            >
              <option value="">Seleccione ruta</option>
              {rutas.map(r => (
                <option key={r.id_ruta} value={r.id_ruta}>
                  {r.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* FECHA */}
          <div style={styles.section}>
            <label style={styles.label}>Fecha</label>
            <input
              type="date"
              style={styles.field}
              value={fecha}
              onChange={e => setFecha(e.target.value)}
            />
          </div>

          {/* TIPO PEDIDO */}
          <div style={styles.section}>
            <label style={styles.label}>Tipo de pedido</label>
            <select
              style={styles.field}
              value={tipoPedido}
              onChange={e => setTipoPedido(e.target.value)}
            >
              <option value="">Seleccione</option>
              <option value="contado">Contado</option>
              <option value="credito">Crédito</option>
            </select>
          </div>

          {/* CRÉDITO */}
          {tipoPedido === 'credito' && (
            <div style={styles.section}>
              <label style={styles.label}>Días de crédito</label>
              <input
                type="number"
                min="1"
                max="31"
                style={styles.field}
                value={diasCredito}
                onChange={e => setDiasCredito(Number(e.target.value))}
              />
            </div>
          )}

          {/* PRODUCTOS */}
          <ProductosPedido
            onTotalChange={setTotal}
            onProductosChange={setProductos}
          />

          <h3 style={styles.total}>Total: ${total}</h3>

          <button style={styles.guardar} onClick={guardarPedido}>
            Guardar Pedido
          </button>
        </>
      )}
    </div>
  )
}

export default Pedidos
