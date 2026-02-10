import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

function Clientes() {
  const [clientes, setClientes] = useState([])
  const [busqueda, setBusqueda] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    fetch('http://localhost:3001/clientes')
      .then(res => res.json())
      .then(data => setClientes(data))
  }, [])

  // 🔎 FILTRO DE CLIENTES
  const clientesFiltrados = clientes.filter(c =>
    `${c.nombre} ${c.nombre_tienda} ${c.telefono} ${c.rfc}`
      .toLowerCase()
      .includes(busqueda.toLowerCase())
  )

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

      {/* 🔎 BUSCADOR */}
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
