// controllers/serviceController.js
// Handles service record operations

const db = require('../models/database');

// List all service records
const listServices = (req, res) => {
  const services = db.prepare(`
    SELECT s.*, c.car_name, c.number_plate 
    FROM services s 
    JOIN cars c ON s.car_id = c.id 
    WHERE s.user_id = ? 
    ORDER BY s.service_date DESC
  `).all(req.session.userId);

  const cars = db.prepare('SELECT * FROM cars WHERE user_id = ?').all(req.session.userId);

  res.render('services/index', {
    title: 'Service Records - Auto Aid',
    userName: req.session.userName,
    services,
    cars,
    success: req.flash('success'),
    error: req.flash('error')
  });
};

// Show add service form
const showAddService = (req, res) => {
  const cars = db.prepare('SELECT * FROM cars WHERE user_id = ?').all(req.session.userId);
  if (cars.length === 0) {
    req.flash('error', 'Please add a car first before adding service records.');
    return res.redirect('/cars');
  }
  res.render('services/add', {
    title: 'Add Service - Auto Aid',
    userName: req.session.userName,
    cars,
    selectedCarId: req.query.car_id || '',
    error: req.flash('error')
  });
};

// Handle add service form
const addService = (req, res) => {
  try {
    const { car_id, service_date, description, cost, next_service_date } = req.body;

    if (!car_id || !service_date || !description || !cost) {
      req.flash('error', 'All required fields must be filled.');
      return res.redirect('/services/add');
    }

    // Verify the car belongs to this user
    const car = db.prepare('SELECT id FROM cars WHERE id = ? AND user_id = ?').get(car_id, req.session.userId);
    if (!car) {
      req.flash('error', 'Invalid car selected.');
      return res.redirect('/services/add');
    }

    db.prepare(`
      INSERT INTO services (car_id, user_id, service_date, description, cost, next_service_date)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(car_id, req.session.userId, service_date, description, parseFloat(cost), next_service_date || null);

    req.flash('success', 'Service record added successfully!');
    res.redirect('/services');
  } catch (err) {
    console.error('Add service error:', err);
    req.flash('error', 'Failed to add service record.');
    res.redirect('/services/add');
  }
};

// Delete service record
const deleteService = (req, res) => {
  try {
    db.prepare('DELETE FROM services WHERE id = ? AND user_id = ?').run(req.params.id, req.session.userId);
    req.flash('success', 'Service record deleted.');
    res.redirect('/services');
  } catch (err) {
    console.error('Delete service error:', err);
    req.flash('error', 'Failed to delete service record.');
    res.redirect('/services');
  }
};

module.exports = { listServices, showAddService, addService, deleteService };
