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
  const [modalPreview, setModalPreview] = useState(false)
  const [guardandoPedido, setGuardandoPedido] = useState(false)
  const [pedidoGuardado, setPedidoGuardado] = useState(null)
  const [pedidoYaGuardado, setPedidoYaGuardado] = useState(false)
  
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

  
//*********** Nueva actualizacion pro jiji ************************//
const abrirVistaPrevia = () => {

  const productosValidos = productos.filter(
    p => Number(p.cantidad) > 0
  )

  if (
    !cliente ||
    !tipoPedido ||
    !idRuta ||
    !idVendedor ||
    productosValidos.length === 0
  ) {
    alert('Complete todos los campos obligatorios')
    return
  }

  setModalPreview(true)
}
  
  // ================= GUARDAR PEDIDO =================
const guardarPedido = async () => {

    if (pedidoYaGuardado) {
  alert(
    `⚠️ Este pedido ya fue guardado con el folio #${pedidoGuardado}`
  )
  return
}
    if (guardandoPedido) return

  setGuardandoPedido(true)

  const productosValidos = productos.filter(
    p => Number(p.cantidad) > 0
  )
  
  if (
    !cliente ||
    !tipoPedido ||
    !idRuta ||
    !idVendedor ||
    productosValidos.length === 0
  ) {
    
    setGuardandoPedido(false)
    alert('Complete todos los campos obligatorios')
    return
  }

  const nuevoPedido = {
    id_cliente: cliente.id_cliente,
    id_vendedor: Number(idVendedor),
    id_ruta: Number(idRuta),
    tipo_pedido: tipoPedido,
    dias_credito: tipoPedido === 'credito' ? diasCredito : 0,
    productos: productosValidos.map(p => ({
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

    setPedidoGuardado(data.id_pedido)
    setPedidoYaGuardado(true)
    setGuardandoPedido(false)

    } catch (err) {

    setGuardandoPedido(false)

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
         <div style={styles.clienteTexto}>
         <p style={{ margin: 0 }}>
         <strong>Cliente:</strong> {cliente.nombre}
         </p>

         <p style={{ margin: '4px 0 0 0' }}>
         <strong>Tienda:</strong> {cliente.nombre_tienda || cliente.tienda || ''}
         </p>

          <p style={{ margin: '4px 0 0 0' }}>
          <strong>Ruta:</strong>{' '}
          {rutas.find(r => r.id_ruta === Number(idRuta))?.nombre || ''}
          </p>
          </div>

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

        <button
        style={styles.guardar}
        onClick={abrirVistaPrevia}
        >
        Procesar Pedido
        </button>

          {modalPreview && (
  <div
    style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999
    }}
  >
    <div
      style={{
        background: '#fff',
        padding: 20,
        borderRadius: 10,
        width: 500,
        maxHeight: '80vh',
        overflowY: 'auto'
      }}
    >
      <img
        src={logo}
        alt=""
        style={{ width: 120 }}
      />

      <h3 style={{ textAlign: 'center' }}>
      CONFIRMACIÓN DE PEDIDO
      </h3>

      <p>
        <strong>Cliente:</strong> {cliente.nombre}
      </p>

      <p>
      <strong>Vendedor:</strong>{' '}
      {vendedores.find(
      v => v.id_vendedor === Number(idVendedor)
      )?.nombre}
      </p>

      <p>
      <strong>Fecha:</strong>{' '}
      {new Date().toLocaleDateString('es-MX')}
      </p>
      
      <p>
        <strong>Tipo:</strong> {tipoPedido}
      </p>

      <p>
        <strong>Total:</strong> ${total}
      </p>

      <hr />

   <table
  style={{
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: 10
  }}
>
  <thead>
    <tr>
      <th style={{ border: '1px solid #ddd', padding: 8 }}>
        Producto
      </th>
      <th style={{ border: '1px solid #ddd', padding: 8 }}>
        Cantidad
      </th>
      <th style={{ border: '1px solid #ddd', padding: 8 }}>
        Precio
      </th>
      <th style={{ border: '1px solid #ddd', padding: 8 }}>
        Importe
      </th>
    </tr>
  </thead>

  <tbody>
    {productos
      .filter(p => Number(p.cantidad) > 0)
      .map(p => (
        <tr key={p.id_producto}>
          <td style={{ border: '1px solid #ddd', padding: 8 }}>
            {p.nombre}
          </td>

          <td
            style={{
              border: '1px solid #ddd',
              padding: 8,
              textAlign: 'center'
            }}
          >
            {p.cantidad}
          </td>

          <td
            style={{
              border: '1px solid #ddd',
              padding: 8,
              textAlign: 'right'
            }}
          >
            ${Number(p.precio).toFixed(2)}
          </td>

          <td
            style={{
              border: '1px solid #ddd',
              padding: 8,
              textAlign: 'right'
            }}
          >
            $
            {(
              Number(p.cantidad) *
              Number(p.precio)
            ).toFixed(2)}
          </td>
        </tr>
      ))}
  </tbody>
</table>       

      <h3
       style={{
       textAlign: 'right',
       marginTop: 15,
       color: '#071849'
      }}
     >
      Total: ${Number(total).toFixed(2)}
      </h3>
      
      {guardandoPedido && (
      <div
      style={{
      marginTop: 15,
      marginBottom: 15,
      color: '#8B1E1E',
      fontWeight: 'bold',
      textAlign: 'center'
      }}
     >
      ⏳ Guardando pedido...
      <br />
      No cierres esta ventana.
      </div>
     )}

    {pedidoYaGuardado ? (
  <div
    style={{
      background: '#D4EDDA',
      color: '#155724',
      padding: 15,
      borderRadius: 6,
      marginTop: 15,
      textAlign: 'center'
    }}
  >
    <h3>✅ PEDIDO GUARDADO</h3>

    <p>
      Pedido #{pedidoGuardado} ha sido guardado correctamente.
    </p>
  </div>
) : (
  <div
    style={{
      background: '#FFF3CD',
      color: '#856404',
      padding: 10,
      borderRadius: 6,
      marginTop: 15
    }}
  >
    ⚠️ Verifique que su pedido sea correcto antes de guardarlo.
  </div>
)}
        
      
     <div
    style={{
    marginTop: 20,
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 10
      }}
     >
        
     <button
     disabled={guardandoPedido}
     onClick={() => setModalPreview(false)}
     style={{
     padding: '10px 16px',
     background: pedidoYaGuardado ? '#28A745' : '#6c757d',
     color: '#fff',
     border: 'none',
     borderRadius: 6,
     cursor: 'pointer'
    }}
    >
    {pedidoYaGuardado ? 'Aceptar' : 'Cerrar'}
    </button>

   {!pedidoYaGuardado && (
  <button
    disabled={guardandoPedido}
    onClick={guardarPedido}
    style={{
      padding: '10px 16px',
      background: '#8B1E1E',
      color: '#fff',
      border: 'none',
      borderRadius: 6,
      cursor: 'pointer'
    }}
  >
    {guardandoPedido
      ? 'Guardando pedido...'
      : 'Guardar Pedido'}
  </button>
)}
       
       </div>
      </div>
    </div>
        )}
        </>
        )}
    </div>
  )
}

export default Pedidos
