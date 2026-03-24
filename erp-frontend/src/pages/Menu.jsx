import { Link } from 'react-router-dom'
import logo from '../assets/TRANSPARENTE.png'

// =========================
// 🎨 ESTILOS
// =========================
const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    backgroundColor: '#f5f5f5'
  },
  sidebar: {
    width: '240px',
    backgroundColor: '#ffffff',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    borderRight: '1px solid #ddd'
  },
  header: {
    marginBottom: '30px'
  },
  title: {
    fontSize: '34px',
    fontWeight: 'bold',
    color: '#071849',
    fontFamily: 'Arial, sans-serif',
    textAlign: 'center',
    marginBottom: '2px'
  },
  logo: {
    width: '120px',
    display: 'block',
    margin: '0 auto',
    marginTop: '0px'
  },
  subtitle: {
    marginTop: '8px',
    fontSize: '14px',
    color: '#000',
    textAlign: 'left'
  },
  menu: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  link: {
    textDecoration: 'none'
  },
  button: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px',
    fontSize: '15px',
    fontWeight: 'normal',
    backgroundColor: '#fff',
    color: '#8B1E1E',
    border: '1px solid #8B1E1E',
    borderRadius: '6px',
    cursor: 'pointer',
    textAlign: 'left',
    width: '100%'
  },
  icon: {
    color: '#000',
    fontSize: '18px'
  },
  content: {
    flex: 1,
    padding: '20px'
  }
}

// =========================
// 📋 COMPONENTE
// =========================
function Menu() {
  return (
    <div style={styles.container}>
      
      <aside style={styles.sidebar}>
        
        <div style={styles.header}>
          <div style={styles.title}>SCAE-MT</div>

          <img
            src={logo}
            alt="Logo empresa"
            style={styles.logo}
          />

          <div style={styles.subtitle}>
            Menú principal
          </div>
        </div>

        <nav style={styles.menu}>

          <Link to="/pedidos" style={styles.link}>
            <button style={styles.button}>
              <span style={styles.icon}>📄</span>
              Nuevo pedido
            </button>
          </Link>

          <Link to="/pedidos/consultar" style={styles.link}>
            <button style={styles.button}>
              <span style={styles.icon}>🔍</span>
              Embarques
            </button>
          </Link>

          <Link to="/clientes" style={styles.link}>
            <button style={styles.button}>
              <span style={styles.icon}>👥</span>
              Clientes
            </button>
          </Link>

          <Link to="/pagos" style={styles.link}>
            <button style={styles.button}>
              <span style={styles.icon}>💵</span>
              Pagos
            </button>
          </Link>

        </nav>

      </aside>

      <main style={styles.content}>
        {/* Dashboard futuro */}
      </main>

    </div>
  )
}

export default Menu
