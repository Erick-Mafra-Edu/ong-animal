// Mock for socket.io-client
const mockSocket = {
  connected: true,
  on: jest.fn(),
  off: jest.fn(),
  emit: jest.fn(),
  disconnect: jest.fn(),
};

const io = jest.fn(() => mockSocket);

module.exports = { io, mockSocket };
