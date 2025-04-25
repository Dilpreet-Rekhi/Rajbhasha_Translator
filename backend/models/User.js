const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { ROLES } = require('../config/constants');

// User Schema
const userSchema = new mongoose.Schema({
  officialId: {
    type: String,
    required: true,
    unique: true,
    match: /^[A-Z]{2}\d{6}$/, // Validate officialId format
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: [/\S+@\S+\.\S+/, 'Please use a valid email address'],
  },
  department: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8, // Minimum length for password
  },
  role: {
    type: String,
    enum: [ROLES.USER, ROLES.ADMIN], // Define roles
    default: ROLES.USER,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verificationToken: String,
  verificationExpires: Date,
  verifiedAt: Date,
  loginAttempts: {
    type: Number,
    default: 0,
  },
  isLocked: {
    type: Boolean,
    default: false,
  },
  lockedUntil: Date,
  lastLogin: Date,
  passwordChangedAt: Date, // To track password change for JWT validation
});

// Password hashing before saving user
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Compare password method
userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

// Instance method to update the password change date
userSchema.methods.updatePasswordChangedAt = function () {
  this.passwordChangedAt = new Date();
  return this.save();
};

// Static method to find by officialId
userSchema.statics.findByOfficialId = function (officialId) {
  return this.findOne({ officialId });
};

// User Model
const User = mongoose.model('User', userSchema);

module.exports = User;
