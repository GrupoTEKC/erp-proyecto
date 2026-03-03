const mysql = require('mysql2/promise')

const pool = mysql.createPool({
  uri: process.env.MYSQL_URL,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  
  // ✅ CONFIGURACIONES DE SUPERVIVENCIA:
  enableKeepAlive: true,    // Mantiene la conexión "despierta"
  keepAliveInitialDelay: 10000, // Empieza a mandar señales tras 10 segundos
  connectTimeout: 20000     // Tiempo máximo para intentar conectar (20 seg)
})

// Tip: Agregamos un log para saber si hubo un error serio en el pool
pool.on('error', (err) => {
    console.error('❌ Error inesperado en el Pool de MySQL:', err.message);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        console.error('⚠️ La conexión se perdió. El pool intentará reconectar en la próxima petición.');
    }
});

module.exports = pool
