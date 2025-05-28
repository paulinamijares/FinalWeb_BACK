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

let pool;

async function connectDB() {
    try {
        pool = await sql.connect(config);
        console.log("Conectado a SQL Server!");
        return pool;
    } catch (error) {
        console.error("Error de conexión:", error);
        process.exit(1);
    }
}

async function query(sqlQuery) {
    if (!pool) {
        await connectDB();
    }
    return pool.request().query(sqlQuery);
}

async function closeDB() {
    if (pool) {
        await pool.close();
        console.log("Conexión cerrada.");
    }
}

module.exports = { connectDB, query, closeDB };
