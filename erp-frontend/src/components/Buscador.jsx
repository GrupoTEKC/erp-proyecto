import { useEffect, useState } from 'react'

// 🎨 ESTILOS (solo visual)
const styles = {
  input: {
    padding: '10px 14px',
    fontSize: '14px',
    backgroundColor: '#fff',
    color: '#8B1E1E',
    border: '1px solid #8B1E1E',
    borderRadius: '6px',
    outline: 'none',
    width: '220px'
  },

  lista: {
    marginTop: '8px',
    width: '220px'
  },

  item: {
    padding: '6px 4px',
    cursor: 'pointer',
    borderBottom: '1px solid #eee',
    fontSize: '14px',
    fontWeight: 'normal',
    color: '#000000'
  },

  error: {
    color: 'red',
    fontSize: '13px'
  }
}

function Buscador({ onSelectCliente }) {
  const [clientes, setClientes] = useState([])
  const [busqueda, setBusqueda] = useState('')
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch('http://localhost:3001/clientes')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setClientes(data)
          setError(null)
        } else {
          setClientes([])
          setError('Respuesta inválida del servidor')
        }
      })
      .catch(() => {
        setError('No se pudieron cargar los clientes')
        setClientes([])
      })
  }, [])

  const clientesFiltrados = clientes.filter(c =>
    c.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
    c.tienda?.toLowerCase().includes(busqueda.toLowerCase()) ||
    c.email?.toLowerCase().includes(busqueda.toLowerCase())
  )

  return (
    <div>
      <input
        type="text"
        placeholder="Buscar cliente..."
        value={busqueda}
        onChange={e => setBusqueda(e.target.value)}
        style={styles.input}
      />

      {error && <p style={styles.error}>{error}</p>}

      <div style={styles.lista}>
        {clientesFiltrados.map(c => (
          <div
            key={c.id_cliente}
            onClick={() => onSelectCliente(c)}
            style={styles.item}
          >
            {c.nombre} — {c.tienda}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Buscador
