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

    </div>
  )

}

export default ControlVentas
