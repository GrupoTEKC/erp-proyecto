import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

const API = 'https://erp-proyecto-production.up.railway.app'

const styles = {
  page: { backgroundColor: '#ffffff', minHeight: '100vh', padding: '20px', fontFamily: 'Arial, sans-serif' },
  header: { marginBottom: '20px' },
  backButton: { display: 'inline-flex', alignItems: 'center', padding: '10px 14px', fontSize: '14px', backgroundColor: '#fff', color: '#8B1E1E', border: '1px solid #8B1E1E', borderRadius: '6px', cursor: 'pointer' },
  title: { marginTop: '20px', marginBottom: '15px', color: '#071849', fontWeight: 'bold' },
  field: { width: '200px', padding: '6px', border: '1px solid #8B1E1E', borderRadius: '6px' },
  guardar: { marginTop: '10px', padding: '10px 16px', backgroundColor: '#8B1E1E', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }
}

function ControlEnviosDetalle() {
  const { id_chofer } = useParams()
  const navigate = useNavigate()

  const [pedidos, setPedidos] = useState([])
  const [clientes, setClientes] = useState([])
  const [busquedas, setBusquedas] = useState({})
  const [mensaje, setMensaje] = useState(null)
  const [showPin, setShowPin] = useState(null)
  const [pin, setPin] = useState('')
  const [comentarioCancelacion, setComentarioCancelacion] = useState('')

  const esMovil = window.innerWidth < 768

  const fieldResponsive = {
    ...styles.field,
    width: esMovil ? '90px' : '200px'
  }

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
          tipo: prod.tipo || '', // respeta si viene agregado
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

    const res = await fetch(`${API}/clientes`)
    const data = await res.json()

    const filtrados = data.filter(c =>
      (c.nombre || '').toLowerCase().includes(texto.toLowerCase()) ||
      (c.nombre_tienda || '').toLowerCase().includes(texto.toLowerCase())
    )

    setClientes(filtrados)
  }

  const validarPedido = (pedido) => {
    for (let prod of pedido.productos) {

      // 🔥 AGREGADOS
      if (prod.tipo === 'agregado') {
        if (!prod.cantidad_pedida) return `Falta embarcado en ${prod.nombre}`
        if (!prod.cantidad_entregada) return `Falta entregado en ${prod.nombre}`
        if (!prod.motivo) return `Falta motivo en ${prod.nombre}`
        continue
      }

      if (prod.cantidad_entregada === '') {
        return `Falta cantidad entregada en ${prod.nombre}`
      }

      const diferencia = Number(prod.cantidad_entregada) - prod.cantidad_pedida

      if (diferencia !== 0) {
        if (!prod.tipo) return `Falta tipo en ${prod.nombre}`

        if (prod.tipo === 'roto' && !prod.motivo) {
          return `Falta motivo en ${prod.nombre}`
        }

        if (prod.tipo === 'prestamo') {
          if (!prod.id_cliente_destino) {
            return `Selecciona cliente en ${prod.nombre}`
          }
        }
      }
    }

    return null
  }

  const finalizarEntrega = async (pedido) => {
    setMensaje(null)

    const error = validarPedido(pedido)
    if (error) {
      setMensaje({ tipo: 'error', texto: error })
      return
    }

    if (!pedido.folio.trim()) {
      setMensaje({ tipo: 'error', texto: 'Folio obligatorio' })
      return
    }

    try {
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
        setMensaje({ tipo: 'error', texto: data.error || 'Error al guardar' })
        return
      }

      setMensaje({ tipo: 'ok', texto: 'Entrega finalizada correctamente' })
      setTimeout(() => navigate(-1), 1200)

    } catch {
      setMensaje({ tipo: 'error', texto: 'Error de conexión' })
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <button style={styles.backButton} onClick={() => navigate(-1)}>
          ← Volver
        </button>

        <h2 style={styles.title}>Control de envíos</h2>
      </div>

      {mensaje && (
        <div style={{
          padding: '10px',
          marginBottom: '15px',
          borderRadius: '6px',
          color: mensaje.tipo === 'error' ? '#721c24' : '#155724',
          backgroundColor: mensaje.tipo === 'error' ? '#f8d7da' : '#d4edda'
        }}>
          {mensaje.texto}
        </div>
      )}

      {pedidos.length === 0 && (
        <div style={{
          padding: '30px',
          border: '1px dashed #8B1E1E',
          borderRadius: '10px',
          color: '#8B1E1E',
          textAlign: 'center',
          background: '#fff5f5'
        }}>
          <div style={{ fontSize: '40px' }}>📦</div>
          <div style={{ fontWeight: 'bold', marginTop: 10 }}>
            No tienes entregas pendientes
          </div>
        </div>
      )}

      {pedidos.map((p, i) => {

        let totalPedido = 0
        let totalDescuento = 0

        p.productos.forEach(prod => {
          const precio = parseFloat(prod.precio_unitario) || 0
          const pedida = Number(prod.cantidad_pedida) || 0
          const entregada = Number(prod.cantidad_entregada) || 0

          const cantidadBase = prod.tipo === 'agregado' ? entregada : pedida
          totalPedido += cantidadBase * precio

          const diferencia = pedida - entregada

          if (diferencia > 0 && prod.tipo !== 'prestamo') {
            totalDescuento += diferencia * precio
          }
        })

        const totalFinal = totalPedido - totalDescuento

        return (
          <div key={i} style={{ marginBottom: 20, border: '1px solid #ccc', padding: 15 }}>

            <div>
              <b>{p.cliente}</b> | {p.tienda}<br />
              Ruta: {p.ruta}
            </div>

            <input
              style={fieldResponsive}
              placeholder="Folio"
              value={p.folio}
              onChange={e => actualizarFolio(i, e.target.value)}
            />

            <table border="1" width="100%" style={{ marginTop: 10 }}>
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Precio</th>
                  <th>Embarcado</th>
                  <th>Entregado</th>
                  <th>Subtotal</th>
                  <th>Tipo</th>
                  <th>Detalle</th>
                </tr>
              </thead>

              <tbody>
                {p.productos.map((prod, j) => {

                  const precio = parseFloat(prod.precio_unitario) || 0
                  const entregada = Number(prod.cantidad_entregada) || 0
                  const pedida = Number(prod.cantidad_pedida) || 0
                  const diferencia = entregada - pedida
                  const subtotal = entregada * precio

                  return (
                    <tr key={j}>
                      <td>{prod.nombre}</td>
                      <td>${precio.toFixed(2)}</td>

                      {/* 🔥 EMBARCADO EDITABLE SI ES AGREGADO */}
                      <td>
                        {prod.tipo === 'agregado' ? (
                          <input
                            type="number"
                            style={fieldResponsive}
                            value={prod.cantidad_pedida}
                            onChange={e =>
                              actualizarCampo(i, j, 'cantidad_pedida', e.target.value)
                            }
                          />
                        ) : pedida}
                      </td>

                      <td>
                        <input
                          type="number"
                          style={fieldResponsive}
                          value={prod.cantidad_entregada}
                          onChange={e =>
                            actualizarCampo(i, j, 'cantidad_entregada', e.target.value)
                          }
                        />
                      </td>

                      <td>${subtotal.toFixed(2)}</td>

                      {(diferencia !== 0 || prod.tipo === 'agregado') ? (
                        <>
                          <td>
                            {prod.tipo === 'agregado' ? (
                              <div>Agregado</div>
                            ) : (
                              <select
                                style={fieldResponsive}
                                value={prod.tipo}
                                onChange={e =>
                                  actualizarCampo(i, j, 'tipo', e.target.value)
                                }
                              >
                                <option value="">--</option>
                                <option value="prestamo">Préstamo</option>
                                <option value="roto">Roto</option>
                              </select>
                            )}
                          </td>

                          <td>
                            {prod.tipo === 'roto' && (
                              <input
                                style={fieldResponsive}
                                placeholder="Motivo"
                                value={prod.motivo}
                                onChange={e =>
                                  actualizarCampo(i, j, 'motivo', e.target.value)
                                }
                              />
                            )}

                            {prod.tipo === 'agregado' && (
                              <input
                                style={fieldResponsive}
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
                                  style={fieldResponsive}
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
                                    style={{ cursor: 'pointer', background: '#eee', padding: '4px' }}
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

            <div style={{ marginTop: 10 }}>
              <div><b>Total pedido:</b> ${totalPedido.toFixed(2)}</div>
              <div style={{ color: '#8B1E1E' }}>
                <b>Descuento:</b> -${totalDescuento.toFixed(2)}
              </div>
              <div style={{ fontWeight: 'bold' }}>
                Total a cobrar: ${totalFinal.toFixed(2)}
              </div>
            </div>

            <button style={styles.guardar} onClick={() => finalizarEntrega(p)}>
              Finalizar entrega
            </button>

            {/* 🚫 CANCELAR NO TOCADO */}
            <button
              style={{ ...styles.guardar, backgroundColor: '#6c757d', marginLeft: 10 }}
              onClick={() => setShowPin(i)}
            >
              Cancelar
            </button>

          </div>
        )
      })}
    </div>
  )
}

export default ControlEnviosDetalle
