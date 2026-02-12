import { useState, useEffect } from 'react'
import { API_URL } from '../config'

function ProductosPedido({ onTotalChange, onProductosChange }) {
  const [catalogo, setCatalogo] = useState([])
  const [productos, setProductos] = useState([])
  const [open, setOpen] = useState(false)
  const [openJuntas, setOpenJuntas] = useState(false)
  const [openBoquillas, setOpenBoquillas] = useState(false)

  useEffect(() => {
    fetch(`${API_URL}/productos`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setCatalogo(
            data.map(p => ({
              ...p,
              precio: Number(p.precio)
            }))
          )
        } else {
          console.error('Respuesta inválida:', data)
        }
      })
      .catch(err => console.error('Error cargando productos:', err))
  }, [])

  const recalcular = lista => {
    const total = lista.reduce(
      (sum, p) => sum + p.precio * p.cantidad,
      0
    )
    onTotalChange(total)
    onProductosChange(lista)
  }

  const agregarProducto = p => {
    const existe = productos.find(
      x => x.id_producto === p.id_producto
    )

    let lista

    if (existe) {
      lista = productos.map(x =>
        x.id_producto === p.id_producto
          ? { ...x, cantidad: x.cantidad + 1 }
          : x
      )
    } else {
      lista = [...productos, { ...p, cantidad: 1 }]
    }

    setProductos(lista)
    recalcular(lista)

    setOpen(false)
    setOpenJuntas(false)
    setOpenBoquillas(false)
  }

  const normales = catalogo.filter(
    p =>
      !p.nombre.toLowerCase().includes('junta') &&
      !p.nombre.toLowerCase().includes('boquilla')
  )

  const juntas = catalogo.filter(p =>
    p.nombre.toLowerCase().includes('junta')
  )

  const boquillas = catalogo.filter(p =>
    p.nombre.toLowerCase().includes('boquilla')
  )

  const menuStyle = {
    border: '1px solid #8B1E1E',
    borderRadius: '6px',
    width: '260px',
    fontSize: '14px'
  }

  const itemStyle = {
    padding: '8px 10px',
    cursor: 'pointer'
  }

  return (
    <div>
      <h3 style={{ fontWeight: 'normal' }}>
        Agregar productos
      </h3>

      <div style={menuStyle}>
        <div
          style={{ ...itemStyle, color: '#8B1E1E' }}
          onClick={() => setOpen(!open)}
        >
          + Agregar producto ▾
        </div>

        {open && (
          <div>
            {normales.map(p => (
              <div
                key={p.id_producto}
                style={itemStyle}
                onClick={() => agregarProducto(p)}
              >
                {p.nombre}
              </div>
            ))}

            <div
              style={itemStyle}
              onClick={() => setOpenJuntas(!openJuntas)}
            >
              Juntas ▸
            </div>

            {openJuntas &&
              juntas.map(p => (
                <div
                  key={p.id_producto}
                  style={{ ...itemStyle, paddingLeft: 25 }}
                  onClick={() => agregarProducto(p)}
                >
                  {p.nombre}
                </div>
              ))}

            <div
              style={itemStyle}
              onClick={() =>
                setOpenBoquillas(!openBoquillas)
              }
            >
              Boquillas ▸
            </div>

            {openBoquillas &&
              boquillas.map(p => (
                <div
                  key={p.id_producto}
                  style={{ ...itemStyle, paddingLeft: 25 }}
                  onClick={() => agregarProducto(p)}
                >
                  {p.nombre}
                </div>
              ))}
          </div>
        )}
      </div>

      {productos.length > 0 && (
        <table
          border="1"
          cellPadding="6"
          style={{ marginTop: 15 }}
        >
          <thead style={{ backgroundColor: '#f3d6d6' }}>
            <tr>
              <th>Producto</th>
              <th>Precio</th>
              <th>Cantidad</th>
              <th>Subtotal</th>
            </tr>
          </thead>

          <tbody>
            {productos.map((p, i) => (
              <tr key={p.id_producto}>
                <td>{p.nombre}</td>

                <td>
                  <input
                    type="number"
                    value={p.precio}
                    onChange={e => {
                      const lista = [...productos]
                      lista[i].precio = Number(
                        e.target.value
                      )
                      setProductos(lista)
                      recalcular(lista)
                    }}
                  />
                </td>

                <td>
                  <input
                    type="number"
                    min="1"
                    value={p.cantidad}
                    onChange={e => {
                      const lista = [...productos]
                      lista[i].cantidad = Number(
                        e.target.value
                      )
                      setProductos(lista)
                      recalcular(lista)
                    }}
                  />
                </td>

                <td>
                  ${p.precio * p.cantidad}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default ProductosPedido
