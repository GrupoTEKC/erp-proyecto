import { useState } from "react"

function Pagos() {

  const [pedido, setPedido] = useState("")
  const [cliente, setCliente] = useState("Cliente ejemplo")
  const [total, setTotal] = useState(500)
  const [abonado, setAbonado] = useState(200)
  const [pago, setPago] = useState("")

  const saldo = total - abonado

  const registrarPago = () => {
    const nuevoAbono = abonado + Number(pago)
    setAbonado(nuevoAbono)
    setPago("")
  }

  return (
    <div style={{ padding: "20px" }}>
      
      <h1>Módulo de Pagos</h1>

      {/* BUSCAR PEDIDO */}
      <div style={{ marginBottom: "20px" }}>
        <label>Buscar pedido</label>
        <br />
        <input
          type="text"
          placeholder="Número de pedido"
          value={pedido}
          onChange={(e) => setPedido(e.target.value)}
          style={{ padding: "8px", width: "200px", marginTop: "5px" }}
        />
      </div>

      {/* INFORMACIÓN DEL PEDIDO */}
      <div style={{
        border: "1px solid #ddd",
        padding: "15px",
        borderRadius: "6px",
        marginBottom: "20px",
        background: "#fff"
      }}>
        <p><b>Cliente:</b> {cliente}</p>
        <p><b>Total pedido:</b> ${total}</p>
        <p><b>Abonado:</b> ${abonado}</p>
        <p><b>Saldo pendiente:</b> ${saldo}</p>
      </div>

      {/* REGISTRAR PAGO */}
      <div>
        <label>Registrar pago</label>
        <br />
        <input
          type="number"
          placeholder="Valor del pago"
          value={pago}
          onChange={(e) => setPago(e.target.value)}
          style={{ padding: "8px", width: "200px", marginTop: "5px" }}
        />

        <br /><br />

        <button
          onClick={registrarPago}
          style={{
            padding: "10px 20px",
            background: "#8B1E1E",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          Registrar pago
        </button>
      </div>

    </div>
  )
}

export default Pagos
