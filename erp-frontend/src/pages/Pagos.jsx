 import { useEffect, useState } from "react"

const API = "https://erp-proyecto-production.up.railway.app"

function Pagos() {

  const [clientes, setClientes] = useState([])
  const [busqueda, setBusqueda] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null)
  const [pedidos, setPedidos] = useState([])

 
  /* ================= CARGAR CLIENTES ================= */

  useEffect(() => {

    const cargarClientes = async () => {

      try {

        setLoading(true)
        setError(null)

        const res = await fetch(`${API}/clientes`)

        if (!res.ok) throw new Error("Error cargando clientes")

        const data = await res.json()

        setClientes(data)

      } catch (err) {

        setError(err.message)

      } finally {

        setLoading(false)

      }

    }

    cargarClientes()

  }, [])

  /* ================= FILTRO ================= */

  const term = busqueda.toLowerCase()

  const clientesFiltrados = clientes.filter(c =>
    `${c.nombre} ${c.apellido1} ${c.apellido2} ${c.nombre_tienda} ${c.apodo}`
      .toLowerCase()
      .includes(term)
  )

 const cargarPedidos = async (cliente) => {

  setClienteSeleccionado(cliente)

  try {

    const res = await fetch(`${API}/pedidos/cliente/${cliente.id_cliente}`)

    const data = await res.json()

    setPedidos(data)

  } catch (err) {

    console.error(err)

  }

}

  return (

    <div style={{ padding: 20 }}>

      <h2>Módulo de Pagos</h2>

      <input
        type="text"
        placeholder="Buscar cliente o tienda..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        style={{
          width: "100%",
          padding: 10,
          borderRadius: 6,
          border: "1px solid #8B1E1E",
          marginBottom: 20
        }}
      />

      {loading && <p>Cargando clientes...</p>}

      {error && <p style={{ color: "red" }}>⚠️ Error: {error}</p>}

      {!loading && !error && (

        <div style={{
          border: "1px solid #ddd",
          borderRadius: 6
        }}>

          {clientesFiltrados.length === 0 ? (

            <p style={{ padding: 15 }}>
              No se encontraron clientes
            </p>

          ) : (

            clientesFiltrados.map(c => (

             <div
             key={c.id_cliente}
             onClick={() => cargarPedidos(c)}
             style={{
             padding: 12,
             borderBottom: "1px solid #eee",
             cursor: "pointer"
             }}
             >

                <b>
                  {c.nombre} {c.apellido1} {c.apellido2}
                </b>

                <br />

                {c.nombre_tienda}

                <br />

                Saldo actual: ${c.saldo_actual}

              </div>

            ))

          )}

        </div>

      )}

    </div>

  )

}

export default Pagos
