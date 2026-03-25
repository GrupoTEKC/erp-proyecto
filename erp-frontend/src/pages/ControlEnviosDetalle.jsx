import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

const API = 'https://erp-proyecto-production.up.railway.app'

function ControlEnviosDetalle() {
  const { id_chofer } = useParams()
  const navigate = useNavigate()

  const [pedidos, setPedidos] = useState([])
  const [clientes, setClientes] = useState([])
  const [busquedas, setBusquedas] = useState({})

  useEffect(() => {
    const cargarPedidos = async () => {
      const res = await fetch(`${API}/control-envios/${id_chofer}`)
      const data = await res.json()

      const inicializados = data.map(p => ({
        ...p,
        folio: '',
        productos: p.productos.map(prod => ({
          ...prod,
          cantidad_entregada: '',
          tipo: '',
          motivo: '',
          id_cliente_destino: null
        }))
      }))

      setPedidos(inicializados)
    }

    cargarPedidos()
  }, [id_chofer])

  const actualizarCampo = (pIndex, dIndex, campo, valor) => {
    const copia = [...pedidos]
    copia[pIndex].productos[dIndex][campo] = valor
    setPedidos(copia)
  }

  const actualizarFolio = (pIndex, value) => {
    const copia = [...pedidos]
    copia[pIndex].folio = value
    setPedidos(copia)
  }

  const buscarClientes = async (texto, pIndex, dIndex) => {
    const key = `${pIndex}-${dIndex}`

    setBusquedas(prev => ({ ...prev, [key]: texto }))

    if (!texto) {
      setClientes([])
      return
    }

    const res = await fetch(`${API}/clientes?search=${texto}`)
    const data = await res.json()
    setClientes(data)
  }

  const validarPedido = (pedido) => {
    for (let prod of pedido.productos) {

      if (prod.cantidad_entregada === '') {
        return 'Falta cantidad entregada'
      }

      const diferencia =
        Number(prod.cantidad_entregada) - prod.cantidad_pedida

      if (diferencia !== 0) {

        if (!prod.tipo) return 'Falta tipo'

        if (prod.tipo === 'roto' && !prod.motivo) {
          return 'Falta motivo de roto'
        }

        if (prod.tipo === 'prestamo' && !prod.id_cliente_destino) {
          return 'Falta cliente destino'
        }
      }
    }

    return null
  }

  const finalizarEntrega = async (pedido) => {

    const error = validarPedido(pedido)

    if (error) {
      alert(error)
      return
    }

    if (!pedido.folio.trim()) {
      alert('Folio obligatorio')
      return
    }

    const res = await fetch(`${API}/control-envios/finalizar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id_entrega: pedido.id_entrega,
        folio: pedido.folio,
        productos: pedido.productos.map(p => ({
          ...p,
          cantidad_entregada: Number(p.cantidad_entregada)
        }))
      })
    })

    const data = await res.json()

    if (!res.ok) {
      alert(data.error)
      return
    }

    alert('Entrega finalizada')
    navigate(-1)
  }

  return (
    <div style={{ padding: 20 }}>

      <h2>Pedidos del chofer</h2>

      {pedidos.map((p, i) => (
        <div key={i} style={{ marginBottom: 30, border: '1px solid #ccc', padding: 15 }}>

          <div>
            Cliente: {p.cliente} | Tienda: {p.tienda}
            <br />
            Ruta: {p.ruta}
          </div>

          <input
            placeholder="Folio"
            value={p.folio}
            onChange={e => actualizarFolio(i, e.target.value)}
          />

          <table border="1" width="100%">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Embarcado</th>
                <th>Entregado</th>
                <th>Tipo</th>
                <th>Detalle</th>
              </tr>
            </thead>

            <tbody>
              {p.productos.map((prod, j) => {
                const diferencia =
                  Number(prod.cantidad_entregada || 0) - prod.cantidad_pedida

                return (
                  <tr key={j}>
                    <td>{prod.nombre}</td>
                    <td>{prod.cantidad_pedida}</td>

                    <td>
                      <input
                        type="number"
                        value={prod.cantidad_entregada}
                        onChange={e =>
                          actualizarCampo(i, j, 'cantidad_entregada', e.target.value)
                        }
                      />
                    </td>

                    {diferencia !== 0 ? (
                      <>
                        <td>
                          <select
                            value={prod.tipo}
                            onChange={e =>
                              actualizarCampo(i, j, 'tipo', e.target.value)
                            }
                          >
                            <option value="">--</option>
                            <option value="prestamo">Préstamo</option>
                            <option value="roto">Roto</option>
                          </select>
                        </td>

                        <td>

                          {prod.tipo === 'roto' && (
                            <input
                              placeholder="Motivo"
                              value={prod.motivo}
                              onChange={e =>
                                actualizarCampo(i, j, 'motivo', e.target.value)
                              }
                            />
                          )}

                          {prod.tipo === 'prestamo' && (
                            <>
                              <input
                                placeholder="Buscar cliente"
                                value={busquedas[`${i}-${j}`] || ''}
                                onChange={e =>
                                  buscarClientes(e.target.value, i, j)
                                }
                              />

                              {clientes.map(c => (
                                <div
                                  key={c.id_cliente}
                                  onClick={() => {
                                    actualizarCampo(i, j, 'id_cliente_destino', c.id_cliente)
                                    setBusquedas(prev => ({
                                      ...prev,
                                      [`${i}-${j}`]: `${c.nombre} - ${c.nombre_tienda}`
                                    }))
                                    setClientes([])
                                  }}
                                  style={{ cursor: 'pointer', background: '#eee' }}
                                >
                                  {c.nombre} - {c.nombre_tienda}
                                </div>
                              ))}
                            </>
                          )}

                        </td>
                      </>
                    ) : (
                      <td colSpan="2">OK</td>
                    )}
                  </tr>
                )
              })}
            </tbody>
          </table>

          <button onClick={() => finalizarEntrega(p)}>
            Finalizar entrega
          </button>

        </div>
      ))}

    </div>
  )
}

export default ControlEnviosDetalle
