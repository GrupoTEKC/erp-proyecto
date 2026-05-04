import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import logo from '../assets/TRANSPARENTE.png'
import Buscador from "../components/Buscador"
import ProductosPedido from '../components/ProductosPedido'

const API = 'https://erp-proyecto-production.up.railway.app'

const styles = {
  page: { backgroundColor: '#ffffff', minHeight: '100vh', padding: '20px', fontFamily: 'Arial, sans-serif' },
  header: { marginBottom: '20px' },
  backButton: { display: 'inline-flex', alignItems: 'center', padding: '10px 14px', fontSize: '14px', backgroundColor: '#fff', color: '#8B1E1E', border: '1px solid #8B1E1E', borderRadius: '6px', cursor: 'pointer' },
  logo: { display: 'block', width: '100px', marginTop: '10px' },
  title: { marginTop: '20px', marginBottom: '15px', color: '#071849', fontWeight: 'bold' },
  section: { marginBottom: '15px' },
  label: { fontSize: '14px', marginBottom: '4px', display: 'block' },
  field: { width: '260px', padding: '8px 10px', fontSize: '14px', borderRadius: '6px', border: '1px solid #8B1E1E', boxSizing: 'border-box' },
  clienteTexto: { fontSize: '14px', marginBottom: '15px' },
  total: { marginTop: '15px', color: '#071849' },
  guardar: { marginTop: '10px', padding: '10px 16px', fontSize: '14px', backgroundColor: '#8B1E1E', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }
}

function Pedidos() {
  const [cliente, setCliente] = useState(null)
  const [tipoPedido, setTipoPedido] = useState('')
  const [diasCredito, setDiasCredito] = useState(0)
  const [total, setTotal] = useState(0)
  const [productos, setProductos] = useState([])
  const [catalogoProductos, setCatalogoProductos] = useState([])
  const [rutas, setRutas] = useState([])
  const [idRuta, setIdRuta] = useState('')
  const [vendedores, setVendedores] = useState([])
  const [idVendedor, setIdVendedor] = useState('')

  // ================= CARGAR CATÁLOGOS =================
  useEffect(() => {
  const cargarDatos = async () => {
    try {
      const [resRutas, resVendedores] = await Promise.all([
        fetch(`${API}/rutas`),
        fetch(`${API}/vendedores`)
      ])

      const rutasData = await resRutas.json()
      const vendedoresData = await resVendedores.json()

      setRutas(rutasData)
      setVendedores(vendedoresData)

    } catch (error) {
      console.error(error)
      alert('Error cargando datos')
    }
  }

  cargarDatos()
}, [])

  useEffect(() => {
  const cargarProductosCliente = async () => {
    if (!cliente) return

    try {
      const res = await fetch(
        `${API}/clientes/${cliente.id_cliente}/precios`
      )

      const data = await res.json()

      setCatalogoProductos(data)
      setProductos([])
      setTotal(0)

    } catch (error) {
      console.error(error)
      alert('Error cargando productos del cliente')
    }
  }

  cargarProductosCliente()
}, [cliente])

  // ================= GUARDAR PEDIDO =================
  const guardarPedido = async () => {
    if (!cliente || !tipoPedido || !idRuta || !idVendedor || productos.length === 0) {
      alert('Complete todos los campos obligatorios')
      return
    }

    // 🔥 ALINEADO AL BACKEND NUEVO
    const nuevoPedido = {
      id_cliente: cliente.id_cliente,
      id_vendedor: Number(idVendedor),
      id_ruta: Number(idRuta),
      tipo_pedido: tipoPedido,
      dias_credito: tipoPedido === 'credito' ? diasCredito : 0,

      productos: productos.map(p => ({
        id_producto: p.id_producto,
        cantidad: p.cantidad,
        precio: p.precio
      }))
    }

    try {
      const res = await fetch(`${API}/pedidos-completo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoPedido)
      })

      if (!res.ok) throw new Error('Error al guardar')

      const data = await res.json()

      alert(`✅ Pedido guardado (ID: ${data.id_pedido})`)

      // RESET (sin tocar diseño)
      setCliente(null)
      setTipoPedido('')
      setDiasCredito(0)
      setProductos([])
      setTotal(0)
      setIdRuta('')
      setIdVendedor('')

    } catch (err) {
      alert(`❌ ${err.message}`)
    }
  }

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
      <Buscador
      onSelectCliente={(c) => {
      setCliente(c)
      setIdRuta(c.id_ruta || '')
      }}
      />
      ) : (
        <>
          <p style={styles.clienteTexto}>
            <strong>Cliente:</strong> {cliente.nombre}
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
              disabled
              >
              <option value="">Seleccione ruta</option>
              {rutas.map(r => (
                <option key={r.id_ruta} value={r.id_ruta}>
                  {r.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* TIPO */}
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
                style={styles.field}
                value={diasCredito}
                onChange={e => setDiasCredito(Number(e.target.value))}
              />
            </div>
          )}

          {/* PRODUCTOS */}
        <ProductosPedido
        productosCatalogo={catalogoProductos}
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
