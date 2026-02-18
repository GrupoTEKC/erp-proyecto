import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const API = 'https://erp-proyecto-production.up.railway.app'

function EditarCliente() {
  const navigate = useNavigate()
  const { id } = useParams()

  const [cliente, setCliente] = useState({
    nombre: '',
    telefono: '',
    email: '',
    direccion: ''
  })

  useEffect(() => {
    const cargarCliente = async () => {
      const res = await fetch(`${API}/clientes/${id}`)
      const data = await res.json()
      setCliente(data)
    }

    cargarCliente()
  }, [id])

  const guardarCambios = async () => {
    await fetch(`${API}/clientes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cliente)
    })

    alert('Cliente actualizado')
    navigate('/clientes')
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Editar Cliente</h2>

      <input
        placeholder="Nombre"
        value={cliente.nombre}
        onChange={e =>
          setCliente({ ...cliente, nombre: e.target.value })
        }
      />

      <input
        placeholder="Teléfono"
        value={cliente.telefono}
        onChange={e =>
          setCliente({ ...cliente, telefono: e.target.value })
        }
      />

      <input
        placeholder="Email"
        value={cliente.email}
        onChange={e =>
          setCliente({ ...cliente, email: e.target.value })
        }
      />

      <input
        placeholder="Dirección"
        value={cliente.direccion}
        onChange={e =>
          setCliente({ ...cliente, direccion: e.target.value })
        }
      />

      <br /><br />

      <button onClick={guardarCambios}>
        Guardar cambios
      </button>

      <button onClick={() => navigate('/clientes')}>
        Cancelar
      </button>
    </div>
  )
}

export default EditarCliente
