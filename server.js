// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const { connectDB } = require('./db');
const userRoutes = require('./routes/userRoutes');
const loginRoutes = require('./routes/loginRoutes');
// eslint-disable-next-line no-unused-vars
const { login } = require('./controllers/loginController');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json()); // Para parsear JSON
app.use(cors());
app.use(morgan('dev'));

// Swagger
const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "SQL SERVER CRUD API",
            version: "2.0.0",
            description: "API for user management and authentication, ahora con token validation",
            
        },
        servers: [
            {
                url: process.env.VITE_API_SERVER || "http://localhost:3000",
                description: "Local server"
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT"
                }
            }
        },
        security: [
            {
                bearerAuth: []  // This will apply security to all endpoints that have `security: bearerAuth`
            }
        ]
    },
    apis: ["./routes/*.js"], // Automatically loads route documentation
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
app.use('/users', userRoutes);
app.use('/login', loginRoutes);

// Start Server
connectDB();
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
