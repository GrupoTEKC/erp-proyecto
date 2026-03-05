import { useState, useEffect } from "react"

function Pagos() {

  const [clientes, setClientes] = useState([])
  const [busqueda, setBusqueda] = useState("")

  useEffect(() => {
    fetch("http://localhost:3000/clientes")
      .then(res => res.json())
      .then(data => setClientes(data))
      .catch(err => console.error(err))
  }, [])

  const clientesFiltrados = clientes.filter(c =>
    `${c.nombre} ${c.apellido1} ${c.apellido2} ${c.nombre_tienda}`
      .toLowerCase()
      .includes(busqueda.toLowerCase())
  )

  return (
    <div style={{ padding: "20px" }}>

      <h2>Pagos</h2>

      <input
        type="text"
        placeholder="Buscar cliente o tienda..."
        value={busqueda}
        onChange={(e)=>setBusqueda(e.target.value)}
        style={{
          padding:"10px",
          width:"300px",
          marginBottom:"20px"
        }}
      />

      {clientesFiltrados.map(cliente => (

        <div
          key={cliente.id_cliente}
          style={{
            border:"1px solid #ddd",
            padding:"10px",
            marginBottom:"10px",
            borderRadius:"6px"
          }}
        >

          <b>
            {cliente.nombre} {cliente.apellido1} {cliente.apellido2}
          </b>

          <br/>

          {cliente.nombre_tienda}

          <br/>

          Saldo actual: ${cliente.saldo_actual}

        </div>

      ))}

    </div>
  )
}

export default Pagos
