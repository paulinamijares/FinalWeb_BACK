// controllers/userController.js
const sql = require('mssql');
const bcrypt = require('bcryptjs');
// eslint-disable-next-line no-unused-vars
const authenticateToken = require('../middlewares/authMiddleware'); 
require('dotenv').config();

const BCRYPT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS) || 10;
const BCRYPT_SALT = process.env.BCRYPT_SALT || bcrypt.genSaltSync(BCRYPT_ROUNDS);

// Database configuration (same as loginController)
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

// Function to get a connection pool (same as loginController)
async function getPool() {
    try {
        return await sql.connect(config);
    } catch (error) {
        console.error("Database connection error:", error.message);
        throw error;
    }
}

// Create a user [CREATE]
async function createUser(req, res) {
    const { username, email, password } = req.body;
    try {
        const pool = await getPool();
        const checkResult = await pool.request()
            .input('email', sql.NVarChar, email)
            .query(`SELECT COUNT(*) AS COUNT FROM dbo.paulina WHERE email = @email`);

        if (checkResult.recordset[0].COUNT > 0) {
            return res.status(400).json({ message: `User with email ${email} already exists.` });
        }

        const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT);

        await pool.request()
            .input('username', sql.NVarChar, username)
            .input('email', sql.NVarChar, email)
            .input('hashedPassword', sql.NVarChar, hashedPassword)
            .query(`INSERT INTO dbo.paulina (username, email, password) VALUES (@username, @email, @hashedPassword)`);

        res.status(201).json({ message: 'User created successfully!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Get all users [READ]
async function getUsers(req, res) {
    try {
        const pool = await getPool();
        const result = await pool.request().query(`SELECT id, username, email FROM dbo.paulina`);
        res.json(result.recordset);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Get user by ID
async function getUsersByID(req, res) {
    const { id } = req.params;

    try {
        const pool = await getPool();
        const result = await pool.request()
            .input('userId', sql.Int, id)
            .query(`SELECT id, username, email FROM dbo.paulina WHERE id = @userId`);

        res.json(result.recordset[0] || { message: 'User not found' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Update a user [UPDATE]
async function updateUser(req, res) {
    const { id } = req.params;
    const { username, email } = req.body;
    try {
        const pool = await getPool();
        await pool.request()
            .input('username', sql.NVarChar, username)
            .input('email', sql.NVarChar, email)
            .input('userId', sql.Int, id)
            .query(`UPDATE dbo.paulina SET username = @username, email = @email WHERE id = @userId`);

        res.json({ message: 'User updated successfully!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Delete a user [DELETE]
async function deleteUser(req, res) {
    const { id } = req.params;
    try {
        const pool = await getPool();
        const result = await pool.request()
            .input('userId', sql.Int, id)
            .query(`DELETE FROM dbo.paulina WHERE id = @userId`);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'User deleted successfully!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Protected example
async function protectedRouteExample(req, res) {
    res.json({ message: 'This route is protected', user: req.user });
}

module.exports = {
    getUsers,
    createUser,
    updateUser,
    deleteUser,
    getUsersByID,
    protectedRouteExample
};
