// Pre-define all properties that expo/src/winter/runtime.native.ts tries to polyfill
// This prevents it from installing lazy getters that load native files in the test environment
const propsToPreDefine = [
  '__ExpoImportMetaRegistry',
  'structuredClone',
  'TextDecoderStream',
  'TextEncoderStream',
  'URL',
  'URLSearchParams',
  'TextDecoder',
];

propsToPreDefine.forEach(function(prop) {
  const existing = Object.getOwnPropertyDescriptor(globalThis, prop);
  if (!existing || existing.configurable) {
    const value = existing && existing.value ? existing.value : function() {};
    Object.defineProperty(globalThis, prop, {
      value: value,
      writable: true,
      configurable: false,  // Make non-configurable so expo won't override
      enumerable: false,
    });
  }
});
