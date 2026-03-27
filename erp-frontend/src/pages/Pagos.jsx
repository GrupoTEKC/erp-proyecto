import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

const API = "https://erp-proyecto-production.up.railway.app"

/* ================= ESTILOS ================= */
const styles = {
  page: {
    backgroundColor: '#ffffff',
    minHeight: '100vh',
    padding: '20px',
    fontFamily: 'Arial, sans-serif'
  },
  header: { marginBottom: '20px' },
  backButton: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '10px 14px',
    fontSize: '14px',
    backgroundColor: '#fff',
    color: '#8B1E1E',
    border: '1px solid #8B1E1E',
    borderRadius: '6px',
    cursor: 'pointer'
  },
  title: {
    marginTop: '20px',
    marginBottom: '15px',
    color: '#071849',
    fontWeight: 'bold'
  },
  field: {
    width: '100%',
    maxWidth: '400px',
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #8B1E1E'
  },
  card: {
    border: '1px solid #ddd',
    borderRadius: '6px',
    padding: '12px',
    marginBottom: '10px',
    cursor: 'pointer'
  },
  cardPedido: {
    border: '1px solid #ddd',
    borderRadius: '6px',
    padding: '12px',
    marginBottom: '10px'
  },
  rojo: {
    border: '2px solid red'
  }
}

function Pagos() {
  const navigate = useNavigate()

  const [clientes, setClientes] = useState([])
  const [busqueda, setBusqueda] = useState("")
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null)
  const [pedidos, setPedidos] = useState([])

  /* ================= CARGAR CLIENTES ================= */
  useEffect(() => {
    fetch(`${API}/clientes`)
      .then(res => res.json())
      .then(data => setClientes(data))
      .catch(err => console.error(err))
  }, [])

  /* ================= FILTRO ================= */
  const clientesFiltrados = clientes.filter(c =>
    `${c.nombre} ${c.apellido1} ${c.apellido2} ${c.nombre_tienda} ${c.apodo}`
      .toLowerCase()
      .includes(busqueda.toLowerCase())
  )

  /* ================= CARGAR PEDIDOS ================= */
  const cargarPedidos = async (cliente) => {
    setClienteSeleccionado(cliente)

    const res = await fetch(`${API}/pedidos/cliente/${cliente.id_cliente}`)
    const data = await res.json()

    setPedidos(data)
  }

  /* ================= VALIDAR ROJO (30 días) ================= */
  const esVencido = (fecha_vencimiento) => {
    if (!fecha_vencimiento) return false
    const hoy = new Date()
    const venc = new Date(fecha_vencimiento)
    return hoy > venc
  }

  return (
    <div style={styles.page}>

      {/* HEADER */}
      <div style={styles.header}>
        <button style={styles.backButton} onClick={() => navigate("/")}>
          ⬅ Volver
        </button>

        <h2 style={styles.title}>Cuentas por cobrar</h2>
      </div>

      {/* BUSCADOR */}
      <input
        type="text"
        placeholder="Buscar cliente o tienda..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        style={styles.field}
      />

      {/* LISTA CLIENTES */}
      {!clienteSeleccionado && (
        <div style={{ marginTop: 20 }}>
          {clientesFiltrados.map(c => (
            <div
              key={c.id_cliente}
              style={styles.card}
              onClick={() => cargarPedidos(c)}
            >
              <b>{c.nombre} {c.apellido1}</b>
              <br />
              {c.nombre_tienda}
              <br />
              💰 Saldo: ${c.saldo_actual || 0}
            </div>
          ))}
        </div>
      )}

      {/* PEDIDOS DEL CLIENTE */}
      {clienteSeleccionado && (
        <div style={{ marginTop: 20 }}>

          <h3>
            {clienteSeleccionado.nombre} {clienteSeleccionado.apellido1}
          </h3>

          <button
            style={{ ...styles.backButton, marginBottom: 15 }}
            onClick={() => setClienteSeleccionado(null)}
          >
            ⬅ Volver a clientes
          </button>

          {pedidos.map(p => (
            <div
              key={p.id_pedido}
              style={{
                ...styles.cardPedido,
                ...(esVencido(p.fecha_vencimiento) ? styles.rojo : {})
              }}
            >
              <b>Folio #{p.id_pedido}</b>
              <br />
              📅 Entrega: {p.fecha_entrega || "-"}
              <br />
              ⏳ Vence: {p.fecha_vencimiento || "-"}
              <br />
              💰 Total: ${p.total}
              <br />
              💸 Pagado: ${p.total_pagado}
              <br />
              🔻 Saldo: ${p.saldo}
            </div>
          ))}
        </div>
      )}

    </div>
  )
}

export default Pagos
