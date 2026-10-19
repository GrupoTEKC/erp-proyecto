import React, { useState, useEffect } from 'react';
import './NotasDiscrepancias.css'; // O ajusta los estilos según tu framework (Tailwind, Bootstrap, etc.)

const NotasDiscrepancias = () => {
    const [discrepancias, setDiscrepancias] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalAbierto, setModalAbierto] = useState(false);
    const [itemSeleccionado, setItemSeleccionado] = useState(null);
    
    // Opciones del Modal
    const [tipoResolucion, setTipoResolucion] = useState(''); // 'ROTO' o 'JUSTIFICADO'
    const [passwordAdmin, setPasswordAdmin] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    // Cargar datos del backend
    const cargarDiscrepancias = async () => {
        setLoading(true);
        setErrorMsg('');
        try {
            const response = await fetch('/api/notas-discrepancias');
            const data = await response.json();
            if (data.success) {
                setDiscrepancias(data.data);
            } else {
                setErrorMsg('Error al cargar las discrepancias.');
            }
        } catch (error) {
            console.error('Error de red:', error);
            setErrorMsg('No se pudo conectar con el servidor.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarDiscrepancias();
    }, []);

    // Abrir Modal de Revisión
    const abrirModal = (item) => {
        setItemSeleccionado(item);
        setTipoResolucion('');
        setPasswordAdmin('');
        setErrorMsg('');
        setSuccessMsg('');
        setModalAbierto(true);
    };

    // Cerrar Modal
    const cerrarModal = () => {
        setModalAbierto(false);
        setItemSeleccionado(null);
    };

    // Enviar Resolución al Backend
    const handleResolver = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        setSuccessMsg('');

        if (!tipoResolucion) {
            setErrorMsg('⚠️ Debe seleccionar obligatoriamente una opción (Roto o Justificado).');
            return;
        }

        const esExceso = itemSeleccionado.cantidad_final > itemSeleccionado.cantidad_entregada;

        if (esExceso && passwordAdmin !== 'ingemt2404_') {
            setErrorMsg('⚠️ Estos productos exceden la cantidad entregada. Debe ingresar la contraseña de autorización del programador.');
            return;
        }

        try {
            const response = await fetch('/api/notas-discrepancias/resolver', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    folio: itemSeleccionado.folio,
                    tienda_cliente: itemSeleccionado.tienda_cliente,
                    fecha_salida: itemSeleccionado.fecha_salida,
                    producto: itemSeleccionado.producto,
                    cantidad_entregada: itemSeleccionado.cantidad_entregada,
                    cantidad_final: itemSeleccionado.cantidad_final,
                    tipo_resolucion: tipoResolucion,
                    password_admin: passwordAdmin
                })
            });

            const result = await response.json();

            if (result.success) {
                setSuccessMsg(result.message);
                setTimeout(() => {
                    cerrarModal();
                    cargarDiscrepancias(); // Recargar tabla automáticamente
                }, 1500);
            } else {
                setErrorMsg(result.error || 'Error al procesar la solicitud.');
            }
        } catch (error) {
            console.error('Error:', error);
            setErrorMsg('Error de conexión al procesar.');
        }
    };

    return (
        <div className="container-discrepancias" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>📄 Notas con Diferencias y Discrepancias</h2>
                <button 
                    onClick={cargarDiscrepancias} 
                    className="btn-actualizar"
                    style={{ padding: '10px 15px', cursor: 'pointer', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px' }}
                >
                    🔄 Actualizar / Recargar
                </button>
            </div>

            {loading ? (
                <p>Cargando notas con discrepancias...</p>
            ) : discrepancias.length === 0 ? (
                <div style={{ padding: '20px', backgroundColor: '#d4edda', color: '#155724', borderRadius: '5px' }}>
                    ✅ ¡Excelente! No hay notas con discrepancias pendientes por revisar.
                </div>
            ) : (
                <div style={{ overflowX: 'auto' }}>
                    <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f8f9fa' }}>
                                <th>Pedido</th>
                                <th>Folio</th>
                                <th>Fecha Salida</th>
                                <th>Tienda / Cliente</th>
                                <th>Producto</th>
                                <th>Embarcado</th>
                                <th>Final</th>
                                <th>Diferencia</th>
                                <th>Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {discrepancias.map((item, index) => {
                                const esExceso = item.cantidad_final > item.cantidad_entregada;
                                return (
                                    <tr key={index} style={{ backgroundColor: esExceso ? '#fff3cd' : '#f8d7da' }}>
                                        <td>{item.id_pedido}</td>
                                        <td><strong>{item.folio}</strong></td>
                                        <td>{new Date(item.fecha_salida).toLocaleString()}</td>
                                        <td>{item.tienda_cliente || 'SIN TIENDA'}</td>
                                        <td>{item.producto}</td>
                                        <td>{item.cantidad_entregada}</td>
                                        <td>{item.cantidad_final}</td>
                                        <td>
                                            <span style={{ fontWeight: 'bold', color: esExceso ? '#856404' : '#721c24' }}>
                                                {item.diferencia > 0 ? `Faltan ${item.diferencia}` : `Sobran ${Math.abs(item.diferencia)}`}
                                            </span>
                                        </td>
                                        <td>
                                            <button 
                                                onClick={() => abrirModal(item)}
                                                style={{ padding: '6px 12px', backgroundColor: '#dc3545', color: '#white', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                            >
                                                🔍 Revisar
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {/* MODAL DE REVISIÓN */}
            {modalAbierto && itemSeleccionado && (
                <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div className="modal-content" style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '8px', width: '500px', maxWidth: '90%' }}>
                        <h3>⚙️ Revisar Discrepancia - Folio: {itemSeleccionado.folio}</h3>
                        <hr />
                        <p><strong>Tienda:</strong> {itemSeleccionado.tienda_cliente || 'SIN TIENDA'}</p>
                        <p><strong>Producto:</strong> {itemSeleccionado.producto}</p>
                        <p><strong>Cantidad Embarcada:</strong> {itemSeleccionado.cantidad_entregada}</p>
                        <p><strong>Cantidad Final:</strong> {itemSeleccionado.cantidad_final}</p>
                        
                        <div style={{ margin: '15px 0', padding: '10px', backgroundColor: '#f1f1f2', borderRadius: '5px' }}>
                            <p style={{ margin: 0, fontWeight: 'bold', color: itemSeleccionado.cantidad_final > itemSeleccionado.cantidad_entregada ? 'red' : 'orange' }}>
                                {itemSeleccionado.cantidad_final > itemSeleccionado.cantidad_entregada 
                                    ? "⚠️ ATENCIÓN: La cantidad final excede lo embarcado." 
                                    : `Diferencia calculada automáticamente: ${itemSeleccionado.diferencia} bulto(s)`}
                            </p>
                        </div>

                        {itemSeleccionado.cantidad_final > itemSeleccionado.cantidad_entregada ? (
                            <div style={{ marginBottom: '15px', padding: '10px', border: '1px solid #dc3545', borderRadius: '5px', backgroundColor: '#f8d7da' }}>
                                <p style={{ color: '#721c24', fontSize: '13px', marginBottom: '8px' }}>
                                    ⚠️ <strong>Exceso Detectado:</strong> Estos productos exceden la cantidad entregada. Debe corregirse desde la base de datos o ingresar la contraseña maestra del programador para autorizar.
                                </p>
                                <label style={{ display: 'block', fontWeight: 'bold', fontSize: '12px' }}>Contraseña de Administrador / Programador:</label>
                                <input 
                                    type="password" 
                                    value={passwordAdmin} 
                                    onChange={(e) => setPasswordAdmin(e.target.value)} 
                                    placeholder="Introduce password..."
                                    style={{ width: '100%', padding: '8px', marginTop: '5px', boxSizing: 'border-box' }}
                                />
                            </div>
                        ) : null}

                        <p style={{ fontWeight: 'bold', marginBottom: '8px' }}>Seleccione una opción obligatoria:</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                            <label style={{ cursor: 'pointer' }}>
                                <input 
                                    type="radio" 
                                    name="resolucion" 
                                    value="ROTO" 
                                    checked={tipoResolucion === 'ROTO'} 
                                    onChange={(e) => setTipoResolucion(e.target.value)} 
                                /> 🔴 **Marcar como Roto** (Enviar a tabla de auditoría con cero captura manual)
                            </label>
                            
                            <label style={{ cursor: 'pointer' }}>
                                <input 
                                    type="radio" 
                                    name="resolucion" 
                                    value="JUSTIFICADO" 
                                    checked={tipoResolucion === 'JUSTIFICADO'} 
                                    onChange={(e) => setTipoResolucion(e.target.value)} 
                                /> 🟡 **Marcar como Justificado** (Archivar y limpiar de alertas principales)
                            </label>
                        </div>

                        {errorMsg && <div style={{ color: 'red', marginBottom: '15px', fontSize: '14px' }}>{errorMsg}</div>}
                        {successMsg && <div style={{ color: 'green', marginBottom: '15px', fontSize: '14px' }}>{successMsg}</div>}

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                            <button 
                                onClick={cerrarModal}
                                style={{ padding: '8px 15px', backgroundColor: '#6c757d', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                            >
                                Cancelar
                            </button>
                            <button 
                                onClick={handleResolver}
                                style={{ padding: '8px 15px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                            >
                                Confirmar y Procesar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotasDiscrepancias;
