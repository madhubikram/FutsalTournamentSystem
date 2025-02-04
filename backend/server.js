// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

console.log('Starting server...');

// Import routes
const authRoutes = require('./routes/auth.routes');
const protectedRoutes = require('./routes/protected.routes');
console.log('Routes imported');

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Your frontend URL
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Debug middleware to log all requests
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', protectedRoutes);

// Test route
app.get('/test', (req, res) => {
    console.log('Test route hit');
    res.json({ message: 'API working' });
});

// Debug route to list all registered routes
app.get('/debug/routes', (req, res) => {
    const routes = [];
    app._router.stack.forEach(middleware => {
        if(middleware.route){ 
            routes.push(middleware.route.path);
        } else if(middleware.name === 'router'){ 
            middleware.handle.stack.forEach(handler => {
                if(handler.route){
                    routes.push(handler.route.path);
                }
            });
        }
    });
    res.json(routes);
});

// Add this after your routes
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
      message: 'Internal server error',
      error: err.message
  });
});

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));

mongoose.connection.on('connected', async () => {
    try {
        const User = require('./models/user.model');
        const pendingAdmins = await User.find({
            role: 'futsalAdmin',
            verificationStatus: 'pending'
        });
        console.log('Current pending admins:', pendingAdmins);
    } catch (err) {
        console.error('Error checking pending admins:', err);
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Debug routes available at: http://localhost:${PORT}/debug/routes`);
});