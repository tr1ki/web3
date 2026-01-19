const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Serve static files from public folder

// Connect to MongoDB
const mongoOptions = {
  maxPoolSize: 10, // Maintain up to 10 socket connections
  serverSelectionTimeoutMS: 50000, // Keep trying to send operations for 50 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
};

// For local MongoDB
if (process.env.MONGODB_URI.includes('localhost')) {
  mongoOptions.serverSelectionTimeoutMS = 5000;
}

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/blogdb', mongoOptions)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
    console.log('⚠️  MongoDB not available. API will return connection errors.');
    console.log('💡 To run MongoDB locally:');
    console.log('   - Install MongoDB Community Server');
    console.log('   - Start MongoDB service');
    console.log('   - Or use MongoDB Atlas (cloud)');
  });

// Routes
const blogRoutes = require('./routes/blogs');
app.use('/api/blogs', blogRoutes);

// Root route - serve frontend
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: err.message 
  });
});

// Handle 404 for API routes
app.use((req, res, next) => {
  if (req.path.startsWith('/api/')) {
    res.status(404).json({ error: 'API endpoint not found' });
  } else {
    next();
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});