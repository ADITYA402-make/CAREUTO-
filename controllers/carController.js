// controllers/carController.js
// Handles all car CRUD operations

const db = require('../models/database');

// List all cars
const listCars = (req, res) => {
  const cars = db.prepare('SELECT * FROM cars WHERE user_id = ? ORDER BY created_at DESC').all(req.session.userId);
  res.render('cars/index', {
    title: 'My Cars - Auto Aid',
    userName: req.session.userName,
    cars,
    success: req.flash('success'),
    error: req.flash('error')
  });
};

// Show add car form
const showAddCar = (req, res) => {
  res.render('cars/add', {
    title: 'Add Car - Auto Aid',
    userName: req.session.userName,
    error: req.flash('error')
  });
};

// Handle add car form
const addCar = (req, res) => {
  try {
    const { car_name, model, number_plate, year, fuel_type } = req.body;

    if (!car_name || !model || !number_plate || !year || !fuel_type) {
      req.flash('error', 'All fields are required.');
      return res.redirect('/cars/add');
    }

    db.prepare(`
      INSERT INTO cars (user_id, car_name, model, number_plate, year, fuel_type)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(req.session.userId, car_name, model, number_plate.toUpperCase(), year, fuel_type);

    req.flash('success', `${car_name} added successfully!`);
    res.redirect('/cars');
  } catch (err) {
    console.error('Add car error:', err);
    req.flash('error', 'Failed to add car.');
    res.redirect('/cars/add');
  }
};

// Show edit car form
const showEditCar = (req, res) => {
  const car = db.prepare('SELECT * FROM cars WHERE id = ? AND user_id = ?').get(req.params.id, req.session.userId);
  if (!car) {
    req.flash('error', 'Car not found.');
    return res.redirect('/cars');
  }
  res.render('cars/edit', {
    title: 'Edit Car - Auto Aid',
    userName: req.session.userName,
    car,
    error: req.flash('error')
  });
};

// Handle edit car form
const editCar = (req, res) => {
  try {
    const { car_name, model, number_plate, year, fuel_type } = req.body;
    const carId = req.params.id;

    db.prepare(`
      UPDATE cars SET car_name=?, model=?, number_plate=?, year=?, fuel_type=?
      WHERE id=? AND user_id=?
    `).run(car_name, model, number_plate.toUpperCase(), year, fuel_type, carId, req.session.userId);

    req.flash('success', 'Car updated successfully!');
    res.redirect('/cars');
  } catch (err) {
    console.error('Edit car error:', err);
    req.flash('error', 'Failed to update car.');
    res.redirect(`/cars/${req.params.id}/edit`);
  }
};

// Delete car
const deleteCar = (req, res) => {
  try {
    db.prepare('DELETE FROM cars WHERE id = ? AND user_id = ?').run(req.params.id, req.session.userId);
    req.flash('success', 'Car deleted successfully.');
    res.redirect('/cars');
  } catch (err) {
    console.error('Delete car error:', err);
    req.flash('error', 'Failed to delete car.');
    res.redirect('/cars');
  }
};

module.exports = { listCars, showAddCar, addCar, showEditCar, editCar, deleteCar };
