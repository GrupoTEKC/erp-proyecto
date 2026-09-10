import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export default function Viaticos() {
  const location = useLocation()
  const navigate = useNavigate()

  // Datos recibidos desde FlujoCaja vía navigate('/viaticos', { state: ... })
  const datosIniciales = location.state || {}

  // Estados del formulario
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState(datosIniciales.id_empleado || '')
  const [origenPago, setOrigenPago] = useState(datosIniciales.origen_pago || 'EFECTIVO')
  const [concepto, setConcepto] = useState(datosIniciales.concepto || '')
  const [montoEntregado, setMontoEntregado] = useState(datosIniciales.monto_entregado || '')
  
  // Estados específicos de viáticos
  const [idRutaSeleccionada, setIdRutaSeleccionada] = useState('')
  const [idUnidadSeleccionada, setIdUnidadSeleccionada] = useState('')
  const [casetas, setCasetas] = useState([''])
  const [gasolina, setGasolina] = useState([''])
  const [comidas, setComidas] = useState([''])
  const [folios, setFolios] = useState([''])

  // Totales
  const totalCasetas = casetas.reduce((acc, curr) => acc + (parseFloat(curr) || 0), 0)
  const totalGasolina = gasolina.reduce((acc, curr) => acc + (parseFloat(curr) || 0), 0)
  const totalComidas = comidas.reduce((acc, curr) => acc + (parseFloat(curr) || 0), 0)
  const totalViaticosGeneral = totalCasetas + totalGasolina + totalComidas

  // Manejadores dinámicos
  const handleAgregarCampo = (setter, lista) => setter([...lista, ''])
  const handleCambioCampo = (setter, lista, index, valor) => {
    const copia = [...lista]
    copia[index] = valor
    setter(copia)
  }
  const handleEliminarCampo = (setter, lista, index) => {
    setter(lista.filter((_, i) => i !== index))
  }

  const handleGuardarViaticos = async (e) => {
    e.preventDefault()
    // Lógica para enviar a la API
    const payload = {
      id_gasto_temporal: datosIniciales.id_gasto_temporal,
      id_empleado: empleadoSeleccionado,
      id_ruta: idRutaSeleccionada,
      id_unidad: idUnidadSeleccionada,
      casetas,
      gasolina,
      comidas,
      folios,
      monto_total: totalViaticosGeneral,
      origen_pago: origenPago,
      concepto
    }
    
    // Guardar en backend y redirigir
    console.log('Guardando viáticos:', payload)
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>Comprobación / Registro de Viáticos</h2>
      {datosIniciales.id_gasto_temporal && (
        <div style={{ padding: '10px', background: '#f0fdf4', border: '1px solid #bbf7d0', marginBottom: '15px' }}>
          Comprobando gasto temporal ID: <strong>{datosIniciales.id_gasto_temporal}</strong> — Entregado: <strong>${montoEntregado}</strong>
        </div>
      )}

      <form onSubmit={handleGuardarViaticos}>
        {/* Aquí insertas el bloque JSX de viáticos */}
      </form>
    </div>
  )
}
