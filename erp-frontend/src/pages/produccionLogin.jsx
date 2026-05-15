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
    width: '320px',
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
    marginBottom: '20px',
    color: '#071849'
  },
  input: {
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '6px',
    border: '1px solid #ccc'
  },
  button: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#8B1E1E',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer'
  },
  error: {
    color: 'red',
    marginBottom: '10px'
  }
}

function ProduccionLogin() {
  const navigate = useNavigate()

  const [usuario, setUsuario] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = () => {
    // 🔥 SUPERVISOR
    if (
      usuario === 'SupervisorJAM' &&
      password === 'nv0011I#_ja'
    ) {
      localStorage.setItem('produccion_auth', 'true')
      localStorage.setItem('produccion_rol', 'supervisor')

      alert('✅ Bienvenido Supervisor')

      navigate('/produccion')
      return
    }
    // ❌ ERROR
    setError('Usuario o contraseña incorrectos')
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <img src={logo} alt="Grupo TEKC" style={styles.logo} />

        <h2 style={styles.title}>Módulo de Producción</h2>

        <p style={{ marginBottom: '15px', color: '#555', fontSize: '13px' }}>
          Ingresa usuario y contraseña para comenzar a capturar la producción
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

export default ProduccionLogin
