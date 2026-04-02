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
jest.mock('react-native', () => {
  const toDataTestId = (props: any) => {
    const result = { ...props };
    if (result.testID) {
      result['data-testid'] = result.testID;
      delete result.testID;
    }
    return result;
  };

  return {
    View: ({ children, testID, ...props }: any) => (
      <div {...toDataTestId({ testID, ...props })} role="generic">
        {children}
      </div>
    ),
    Text: ({ children, testID, ...props }: any) => (
      <span {...toDataTestId({ testID, ...props })} role="textbox">
        {children}
      </span>
    ),
    Pressable: ({ children, onPress, testID, ...props }: any) => (
      <button {...toDataTestId({ testID, ...props })} onClick={onPress} role="button">
        {children}
      </button>
    ),
    Image: ({ source, testID, ...props }: any) => (
      <img {...toDataTestId({ testID, ...props })} src={source?.uri} alt="image" />
    ),
    ScrollView: ({ children, testID, ...props }: any) => (
      <div {...toDataTestId({ testID, ...props })} role="generic">
        {children}
      </div>
    ),
    TextInput: ({
      testID,
      onChangeText,
      placeholderTextColor,
      keyboardType,
      secureTextEntry,
      autoCapitalize,
      ...props
    }: any) => (
      <input
        {...toDataTestId({ testID, ...props })}
        onChange={(event: any) => onChangeText?.(event.target.value)}
      />
    ),
    TouchableOpacity: ({ children, onPress, testID, ...props }: any) => (
      <button {...toDataTestId({ testID, ...props })} onClick={onPress} role="button">
        {children}
      </button>
    ),
    ActivityIndicator: ({ testID }: any) => (
      <div data-testid={testID} role="progressbar" />
    ),
    FlatList: ({ data, renderItem, keyExtractor, testID, ...props }: any) => (
      <div {...toDataTestId({ testID, ...props })} role="list">
        {(data ?? []).map((item: any, index: number) =>
          renderItem({ item, index })
        )}
      </div>
    ),
    Modal: ({ children, visible, testID }: any) =>
      visible ? <div data-testid={testID}>{children}</div> : null,
    Platform: {
      OS: 'web',
      select: (obj: any) => obj.web ?? obj.default,
    },
    useColorScheme: () => 'dark',
    StyleSheet: {
      create: (styles: any) => styles,
    },
  };
});

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
  const MockIcon = ({ testID }: any) => (
    <span data-testid={testID} role="img" />
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
