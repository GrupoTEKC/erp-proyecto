 import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import logo from '../assets/TRANSPARENTE.png'
import Buscador from "../components/Buscador"
import ProductosPedido from '../components/ProductosPedido'

// ✅ URL DEL BACKEND (Asegúrate de que en Railway esté configurada)
const API = import.meta.env.VITE_API_URL

// =========================
// 🎨 ESTILOS (Manteniendo tu diseño original)
// =========================
const styles = {
  page: { backgroundColor: '#ffffff', minHeight: '100vh', padding: '20px', fontFamily: 'Arial, sans-serif' },
  header: { marginBottom: '20px' },
  backButton: { display: 'inline-flex', alignItems: 'center', padding: '10px 14px', fontSize: '14px', backgroundColor: '#fff', color: '#8B1E1E', border: '1px solid #8B1E1E', borderRadius: '6px', cursor: 'pointer' },
  logo: { display: 'block', width: '100px', marginTop: '10px' },
  title: { marginTop: '20px', marginBottom: '15px', color: '#071849', fontWeight: 'bold' },
  section: { marginBottom: '15px' },
  label: { fontSize: '14px', marginBottom: '4px', display: 'block' },
  field: { width: '260px', padding: '8px 10px', fontSize: '14px', borderRadius: '6px', border: '1px solid #8B1E1E', boxSizing: 'border-box' },
  clienteTexto: { fontSize: '14px', marginBottom: '15px' },
  total: { marginTop: '15px', color: '#071849' },
  guardar: { marginTop: '10px', padding: '10px 16px', fontSize: '14px', backgroundColor: '#8B1E1E', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }
}

function Pedidos() {
  const [cliente, setCliente] = useState(null)
  const [fecha, setFecha] = useState('')
  const [tipoPedido, setTipoPedido] = useState('')
  const [diasCredito, setDiasCredito] = useState(0)
  const [total, setTotal] = useState(0)
  const [productos, setProductos] = useState([])
  const [rutas, setRutas] = useState([])
  const [idRuta, setIdRuta] = useState('')
  const [vendedores, setVendedores] = useState([])
  const [idVendedor, setIdVendedor] = useState('')

  // =========================
  // 🔄 CARGAR RUTAS Y VENDEDORES
  // =========================
  useEffect(() => {
    if (!API) {
      console.error('❌ API no definida en variables de entorno');
      return;
    }

    const cargarDatos = async () => {
      try {
        // Limpiamos la URL por si tiene una diagonal extra al final
        const urlLimpia = API.endsWith('/') ? API.slice(0, -1) : API;
        
        const [resRutas, resVendedores] = await Promise.all([
          fetch(`${urlLimpia}/rutas`),
          fetch(`${urlLimpia}/vendedores`)
        ]);

        const rutasData = await resRutas.json();
        const vendedoresData = await resVendedores.json();

        setRutas(Array.isArray(rutasData) ? rutasData : []);
        setVendedores(Array.isArray(vendedoresData) ? vendedoresData : []);
      } catch (error) {
        console.error('❌ Error cargando catálogos:', error);
      }
    }
    cargarDatos();
  }, []);

  // =========================
  // 💾 GUARDAR PEDIDO
  // =========================
  const guardarPedido = async () => {
    if (!cliente || !fecha || !tipoPedido || productos.length === 0) {
      alert('Por favor, complete todos los campos obligatorios');
      return;
    }
    if (!idVendedor || !idRuta) {
      alert('Seleccione un vendedor y una ruta válida');
      return;
    }

    // ✅ ALINEACIÓN CON BACKEND: Usamos 'estado' como campo clave
    const nuevoPedido = {
      id_cliente: cliente.id_cliente,
      id_vendedor: Number(idVendedor),
      id_ruta: Number(idRuta),
      fecha,
      total,
      tipo_pedido: tipoPedido,
      dias_credito: tipoPedido === 'credito' ? diasCredito : 0,
      productos, // Se procesan en el backend
      estado: 'pendiente' 
    };

    try {
      const urlLimpia = API.endsWith('/') ? API.slice(0, -1) : API;
      const res = await fetch(`${urlLimpia}/pedidos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoPedido)
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Error al procesar el pedido');
      }

      alert('✅ Pedido guardado y registrado correctamente');
      
      // RESET FORMULARIO
      setCliente(null);
      setFecha('');
      setTipoPedido('');
      setDiasCredito(0);
      setProductos([]);
      setTotal(0);
      setIdVendedor('');
      setIdRuta('');

    } catch (err) {
      alert(`❌ Error: ${err.message}`);
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <Link to="/"><button style={styles.backButton}>⬅ Volver al menú</button></Link>
        <img src={logo} alt="Logo" style={styles.logo} />
      </div>

      <h2 style={styles.title}>NUEVO PEDIDO</h2>

      {!cliente ? (
        <Buscador onSelectCliente={setCliente} />
      ) : (
        <>
          <p style={styles.clienteTexto}><strong>Cliente:</strong> {cliente.nombre}</p>

          <div style={styles.section}>
            <label style={styles.label}>Vendedor</label>
            <select style={styles.field} value={idVendedor} onChange={e => setIdVendedor(e.target.value)}>
              <option value="">Seleccione vendedor</option>
              {vendedores.map(v => (
                <option key={v.id_vendedor} value={v.id_vendedor}>{v.nombre}</option>
              ))}
            </select>
          </div>

          <div style={styles.section}>
            <label style={styles.label}>Ruta</label>
            <select style={styles.field} value={idRuta} onChange={e => setIdRuta(e.target.value)}>
              <option value="">Seleccione ruta</option>
              {rutas.map(r => (
                <option key={r.id_ruta} value={r.id_ruta}>{r.nombre}</option>
              ))}
            </select>
          </div>

          <div style={styles.section}>
            <label style={styles.label}>Fecha</label>
            <input type="date" style={styles.field} value={fecha} onChange={e => setFecha(e.target.value)} />
          </div>

          <div style={styles.section}>
            <label style={styles.label}>Tipo de pedido</label>
            <select style={styles.field} value={tipoPedido} onChange={e => setTipoPedido(e.target.value)}>
              <option value="">Seleccione</option>
              <option value="contado">Contado</option>
              <option value="credito">Crédito</option>
            </select>
          </div>
