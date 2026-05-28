import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

const API = "https://erp-proyecto-production.up.railway.app"

const styles = {
  page: {
    backgroundColor: '#ffffff',
    minHeight: '100vh',
    padding: '20px',
    fontFamily: 'Arial, sans-serif'
  },
backTop: {
  padding: '8px 12px',
  fontSize: '13px',
  backgroundColor: '#fff',
  color: '#8B1E1E',
  border: '1px solid #8B1E1E',
  borderRadius: '6px',
  cursor: 'pointer'
},

titleCenter: {
  textAlign: 'center',
  fontSize: '22px',
  fontWeight: 'bold',
  color: '#071849',
  marginBottom: '20px'
},
  
  field: {
    width: '100%',
    maxWidth: '400px',
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #8B1E1E',
    marginTop: '5px'
  },
  cardPedido: {
    border: '1px solid #ddd',
    borderRadius: '6px',
    padding: '12px',
    marginBottom: '10px'
  },
  gris: { border: '2px solid #ccc', backgroundColor: '#f5f5f5' },
  amarillo: { border: '2px solid #FFD600', backgroundColor: '#fff9c4' },
  rojo: { border: '2px solid red', backgroundColor: '#ffe5e5' },
  botonAccion: {
    marginTop: '8px',
    padding: '8px 12px',
    fontSize: '13px',
    backgroundColor: '#8B1E1E',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer'
  }
}

// 🔥 calcular días (se sigue usando para colores)
const calcularDias = (fecha_entrega) => {
  if (!fecha_entrega) return 0
  const hoy = new Date()
  const entrega = new Date(fecha_entrega + "T00:00:00")
  const diff = Math.floor((hoy - entrega) / (1000 * 60 * 60 * 24))
  return diff > 0 ? diff : 0
}

// 🔥 colores
const getColorStyle = (dias, pagado) => {
  if (pagado) return styles.gris
  if (dias >= 30) return styles.rojo
  if (dias >= 15) return styles.amarillo
  return {}
}

function Pagos() {
  const navigate = useNavigate()
  const [productosCatalogo, setProductosCatalogo] = useState([])
  const [resultadosBusqueda, setResultadosBusqueda] = useState([])
  const [clientes, setClientes] = useState([])
  const [busqueda, setBusqueda] = useState("")
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null)
  const [pedidos, setPedidos] = useState([])
  const [busquedaFolio, setBusquedaFolio] = useState("")

  const [pagosData, setPagosData] = useState({})
  const [mostrarPago, setMostrarPago] = useState(null)

  const [detalles, setDetalles] = useState([])
  const [verDetalles, setVerDetalles] = useState(null)
  const [mostrarCrear, setMostrarCrear] = useState(false)
  const [nuevoPedido, setNuevoPedido] = useState({
  folio: "",
  fecha_entrega: "",
  productos: []
})


  useEffect(() => {
    fetch(`${API}/clientes`)
      .then(res => res.json())
      .then(setClientes)
    
     fetch(`${API}/productos`)
      .then(res => res.json())
      .then(setProductosCatalogo)
  }, [])

  const clientesFiltrados = clientes.filter(c =>
    `${c.nombre} ${c.apellido1} ${c.apellido2} ${c.nombre_tienda} ${c.apodo}`
      .toLowerCase()
      .includes(busqueda.toLowerCase())
  )

  const cargarPedidos = async (cliente) => {
    setClienteSeleccionado(cliente)
    const res = await fetch(`${API}/pedidos/cliente/${cliente.id_cliente}`)
    const data = await res.json()
    setPedidos(data)
  }

  const cargarDetalles = async (id_pedido) => {
    const res = await fetch(`${API}/pagos/${id_pedido}`)
    const data = await res.json()
    setDetalles(data)
    setVerDetalles(id_pedido)
  }

  const setPagoField = (id, field, value) => {
    setPagosData(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value
      }
    }))
  }

const registrarPago = async (pedido) => {
  const dataPago = pagosData[pedido.id_pedido] || {}

  if (!dataPago.fecha_pago) {
  alert("Debes seleccionar fecha de pago")
  return
}
  const metodoActual = dataPago.metodo || "efectivo"

  if (metodoActual === "efectivo" && !dataPago.nombreEntrega?.trim()) {
    alert("Debes poner quién entrega el dinero")
    return
  }

  const res = await fetch(`${API}/pagos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
  id_pedido: pedido.id_pedido,
  monto: dataPago.monto,
  metodo: metodoActual,
  fecha_pago: dataPago.fecha_pago, // 👈 REGRESA ESTO
  cuenta_destino:
    metodoActual === "transferencia" ? dataPago.cuenta : null,
  id_usuario: 1,
  tipo_usuario: "vendedor",
  nombre_usuario:
    metodoActual === "efectivo" ? dataPago.nombreEntrega : null
})
  })

  const data = await res.json()

  if (!res.ok) {
    alert(data.error)
    return
  }

  alert("Abono registrado ✅")
  cargarPedidos(clienteSeleccionado)
  setMostrarPago(null)

  setPagosData(prev => ({
    ...prev,
    [pedido.id_pedido]: {}
  }))
}

  const cambiarCantidad = (index, cantidad) => {
  const nuevos = [...nuevoPedido.productos]
  nuevos[index].cantidad = cantidad
  setNuevoPedido(prev => ({ ...prev, productos: nuevos }))
}
  
const totalPedido = nuevoPedido.productos.reduce(
  (acc, p) => acc + ((p.precio || 0) * (p.cantidad || 0)),
  0
)
  
const guardarPedido = async () => {
  // 🔴 VALIDACIONES
  if (!nuevoPedido.folio) {
    alert("El folio es obligatorio")
    return
  }

  if (!nuevoPedido.fecha_entrega) {
    alert("La fecha de entrega es obligatoria")
    return
  }

  if (nuevoPedido.productos.length === 0) {
    alert("Debes agregar al menos un producto")
    return
  }

  try {
    const res = await fetch(`${API}/pedidos/manual`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevoPedido)
    })

      let data
      try {
      data = await res.json()
      } catch {
      data = {}
      }
      if (!res.ok) {
      alert(data.error || "Error al crear pedido")
      return
    }

    alert("Pedido creado ✅")

    setMostrarCrear(false)

    setNuevoPedido({
      folio: "",
      fecha_entrega: "",
      productos: []
    })

    cargarPedidos(clienteSeleccionado)

  } catch (error) {
    console.error(error)
    alert("Error de conexión con el servidor")
  }
}
  
  const pedidosFiltrados = pedidos
    .filter(p =>
      `${p.folio || p.id_pedido}`.toString().includes(busquedaFolio)
    )
    .sort((a, b) => {
      const pagadoA = (a.total_pagado || 0) >= a.total
      const pagadoB = (b.total_pagado || 0) >= b.total
      return pagadoA === pagadoB ? 0 : pagadoA ? 1 : -1
    })

const buscarProducto = (texto) => {
  if (!texto) {
    setResultadosBusqueda([])
    return
  }

  const filtrados = productosCatalogo.filter(p =>
    p.nombre.toLowerCase().includes(texto.toLowerCase())
  )

  setResultadosBusqueda(filtrados)
}
  
return (
  <div style={styles.page}>

    <button style={styles.backTop} onClick={() => navigate("/")}>
      ⬅ Volver
    </button>

    <button
      style={{
        ...styles.botonAccion,
        position: "absolute",
        top: 20,
        right: 20
      }}
      onClick={() => {
        if (!clienteSeleccionado) {
          alert("Selecciona un cliente primero")
          return
        }
        setMostrarCrear(true)
      }}
    >
      ➕ Agregar folio
    </button>

    <h2 style={styles.titleCenter}>CUENTAS POR COBRAR</h2>

      {!clienteSeleccionado && (
        <>
          <input
            placeholder="Buscar cliente..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            style={styles.field}
          />

          {clientesFiltrados.map(c => (
            <div key={c.id_cliente}>
              <b>{c.nombre} {c.apellido1}</b>
              <br />
              {c.nombre_tienda}
              <br />
              <button onClick={() => cargarPedidos(c)} style={styles.botonAccion}>
                Estado de cuenta
              </button>
            </div>
          ))}
        </>
      )}

      {clienteSeleccionado && (
        <>
          <h3>{clienteSeleccionado.nombre}</h3>

          <input
            placeholder="Buscar folio..."
            value={busquedaFolio}
            onChange={e => setBusquedaFolio(e.target.value)}
            style={styles.field}
          />

          {pedidosFiltrados.map(p => {
            const totalPagado = p.total_pagado || 0
            const saldo = p.total - totalPagado
            const pagado = saldo <= 0

            const dias = calcularDias(p.fecha_entrega)
            const colorStyle = getColorStyle(dias, pagado)

            const dataPago = pagosData[p.id_pedido] || {}

            return (
              <div
                key={p.id_pedido}
                style={{
                  ...styles.cardPedido,
                  ...colorStyle
                }}
              >
                <b>Folio: {p.folio || p.id_pedido}</b>
                <br />

                💰 Monto total: ${p.total}
                <br />
                💸 Monto pagado: ${totalPagado}
                <br />
                💳 Saldo pendiente: ${saldo}
                <br />

                📦 Entregado: {
                  p.fecha_entrega
                    ? new Date(p.fecha_entrega).toLocaleDateString()
                    : '—'
                }
                <br />

                {pagado && (
                  <div style={{ color: 'green', fontWeight: 'bold' }}>
                    ✅ PAGADO
                  </div>
                )}

                {!pagado && (
                  <button
                    style={styles.botonAccion}
                    onClick={() => setMostrarPago(p.id_pedido)}
                  >
                    Agregar abono
                  </button>
                )}

                <button
                  style={{ ...styles.botonAccion, backgroundColor: '#444' }}
                  onClick={() => cargarDetalles(p.id_pedido)}
                >
                  Ver detalles
                </button>

                {mostrarPago === p.id_pedido && (
                  <div>
                    <input
                type="date"
                value={dataPago.fecha_pago || ""}
                onChange={e =>
                setPagoField(p.id_pedido, "fecha_pago", e.target.value)
               }
                style={styles.field}
              />
                    <input
                      placeholder="Monto"
                      value={dataPago.monto || ""}
                      onChange={e => setPagoField(p.id_pedido, "monto", e.target.value)}
                      style={styles.field}
                    />

                    <select
                      value={dataPago.metodo || "efectivo"}
                      onChange={e => setPagoField(p.id_pedido, "metodo", e.target.value)}
                      style={styles.field}
                    >
                      <option value="efectivo">Efectivo</option>
                      <option value="transferencia">Transferencia</option>
                    </select>

                   {(dataPago.metodo || "efectivo") === "transferencia" && (
                      <select
                        value={dataPago.cuenta || ""}
                        onChange={e => setPagoField(p.id_pedido, "cuenta", e.target.value)}
                        style={styles.field}
                      >
                       <option value="fiscal">Fiscal</option>
                       <option value="yair">Yair</option>
                       <option value="natanael">Natanael</option>
                       <option value="giovanny">Giovanny</option>
                       <option value="rosario">Rosario</option>
                      </select>
                    )}

                    {(dataPago.metodo || "efectivo") === "efectivo" && (
                      <input
                        placeholder="Quién entrega"
                        value={dataPago.nombreEntrega || ""}
                        onChange={e => setPagoField(p.id_pedido, "nombreEntrega", e.target.value)}
                        style={styles.field}
                      />
                    )}

                    <button onClick={() => registrarPago(p)} style={styles.botonAccion}>
                      Confirmar
                    </button>
                  </div>
                )}

                {verDetalles === p.id_pedido && (
                  <div style={{ marginTop: 10 }}>
                    <b>Historial:</b>
                    {detalles.map(d => (
  <div key={d.id_pago} style={{ marginBottom: 8 }}>
    💰 ${d.monto} - {d.metodo}

    {d.metodo === 'transferencia' && d.cuenta_destino && (
      <> ({d.cuenta_destino})</>
    )}

    {" - "}
    👤 {d.nombre_usuario || '-'}

    <br />

    📅 Fecha de pago: {
  d.fecha_pago
    ? new Date(d.fecha_pago).toLocaleDateString("es-MX", {
  timeZone: "UTC"
})
    : '—'
}

    <br />

    🕒 Fecha de registro: {
      d.fecha_registro
        ? new Date(d.fecha_registro).toLocaleString()
        : '—'
    }
  </div>
))}
                  </div>
                )}
              </div>
            )
          })}
        </>
      )}
      {mostrarCrear && (
  <div style={{
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  }}>
    <div style={{
      background: "#fff",
      padding: 20,
      borderRadius: 8,
      width: "400px"
    }}>
      <h3>Ingreso de pedido rezagado</h3>

     {!nuevoPedido.folio && (
     <div style={{ color: "red", fontSize: 12 }}>
     El folio es obligatorio (solo números)
     </div>
     )}

     <input
     placeholder="Folio"
     value={nuevoPedido.folio}
     onChange={e => {
     const valor = e.target.value.replace(/\D/g, "")
     setNuevoPedido({ ...nuevoPedido, folio: valor })
     }}
     style={styles.field}
     />

      <small style={{ color: "#555" }}>
      Ingresa el folio correspondiente a este pedido
      </small>

      {!nuevoPedido.fecha_entrega && (
      <div style={{ color: "red", fontSize: 12 }}>
      La fecha de entrega es obligatoria
      </div>
      )}
      
      <input
        type="date"
        value={nuevoPedido.fecha_entrega}
        onChange={e =>
          setNuevoPedido({ ...nuevoPedido, fecha_entrega: e.target.value })
        }
        style={styles.field}
      />

      <small style={{ color: "#555" }}>
      Selecciona la fecha en que el chofer entregó físicamente el pedido
      </small>

      <input
      placeholder="Buscar producto..."
      onChange={e => buscarProducto(e.target.value)}
      style={styles.field}
      />
      
      {/* PRODUCTOS (aunque esté vacío por ahora) */}
    {nuevoPedido.productos.map((p, i) => (
    <div key={i} style={{ marginTop: 10 }}>
    
    <div style={{ fontWeight: "bold" }}>{p.nombre}</div>

    <div style={{ display: "flex", gap: 10, marginTop: 5 }}>

      <input
        type="number"
        placeholder="Cantidad"
        value={p.cantidad}
        onChange={e => cambiarCantidad(i, Number(e.target.value))}
        style={{ ...styles.field, maxWidth: 100 }}
      />

      <div style={{ display: "flex", flexDirection: "column" }}>
         <div style={{ fontSize: 12, color: "#555" }}>
          Precio ($ MXN)
        </div>

        <input
          type="number"
          placeholder="$"
          value={p.precio}
          onChange={e => {
            const nuevos = [...nuevoPedido.productos]
            nuevos[i].precio = Number(e.target.value)
            setNuevoPedido(prev => ({ ...prev, productos: nuevos }))
          }}
          style={{ ...styles.field, maxWidth: 120 }}
        />
      </div>

    </div>

    <div style={{ fontSize: 12, marginTop: 5 }}>
      Subtotal: ${p.precio * p.cantidad}
    </div>

  </div>
))}
      
      <h4>TOTAL: ${totalPedido}</h4>

    <button
  style={{
    ...styles.botonAccion,
    backgroundColor: "#777"
  }}
  onClick={() => setMostrarCrear(false)}
>
  Cancelar
</button>

<button
  style={{
    ...styles.botonAccion
  }}
  onClick={guardarPedido}
>
  Guardar
</button>
    {resultadosBusqueda.map((prod, i) => (
  <div key={i}>
    {prod.nombre}
    <button
      onClick={() => {
        const yaExiste = nuevoPedido.productos.find(
          p => p.id_producto === prod.id_producto
        )
        if (yaExiste) return

        setNuevoPedido(prev => ({
          ...prev,
          productos: [
            ...prev.productos,
            {
              id_producto: prod.id_producto,
              nombre: prod.nombre,
              precio: prod.precio,
              cantidad: 1
            }
          ]
        }))
      }}
    >
      Agregar
    </button>
  </div>
))}
    </div>
  </div>
)}
    </div>
  )
}

export default Pagos
