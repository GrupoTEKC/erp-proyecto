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
  const [busquedaProducto, setBusquedaProducto] = useState('')
  const [resultadosProductos, setResultadosProductos] = useState([])

  const [modalPrecio, setModalPrecio] = useState({ visible: false, pIndex: null, dIndex: null })
  const [passPrecio, setPassPrecio] = useState('')
  const [nuevoPrecioTemp, setNuevoPrecioTemp] = useState('')
  
  const esMovil = window.innerWidth < 768

  const fieldResponsive = {
    ...styles.field,
    width: esMovil ? '90px' : '200px'
  }

  const abrirModalPrecio = (pIndex, dIndex, precioActual) => {
    setModalPrecio({ visible: true, pIndex, dIndex })
    setNuevoPrecioTemp(precioActual)
    setPassPrecio('')
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

      cantidad_final:
      prod.cantidad_final ??
      prod.cantidad_entregada,

      tipo: prod.tipo || '',
      motivo: prod.motivo || '',
      id_cliente_destino: prod.id_cliente_destino || null
  }))
}))
      setPedidos(inicializados)
    }

    cargarPedidos()
  }, [id_chofer])

  const buscarProductos = async (texto) => {
    setBusquedaProducto(texto)

    if (!texto) {
      setResultadosProductos([])
      return
    }

    const res = await fetch(`${API}/productos`)
    const data = await res.json()

    const filtrados = data.filter(p =>
      p.nombre.toLowerCase().includes(texto.toLowerCase())
    )

    setResultadosProductos(filtrados)
  }

  const actualizarCampo = (pIndex, dIndex, campo, valor) => {
  const copia = [...pedidos]

  copia[pIndex].productos[dIndex][campo] = valor

  const prod = copia[pIndex].productos[dIndex]

   if (
    campo === 'cantidad_final' &&
    prod.tipo !== 'agregado'
      )
  {
 const entregado = Number(valor) || 0
const embarcado = Number(prod.cantidad_entregada) || 0

if (entregado > embarcado) {
  prod.tipo = 'con_incremento'
} else if (prod.tipo === 'con_incremento') {
  prod.tipo = ''
}
  }

  setPedidos(copia)
}

  const actualizarFolio = (pIndex, value) => {
    const copia = [...pedidos]
    copia[pIndex].folio = value
    setPedidos(copia)
  }

  const agregarProducto = (pIndex, producto) => {
  const copia = [...pedidos]

  const existente = copia[pIndex].productos.find(
    p => p.id_producto === producto.id_producto
  )

  if (existente) {
    alert(
      `El producto "${producto.nombre}" ya existe en el pedido.\n\nModifica la cantidad entregada directamente en ese renglón.`
    )

    setBusquedaProducto('')
    setResultadosProductos([])
    return
  }

   copia[pIndex].productos.push({
   id_producto: producto.id_producto,
   nombre: producto.nombre,
  precio_unitario: producto.precio_unitario,
  cantidad_pedida: '',
  cantidad_entregada: '',
  cantidad_final: '',
  tipo: 'agregado',
  motivo: '',
  id_cliente_destino: null
})

  setPedidos(copia)
  setBusquedaProducto('')
  setResultadosProductos([])
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
   if (prod.tipo === 'agregado') {
  if (!prod.cantidad_pedida)
    return `Falta embarcado en ${prod.nombre}`

  if (!prod.cantidad_final)
    return `Falta entregado en ${prod.nombre}`

  if (!prod.motivo)
    return `Falta comentario en ${prod.nombre}`

  continue
}

        if (prod.cantidad_final === '') {
        return `Falta cantidad entregada en ${prod.nombre}`
      }

     const diferencia =
      Number(prod.cantidad_final) -
      Number(prod.cantidad_entregada)

      if (diferencia !== 0) {
        if (!prod.tipo) return `Falta tipo en ${prod.nombre}`

        if (prod.tipo === 'con_incremento' && !prod.motivo) {
        return `Falta comentario en ${prod.nombre}`
        }
        
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
          productos: pedido.productos.map(p => {
          const embarcado = Number(p.cantidad_entregada) || 0
          const entregado = Number(p.cantidad_final) || 0

 return {
  ...p,
  cantidad_final: Number(p.cantidad_final),
  cantidad_entregada: Number(p.cantidad_entregada) || 0,
  tipo:
    p.tipo === 'agregado'
      ? 'agregado'
      : entregado > embarcado
        ? 'con_incremento'
        : p.tipo
}
})
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
        <h2 style={styles.title}>ENTREGAS</h2>
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

      {/* ✅ MENSAJE SIN PEDIDOS */}
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
          <div style={{ fontSize: 13 }}>
            Todo está al día 👍
          </div>
        </div>
      )}

      {pedidos.map((p, i) => {
        let totalPedido = 0
        let totalDescuento = 0

        p.productos.forEach(prod => {
          const precio = parseFloat(prod.precio_unitario) || 0
          const embarcado = Number(prod.cantidad_entregada) || 0
          const entregado = Number(prod.cantidad_final) || 0

         if (prod.tipo === 'agregado' || entregado > embarcado) {
         totalPedido += entregado * precio
         } else {
         totalPedido += embarcado * precio
         }

         const diferencia = embarcado - entregado

          if (diferencia > 0 && prod.tipo !== 'prestamo') {
            totalDescuento += diferencia * precio
          }
        })

        const totalFinal = totalPedido - totalDescuento

        return (
          <div key={i} style={{
            marginBottom: 20,
            border: '1px solid #ccc',
            padding: esMovil ? 10 : 15,
            borderRadius: '8px'
          }}>

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

            <div style={{ marginTop: 10 }}>
              <input
                style={fieldResponsive}
                placeholder="Buscar producto"
                value={busquedaProducto}
                onChange={e => buscarProductos(e.target.value)}
              />

              {resultadosProductos.map(prod => (
                <div
                  key={prod.id_producto}
                  onClick={() => agregarProducto(i, prod)}
                  style={{ cursor: 'pointer', background: '#eee', padding: '5px' }}
                >
                  {prod.nombre}
                </div>
              ))}
            </div>

            {/* ✅ WRAPPER RESPONSIVE */}
            <div style={{ overflowX: 'auto' }}>
              <table border="1" width="100%" style={{ marginTop: 10, fontSize: esMovil ? '12px' : '14px' }}>
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
                   const embarcado = Number(prod.cantidad_entregada) || 0
                   const entregado = Number(prod.cantidad_final) || 0

                   const diferencia = entregado - embarcado
                   const subtotal = entregado * precio
                    return (
                      <tr key={j}>
                        <td>{prod.nombre}</td>
                       <td>
                          {prod.tipo === 'agregado' ? (
                            <input
                              type="number"
                              style={fieldResponsive}
                              value={prod.precio_unitario}
                              onChange={e =>
                                actualizarCampo(i, j, 'precio_unitario', e.target.value)
                              }
                            />
                          ) : (
                        
                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                              <span>${precio.toFixed(2)}</span>
                              <button
                                type="button"
                                style={{
                                  background: 'transparent',
                                  border: 'none',
                                  cursor: 'pointer',
                                  fontSize: '14px'
                                }}
                                title="Editar precio"
                                onClick={() => abrirModalPrecio(i, j, prod.precio_unitario)}
                              >
                                ✏️
                              </button>
                            </div>
                          )}
                        </td>
                        

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
                          ) : embarcado}
                        </td>

                        <td>
                         <input
                         type="number"
                         style={fieldResponsive}
                         value={prod.cantidad_final ?? ''}
                         onChange={e =>
                        actualizarCampo(i, j, 'cantidad_final', e.target.value)
                        }
                         />
                        </td>

                        <td>${subtotal.toFixed(2)}</td>

                        {(diferencia !== 0 || prod.tipo === 'agregado') ? (
                          <>
                            <td>
                             {prod.tipo === 'agregado'
                             ? <div>Agregado</div>
                             : prod.tipo === 'con_incremento'
                           ? <div>Con incremento</div>
                                : (
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
                           {(prod.tipo === 'agregado' || prod.tipo === 'con_incremento') && (
                                <input
                                  style={fieldResponsive}
                                  placeholder="Comentario"
                                  value={prod.motivo}
                                  onChange={e =>
                                    actualizarCampo(i, j, 'motivo', e.target.value)
                                  }
                                />
                              )}

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
            </div>

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

            <button
              style={{ ...styles.guardar, backgroundColor: '#6c757d', marginLeft: 10 }}
              onClick={() => setShowPin(i)}
            >
              Cancelar
            </button>

            {showPin === i && (
              <div style={{
                marginTop: 10,
                padding: 15,
                border: '1px solid #ccc',
                borderRadius: '8px'
              }}>
                <input
                  type="password"
                  placeholder="PIN"
                  style={fieldResponsive}
                  value={pin}
                  onChange={e => setPin(e.target.value)}
                />

                <textarea
                  placeholder="Comentario obligatorio"
                  style={{ width: '100%', marginTop: 10 }}
                  value={comentarioCancelacion}
                  onChange={e => setComentarioCancelacion(e.target.value)}
                />

                <button
                  style={{ ...styles.guardar, marginTop: 10 }}
                  onClick={async () => {
                    if (pin !== 'Em#GTFPteg9') return alert('PIN incorrecto')
                    if (!comentarioCancelacion.trim()) return alert('Comentario obligatorio')
                    if (!window.confirm('¿Seguro que deseas cancelar este pedido?')) return

                    try {
                      const res = await fetch(`${API}/control-envios/cancelar`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          id_entrega: p.id_entrega,
                          comentario: comentarioCancelacion
                        })
                      })

                      const data = await res.json()

                      if (!res.ok) {
                        alert(data.error || 'Error al cancelar')
                        return
                      }

                      alert('Pedido cancelado correctamente')
                      setPedidos(prev => prev.filter((_, index) => index !== i))
                      setShowPin(null)
                      setPin('')
                      setComentarioCancelacion('')
                    } catch {
                      alert('Error de conexión')
                    }
                  }}
                >
                  Confirmar cancelación
                </button>
              </div>
           )}
          </div>
        )
      })}

      {/* 🔒 MODAL DE AUTORIZACIÓN PARA CAMBIAR PRECIO */}
      {modalPrecio.visible && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: '#fff',
            padding: '20px',
            borderRadius: '8px',
            width: '300px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
          }}>
            <h3 style={{ marginTop: 0, color: '#071849' }}>Editar Precio</h3>
            
            <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Nuevo Precio:</label>
            <input
              type="number"
              style={{ ...styles.field, width: '100%', marginBottom: '10px', marginTop: '5px' }}
              value={nuevoPrecioTemp}
              onChange={e => setNuevoPrecioTemp(e.target.value)}
            />

            <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Contraseña de autorización:</label>
            <input
              type="password"
              placeholder="Ingrese clave"
              style={{ ...styles.field, width: '100%', marginBottom: '15px', marginTop: '5px' }}
              value={passPrecio}
              onChange={e => setPassPrecio(e.target.value)}
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                style={{ ...styles.guardar, backgroundColor: '#6c757d', marginTop: 0 }}
                onClick={() => setModalPrecio({ visible: false, pIndex: null, dIndex: null })}
              >
                Cancelar
              </button>
              
              <button
                style={{ ...styles.guardar, marginTop: 0 }}
                onClick={() => {
                  if (passPrecio !== '24022004') {
                    alert('Contraseña incorrecta')
                    return
                  }
                  if (!nuevoPrecioTemp || Number(nuevoPrecioTemp) < 0) {
                    alert('Ingrese un precio válido')
                    return
                  }
                  
                  actualizarCampo(modalPrecio.pIndex, modalPrecio.dIndex, 'precio_unitario', nuevoPrecioTemp)
                  setModalPrecio({ visible: false, pIndex: null, dIndex: null })
                }}
              >
                Aplicar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ControlEnviosDetalle
