import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import logo from "../assets/TRANSPARENTE.png"

const API = "https://erp-proyecto-production.up.railway.app"

const styles = {
  page: {
    backgroundColor: "#ffffff",
    minHeight: "100vh",
    padding: "20px",
    fontFamily: "Arial, sans-serif"
  },
  backTop: {
    padding: "8px 12px",
    fontSize: "13px",
    backgroundColor: "#fff",
    color: "#8B1E1E",
    border: "1px solid #8B1E1E",
    borderRadius: "6px",
    cursor: "pointer"
  },
  resumen: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
    gap: "15px",
    marginTop: "30px",
    marginBottom: "30px"
  },
  card: {
    background: "#fff",
    border: "1px solid #ddd",
    borderRadius: "10px",
    padding: "20px",
    textAlign: "center",
    boxShadow: "0 2px 8px rgba(0,0,0,.08)"
  },
  numero: {
    color: "#8B1E1E",
    fontSize: "28px",
    margin: 0
  },
  tableContainer: {
    marginTop: 40,
    background: "#fff",
    borderRadius: 10,
    overflow: "hidden",
    boxShadow: "0 2px 10px rgba(0,0,0,.08)"
  },
  table: {
    width: "100%",
    borderCollapse: "collapse"
  },
  thead: {
    background: "#8B1E1E",
    color: "#fff"
  },
  th: {
    padding: "14px",
    textAlign: "left",
    fontSize: 15
  },
  td: {
    padding: "12px",
    borderBottom: "1px solid #eee",
    fontSize: 14
  },
  pendiente: {
    color: "#C62828",
    fontWeight: "bold"
  },
  pagado: {
    color: "#2E7D32",
    fontWeight: "bold"
  },
  btnVerAccion: {
    backgroundColor: "transparent",
    color: "#8B1E1E",
    border: "1px solid #8B1E1E",
    padding: "4px 8px",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "12px"
  },
  inputBusqueda: {
    padding: "10px 14px",
    fontSize: "14px",
    borderRadius: "6px",
    border: "1.5px solid #8B1E1E",
    color: "#333",
    width: "100%",
    maxWidth: "320px",
    outline: "none"
  }
}

function ControlVentas() {
  const navigate = useNavigate()

  const [datos, setDatos] = useState({
    resumen: {},
    clientes: []
  })

  const [pendientes, setPendientes] = useState([])
  const [cantidadesInput, setCantidadesInput] = useState({})
  const [cargando, setCargando] = useState(true)
  const [busqueda, setBusqueda] = useState("")
  const [fechaInicio, setFechaInicio] = useState("")
  const [fechaFin, setFechaFin] = useState("")
  const [estatusFiltro, setEstatusFiltro] = useState("todos")

  useEffect(() => {
    const inicializar = async () => {
      setCargando(true)
      await Promise.all([cargarControlVentas(), cargarPendientes()])
      setCargando(false)
    }
    inicializar()
  }, [])

  const cargarControlVentas = async () => {
    try {
      const res = await fetch(`${API}/control-ventas`)
      if (!res.ok) throw new Error("Error en la carga de control de ventas")
      const data = await res.json()
      setDatos(data)
    } catch (err) {
      console.error(err)
      alert("No fue posible cargar el control de ventas.")
    }
  }

  const cargarPendientes = async () => {
    try {
      const res = await fetch(`${API}/control-ventas/cantidades-pendientes`)
      if (!res.ok) throw new Error("Error en la carga de pendientes")
      const data = await res.json()
      setPendientes(data)

      const cantidadesIniciales = {}
      data.forEach((item) => {
        cantidadesIniciales[item.id_detalle] = item.cantidad_final ?? 0
      })
      setCantidadesInput(cantidadesIniciales)
    } catch (err) {
      console.error(err)
    }
  }

  const manejarCambioCantidad = (id_detalle, valor) => {
    setCantidadesInput((prev) => ({
      ...prev,
      [id_detalle]: valor
    }))
  }

  const guardarCantidadFinal = async (id_detalle) => {
    const cantidad_final = Number(cantidadesInput[id_detalle] || 0)

    try {
      const res = await fetch(`${API}/control-ventas/cantidad-final`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          id_detalle,
          cantidad_final
        })
      })

      if (!res.ok) {
        const data = await res.json()
        alert(data.error || "No fue posible guardar.")
        return
      }

      alert("Cantidad actualizada exitosamente.")
      await cargarControlVentas()
      await cargarPendientes()
    } catch (err) {
      console.error(err)
      alert("Error de conexión al guardar la cantidad")
    }
  }

  const irAPagosConCliente = (cliente) => {
    navigate("/pagos", { state: { cliente } })
  }

  // 🟢 CLIENTES FILTRADOS POR BUSQUEDA, FECHAS Y ESTATUS
  const clientesFiltrados = datos.clientes
    .filter((cliente) => Number(cliente.pedidos) > 0)
    .filter((cliente) =>
      cliente.cliente.toLowerCase().includes(busqueda.toLowerCase())
    )
    .filter((cliente) => {
      if (!fechaInicio && !fechaFin) return true
      if (!cliente.ultima_entrega) return false

      const fechaCliente = new Date(cliente.ultima_entrega)
        .toISOString()
        .split("T")[0]

      if (fechaInicio && fechaCliente < fechaInicio) return false
      if (fechaFin && fechaCliente > fechaFin) return false

      return true
    })
    .filter((cliente) => {
      if (estatusFiltro === "todos") return true
      return cliente.estatus === estatusFiltro
    })

  // 🟢 TOTALES CALCULADOS DINÁMICAMENTE PARA LOS CLIENTES VISIBLES
  const totalVendidoVisibles = clientesFiltrados.reduce(
    (acc, item) => acc + Number(item.vendido || 0),
    0
  )
  const totalCobradoVisibles = clientesFiltrados.reduce(
    (acc, item) => acc + Number(item.cobrado || 0),
    0
  )
  const totalDeudaVisibles = clientesFiltrados.reduce(
    (acc, item) => acc + Number(item.deuda || 0),
    0
  )

  if (cargando) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontSize: "24px"
        }}
      >
        Cargando...
      </div>
    )
  }

  return (
    <div style={styles.page}>
      <button style={styles.backTop} onClick={() => navigate("/pagos")}>
        ⬅ Volver
      </button>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: -5,
          marginBottom: 35
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
          CONTROL DE VENTAS
        </h1>
      </div>

      {/* TARJETAS RESUMEN */}
      <div style={styles.resumen}>
        <div style={styles.card}>
          <h3>Total clientes</h3>
          <h2 style={styles.numero}>{datos.resumen.clientes || 0}</h2>
        </div>

        <div style={styles.card}>
          <h3>Total vendido</h3>
          <h2 style={styles.numero}>
            $
            {Number(datos.resumen.vendido || 0).toLocaleString("es-MX", {
              minimumFractionDigits: 2
            })}
          </h2>
        </div>

        <div style={styles.card}>
          <h3>Total cobrado</h3>
          <h2 style={{ ...styles.numero, color: "#0B7A0B" }}>
            $
            {Number(datos.resumen.cobrado || 0).toLocaleString("es-MX", {
              minimumFractionDigits: 2
            })}
          </h2>
        </div>

        <div style={styles.card}>
          <h3>Deuda total</h3>
          <h2 style={{ ...styles.numero, color: "#B00020" }}>
            $
            {Number(datos.resumen.deuda || 0).toLocaleString("es-MX", {
              minimumFractionDigits: 2
            })}
          </h2>
        </div>
      </div>

      {/* 🟢 BARRA DE FILTROS (IZQUIERDA Y DERECHA) */}
      <div
        style={{
          display: "flex",
          gap: "15px",
          alignItems: "center",
          flexWrap: "wrap",
          marginBottom: -25
        }}
      >
        {/* Buscador de Cliente */}
        <input
          type="text"
          placeholder="🔍 Buscar cliente..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          style={styles.inputBusqueda}
        />

        {/* Filtro Fecha Inicio */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <label style={{ fontSize: "13px", fontWeight: "bold", color: "#8B1E1E" }}>
            Desde:
          </label>
          <input
            type="date"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
            style={{ ...styles.inputBusqueda, maxWidth: "160px" }}
          />
        </div>

        {/* Filtro Fecha Fin */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <label style={{ fontSize: "13px", fontWeight: "bold", color: "#8B1E1E" }}>
            Hasta:
          </label>
          <input
            type="date"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
            style={{ ...styles.inputBusqueda, maxWidth: "160px" }}
          />
        </div>

        {/* Botón para limpiar fechas */}
        {(fechaInicio || fechaFin) && (
          <button
            onClick={() => {
              setFechaInicio("")
              setFechaFin("")
            }}
            style={{
              backgroundColor: "transparent",
              color: "#8B1E1E",
              border: "none",
              cursor: "pointer",
              fontSize: "12px",
              textDecoration: "underline",
              fontWeight: "bold"
            }}
          >
            Limpiar fechas
          </button>
        )}

        {/* 🟢 FILTRO DE ESTATUS ALINEADO A LA DERECHA */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginLeft: "auto" }}>
          <label style={{ fontSize: "13px", fontWeight: "bold", color: "#8B1E1E" }}>
            Estatus:
          </label>
          <select
            value={estatusFiltro}
            onChange={(e) => setEstatusFiltro(e.target.value)}
            style={{
              ...styles.inputBusqueda,
              maxWidth: "150px",
              cursor: "pointer"
            }}
          >
            <option value="todos">Todos</option>
            <option value="pendiente">Pendientes</option>
            <option value="pagado">Pagados</option>
          </select>
        </div>
      </div>

      {/* TABLA PRINCIPAL */}
      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead style={styles.thead}>
            <tr>
              <th style={styles.th}>Cliente</th>
              <th style={styles.th}>Última entrega</th>
              <th style={styles.th}>Pedidos</th>
              <th style={styles.th}>Vendido</th>
              <th style={styles.th}>Cobrado</th>
              <th style={styles.th}>Deuda</th>
              <th style={styles.th}>Acción</th>
              <th style={styles.th}>Estatus</th>
            </tr>
          </thead>

          <tbody>
            {clientesFiltrados.map((cliente) => (
              <tr key={cliente.id_cliente}>
                <td style={styles.td}>{cliente.cliente}</td>
                <td style={styles.td}>
                  {cliente.ultima_entrega
                    ? new Date(cliente.ultima_entrega).toLocaleDateString("es-MX", {
                        timeZone: "UTC"
                      })
                    : "-"}
                </td>
                <td style={styles.td}>{cliente.pedidos}</td>
                <td style={styles.td}>
                  $
                  {Number(cliente.vendido || 0).toLocaleString("es-MX", {
                    minimumFractionDigits: 2
                  })}
                </td>
                <td style={styles.td}>
                  $
                  {Number(cliente.cobrado || 0).toLocaleString("es-MX", {
                    minimumFractionDigits: 2
                  })}
                </td>
                <td style={styles.td}>
                  $
                  {Number(cliente.deuda || 0).toLocaleString("es-MX", {
                    minimumFractionDigits: 2
                  })}
                </td>
                <td style={styles.td}>
                  <button
                    onClick={() => irAPagosConCliente(cliente)}
                    style={styles.btnVerAccion}
                  >
                    👁️ Ver detalles
                  </button>
                </td>
                <td
                  style={{
                    ...styles.td,
                    ...(cliente.estatus === "pagado"
                      ? styles.pagado
                      : styles.pendiente)
                  }}
                >
                  {cliente.estatus === "pagado"
                    ? "🟢 Pagado"
                    : "🟡 Pendiente"}
                </td>
              </tr>
            ))}
          </tbody>

          {/* 🟢 PIE DE TABLA CON SUMAS DE CLIENTES VISIBLES */}
          <tfoot
            style={{
              background: "#f8f9fa",
              fontWeight: "bold",
              borderTop: "2px solid #8B1E1E"
            }}
          >
            <tr>
              <td colSpan={3} style={{ ...styles.td, textAlign: "right" }}>
                <strong>TOTALES GENERALES:</strong>
              </td>
              <td style={{ ...styles.td, color: "#8B1E1E" }}>
                $
                {totalVendidoVisibles.toLocaleString("es-MX", {
                  minimumFractionDigits: 2
                })}
              </td>
              <td style={{ ...styles.td, color: "#0B7A0B" }}>
                $
                {totalCobradoVisibles.toLocaleString("es-MX", {
                  minimumFractionDigits: 2
                })}
              </td>
              <td style={{ ...styles.td, color: "#B00020" }}>
                $
                {totalDeudaVisibles.toLocaleString("es-MX", {
                  minimumFractionDigits: 2
                })}
              </td>
              <td colSpan={2} style={styles.td}></td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* TABLA DE SANEAMIENTO */}
      <div style={styles.tableContainer}>
        <h2 style={{ padding: 20, margin: 0, color: "#8B1E1E" }}>
          SANEAMIENTO DE DATOS
        </h2>
        <table style={styles.table}>
          <thead style={styles.thead}>
            <tr>
              <th style={styles.th}>Folio</th>
              <th style={styles.th}>Cliente</th>
              <th style={styles.th}>Producto</th>
              <th style={styles.th}>Entregada</th>
              <th style={styles.th}>Cantidad final</th>
              <th style={styles.th}>Guardar</th>
            </tr>
          </thead>
          <tbody>
            {pendientes.length === 0 && (
              <tr>
                <td colSpan={6} style={{ padding: 20, textAlign: "center" }}>
                  No existen pedidos pendientes de saneamiento.
                </td>
              </tr>
            )}
            {pendientes.map((item) => (
              <tr key={item.id_detalle}>
                <td style={styles.td}>{item.folio}</td>
                <td style={styles.td}>{item.cliente}</td>
                <td style={styles.td}>{item.producto}</td>
                <td style={styles.td}>{item.cantidad_entregada}</td>
                <td style={styles.td}>
                  <input
                    type="number"
                    value={cantidadesInput[item.id_detalle] ?? ""}
                    onChange={(e) =>
                      manejarCambioCantidad(item.id_detalle, e.target.value)
                    }
                    style={{
                      width: 90,
                      padding: "6px",
                      borderRadius: "4px",
                      border: "1px solid #ccc",
                      textAlign: "center"
                    }}
                  />
                </td>
                <td style={styles.td}>
                  <button
                    onClick={() => guardarCantidadFinal(item.id_detalle)}
                    style={{
                      backgroundColor: "#2E7D32",
                      color: "#ffffff",
                      border: "none",
                      padding: "6px 14px",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontWeight: "bold",
                      fontSize: "13px"
                    }}
                  >
                    Guardar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ControlVentas
