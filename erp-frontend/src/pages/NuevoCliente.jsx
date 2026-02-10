import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

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
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const guardarCliente = async () => {
    const res = await fetch('http://localhost:3001/clientes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })

    if (!res.ok) {
      alert('Error al guardar cliente')
      return
    }

    alert('✅ Cliente guardado')
    navigate('/clientes')
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
      <input name="saldo_actual" type="number" placeholder="Saldo" onChange={handleChange} /><br /><br />

      <button onClick={guardarCliente}>Guardar</button>
      <button onClick={() => navigate('/clientes')} style={{ marginLeft: 10 }}>
        Cancelar
      </button>
    </div>
  )
}

export default NuevoCliente
