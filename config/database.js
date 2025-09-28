const mysql = require('mysql2');

require('dotenv').config();

const connection = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    databe: process.env.DB_DATABASE
});

connection.connect(err => {
    if (err) {
        console.error('Erro ao conectar com o banco de dados:', err.stack);
        return;
    }
    console.log('Conexão com o banco de dados MySQL estabelecida com sucesso.');
});

module.exports = connection;