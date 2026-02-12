const mysql = require('mysql2')

const pool = mysql.createPool({
  uri: process.env.MYSQL_URL,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
})

pool.getConnection((err, conn) => {
  if (err) {
    console.error('🔥 Error conectando MySQL:', err)
  } else {
    console.log('✅ Pool MySQL conectado')
    conn.release()
  }
})

module.exports = pool
