// Mock jsx-runtime for react-native-css-interop (used by nativewind transforms)
const React = require('react');
const reactJsxRuntime = require('react/jsx-runtime');

module.exports = {
  ...reactJsxRuntime,
  Fragment: React.Fragment,
  jsx: reactJsxRuntime.jsx,
  jsxs: reactJsxRuntime.jsxs,
  createElement: React.createElement,
  createInteropElement: React.createElement,
};
