import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/TRANSPARENTE.png'
import logo2 from '../assets/firmetec-logo.png'
import logo3 from '../assets/pegatek-logo.png'

const API = 'https://erp-proyecto-production.up.railway.app'

const styles = {
  page: { backgroundColor: '#ffffff', minHeight: '100vh', padding: '20px', fontFamily: 'Arial, sans-serif' },
  header: { marginBottom: '20px' },
  backButton: { display: 'inline-flex', alignItems: 'center', padding: '10px 14px', fontSize: '14px', backgroundColor: '#fff', color: '#8B1E1E', border: '1px solid #8B1E1E', borderRadius: '6px', cursor: 'pointer' },
  title: { marginTop: '20px', marginBottom: '15px', color: '#071849', fontWeight: 'bold' },
  field: { width: '260px', padding: '8px 10px', fontSize: '14px', borderRadius: '6px', border: '1px solid #8B1E1E', boxSizing: 'border-box', marginBottom: 15 },
  columnas: { display: 'flex', gap: '15px', overflowX: 'auto' },
  columna: { minWidth: '320px', background: '#f4f6f8', borderRadius: '10px', padding: '10px' },
  tarjeta: { border: '1px solid #ddd', borderRadius: '8px', padding: '10px', marginBottom: '10px', backgroundColor: '#fff' },
  button: { padding: '6px 10px', margin: '2px', borderRadius: '6px', border: 'none', cursor: 'pointer' },
  primary: { backgroundColor: '#8B1E1E', color: '#fff' },
  secondary: { backgroundColor: '#fff', border: '1px solid #8B1E1E', color: '#8B1E1E' },
  estado: (estado) => ({
    color: '#fff',
    padding: '4px 8px',
    borderRadius: '6px',
    fontSize: '12px',
    backgroundColor:
     estado === 'pendiente' ? '#c0392b' :
     estado === 'programado' ? '#f39c12' : // 🔥 AÑADIR
     estado === 'en_ruta' ? '#27ae60' :
     estado === 'entregado' ? '#2c3e50' : // 🔥 AÑADIR
     estado === 'pagado' ? '#8e44ad' : // 🔥 AÑADIR
     estado === 'cancelado' ? '#7f8c8d' :
     '#34495e'
  }),
  topBar: { display: 'flex', gap: '10px', alignItems: 'center' },
  dropdown: { position: 'relative', width: '260px' },
  dropdownButton: {
    width: '100%',
    padding: '8px 10px',
    fontSize: '14px',
    borderRadius: '6px',
    border: '1px solid #8B1E1E',
    background: '#fff',
    cursor: 'pointer',
    textAlign: 'left'
  },
  dropdownContent: {
    position: 'absolute',
    top: '100%',
    left: 0,
    width: '100%',
    background: '#fff',
    border: '1px solid #ddd',
    borderRadius: '6px',
    padding: '10px',
    zIndex: 10,
    maxHeight: '200px',
    overflowY: 'auto'
  }
}

function ConsultarPedidos() {
  const [pedidos, setPedidos] = useState([])
  const [rutas, setRutas] = useState([])
  const [rutasSeleccionadas, setRutasSeleccionadas] = useState([])
  const [mostrarDropdown, setMostrarDropdown] = useState(false)
  const [busqueda, setBusqueda] = useState('')

  // 🔥 NUEVO
  const [estadoSeleccionado, setEstadoSeleccionado] = useState('')
  const [productosProgramar, setProductosProgramar] = useState([])
  const [modalEntrega, setModalEntrega] = useState(false)
  const [modalCancelar, setModalCancelar] = useState(false)
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null)
  const [detalle, setDetalle] = useState([])
  const [choferes, setChoferes] = useState([])
  const [unidades, setUnidades] = useState([])
  const [comentarioCancelacion, setComentarioCancelacion] = useState('')
  const [modalPassword, setModalPassword] = useState(false)
  const [password, setPassword] = useState('')
  const [errorPassword, setErrorPassword] = useState('')
  const [modalProgramar, setModalProgramar] = useState(false)
  const [fechaProgramada, setFechaProgramada] = useState('')
  const [editarUnidad, setEditarUnidad] = useState(false)
  const [editarChofer, setEditarChofer] = useState(false)
  const [comentarioProgramacion, setComentarioProgramacion] = useState('')
  const [pedidosSeleccionados, setPedidosSeleccionados] = useState([])
  const [form, setForm] = useState({
    id_chofer: '',
    id_unidad: '',
    comentario: '',
    otro_chofer: false,
    nombre_chofer: '',
    apellido_paterno: '',
    apellido_materno: '',
    productos: []
  })

  const navigate = useNavigate()
  const urlLimpia = API?.endsWith('/') ? API.slice(0, -1) : API

  const cargarPedidos = async () => {
    const res = await fetch(`${urlLimpia}/pedidos`)
    const data = await res.json()
    setPedidos(data)
  }

  const cargarRutas = async () => {
    try {
      const res = await fetch(`${urlLimpia}/rutas`)
      const data = await res.json()
      setRutas(data)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    cargarPedidos()
    cargarRutas()
  }, [])

  const calcularDias = (fecha) => {
    if (!fecha) return 0
    const inicio = new Date(fecha)
    const hoy = new Date()
    return Math.floor((hoy - inicio) / (1000 * 60 * 60 * 24))
  }

  const obtenerNombreRuta = (id) => {
    const ruta = rutas.find(r => r.id_ruta === Number(id))
    return ruta ? ruta.nombre : ''
  }

  const toggleRuta = (id) => {
    if (rutasSeleccionadas.includes(id)) {
      setRutasSeleccionadas(rutasSeleccionadas.filter(r => r !== id))
    } else {
      setRutasSeleccionadas([...rutasSeleccionadas, id])
    }
  }

  const togglePedido = (id) => {
  if (pedidosSeleccionados.includes(id)) {
    setPedidosSeleccionados(pedidosSeleccionados.filter(p => p !== id))
  } else {
    setPedidosSeleccionados([...pedidosSeleccionados, id])
  }
}
  
  // 🔥 FILTRO COMPLETO
  const pedidosFiltrados = pedidos.filter(p =>
    (
      p.id_pedido.toString().includes(busqueda) ||
      (p.cliente || '').toLowerCase().includes(busqueda.toLowerCase())
    )
    &&
    (
      estadoSeleccionado === '' ||
      estadoSeleccionado === 'todos' ||
      p.estado === estadoSeleccionado
    )
  )

  const pedidosPorRuta = pedidosFiltrados.reduce((acc, pedido) => {
    const ruta = pedido.id_ruta || 'SIN RUTA'
    if (!acc[ruta]) acc[ruta] = []
    acc[ruta].push(pedido)
    return acc
  }, {})

const abrirEntrega = async (id) => {
  const res = await fetch(`${urlLimpia}/pedidos/${id}/detalle`)
  const data = await res.json()

  const ch = await fetch(`${urlLimpia}/choferes`)
  const chData = await ch.json()

  const un = await fetch(`${urlLimpia}/unidades`)
  const unData = await un.json()

  setChoferes(chData)
  setUnidades(unData)

  setForm({
    id_chofer: data[0]?.id_chofer || '',
    id_unidad: data[0]?.id_unidad || '',
    comentario: '',
    otro_chofer: false,
    nombre_chofer: '',
    apellido_paterno: '',
    apellido_materno: '',

    productos: data.map(p => ({
      id_producto: p.id_producto,
      nombre: p.nombre,

      cantidad_planeada: Number(
        p.cantidad_planeada ?? 0
      ),

      cantidad_entregada: Number(
        p.cantidad_planeada ?? 0
      )
    }))
  })

  setPedidoSeleccionado(id)
  setEditarChofer(false)
  setEditarUnidad(false)
  setModalEntrega(true)
}
  
const imprimirMultiples = async () => {
  try {

    
    // 🔥 AGREGA ESTO AQUÍ
  let listaChoferes = choferes

if (listaChoferes.length === 0) {
  const ch = await fetch(`${urlLimpia}/choferes`)
  const chData = await ch.json()
  setChoferes(chData)
  listaChoferes = chData // 🔥 importante
}

    // 🔥 FILTRAR SOLO LOS QUE APLICAN
    const pedidosValidos = pedidos
      .filter(p => pedidosSeleccionados.includes(p.id_pedido))
      .filter(p => p.estado === 'en_ruta')

    // 🔥 AGRUPAR
    const grupos = {}
    pedidosValidos.forEach(p => {
      const key = `${p.id_ruta}-${p.id_chofer}-${p.id_unidad}-${p.fecha_programada?.slice(0,10)}`
      if (!grupos[key]) grupos[key] = []
      grupos[key].push(p)
    })
    
   let contenidoTotal = `
  <div style="text-align:center; font-size:11px; margin-bottom:10px;">
    Carretera federal Perote – Teziutlán<br/>
    Calle Piñón No. 2, Loc. Magueyitos
  </div>
`
    
    // 🔥 RECORRER GRUPOS
    for (const grupoKey in grupos) {
      const pedidosGrupo = grupos[grupoKey]

      const choferesUnicos = new Set(
  pedidosGrupo.map(p => p.id_chofer)
)

      const variosChoferes = choferesUnicos.size > 1
      
      const primerPedido = pedidosGrupo[0]

      // 🔥 OBTENER CHOFER IGUAL QUE EN INDIVIDUAL
      const idChofer = primerPedido.id_chofer

     const choferEncontrado = listaChoferes.find(
  c => c.id_chofer === idChofer
)

     const choferNombre = choferEncontrado
     ? `${choferEncontrado.nombre} ${choferEncontrado.apellido_paterno || ''} ${choferEncontrado.apellido_materno || ''}`.trim()
     : 'SIN CHOFER'
      
       const detalles = await Promise.all(
    pedidosGrupo.map(p =>
      fetch(`${urlLimpia}/pedidos/${p.id_pedido}/detalle`)
        .then(r => r.json())
    )
  )
      let bloquePedidos = ''
      for (let i = 0; i < pedidosGrupo.length; i++) {
       const pedido = pedidosGrupo[i]
      const detalle = detalles[i]

        bloquePedidos += `
          <div class="pedido">
            <div class="titulo-pedido">
           Pedido ${pedido.id_pedido} | ${pedido.cliente}${pedido.nombre_tienda ? ' - ' + pedido.nombre_tienda : ''}
            </div>

            <table>
              ${detalle.map(p => {
               const cantidad = Number(
  p.cantidad_entregada ??
  p.cantidad_planeada ??
  p.cantidad ??
  p.cantidad_pedida ??
  0
)

const precio = Number(
  p.precio_unitario ??
  p.precio_venta ??
  p.precio ??
  p.precio_lista ??
  p.precio_final ??
  p.precio_cliente ??
  0
)
                const subtotal = cantidad * precio

               return `
               <tr>
                   <td style="width:60px; text-align:center;">${cantidad}</td>
                   <td>${p.nombre}</td>
                   <td style="width:90px; text-align:right;">$${precio.toFixed(2)}</td>
                   <td style="width:110px; text-align:right;">$${subtotal.toFixed(2)}</td>
               </tr>
                     `
                
              }).join('')}
            </table>

            <div class="total">
              TOTAL: $${Number(pedido.total || 0).toFixed(2)}
            </div>
          </div>
        `
      }

     contenidoTotal += `
<div class="hoja">

  <div class="contenido">
    <div class="header">
      <div class="fecha">
        <div>${new Date().toLocaleDateString()}</div>
        <div>Ruta ${primerPedido.id_ruta}</div>
      </div>
    </div>

    ${bloquePedidos}
  </div>

 <div class="firmas ${variosChoferes ? 'horizontal' : 'vertical'}">
    <div class="firma">
      <div class="linea">CHOFER</div>
      <div class="nombre-firma">${choferNombre}</div>
    </div>
    <div class="firma">
      <div class="linea">AUTORIZO</div>
      <div class="nombre-firma">SUPERVISOR: JOSHUA ALVAREZ MENDEZ</div>
    </div>
  </div>

</div>
`
    }

    // 🔥 IMPRIMIR
    const win = window.open('', '_blank')

    win.document.write(`
      <html>
        <head>
          <title>Pedidos</title>
          <style>
            body {
              font-family: Arial;
              font-size: 12px;
              padding: 10px;
            }

            .header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 10px;
            }

            .logo {
              height: 50px;
            }

            .info {
              text-align: center;
              font-size: 11px;
            }

            .fecha {
              text-align: right;
              font-size: 11px;
            }

            .pedido {
              border-top: 1px solid #000;
              margin-top: 10px;
              padding-top: 5px;
            }

            .titulo-pedido {
              font-weight: bold;
              margin-bottom: 5px;
            }

            table {
              width: 100%;
              border-collapse: collapse;
            }

            td {
              padding: 3px;
            }

            .total {
              text-align: right;
              font-weight: bold;
              margin-top: 5px;
            }

            @media print {
             .hoja {
             display: flex;
             flex-direction: column;
             min-height: 95vh;
             justify-content: space-between;
             page-break-after: always;
             }

.firmas.horizontal {
  display: flex;
  justify-content: space-between;
}

.firmas.vertical {
  display: flex;
  justify-content: flex-end; /* 👉 todo a la derecha */
  gap: 40px; /* 👉 separación entre firmas */
}

            .firma {
             width: 42%;
             text-align: center;
             font-size: 10px;
            }

            .linea {
            border-top: 1px solid #000;
            padding-top: 4px;
            font-weight: bold;
            }
            
           .header {
  position: relative;
  display: flex;
  justify-content: flex-end; /* todo a la derecha */
  align-items: center;
}

.hoja {
  display: flex;
  flex-direction: column;
  min-height: auto; /* 🔥 clave */
}

.contenido {
  flex-grow: 0;
}

.firmas {
  margin-top: 60px; /* 🔥 más aire */
  margin-bottom: 40px; /* 🔥 lo sube visualmente del fondo */
  display: flex;
  justify-content: space-between;
}

          .header {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

            .nombre-firma {
            margin-top: 4px;
            min-height: 14px;
            }
          }
          </style>
        </head>
        <body>
          ${contenidoTotal}
        </body>
      </html>
    `)

    win.document.close()
    win.focus()
    win.onload = () => {
    win.print()
    win.close()
}
    setPedidosSeleccionados([])
    
  } catch (error) {
    console.error(error)
  }
}
  
const imprimirPedido = async (pedido) => {
  try {
    const res = await fetch(`${urlLimpia}/pedidos/${pedido.id_pedido}/detalle`)
    const detalle = await res.json()

    const pedidoActual = pedidos.find(
      p => p.id_pedido === pedido.id_pedido
    )

    // 🔥 SACAR ID DE CHOFER (de donde venga)
    const idChofer =
      detalle[0]?.id_chofer ||
      pedidoActual?.id_chofer ||
      null

    // 🔥 BUSCAR EN LISTA LOCAL (por si existe)
    const choferEncontrado = choferes.find(
      c => c.id_chofer === idChofer
    )

    // 🔥 ARMAR NOMBRE CORRECTAMENTE
    const choferNombre =
      detalle[0]?.nombre_chofer || // 👈 si backend ya lo manda
      (choferEncontrado
        ? `${choferEncontrado.nombre} ${choferEncontrado.apellido_paterno || ''} ${choferEncontrado.apellido_materno || ''}`.trim()
        : 'SIN CHOFER')

    const fechaActual = new Date().toLocaleDateString()
    const horaActual = new Date().toLocaleTimeString()

    const logoSrc = logo
    const logo2Src = logo2
    const logo3Src = logo3

    const contenido = `
      <div class="copia">
        <div class="header">
          <div class="logos">
            <img src="${logoSrc}" alt="logo principal" />
          </div>

          <div class="empresa">
            <div class="titulo">GRUPO TEKC</div>
            <div>Carretera federal Perote – Teziutlán, Calle Piñón No. 2, Loc. Magueyitos</div>
            <div>Tel. 282-596-67-39</div>
          </div>

          <div class="folio">
            <div><strong>Pedido #${pedido.id_pedido}</strong></div>
            <div>${fechaActual}</div>
            <div>${horaActual}</div>
          </div>
        </div>

        <div class="datos">
          <div><strong>Cliente:</strong> ${pedidoActual?.cliente || ''}</div>
          <div><strong>Tienda:</strong> ${pedidoActual?.nombre_tienda || ''}</div>
          <div><strong>Ruta:</strong> ${obtenerNombreRuta(pedidoActual?.id_ruta)}</div>
        </div>

        <table>
          <thead>
            <tr>
              <th style="width:70px;">Cant.</th>
              <th>Descripción</th>
              <th style="width:90px;">P. Unit.</th>
              <th style="width:110px;">Subtotal</th>
            </tr>
          </thead>

          <tbody>
            ${detalle.map(p => {
              const cantidad = Number(
                p.cantidad_entregada ??
                p.cantidad_planeada ??
                p.cantidad ??
                p.cantidad_pedida ??
                0
              )

              const precio = Number(
                p.precio_unitario ??
                p.precio_venta ??
                p.precio ??
                p.precio_lista ??
                p.precio_final ??
                p.precio_cliente ??
                0
              )

              const subtotal = cantidad * precio

              
              
              return `
                <tr>
                  <td>${cantidad}</td>
                  <td>${p.nombre || ''}</td>
                  <td>$${precio.toFixed(2)}</td>
                  <td>$${subtotal.toFixed(2)}</td>
                </tr>
              `
            }).join('')}

            <tr>
              <td colspan="3" style="text-align:right;">
                <strong>Total pedido</strong>
              </td>
              <td>
                <strong>$${Number(pedidoActual?.total || 0).toFixed(2)}</strong>
              </td>
            </tr>
          </tbody>
        </table>

     <div class="firmas">
          <div class="firma">
            <div class="linea">CHOFER</div>
            <div class="nombre-firma">${choferNombre}</div>
          </div>


          <div class="firma">
            <div class="linea">AUTORIZO</div>
            <div class="nombre-firma">SUPERVISOR: JOSHUA ALVAREZ MENDEZ </div>
          </div>
        </div>
      </div>
    `

    const win = window.open('', '_blank', 'width=900,height=700')

    win.document.write(`
      <html>
        <head>
          <title>Remisión ${pedido.id_pedido}</title>

          <style>
            * {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }

            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
              color: #000;
            }

            .copia {
              position: relative;
              height: 49vh;
              padding: 14px 22px;
              box-sizing: border-box;
              border-bottom: 1px dashed #888;
              overflow: hidden;
            }

             .header {
              display: flex;
              align-items: center;
              justify-content: space-between; /* 🔥 déjalo así */
              margin-bottom: 10px;
              }

            .logos {
              display: flex;
              align-items: center;
              gap: 12px;
              width: 240px;
            }

            .logos img {
              display: block;
            }

            .logos img:nth-child(1) {
              height: 82px;
              width: auto;
            }

            .logos img:nth-child(2),
            .logos img:nth-child(3) {
              height: 36px;
              width: auto;
            }

          .empresa {
          flex: 1;
          text-align: center;
          font-size: 11px;
          line-height: 1.4;
          margin: 0 auto; /* 🔥 esto lo centra REAL */
          }
         .titulo {
          font-size: 19px;
          font-weight: bold;
          letter-spacing: 0.5px; /* 🔥 se ve más “empresa” */
          margin-bottom: 4px;
          }

            .folio {
              width: 130px;
              text-align: right;
              font-size: 10px;
              line-height: 1.4;
            }

            .datos {
              margin-top: 8px;
              margin-bottom: 12px;
              font-size: 10px;
              line-height: 1.6;
            }

            table {
              width: 100%;
              border-collapse: collapse;
              font-size: 10px;
            }

            th,
            td {
              border: 1px solid #888;
              padding: 5px 6px;
            }

            th {
              background: #f2dede;
              color: #7a1c1c;
              text-align: left;
            }

            tbody tr:nth-child(even) {
              background: #fafafa;
            }

            .firmas {
              margin-top: 130px;
              display: flex;
              justify-content: space-between;
            }

            .firma {
              width: 42%;
              text-align: center;
              font-size: 10px;
            }

            .linea {
              border-top: 1px solid #000;
              padding-top: 4px;
              font-weight: bold;
            }

            .nombre-firma {
              margin-top: 4px;
              min-height: 14px;
            }

            @media print {
              body {
                margin: 0;
                padding: 0;
              }
            }
          </style>
        </head>

        <body>
          ${contenido}
          ${contenido}
        </body>
      </html>
    `)

    win.document.close()

    setTimeout(() => {
      win.focus()
      win.print()
      win.close()
    }, 900)

  } catch (error) {
    console.error(error)
    alert('No se pudo imprimir')
  }
}
  
const guardarEntrega = async () => {
  try {
    // VALIDAR CHOFER NUEVO
    if (form.otro_chofer) {
      if (
        !form.nombre_chofer.trim() ||
        !form.apellido_paterno.trim() ||
        !form.apellido_materno.trim()
      ) {
        return alert("Completa los datos del chofer")
      }
    }

    // VALIDAR UNIDAD
    if (!form.id_unidad) {
      return alert("Selecciona unidad")
    }

    // VALIDAR CHOFER
    if (!form.id_chofer && !form.otro_chofer) {
      return alert("Selecciona chofer")
    }

    // VALIDAR DIFERENCIAS
    const hayDiferencias = form.productos.some(
      p => Number(p.cantidad_entregada) !== Number(p.cantidad_planeada)
    )

    if (hayDiferencias && !form.comentario.trim()) {
      return alert("Debes agregar comentario por diferencias")
    }

    // ENVIAR AL BACKEND
    const res = await fetch(
      `${urlLimpia}/pedidos/${pedidoSeleccionado}/en-curso`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      }
    )

    const data = await res.json()

    if (!res.ok) {
      return alert(data.error || "Error al guardar entrega")
    }

    // CERRAR MODALES
    setModalEntrega(false)
    setModalPassword(false)

    // LIMPIAR PASSWORD
    setPassword("")
    setErrorPassword("")

    // RECARGAR PEDIDOS
   cargarPedidos()

  } catch (error) {
    console.error(error)
    alert("Error de conexión con servidor")
  }
}

const confirmarConPassword = async () => {
  if (password !== "JMAemb#1?_") {
    setErrorPassword("Contraseña incorrecta")
    return
  }

  setErrorPassword("")

  // PRIMERO GUARDA
  await guardarEntrega()
}
  
  const abrirCancelar = (id) => {
    setPedidoSeleccionado(id)
    setComentarioCancelacion('')
    setModalCancelar(true)
  }

  const confirmarCancelacion = async () => {
    if (!comentarioCancelacion.trim()) {
      return alert("Debes escribir el motivo de cancelación")
    }

    const res = await fetch(`${urlLimpia}/pedidos/${pedidoSeleccionado}/cancelar`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        comentario: comentarioCancelacion
      })
    })

    if (!res.ok) {
      const err = await res.json()
      return alert(err.error)
    }

    setModalCancelar(false)
    cargarPedidos()
  }

 const abrirProgramar = async (id) => {
  const res = await fetch(`${urlLimpia}/pedidos/${id}/detalle`)
  const data = await res.json()

  const ch = await fetch(`${urlLimpia}/choferes`)
  const chData = await ch.json()

  const un = await fetch(`${urlLimpia}/unidades`)
  const unData = await un.json()

  setChoferes(chData)
  setUnidades(unData)

  setPedidoSeleccionado(id)

  setProductosProgramar(
    data.map(p => ({
      id_producto: p.id_producto,
      nombre: p.nombre,
      cantidad_pedida: Number(p.cantidad_pedida || p.cantidad || 0),
      cantidad_planeada: Number(p.cantidad_planeada || p.cantidad_pedida || p.cantidad || 0)
    }))
  )

 setForm({
  id_chofer: '',
  id_unidad: '',
  comentario: '',
  otro_chofer: false,
  nombre_chofer: '',
  apellido_paterno: '',
  apellido_materno: '',
  productos: []
})
   
  setFechaProgramada('')
  setComentarioProgramacion('')
  setModalProgramar(true)
}
  
const programarPedido = async () => {
  if (!fechaProgramada) {
    return alert("Selecciona una fecha")
  }

  const hayDiferencias = productosProgramar.some(
    p => Number(p.cantidad_planeada) !== Number(p.cantidad_pedida)
  )

  if (hayDiferencias && !comentarioProgramacion.trim()) {
    return alert("Debes indicar la razón del faltante")
  }

  if (!form.id_chofer) {
  return alert("Selecciona chofer")
  }

  if (!form.id_unidad) {
  return alert("Selecciona unidad")
  }

  
  const res = await fetch(`${urlLimpia}/pedidos/${pedidoSeleccionado}/programar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
    fecha_programada: fechaProgramada,
    comentario: comentarioProgramacion,
    id_chofer: form.id_chofer,
    id_unidad: form.id_unidad,
    comentario_ruta: form.comentario,
    productos: productosProgramar
    })
  })

  if (!res.ok) {
    const err = await res.json()
    return alert(err.error)
  }

  setModalProgramar(false)
  setFechaProgramada('')
  setComentarioProgramacion('')
  setProductosProgramar([])
  cargarPedidos()
}

  
  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <button style={styles.backButton} onClick={() => navigate('/')}>
          ⬅ Volver
        </button>
      </div>

      <h2 style={styles.title}>Consultar pedidos</h2>

      <button
      style={{ ...styles.button, ...styles.primary, marginBottom: 10 }}
      disabled={pedidosSeleccionados.length === 0}
      onClick={imprimirMultiples}
      >
     🖨 Imprimir seleccionados ({pedidosSeleccionados.length})
       </button>
       
      <div style={styles.topBar}>
        <input
          style={{ ...styles.field, marginBottom: 0 }}
          placeholder="Buscar..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
        />

        {/* 🔥 SELECT ESTATUS */}
        <select
          style={{ ...styles.field, marginBottom: 0 }}
          value={estadoSeleccionado}
          onChange={e => setEstadoSeleccionado(e.target.value)}
        >
          <option value="">Seleccionar por estatus</option>
          <option value="todos">Todos</option>
          <option value="pendiente">Pendiente</option>
          <option value="programado">Programado</option>
          <option value="en_ruta">En ruta</option>
          <option value="entregado">Entregado</option>
          <option value="cancelado">Cancelado</option>
          <option value="pagado">Pagado</option>
        </select>

        <div style={styles.dropdown}>
          <div
            style={styles.dropdownButton}
            onClick={() => setMostrarDropdown(!mostrarDropdown)}
          >
            Seleccionar rutas ▼
          </div>

          {mostrarDropdown && (
            <div style={styles.dropdownContent}>
              {rutas.map(r => (
                <label key={r.id_ruta} style={{ display: 'block' }}>
                  <input
                    type="checkbox"
                    checked={rutasSeleccionadas.includes(r.id_ruta)}
                    onChange={() => toggleRuta(r.id_ruta)}
                  />
                  {' '}Ruta {r.id_ruta} - {r.nombre.replace(/^Ruta\s*\d+\s*-\s*/i, '')}
                </label>
              ))}
              <button
                style={{ ...styles.button, ...styles.secondary, marginTop: 5 }}
                onClick={() => setRutasSeleccionadas([])}
              >
                Ver todas
              </button>
            </div>
          )}
        </div>
      </div>

      <div style={styles.columnas}>

        {/* 🔥 MENSAJE VACÍO */}
        {Object.entries(pedidosPorRuta).length === 0 && (
          <div style={{ textAlign:'center', padding:'20px', color:'#777' }}>
            📭 No hay pedidos en este estado
          </div>
        )}

        {Object.entries(pedidosPorRuta)
          .filter(([ruta]) =>
            rutasSeleccionadas.length === 0 ||
            rutasSeleccionadas.includes(Number(ruta))
          )
          .map(([ruta, lista]) => (
            <div key={ruta} style={styles.columna}>
              <h3 style={{ textAlign: 'center' }}>
                Ruta {ruta}
                <br />
                <span style={{ fontSize: '13px', color: '#555' }}>
                  {obtenerNombreRuta(ruta)}
                </span>
              </h3>

              {lista.map(p => {
                const dias = calcularDias(p.fecha)
                const alerta = dias > 7

                return (
                  <div key={p.id_pedido} style={{
                    ...styles.tarjeta,
                    backgroundColor: alerta ? '#ffe5e5' : '#fff'
                  }}>
                    <input
                    type="checkbox"
                    checked={pedidosSeleccionados.includes(p.id_pedido)}
                    onChange={() => togglePedido(p.id_pedido)}
                    disabled={p.estado !== 'en_ruta'} // 🔥 aquí va
                    />
                    
                    <strong>ID:</strong> {p.id_pedido} <br />
                    <strong>Cliente:</strong> {p.cliente} <br />
                    <strong>Tienda:</strong> {p.nombre_tienda || '-'} <br />
                    <strong>Fecha:</strong> {p.fecha ? new Date(p.fecha).toLocaleDateString() : '-'} <br />
                    {p.fecha_programada && (
                   <>
                   <strong>Programado:</strong> {new Date(p.fecha_programada).toLocaleDateString()} <br />
                   </>
                    )}
                    <strong>Días:</strong> {dias} <br />

                    <span style={styles.estado(p.estado)}>
                      {p.estado}
                    </span>

                    <div style={{ marginTop: 8 }}>
                      <button
                        style={{ ...styles.button, ...styles.primary }}
                        disabled={!['pendiente', 'programado'].includes(p.estado)}
                        onClick={() => abrirEntrega(p.id_pedido)}
                      >
                        Preparar envío
                      </button>

                      <button
                      style={{ ...styles.button, backgroundColor: '#f39c12', color: '#fff' }}
                      disabled={!['pendiente', 'programado'].includes(p.estado)}
                      onClick={() => abrirProgramar(p.id_pedido)}
                      >
                      Programar envío
                      </button>
                      
                      <button
                        style={{ ...styles.button, ...styles.secondary }}
                       disabled={!['pendiente', 'programado'].includes(p.estado)}
                        onClick={() => abrirCancelar(p.id_pedido)}
                      >
                        Cancelar
                      </button>

                      <button
                      style={{ ...styles.button, backgroundColor: '#2c3e50', color: '#fff' }}
                      disabled={p.estado !== 'en_ruta'}
                      onClick={() => imprimirPedido(p)}
                      >
                      Imprimir
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          ))}
      </div>

      {modalEntrega && (
  <div
    style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}
  >
    <div
      style={{
        background: '#fff',
        padding: 20,
        width: 600,
        borderRadius: 10,
        maxHeight: '90vh',
        overflowY: 'auto'
      }}
    >
      <h3 style={styles.title}>Preparar entrega</h3>

      {form.productos.map((p, i) => (
        <div key={i} style={{ marginBottom: 15 }}>
          <strong>{p.nombre}</strong>
          <br />
          Planeado: {p.cantidad_planeada}

          <input
            type="number"
            min="0"
            style={styles.field}
            value={p.cantidad_entregada}
            onChange={e => {
              let valor = Number(e.target.value)
              if (valor < 0) valor = 0

              const copia = [...form.productos]
              copia[i].cantidad_entregada = valor

              setForm({ ...form, productos: copia })
            }}
          />
        </div>
      ))}

      {/* CHOFER */}
      <div style={{ marginBottom: 10 }}>
        <strong>Chofer</strong>{' '}
        <button
          type="button"
          style={{ ...styles.button, ...styles.secondary }}
          onClick={() => setEditarChofer(true)}
        >
          ✏️
        </button>
      </div>

      <select
        style={{ ...styles.field, width: '100%' }}
        disabled={!editarChofer}
        value={form.id_chofer}
        onChange={e => {
          const value = e.target.value

          if (!window.confirm('¿Cambiar chofer programado?')) return

          if (value === 'otro') {
            setForm({
              ...form,
              id_chofer: '',
              otro_chofer: true
            })
          } else {
            setForm({
              ...form,
              id_chofer: value,
              otro_chofer: false
            })
          }
        }}
      >
        <option value="">Selecciona chofer</option>

        {choferes.map(c => (
          <option key={c.id_chofer} value={c.id_chofer}>
            {c.nombre}
          </option>
        ))}

        <option value="otro">Otro</option>
      </select>

      {form.otro_chofer && (
        <div>
          <input
            style={{ ...styles.field, width: '100%' }}
            placeholder="Nombre"
            onChange={e =>
              setForm({ ...form, nombre_chofer: e.target.value })
            }
          />

          <input
            style={{ ...styles.field, width: '100%' }}
            placeholder="Apellido paterno"
            onChange={e =>
              setForm({ ...form, apellido_paterno: e.target.value })
            }
          />

          <input
            style={{ ...styles.field, width: '100%' }}
            placeholder="Apellido materno"
            onChange={e =>
              setForm({ ...form, apellido_materno: e.target.value })
            }
          />
        </div>
      )}

      {/* UNIDAD */}
      <div style={{ marginBottom: 10 }}>
        <strong>Unidad</strong>{' '}
        <button
          type="button"
          style={{ ...styles.button, ...styles.secondary }}
          onClick={() => setEditarUnidad(true)}
        >
          ✏️
        </button>
      </div>

      <select
        style={{ ...styles.field, width: '100%' }}
        disabled={!editarUnidad}
        value={form.id_unidad}
        onChange={e => {
          if (!window.confirm('¿Cambiar unidad programada?')) return

          setForm({
            ...form,
            id_unidad: e.target.value
          })
        }}
      >
        <option value="">Selecciona unidad</option>

        {unidades.map(u => (
          <option key={u.id_unidad} value={u.id_unidad}>
            {u.nombre}
          </option>
        ))}
      </select>

      {/* COMENTARIO */}
      <textarea
        style={{ ...styles.field, width: '100%', height: 80 }}
        placeholder="Comentario"
        value={form.comentario}
        onChange={e =>
          setForm({ ...form, comentario: e.target.value })
        }
      />

      <div style={{ textAlign: 'right', marginTop: 10 }}>
        <button
          style={{ ...styles.button, ...styles.secondary }}
          onClick={() => setModalEntrega(false)}
        >
          Cerrar
        </button>

        <button
          style={{ ...styles.button, ...styles.primary }}
          onClick={() => setModalPassword(true)}
        >
          Guardar
        </button>
      </div>
    </div>
  </div>
)}

      {/* 🔥 MODAL CANCELAR COMPLETO */}
      {modalCancelar && (
        <div style={{
          position:'fixed', top:0,left:0,right:0,bottom:0,
          background:'rgba(0,0,0,0.5)',
          display:'flex', justifyContent:'center', alignItems:'center'
        }}>
          <div style={{ background:'#fff', padding:20, width:400, borderRadius:10 }}>
            <h3 style={styles.title}>Cancelar pedido</h3>

            <textarea
              style={{ ...styles.field, width:'100%', height:100 }}
              placeholder="Motivo"
              value={comentarioCancelacion}
              onChange={e => setComentarioCancelacion(e.target.value)}
            />

            <button style={{ ...styles.button, ...styles.primary }} onClick={confirmarCancelacion}>
              Confirmar
            </button>

            <button style={{ ...styles.button, ...styles.secondary }} onClick={() => setModalCancelar(false)}>
              Cerrar
            </button>
          </div>
        </div>
      )}
      {/* 🔐 MODAL PASSWORD */}
{modalPassword && (
  <div style={{
    position:'fixed', top:0,left:0,right:0,bottom:0,
    background:'rgba(0,0,0,0.5)',
    display:'flex', justifyContent:'center', alignItems:'center'
  }}>
    <div style={{ background:'#fff', padding:25, width:400, borderRadius:10 }}>
      
      <h3 style={{ ...styles.title, textAlign:'center' }}>
        🔐 Autorización requerida
      </h3>

      <p style={{ textAlign:'center', marginBottom:10 }}>
        <strong>Joshua Mendez Alvarez</strong>
      </p>

      <p style={{ textAlign:'center', fontSize:13, color:'#555' }}>
        Solo el supervisor de embarque puede autorizar este envío
      </p>

      <p style={{ textAlign:'center', marginTop:15 }}>
        ¿Seguro que deseas enviar este pedido a ruta?
      </p>

      <input
        type="password"
        placeholder="Ingresa contraseña"
        value={password}
        onChange={e => setPassword(e.target.value)}
        style={{ ...styles.field, width:'100%' }}
      />

      {errorPassword && (
        <p style={{ color:'red', fontSize:12 }}>
          {errorPassword}
        </p>
      )}

      <div style={{ marginTop:15, textAlign:'right' }}>
        <button
          style={{ ...styles.button, ...styles.secondary }}
          onClick={() => setModalPassword(false)}
        >
          Cancelar
        </button>

        <button
          style={{ ...styles.button, ...styles.primary }}
          onClick={confirmarConPassword}
        >
          Autorizar y guardar
        </button>
      </div>
    </div>
  </div>
)}
   {/* 🔥 MODAL PROGRAMAR */}
{/* 🔥 MODAL PROGRAMAR */}
{modalProgramar && (
  <div
    style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}
  >
    <div
      style={{
        background: '#fff',
        padding: 20,
        width: 500,
        borderRadius: 10,
        maxHeight: '90vh',
        overflowY: 'auto'
      }}
    >
      <h3 style={styles.title}>Programar pedido</h3>

      <div
        style={{
          background: '#fff3cd',
          color: '#856404',
          padding: '10px',
          borderRadius: '8px',
          marginBottom: '15px',
          fontSize: '14px'
        }}
      >
        Captura las cantidades para producción. Si no se cumple lo acordado,
        indica la razón.
      </div>

      <input
        type="date"
        style={{ ...styles.field, width: '100%' }}
        value={fechaProgramada}
        onChange={e => setFechaProgramada(e.target.value)}
      />

      <select
  style={{ ...styles.field, width:'100%' }}
  value={form.id_chofer}
  onChange={e => setForm({...form,id_chofer:e.target.value})}
>
  <option value="">Selecciona chofer</option>
  {choferes.map(c => (
    <option key={c.id_chofer} value={c.id_chofer}>
      {c.nombre}
    </option>
  ))}
</select>

<select
  style={{ ...styles.field, width:'100%' }}
  value={form.id_unidad}
  onChange={e => setForm({...form,id_unidad:e.target.value})}
>
  <option value="">Selecciona unidad</option>
  {unidades.map(u => (
    <option key={u.id_unidad} value={u.id_unidad}>
      {u.nombre}
    </option>
  ))}
</select>

<textarea
  style={{ ...styles.field, width:'100%', height:80 }}
  placeholder="Comentario logística"
  value={form.comentario}
  onChange={e => setForm({...form,comentario:e.target.value})}
/>
      {productosProgramar.map((p, i) => (
        <div key={i} style={{ marginBottom: 15 }}>
          <strong>{p.nombre}</strong>
          <br />
          Pedido: {p.cantidad_pedida}

          <input
            type="number"
            min="0"
            style={{ ...styles.field, width: '100%' }}
            value={p.cantidad_planeada}
            
             onChange={e => {
             let valor = Number(e.target.value)
             if (valor < 0) valor = 0
             const copia = [...productosProgramar]
             copia[i].cantidad_planeada = valor
             setProductosProgramar(copia)
             }}
          />
        </div>
      ))}

      {productosProgramar.some(
        p => Number(p.cantidad_planeada) !== Number(p.cantidad_pedida)
      ) && (
        <textarea
          style={{ ...styles.field, width: '100%', height: 90 }}
          placeholder="Razón si no se cumple cantidad completa"
          value={comentarioProgramacion}
          onChange={e => setComentarioProgramacion(e.target.value)}
        />
      )}

      <div style={{ textAlign: 'right', marginTop: 10 }}>
        <button
          style={{ ...styles.button, ...styles.secondary }}
          onClick={() => setModalProgramar(false)}
        >
          Cancelar
        </button>

        <button
          style={{ ...styles.button, ...styles.primary }}
          onClick={programarPedido}
        >
          Guardar
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  )
}

export default ConsultarPedidos
