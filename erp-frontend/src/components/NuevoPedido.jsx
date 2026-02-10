 import { useState } from 'react'
import Buscador from './Buscador'
import ProductosPedido from './ProductosPedido'

function NuevoPedido() {
  const [folio, setFolio] = useState('')
  const [cliente, setCliente] = useState(null)
  const [productos, setProductos] = useState([])
  const [total, setTotal] = useState(0)

  const [tipoPedido, setTipoPedido] = useState('contado')
  const [diasCredito, setDiasCredito] = useState(0)

  const guardarPedido = () => {
    if (!/^\d{4}$/.test(folio)) {
      alert('El folio debe tener exactamente 4 números')
      return
    }

    if (!cliente || productos.length === 0) {
      alert('Faltan datos')
      return
    }

    if (tipoPedido === 'credito' && (diasCredito < 1 || diasCredito > 30)) {
      alert('Los días de crédito deben ser entre 1 y 30')
      return
    }

    fetch('http://localhost:3001/pedidos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        folio,
        id_cliente: cliente.id_cliente,
        fecha: new Date().toISOString().slice(0, 10),
        total,
        tipo_pedido: tipoPedido,
        dias_credito: tipoPedido === 'credito' ? diasCredito : 0,
        productos
      })
    })
      .then(res => res.json())
      .then(() => {
        alert('Pedido guardado')
        setFolio('')
        setProductos([])
        setTotal(0)
        setTipoPedido('contado')
        setDiasCredito(0)
      })
      .catch(() => alert('Error al guardar'))
  }

  return (
    <div>
      <h2>Nuevo Pedido</h2>

      <label>
        Folio (4 dígitos):
        <input
          type="text"
          value={folio}
          maxLength={4}
          onChange={e => /^\d*$/.test(e.target.value) && setFolio(e.target.value)}
        />
      </label>

      <br /><br />

      <Buscador onSelectCliente={setCliente} />
      {cliente && <p>Cliente: {cliente.nombre}</p>}

      <ProductosPedido
        onTotalChange={setTotal}
        onProductosChange={setProductos}
      />

      <h3>Total: ${total}</h3>

      <h3>Tipo de pedido</h3>

      <label>
        <input
          type="radio"
          checked={tipoPedido === 'contado'}
          onChange={() => {
            setTipoPedido('contado')
            setDiasCredito(0)
          }}
        />
        Contado
      </label>

      <label style={{ marginLeft: '20px' }}>
        <input
          type="radio"
          checked={tipoPedido === 'credito'}
          onChange={() => setTipoPedido('credito')}
        />
        Crédito
      </label>

      {tipoPedido === 'credito' && (
        <div style={{ marginTop: '10px' }}>
          <label>
            Días de crédito (máx 30):
            <input
              type="number"
              min="1"
              max="30"
              value={diasCredito}
              onChange={e => setDiasCredito(Number(e.target.value))}
            />
          </label>
        </div>
      )}

      <br />

      <button onClick={guardarPedido}>Guardar Pedido</button>
    </div>
  )
}

export default NuevoPedido
