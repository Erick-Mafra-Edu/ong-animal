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
jest.mock('../../src/app/components/AnimalCard', () => ({
  __esModule: true,
  AnimalCard: function MockAnimalCard() {
    return <div data-testid="animal-card">Animal Card</div>;
  },
}));

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
    // DarkTheme uses bg-gray-900 class for dark background
    const darkView = container.querySelector('.bg-gray-900, [className*="bg-gray-9"]');
    expect(container.innerHTML).toContain('bg-gray-9');
  });
});
