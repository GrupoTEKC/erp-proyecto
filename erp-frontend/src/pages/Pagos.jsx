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
  backTop: {
    position: 'absolute',
    top: 20,
    left: 20,
    padding: '8px 12px',
    fontSize: '13px',
    backgroundColor: '#fff',
    color: '#8B1E1E',
    border: '1px solid #8B1E1E',
    borderRadius: '6px',
    cursor: 'pointer'
  },
  titleCenter: {
    textAlign: 'center',
    fontSize: '22px',
    fontWeight: 'bold',
    color: '#071849',
    letterSpacing: '1px',
    marginBottom: '20px'
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
    marginBottom: '10px'
  },
  cardPedido: {
    border: '1px solid #ddd',
    borderRadius: '6px',
    padding: '12px',
    marginBottom: '10px'
  },
  rojo: {
    border: '2px solid red'
  },
  amarillo: {
    border: '2px solid #FFD600'
  },
  gris: {
    border: '2px solid #ccc'
  },
  botonAccion: {
    marginTop: '8px',
    padding: '8px 12px',
    fontSize: '13px',
    backgroundColor: '#8B1E1E',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer'
  }
}

function Pagos() {
  const navigate = useNavigate()

  const [clientes, setClientes] = useState([])
  const [busqueda, setBusqueda] = useState("")
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null)
  const [pedidos, setPedidos] = useState([])
  const [busquedaFolio, setBusquedaFolio] = useState("")

  /* ================= CARGAR CLIENTES ================= */
  useEffect(() => {
    fetch(`${API}/clientes`)
      .then(res => res.json())
      .then(data => setClientes(data))
      .catch(err => console.error(err))
  }, [])

  /* ================= FILTRO CLIENTES ================= */
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

  /* ================= FORMATEAR FECHA ================= */
  const formatearFecha = (fecha) => {
    if (!fecha) return "-"
    return new Date(fecha).toLocaleDateString()
  }

  /* ================= LÓGICA DE COLORES ================= */
  const obtenerEstadoPago = (p) => {
    if (p.tipo_pedido === 'contado') return 'contado'
    if (!p.fecha_entrega) return 'sin_fecha'

    const hoy = new Date()
    const entrega = new Date(p.fecha_entrega)

    const dias = Math.floor((hoy - entrega) / (1000 * 60 * 60 * 24))

    if (dias >= 30) return 'vencido'
    if (dias >= 15) return 'medio'

    return 'normal'
  }

  /* ================= FILTRO FOLIO ================= */
  const pedidosFiltrados = pedidos.filter(p =>
    `${p.folio || p.id_pedido}`.toString().includes(busquedaFolio)
  )

  return (
    <div style={styles.page}>

      {/* BOTÓN ARRIBA IZQUIERDA */}
      <button style={styles.backTop} onClick={() => navigate("/")}>
        ⬅ Volver a clientes
      </button>

      {/* TÍTULO */}
      <h2 style={styles.titleCenter}>CUENTAS POR COBRAR</h2>

      {/* ================= CLIENTES ================= */}
      {!clienteSeleccionado && (
        <>
          <input
            type="text"
            placeholder="Buscar cliente o tienda..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            style={styles.field}
          />

          <div style={{ marginTop: 20 }}>
            {clientesFiltrados.map(c => (
              <div key={c.id_cliente} style={styles.card}>
                <b>{c.nombre} {c.apellido1}</b>
                <br />
                {c.nombre_tienda}
                <br />
                💰 Saldo: ${c.saldo_actual || 0}

                <br />
                <button
                  style={styles.botonAccion}
                  onClick={() => cargarPedidos(c)}
                >
                  Estado de cuenta
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ================= PEDIDOS ================= */}
      {clienteSeleccionado && (
        <div style={{ marginTop: 20 }}>

          <h3>
            {clienteSeleccionado.nombre} {clienteSeleccionado.apellido1}
          </h3>

          {/* 🔍 BUSCADOR FOLIO */}
          <input
            type="text"
            placeholder="Buscar folio..."
            value={busquedaFolio}
            onChange={(e) => setBusquedaFolio(e.target.value)}
            style={{ ...styles.field, marginBottom: '15px' }}
          />

          {pedidosFiltrados.map(p => {
            const estado = obtenerEstadoPago(p)

            return (
              <div
                key={p.id_pedido}
                style={{
                  ...styles.cardPedido,
                  ...(estado === 'vencido' ? styles.rojo : {}),
                  ...(estado === 'medio' ? styles.amarillo : {}),
                  ...(estado === 'contado' ? styles.gris : {})
                }}
              >
                <b>Folio: {p.folio || p.id_pedido}</b>
                <br />

                📅 Entrega: {formatearFecha(p.fecha_entrega)}
                <br />

                {/* CONTADO */}
                {p.tipo_pedido === 'contado' ? (
                  <div style={{ color: '#555', fontSize: '13px' }}>
                    VENCIMIENTO: No aplica (contado)
                  </div>
                ) : (
                  <div style={{ fontSize: '13px' }}>
                    Días desde entrega: {
                      p.fecha_entrega
                        ? Math.floor((new Date() - new Date(p.fecha_entrega)) / (1000 * 60 * 60 * 24))
                        : "-"
                    }
                  </div>
                )}

                <br />
                💰 Total: ${p.total}
                <br />
                💸 Pagado: ${p.total_pagado || 0}
                <br />
                🔻 Saldo: ${p.saldo || p.total}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Pagos
