const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const store = require('./store');
const { registerHandlers } = require('./socketHandlers');
const { generateRoomCode } = require('./utils');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    methods: ['GET', 'POST']
  },
  pingInterval: 10000,
  pingTimeout: 5000
});

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime(), rooms: store.getRoomCount() });
});

// Generate room code
app.post('/api/rooms', (req, res) => {
  const roomId = generateRoomCode();
  res.json({ roomId });
});

// Get room info
app.get('/api/rooms/:roomId', (req, res) => {
  const room = store.getRoom(req.params.roomId);
  const users = store.getUsers(req.params.roomId);
  res.json({ exists: users.length > 0, userCount: users.length });
});

io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);
  registerHandlers(io, socket, store);
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`\n🚀 Whiteboard server running on http://localhost:${PORT}`);
  console.log(`📡 WebSocket ready for connections\n`);
});
