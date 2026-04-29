// server.js
// Auto Aid - Main Express Application Entry Point

const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');

// Initialize the app
const app = express();
const PORT = process.env.PORT || 3000;

// ===================== MIDDLEWARE =====================

// Parse incoming form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files (CSS, JS) from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'autoaid-super-secret-2024',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 // 24 hours
  }
}));

// Flash messages (uses session)
app.use(flash());

// ===================== INITIALIZE DATABASE =====================
// This creates the DB file and tables if they don't exist
require('./models/database');

// ===================== ROUTES =====================

// Home route - redirect to dashboard or login
app.get('/', (req, res) => {
  if (req.session.userId) {
    return res.redirect('/dashboard');
  }
  res.redirect('/auth/login');
});

// Auth routes (login, signup, logout)
app.use('/auth', require('./routes/auth'));

// Dashboard route
app.use('/dashboard', require('./routes/dashboard'));

// Car management routes
app.use('/cars', require('./routes/cars'));

// Service record routes
app.use('/services', require('./routes/services'));

// Insurance routes
app.use('/insurance', require('./routes/insurance'));

// Roadside assistance routes
app.use('/roadside', require('./routes/roadside'));

// ===================== 404 HANDLER =====================
app.use((req, res) => {
  res.status(404).send(`
    <div style="font-family: sans-serif; text-align: center; padding: 80px 20px;">
      <h1>🚗 Page Not Found</h1>
      <p style="color: #666; margin: 16px 0;">The page you're looking for doesn't exist.</p>
      <a href="/" style="background: #FF5733; color: #fff; padding: 10px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">
        Go Home →
      </a>
    </div>
  `);
});

// ===================== ERROR HANDLER =====================
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  res.status(500).render('error', { message: 'Internal server error. Please try again.' });
});

// ===================== START SERVER =====================
app.listen(PORT, () => {
  console.log('\n🚗 ========================================');
  console.log(`   AUTO AID is running!`);
  console.log(`   Open: http://localhost:${PORT}`);
  console.log('==========================================\n');
});
