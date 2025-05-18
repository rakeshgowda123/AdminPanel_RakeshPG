import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/userModel.js';

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      res.status(400);
      throw new Error('Please provide email and password');
    }

    // Check for user email
    const user = await User.findOne({ email });

    if (!user) {
      res.status(401);
      throw new Error('Invalid credentials');
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      res.status(401);
      throw new Error('Invalid credentials');
    }

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(res.statusCode || 500).json({
      message: error.message,
    });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } catch (error) {
    res.status(res.statusCode || 500).json({
      message: error.message,
    });
  }
};

// @desc    Create an admin user for initial setup
// @route   POST /api/auth/seed-admin
// @access  Public (should be disabled in production)
export const seedAdmin = async (req, res) => {
  try {
    const adminExists = await User.findOne({ isAdmin: true });

    if (adminExists) {
      res.status(400);
      throw new Error('Admin user already exists');
    }

    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123',
      isAdmin: true,
    });

    if (admin) {
      res.status(201).json({
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        isAdmin: admin.isAdmin,
        message: 'Admin user created successfully',
      });
    } else {
      res.status(400);
      throw new Error('Invalid admin data');
    }
  } catch (error) {
    res.status(res.statusCode || 500).json({
      message: error.message,
    });
  }
};