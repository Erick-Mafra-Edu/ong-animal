import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import HomeScreen from '../../src/screens/HomeScreen';
import { ThemeProvider } from '../../src/context/ThemeContext';

// Mock do componente AnimalCard
jest.mock('../../src/components/AnimalCard', () => ({
  __esModule: true,
  AnimalCard: function MockAnimalCard(props: { isDarkTheme?: boolean }) {
    return <div data-testid="animal-card">{String(props.isDarkTheme)}</div>;
  },
}));

describe('HomeScreen (tema automatico)', () => {
  it('renders main card content', () => {
    const { getByTestId } = render(
      <ThemeProvider>
        <HomeScreen />
      </ThemeProvider>
    );
    expect(getByTestId('animal-card')).toBeTruthy();
  });

  it('renders action buttons', () => {
    const { getByTestId } = render(
      <ThemeProvider>
        <HomeScreen />
      </ThemeProvider>
    );
    expect(getByTestId('theme-toggle')).toBeTruthy();
  });

  it('renders animal card with dark theme by default', () => {
    const { getByTestId } = render(
      <ThemeProvider>
        <HomeScreen />
      </ThemeProvider>
    );
    expect(getByTestId('animal-card').textContent).toBe('true');
  });

  it('toggles theme on user interaction', () => {
    const { container, getByTestId } = render(
      <ThemeProvider>
        <HomeScreen />
      </ThemeProvider>
    );

    const toggle = container.querySelector('button');
    expect(toggle).toBeTruthy();

    fireEvent.click(toggle as Element);
    expect(getByTestId('animal-card').textContent).toBe('false');
  });
});
