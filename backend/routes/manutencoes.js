const express = require('express');
const router = express.Router();

// GET all maintenance orders
router.get('/', (req, res) => {
    // TODO: Fetch all maintenance orders from database
    res.json({ message: 'GET /manutencoes' });
});

// GET maintenance order by ID
router.get('/:id', (req, res) => {
    // TODO: Fetch maintenance order by ID
    res.json({ message: 'GET /manutencoes/:id' });
});

// POST - Create new maintenance order
router.post('/', (req, res) => {
    // TODO: Validate and create new maintenance order
    res.json({ message: 'POST /manutencoes' });
});

// PUT - Update maintenance order
router.put('/:id', (req, res) => {
    // TODO: Update maintenance order
    res.json({ message: 'PUT /manutencoes/:id' });
});

// DELETE - Remove maintenance order
router.delete('/:id', (req, res) => {
    // TODO: Delete maintenance order
    res.json({ message: 'DELETE /manutencoes/:id' });
});

module.exports = router;