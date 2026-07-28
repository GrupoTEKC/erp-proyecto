
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
topBar: { 
  display: 'flex', 
  gap: '10px', 
  alignItems: 'center', 
  justifyContent: 'space-between', // Push del nuevo botón hacia la derecha
  width: '100%' 
},
  
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
  const [fechaFiltro, setFechaFiltro] = useState('')
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
  const [modalModificar, setModalModificar] = useState(false)
  const [pedidoModificar, setPedidoModificar] = useState(null)
  const [clienteModificar, setClienteModificar] = useState(null)
  const [productosModificar, setProductosModificar] = useState([])
  const [catalogoProductos, setCatalogoProductos] = useState([])
  const [busquedaProducto, setBusquedaProducto] = useState('')
  const [motivoModificacion, setMotivoModificacion] = useState('')
  const [passwordModificacion, setPasswordModificacion] = useState('')
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

  const cargarProductos = async () => {
  try {
    const res = await fetch(`${urlLimpia}/productos`)
    const data = await res.json()
    setCatalogoProductos(data)
  } catch (err) {
    console.error(err)
  }
 }

  useEffect(() => {
     cargarPedidos()
     cargarRutas()
     cargarProductos()
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
  
const pedidosFiltrados = pedidos.filter(p =>
  (
    String(p.id_pedido || '').includes(busqueda) ||
    (p.cliente || '').toLowerCase().includes(busqueda.toLowerCase())
  )
  &&
  (
    estadoSeleccionado === '' ||
    estadoSeleccionado === 'todos' ||
    p.estado === estadoSeleccionado
  )
  &&
  (
   fechaFiltro === '' ||
   p.fecha_salida?.slice(0, 10) === fechaFiltro
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

   productos: data.map(p => {
  const cantidadBase =
    p.cantidad_planeada ??
    p.cantidad_pedida ??
    p.cantidad ??
    0

  return {
    id_producto: p.id_producto,
    nombre: p.nombre,
    cantidad_planeada: Number(cantidadBase),
    cantidad_entregada: Number(cantidadBase)
  }
})
  })

  setPedidoSeleccionado(id)
  setEditarChofer(false)
  setEditarUnidad(false)
  setModalEntrega(true)
}
  
const imprimirMultiples = async () => {
    try {
      let listaChoferes = choferes
      if (listaChoferes.length === 0) {
        const ch = await fetch(`${urlLimpia}/choferes`)
        const chData = await ch.json()
        setChoferes(chData)
        listaChoferes = chData
      }

      // Filtrar solo los pedidos seleccionados que estén en ruta o entregados
      const pedidosValidos = pedidos
        .filter(p => pedidosSeleccionados.includes(p.id_pedido))
        .filter(p => p.estado === 'en_ruta' || p.estado === 'entregado')

      if (pedidosValidos.length === 0) {
        alert("Selecciona al menos un pedido en ruta o entregado para imprimir.")
        return
      }

      // Agrupar por chofer, unidad y fecha
      const grupos = {}
      pedidosValidos.forEach(p => {
        const key = `${p.id_chofer}-${p.id_unidad}-${p.fecha_programada?.slice(0, 10)}`
        if (!grupos[key]) grupos[key] = []
        grupos[key].push(p)
      })

let contenidoTotal = `
  <div class="header-empresa">
    <div class="texto-empresa">
      <div class="titulo-empresa">GRUPO TEKC</div>
      <div>Carretera federal Perote – Teziutlán, Calle Piñón No. 2, Loc. Magueyitos</div>
    </div>
    <div class="logos-secundarios">
      <img src="${logo2}" alt="Firmetec" />
      <img src="${logo3}" alt="Pegatek" />
    </div>
  </div>
`

      for (const grupoKey in grupos) {
        const pedidosGrupo = grupos[grupoKey]
        const choferesUnicos = new Set(pedidosGrupo.map(p => p.id_chofer))
        const variosChoferes = choferesUnicos.size > 1
        const primerPedido = pedidosGrupo[0]

        const idChofer = primerPedido.id_chofer
        const choferEncontrado = listaChoferes.find(c => c.id_chofer === idChofer)
        const choferNombre = choferEncontrado 
          ? `${choferEncontrado.nombre} ${choferEncontrado.apellido_paterno || ''} ${choferEncontrado.apellido_materno || ''}`.trim() 
          : 'SIN CHOFER'

        const detalles = await Promise.all(
          pedidosGrupo.map(p => fetch(`${urlLimpia}/pedidos/${p.id_pedido}/detalle`).then(r => r.json()))
        )

        let bloquePedidos = ''

        for (let i = 0; i < pedidosGrupo.length; i++) {
          const pedido = pedidosGrupo[i]
          const detalle = detalles[i]
          const municipio = detalle[0]?.municipio || ''

       // 🟢 Procesar detalle para Priorizar 'cantidad_entregada' estricta y formatear números
      const detalleProcesado = detalle.map(p => {
        const cantEntregada = (p.cantidad_entregada !== undefined && p.cantidad_entregada !== null) 
          ? Number(p.cantidad_entregada) 
          : Number(p.cantidad_planeada ?? p.cantidad ?? p.cantidad_pedida ?? 0);
          
        const precio = Number(p.precio_unitario ?? p.precio_venta ?? p.precio ?? p.precio_lista ?? 0);
        const subtotalNum = cantEntregada * precio;

        return {
          ...p,
          cantidadFinal: cantEntregada,
          // Formateo con comas en español (México)
          cantidadFormateada: cantEntregada.toLocaleString('es-MX'),
          precioFinal: precio.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
          subtotalFormateado: subtotalNum.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
          subtotal: subtotalNum
        };
      }).filter(p => p.cantidadFinal > 0);

      const totalPedido = detalleProcesado.reduce((total, p) => total + p.subtotal, 0);
      const totalPedidoFormateado = totalPedido.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
          
          bloquePedidos += `
            <div class="pedido">
              <div class="titulo-pedido">
                Pedido ${pedido.id_pedido} | ${pedido.cliente} ${pedido.nombre_tienda ? ' - ' + pedido.nombre_tienda : ''}
                <br/> Municipio: ${municipio}
                <br/> Ruta ${pedido.id_ruta} - ${obtenerNombreRuta(pedido.id_ruta)}
              </div>
              <table>
                <thead>
                  <tr>
                    <th style="width:60px;text-align:center;">Cant. Entregada</th>
                    <th>Producto</th>
                    <th style="width:90px;text-align:right;">P. Unit.</th>
                    <th style="width:110px;text-align:right;">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  ${detalleProcesado.map(p => `
        <tr>
          <td style="width:60px;text-align:center;">${p.cantidadFormateada}</td>
          <td>${p.nombre || ''}</td>
          <td style="width:90px;text-align:right;">$${p.precioFinal}</td>
          <td style="width:110px;text-align:right;">$${p.subtotalFormateado}</td>
        </tr>
      `).join('')}
      
                </tbody>
              </table>
          <div class="total">
        TOTAL: $${totalPedidoFormateado}
      </div>
            </div>
          `
        }

        contenidoTotal += `
          <div class="hoja">
          <img src="${logo}" class="watermark" alt="marca de agua" />
            <div class="contenido">
              <div class="header">
                <div class="fecha">
                  <div>${new Date().toLocaleDateString()}</div>
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

      // Abre y escribe UNA SOLA VEZ en la ventana
      const win = window.open('', '_blank')
      win.document.write(`
        <html>
          <head>
            <title>Pedidos Seleccionados</title>
            <style>
              body { font-family: Arial; font-size: 12px; padding: 10px; }
              .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
              .pedido { border-top: 1px solid #000; margin-top: 10px; padding-top: 5px; }
              .titulo-pedido { font-weight: bold; margin-bottom: 5px; }
              table { width: 100%; border-collapse: collapse; }
              td, th { padding: 4px; border: 1px solid #ccc; }
              .total { text-align: right; font-weight: bold; margin-top: 5px; }
@media print {
  @page {
    size: letter portrait;
    margin: 6mm 8mm;
  }
  body { 
    margin: 0; 
    padding: 0; 
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
  .hoja {
    display: block !important;
    height: auto !important;
    min-height: 0 !important;
    page-break-after: always; 
    page-break-inside: avoid; 
    box-sizing: border-box; 
  }
}
.firmas { 
  margin-top: 65px; 
  display: flex; 
  justify-content: space-between; 
  page-break-inside: avoid;
}
.firma { 
  width: 42%; 
  text-align: center; 
  font-size: 10px; 
}

                .watermark {
  position: absolute;  /* Hace que la imagen "flote" encima de la hoja sin empujar el texto */
  top: 50%;            /* Centra verticalmente */
  left: 50%;           /* Centra horizontalmente */
  transform: translate(-50%, -50%); /* Ajusta el centro exacto de la imagen */
  width: 480px;        /* Tamaño del logo en la hoja */
  opacity: 0.08;       /* Qué tan transparente se ve (0.08 es muy tenue) */
  pointer-events: none;
  z-index: 0;
}
                .linea { border-top: 1px solid #000; padding-top: 4px; font-weight: bold; }

.header-empresa {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 8px;
  border-bottom: 1px solid #ddd;
}

.texto-empresa {
  font-size: 11px;
  line-height: 1.3;
}

.titulo-empresa {
  font-size: 30px;
  font-weight: bold;
  text-transform: uppercase;
  margin-bottom: 3px;
}

.logos-secundarios {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logos-secundarios img {
  height: 38px; /* 👈 Garantiza que ambos logos tengan exactamente el mismo tamaño */
  width: auto;
  object-fit: contain;
}
           </style>
</head>
<body>
  ${contenidoTotal}
</body>
</html>
`);
      
win.document.close();

// 🔥 Regresar a la lógica de win.onload que tenías antes:
win.onload = () => {
  win.focus();
  win.print();
};

setPedidosSeleccionados([]);
    } catch (error) {
      console.error("Error al imprimir múltiples:", error)
      alert("Ocurrió un error al generar la impresión.")
    }
  }


  const imprimirPreviaMultiples = async () => {
  try {
    // 1. Filtrar SOLO pedidos seleccionados que estén en 'pendiente' o 'programado'
    const pedidosValidos = pedidos
      .filter(p => pedidosSeleccionados.includes(p.id_pedido))
      .filter(p => p.estado === 'pendiente' || p.estado === 'programado')

    if (pedidosValidos.length === 0) {
      alert("Selecciona al menos un pedido PENDIENTE o PROGRAMADO para realizar la impresión previa.")
      return
    }

    // 2. Traer el detalle de los pedidos seleccionados desde el Backend
    const detalles = await Promise.all(
      pedidosValidos.map(p => 
        fetch(`${urlLimpia}/pedidos/${p.id_pedido}/detalle`).then(r => r.json())
      )
    )

    let bloquesPedidos = ''

    for (let i = 0; i < pedidosValidos.length; i++) {
      const pedido = pedidosValidos[i]
      const detalle = detalles[i]

      // Lógica COALESCE: usa cantidad_planeada si existe y es > 0, de lo contrario la 'cantidad' original
      const detalleProcesado = detalle.map(p => {
        const cantPlaneada = Number(p.cantidad_planeada)
        const cantOriginal = Number(p.cantidad ?? p.cantidad_pedida ?? 0)
        
        const cantFinal = (cantPlaneada && cantPlaneada > 0) ? cantPlaneada : cantOriginal
        const precio = Number(p.precio_unitario ?? p.precio_venta ?? p.precio ?? 0)
        const subtotalNum = cantFinal * precio

        return {
          ...p,
          cantFinal,
          cantFormateada: cantFinal.toLocaleString('es-MX'),
          precioFormateado: precio.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
          subtotalFormateado: subtotalNum.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
          subtotal: subtotalNum
        }
      }).filter(p => p.cantFinal > 0)

      const totalPedido = detalleProcesado.reduce((sum, item) => sum + item.subtotal, 0)
      const totalPedidoFormateado = totalPedido.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

      bloquesPedidos += `
        <div class="pedido" style="page-break-inside: avoid; border: 1px solid #000; padding: 12px; margin-bottom: 20px; border-radius: 6px;">
          <div style="font-weight: bold; font-size: 14px; margin-bottom: 8px; border-bottom: 1px solid #ccc; padding-bottom: 6px; display: flex; justify-content: space-between;">
            <span>ORDEN DE SURTIDO (PREVIA) - PEDIDO #${pedido.id_pedido}</span>
            <span style="text-transform: uppercase;">ESTATUS: <b>${pedido.estado || ''}</b></span>
          </div>
          <div style="font-size: 12px; margin-bottom: 10px;">
            <b>Cliente:</b> ${pedido.cliente || ''} ${pedido.nombre_tienda ? ' - ' + pedido.nombre_tienda : ''} <br/>
            <b>Ruta:</b> Ruta ${pedido.id_ruta || ''} - ${obtenerNombreRuta(pedido.id_ruta)}
          </div>
          
     <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
  <thead>
    <tr style="background: #f0f0f0;">
      <!-- 🟢 NUEVA COLUMNA DE VERIFICACIÓN / CHECK -->
      <th style="border: 1px solid #ccc; padding: 6px; text-align: center; width: 45px;">Check</th>
      <th style="border: 1px solid #ccc; padding: 6px; text-align: center; width: 90px;">Cant. A Surtir</th>
      <th style="border: 1px solid #ccc; padding: 6px; text-align: left;">Producto</th>
      <th style="border: 1px solid #ccc; padding: 6px; text-align: right; width: 100px;">P. Unit.</th>
      <th style="border: 1px solid #ccc; padding: 6px; text-align: right; width: 110px;">Subtotal</th>
    </tr>
  </thead>
  <tbody>
    ${detalleProcesado.map(item => `
      <tr>
        <td style="border: 1px solid #ccc; padding: 4px; text-align: center;">
          <div style="width: 18px; height: 18px; border: 1.5px solid #333; margin: 0 auto; border-radius: 3px;"></div>
        </td>
        <td style="border: 1px solid #ccc; padding: 6px; text-align: center; font-weight: bold; font-size: 13px;">${item.cantFormateada}</td>
        <td style="border: 1px solid #ccc; padding: 6px;">${item.nombre || ''}</td>
        <td style="border: 1px solid #ccc; padding: 6px; text-align: right;">$${item.precioFormateado}</td>
        <td style="border: 1px solid #ccc; padding: 6px; text-align: right;">$${item.subtotalFormateado}</td>
      </tr>
    `).join('')}
  </tbody>
</table>

          <div style="text-align: right; font-weight: bold; margin-top: 8px; font-size: 13px;">
            ESTIMADO TOTAL: $${totalPedidoFormateado}
          </div>
        </div>
      `
    }

    // 3. Abrir la ventana de impresión
    const win = window.open('', '_blank')
    win.document.write(`
      <html>
        <head>
          <title>Impresión Previa de Pedidos</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 15px; font-size: 12px; }
            .header-banner { text-align: center; margin-bottom: 20px; border-bottom: 2px solid #8B1E1E; padding-bottom: 10px; }
            .watermark-text { color: #8B1E1E; font-size: 11px; font-weight: bold; text-transform: uppercase; }
            @media print {
              @page { size: letter portrait; margin: 8mm; }
              body { margin: 0; padding: 0; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
            }
          </style>
        </head>
        <body>
          <div class="header-banner">
            <h2 style="margin: 0; color: #071849;">GRUPO TEKC - HOJA DE PRE-EMBARQUE</h2>
            <span class="watermark-text">*** DOCUMENTO PREVIO - NO VÁLIDO COMO ENTREGA FINAL ***</span>
          </div>
          ${bloquesPedidos}
        </body>
      </html>
    `)
    win.document.close()
    
    win.onload = () => {
      win.focus()
      win.print()
    }

  } catch (error) {
    console.error("Error en la impresión previa:", error)
    alert("Ocurrió un error al generar la impresión previa.")
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


    const totalPedido = detalle.reduce((total, p) => {
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

  return total + (cantidad * precio)
}, 0)
    
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
           <strong>$${totalPedido.toFixed(2)}</strong>
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


  const abrirModificar = async (id) => {
  try {
    const res = await fetch(`${urlLimpia}/pedidos/${id}/detalle`)
    const data = await res.json()

    setPedidoModificar(id)

    setProductosModificar(
      data.map(p => ({
        id_producto: p.id_producto,
        nombre: p.nombre,
        cantidad: Number(
          p.cantidad_pedida ??
          p.cantidad ??
          0
        ),
        precio_unitario: Number(
          p.precio_unitario ??
          p.precio ??
          0
        )
      }))
    )

    setMotivoModificacion('')
    setPasswordModificacion('')
    setModalModificar(true)

  } catch (error) {
    console.error(error)
    alert('Error al cargar pedido')
  }
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

  const guardarModificacion = async () => {

  if (!motivoModificacion.trim()) {
    return alert('Debes capturar el motivo')
  }

  if (!passwordModificacion.trim()) {
    return alert('Debes capturar la contraseña')
  }

  const res = await fetch(
    `${urlLimpia}/pedidos/modificar`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id_pedido: pedidoModificar,
        password: passwordModificacion,
        motivo: motivoModificacion,
        usuario: 'ERP',
        productos: productosModificar
      })
    }
  )

  const data = await res.json()

  if (!res.ok) {
    return alert(data.error)
  }

  alert('Pedido modificado correctamente')

  setModalModificar(false)

 cargarPedidos()
  }

  return (
    <div style={styles.topBar}>
  
        {/* 🟢 1. BOTONES DE IMPRESIÓN */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button 
            style={{ ...styles.button, ...styles.primary }} 
            disabled={pedidosSeleccionados.length === 0}
            onClick={imprimirMultiples}
          >
            🖨 Imprimir seleccionados ({pedidosSeleccionados.length})
          </button>

          <button 
            style={{ ...styles.button, ...styles.primary, backgroundColor: '#2b6cb0' }} 
            disabled={pedidosSeleccionados.length === 0}
            onClick={imprimirPreviaMultiples}
          >
            📄 Impresión Previa
          </button>
        </div>

        {/* 🟢 2. FILTROS Y BÚSQUEDA */}
        <input
          style={{ ...styles.field, marginBottom: 0, width: '180px' }}
          placeholder="Buscar..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
        />

        <select
          style={{ ...styles.field, marginBottom: 0, width: '180px' }}
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

        <input
          type="date"
          style={{ ...styles.field, marginBottom: 0, width: '160px' }}
          value={fechaFiltro}
          onChange={e => setFechaFiltro(e.target.value)}
        />

       {/* Dropdown de Selección de Rutas */}
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
                  {' '}Ruta {r.id_ruta} - {r.nombre ? r.nombre.replace(/^Ruta\s*\d+\s*-\s*/i, '') : ''}
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
   
      <div style={styles.columnas}>
    
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
                    // 🟢 Habilita el checkbox según el estatus del pedido:
                    disabled={p.estado !== 'en_ruta' && p.estado !== 'pendiente' && p.estado !== 'programado'} 
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
                        Enviar
                      </button>

                      <button
                      style={{ ...styles.button, backgroundColor: '#f39c12', color: '#fff' }}
                      disabled={!['pendiente', 'programado'].includes(p.estado)}
                      onClick={() => abrirProgramar(p.id_pedido)}
                      >
                      Planear envio
                      </button>

                      <button
                      style={{
                      ...styles.button,
                      backgroundColor: '#2980b9',
                      color: '#fff'
                      }}
                     disabled={!['pendiente', 'programado'].includes(p.estado)}
                     onClick={() => abrirModificar(p.id_pedido)}
                     >
                     Modificar pedido
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
          {
           p.cantidad === 0 &&
          (
          <span
          style={{
          color:'red',
          marginLeft:10
          }}
         >
         ELIMINADO
         </span>
         )
        }
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

      {modalModificar && (
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
        width: 700,
        borderRadius: 10,
        maxHeight: '90vh',
        overflowY: 'auto'
      }}
    >
      <h3 style={styles.title}>
        Modificar pedido #{pedidoModificar}
      </h3>

      <hr />

      <h4>Agregar producto</h4>

      <input
      type="text"
      placeholder="Buscar producto"
      value={busquedaProducto}
      onChange={e => setBusquedaProducto(e.target.value)}
      style={{
      ...styles.field,
      width:'100%'
     }}
    />

      {busquedaProducto.trim() !== '' &&
  catalogoProductos
    .filter(p =>
      p.nombre
        .toLowerCase()
        .includes(busquedaProducto.toLowerCase())
    )
    .slice(0, 10)
    .map(prod => (
      <div
        key={prod.id_producto}
        style={{
          border:'1px solid #ddd',
          padding:10,
          marginBottom:5,
          cursor:'pointer'
        }}
        onClick={() => {

          const existe = productosModificar.find(
            x => x.id_producto === prod.id_producto
          )

          if (existe) {
            alert('Producto ya agregado')
            return
          }

          setProductosModificar([
            ...productosModificar,
            {
              id_producto: prod.id_producto,
              nombre: prod.nombre,
              cantidad: 1,
              precio_unitario: Number(
                prod.precio_unitario ||
                prod.precio ||
                0
              )
            }
          ])

          setBusquedaProducto('')
        }}
      >
        {prod.nombre}
      </div>
))}
      
      {productosModificar.map((p, i) => (
  <div
    key={i}
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      marginBottom: '12px',
      padding: '10px',
      border: '1px solid #ddd',
      borderRadius: '8px'
    }}
  >
    <div
      style={{
        flex: 1,
        fontWeight: 'bold',
        color: '#071849'
      }}
    >
      {p.nombre}
    </div>

    <input
      type="number"
      min="0"
      value={p.cantidad}
      style={{
        width: '90px',
        padding: '8px',
        border: '1px solid #8B1E1E',
        borderRadius: '6px'
      }}
      onChange={e => {
        const copia = [...productosModificar]
        copia[i].cantidad = Number(e.target.value)
        setProductosModificar(copia)
      }}
    />

    <input
      type="number"
      step="0.01"
      value={p.precio_unitario}
      style={{
        width: '110px',
        padding: '8px',
        border: '1px solid #8B1E1E',
        borderRadius: '6px'
      }}
      onChange={e => {
        const copia = [...productosModificar]
        copia[i].precio_unitario = Number(e.target.value)
        setProductosModificar(copia)
      }}
    />

    <button
      style={{
        background: '#c0392b',
        color: '#fff',
        border: 'none',
        padding: '8px 12px',
        borderRadius: '6px',
        cursor: 'pointer'
      }}
      onClick={() => {

        const confirmar = window.confirm(
          `¿Estás seguro de eliminar "${p.nombre}" del pedido?`
        )

        if (!confirmar) return

        const copia = [...productosModificar]
        copia[i].cantidad = 0
        setProductosModificar(copia)
      }}
    >
      Eliminar
    </button>
  </div>
))}
      <textarea
        style={{
          ...styles.field,
          width:'100%',
          height:100
        }}
        placeholder="Motivo de modificación"
        value={motivoModificacion}
        onChange={e =>
          setMotivoModificacion(e.target.value)
        }
      />

      <input
        type="password"
        placeholder="Contraseña"
        style={{
          ...styles.field,
          width:'100%'
        }}
        value={passwordModificacion}
        onChange={e =>
          setPasswordModificacion(e.target.value)
        }
      />

      <div style={{ textAlign:'right' }}>
        <button
          style={{
            ...styles.button,
            ...styles.secondary
          }}
          onClick={() =>
            setModalModificar(false)
          }
        >
          Cancelar
        </button>

        <button
          style={{
            ...styles.button,
            ...styles.primary
          }}
          onClick={guardarModificacion}
        >
          Guardar cambios
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  )
}

export default ConsultarPedidos
