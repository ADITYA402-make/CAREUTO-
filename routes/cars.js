// routes/cars.js
const express = require('express');
const router = express.Router();
const { listCars, showAddCar, addCar, showEditCar, editCar, deleteCar } = require('../controllers/carController');
const { isAuthenticated } = require('../middleware/auth');

router.use(isAuthenticated); // All car routes require login

router.get('/', listCars);
router.get('/add', showAddCar);
router.post('/add', addCar);
router.get('/:id/edit', showEditCar);
router.post('/:id/edit', editCar);
router.post('/:id/delete', deleteCar);

module.exports = router;
