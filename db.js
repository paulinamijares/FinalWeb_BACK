// db.js
require('dotenv').config();
const sql = require('mssql');

const config = {
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE, 
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    options: {
        encrypt: true, 
        trustServerCertificate: true
    }
};

async function connectDB() {
    try {
        const pool = await sql.connect(config);
        console.log("Conectado a SQL Server!");
        return pool;
    } catch (error) {
        console.error("Error de conexión:", error);
        process.exit(1);
    }
}

module.exports = { connectDB };
