const express = require('express');
const router = express.Router();

// GET all vehicles
router.get('/', (req, res) => {
    // TODO: Fetch all vehicles from database
    res.json({ message: 'GET /viaturas' });
});

// GET vehicle by ID
router.get('/:id', (req, res) => {
    // TODO: Fetch vehicle by ID
    res.json({ message: 'GET /viaturas/:id' });
});

// POST - Create new vehicle
router.post('/', (req, res) => {
    // TODO: Validate and create new vehicle
    res.json({ message: 'POST /viaturas' });
});

// PUT - Update vehicle
router.put('/:id', (req, res) => {
    // TODO: Update vehicle
    res.json({ message: 'PUT /viaturas/:id' });
});

// DELETE - Remove vehicle
router.delete('/:id', (req, res) => {
    // TODO: Delete vehicle
    res.json({ message: 'DELETE /viaturas/:id' });
});

module.exports = router;