// Mock for nativewind
const cssInterop = (Component) => Component;
const remapProps = (Component, mapping) => Component;
const useColorScheme = () => ({ colorScheme: 'light', setColorScheme: () => {} });
const vars = () => ({});
const withExpoSnack = (Component) => Component;
const styled = (Component) => Component;

module.exports = {
  cssInterop,
  remapProps,
  useColorScheme,
  vars,
  withExpoSnack,
  styled,
  default: { cssInterop, remapProps },
};
