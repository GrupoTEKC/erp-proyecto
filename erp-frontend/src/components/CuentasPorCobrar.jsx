 import { useEffect, useState } from 'react'

function CuentasPorCobrar() {
  const [cuentas, setCuentas] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch('http://localhost:3001/CuentasPorCobrar')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setCuentas(data)
        } else {
          console.error('❌ Respuesta inválida:', data)
          setError('Error al cargar cuentas')
        }
      })
      .catch(err => {
        console.error(err)
        setError('Error de conexión')
      })
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
