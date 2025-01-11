const crypto = require('crypto');

function createBlock(chain, transactions) {
    const previousHash = chain.length ? chain[chain.length - 1].hash : '0';
    const block = {
      index: chain.length + 1,
      timestamp: Date.now(),
      transactions,
      previousHash,
      nonce: 0,
    };

    block.hash = calculateHash(block);
    while (!block.hash.startsWith('0000')) {
      block.nonce++;
      block.hash = calculateHash(block);
    }

    return block;
  }

  // Validate a block
  function validateBlock(block, chain) {
    const lastBlock = chain[chain.length - 1];
    if (
      (!lastBlock || block.previousHash === lastBlock.hash) &&
      block.hash === calculateHash(block) &&
      block.hash.startsWith('0000')
    ) {
      return true;
    }
    return false;
  }

  // Calculate hash for a block
  function calculateHash(block) {
    return crypto.createHash('sha256').update(JSON.stringify(block)).digest('hex');
  }

  module.exports = { createBlock, validateBlock, calculateHash };