const express = require('express');
const {
  loginController,
  registerController,
} = require('../controllers/userController');

const router = express.Router();

// ✅ Login route
router.post('/login', async (req, res, next) => {
  try {
    await loginController(req, res);
  } catch (err) {
    next(err); // Pass errors to global error handler
  }
});

// ✅ Register route
router.post('/register', async (req, res, next) => {
  try {
    await registerController(req, res);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
