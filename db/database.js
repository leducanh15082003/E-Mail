const mysql = require('mysql2/promise');

const db = mysql.createPool({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: '123456',
    database: 'wpr2101040017'
});

module.exports = db;