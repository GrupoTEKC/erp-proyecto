import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const API = 'https://erp-proyecto-production.up.railway.app'

function EditarCliente() {
  const navigate = useNavigate()
  const { id } = useParams()

  const [rutas, setRutas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [form, setForm] = useState({
    nombre: '',
    apellido1: '',
    apellido2: '',
    apodo: '',
    rfc: '',
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

  // =========================
  // CARGAR CLIENTE + RUTAS
  // =========================

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true)
        setError(null)

        const [resCliente, resRutas] = await Promise.all([
          fetch(`${API}/clientes/${id}`),
          fetch(`${API}/rutas`)
        ])

        if (!resCliente.ok)
          throw new Error('Cliente no encontrado')

        const cliente = await resCliente.json()
        const rutasData = await resRutas.json()

        setRutas(Array.isArray(rutasData) ? rutasData : [])

        // dividir correo
        let correo_usuario = ''
        let correo_dominio = '@gmail.com'

        if (cliente.email) {
          const partes = cliente.email.split('@')
          correo_usuario = partes[0]
          correo_dominio = '@' + partes[1]
        }

        setForm({
          nombre: cliente.nombre || '',
          apellido1: cliente.apellido1 || '',
          apellido2: cliente.apellido2 || '',
          apodo: cliente.apodo || '',
          rfc: cliente.rfc || '',
          categoria: cliente.categoria || '',
          categoriaOtro: cliente.categoria_otro || '',
          nombre_tienda: cliente.nombre_tienda || '',
          telefono_dueno: cliente.telefono_dueno || '',
          telefono_tienda: cliente.telefono_tienda || '',
          calle: cliente.calle || '',
          numero: cliente.numero || '',
          cp: cliente.cp || '',
          municipio: cliente.municipio || '',
          estado: cliente.estado || '',
          entre_calles: cliente.entre_calles || '',
          referencia: cliente.referencia || '',
          correo_usuario,
          correo_dominio,
          id_ruta: cliente.id_ruta || ''
        })

      } catch (err) {
        console.error(err)
        setError('Error cargando cliente')
      } finally {
        setLoading(false)
      }
    }

    cargarDatos()
  }, [id])

  // =========================
  // FORMATEO INPUTS
  // =========================

  const upper = v => v.toUpperCase()

  const handleChange = e => {
    const { name, value } = e.target
    let val = value

    if (name === 'rfc')
      val = value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 13)

    else if (name.includes('telefono'))
      val = value.replace(/\D/g, '').slice(0, 10)

    else if (name === 'cp')
      val = value.replace(/\D/g, '').slice(0, 5)

    else if (name !== 'correo_usuario')
      val = upper(value)

    setForm(prev => ({ ...prev, [name]: val }))
  }

  // =========================
  // VALIDACIÓN
  // =========================

  const validar = () => {
    if (!form.nombre || !form.apellido1 || !form.apellido2 || !form.rfc || !form.id_ruta) {
      alert('Complete campos obligatorios')
      return false
    }

    if (!form.telefono_dueno && !form.telefono_tienda) {
      alert('Ingrese al menos un teléfono')
      return false
    }

    return true
  }

  // =========================
  // GUARDAR CAMBIOS
  // =========================

  const guardar = async () => {
    if (!validar()) return

    const payload = {
      ...form,
      correo: form.correo_usuario
        ? form.correo_usuario + form.correo_dominio
        : ''
    }

    try {
      const res = await fetch(`${API}/clientes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!res.ok) throw new Error()

      alert('✅ Cliente actualizado')
      navigate('/clientes')

    } catch {
      alert('❌ Error actualizando')
    }
  }

  // =========================
  // UI
  // =========================

  if (loading) return <p>Cargando cliente...</p>
  if (error) return <p style={{ color: 'red' }}>{error}</p>

  return (
    <div style={styles.page}>
      <h2>Editar Cliente</h2>

      <div style={styles.grid}>
        <Campo label="Nombre" name="nombre" form={form} onChange={handleChange}/>
        <Campo label="Apellido 1" name="apellido1" form={form} onChange={handleChange}/>
        <Campo label="Apellido 2" name="apellido2" form={form} onChange={handleChange}/>
        <Campo label="RFC" name="rfc" form={form} onChange={handleChange}/>
        <Campo label="Tienda" name="nombre_tienda" form={form} onChange={handleChange}/>
        <Campo label="Teléfono dueño" name="telefono_dueno" form={form} onChange={handleChange}/>

        <div style={styles.field}>
          <label>Ruta</label>
          <select name="id_ruta" value={form.id_ruta} onChange={handleChange}>
            <option value="">Seleccione</option>
            {rutas.map(r => (
              <option key={r.id_ruta} value={r.id_ruta}>{r.nombre}</option>
            ))}
          </select>
        </div>
      </div>

      <div style={styles.buttons}>
        <button style={styles.save} onClick={guardar}>Guardar</button>
        <button style={styles.cancel} onClick={() => navigate('/clientes')}>Cancelar</button>
      </div>
    </div>
  )
}

// =========================
// COMPONENTE INPUT
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
// ESTILOS
// =========================

const vino = '#8B1E1E'

const styles = {
  page: { padding: 20, maxWidth: 900, margin: 'auto', fontFamily: 'Arial' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 12 },
  field: { display: 'flex', flexDirection: 'column' },
  buttons: { marginTop: 20, display: 'flex', gap: 10 },
  save: { background: vino, color: '#fff', border: 'none', padding: 10, borderRadius: 6 },
  cancel: { background: '#fff', color: vino, border: `1px solid ${vino}`, padding: 10, borderRadius: 6 }
}

export default EditarCliente
