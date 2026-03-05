import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const API = 'https://erp-proyecto-production.up.railway.app'

function EditarCliente() {

  const navigate = useNavigate()
  const { id_cliente } = useParams()

  const [cliente, setCliente] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // =========================
  // CARGAR CLIENTE
  // =========================

  useEffect(() => {

    const cargarCliente = async () => {

      try {

        console.log('🟢 ID recibido:', id_cliente)

        const res = await fetch(`${API}/clientes/${id_cliente}`)

        if (!res.ok) throw new Error('Error cargando cliente')

        const data = await res.json()

        console.log('✅ Cliente cargado:', data)

        setCliente(data)

      } catch (err) {

        console.error(err)
        setError('Error cargando cliente')

      } finally {

        setLoading(false)

      }

    }

    cargarCliente()

  }, [id_cliente])


  // =========================
  // GUARDAR CAMBIOS
  // =========================

  const guardarCambios = async () => {

    try {

      const res = await fetch(`${API}/clientes/${id_cliente}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cliente)
      })

      if (!res.ok) throw new Error()

      alert('✅ Cliente actualizado')

      navigate('/clientes')

    } catch {

      alert('❌ Error al guardar cambios')

    }

  }


  if (loading) return <p>Cargando cliente...</p>

  if (error) return <p style={{ color: 'red' }}>{error}</p>

  if (!cliente) return <p>No hay datos</p>


  return (

    <div style={{ padding: 20 }}>

      <h2>Editar Cliente</h2>

      <input
        placeholder="Nombre"
        value={cliente.nombre || ''}
        onChange={e =>
          setCliente({ ...cliente, nombre: e.target.value })
        }
      />

      <input
        placeholder="Apellido 1"
        value={cliente.apellido1 || ''}
        onChange={e =>
          setCliente({ ...cliente, apellido1: e.target.value })
        }
      />

      <input
        placeholder="Apellido 2"
        value={cliente.apellido2 || ''}
        onChange={e =>
          setCliente({ ...cliente, apellido2: e.target.value })
        }
      />

      <input
        placeholder="Nombre tienda"
        value={cliente.nombre_tienda || ''}
        onChange={e =>
          setCliente({ ...cliente, nombre_tienda: e.target.value })
        }
      />

      <input
        placeholder="Teléfono dueño"
        value={cliente.telefono_dueno || ''}
        onChange={e =>
          setCliente({ ...cliente, telefono_dueno: e.target.value })
        }
      />

      <input
        placeholder="Email"
        value={cliente.email || ''}
        onChange={e =>
          setCliente({ ...cliente, email: e.target.value })
        }
      />

      <input
        placeholder="Calle"
        value={cliente.calle || ''}
        onChange={e =>
          setCliente({ ...cliente, calle: e.target.value })
        }
      />

      <input
        placeholder="Número"
        value={cliente.numero || ''}
        onChange={e =>
          setCliente({ ...cliente, numero: e.target.value })
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
