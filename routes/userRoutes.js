/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management API
 */

const express = require('express');
const { getUsers, createUser, updateUser, deleteUser, getUsersByID } = require('../controllers/userController');
const authenticateToken = require('../middlewares/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns all users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   username:
 *                     type: string
 *                   email:
 *                     type: string
 *       401:
 *         description: Unauthorized, token missing or invalid
 *       500:
 *         description: Server error
 */
router.get('/', authenticateToken, getUsers);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the user to retrieve
 *         schema:
 *           type: integer
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns a user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: The user ID
 *                 username:
 *                   type: string
 *                   description: The user's full name
 *                 email:
 *                   type: string
 *                   description: The user's email address
 *                 password:
 *                   type: string
 *                   description: The hashed password of the user
 *                 lastLogin:
 *                   type: string
 *                   format: date-time
 *                   description: The last login timestamp of the user
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   description: The timestamp when the user was created
 *       404:
 *         description: User not found
 *       401:
 *         description: Unauthorized, token missing or invalid
 *       500:
 *         description: Server error
 */
router.get('/:id', authenticateToken, getUsersByID);

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: Jane Doe
 *               email:
 *                 type: string
 *                 example: jane@example.com
 *               password:
 *                 type: string
 *                 example: jane123
 *     responses:
 *       201:
 *         description: User created successfully
 *       500:
 *         description: General error
 */
router.post('/', createUser);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update a user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 5
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: Jane Doe
 *               email:
 *                 type: string
 *                 example: janenew@example.com
 *               password:
 *                 type: string
 *                 example: jane234
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User updated successfully
 *       401:
 *         description: Unauthorized, token missing or invalid
 */
router.put('/:id', authenticateToken, updateUser);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 5
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       401:
 *         description: Unauthorized, token missing or invalid
 *       404:
 *         description: User not found
 */
router.delete('/:id', authenticateToken, deleteUser);

module.exports = router;
