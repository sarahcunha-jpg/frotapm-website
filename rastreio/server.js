// name=rastreio/server.js
require('dotenv').config();
const express = require('express');
const http = require('http');
const { v4: uuidv4 } = require('uuid');
const socketIo = require('socket.io');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');

const app = express();
app.use(bodyParser.json());

const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: '*' } });

// MySQL pool (configure via .env)
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10
});

// Socket: salas por viatura (v:{id})
io.on('connection', socket => {
  console.log('cliente conectado', socket.id);
  socket.on('subscribe', ({ viaturas }) => {
    if (Array.isArray(viaturas)) viaturas.forEach(id => socket.join(`v:${id}`));
  });
  socket.on('unsubscribe', ({ viaturas }) => {
    if (Array.isArray(viaturas)) viaturas.forEach(id => socket.leave(`v:${id}`));
  });
});

// Simple device token middleware (optional but recommended)
function verifyDeviceToken(req, res, next) {
  const token = req.headers['x-device-token'] || req.query.token;
  if (!process.env.DEVICE_TOKEN) return next(); // no token configured
  if (!token || token !== process.env.DEVICE_TOKEN) return res.status(401).json({ error: 'device token inválido' });
  next();
}

// Recebe posição do tracker
app.post('/api/rastreio', verifyDeviceToken, async (req, res) => {
  try {
    const { viatura_id, latitude, longitude, velocidade, heading, data_hora } = req.body;
    if (!viatura_id || latitude === undefined || longitude === undefined) return res.status(400).json({ error: 'dados incompletos' });

    const id = uuidv4();
    const ts = data_hora ? new Date(data_hora) : new Date();

    await pool.query(
      `INSERT INTO rastreamento (id, viatura_id, latitude, longitude, velocidade, heading, data_hora, origem)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, viatura_id, latitude, longitude, velocidade || null, heading || null, ts, 'gps']
    );

    const payload = { viatura_id, latitude, longitude, velocidade, heading, data_hora: ts.toISOString() };
    io.to(`v:${viatura_id}`).emit('posicao:update', payload);
    io.emit('posicao:update', payload); // opcional: broadcast global

    res.status(201).json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'erro servidor' });
  }
});

app.get('/health', (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`rastreio server rodando na porta ${PORT}`));
