import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/TRANSPARENTE.png'

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    fontFamily: 'Arial'
  },
  card: {
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '10px',
    width: '340px',
    textAlign: 'center',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
  },
  logo: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    objectFit: 'cover',
    marginBottom: '15px'
  },
  title: {
    margin: '0 0 5px 0',
    color: '#071849',
    fontSize: '22px'
  },
  subtitle: {
    margin: '0 0 20px 0',
    color: '#666',
    fontSize: '13px',
    lineHeight: '1.4'
  },
  input: {
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    boxSizing: 'border-box'
  },
  button: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#8B1E1E',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  error: {
    color: 'red',
    marginBottom: '10px',
    fontSize: '14px'
  }
}

function CuentasPorPagarLogin() {
  const navigate = useNavigate()

  const [usuario, setUsuario] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = () => {
    if (
      usuario === 'cuentxpag$$' &&
      password === 'cuentxpag*$1'
    ) {
      navigate('/cuentas-por-pagar')
    } else {
      setError('Usuario o contraseña incorrectos')
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>

        {/* 🔵 LOGO EN CÍRCULO */}
        <img src={logo} alt="Grupo TEKC" style={styles.logo} />

        <h2 style={styles.title}>Cuentas por pagar</h2>
        <p style={styles.subtitle}>
          Bienvenido a tus cuentas por pagar, administra tus pagos.
        </p>

        {error && <div style={styles.error}>{error}</div>}

        <input
          style={styles.input}
          placeholder="Usuario"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
        />

        <input
          type="password"
          style={styles.input}
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button style={styles.button} onClick={handleLogin}>
          Iniciar sesión
        </button>

      </div>
    </div>
  )
}

export default CuentasPorPagarLogin
