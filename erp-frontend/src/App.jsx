import { Routes, Route } from 'react-router-dom'
import Menu from './pages/Menu'
import Pedidos from './pages/Pedidos'
import Clientes from './pages/Clientes'
import NuevoCliente from './pages/NuevoCliente'
import ConsultarPedidos from './pages/ConsultarPedidos'
import EditarCliente from './pages/EditarCliente'
import Pagos from './pages/Pagos'
import ControlEnvios from './pages/ControlEnvios'

function App() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <Routes>
        <Route path="/" element={<Menu />} />
        <Route path="/pedidos" element={<Pedidos />} />
        <Route path="/pedidos/consultar" element={<ConsultarPedidos />} />
        <Route path="/clientes" element={<Clientes />} />
        <Route path="/clientes/nuevo" element={<NuevoCliente />} />
        <Route path="/clientes/editar/:id_cliente" element={<EditarCliente />} />
        <Route path="/pagos" element={<Pagos />} />
        <Route path="/control-envios" element={<ControlEnvios />} />
      
      </Routes>
    </div>
  )
}

export default App
