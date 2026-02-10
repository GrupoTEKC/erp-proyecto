const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // en XAMPP normalmente va vacío
  database: 'erp_grupotekc' // ⚠️ pon aquí el nombre REAL de tu BD
});

db.connect(err => {
  if (err) {
    console.error('❌ Error conectando a MySQL', err);
  } else {
    console.log('✅ Conectado a MySQL');
  }
});

module.exports = db;
