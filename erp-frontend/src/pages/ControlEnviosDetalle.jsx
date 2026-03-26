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
  const [loading, setLoading] = useState(true)

  const esMovil = window.innerWidth < 768

  const fieldResponsive = {
    ...styles.field,
    width: esMovil ? '90px' : '200px'
  }

  useEffect(() => {
    const cargarPedidos = async () => {
      setLoading(true)
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
      setLoading(false)
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
    setPedidos(copia)
  }

  const actualizarFolio = (pIndex, value) => {
    const copia = [...pedidos]
    copia[pIndex].folio = value
    setPedidos(copia)
  }

  const agregarProducto = (pIndex, producto) => {
    const copia = [...pedidos]

    copia[pIndex].productos.push({
      id_producto: producto.id_producto,
      nombre: producto.nombre,
      precio_unitario: producto.precio_unitario,
      cantidad_pedida: '',
      cantidad_entregada: '',
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
        if (!prod.cantidad_pedida) return `Falta embarcado en ${prod.nombre}`
        if (!prod.cantidad_entregada) return `Falta entregado en ${prod.nombre}`
        if (!prod.motivo) return `Falta comentario en ${prod.nombre}`
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

      {!loading && pedidos.length === 0 && (
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

      {loading && (
        <div style={{ textAlign: 'center', marginTop: 40 }}>
          Cargando pedidos...
        </div>
      )}

      {pedidos.map((p, i) => {
        let totalPedido = 0
        let totalDescuento = 0

        p.productos.forEach(prod => {
          const precio = parseFloat(prod.precio_unitario) || 0
          const pedida = Number(prod.cantidad_pedida) || 0
          const entregada = Number(prod.cantidad_entregada) || 0

          totalPedido += (prod.tipo === 'agregado'
            ? entregada
            : pedida
          ) * precio

          const diferencia = pedida - entregada

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
            borderRadius: '8px',
            overflowX: esMovil ? 'auto' : 'visible'
          }}>
            {/* 👇 AQUÍ SIGUE TODO TU CONTENIDO ORIGINAL (tabla, botones, etc.) */}
          </div>
        )
      })}
    </div>
  )
}

export default ControlEnviosDetalle
