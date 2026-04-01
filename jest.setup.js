import '@testing-library/jest-dom';

// Mock do react-native
jest.mock('react-native', () => ({
  View: ({ children, ...props }: any) => (
    <div {...props} role="generic">
      {children}
    </div>
  ),
  Text: ({ children, ...props }: any) => (
    <span {...props} role="textbox">
      {children}
    </span>
  ),
  Pressable: ({ children, onPress, ...props }: any) => (
    <button {...props} onClick={onPress} role="button">
      {children}
    </button>
  ),
  Image: ({ source, ...props }: any) => (
    <img {...props} src={source?.uri} alt="image" />
  ),
}));

// Suprimir warnings desnecessários
const originalWarn = console.warn;
console.warn = (...args: any[]) => {
  if (
    typeof args[0] === 'string' &&
    (args[0].includes('ViewPropTypes') ||
      args[0].includes('Non-serializable') ||
      args[0].includes('componentWillReceiveProps'))
  ) {
    return;
  }
  originalWarn(...args);
};
