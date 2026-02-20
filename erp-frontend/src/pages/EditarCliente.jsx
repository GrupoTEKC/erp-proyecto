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

        console.log('🟢 ID recibido:', id)

        if (!id) throw new Error('ID inválido')

        setLoading(true)
        setError(null)

        const res = await fetch(`${API}/clientes/${id}`)

        console.log('📡 Status:', res.status)

        // leer como texto primero para debug
        const text = await res.text()

        console.log('📦 Respuesta cruda:', text)

        if (!res.ok) {
          throw new Error('Servidor respondió error')
        }

        const data = JSON.parse(text)

        console.log('✅ Cliente cargado:', data)

        setCliente(data)

      } catch (err) {

        console.error('🔥 ERROR:', err)
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
  // ESTADOS
  // =========================
  if (loading) return <p>Cargando cliente...</p>

  if (error) return <p style={{ color: 'red' }}>{error}</p>

  if (!cliente) return <p>No hay datos</p>

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
