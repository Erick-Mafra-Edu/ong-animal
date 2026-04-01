import '@testing-library/jest-dom';

// Polyfill TextDecoderStream and TextEncoderStream to prevent expo polyfill from
// loading native modules in jsdom environment
if (typeof globalThis.TextDecoderStream === 'undefined') {
  // @ts-ignore
  globalThis.TextDecoderStream = class TextDecoderStream {
    constructor() {}
  };
}
if (typeof globalThis.TextEncoderStream === 'undefined') {
  // @ts-ignore
  globalThis.TextEncoderStream = class TextEncoderStream {
    constructor() {}
  };
}

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
  ScrollView: ({ children, ...props }: any) => (
    <div {...props} role="generic">
      {children}
    </div>
  ),
  TextInput: ({ ...props }: any) => (
    <input {...props} />
  ),
  TouchableOpacity: ({ children, onPress, ...props }: any) => (
    <button {...props} onClick={onPress} role="button">
      {children}
    </button>
  ),
  ActivityIndicator: () => <div role="progressbar" />,
  Platform: {
    OS: 'web',
    select: (obj: any) => obj.web || obj.default,
  },
  StyleSheet: {
    create: (styles: any) => styles,
  },
}));

// Mock do react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children }: any) => <div data-testid="safe-area">{children}</div>,
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

// Mock do react-native-svg
jest.mock('react-native-svg', () => ({
  Svg: ({ children }: any) => <svg>{children}</svg>,
  Path: (props: any) => <path {...props} />,
  Circle: (props: any) => <circle {...props} />,
  default: ({ children }: any) => <svg>{children}</svg>,
}));

// Mock do lucide-react-native
jest.mock('lucide-react-native', () => {
  const MockIcon = ({ testID, ...props }: any) => (
    <span data-testid={testID} role="img" {...props} />
  );
  return new Proxy(
    {},
    {
      get: (_target, prop) => {
        if (prop === '__esModule') return true;
        return MockIcon;
      },
    }
  );
});

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
