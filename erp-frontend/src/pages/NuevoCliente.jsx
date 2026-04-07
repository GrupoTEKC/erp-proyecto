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
    rfc: '',
    categoria: '',
    categoria_otro: '',
    nombre_tienda: '',
    telefono: '',
    telefono_local: '',
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

  // =========================
  // FORMATEO
  // =========================
  const upper = v => v.toUpperCase().trim().replace(/\s+/g, ' ')

  const handleChange = e => {
    const { name, value } = e.target
    let val = value

    if (name === 'rfc') {
      val = value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 13)
    }
    else if (name.includes('telefono')) {
      val = value.replace(/\D/g, '').slice(0, 10)
    }
    else if (name === 'cp') {
      val = value.replace(/\D/g, '').slice(0, 5)
    }
    else if (name === 'correo_usuario') {
      val = value
    }
    else {
      val = upper(value)
    }

    setForm(prev => ({ ...prev, [name]: val }))
  }

  // =========================
  // VALIDACIONES (CORRECTO)
  // =========================
  const validar = () => {
    if (
      !form.nombre ||
      !form.categoria ||
      (form.categoria === 'OTROS' && !form.categoria_otro) ||
      !form.nombre_tienda ||
      !form.municipio ||
      !form.estado ||
      !form.id_ruta
    ) {
      alert('Complete todos los campos obligatorios')
      return false
    }

    if (
      (form.telefono && form.telefono.length !== 10) ||
      (form.telefono_local && form.telefono_local.length !== 10)
    ) {
      alert('Los teléfonos deben tener exactamente 10 dígitos')
      return false
    }

    if (form.rfc && form.rfc.length < 12) {
      alert('RFC incompleto')
      return false
    }

    return true
  }

  // =========================
  // GUARDAR
  // =========================
  const guardarCliente = async () => {
    if (!validar()) return

    const payload = {
      ...form,
      email: form.correo_usuario
        ? form.correo_usuario + form.correo_dominio
        : ''
    }

    try {
      const res = await fetch(`${API}/clientes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const data = await res.json()

      if (!res.ok) {
        alert(data.error || 'Error al guardar')
        return
      }

      alert('✅ Cliente guardado')
      navigate('/clientes')

    } catch {
      alert('❌ Error al guardar')
    }
  }

  // =========================
  // UI
  // =========================
  return (
    <div style={styles.page}>
      <h2 style={styles.title}>NUEVO CLIENTE</h2>

      <p style={{ ...styles.aviso, textAlign: 'justify' }}>
        <strong>INSTRUCCIONES DE LLENADO</strong>
        <br /><br />
        * Solo algunos campos son obligatorios.
        <br /><br />
        * Todos los datos en MAYÚSCULAS (excepto correo).
      </p>

      <div style={styles.grid}>

        <Campo label="Nombre dueño *" name="nombre" form={form} onChange={handleChange}/>
        <Campo label="Primer apellido" name="apellido1" form={form} onChange={handleChange}/>
        <Campo label="Segundo apellido" name="apellido2" form={form} onChange={handleChange}/>
        <Campo label="Apodo" name="apodo" form={form} onChange={handleChange}/>
        <Campo label="RFC" name="rfc" form={form} onChange={handleChange}/>

        <div style={styles.field}>
          <label>Categoría tienda *</label>
          <select name="categoria" value={form.categoria} onChange={handleChange}>
            <option value="">Seleccione</option>
            <option value="FERRETERIA">FERRETERÍA</option>
            <option value="MATERIALES">MATERIALES</option>
            <option value="AMBOS">AMBOS</option>
            <option value="OTROS">OTROS</option>
          </select>
        </div>

        {form.categoria === 'OTROS' && (
          <Campo label="Especifique categoría *" name="categoria_otro" form={form} onChange={handleChange}/>
        )}

        <Campo label="Nombre negocio *" name="nombre_tienda" form={form} onChange={handleChange}/>
        <Campo label="Teléfono dueño" name="telefono" form={form} onChange={handleChange}/>
        <Campo label="Teléfono tienda" name="telefono_local" form={form} onChange={handleChange}/>

        <Campo label="Calle" name="calle" form={form} onChange={handleChange}/>
        <Campo label="Número" name="numero" form={form} onChange={handleChange}/>
        <Campo label="CP" name="cp" form={form} onChange={handleChange}/>

        <Campo label="Municipio *" name="municipio" form={form} onChange={handleChange}/>
        <Campo label="Estado *" name="estado" form={form} onChange={handleChange}/>

        <Campo label="Entre calles" name="entre_calles" form={form} onChange={handleChange}/>
        <Campo label="Referencia" name="referencia" form={form} onChange={handleChange}/>

        <div style={styles.field}>
          <label>Correo</label>
          <div style={{ display: 'flex', gap: 6 }}>
            <input name="correo_usuario" value={form.correo_usuario} onChange={handleChange}/>
            <select name="correo_dominio" value={form.correo_dominio} onChange={handleChange}>
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
              <option key={r.id_ruta} value={r.id_ruta}>{r.nombre}</option>
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

// =========================
// INPUT REUTILIZABLE
// =========================
function Campo({ label, name, form, onChange }) {
  return (
    <div style={styles.field}>
      <label>{label}</label>
      <input name={name} value={form[name]} onChange={onChange}/>
    </div>
  )
}

// =========================
// ESTILOS (SIN CAMBIOS)
// =========================
const vino = '#8B1E1E'

const styles = {
  page: { padding: 20, maxWidth: 900, margin: 'auto', fontFamily: 'Arial' },
  title: { color: '#071849' },
  aviso: { fontSize: 12, marginBottom: 20, color: '#444' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 12 },
  field: { display: 'flex', flexDirection: 'column' },
  buttons: { marginTop: 20, display: 'flex', gap: 10 },
  save: { background: vino, color: '#fff', border: 'none', padding: 10, borderRadius: 6, cursor: 'pointer' },
  cancel: { background: '#fff', color: vino, border: `1px solid ${vino}`, padding: 10, borderRadius: 6, cursor: 'pointer' }
}

export default NuevoCliente
