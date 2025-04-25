const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // adjust path if needed
const express = require('express');
const router = express.Router();
const {
  // verifyEmail,
  registerUser,
  loginUser
} = require('../controllers/authController');

// Register new user
router.post('/register', registerUser);

// Login user and return token
router.post('/login', async (req, res) => {
  console.log('Login request body:', req.body);
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ success: false, error: 'Email and password are required.' });
  }

  try {
    // Check if the user exists
    console.log("Login request received:", req.body);
    const user = await User.findOne({ email : "sabeerrekhi@gmail.com"});
    console.log("User found:", user);
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid email or password.' });
    }

    // Compare provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid email or password.' });
    }

    // Create a JWT token
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRATION || "1h",
        issuer: process.env.JWT_ISSUER || "rajbhasa-translator",
        audience: process.env.JWT_AUDIENCE || "users",
      }
    );

    // Send response with the token
    return res.status(200).json({
      success: true,
      message: 'Login successful.',
      token
    });

  } catch (error) {
    console.error('Login Error:', error);    
    return res.status(500).json({ success: false, error: 'Server error during login.' });
  }
});

// Email verification link
// router.get('/verify-email', verifyEmail);

module.exports = router;
