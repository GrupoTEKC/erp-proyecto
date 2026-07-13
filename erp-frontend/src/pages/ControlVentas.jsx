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
}
}

function ControlVentas() {

  const navigate = useNavigate()

  const [datos, setDatos] = useState({
    resumen: {},
    clientes: []
  })

  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    cargarControlVentas()
  }, [])

  const cargarControlVentas = async () => {
    try {

      const res = await fetch(`${API}/control-ventas`)

      if (!res.ok) {
        throw new Error("Error del servidor")
      }

      const data = await res.json()

      setDatos(data)

    } catch (err) {

      console.error(err)
      alert("No fue posible cargar el control de ventas.")

    } finally {

      setCargando(false)

    }
  }

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

      <button
        style={styles.backTop}
        onClick={() => navigate("/pagos")}
      >
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

      <div style={styles.resumen}>

        <div style={styles.card}>
          <h3>Total clientes</h3>
          <h2 style={styles.numero}>
            {datos.resumen.clientes || 0}
          </h2>
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
          <h2
            style={{
              ...styles.numero,
              color: "#0B7A0B"
            }}
          >
            $
            {Number(datos.resumen.cobrado || 0).toLocaleString("es-MX", {
              minimumFractionDigits: 2
            })}
          </h2>
        </div>

        <div style={styles.card}>
          <h3>Deuda total</h3>
          <h2
            style={{
              ...styles.numero,
              color: "#B00020"
            }}
          >
            $
            {Number(datos.resumen.deuda || 0).toLocaleString("es-MX", {
              minimumFractionDigits: 2
            })}
          </h2>
        </div>

      </div>

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

              <th style={styles.th}>Crédito</th>

              <th style={styles.th}>Estatus</th>

            </tr>
          </thead>

          <tbody>

           {datos.clientes
           .filter(cliente => Number(cliente.pedidos) > 0)
           .map(cliente => (

              <tr key={cliente.id_cliente}>

                <td style={styles.td}>
                  {cliente.cliente}
                </td>

                <td style={styles.td}>
                  {
                    cliente.ultima_entrega
                      ? new Date(cliente.ultima_entrega)
                          .toLocaleDateString("es-MX", {
                            timeZone: "UTC"
                          })
                      : "-"
                  }
                </td>

                <td style={styles.td}>
                  {cliente.pedidos}
                </td>

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
                  {cliente.credito || "-"}
                </td>

                <td
                  style={{
                    ...styles.td,
                    ...(cliente.estatus === "pagado"
                      ? styles.pagado
                      : styles.pendiente)
                  }}
                >
                  {
                    cliente.estatus === "pagado"
                      ? "🟢 Pagado"
                      : "🟡 Pendiente"
                  }
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
