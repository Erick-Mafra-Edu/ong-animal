module.exports = {
  preset: 'jest-expo',
  testEnvironment: 'jsdom',
  setupFiles: ['<rootDir>/jest.setup-env.js'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  collectCoverageFrom: [
    'app/**/*.{ts,tsx}',
    'src/**/*.{ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^react-native-svg$': '<rootDir>/__mocks__/react-native-svg.js',
    '^lucide-react-native$': '<rootDir>/__mocks__/lucide-react-native.js',
    '^expo-router$': '<rootDir>/__mocks__/expo-router.js',
    '^react-native-css-interop/jsx-runtime$': '<rootDir>/__mocks__/react-native-css-interop-jsx-runtime.js',
    '^react-native-css-interop/jsx-dev-runtime$': '<rootDir>/__mocks__/react-native-css-interop-jsx-runtime.js',
    '^react-native-css-interop$': '<rootDir>/__mocks__/react-native-css-interop.js',
    '^react-native-css-interop/(.*)$': '<rootDir>/__mocks__/react-native-css-interop.js',
    '^nativewind$': '<rootDir>/__mocks__/nativewind.js',
    '\\.css$': '<rootDir>/__mocks__/fileMock.js',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|@react-native|expo|@expo|@unimodules|react-clone-referenced-element|@react-navigation|react-navigation)',
  ],
  globals: {
    'process.env': {
      EXPO_PUBLIC_SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://test.supabase.co',
      EXPO_PUBLIC_SUPABASE_KEY: process.env.EXPO_PUBLIC_SUPABASE_KEY || 'test-key',
    },
  },
  testPathIgnorePatterns: ['/node_modules/', '/__tests__/e2e/'],
};
