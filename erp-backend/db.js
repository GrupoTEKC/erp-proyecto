const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection(process.env.MYSQL_URL);

db.connect(err => {
  if (err) {
    console.error('❌ Error conectando a MySQL', err);
  } else {
    console.log('✅ Conectado a MySQL');
  }
});

module.exports = db;
