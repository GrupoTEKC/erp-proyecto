import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

const API = 'https://erp-proyecto-production.up.railway.app'

const styles = {
  container: { padding: 20 },
  title: { fontSize: 22, marginBottom: 20, color: '#071849' },
  card: {
    border: '1px solid #8B1E1E',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15
  },
  header: {
    marginBottom: 10,
    fontWeight: 'bold',
    color: '#8B1E1E'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: 10
  },
  th: {
    backgroundColor: '#8B1E1E',
    color: '#fff',
    padding: 8
  },
  td: {
    padding: 8,
    textAlign: 'center'
  },
  input: {
    width: '80px',
    padding: 5
  },
  back: {
    marginBottom: 15,
    cursor: 'pointer',
    color: '#8B1E1E'
  }
}

function ControlEnviosDetalle() {
  const { id_chofer } = useParams()
  const navigate = useNavigate()

  const [pedidos, setPedidos] = useState([])

  useEffect(() => {
    const cargarPedidos = async () => {
      try {
        const res = await fetch(`${API}/control-envios/${id_chofer}`)
        const data = await res.json()
        setPedidos(data)
      } catch (err) {
        console.error(err)
      }
    }

    cargarPedidos()
  }, [id_chofer])

  const actualizarCantidad = (pIndex, dIndex, value) => {
    const copia = [...pedidos]
    copia[pIndex].productos[dIndex].cantidad_entregada = Number(value)
    setPedidos(copia)
  }

  return (
    <div style={styles.container}>
      
      <div style={styles.back} onClick={() => navigate(-1)}>
        ⬅ Volver
      </div>

      <h2 style={styles.title}>Pedidos del chofer</h2>

      {pedidos.map((p, i) => (
        <div key={i} style={styles.card}>

          <div style={styles.header}>
            Cliente: {p.cliente} | Tienda: {p.tienda}
            <br />
            Ruta: {p.ruta} | Fecha salida: {p.fecha_salida}
          </div>

          <table style={styles.table} border="1">
            <thead>
              <tr>
                <th style={styles.th}>Producto</th>
                <th style={styles.th}>Embarcado</th>
                <th style={styles.th}>Entregado</th>
              </tr>
            </thead>

            <tbody>
              {p.productos.map((prod, j) => (
                <tr key={j}>
                  <td style={styles.td}>{prod.nombre}</td>
                  <td style={styles.td}>{prod.cantidad_pedida}</td>
                  <td style={styles.td}>
                    <input
                      style={styles.input}
                      type="number"
                      value={prod.cantidad_entregada}
                      onChange={e =>
                        actualizarCantidad(i, j, e.target.value)
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>
      ))}
    </div>
  )
}

export default ControlEnviosDetalle
