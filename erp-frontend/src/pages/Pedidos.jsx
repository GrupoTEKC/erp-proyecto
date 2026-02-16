import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import logo from '../assets/TRANSPARENTE.png'
import Buscador from "../components/Buscador"
import ProductosPedido from '../components/ProductosPedido'

const API = import.meta.env.VITE_API_URL

const styles = {
  page: { backgroundColor: '#fff', minHeight: '100vh', padding: '20px' },
  guardar: {
    marginTop: '15px',
    padding: '12px 18px',
    fontSize: '15px',
    backgroundColor: '#8B1E1E',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer'
  }
}

function Pedidos() {

  const [cliente, setCliente] = useState(null)
  const [fecha, setFecha] = useState('')
  const [tipoPedido, setTipoPedido] = useState('')
  const [diasCredito, setDiasCredito] = useState(0)
  const [productos, setProductos] = useState([])
  const [total, setTotal] = useState(0)

  const [rutas, setRutas] = useState([])
  const [idRuta, setIdRuta] = useState('')

  const [vendedores, setVendedores] = useState([])
  const [idVendedor, setIdVendedor] = useState('')

  const [guardando, setGuardando] = useState(false)

  // =========================
  // CARGAR DATOS
  // =========================
  useEffect(() => {

    const cargar = async () => {
      try {
        const [rutasRes, vendRes] = await Promise.all([
          fetch(`${API}/rutas`),
          fetch(`${API}/vendedores`)
        ])

        setRutas(await rutasRes.json())
        setVendedores(await vendRes.json())

      } catch (err) {
        console.error('Error cargando datos', err)
      }
    }

    cargar()

  }, [])

  // =========================
  // GUARDAR PEDIDO
  // =========================
  const guardarPedido = async () => {

    if (!cliente || !fecha || !tipoPedido || !productos.length)
      return alert('Complete todos los campos')

    if (!idVendedor || !idRuta)
      return alert('Seleccione vendedor y ruta')

    if (tipoPedido === 'credito' && diasCredito > 31)
      return alert('Máximo 31 días')

    const pedido = {
      id_cliente: cliente.id_cliente,
      id_vendedor: idVendedor,
      id_ruta: idRuta,
      fecha,
      total,
      tipo_pedido: tipoPedido,
      dias_credito: tipoPedido === 'credito' ? diasCredito : 0,
      productos
    }

    try {

      setGuardando(true)

      const res = await fetch(`${API}/pedidos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pedido)
      })

      if (!res.ok) throw new Error()

      alert('✅ Pedido guardado')

      // reset
      setCliente(null)
      setFecha('')
      setTipoPedido('')
      setDiasCredito(0)
      setProductos([])
      setTotal(0)
      setIdVendedor('')
      setIdRuta('')

    } catch (err) {

      alert('❌ Error al guardar pedido')

    } finally {

      setGuardando(false)

    }

  }

  // =========================
  // UI
  // =========================
  return (

    <div style={styles.page}>

      <Link to="/">⬅ Volver</Link>
      <img src={logo} width={100} />

      <h2>Nuevo Pedido</h2>

      {!cliente ? (

        <Buscador onSelectCliente={setCliente} />

      ) : (

        <>

          <p>Cliente: {cliente.nombre}</p>

          <select value={idVendedor} onChange={e => setIdVendedor(e.target.value)}>
            <option value="">Vendedor</option>
            {vendedores.map(v =>
              <option key={v.id_vendedor} value={v.id_vendedor}>
                {v.nombre}
              </option>
            )}
          </select>

          <select value={idRuta} onChange={e => setIdRuta(e.target.value)}>
            <option value="">Ruta</option>
            {rutas.map(r =>
              <option key={r.id_ruta} value={r.id_ruta}>
                {r.nombre}
              </option>
            )}
          </select>

          <input
            type="date"
            value={fecha}
            onChange={e => setFecha(e.target.value)}
          />

          <select
            value={tipoPedido}
            onChange={e => setTipoPedido(e.target.value)}
          >
            <option value="">Tipo</option>
            <option value="contado">Contado</option>
            <option value="credito">Crédito</option>
          </select>

          {tipoPedido === 'credito' && (

            <input
              type="number"
              placeholder="Días crédito"
              value={diasCredito}
              onChange={e => setDiasCredito(e.target.value)}
            />

          )}

          <ProductosPedido
            onProductosChange={setProductos}
            onTotalChange={setTotal}
          />

          <h3>Total: ${total}</h3>

          <button
            style={styles.guardar}
            onClick={guardarPedido}
            disabled={guardando}
          >
            {guardando ? 'Guardando...' : 'Guardar Pedido'}
          </button>

        </>

      )}

    </div>

  )
}

export default Pedidos
