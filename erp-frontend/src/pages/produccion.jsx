import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function Produccion() {
  const navigate = useNavigate()

  useEffect(() => {
    const auth = localStorage.getItem('produccion_auth')
    if (!auth) {
      navigate('/produccion-login')
    }
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('produccion_auth')
    navigate('/produccion-login')
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h2>Módulo de Producción</h2>
        <button 
          onClick={handleLogout}
          style={{
            backgroundColor: '#8B1E1E',
            color: '#fff',
            border: 'none',
            padding: '8px 12px',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          Cerrar sesión
        </button>
      </div>

      <p style={{ color: '#555' }}>
        Aquí podrás capturar la producción diaria, salidas, entradas y controlar el stock.
      </p>

      {/* 🔥 Aquí después vamos a meter la tabla tipo Excel */}
      
      <div style={{
        marginTop: '20px',
        padding: '20px',
        backgroundColor: '#fff',
        borderRadius: '10px',
        boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
      }}>
        <p>📊 Próximamente: Tabla de producción</p>
      </div>

    </div>
  )
}

export default Produccion
