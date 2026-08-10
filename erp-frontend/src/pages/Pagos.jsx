import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import logo from "../assets/TRANSPARENTE.png"
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
    textAlign: "center",
    fontSize: "42px",
    fontWeight: "bold",
    color: "#8B1E1E",
    margin: 0,
    letterSpacing: "1px"
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
  },
  hamburger: {
    position: "fixed",
    top: 18,
    right: 18,
    background: "transparent",
    border: "none",
    color: "#C62828",
    fontSize: 30,
    cursor: "pointer",
    zIndex: 1001,
    padding: 0,
    lineHeight: 1
  },
  menu: {
    position: "fixed",
    top: 0,
    right: 0,
    width: 290,
    height: "100%",
    background: "#ffffff",
    color: "#222",
    boxShadow: "-8px 0 25px rgba(0,0,0,.18)",
    padding: "20px 18px",
    zIndex: 1000,
    transition: "transform .25s ease"
  },
  menuItem: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "14px 12px",
    marginBottom: 8,
    background: "#fff",
    color: "#333",
    border: "none",
    borderBottom: "1px solid #ececec",
    fontSize: "17px",
    cursor: "pointer",
    textAlign: "left"
  },
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(139,30,30,.12)",
    zIndex: 999
  }
}

const calcularDias = (fecha_entrega) => {
  if (!fecha_entrega) return 0
  const hoy = new Date()
  const entrega = new Date(fecha_entrega + "T00:00:00")
  const diff = Math.floor((hoy - entrega) / (1000 * 60 * 60 * 24))
  return diff > 0 ? diff : 0
}

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

  const [menuAbierto, setMenuAbierto] = useState(false)

  const [mostrarModalNota, setMostrarModalNota] = useState(false)
  const [detalleNota, setDetalleNota] = useState([])
  const [pedidoSeleccionadoNota, setPedidoSeleccionadoNota] = useState(null)
  const [cargandoNota, setCargandoNota] = useState(false)
  
  const [detalles, setDetalles] = useState([])
  const [verDetalles, setVerDetalles] = useState(null)
  const [mostrarCrear, setMostrarCrear] = useState(false)
  const [nuevoPedido, setNuevoPedido] = useState({
    folio: "",
    fecha_entrega: "",
    productos: []
  })

  useEffect(() => {
    fetch(`${API}/productos`)
      .then(res => res.json())
      .then(setProductosCatalogo)
  }, [])

  useEffect(() => {
    const buscarClientes = async () => {
      try {
        const texto = busqueda.trim()

        if (texto.length > 0 && texto.length < 2) {
          setClientes([])
          return
        }

        const url = texto
          ? `${API}/clientes/busqueda?q=${encodeURIComponent(texto)}`
          : `${API}/clientes`

        const res = await fetch(url)

        if (!res.ok) {
          console.error("Error del servidor")
          setClientes([])
          return
        }

        const data = await res.json()
        setClientes(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error(err)
        setClientes([])
      }
    }

    buscarClientes()
  }, [busqueda])

  const cargarPedidos = async (cliente) => {
    setClienteSeleccionado(cliente)

    const [resPedidos, resRezagados] = await Promise.all([
      fetch(`${API}/pedidos/cliente/${cliente.id_cliente}`),
      fetch(`${API}/pedidos-rezagados/cliente/${cliente.id_cliente}`)
    ])

    const pedidosNormales = await resPedidos.json()
    const pedidosRezagados = await resRezagados.json()

    setPedidos([
      ...pedidosNormales,
      ...pedidosRezagados
    ])
  }

  const cargarDetalles = async (pedido) => {
    const url =
      pedido.tipo === "rezagado"
        ? `${API}/pagos/rezagado/${pedido.id_rezagado}`
        : `${API}/pagos/${pedido.id_pedido}`

    const res = await fetch(url)
    const data = await res.json()

    setDetalles(data)
    setVerDetalles(
      pedido.tipo === "rezagado"
        ? pedido.id_rezagado
        : pedido.id_pedido
    )
  }

  const abrirModalNota = async (pedido) => {
    setPedidoSeleccionadoNota(pedido)
    setMostrarModalNota(true)
    setCargandoNota(true)
    
    try {
      const res = await fetch(`${API}/pedidos/${pedido.id_pedido}/detalle-nota`)
      const data = await res.json()
      setDetalleNota(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Error al cargar detalle de la nota:", error)
      setDetalleNota([])
    } finally {
      setCargandoNota(false)
    }
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
    const esRezagado = pedido.tipo === "rezagado"
    const id = esRezagado ? pedido.id_rezagado : pedido.id_pedido
    const dataPago = pagosData[id] || {}

    if (!dataPago.fecha_pago) {
      alert("Debes seleccionar fecha de pago")
      return
    }

    if (!dataPago.monto || Number(dataPago.monto) <= 0) {
      alert("Debes ingresar un monto válido mayor a 0")
      return
    }

    const metodoActual = dataPago.metodo || "efectivo"
    if (metodoActual === "efectivo" && !dataPago.nombreEntrega?.trim()) {
      alert("Debes poner quién entrega el dinero")
      return
    }

    try {
      const res = await fetch(`${API}/pagos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tipo_origen: esRezagado ? "rezagado" : "pedido",
          id_pedido: !esRezagado ? pedido.id_pedido : null,
          id_rezagado: esRezagado ? pedido.id_rezagado : null,
          monto: Number(dataPago.monto),
          metodo: metodoActual,
          fecha_pago: dataPago.fecha_pago,
          cuenta_destino: metodoActual === "transferencia" ? (dataPago.cuenta || "fiscal") : null,
          id_usuario: 1,
          tipo_usuario: "vendedor",
          nombre_usuario: metodoActual === "efectivo" ? dataPago.nombreEntrega : null
        })
      })

      const data = await res.json()

      if (!res.ok) {
        alert(data.error || "Error al registrar el abono")
        return
      }

      alert("Abono registrado ✅")
      cargarPedidos(clienteSeleccionado)
      setMostrarPago(null)
      setPagosData(prev => ({ ...prev, [id]: {} }))
    } catch (error) {
      console.error("Error al registrar abono:", error)
      alert("Error de conexión con el servidor")
    }
  }

  const cambiarCantidad = (index, cantidad) => {
    const nuevos = [...nuevoPedido.productos]
    nuevos[index].cantidad = cantidad
    setNuevoPedido(prev => ({ ...prev, productos: nuevos }))
  }

  const eliminarProducto = (index) => {
    const nuevos = nuevoPedido.productos.filter((_, i) => i !== index)
    setNuevoPedido(prev => ({ ...prev, productos: nuevos }))
  }
  
  const totalPedido = nuevoPedido.productos.reduce(
    (acc, p) => acc + ((p.precio || 0) * (p.cantidad || 0)),
    0
  )
  
  const guardarPedido = async () => {
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
      const res = await fetch(`${API}/pedidos-rezagados`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_cliente: clienteSeleccionado.id_cliente,
          folio: nuevoPedido.folio,
          fecha_rezagada: nuevoPedido.fecha_entrega,
          productos: nuevoPedido.productos
        })
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

      alert("Pedido rezagado creado ✅")
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
      {!menuAbierto && (
        <button
          style={styles.hamburger}
          onClick={() => setMenuAbierto(true)}
        >
          ☰
        </button>
      )}
      
      {menuAbierto && (
        <>
          <div
            style={styles.overlay}
            onClick={() => setMenuAbierto(false)}
          />

          <div style={styles.menu}>
            <h3
              style={{
                margin: 0,
                paddingBottom: 18,
                marginBottom: 18,
                borderBottom: "1px solid #E5E5E5",
                fontSize: 24,
                color: "#8B1E1E",
                fontWeight: "700"
              }}
            >
              ☰ MENÚ
            </h3>

            <button
              style={styles.menuItem}
              onClick={() => {
                setMenuAbierto(false)
                navigate("/")
              }}
            >
              <span style={{ color: "#C62828" }}>🏠</span>
              Inicio
            </button>

            <button
              style={styles.menuItem}
              onClick={() => {
                setMenuAbierto(false)
                setClienteSeleccionado(null)
                setPedidos([])
                setBusquedaFolio("")
              }}
            >
              <span style={{ color: "#C62828" }}>📄</span>
              Cuentas por cobrar
            </button>

            <button
              style={styles.menuItem}
              onClick={() => {
                setMenuAbierto(false)
                navigate("/control-ventas")
              }}
            >
              <span style={{ color: "#C62828" }}>💰</span>
              Control de ventas
            </button>

            <button
              style={styles.menuItem}
              onClick={() => {
                setMenuAbierto(false)
                alert("Estadísticas de pagos en proceso.")
              }}
            >
              <span style={{ color: "#C62828" }}>📊</span>
              Estadísticas de pagos
            </button>

            <button
              style={styles.menuItem}
              onClick={() => {
                if (!clienteSeleccionado) {
                  alert("Selecciona un cliente primero")
                  return
                }

                setMostrarCrear(true)
                setMenuAbierto(false)
              }}
            >
              <span style={{ color: "#C62828" }}>➕</span>
              Agregar pedido rezagado
            </button>

            <button
              style={styles.menuItem}
              onClick={() => setMenuAbierto(false)}
            >
              <span style={{ color: "#C62828" }}>✖</span>
              Salir del menú
            </button>
          </div>
        </>
      )}
      
      <button
        style={styles.backTop}
        onClick={() => {
          if (clienteSeleccionado) {
            setClienteSeleccionado(null)
            setPedidos([])
            setBusquedaFolio("")
          } else {
            navigate("/")
          }
        }}
      >
        ⬅ Volver
      </button>
      
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: -5,
          marginBottom: 25
        }}
      >
        <img
          src={logo}
          alt="Pegatek"
          style={{
            width: 140,
            objectFit: "contain",
            marginBottom: 6
          }}
        />

        <h1
          style={{
            margin: 0,
            color: "#8B1E1E",
            fontSize: "28px",
            fontWeight: "bold",
            letterSpacing: "1px"
          }}
        >
          CUENTAS POR COBRAR
        </h1>
      </div>
      
      {!clienteSeleccionado && (
        <>
          <input
            placeholder="Buscar cliente..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            style={styles.field}
          />

          {clientes.map(c => (
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
            const id = p.tipo === "rezagado"
              ? p.id_rezagado
              : p.id_pedido

            const totalPagado = p.total_pagado || 0
            const saldo = p.total - totalPagado
            const pagado = saldo <= 0
            const dias = calcularDias(p.fecha_entrega)
            const colorStyle = getColorStyle(dias, pagado)
            const dataPago = pagosData[id] || {}

            return (
              <div
                key={id}
                style={{
                  ...styles.cardPedido,
                  ...colorStyle
                }}
              >
                <div
                  style={{
                    color: p.tipo === "rezagado" ? "#d97706" : "#071849",
                    fontWeight: "bold",
                    marginBottom: 5
                  }}
                >
                  {p.tipo === "rezagado"
                    ? "🟧 PEDIDO REZAGADO"
                    : "🟦 PEDIDO NORMAL"}
                </div>
                
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
                    onClick={() => setMostrarPago(id)}
                  >
                    Agregar abono
                  </button>
                )}

                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '8px' }}>
                  <button
                    style={{ ...styles.botonAccion, backgroundColor: '#444', marginTop: 0 }}
                    onClick={() => cargarDetalles(p)}
                  >
                    Ver detalles
                  </button>

                  <button
                    style={{
                      ...styles.botonAccion,
                      backgroundColor: '#002B49',
                      marginTop: 0,
                      fontWeight: 'bold'
                    }}
                    onClick={() => abrirModalNota(p)}
                  >
                    Ver Nota
                  </button>
                </div>

                {mostrarPago === id && (
                  <div>
                    <input
                      type="date"
                      value={dataPago.fecha_pago || ""}
                      onChange={e =>
                        setPagoField(id, "fecha_pago", e.target.value)
                      }
                      style={styles.field}
                    />
                    <input
                      placeholder="Monto"
                      value={dataPago.monto || ""}
                      onChange={e => setPagoField(id, "monto", e.target.value)}
                      style={styles.field}
                    />

                    <select
                      value={dataPago.metodo || "efectivo"}
                      onChange={e => setPagoField(id, "metodo", e.target.value)}
                      style={styles.field}
                    >
                      <option value="efectivo">Efectivo</option>
                      <option value="transferencia">Transferencia</option>
                    </select>

                    {(dataPago.metodo || "efectivo") === "transferencia" && (
                      <select
                        value={dataPago.cuenta || ""}
                        onChange={e => setPagoField(id, "cuenta", e.target.value)}
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
                        onChange={e => setPagoField(id, "nombreEntrega", e.target.value)}
                        style={styles.field}
                      />
                    )}

                    <button onClick={() => registrarPago(p)} style={styles.botonAccion}>
                      Confirmar
                    </button>
                  </div>
                )}

                {verDetalles === id && (
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
            padding: "30px",
            borderRadius: 12,
            width: "700px",
            maxHeight: "90vh",
            overflowY: "auto",
            boxShadow: "0 10px 35px rgba(0,0,0,.25)"
          }}>
            <div
              style={{
                position: "relative",
                marginBottom: 30,
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <img
                src={logo}
                alt="Pegatek"
                style={{
                  position: "absolute",
                  left: 0,
                  width: 90,
                  objectFit: "contain"
                }}
              />

              <h2
                style={{
                  margin: 0,
                  color: "#071849",
                  fontSize: 32,
                  fontWeight: "bold"
                }}
              >
                PEDIDO REZAGADO
              </h2>
            </div>

            <div
              style={{
                background: "#FFF8E1",
                border: "2px solid #FFC107",
                borderLeft: "8px solid #FF9800",
                borderRadius: 10,
                padding: 20,
                marginBottom: 30
              }}
            >
              <div
                style={{
                  textAlign: "center",
                  color: "#B00020",
                  fontWeight: "bold",
                  fontSize: 22,
                  marginBottom: 15
                }}
              >
                ⚠️ MUY IMPORTANTE – PATRÓN YAHIR
              </div>

              <div
                style={{
                  textAlign: "center",
                  fontSize: 16,
                  lineHeight: 1.7,
                  color: "#6D4C41"
                }}
              >
                Este apartado se utiliza únicamente para registrar pedidos atrasados
                (anteriores a junio de 2026) que no fueron capturados en SCAE.
              </div>

              <div
                style={{
                  marginTop: 18,
                  textAlign: "center",
                  color: "#0B7A0B",
                  fontWeight: "bold",
                  fontSize: 18
                }}
              >
                ✅ Verifica primero que tu pedido no esté en el sistema.
              </div>

              <div
                style={{
                  marginTop: 12,
                  textAlign: "center",
                  color: "#B00020",
                  fontWeight: "bold",
                  fontSize: 17
                }}
              >
                📌 Recuerda que el folio no debe repetirse, de lo contrario se marcará error.
              </div>
            </div>
           
            {!nuevoPedido.folio && (
              <div
                style={{
                  color: "#B00020",
                  fontSize: 13,
                  marginBottom: 10,
                  marginTop: 20,
                  fontWeight: "bold"
                }}
              >
                Ingresa el folio correspondiente a este pedido.
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

            {!nuevoPedido.fecha_entrega && (
              <div
                style={{
                  color: "#B00020",
                  fontSize: 13,
                  marginTop: 22,
                  marginBottom: 10,
                  fontWeight: "bold"
                }}
              >
                Selecciona la fecha en que el chofer entregó físicamente el pedido.
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

            <input
              placeholder="Buscar producto..."
              onChange={e => buscarProducto(e.target.value)}
              style={{
                ...styles.field,
                marginTop: 25
              }}
            />
            
            {nuevoPedido.productos.map((p, i) => (
              <div key={i} style={{
                marginTop: 12,
                padding: 12,
                border: "1px solid #eee",
                borderRadius: 6,
                position: "relative"
              }}>
                <button
                  onClick={() => eliminarProducto(i)}
                  style={{
                    position: "absolute",
                    top: 5,
                    right: 5,
                    background: "#ff4d4f",
                    color: "#fff",
                    border: "none",
                    borderRadius: "50%",
                    width: 22,
                    height: 22,
                    fontSize: 14,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer"
                  }}
                >
                  ×
                </button>
                  
                <div style={{ fontWeight: "bold" }}>{p.nombre}</div>

                <div style={{
                  display: "flex",
                  gap: 10,
                  marginTop: 5,
                  alignItems: "flex-end"
                }}>
                  <input
                    type="number"
                    placeholder="Cantidad"
                    value={p.cantidad}
                    onChange={e => {
                      const valor = e.target.value
                      cambiarCantidad(i, valor === "" ? "" : Number(valor))
                    }} 
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
                        const valor = e.target.value
                        nuevos[i].precio = valor === "" ? "" : Number(valor)
                        setNuevoPedido(prev => ({ ...prev, productos: nuevos }))
                      }}
                      style={{ ...styles.field, maxWidth: 120 }}
                    />
                  </div>
                </div>

                <div style={{ fontSize: 12, marginTop: 5 }}>
                  Subtotal: ${(p.precio || 0) * (p.cantidad || 0)}
                </div>
              </div>
            ))}
            
            <h3
              style={{
                marginTop: 30,
                textAlign: "right",
                color: "#071849",
                fontSize: 26
              }}
            >
              TOTAL: ${totalPedido.toFixed(2)}
            </h3>

            <div style={{ display: "flex", gap: 10, marginTop: 15 }}>
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
                style={styles.botonAccion}
                onClick={guardarPedido}
              >
                Guardar pedido rezagado
              </button>
            </div>

            {resultadosBusqueda.map((prod, i) => (
              <div key={i} style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "8px",
                background: "#fafafa",
                border: "1px solid #eee",
                borderRadius: 6,
                marginBottom: 5
              }}>
                {prod.nombre}
                <button
                  onClick={() => {
                    const yaExiste = nuevoPedido.productos.find(
                      p => p.id_producto === prod.id_producto
                    )
                    if (yaExiste) {
                      alert("Este producto ya está agregado")
                      return
                    }
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
                  style={{
                    backgroundColor: "#071849",
                    color: "#fff",
                    border: "none",
                    padding: "5px 10px",
                    borderRadius: "5px",
                    cursor: "pointer"
                  }}
                >
                  Agregar
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ⬇️ MODAL NOTA (DENTRO DEL CONTENEDOR PRINCIPAL) ⬇️ */}
      {mostrarModalNota && (
        <div style={styles.overlay}>
          <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: '#fff',
            padding: '24px',
            borderRadius: '8px',
            width: '650px',
            maxWidth: '95%',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
            zIndex: 1000
          }}>
            <h2 style={{ color: '#8B1E1E', marginBottom: '15px', borderBottom: '2px solid #8B1E1E', paddingBottom: '8px' }}>
              Detalles de la Nota (Pedido #{pedidoSeleccionadoNota?.id_pedido})
            </h2>

            {cargandoNota ? (
              <p style={{ textAlign: 'center', padding: '20px' }}>Cargando información de la nota...</p>
            ) : (
              <>
                <div style={{ background: '#f8f9fa', padding: '12px 16px', borderRadius: '6px', marginBottom: '15px', fontSize: '14px', border: '1px solid #e9ecef' }}>
                  <p style={{ margin: '4px 0' }}><strong>Cliente:</strong> {detalleNota[0]?.cliente || pedidoSeleccionadoNota?.cliente || 'N/A'}</p>
                  <p style={{ margin: '4px 0' }}><strong>Folio Entrega:</strong> {detalleNota[0]?.folio_entrega || 'N/A'}</p>
                  <p style={{ margin: '4px 0' }}>
                    <strong>Fecha Salida (Embarque):</strong> {detalleNota[0]?.fecha_salida ? new Date(detalleNota[0].fecha_salida).toLocaleString('es-MX') : 'N/A'}
                  </p>
                  <p style={{ margin: '4px 0' }}>
                    <strong>Fecha Registro Entrega:</strong> {detalleNota[0]?.fecha_entrega ? new Date(detalleNota[0].fecha_entrega).toLocaleString('es-MX') : 'N/A'}
                  </p>
                </div>

                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                    <thead>
                      <tr style={{ background: '#8B1E1E', color: '#fff', fontSize: '14px' }}>
                        <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Producto</th>
                        <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>Cant. Final</th>
                        <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'right' }}>Precio Unit.</th>
                        <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'right' }}>Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {detalleNota.length === 0 ? (
                        <tr>
                          <td colSpan="4" style={{ textAlign: 'center', padding: '15px' }}>
                            No se encontraron productos registrados para este pedido.
                          </td>
                        </tr>
                      ) : (
                        detalleNota.map((item, index) => {
                          const cant = Number(item.cantidad_final || 0);
                          const precio = Number(item.precio_unitario || 0);
                          const subtotal = cant * precio;

                          return (
                            <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#ffffff' : '#f9f9f9', fontSize: '14px' }}>
                              <td style={{ padding: '8px 10px', border: '1px solid #ddd', fontWeight: '500' }}>{item.producto}</td>
                              <td style={{ padding: '8px 10px', border: '1px solid #ddd', textAlign: 'center' }}>{cant}</td>
                              <td style={{ padding: '8px 10px', border: '1px solid #ddd', textAlign: 'right' }}>${precio.toFixed(2)}</td>
                              <td style={{ padding: '8px 10px', border: '1px solid #ddd', textAlign: 'right', fontWeight: 'bold' }}>
                                ${subtotal.toFixed(2)}
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                    <tfoot>
                      <tr style={{ background: '#f1f1f1', fontWeight: 'bold' }}>
                        <td colSpan="3" style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'right', fontSize: '15px' }}>
                          TOTAL DE LA NOTA:
                        </td>
                        <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'right', color: '#8B1E1E', fontSize: '16px' }}>
                          ${(detalleNota[0]?.total_nota_actualizado ? Number(detalleNota[0].total_nota_actualizado) : 0).toFixed(2)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                <div style={{ marginTop: '20px', textAlign: 'right' }}>
                  <button
                    onClick={() => setMostrarModalNota(false)}
                    style={{
                      background: '#8B1E1E',
                      color: '#fff',
                      border: 'none',
                      padding: '8px 18px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: 'bold'
                    }}
                  >
                    Cerrar
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Pagos
