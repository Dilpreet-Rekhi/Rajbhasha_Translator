const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// User Registration
exports.registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ success: false, error: 'All fields are required.' });
  }

  try {
    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, error: 'Email already registered.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });

    // Save the new user to the database
    await newUser.save();
    res.status(201).json({ success: true, message: 'User registered successfully.' });

  } catch (error) {
    console.error('Register Error:', error.message);
    res.status(500).json({ success: false, error: 'Server error during registration.' });
  }
};

// User Login
exports.loginUser = async (req, res) => {
  console.log('Login request body:', req.body);
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ success: false, error: 'Email and password are required.' });
  }

  try {
    // Check if the user exists
    console.log("Login request received:", req.body);
    const user = await User.findOne({ email });
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
};
