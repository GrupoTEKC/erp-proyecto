import { useState } from "react"

function Pagos() {

  // lista temporal de clientes
  const [clientes] = useState([
    { id: 1, nombre: "Juan Pérez" },
    { id: 2, nombre: "María López" },
    { id: 3, nombre: "Carlos Ramírez" },
    { id: 4, nombre: "Ana Torres" }
  ])

  const [busqueda, setBusqueda] = useState("")

  // filtrar clientes
  const clientesFiltrados = clientes.filter(cliente =>
    cliente.nombre.toLowerCase().includes(busqueda.toLowerCase())
  )

  return (
    <div style={{ padding: "20px" }}>

      <h1>Pagos</h1>

      {/* BUSCADOR */}
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Buscar cliente..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          style={{
            padding: "10px",
            width: "300px",
            borderRadius: "6px",
            border: "1px solid #ccc"
          }}
        />
      </div>

      {/* LISTA DE CLIENTES */}
      <div style={{
        background: "#fff",
        border: "1px solid #ddd",
        borderRadius: "6px"
      }}>
        {clientesFiltrados.map(cliente => (
          <div
            key={cliente.id}
            style={{
              padding: "12px",
              borderBottom: "1px solid #eee"
            }}
          >
            {cliente.nombre}
          </div>
        ))}
      </div>

    </div>
  )
}

export default Pagos
