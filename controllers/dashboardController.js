// controllers/dashboardController.js
// Fetches all data for the main dashboard

const db = require('../models/database');

const showDashboard = (req, res) => {
  try {
    const userId = req.session.userId;

    // Get all cars for this user
    const cars = db.prepare('SELECT * FROM cars WHERE user_id = ? ORDER BY created_at DESC').all(userId);

    // Get recent service records
    const recentServices = db.prepare(`
      SELECT s.*, c.car_name, c.number_plate 
      FROM services s 
      JOIN cars c ON s.car_id = c.id 
      WHERE s.user_id = ? 
      ORDER BY s.service_date DESC 
      LIMIT 5
    `).all(userId);

    // Get insurance records with expiry check
    const insurance = db.prepare(`
      SELECT i.*, c.car_name, c.number_plate 
      FROM insurance i 
      JOIN cars c ON i.car_id = c.id 
      WHERE i.user_id = ?
      ORDER BY i.expiry_date ASC
    `).all(userId);

    // Check insurance expiry - warn if expires within 30 days
    const today = new Date();
    const insuranceWithWarning = insurance.map(ins => {
      const expiry = new Date(ins.expiry_date);
      const daysLeft = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
      return { ...ins, daysLeft, isExpired: daysLeft < 0, isWarning: daysLeft >= 0 && daysLeft <= 30 };
    });

    res.render('dashboard', {
      title: 'Dashboard - Auto Aid',
      userName: req.session.userName,
      cars,
      recentServices,
      insurance: insuranceWithWarning,
      carCount: cars.length,
      success: req.flash('success'),
      error: req.flash('error')
    });
  } catch (err) {
    console.error('Dashboard error:', err);
    res.render('error', { message: 'Failed to load dashboard.' });
  }
};

module.exports = { showDashboard };
