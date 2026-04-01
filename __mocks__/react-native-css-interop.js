// Mock for react-native-css-interop (used by nativewind)
const React = require('react');

const remapProps = (Component, mapping) => Component;
const cssInterop = (Component, mapping) => Component;
const useColorScheme = () => ({ colorScheme: 'light', setColorScheme: () => {} });
const StyleSheet = { create: (s) => s };

module.exports = {
  remapProps,
  cssInterop,
  useColorScheme,
  StyleSheet,
  default: { remapProps, cssInterop },
};
