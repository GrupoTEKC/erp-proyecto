import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API = 'https://erp-proyecto-production.up.railway.app'

const styles = {
  container: {
    padding: 20
  },
  title: {
    fontSize: 22,
    marginBottom: 20,
    color: '#071849'
  },
  card: {
    border: '1px solid #8B1E1E',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    cursor: 'pointer'
  },
  nombre: {
    fontWeight: 'bold',
    color: '#8B1E1E'
  },

  volver: {
  display: 'inline-flex',
  alignItems: 'center',
  padding: '10px 14px',
  fontSize: '14px',
  backgroundColor: '#fff',
  color: '#8B1E1E',
  border: '1px solid #8B1E1E',
  borderRadius: '6px',
  cursor: 'pointer',
  marginBottom: '20px'
},
  
  boton: {
    marginTop: 10,
    padding: '6px 10px',
    border: 'none',
    borderRadius: 6,
    backgroundColor: '#8B1E1E',
    color: '#fff',
    cursor: 'pointer'
  }
}

function ControlEnvios() {
  const [choferes, setChoferes] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const cargarChoferes = async () => {
      try {
        const res = await fetch(`${API}/choferes`)
        const data = await res.json()
        setChoferes(data)
      } catch (err) {
        console.error('Error cargando choferes:', err)
      }
    }

    cargarChoferes()
  }, [])

 return (
  <div style={styles.container}>
    
    <button
      style={styles.volver}
      onClick={() => navigate('/')}
    >
      ← Volver al menú
    </button>

    <h2 style={styles.title}>Control de envíos</h2>

    {choferes.map(c => (
      <div key={c.id_chofer} style={styles.card}>
        <div style={styles.nombre}>
          {c.nombre} {c.apellido1} {c.apellido2}
        </div>
        <button
          style={styles.boton}
          onClick={() => navigate(`/control-envios/${c.id_chofer}`)}
        >
          Ver pedidos asignados
        </button>
      </div>
    ))}
    
  </div>
)
}

export default ControlEnvios
