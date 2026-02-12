import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

// 👉 URL DEL BACKEND EN PRODUCCIÓN (Railway)
const API = 'https://erp-proyecto-production.up.railway.app'

function Clientes() {
  const [clientes, setClientes] = useState([])
  const [busqueda, setBusqueda] = useState('')
  const navigate = useNavigate()

  // =========================
  // 🔄 CARGAR CLIENTES
  // =========================
  useEffect(() => {
    const cargarClientes = async () => {
      try {
        const res = await fetch(`${API}/clientes`)

        if (!res.ok) {
          throw new Error('Error al obtener clientes')
        }

        const data = await res.json()

        // Seguridad por si la API falla
        setClientes(Array.isArray(data) ? data : [])

      } catch (error) {
        console.error('❌ Error cargando clientes:', error)
        setClientes([])
      }
    }

    cargarClientes()
  }, [])

  // =========================
  // 🔎 FILTRO DE CLIENTES
  // =========================
  const clientesFiltrados = clientes.filter(c =>
    `${c.nombre || ''} ${c.nombre_tienda || ''} ${c.telefono || ''} ${c.rfc || ''}`
      .toLowerCase()
      .includes(busqueda.toLowerCase())
  )

  // =========================
  // 🎨 UI
  // =========================
  return (
    <div>

      {/* HEADER */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '15px'
        }}
      >
        <button onClick={() => navigate('/')}>
          ⬅ Volver al menú
        </button>

        <h2>Clientes</h2>

        <button onClick={() => navigate('/clientes/nuevo')}>
          ➕ Agregar cliente
        </button>
      </div>

      {/* BUSCADOR */}
      <input
        type="text"
        placeholder="Buscar cliente..."
        value={busqueda}
        onChange={e => setBusqueda(e.target.value)}
        style={{
          width: '100%',
          padding: '8px',
          marginBottom: '10px'
        }}
      />

      {/* TABLA */}
      <table border="1" cellPadding="8" width="100%">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Tienda</th>
            <th>Teléfono</th>
            <th>RFC</th>
            <th>Email</th>
            <th>Dirección</th>
            <th>Saldo</th>
          </tr>
        </thead>

        <tbody>
          {clientesFiltrados.map(c => (
            <tr key={c.id_cliente}>
              <td>{c.nombre}</td>
              <td>{c.nombre_tienda}</td>
              <td>{c.telefono}</td>
              <td>{c.rfc}</td>
              <td>{c.email}</td>
              <td>{c.direccion}</td>
              <td>${c.saldo_actual}</td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  )
}

export default Clientes
