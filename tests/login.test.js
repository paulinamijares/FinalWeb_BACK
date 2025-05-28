const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const { login } = require('../controllers/loginController.js');

// Mock Express app
const app = express();
app.use(bodyParser.json());
app.post('/api/login', login);

// Environment variables (you can use a .env.test or set them manually here)
process.env.JWT_SECRET = 'testsecret'; // Ensure your secret is set for token generation

describe('POST /api/login', () => {
    it('should log in user with valid credentials', async () => {
        const response = await request(app)
            .post('/api/login')
            .send({ email: 'test1@example.com', password: 'test1' });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Login successful');
        expect(response.body).toHaveProperty('token');
    });

    it('should return 401 for invalid password', async () => {
        const response = await request(app)
            .post('/api/login')
            .send({ email: 'test1@example.com', password: 'wrongpassword' });

            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty('message', 'Invalid credentials');
    });

    it('should return 401 for non-existent user', async () => {
        const response = await request(app)
            .post('/api/login')
            .send({ email: 'doesnotexist@example.com', password: 'irrelevant' });

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('error' || 'message', 'Invalid credentials');
    });
});
