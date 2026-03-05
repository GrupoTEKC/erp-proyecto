import { useState, useEffect } from "react"

function Pagos() {

  const [clientes, setClientes] = useState([])
  const [busqueda, setBusqueda] = useState("")

  useEffect(() => {
    fetch("http://localhost:3001/clientes")
      .then(res => res.json())
      .then(data => setClientes(data))
      .catch(err => console.log(err))
  }, [])

  const clientesFiltrados = clientes.filter(cliente =>
    `${cliente.nombre} ${cliente.apellido1} ${cliente.apellido2} ${cliente.nombre_tienda}`
      .toLowerCase()
      .includes(busqueda.toLowerCase())
  )

  return (
    <div style={{ padding: "20px" }}>

      <h1>Pagos</h1>

      {/* BUSCADOR */}
      <input
        type="text"
        placeholder="Buscar cliente o tienda..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        style={{
          padding: "10px",
          width: "300px",
          marginBottom: "20px"
        }}
      />

      {/* LISTA DE CLIENTES */}
      <div style={{
        background: "#fff",
        border: "1px solid #ddd",
        borderRadius: "6px"
      }}>

        {clientesFiltrados.map(cliente => (

          <div
            key={cliente.id_cliente}
            style={{
              padding: "12px",
              borderBottom: "1px solid #eee"
            }}
          >

            <b>
              {cliente.nombre} {cliente.apellido1} {cliente.apellido2}
            </b>

            <br />

            {cliente.nombre_tienda}

            <br />

            Saldo: ${cliente.saldo_actual}

          </div>

        ))}

      </div>

    </div>
  )
}

export default Pagos
