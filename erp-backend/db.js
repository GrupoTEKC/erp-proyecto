const mysql = require('mysql2')

const db = mysql.createConnection(process.env.MYSQL_URL)

db.connect(err => {
  if (err) {
    console.error('❌ Error conectando MySQL:', err)
  } else {
    console.log('✅ MySQL conectado')
  }
})

module.exports = db
