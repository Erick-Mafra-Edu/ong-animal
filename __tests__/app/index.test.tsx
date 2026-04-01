import React from 'react';
import { render } from '@testing-library/react';
import Home from '../../app/index';
import { ThemeProvider } from '../../src/context/ThemeContext';

jest.mock('../../src/components/AnimalCard', () => ({
  __esModule: true,
  AnimalCard: function MockAnimalCard() {
    return <div data-testid="animal-card">Animal Card</div>;
  },
}));

describe('Home Route (index)', () => {
  it('renders tinder card screen', () => {
    const { getByTestId } = render(
      <ThemeProvider>
        <Home />
      </ThemeProvider>
    );
    expect(getByTestId('animal-card')).toBeInTheDocument();
  });

  it('renders animal card section', () => {
    const { getByTestId } = render(
      <ThemeProvider>
        <Home />
      </ThemeProvider>
    );
    expect(getByTestId('animal-card')).toBeInTheDocument();
  });
});
