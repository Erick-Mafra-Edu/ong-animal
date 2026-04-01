/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/e2e/**/*.test.ts'],
  transform: {
    '^.+\\.tsx?$': ['@swc/jest', {
      jsc: {
        parser: { syntax: 'typescript', tsx: false },
        target: 'es2018',
      },
    }],
  },
  testTimeout: 120_000,
  // Run E2E tests serially to avoid port conflicts
  maxWorkers: 1,
};
