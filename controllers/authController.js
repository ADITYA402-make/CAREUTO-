// controllers/authController.js
// Handles signup, login, logout logic

const bcrypt = require('bcryptjs');
const db = require('../models/database');

// Show login page
const showLogin = (req, res) => {
  if (req.session.userId) return res.redirect('/dashboard');
  res.render('auth/login', {
    title: 'Login - Auto Aid',
    error: req.flash('error'),
    success: req.flash('success')
  });
};

// Show signup page
const showSignup = (req, res) => {
  if (req.session.userId) return res.redirect('/dashboard');
  res.render('auth/signup', {
    title: 'Sign Up - Auto Aid',
    error: req.flash('error')
  });
};

// Handle signup form submission
const signup = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    // Validation
    if (!name || !email || !password) {
      req.flash('error', 'All fields are required.');
      return res.redirect('/auth/signup');
    }

    if (password !== confirmPassword) {
      req.flash('error', 'Passwords do not match.');
      return res.redirect('/auth/signup');
    }

    if (password.length < 6) {
      req.flash('error', 'Password must be at least 6 characters.');
      return res.redirect('/auth/signup');
    }

    // Check if email already exists
    const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existingUser) {
      req.flash('error', 'Email already registered. Please login.');
      return res.redirect('/auth/signup');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    const result = db.prepare(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)'
    ).run(name, email, hashedPassword);

    // Auto-login after signup
    req.session.userId = result.lastInsertRowid;
    req.session.userName = name;

    req.flash('success', `Welcome to Auto Aid, ${name}!`);
    res.redirect('/dashboard');
  } catch (err) {
    console.error('Signup error:', err);
    req.flash('error', 'Something went wrong. Please try again.');
    res.redirect('/auth/signup');
  }
};

// Handle login form submission
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      req.flash('error', 'Email and password are required.');
      return res.redirect('/auth/login');
    }

    // Find user by email
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);

    if (!user) {
      req.flash('error', 'Invalid email or password.');
      return res.redirect('/auth/login');
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      req.flash('error', 'Invalid email or password.');
      return res.redirect('/auth/login');
    }

    // Set session
    req.session.userId = user.id;
    req.session.userName = user.name;

    req.flash('success', `Welcome back, ${user.name}!`);
    res.redirect('/dashboard');
  } catch (err) {
    console.error('Login error:', err);
    req.flash('error', 'Something went wrong. Please try again.');
    res.redirect('/auth/login');
  }
};

// Handle logout
const logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/auth/login');
  });
};

module.exports = { showLogin, showSignup, signup, login, logout };
