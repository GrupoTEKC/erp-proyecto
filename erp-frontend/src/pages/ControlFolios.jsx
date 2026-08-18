import { useNavigate } from "react-router-dom"

const styles = {
  page: {
    padding: "20px",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#ffffff",
    minHeight: "100vh"
  },
  backTop: {
    padding: "8px 12px",
    fontSize: "13px",
    backgroundColor: "#fff",
    color: "#8B1E1E",
    border: "1px solid #8B1E1E",
    borderRadius: "6px",
    cursor: "pointer",
    marginBottom: "20px"
  },
  titulo: {
    color: "#8B1E1E",
    fontSize: "28px",
    fontWeight: "bold"
  }
}

function ControlFolios() {
  const navigate = useNavigate()

  return (
    <div style={styles.page}>
      <button style={styles.backTop} onClick={() => navigate("/pagos")}>
        ⬅ Volver
      </button>

      <h1 style={styles.titulo}>CONTROL DE FOLIOS</h1>
      <p>Te encuentras en el apartado de Control de Folios.</p>
    </div>
  )
}

export default ControlFolios
