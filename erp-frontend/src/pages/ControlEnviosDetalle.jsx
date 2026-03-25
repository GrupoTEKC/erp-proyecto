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

        const inicializados = data.map(p => ({
          ...p,
          folio: '',
          productos: p.productos.map(prod => ({
            ...prod,
            cantidad_entregada: '', // 🔥 vacío obligatorio
            tipo: '',
            motivo: '',
            accion: '',
            cliente_destino: ''
          }))
        }))

        setPedidos(inicializados)
      } catch (err) {
        console.error(err)
      }
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

  const validarPedido = (pedido) => {
    for (let prod of pedido.productos) {
      // ❗ cantidad obligatoria
      if (prod.cantidad_entregada === '' || prod.cantidad_entregada === null) {
        return 'Falta cantidad entregada'
      }

      const diferencia =
        Number(prod.cantidad_entregada) - Number(prod.cantidad_pedida)

      if (diferencia !== 0) {
        // ❗ tipo obligatorio
        if (!prod.tipo) return 'Falta tipo'

        if (prod.tipo === 'prestamo') {
          if (!prod.cliente_destino) {
            return 'Falta cliente destino en préstamo'
          }
        }

        if (prod.tipo === 'roto') {
          if (!prod.motivo) {
            return 'Falta motivo de roto'
          }
        }

        if (!prod.accion) {
          return 'Falta confirmar o cancelar'
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

    try {
      const res = await fetch(`${API}/control-envios/finalizar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_entrega: pedido.id_entrega,
          folio: pedido.folio,
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

          {/* 🔥 FOLIO POR PEDIDO */}
          <input
            placeholder="Folio"
            value={p.folio}
            onChange={e => actualizarFolio(i, e.target.value)}
            style={{ padding: 8, marginBottom: 10 }}
          />

          <table style={styles.table} border="1">
            <thead>
              <tr>
                <th style={styles.th}>Producto</th>
                <th style={styles.th}>Embarcado</th>
                <th style={styles.th}>Entregado</th>
                <th style={styles.th}>Tipo</th>
                <th style={styles.th}>Detalle</th>
                <th style={styles.th}>Acción</th>
              </tr>
            </thead>

            <tbody>
              {p.productos.map((prod, j) => {
                const diferencia =
                  Number(prod.cantidad_entregada || 0) - Number(prod.cantidad_pedida)

                return (
                  <tr key={j}>
                    <td style={styles.td}>{prod.nombre}</td>

                    <td style={styles.td}>{prod.cantidad_pedida}</td>

                    {/* 🔥 ENTREGADO MANUAL */}
                    <td style={styles.td}>
                      <input
                        style={styles.input}
                        type="number"
                        value={prod.cantidad_entregada}
                        onChange={e =>
                          actualizarCampo(i, j, 'cantidad_entregada', e.target.value)
                        }
                      />
                    </td>

                    {diferencia !== 0 ? (
                      <>
                        {/* 🔥 TIPO */}
                        <td style={styles.td}>
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

                        {/* 🔥 DETALLE */}
                        <td style={styles.td}>
                          {prod.tipo === 'prestamo' && (
                            <input
                              placeholder="Cliente destino"
                              value={prod.cliente_destino}
                              onChange={e =>
                                actualizarCampo(i, j, 'cliente_destino', e.target.value)
                              }
                            />
                          )}

                          {prod.tipo === 'roto' && (
                            <input
                              placeholder="Motivo del daño"
                              value={prod.motivo}
                              onChange={e =>
                                actualizarCampo(i, j, 'motivo', e.target.value)
                              }
                            />
                          )}
                        </td>

                        {/* 🔥 ACCIONES */}
                        <td style={styles.td}>
                          <button
                            onClick={() =>
                              actualizarCampo(i, j, 'accion', 'confirmado')
                            }
                          >
                            Confirmar
                          </button>

                          <button
                            onClick={() =>
                              actualizarCampo(i, j, 'accion', 'cancelado')
                            }
                          >
                            Cancelar
                          </button>
                        </td>
                      </>
                    ) : (
                      <td colSpan="3">OK</td>
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
