import { useEffect, useState } from 'react'
import axios from 'axios'

function Produccion() {
  const [productos, setProductos] = useState([])
  const [fecha, setFecha] = useState(
    new Date().toISOString().slice(0, 10)
  )

  useEffect(() => {
    cargarDatos()
  }, [fecha])

  const cargarDatos = async () => {
    const res = await axios.get(`http://localhost:3001/produccion/${fecha}`)
    setProductos(res.data)
  }

  const handleChange = (index, value) => {
    const nuevos = [...productos]
    nuevos[index].producido = value
    setProductos(nuevos)
  }

  const guardar = async () => {
    const datos = productos.map(p => ({
      id_producto: p.id_producto,
      cantidad: Number(p.producido) || 0
    }))

    await axios.post('http://localhost:3001/produccion', {
      fecha,
      datos
    })

    alert('Producción guardada 🔥')
  }

  return (
    <div>
      <h2>Producción diaria</h2>

      <input
        type="date"
        value={fecha}
        onChange={(e) => setFecha(e.target.value)}
      />

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Producción</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((p, i) => (
            <tr key={p.id_producto}>
              <td>{p.nombre}</td>
              <td>
                <input
                  type="number"
                  value={p.producido}
                  onChange={(e) =>
                    handleChange(i, e.target.value)
                  }
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={guardar}>
        Guardar producción
      </button>
    </div>
  )
}

export default Produccion
