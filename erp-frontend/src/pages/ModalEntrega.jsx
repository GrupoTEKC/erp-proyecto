import { useEffect, useState } from 'react'

function ModalEntrega({ pedido, productos = [], onClose, onConfirmar }) {
  const [entregas, setEntregas] = useState([])
  const [comentario, setComentario] = useState('')

  const [choferes, setChoferes] = useState([])
  const [unidades, setUnidades] = useState([])

  const [chofer, setChofer] = useState('')
  const [esOtroChofer, setEsOtroChofer] = useState(false)

  const [otroNombre, setOtroNombre] = useState('')
  const [otroApellido1, setOtroApellido1] = useState('')
  const [otroApellido2, setOtroApellido2] = useState('')
  const [otroCorreo, setOtroCorreo] = useState('')

  const [unidad, setUnidad] = useState('')

  const [loadingChoferes, setLoadingChoferes] = useState(false)
  const [loadingUnidades, setLoadingUnidades] = useState(false)

  const API = import.meta.env.VITE_API_URL

  /* =========================
     CARGAR PRODUCTOS
  ========================= */
  useEffect(() => {
    if (!Array.isArray(productos)) return

    const data = productos.map(p => {
      const cantidad = Number(p.cantidad) || 0
      return {
        id_producto: p.id_producto,
        nombre: p.nombre || 'Sin nombre',
        cantidad_pedida: cantidad,
        cantidad_entregada: cantidad
      }
    })

    setEntregas(data)
    setComentario('')
    setChofer('')
    setUnidad('')
    setEsOtroChofer(false)
    setOtroNombre('')
    setOtroApellido1('')
    setOtroApellido2('')
    setOtroCorreo('')
  }, [productos])

  /* =========================
     CARGAR CHOFERES
  ========================= */
  useEffect(() => {
    const cargarChoferes = async () => {
      try {
        setLoadingChoferes(true)
        const res = await fetch(`${API}/choferes`)
        if (!res.ok) throw new Error()
        const data = await res.json()
        setChoferes(Array.isArray(data) ? data : [])
      } catch {
        alert('Error cargando choferes')
      } finally {
        setLoadingChoferes(false)
      }
    }

    cargarChoferes()
  }, [])

  /* =========================
     CARGAR UNIDADES
  ========================= */
  useEffect(() => {
    const cargarUnidades = async () => {
      try {
        setLoadingUnidades(true)
        const res = await fetch(`${API}/unidades`)
        if (!res.ok) throw new Error()
        const data = await res.json()
        setUnidades(Array.isArray(data) ? data : [])
      } catch {
        alert('Error cargando unidades')
      } finally {
        setLoadingUnidades(false)
      }
    }

    cargarUnidades()
  }, [])

  /* =========================
     VALIDAR DIFERENCIAS
  ========================= */
  const hayDiferencias = entregas.some(
    p => p.cantidad_entregada !== p.cantidad_pedida
  )

  /* =========================
     CAMBIAR CANTIDAD
  ========================= */
  const cambiarCantidad = (index, valor) => {
    let nueva = Number(valor)
    if (isNaN(nueva) || nueva < 0) nueva = 0

    const max = entregas[index].cantidad_pedida
    if (nueva > max) nueva = max

    const copia = [...entregas]
    copia[index].cantidad_entregada = nueva
    setEntregas(copia)
  }

  /* =========================
     CONFIRMAR ENTREGA
  ========================= */
  const confirmar = () => {
    if (!chofer) return alert('Selecciona un chofer')
    if (!unidad) return alert('Selecciona la unidad')

    if (chofer === 'otro') {
      if (!otroNombre || !otroApellido1 || !otroCorreo) {
        return alert('Completa los datos del chofer externo')
      }
    }

    if (hayDiferencias && !comentario.trim()) {
      return alert(
        'En caso de no entregar lo solicitado por el cliente, se deberá registrar el motivo específico que originó la situación.'
      )
    }

    const productosParaBackend = entregas.map(p => ({
      id_producto: p.id_producto,
      cantidad_pedida: p.cantidad_pedida,
      cantidad_entregada: p.cantidad_entregada
    }))

    onConfirmar({
      productos: productosParaBackend,
      comentario,
      unidad,
      chofer:
        chofer === 'otro'
          ? {
              tipo: 'externo',
              nombre: otroNombre,
              apellido1: otroApellido1,
              apellido2: otroApellido2,
              correo: otroCorreo
            }
          : {
              tipo: 'interno',
              id_chofer: chofer
            }
    })
  }

  if (!pedido) return null

  /* =========================
     UI
  ========================= */
  return (
    <div style={overlay}>
      <div style={modal}>
        <h3>Confirmar entrega</h3>

        <p><strong>Folio:</strong> {pedido.folio}</p>
        <p><strong>Cliente:</strong> {pedido.cliente}</p>

        <table border="1" width="100%" cellPadding="6">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Pedida</th>
              <th>Entregar</th>
            </tr>
          </thead>
          <tbody>
            {entregas.map((p, i) => (
              <tr key={p.id_producto}>
                <td>{p.nombre}</td>
                <td>{p.cantidad_pedida}</td>
                <td>
                  <input
                    type="number"
                    min="0"
                    max={p.cantidad_pedida}
                    value={p.cantidad_entregada}
                    onChange={e => cambiarCantidad(i, e.target.value)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {hayDiferencias && (
          <p style={{ color: 'red', marginTop: 10 }}>
            ⚠ En caso de no entregar lo solicitado por el cliente, se deberá registrar el motivo específico que originó la situación.
          </p>
        )}

        <hr />

        <label>Chofer *</label>
        <select
          value={chofer}
          onChange={e => {
            setChofer(e.target.value)
            setEsOtroChofer(e.target.value === 'otro')
          }}
          style={{ width: '100%', marginBottom: 10 }}
        >
          <option value="">
            {loadingChoferes ? 'Cargando...' : 'Seleccionar chofer'}
          </option>

          {choferes.map(c => (
            <option key={c.id_chofer} value={c.id_chofer}>
              {c.nombre} {c.apellido1}
            </option>
          ))}

          <option value="otro">Otro (externo)</option>
        </select>

        {esOtroChofer && (
          <>
            <input
              placeholder="Nombre"
              value={otroNombre}
              onChange={e => setOtroNombre(e.target.value)}
              style={{ width: '100%', marginBottom: 8 }}
            />
            <input
              placeholder="Apellido 1"
              value={otroApellido1}
              onChange={e => setOtroApellido1(e.target.value)}
              style={{ width: '100%', marginBottom: 8 }}
            />
            <input
              placeholder="Apellido 2"
              value={otroApellido2}
              onChange={e => setOtroApellido2(e.target.value)}
              style={{ width: '100%', marginBottom: 8 }}
            />
            <input
              placeholder="Correo"
              type="email"
              value={otroCorreo}
              onChange={e => setOtroCorreo(e.target.value)}
              style={{ width: '100%', marginBottom: 10 }}
            />
          </>
        )}

        <label>Unidad *</label>
        <select
          value={unidad}
          onChange={e => setUnidad(e.target.value)}
          style={{ width: '100%', marginBottom: 10 }}
        >
          <option value="">
            {loadingUnidades ? 'Cargando...' : 'Seleccionar unidad'}
          </option>
          {unidades.map(u => (
            <option key={u.id_unidad} value={u.id_unidad}>
              {u.nombre}
            </option>
          ))}
        </select>

        <label>
          Comentario
          {hayDiferencias && (
            <strong style={{ color: 'red' }}> *</strong>
          )}
        </label>

        <textarea
          value={comentario}
          onChange={e => setComentario(e.target.value)}
          rows="3"
          style={{ width: '100%' }}
        />

        <div style={acciones}>
          <button onClick={onClose}>
            Cancelar
          </button>
          <button onClick={confirmar}>
            Confirmar entrega
          </button>
        </div>
      </div>
    </div>
  )
}

/* =========================
   ESTILOS
========================= */
const overlay = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,0.4)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000
}

const modal = {
  background: '#fff',
  padding: '20px',
  width: '600px',
  borderRadius: '6px',
  maxHeight: '90vh',
  overflowY: 'auto'
}

const acciones = {
  marginTop: 15,
  display: 'flex',
  justifyContent: 'space-between'
}

export default ModalEntrega
