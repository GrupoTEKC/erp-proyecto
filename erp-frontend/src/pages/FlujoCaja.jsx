import { useNavigate } from 'react-router-dom'
import logo from '../assets/TRANSPARENTE.png'

const vino = '#8B1E1E'

const styles = {
  page: {
    padding: 20,
    width: '85%',
    margin: '0 auto',
    textAlign: 'left',
    fontFamily: 'Arial, sans-serif'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30
  },
  leftSection: {
    flex: '1 1 0%',
    display: 'flex',
    justifyContent: 'flex-start'
  },
  centerSection: {
    flex: '2 1 0%',
    textAlign: 'center'
  },
  rightSection: {
    flex: '1 1 0%',
    display: 'flex',
    justifyContent: 'flex-end'
  },
  mainTitle: {
    color: vino,
    fontSize: 48,
    fontWeight: '900',
    letterSpacing: 2,
    margin: 0
  },
  logo: {
    height: 170
  },
  cancel: {
    background: '#fff',
    color: vino,
    border: `1px solid ${vino}`,
    padding: 10,
    borderRadius: 6,
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  cardProceso: {
    backgroundColor: '#fff3cd',
    border: '1px solid #ffeeba',
    borderRadius: '8px',
    padding: '30px',
    textAlign: 'center',
    marginTop: '20px'
  },
  subtitulo: {
    color: '#856404',
    margin: '0 0 10px 0'
  },
  textoInfo: {
    color: '#856404',
    margin: 0
  }
}

function FlujoCaja() {
  const navigate = useNavigate()

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        {/* Lado Izquierdo: Botón Volver */}
        <div style={styles.leftSection}>
          <button style={styles.cancel} onClick={() => navigate(-1)}>
            Volver
          </button>
        </div>

        {/* Centro: Título Centrado */}
        <div style={styles.centerSection}>
          <h1 style={styles.mainTitle}>FLUJO DE CAJA</h1>
        </div>

        {/* Lado Derecho: Logo alineado a la derecha */}
        <div style={styles.rightSection}>
          <img src={logo} alt="Logo" style={styles.logo} />
        </div>
      </header>

      {/* Contenido en Proceso */}
      <div style={styles.cardProceso}>
        <h3 style={styles.subtitulo}>🚧 Módulo en Proceso de Desarrollo</h3>
        <p style={styles.textoInfo}>
          Estás dentro del módulo de <strong>Flujo de Caja</strong>. Aquí iremos integrando progresivamente los componentes de Apertura/Cierre, Libro de Caja y los Flujos de Operación, Inversión y Financiamiento.
        </p>
      </div>
    </div>
  )
}

export default FlujoCaja
