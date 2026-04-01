import React from 'react';
import { render } from '@testing-library/react';
import { Text, View } from 'react-native';
import DarkTheme from '../../src/app/screens/DarkTheme';

// Mock do router
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Mock do componente AnimalCard
jest.mock('../../src/app/components/AnimalCard', () => {
  return function MockAnimalCard() {
    return <View testID="animal-card">Animal Card</View>;
  };
});

describe('DarkTheme Screen', () => {
  it('renders header with title', () => {
    const { getByText } = render(<DarkTheme />);
    expect(getByText('Encontre seu novo amigo')).toBeTruthy();
  });

  it('renders subtitle text', () => {
    const { getByText } = render(<DarkTheme />);
    expect(getByText('Deslize para conhecer animais incríveis')).toBeTruthy();
  });

  it('renders animal cards', () => {
    const { getByTestId } = render(<DarkTheme />);
    expect(getByTestId('animal-card')).toBeTruthy();
  });

  it('has theme toggle button', () => {
    const { container } = render(<DarkTheme />);
    const pressables = container.querySelectorAll('[role="button"]');
    expect(pressables.length).toBeGreaterThan(0);
  });

  it('uses dark theme styles', () => {
    const { container } = render(<DarkTheme />);
    const darkView = container.querySelector('[style*="background-color"]');
    expect(darkView).toBeTruthy();
  });
});
