// Mock for expo/src/winter/installGlobal - prevents native module loading in tests
module.exports = {
  installGlobal: () => {},
};
