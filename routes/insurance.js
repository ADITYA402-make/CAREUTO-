// routes/insurance.js
const express = require('express');
const router = express.Router();
const { listInsurance, showAddInsurance, addInsurance, deleteInsurance } = require('../controllers/insuranceController');
const { isAuthenticated } = require('../middleware/auth');

router.use(isAuthenticated);

router.get('/', listInsurance);
router.get('/add', showAddInsurance);
router.post('/add', addInsurance);
router.post('/:id/delete', deleteInsurance);

module.exports = router;
