import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const API = 'https://erp-proyecto-production.up.railway.app'

function NuevoCliente() {
  const navigate = useNavigate()

  const [rutas, setRutas] = useState([])

  const [form, setForm] = useState({
    nombre: '',
    apellido1: '',
    apellido2: '',
    apodo: '',
    categoria_tienda: '',
    tienda: '',
    telefono_cliente: '',
    telefono_tienda: '',
    calle: '',
    numero: '',
    cp: '',
    municipio: '',
    estado: '',
    entre_calles: '',
    referencia: '',
    id_ruta: ''
  })

  // ======================
  // Cargar rutas
  // ======================
  useEffect(() => {
    fetch(`${API}/rutas`)
      .then(r => r.json())
      .then(data => setRutas(Array.isArray(data) ? data : []))
      .catch(() => setRutas([]))
  }, [])

  // ======================
  // Mayúsculas automáticas
  // ======================
  const handleChange = e => {
    const { name, value } = e.target

    const upperFields = [
      'nombre',
      'apellido1',
      'apellido2',
      'apodo',
      'tienda',
      'calle',
      'municipio',
      'estado',
      'entre_calles',
      'referencia'
    ]

    setForm({
      ...form,
      [name]: upperFields.includes(name)
        ? value.toUpperCase()
        : value
    })
  }

  // ======================
  // Validaciones
  // ======================
  const validar = () => {
    if (!form.nombre || !form.apellido1 || !form.apellido2)
      return alert('Nombre y apellidos son obligatorios')

    if (!form.categoria_tienda || !form.tienda)
      return alert('Datos de tienda obligatorios')

    if (!form.telefono_cliente && !form.telefono_tienda)
      return alert('Debe ingresar al menos un teléfono')

    const direccionCampos = [
      'calle',
      'numero',
      'cp',
      'municipio',
      'estado'
    ]

    for (let campo of direccionCampos) {
      if (!form[campo])
        return alert('Complete todos los datos de dirección')
    }

    if (!form.id_ruta)
      return alert('Seleccione una ruta')

    return true
  }

  // ======================
  // Guardar
  // ======================
  const guardarCliente = async () => {
    if (!validar()) return

    try {
      const res = await fetch(`${API}/clientes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })

      if (!res.ok) throw new Error()

      alert('✅ Cliente guardado')
      navigate('/clientes')
    } catch {
      alert('❌ Error al guardar')
    }
  }

  // ======================
  // UI
  // ======================
  return (
    <div style={{ padding: 20 }}>
      <h2>Alta de Cliente</h2>

      <p><b>⚠ Complete todos los campos obligatorios en MAYÚSCULAS</b></p>

      {/* Nombre */}
      <h4>Datos personales</h4>
      <input name="nombre" placeholder="Nombre" onChange={handleChange}/>
      <input name="apellido1" placeholder="Primer apellido" onChange={handleChange}/>
      <input name="apellido2" placeholder="Segundo apellido" onChange={handleChange}/>
      <input name="apodo" placeholder="Apodo (opcional)" onChange={handleChange}/>

      {/* Tienda */}
      <h4>Tienda</h4>
      <select name="categoria_tienda" onChange={handleChange}>
        <option value="">Seleccione categoría</option>
        <option>Ferretería</option>
        <option>Materiales</option>
        <option>Ambos</option>
        <option>Otros</option>
      </select>

      <input
        name="tienda"
        placeholder="Nombre completo del negocio"
        onChange={handleChange}
      />

      {/* Teléfonos */}
      <h4>Teléfonos</h4>
      <input
        name="telefono_cliente"
        placeholder="Teléfono cliente"
        onChange={handleChange}
      />
      <input
        name="telefono_tienda"
        placeholder="Teléfono tienda"
        onChange={handleChange}
      />

      {/* Dirección */}
      <h4>Dirección</h4>
      <input name="calle" placeholder="Calle" onChange={handleChange}/>
      <input name="numero" placeholder="Número" onChange={handleChange}/>
      <input name="cp" placeholder="CP" onChange={handleChange}/>
      <input name="municipio" placeholder="Municipio/Colonia" onChange={handleChange}/>
      <input name="estado" placeholder="Estado" onChange={handleChange}/>
      <input name="entre_calles" placeholder="Entre calles" onChange={handleChange}/>
      <input name="referencia" placeholder="Referencia" onChange={handleChange}/>

      {/* Ruta */}
      <h4>Ruta</h4>
      <select name="id_ruta" onChange={handleChange}>
        <option value="">Seleccione ruta</option>
        {rutas.map(r => (
          <option key={r.id_ruta} value={r.id_ruta}>
            {r.nombre}
          </option>
        ))}
      </select>

      <br/><br/>

      <button onClick={guardarCliente}>Guardar Cliente</button>
      <button onClick={() => navigate('/clientes')}>
        Cancelar
      </button>
    </div>
  )
}

export default NuevoCliente
