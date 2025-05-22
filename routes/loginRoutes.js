/**
 * @swagger
 * tags:
 *   name: Login Routes
 *   description: User authentication and password management
 */

const express = require('express');
const { login } = require('../controllers/loginController');
const authenticateToken = require('../middlewares/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login a user
 *     tags: [Login Routes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Successful login
 *       401:
 *         description: Invalid credentials
 */
router.post('/', login);

// Sólo especificar esta aquí ya que está muy corta
router.get('/authenticateToken', authenticateToken, (req, res) => {
    res.json({ message: 'Token is valid' });
});

module.exports = router;
