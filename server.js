const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/database');
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const taskRoutes = require('./routes/tasks');

// Connect to database
connectDB();

const app = express();

// CORS configuration
const corsOptions = {
  origin: true, // Allow all origins for now
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/projects', projectRoutes);
app.use('/projects', taskRoutes); // Task routes are nested under projects
app.use('/tasks', taskRoutes); // Also mount under /tasks for /overdue endpoint

// Health check route
app.get('/health', (req, res) => {
  res.json({ message: 'Project Management API is running!' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Handle 404
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
