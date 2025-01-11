const WebSocket = require('ws');

const PORT = 5000;
const miners = [];

// Create WebSocket server
const server = new WebSocket.Server({ port: PORT });
console.log(`Central server is running on ws://localhost:${PORT}`);

server.on('connection', (socket) => {
  console.log('Miner connected');
  miners.push(socket);

  socket.on('message', (message) => {
    console.log('Message received:', message);
    // Broadcast to all miners
    miners.forEach((miner) => {
      if (miner !== socket && miner.readyState === WebSocket.OPEN) {
        miner.send(message);
      }
    });
  });

  socket.on('close', () => {
    console.log('Miner disconnected');
    const index = miners.indexOf(socket);
    if (index !== -1) miners.splice(index, 1);
  });
});
