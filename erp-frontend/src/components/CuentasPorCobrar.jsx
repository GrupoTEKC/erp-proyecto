import { useEffect, useState } from 'react'
import { API_URL } from '../config'

function CuentasPorCobrar() {
  const [cuentas, setCuentas] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    const cargarCuentas = async () => {
      try {
        const res = await fetch(`${API_URL}/CuentasPorCobrar`)

        if (!res.ok) {
          throw new Error('Respuesta del servidor inválida')
        }

        const data = await res.json()

        if (Array.isArray(data)) {
          setCuentas(data)
          setError(null)
        } else {
          console.error('❌ Respuesta inválida:', data)
          setError('Error al cargar cuentas')
        }

      } catch (err) {
        console.error('❌ Error:', err)
        setError('Error de conexión con el servidor')
        setCuentas([])
      }
    }

    cargarCuentas()
  }, [])

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>
  }

  return (
    <div>
      <h2>Cuentas por Cobrar</h2>

      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Folio</th>
            <th>Fecha</th>
            <th>Total</th>
            <th>Pagado</th>
            <th>Saldo</th>
          </tr>
        </thead>

        <tbody>
          {cuentas.map(c => (
            <tr key={c.id_pedido}>
              <td>{c.nombre_cliente}</td>
              <td>{c.folio}</td>
              <td>{c.fecha}</td>
              <td>${c.total}</td>
              <td>${c.total_pagado}</td>
              <td>${c.saldo}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default CuentasPorCobrar
