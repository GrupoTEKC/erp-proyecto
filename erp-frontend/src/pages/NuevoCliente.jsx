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
    categoria: '',
    otraCategoria: '',
    nombre_tienda: '',
    telefono_dueno: '',
    telefono_tienda: '',
    calle: '',
    numero: '',
    cp: '',
    colonia: '',
    estado: '',
    entre_calles: '',
    referencia: '',
    correo_usuario: '',
    correo_dominio: '@gmail.com',
    id_ruta: ''
  })

  useEffect(() => {
    const cargarRutas = async () => {
      const res = await fetch(`${API}/rutas`)
      const data = await res.json()
      setRutas(data || [])
    }
    cargarRutas()
  }, [])

  // 👉 convertir todo a MAYÚSCULAS
  const handleChange = e => {
    const { name, value } = e.target
    setForm({
      ...form,
      [name]: value.toUpperCase()
    })
  }

  const handleCorreoUsuario = e => {
    setForm({ ...form, correo_usuario: e.target.value })
  }

  const handleCorreoDominio = e => {
    setForm({ ...form, correo_dominio: e.target.value })
  }

  // 👉 validaciones
  const validar = () => {

    if (!form.nombre || !form.apellido1 || !form.apellido2)
      return alert('Nombre completo obligatorio')

    if (!form.categoria)
      return alert('Seleccione categoría de tienda')

    if (!form.nombre_tienda)
      return alert('Nombre de tienda obligatorio')

    if (!form.telefono_dueno && !form.telefono_tienda)
      return alert('Debe ingresar al menos un teléfono')

    const camposDireccion = [
      'calle','numero','cp','colonia','estado','entre_calles','referencia'
    ]

    for (let campo of camposDireccion) {
      if (!form[campo]) return alert('Dirección incompleta')
    }

    if (!form.id_ruta)
      return alert('Seleccione ruta')

    return true
  }

  const guardarCliente = async () => {

    if (!validar()) return

    const payload = {
      ...form,
      correo: form.correo_usuario
        ? form.correo_usuario + form.correo_dominio
        : ''
    }

    try {
      const res = await fetch(`${API}/clientes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!res.ok) return alert('Error al guardar')

      alert('✅ Cliente guardado')
      navigate('/clientes')

    } catch {
      alert('Error de conexión')
    }
  }

  return (

    <div style={{ padding: 20 }}>

      {/* AVISO GENERAL */}
      <p style={{ fontSize: 12, color: '#8B1E1E' }}>
        EN LOS SIGUIENTES CAMPOS TODOS LOS DATOS DEBERÁN SER ESCRITOS EN MAYÚSCULAS.
        EL NOMBRE DEBERÁ CORRESPONDER EXCLUSIVAMENTE AL DUEÑO, NO AL ENCARGADO.
      </p>

      <h2>Nuevo Cliente</h2>

      {/* ===== NOMBRE ===== */}

      <label>INSTRUCCIÓN: Nombre del dueño (completo)</label>
      <input name="nombre" onChange={handleChange} />

      <label>Primer apellido</label>
      <input name="apellido1" onChange={handleChange} />

      <label>Segundo apellido</label>
      <input name="apellido2" onChange={handleChange} />

      <label>Apodo (opcional)</label>
      <input name="apodo" onChange={handleChange} />

      {/* ===== TIENDA ===== */}

      <label>
        INSTRUCCIÓN: Seleccione categoría de negocio
      </label>

      <select name="categoria" onChange={handleChange}>
        <option value="">Seleccione</option>
        <option>FERRETERIA</option>
        <option>MATERIALES</option>
        <option>AMBOS</option>
        <option>OTROS</option>
      </select>

      {form.categoria === 'OTROS' && (
        <input
          placeholder="Especifique"
          name="otraCategoria"
          onChange={handleChange}
        />
      )}

      <label>
        INSTRUCCIÓN: Nombre COMPLETO de la tienda
      </label>

      <input name="nombre_tienda" onChange={handleChange} />

      {/* ===== TELEFONOS ===== */}

      <label>
        INSTRUCCIÓN: Ingrese teléfono del dueño o tienda (mínimo uno obligatorio)
      </label>

      <input
        placeholder="Teléfono dueño"
        name="telefono_dueno"
        onChange={handleChange}
      />

      <input
        placeholder="Teléfono tienda"
        name="telefono_tienda"
        onChange={handleChange}
      />

      {/* ===== CORREO ===== */}

      <label>
        INSTRUCCIÓN: Correo del cliente (opcional)
      </label>

      <div style={{ display: 'flex', gap: 5 }}>
        <input
          placeholder="usuario"
          value={form.correo_usuario}
          onChange={handleCorreoUsuario}
        />

        <select
          value={form.correo_dominio}
          onChange={handleCorreoDominio}
        >
          <option>@gmail.com</option>
          <option>@hotmail.com</option>
          <option>@outlook.com</option>
          <option>@yahoo.com</option>
        </select>
      </div>

      {/* ===== DIRECCIÓN ===== */}

      <h4>Dirección</h4>

      <p style={{ fontSize: 12 }}>
        INSTRUCCIÓN: Complete todos los campos de dirección con precisión.
      </p>

      {[
        ['calle','Calle'],
        ['numero','Número'],
        ['cp','Código Postal'],
        ['colonia','Colonia/Municipio'],
        ['estado','Estado'],
        ['entre_calles','Entre calles'],
        ['referencia','Referencia']
      ].map(([name,label]) => (
        <input
          key={name}
          placeholder={label}
          name={name}
          onChange={handleChange}
        />
      ))}

      {/* ===== RUTA ===== */}

      <label>Ruta asignada</label>

      <select
        name="id_ruta"
        onChange={handleChange}
      >
        <option value="">Seleccione ruta</option>
        {rutas.map(r => (
          <option key={r.id_ruta} value={r.id_ruta}>
            {r.nombre}
          </option>
        ))}
      </select>

      <br /><br />

      <button onClick={guardarCliente}>
        Guardar Cliente
      </button>

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
