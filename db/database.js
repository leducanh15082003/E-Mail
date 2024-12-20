const mysql = require('mysql2/promise');

const db = mysql.createPool({
    host: 'localhost',
    port: '3306',
    user: 'wpr',
    password: 'fit2024',
    database: 'wpr2101040017'
});

module.exports = db;