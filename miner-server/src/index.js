const WebSocket = require('ws');
const { createBlock, validateBlock, calculateHash } = require('./blockchain');

const CENTRAL_SERVER_URL = 'ws://localhost:8080';
let blockchain = [];
const transactions = [];

// Connect to the central server
const ws = new WebSocket(CENTRAL_SERVER_URL);
ws.on('open', () => console.log('Connected to central server'));
ws.on('message', (data) => handleMessage(JSON.parse(data)));

// Handle incoming messages
function handleMessage(message) {
  if (message.type === 'block') {
    validateAndAddBlock(message.block);
  } else if (message.type === 'transaction') {
    transactions.push(message.transaction);
  }
}

// Mining logic
//TODO: Implement the mineBlock function that creates a new block and sends it to the central server.
function mineBlock() {
  const newBlock = createBlock(blockchain, transactions);
  blockchain.push(newBlock);
  console.log('New block mined:', newBlock);

  ws.send(JSON.stringify({ type: 'block', block: newBlock }));
  transactions.length = 0; // Clear transactions
}

function validateAndAddBlock(block) {
  if (validateBlock(block, blockchain)) {
    blockchain.push(block);
    console.log('Block added:', block);
  } else {
    console.error('Invalid block received');
  }
}

// Start mining every 10 seconds
// taking 10 sec as a temp case 
setInterval(mineBlock, 10000);
