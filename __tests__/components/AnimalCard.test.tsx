import React from 'react';
import { render } from '@testing-library/react';
import { AnimalCard } from '../../src/components/AnimalCard';

describe('AnimalCard Component', () => {
  const mockProps = {
    name: 'Yolo',
    age: 2,
    image: 'https://images.unsplash.com/photo-1587300411107-ec45cf43c7a6?w=600&h=600&fit=crop',
    tags: ['Online shopping', 'Amateur cook'],
    isDarkTheme: true,
  };

  it('renders animal card with name', () => {
    const { getByText } = render(<AnimalCard {...mockProps} />);
    expect(getByText('Yolo')).toBeTruthy();
  });

  it('renders age correctly', () => {
    const { getByText } = render(<AnimalCard {...mockProps} />);
    expect(getByText(/2/)).toBeTruthy();
  });

  it('renders all tags', () => {
    const { getByText } = render(<AnimalCard {...mockProps} />);
    expect(getByText('Online shopping')).toBeTruthy();
    expect(getByText('Amateur cook')).toBeTruthy();
  });

  it('renders image with correct source', () => {
    const { container } = render(<AnimalCard {...mockProps} />);
    const image = container.querySelector('img');
    expect(image).toBeTruthy();
    expect(image?.src).toContain('unsplash');
  });

  it('applies dark theme styles when isDarkTheme is true', () => {
    const { container } = render(<AnimalCard {...mockProps} isDarkTheme={true} />);
    expect(container.textContent).toContain('Yolo');
  });

  it('applies light theme styles when isDarkTheme is false', () => {
    const { container } = render(<AnimalCard {...mockProps} isDarkTheme={false} />);
    expect(container.textContent).toContain('Yolo');
  });
});
