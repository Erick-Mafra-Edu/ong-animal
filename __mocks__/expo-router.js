const React = require('react');

const useRouter = jest.fn(() => ({
  push: jest.fn(),
  replace: jest.fn(),
  back: jest.fn(),
  canGoBack: jest.fn(() => false),
  setParams: jest.fn(),
}));

const useLocalSearchParams = jest.fn(() => ({}));
const useSegments = jest.fn(() => []);
const usePathname = jest.fn(() => '/');

const Link = ({ children, href, ...props }) =>
  React.createElement('a', { href, ...props }, children);

const Redirect = ({ href }) => React.createElement('div', { 'data-redirect': href });

const Stack = ({ children, screenOptions }) =>
  React.createElement('div', { 'data-testid': 'stack' }, children);

Stack.Screen = ({ name, ...props }) =>
  React.createElement('div', { 'data-testid': `route-${name}` }, `${name} route`);

const Tabs = ({ children }) =>
  React.createElement('div', { 'data-testid': 'tabs' }, children);

Tabs.Screen = ({ name, ...props }) =>
  React.createElement('div', { 'data-testid': `tab-${name}` }, `${name} tab`);

const Slot = () => React.createElement('div', { 'data-testid': 'slot' });

module.exports = {
  useRouter,
  useLocalSearchParams,
  useSegments,
  usePathname,
  Link,
  Redirect,
  Stack,
  Tabs,
  Slot,
};
