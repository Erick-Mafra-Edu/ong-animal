/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/integration/**/*.test.ts'],
  transform: {
    '^.+\\.tsx?$': ['@swc/jest', {
      jsc: {
        parser: { syntax: 'typescript', tsx: false },
        target: 'es2018',
      },
    }],
  },
  setupFiles: ['<rootDir>/jest.integration.setup.js'],
  testTimeout: 30000,
};
