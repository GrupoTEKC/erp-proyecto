import { useState } from "react"
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
  },
  cardProceso: {
    border: '2px dashed #8B1E1E',
    backgroundColor: '#fff8f8',
    borderRadius: '10px',
    padding: '40px 20px',
    textAlign: 'center',
    maxWidth: '600px',
    margin: '30px auto'
  }
}

function CuentasPorPagar() {
  const navigate = useNavigate()
  const [menuAbierto, setMenuAbierto] = useState(false)

  return (
    <div style={styles.page}>
      {/* 🍔 BOTÓN DE MENÚ */}
      {!menuAbierto && (
        <button
          style={styles.hamburger}
          onClick={() => setMenuAbierto(true)}
        >
          ☰
        </button>
      )}

      {/* 📂 DESPLEGABLE DE MENÚ */}
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
                navigate("/cuentas-por-pagar")
              }}
            >
              <span style={{ color: "#C62828" }}>💳</span>
              Cuentas por pagar
            </button>

            <button
              style={styles.menuItem}
              onClick={() => {
                setMenuAbierto(false)
                navigate("/flujo-caja")
              }}
            >
              <span style={{ color: "#C62828" }}>$</span>
              Flujo de caja
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

      {/* ⬅ BOTÓN VOLVER */}
      <button
        style={styles.backTop}
        onClick={() => navigate("/")}
      >
        ⬅ Volver al Menú Principal
      </button>

      {/* 🔵 ENCABEZADO Y LOGO */}
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
          CUENTAS POR PAGAR
        </h1>
      </div>

      {/* 🚧 VISTA TEMPORAL EN PROCESO */}
      <div style={styles.cardProceso}>
        <div style={{ fontSize: "50px", marginBottom: "10px" }}>⚙️</div>
        <h2 style={{ color: "#8B1E1E", margin: "0 0 10px 0" }}>
          Cuentas por pagar en proceso
        </h2>
        <p style={{ color: "#555", fontSize: "16px", margin: 0 }}>
          Este módulo se encuentra en fase de desarrollo para la gestión de préstamos, pasivos y control de acreedores.
        </p>
      </div>
    </div>
  )
}

export default CuentasPorPagar
