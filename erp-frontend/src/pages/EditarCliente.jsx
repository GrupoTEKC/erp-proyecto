import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const API = 'https://erp-proyecto-production.up.railway.app'

function EditarCliente() {
  const navigate = useNavigate()
  const { id } = useParams()

  const [rutas, setRutas] = useState([])

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

  // ======================
  // CARGAR DATOS
  // ======================

  useEffect(() => {
    const cargar = async () => {
      try {
        const [resCliente, resRutas] = await Promise.all([
          fetch(`${API}/clientes/${id}`),
          fetch(`${API}/rutas`)
        ])

        const cliente = await resCliente.json()
        const rutasData = await resRutas.json()

        setRutas(rutasData)

        // separar correo
        let correo_usuario = ''
        let correo_dominio = '@gmail.com'

        if (cliente.email) {
          const partes = cliente.email.split('@')
          correo_usuario = partes[0]
          correo_dominio = '@' + partes[1]
        }

        setForm({
          ...cliente,
          categoriaOtro: cliente.categoria_otro || '',
          correo_usuario,
          correo_dominio
        })

      } catch {
        alert('Error cargando cliente')
      }
    }

    cargar()
  }, [id])

  // ======================
  // FORMATEO INPUT
  // ======================

  const upper = v => v.toUpperCase()

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

  // ======================
  // VALIDAR
  // ======================

  const validar = () => {
    if (
      !form.nombre ||
      !form.apellido1 ||
      !form.apellido2 ||
      !form.rfc ||
      !form.categoria ||
      !form.nombre_tienda ||
      !form.calle ||
      !form.numero ||
      !form.cp ||
      !form.municipio ||
      !form.estado ||
      !form.id_ruta
    ) {
      alert('Complete campos obligatorios')
      return false
    }

    return true
  }

  // ======================
  // GUARDAR
  // ======================

  const guardarCambios = async () => {
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
      alert('❌ Error al actualizar')
    }
  }

  // ======================
  // UI (MISMO FORMULARIO)
  // ======================

  return (
    <div style={{ padding: 20 }}>
      <h2>Editar Cliente</h2>

      {Object.keys(form).map(key => (
        key !== 'correo_dominio' && (
          <div key={key}>
            <label>{key}</label>
            <input
              name={key}
              value={form[key] || ''}
              onChange={handleChange}
            />
          </div>
        )
      ))}

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
