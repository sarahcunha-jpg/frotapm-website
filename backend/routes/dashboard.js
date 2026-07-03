const express = require('express');
const router = express.Router();

// GET dashboard indicators
router.get('/indicadores', (req, res) => {
    // TODO: Fetch dashboard indicators
    // - Total vehicles
    // - Operational vehicles
    // - Vehicles in maintenance
    // - Preventive maintenance
    // - Corrective maintenance
    // - Total maintenance cost
    // - Upcoming reviews
    res.json({ message: 'GET /dashboard/indicadores' });
});

// GET dashboard charts
router.get('/graficos', (req, res) => {
    // TODO: Fetch dashboard charts data
    // - Maintenance per month
    // - Costs per month
    // - Fleet availability
    // - Distribution by maintenance type
    res.json({ message: 'GET /dashboard/graficos' });
});

module.exports = router;