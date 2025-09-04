const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const colors = require('colors');
const path = require('path');
const favicon = require('serve-favicon'); // Import serve-favicon middleware
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
app.use(cors({
  origin: '*', // Change this to your frontend domain in production
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

// Serve favicon (make sure favicon.ico is in 'public' folder in backend root)
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// Routes
app.use('/api/v1/users', require('./routes/userRoute'));
app.use('/api/v1/transactions', require('./routes/transactionRoutes'));
app.use('/api/v1/bills', require('./routes/bills'));

// Health check
app.get('/', (req, res) => {
  res.status(200).send('Expense Tracker API is running 🚀');
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack.red);
  res.status(500).json({ error: 'Something went wrong' });
});

// Port setup
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`.bgGreen.white);
});
