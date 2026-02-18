import { useEffect, useState } from 'react'
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
    categoriaOtro: '',
    nombre_tienda: '',
    telefono_dueno: '',
    telefono_tienda: '',
    calle: '',
    numero: '',
    cp: '',
    municipio: '',
    estado: '',
    entre_calles: '',
    referencia: '',
    correo_usuario: '',
    correo_dominio: '@gmail.com',
    id_ruta: ''
  })

  useEffect(() => {
    fetch(`${API}/rutas`)
      .then(r => r.json())
      .then(data => setRutas(Array.isArray(data) ? data : []))
      .catch(() => setRutas([]))
  }, [])

  const upper = v => v.toUpperCase()

  const handleChange = e => {
    const { name, value } = e.target
    setForm(prev => ({
      ...prev,
      [name]: name.includes('telefono') || name === 'cp'
        ? value
        : upper(value)
    }))
  }

  const validar = () => {
    if (
      !form.nombre ||
      !form.apellido1 ||
      !form.apellido2 ||
      !form.nombre_tienda ||
      !form.categoria ||
      !form.calle ||
      !form.numero ||
      !form.cp ||
      !form.municipio ||
      !form.estado ||
      !form.id_ruta
    ) {
      alert('Complete todos los campos obligatorios')
      return false
    }

    if (!form.telefono_dueno && !form.telefono_tienda) {
      alert('Debe ingresar al menos un teléfono')
      return false
    }

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

      if (!res.ok) throw new Error()

      alert('✅ Cliente guardado')
      navigate('/clientes')
    } catch {
      alert('❌ Error al guardar')
    }
  }

  return (
    <div style={styles.page}>

      <h2 style={styles.title}>NUEVO CLIENTE</h2>

     <p style={{ ...styles.aviso, textAlign: 'justify' }}>
  <strong>INSTRUCCIONES DE LLENADO</strong>
  <br />
  * En los siguientes campos todos los datos deberán ser escritos en <strong>MAYÚSCULAS</strong>. dejando como excepcion el correo electronico
  <br />
  * Todos los datos deberán corresponder únicamente al dueño y a la tienda (no se deberán incluir datos de otras personas).
  <br />
</p>


      <div style={styles.grid}>

        <Campo label="Nombre del dueño *" name="nombre" form={form} onChange={handleChange}/>
        <Campo label="Primer apellido *" name="apellido1" form={form} onChange={handleChange}/>
        <Campo label="Segundo apellido *" name="apellido2" form={form} onChange={handleChange}/>
        <Campo label="Apodo (opcional)" name="apodo" form={form} onChange={handleChange}/>

        <div style={styles.field}>
          <label>Categoría tienda *</label>
          <select name="categoria" value={form.categoria} onChange={handleChange}>
            <option value="">Seleccione</option>
            <option>FERRETERIA</option>
            <option>MATERIALES</option>
            <option>AMBOS</option>
            <option>OTROS</option>
          </select>
        </div>

        {form.categoria === 'OTROS' && (
          <Campo label="Especifique categoría" name="categoriaOtro" form={form} onChange={handleChange}/>
        )}

        <Campo label="Nombre completo del negocio *" name="nombre_tienda" form={form} onChange={handleChange}/>

        <Campo label="Teléfono dueño" name="telefono_dueno" form={form} onChange={handleChange}/>
        <Campo label="Teléfono tienda" name="telefono_tienda" form={form} onChange={handleChange}/>

        <Campo label="Calle *" name="calle" form={form} onChange={handleChange}/>
        <Campo label="Número *" name="numero" form={form} onChange={handleChange}/>
        <Campo label="CP *" name="cp" form={form} onChange={handleChange}/>
        <Campo label="Municipio/Colonia *" name="municipio" form={form} onChange={handleChange}/>
        <Campo label="Estado *" name="estado" form={form} onChange={handleChange}/>
        <Campo label="Entre calles" name="entre_calles" form={form} onChange={handleChange}/>
        <Campo label="Referencia" name="referencia" form={form} onChange={handleChange}/>

        <div style={styles.field}>
          <label>Correo</label>
          <div style={{display:'flex', gap:5}}>
            <input
              name="correo_usuario"
              value={form.correo_usuario}
              onChange={handleChange}
            />
            <select
              name="correo_dominio"
              value={form.correo_dominio}
              onChange={handleChange}
            >
              <option>@gmail.com</option>
              <option>@hotmail.com</option>
              <option>@outlook.com</option>
            </select>
          </div>
        </div>

        <div style={styles.field}>
          <label>Ruta *</label>
          <select name="id_ruta" value={form.id_ruta} onChange={handleChange}>
            <option value="">Seleccione ruta</option>
            {rutas.map(r => (
              <option key={r.id_ruta} value={r.id_ruta}>
                {r.nombre}
              </option>
            ))}
          </select>
        </div>

      </div>

      <div style={styles.buttons}>
        <button style={styles.save} onClick={guardarCliente}>
          Guardar Cliente
        </button>
        <button style={styles.cancel} onClick={() => navigate('/clientes')}>
          Cancelar
        </button>
      </div>

    </div>
  )
}

function Campo({ label, name, form, onChange }) {
  return (
    <div style={styles.field}>
      <label>{label}</label>
      <input name={name} value={form[name]} onChange={onChange}/>
    </div>
  )
}

const vino = '#8B1E1E'

const styles = {
  page: {
    padding: 20,
    fontFamily: 'Arial',
    maxWidth: 900,
    margin: 'auto'
  },

  title: {
    color: '#071849'
  },

  aviso: {
    fontSize: 12,
    marginBottom: 20,
    color: '#444'
  },

  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px,1fr))',
    gap: 12
  },

  field: {
    display: 'flex',
    flexDirection: 'column'
  },

  buttons: {
    marginTop: 20,
    display: 'flex',
    gap: 10
  },

  save: {
    background: vino,
    color: '#fff',
    border: 'none',
    padding: 10,
    borderRadius: 6,
    cursor: 'pointer'
  },

  cancel: {
    background: '#fff',
    color: vino,
    border: `1px solid ${vino}`,
    padding: 10,
    borderRadius: 6,
    cursor: 'pointer'
  }
}

export default NuevoCliente
