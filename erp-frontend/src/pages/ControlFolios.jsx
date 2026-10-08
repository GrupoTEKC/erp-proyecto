import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/TRANSPARENTE.png";

const API = "https://erp-proyecto-production.up.railway.app";

const styles = {
  page: {
    backgroundColor: '#ffffff',
    minHeight: '100vh',
    padding: '20px',
    fontFamily: 'Arial, sans-serif'
  },
  backTop: {
    padding: '8px 12px',
    fontSize: '13px',
    backgroundColor: '#fff',
    color: '#8B1E1E',
    border: '1px solid #8B1E1E',
    borderRadius: '6px',
    cursor: 'pointer'
  },
  cardMetric: {
    padding: '15px 20px',
    borderRadius: '8px',
    textAlign: 'center',
    flex: '1',
    minWidth: '180px',
    color: '#fff',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))',
    gap: '10px',
    marginTop: '20px'
  },
  boxFolio: {
    padding: '12px 8px',
    borderRadius: '8px',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'transform 0.15s ease',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '65px'
  },
  filterBtn: {
    padding: '8px 16px',
    borderRadius: '6px',
    border: '1px solid #8B1E1E',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '13px'
  }
};

export default function ControlFolios() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [foliosMap, setFoliosMap] = useState(new Map());
  const [minFolio, setMinFolio] = useState(0);
  const [maxFolio, setMaxFolio] = useState(0);

  // Rango ajustable por el usuario
  const [rangoInicio, setRangoInicio] = useState("");
  const [rangoFin, setRangoFin] = useState("");

  // Filtro de vista: "todos", "faltantes", "registrados"
  const [filtro, setFiltro] = useState("todos");

  // Modal de detalles de folio y sus productos
  const [folioSeleccionado, setFolioSeleccionado] = useState(null);
  const [detalleProductos, setDetalleProductos] = useState([]);
  const [loadingDetalle, setLoadingDetalle] = useState(false);

  useEffect(() => {
    fetch(`${API}/pedidos/folios-control`)
      .then(res => res.json())
      .then(data => {
        const listaRegistrados = Array.isArray(data.registrados)
          ? data.registrados
          : (Array.isArray(data) ? data : []);

        const mapa = new Map();
        const numerosValidos = [];

        if (listaRegistrados.length > 0) {
          listaRegistrados.forEach(item => {
            const numFolio = parseInt(item.folio, 10);
            if (!isNaN(numFolio) && numFolio > 0) {
              mapa.set(numFolio, item);
              numerosValidos.push(numFolio);
            }
          });
        }

        const minCalculado = numerosValidos.length > 0 ? Math.min(...numerosValidos) : 0;
        const maxCalculado = numerosValidos.length > 0 ? Math.max(...numerosValidos) : 0;

        const minBackend = parseInt(data.min_folio, 10);
        const maxBackend = parseInt(data.max_folio, 10);

        const minFinal = (minBackend && minBackend > 0) ? minBackend : minCalculado;
        const maxFinal = (maxBackend && maxBackend > 0) ? maxBackend : maxCalculado;

        setFoliosMap(mapa);
        setMinFolio(minFinal);
        setMaxFolio(maxFinal);

        setRangoInicio(minFinal);
        setRangoFin(maxFinal);
      })
      .catch(err => console.error("Error al cargar folios:", err))
      .finally(() => setLoading(false));
  }, []);

  // Cargar productos del detalle al seleccionar un folio (Normal o Rezagado)
  const abrirModalFolio = (datosFolio) => {
    setFolioSeleccionado(datosFolio);
    setDetalleProductos([]);
    setLoadingDetalle(true);

    const esRezagado = datosFolio.tipo_pedido === 'rezagado';
    const idConsulta = esRezagado ? datosFolio.id_rezagado : datosFolio.id_pedido;
    const urlEndpoint = esRezagado
      ? `${API}/pedidos-rezagados/${idConsulta}/detalle`
      : `${API}/pedidos/${idConsulta}/detalle`;

    fetch(urlEndpoint)
      .then(res => res.json())
      .then(productos => {
        setDetalleProductos(Array.isArray(productos) ? productos : []);
      })
      .catch(err => console.error("Error al cargar el detalle del pedido:", err))
      .finally(() => setLoadingDetalle(false));
  };

  // Generación y cálculo de folios del rango
  const { listaFolios, totalRegistrados, totalFaltantes } = useMemo(() => {
    const inicio = parseInt(rangoInicio, 10) || 0;
    const fin = parseInt(rangoFin, 10) || 0;

    if (inicio <= 0 || fin <= 0 || inicio > fin) {
      return { listaFolios: [], totalRegistrados: 0, totalFaltantes: 0 };
    }

    const lista = [];
    let regCount = 0;
    let faltCount = 0;

    for (let f = inicio; f <= fin; f++) {
      const existe = foliosMap.has(f);
      if (existe) regCount++;
      else faltCount++;

      lista.push({
        numFolio: f,
        existe,
        datos: foliosMap.get(f) || null
      });
    }

    return {
      listaFolios: lista,
      totalRegistrados: regCount,
      totalFaltantes: faltCount
    };
  }, [rangoInicio, rangoFin, foliosMap]);

  // Filtrado de la lista
  const listaFiltrada = useMemo(() => {
    if (filtro === "faltantes") return listaFolios.filter(i => !i.existe);
    if (filtro === "registrados") return listaFolios.filter(i => i.existe);
    return listaFolios;
  }, [listaFolios, filtro]);

  return (
    <div style={styles.page}>
      <button style={styles.backTop} onClick={() => navigate("/")}>
        ⬅ Volver al inicio
      </button>

      {/* Header */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: -5, marginBottom: 20 }}>
        <img src={logo} alt="Pegatek" style={{ width: 130, objectFit: "contain", marginBottom: 6 }} />
        <h1 style={{ margin: 0, color: "#8B1E1E", fontSize: "28px", fontWeight: "bold", letterSpacing: "1px" }}>
          CONTROL DE FOLIOS
        </h1>
      </div>

      {loading ? (
        <p style={{ textAlign: "center", padding: 30 }}>Cargando análisis de folios...</p>
      ) : (
        <>
          {/* Panel de Métricas / Alertas */}
          <div style={{ display: "flex", gap: "15px", flexWrap: "wrap", marginBottom: "20px" }}>
            <div style={{ ...styles.cardMetric, backgroundColor: "#071849" }}>
              <div style={{ fontSize: "12px", opacity: 0.9 }}>RANGO ANALIZADO</div>
              <div style={{ fontSize: "20px", fontWeight: "bold", marginTop: 4 }}>
                {rangoInicio} al {rangoFin}
              </div>
            </div>

            <div style={{ ...styles.cardMetric, backgroundColor: "#2e7d32" }}>
              <div style={{ fontSize: "12px", opacity: 0.9 }}>TOTAL REGISTRADOS</div>
              <div style={{ fontSize: "24px", fontWeight: "bold", marginTop: 2 }}>{totalRegistrados}</div>
            </div>

            <div style={{ ...styles.cardMetric, backgroundColor: "#c62828" }}>
              <div style={{ fontSize: "12px", opacity: 0.9 }}>TOTAL FALTANTES</div>
              <div style={{ fontSize: "24px", fontWeight: "bold", marginTop: 2 }}>
                ⚠️ {totalFaltantes}
              </div>
            </div>
          </div>

          {/* Filtros de Rango y Modos de Vista */}
          <div style={{ background: "#f8f9fa", padding: "15px", borderRadius: "8px", border: "1px solid #e9ecef", marginBottom: "20px" }}>
            <div style={{ display: "flex", gap: "15px", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between" }}>
              
              {/* Ajuste de Rango */}
              <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
                <label style={{ fontSize: "13px", fontWeight: "bold", color: "#444" }}>Folio Inicial:</label>
                <input
                  type="number"
                  value={rangoInicio}
                  onChange={e => setRangoInicio(e.target.value)}
                  style={{ width: "90px", padding: "6px 8px", borderRadius: "4px", border: "1px solid #ccc" }}
                />

                <label style={{ fontSize: "13px", fontWeight: "bold", color: "#444" }}>Folio Final:</label>
                <input
                  type="number"
                  value={rangoFin}
                  onChange={e => setRangoFin(e.target.value)}
                  style={{ width: "90px", padding: "6px 8px", borderRadius: "4px", border: "1px solid #ccc" }}
                />

                <span style={{ fontSize: "12px", color: "#666", fontStyle: "italic", marginLeft: "5px" }}>
                  (BD: <strong>{minFolio}</strong> al <strong>{maxFolio}</strong>)
                </span>

                <button
                  onClick={() => { setRangoInicio(minFolio); setRangoFin(maxFolio); }}
                  style={{
                    padding: "5px 10px",
                    fontSize: "12px",
                    borderRadius: "4px",
                    border: "1px solid #8B1E1E",
                    color: "#8B1E1E",
                    cursor: "pointer",
                    background: "#fff",
                    fontWeight: "bold"
                  }}
                  title="Restablece al rango mínimo y máximo real de la BD"
                >
                  Restablecer Rango Real
                </button>
              </div>

              {/* Botones de Filtro Rápido */}
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  style={{
                    ...styles.filterBtn,
                    backgroundColor: filtro === "todos" ? "#8B1E1E" : "#fff",
                    color: filtro === "todos" ? "#fff" : "#8B1E1E"
                  }}
                  onClick={() => setFiltro("todos")}
                >
                  Ver Todos ({listaFolios.length})
                </button>

                <button
                  style={{
                    ...styles.filterBtn,
                    backgroundColor: filtro === "faltantes" ? "#c62828" : "#fff",
                    color: filtro === "faltantes" ? "#fff" : "#c62828",
                    borderColor: "#c62828"
                  }}
                  onClick={() => setFiltro("faltantes")}
                >
                  Solo Faltantes (⚠️ {totalFaltantes})
                </button>

                <button
                  style={{
                    ...styles.filterBtn,
                    backgroundColor: filtro === "registrados" ? "#2e7d32" : "#fff",
                    color: filtro === "registrados" ? "#fff" : "#2e7d32",
                    borderColor: "#2e7d32"
                  }}
                  onClick={() => setFiltro("registrados")}
                >
                  Solo Registrados ({totalRegistrados})
                </button>
              </div>
            </div>
          </div>

          {/* Cuadrícula de Folios */}
          <div style={styles.grid}>
            {listaFiltrada.map(item => {
              if (item.existe) {
                const esRezagado = item.datos?.tipo_pedido === 'rezagado';
                return (
                  <div
                    key={item.numFolio}
                    style={{
                      ...styles.boxFolio,
                      backgroundColor: esRezagado ? "#fff3e0" : "#e8f5e9",
                      color: esRezagado ? "#e65100" : "#1b5e20",
                      border: esRezagado ? "2px solid #ffe0b2" : "2px solid #a5d6a7"
                    }}
                    onClick={() => abrirModalFolio(item.datos)}
                  >
                    <span style={{ fontSize: "11px", opacity: 0.8 }}>FOLIO</span>
                    #{item.numFolio}
                    <span style={{ fontSize: "10px", marginTop: 2, fontWeight: "bold" }}>
                      {esRezagado ? "⏳ REZAGADO" : "✅ OK"}
                    </span>
                  </div>
                );
              }

              return (
                <div
                  key={item.numFolio}
                  style={{
                    ...styles.boxFolio,
                    backgroundColor: "#ffebee",
                    color: "#b71c1c",
                    border: "2px solid #ef9a9a"
                  }}
                >
                  <span style={{ fontSize: "11px", opacity: 0.8 }}>FOLIO</span>
                  #{item.numFolio}
                  <span style={{ fontSize: "10px", marginTop: 2 }}>⚠️ FALTANTE</span>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Modal Detalles de Folio Registrado */}
      {folioSeleccionado && (
        <div style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.4)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000
        }}>
          <div style={{
            background: "#fff",
            padding: "24px",
            borderRadius: "8px",
            width: "500px",
            maxWidth: "92%",
            maxHeight: "90vh",
            overflowY: "auto",
            boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "2px solid #8B1E1E", paddingBottom: "8px" }}>
              <h3 style={{ color: "#8B1E1E", margin: 0 }}>
                Detalles del Folio #{folioSeleccionado.folio}
              </h3>
              <span style={{
                fontSize: "11px",
                fontWeight: "bold",
                padding: "3px 8px",
                borderRadius: "4px",
                backgroundColor: folioSeleccionado.tipo_pedido === 'rezagado' ? '#ffe0b2' : '#c8e6c9',
                color: folioSeleccionado.tipo_pedido === 'rezagado' ? '#e65100' : '#2e7d32'
              }}>
                {folioSeleccionado.tipo_pedido === 'rezagado' ? 'REZAGADO' : 'NORMAL'}
              </span>
            </div>

            <div style={{ fontSize: "13px", lineHeight: "1.7", color: "#333", marginTop: "12px" }}>
              <p style={{ margin: "3px 0" }}>
                <strong>{folioSeleccionado.tipo_pedido === 'rezagado' ? 'ID Rezagado:' : 'Pedido #:'}</strong> {
                  folioSeleccionado.tipo_pedido === 'rezagado' ? folioSeleccionado.id_rezagado : folioSeleccionado.id_pedido
                }
              </p>
              <p style={{ margin: "3px 0" }}><strong>Cliente:</strong> {folioSeleccionado.cliente || "N/A"}</p>
              <p style={{ margin: "3px 0" }}><strong>Tienda:</strong> {folioSeleccionado.nombre_tienda || "N/A"}</p>
              <p style={{ margin: "3px 0" }}>
                <strong>Fecha Salida / Registro:</strong> {
                  folioSeleccionado.fecha_salida
                    ? new Date(folioSeleccionado.fecha_salida).toLocaleDateString("es-MX")
                    : "N/A"
                }
              </p>
              <p style={{ margin: "3px 0" }}>
                <strong>Estado:</strong> <span style={{ textTransform: "uppercase", fontWeight: "bold" }}>{folioSeleccionado.estado || "N/A"}</span>
              </p>
              <p style={{ margin: "3px 0" }}>
                <strong>Monto Total:</strong> ${
                  Number(folioSeleccionado.total || 0).toLocaleString("es-MX", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })
                } MXN
              </p>
            </div>

            {/* Tabla de Productos del Detalle */}
            <div style={{ marginTop: "15px", borderTop: "1px solid #eee", paddingTop: "10px" }}>
              <h4 style={{ margin: "0 0 8px 0", fontSize: "14px", color: "#071849" }}>Productos en la Orden:</h4>
              
              {loadingDetalle ? (
                <p style={{ fontSize: "12px", color: "#666", textStyle: "italic" }}>Cargando productos...</p>
              ) : detalleProductos.length > 0 ? (
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
                  <thead>
                    <tr style={{ background: "#f5f5f5", textAlign: "left" }}>
                      <th style={{ padding: "6px", border: "1px solid #ddd" }}>Producto</th>
                      <th style={{ padding: "6px", border: "1px solid #ddd", textAlign: "center" }}>Cant.</th>
                      <th style={{ padding: "6px", border: "1px solid #ddd", textAlign: "right" }}>P. Unit</th>
                      <th style={{ padding: "6px", border: "1px solid #ddd", textAlign: "right" }}>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {detalleProductos.map((prod, idx) => {
                      const cant = Number(prod.cantidad || prod.cantidad_pedida || 0);
                      const pu = Number(prod.precio_unitario || prod.precio || 0);
                      const sub = Number(prod.subtotal || (cant * pu));
                      return (
                        <tr key={idx}>
                          <td style={{ padding: "6px", border: "1px solid #ddd" }}>{prod.producto || prod.nombre || 'N/A'}</td>
                          <td style={{ padding: "6px", border: "1px solid #ddd", textAlign: "center" }}>{cant}</td>
                          <td style={{ padding: "6px", border: "1px solid #ddd", textAlign: "right" }}>${pu.toFixed(2)}</td>
                          <td style={{ padding: "6px", border: "1px solid #ddd", textAlign: "right" }}>${sub.toFixed(2)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <p style={{ fontSize: "12px", color: "#888" }}>Sin detalles de productos disponibles.</p>
              )}
            </div>

            <div style={{ marginTop: "20px", textAlign: "right" }}>
              <button
                onClick={() => setFolioSeleccionado(null)}
                style={{
                  backgroundColor: "#8B1E1E",
                  color: "#fff",
                  border: "none",
                  padding: "8px 18px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontWeight: "bold"
                }}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


