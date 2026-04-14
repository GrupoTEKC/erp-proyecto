import { Routes, Route } from 'react-router-dom'
import Menu from './pages/Menu'
import Pedidos from './pages/Pedidos'
import Clientes from './pages/Clientes'
import NuevoCliente from './pages/NuevoCliente'
import ConsultarPedidos from './pages/ConsultarPedidos'
import EditarCliente from './pages/EditarCliente'
import Pagos from './pages/Pagos'
import PagosLogin from './pages/PagosLogin'
import PedidosLogin from './pages/PedidosLogin'
import ControlEnvios from './pages/ControlEnvios'
import ControlEnviosDetalle from './pages/ControlEnviosDetalle'

// 🔥 NUEVO LOGIN EMBARQUES
import EmbarquesLogin from './pages/EmbarquesLogin'

function App() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <Routes>
        <Route path="/" element={<Menu />} />

        {/* 📦 PEDIDOS */}
        <Route path="/pedidos" element={<Pedidos />} />
        <Route path="/pedidos/consultar" element={<ConsultarPedidos />} />

        {/* 🔐 LOGIN PEDIDOS */}
        <Route path="/login-pedidos" element={<PedidosLogin />} />

        {/* 👥 CLIENTES */}
        <Route path="/clientes" element={<Clientes />} />
        <Route path="/clientes/nuevo" element={<NuevoCliente />} />
        <Route path="/clientes/editar/:id_cliente" element={<EditarCliente />} />

        {/* 🔐 LOGIN PAGOS */}
        <Route path="/pagos-login" element={<PagosLogin />} />

        {/* 💵 PAGOS */}
        <Route path="/pagos" element={<Pagos />} />

        {/* 🚚 ENVÍOS */}
        <Route path="/control-envios" element={<ControlEnvios />} />
        <Route path="/control-envios/:id_chofer" element={<ControlEnviosDetalle />} />

        {/* 🚛 🔐 LOGIN EMBARQUES (NUEVO) */}
        <Route path="/login-embarques" element={<EmbarquesLogin />} />
      </Routes>
    </div>
  )
}

export default App
