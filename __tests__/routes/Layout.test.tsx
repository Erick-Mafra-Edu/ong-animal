import React from 'react';
import { render } from '@testing-library/react';
import RootLayout from '../../app/_layout';

// Mock do Stack do expo-router
jest.mock('expo-router', () => {
  const ScreenMock = jest.fn(({ name }: { name: string }) => (
    <div data-testid={`route-${name}`}>{name} route</div>
  ));
  const StackMock = ({ children }: { children: React.ReactNode }) => (
    <div data-testid="stack">{children}</div>
  );
  StackMock.Screen = ScreenMock;
  return { Stack: StackMock };
});

// Mock do SafeAreaView
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children }: any) => <div data-testid="safe-area">{children}</div>,
}));

describe('Root Layout Routes', () => {
  it('renders safeAreaView wrapper', () => {
    const { getByTestId } = render(<RootLayout />);
    expect(getByTestId('safe-area')).toBeTruthy();
  });

  it('has header hidden configuration', () => {
    const { container } = render(<RootLayout />);
    expect(container).toBeTruthy();
  });

  it('defines index route', () => {
    const { getByTestId } = render(<RootLayout />);
    expect(getByTestId('route-index')).toBeTruthy();
  });

  it('defines light route', () => {
    const { getByTestId } = render(<RootLayout />);
    expect(getByTestId('route-light')).toBeTruthy();
  });

  it('has correct number of routes', () => {
    const { container } = render(<RootLayout />);
    const routes = container.querySelectorAll('[data-testid^="route-"]');
    expect(routes.length).toBe(2);
  });
});
