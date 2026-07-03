// Backend server entry point
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Frota PM Backend is running' });
});

// TODO: Import routes
// - Viaturas routes
// - Manutenções routes
// - Dashboard routes
// - Usuários routes

app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
});