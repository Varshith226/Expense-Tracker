const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const colors = require('colors');
const connectDb = require('./config/connectDb');

// Load environment variables
dotenv.config();

// Connect to database
connectDb();

// Initialize express app
const app = express();

// Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/v1/users', require('./routes/userRoute'));
app.use('/api/v1/transactions', require('./routes/transactionRoutes'));
app.use('/api/v1/bills', require('./routes/bills'));

// Default route for base URL
app.get('/', (req, res) => {
  res.send('Expense Tracker API is running 🚀');
});

// Port setup
const PORT = process.env.PORT || 8080;

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`.bgGreen.white);
});
