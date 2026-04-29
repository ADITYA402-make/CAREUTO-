// controllers/insuranceController.js
// Handles insurance record operations

const db = require('../models/database');

// List all insurance records
const listInsurance = (req, res) => {
  const records = db.prepare(`
    SELECT i.*, c.car_name, c.number_plate 
    FROM insurance i 
    JOIN cars c ON i.car_id = c.id 
    WHERE i.user_id = ? 
    ORDER BY i.expiry_date ASC
  `).all(req.session.userId);

  const today = new Date();
  const recordsWithStatus = records.map(ins => {
    const expiry = new Date(ins.expiry_date);
    const daysLeft = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
    return { ...ins, daysLeft, isExpired: daysLeft < 0, isWarning: daysLeft >= 0 && daysLeft <= 30 };
  });

  res.render('insurance/index', {
    title: 'Insurance - Auto Aid',
    userName: req.session.userName,
    records: recordsWithStatus,
    success: req.flash('success'),
    error: req.flash('error')
  });
};

// Show add insurance form
const showAddInsurance = (req, res) => {
  const cars = db.prepare('SELECT * FROM cars WHERE user_id = ?').all(req.session.userId);
  if (cars.length === 0) {
    req.flash('error', 'Please add a car first before adding insurance records.');
    return res.redirect('/cars');
  }
  res.render('insurance/add', {
    title: 'Add Insurance - Auto Aid',
    userName: req.session.userName,
    cars,
    error: req.flash('error')
  });
};

// Handle add insurance form
const addInsurance = (req, res) => {
  try {
    const { car_id, provider_name, policy_number, expiry_date } = req.body;

    if (!car_id || !provider_name || !policy_number || !expiry_date) {
      req.flash('error', 'All fields are required.');
      return res.redirect('/insurance/add');
    }

    const car = db.prepare('SELECT id FROM cars WHERE id = ? AND user_id = ?').get(car_id, req.session.userId);
    if (!car) {
      req.flash('error', 'Invalid car selected.');
      return res.redirect('/insurance/add');
    }

    db.prepare(`
      INSERT INTO insurance (car_id, user_id, provider_name, policy_number, expiry_date)
      VALUES (?, ?, ?, ?, ?)
    `).run(car_id, req.session.userId, provider_name, policy_number, expiry_date);

    req.flash('success', 'Insurance record added successfully!');
    res.redirect('/insurance');
  } catch (err) {
    console.error('Add insurance error:', err);
    req.flash('error', 'Failed to add insurance.');
    res.redirect('/insurance/add');
  }
};

// Delete insurance record
const deleteInsurance = (req, res) => {
  try {
    db.prepare('DELETE FROM insurance WHERE id = ? AND user_id = ?').run(req.params.id, req.session.userId);
    req.flash('success', 'Insurance record deleted.');
    res.redirect('/insurance');
  } catch (err) {
    console.error('Delete insurance error:', err);
    req.flash('error', 'Failed to delete record.');
    res.redirect('/insurance');
  }
};

module.exports = { listInsurance, showAddInsurance, addInsurance, deleteInsurance };
