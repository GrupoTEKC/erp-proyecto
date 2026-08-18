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

  // Modal de detalles de folio
  const [folioSeleccionado, setFolioSeleccionado] = useState(null);

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
            // Solo tomar en cuenta folios numéricos mayores a 0
            if (!isNaN(numFolio) && numFolio > 0) {
              mapa.set(numFolio, item);
              numerosValidos.push(numFolio);
            }
          });
        }

        // Calcular min y max descartando ceros
        const minCalculado = numerosValidos.length > 0 ? Math.min(...numerosValidos) : 0;
        const maxCalculado = numerosValidos.length > 0 ? Math.max(...numerosValidos) : 0;

        // Si el backend envía 0 en min_folio, forzar el uso del mínimo real calculado
        const minBackend = parseInt(data.min_folio, 10);
        const maxBackend = parseInt(data.max_folio, 10);

        const minFinal = (minBackend && minBackend > 0) ? minBackend : minCalculado;
        const maxFinal = (maxBackend && maxBackend > 0) ? maxBackend : maxCalculado;

        setFoliosMap(mapa);
        setMinFolio(minFinal);
        setMaxFolio(maxFinal);

        // Precargar automáticamente el rango positivo real
        setRangoInicio(minFinal);
        setRangoFin(maxFinal);
      })
      .catch(err => console.error("Error al cargar folios:", err))
      .finally(() => setLoading(false));
  }, []);

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
                return (
                  <div
                    key={item.numFolio}
                    style={{
                      ...styles.boxFolio,
                      backgroundColor: "#e8f5e9",
                      color: "#1b5e20",
                      border: "2px solid #a5d6a7"
                    }}
                    onClick={() => setFolioSeleccionado(item.datos)}
                  >
                    <span style={{ fontSize: "11px", opacity: 0.8 }}>FOLIO</span>
                    #{item.numFolio}
                    <span style={{ fontSize: "10px", marginTop: 2 }}>✅ OK</span>
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
            width: "420px",
            maxWidth: "90%",
            boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
          }}>
            <h3 style={{ color: "#8B1E1E", marginTop: 0, borderBottom: "2px solid #8B1E1E", paddingBottom: "8px" }}>
              Detalles del Folio #{folioSeleccionado.folio}
            </h3>

            <div style={{ fontSize: "14px", lineHeight: "1.8", color: "#333" }}>
              <p style={{ margin: "4px 0" }}><strong>Pedido #:</strong> {folioSeleccionado.id_pedido}</p>
              <p style={{ margin: "4px 0" }}><strong>Cliente:</strong> {folioSeleccionado.cliente || "N/A"}</p>
              <p style={{ margin: "4px 0" }}><strong>Tienda:</strong> {folioSeleccionado.nombre_tienda || "N/A"}</p>
              <p style={{ margin: "4px 0" }}>
                <strong>Fecha Salida:</strong> {
                  folioSeleccionado.fecha_salida
                    ? new Date(folioSeleccionado.fecha_salida).toLocaleString("es-MX")
                    : "N/A"
                }
              </p>
              <p style={{ margin: "4px 0" }}>
                <strong>Monto Total:</strong> ${Number(folioSeleccionado.total || 0).toFixed(2)} MXN
              </p>
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
