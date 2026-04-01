import React from 'react';
import { render } from '@testing-library/react';
import Home from '../../app/index';

// Mock do componente DarkTheme
jest.mock('../../src/app/screens/DarkTheme', () => {
  return function DefaultMock() {
    return <div>Mocked Dark Theme</div>;
  };
});

describe('Home Route (index)', () => {
  it('renders without crashing', () => {
    const { getByText } = render(<Home />);
    expect(getByText('Mocked Dark Theme')).toBeInTheDocument();
  });

  it('renders a View component as container', () => {
    const { container } = render(<Home />);
    expect(container.firstChild).toBeTruthy();
  });
});
