const { nanoid } = require('nanoid');

const COLOR_PALETTE = [
  '#6C5CE7',
  '#00B894',
  '#E17055',
  '#0984E3',
  '#FDCB6E',
  '#E84393',
  '#00CEC9',
  '#FF7675',
  '#A29BFE',
  '#55EFC4',
  '#FAB1A0',
  '#74B9FF'
];

function generateUserColor() {
  const randomIndex = Math.floor(Math.random() * COLOR_PALETTE.length);
  return COLOR_PALETTE[randomIndex];
}

function generateRoomCode() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let roomCode = '';
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    roomCode += characters.charAt(randomIndex);
  }
  return roomCode;
}

function createId() {
  return nanoid();
}

module.exports = {
  generateUserColor,
  generateRoomCode,
  createId
};
