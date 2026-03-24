import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

const API = 'https://erp-proyecto-production.up.railway.app'

const styles = {
  container: { padding: 20 },
  title: { fontSize: 22, marginBottom: 20, color: '#071849' },
  card: {
    border: '1px solid #8B1E1E',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15
  },
  header: {
    marginBottom: 10,
    fontWeight: 'bold',
    color: '#8B1E1E'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: 10
  },
  th: {
    backgroundColor: '#8B1E1E',
    color: '#fff',
    padding: 8
  },
  td: {
    padding: 8,
    textAlign: 'center'
  },
  input: {
    width: '80px',
    padding: 5
  },
  back: {
    marginBottom: 15,
    cursor: 'pointer',
    color: '#8B1E1E'
  }
}

function ControlEnviosDetalle() {
  const { id_chofer } = useParams()
  const navigate = useNavigate()
  const [pedidos, setPedidos] = useState([])

  useEffect(() => {
    const cargarPedidos = async () => {
      try {
        const res = await fetch(`${API}/control-envios/${id_chofer}`)
        const data = await res.json()

        // 🔥 inicialización sin romper nada + folio y pin por pedido
        const inicializados = data.map(p => ({
          ...p,
          folio: '',
          pin: '',
          productos: p.productos.map(prod => ({
            ...prod,
            tipo: 'ninguno',
            motivo: '',
            accion: 'ninguna',
            comentario: '',
            id_cliente_destino: null
          }))
        }))

        setPedidos(inicializados)
      } catch (err) {
        console.error(err)
      }
    }

    cargarPedidos()
  }, [id_chofer])

  const actualizarCantidad = (pIndex, dIndex, value) => {
    const copia = [...pedidos]
    copia[pIndex].productos[dIndex].cantidad_entregada = Number(value)
    setPedidos(copia)
  }

  const actualizarCampo = (pIndex, dIndex, campo, valor) => {
    const copia = [...pedidos]
    copia[pIndex].productos[dIndex][campo] = valor
    setPedidos(copia)
  }

  // 🔥 actualizar folio / pin por pedido
  const actualizarPedido = (index, campo, valor) => {
    const copia = [...pedidos]
    copia[index][campo] = valor
    setPedidos(copia)
  }

  const finalizarEntrega = async (pedido) => {
    try {
      // 🔴 folio obligatorio por pedido
      if (!pedido.folio.trim()) {
        alert('Folio obligatorio')
        return
      }

      // 🔴 validar PIN si hay cancelados
      const hayCancelado = pedido.productos.some(
        p => p.accion === 'cancelado'
      )

      if (hayCancelado && !pedido.pin.trim()) {
        alert('PIN obligatorio para cancelaciones')
        return
      }

      const res = await fetch(`${API}/control-envios/finalizar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_entrega: pedido.id_entrega,
          folio: pedido.folio,
          pin: pedido.pin,
          productos: pedido.productos
        })
      })

      const data = await res.json()

      if (!res.ok) {
        alert(data.error)
        return
      }

      alert('Entrega finalizada')
      navigate(-1)

    } catch (err) {
      console.error(err)
      alert('Error al finalizar')
    }
  }

  return (
    <div style={styles.container}>

      <div style={styles.back} onClick={() => navigate(-1)}>
        ⬅ Volver
      </div>

      <h2 style={styles.title}>Pedidos del chofer</h2>

      {pedidos.map((p, i) => (
        <div key={i} style={styles.card}>

          <div style={styles.header}>
            Cliente: {p.cliente} | Tienda: {p.tienda}
            <br />
            Ruta: {p.ruta} | Fecha salida: {p.fecha_salida}
          </div>

          {/* 🔥 FOLIO + PIN POR PEDIDO */}
          <div style={{ marginBottom: 10 }}>
            <input
              placeholder="Folio"
              value={p.folio}
              onChange={e => actualizarPedido(i, 'folio', e.target.value)}
              style={{ padding: 6, marginRight: 10 }}
            />

            <input
              placeholder="PIN (solo cancelación)"
              value={p.pin}
              onChange={e => actualizarPedido(i, 'pin', e.target.value)}
              style={{ padding: 6 }}
            />
          </div>

          <table style={styles.table} border="1">
            <thead>
              <tr>
                <th style={styles.th}>Producto</th>
                <th style={styles.th}>Embarcado</th>
                <th style={styles.th}>Entregado</th>
                <th style={styles.th}>Tipo</th>
                <th style={styles.th}>Motivo</th>
                <th style={styles.th}>Acción</th>
                <th style={styles.th}>Comentario</th>
              </tr>
            </thead>

            <tbody>
              {p.productos.map((prod, j) => {
                const diferencia =
                  prod.cantidad_entregada - prod.cantidad_pedida

                return (
                  <tr key={j}>
                    <td style={styles.td}>{prod.nombre}</td>
                    <td style={styles.td}>{prod.cantidad_pedida}</td>

                    <td style={styles.td}>
                      <input
                        style={styles.input}
                        type="number"
                        value={prod.cantidad_entregada}
                        onChange={e =>
                          actualizarCantidad(i, j, e.target.value)
                        }
                      />
                    </td>

                    {diferencia !== 0 ? (
                      <>
                        <td style={styles.td}>
                          <select
                            value={prod.tipo}
                            onChange={e =>
                              actualizarCampo(i, j, 'tipo', e.target.value)
                            }
                          >
                            <option value="ninguno">--</option>
                            <option value="faltante">Faltante</option>
                            <option value="roto">Roto</option>
                          </select>
                        </td>

                        <td style={styles.td}>
                          <select
                            value={prod.motivo}
                            onChange={e =>
                              actualizarCampo(i, j, 'motivo', e.target.value)
                            }
                          >
                            <option value="">--</option>
                            <option value="error">Error</option>
                            <option value="prestado">Prestado</option>
                            <option value="dañado">Dañado</option>
                          </select>
                        </td>

                        <td style={styles.td}>
                          <select
                            value={prod.accion}
                            onChange={e =>
                              actualizarCampo(i, j, 'accion', e.target.value)
                            }
                          >
                            <option value="ninguna">--</option>
                            <option value="pendiente">Confirmar</option>
                            <option value="cancelado">Cancelar</option>
                          </select>
                        </td>

                        <td style={styles.td}>
                          <input
                            placeholder="Comentario"
                            value={prod.comentario}
                            onChange={e =>
                              actualizarCampo(i, j, 'comentario', e.target.value)
                            }
                          />
                        </td>
                      </>
                    ) : (
                      <td colSpan="4">OK</td>
                    )}
                  </tr>
                )
              })}
            </tbody>
          </table>

          <button
            onClick={() => finalizarEntrega(p)}
            style={{
              marginTop: 10,
              backgroundColor: '#8B1E1E',
              color: '#fff',
              padding: 10,
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Finalizar entrega
          </button>
        </div>
      ))}
    </div>
  )
}

export default ControlEnviosDetalle
