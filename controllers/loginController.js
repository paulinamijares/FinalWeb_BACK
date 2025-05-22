// loginController.jsx
const sql = require('mssql');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const BCRYPT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS) || 10;
const BCRYPT_SALT = process.env.BCRYPT_SALT || bcrypt.genSaltSync(BCRYPT_ROUNDS);

// Database configuration
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

// Function to get a connection pool
async function getPool() {
    try {
        return await sql.connect(config);
    } catch (error) {
        console.error("Database connection error:", error.message);
        throw error;
    }
}

// Login a user [READ]
async function login(req, res) {
    const { email, password } = req.body;
    try {
        const pool = await getPool();
        const result = await pool.request()
            .input('email', sql.NVarChar, email)
            .query(`SELECT id, username, email, password FROM dbo.paulina WHERE email = @email`);

        if (result.recordset.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = result.recordset[0];

        // Compare the hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Update a user's password [UPDATE]
async function updatePassword(req, res) {
    const { id } = req.params;
    const { password } = req.body;

    try {
        const pool = await getPool();
        const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT);

        await pool.request()
            .input('hashedPassword', sql.NVarChar, hashedPassword)
            .input('userId', sql.Int, id)
            .query(`UPDATE dbo.paulina SET password = @hashedPassword WHERE id = @userId`);

        res.json({ message: 'Password updated successfully!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Read last login for a specific user
async function lastLogin(req, res) {
    const { id } = req.params;

    try {
        const pool = await getPool();
        const result = await pool.request()
            .input('userId', sql.Int, id)
            .query(`SELECT id, username, email FROM dbo.paulina WHERE id = @userId`);

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'No recent login found for this user' });
        }

        res.json(result.recordset[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Block login by setting password to `0`
async function deletePassword(req, res) {
    const { id } = req.params;

    try {
        const pool = await getPool();
        await pool.request()
            .input('userId', sql.Int, id)
            .query(`UPDATE dbo.paulina SET password = '0' WHERE id = @userId`);

        res.json({ message: 'Password removed successfully!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = { login, lastLogin, updatePassword, deletePassword };
