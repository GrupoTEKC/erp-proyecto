import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

// 👉 URL DEL BACKEND EN PRODUCCIÓN
const API = 'https://erp-proyecto-production.up.railway.app'

function NuevoCliente() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    nombre: '',
    nombre_tienda: '',
    telefono: '',
    rfc: '',
    email: '',
    direccion: '',
    saldo_actual: 0
  })

  const handleChange = e => {
    const { name, value } = e.target

    setForm({
      ...form,
      [name]: name === 'saldo_actual' ? Number(value) : value
    })
  }

  const guardarCliente = async () => {
    try {
      const res = await fetch(`${API}/clientes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })

      if (!res.ok) {
        alert('Error al guardar cliente')
        return
      }

      alert('✅ Cliente guardado correctamente')
      navigate('/clientes')

    } catch (error) {
      console.error('Error:', error)
      alert('No se pudo conectar con el servidor')
    }
  }

  return (
    <div>
      <h2>Nuevo Cliente</h2>

      <input name="nombre" placeholder="Nombre" onChange={handleChange} /><br />
      <input name="nombre_tienda" placeholder="Tienda" onChange={handleChange} /><br />
      <input name="telefono" placeholder="Teléfono" onChange={handleChange} /><br />
      <input name="rfc" placeholder="RFC" onChange={handleChange} /><br />
      <input name="email" placeholder="Email" onChange={handleChange} /><br />
      <input name="direccion" placeholder="Dirección" onChange={handleChange} /><br />
      <input
        name="saldo_actual"
        type="number"
        placeholder="Saldo"
        onChange={handleChange}
      /><br /><br />

      <button onClick={guardarCliente}>Guardar</button>

      <button
        onClick={() => navigate('/clientes')}
        style={{ marginLeft: 10 }}
      >
        Cancelar
      </button>
    </div>
  )
}

export default NuevoCliente
