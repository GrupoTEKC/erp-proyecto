import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const API = 'https://erp-proyecto-production.up.railway.app'

function EditarCliente() {
  const navigate = useNavigate()
  const { id } = useParams()

  const [cliente, setCliente] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // =========================
  // CARGAR CLIENTE
  // =========================
  useEffect(() => {
    const cargarCliente = async () => {
      try {
        setLoading(true)
        setError(null)

        const res = await fetch(`${API}/clientes/${id}`)

        if (!res.ok) throw new Error('No se pudo cargar cliente')

        const data = await res.json()

        console.log('Cliente cargado:', data)

        setCliente(data)
      } catch (err) {
        console.error(err)
        setError('Error cargando cliente')
      } finally {
        setLoading(false)
      }
    }

    cargarCliente()
  }, [id])

  // =========================
  // GUARDAR CAMBIOS
  // =========================
  const guardarCambios = async () => {
    try {
      const res = await fetch(`${API}/clientes/${id}`, {
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

  // =========================
  // LOADING / ERROR
  // =========================
  if (loading) return <p>Cargando cliente...</p>
  if (error) return <p style={{ color: 'red' }}>{error}</p>

  // =========================
  // UI
  // =========================
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
        placeholder="Teléfono"
        value={cliente.telefono || ''}
        onChange={e =>
          setCliente({ ...cliente, telefono: e.target.value })
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
        placeholder="Dirección"
        value={cliente.direccion || ''}
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
