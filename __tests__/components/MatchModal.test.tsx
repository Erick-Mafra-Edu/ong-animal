import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MatchModal } from '../../src/components/MatchModal';

describe('MatchModal Component', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders when visible is true', () => {
    const { getByTestId } = render(
      <MatchModal
        visible={true}
        animalNome="Yolo"
        animalFoto="https://example.com/foto.jpg"
        onClose={mockOnClose}
      />
    );
    expect(getByTestId('match-modal')).toBeTruthy();
  });

  it('does not render when visible is false', () => {
    const { queryByTestId } = render(
      <MatchModal
        visible={false}
        animalNome="Yolo"
        animalFoto=""
        onClose={mockOnClose}
      />
    );
    expect(queryByTestId('match-modal')).toBeNull();
  });

  it('displays animal name', () => {
    const { getByText } = render(
      <MatchModal
        visible={true}
        animalNome="Yolo"
        animalFoto=""
        onClose={mockOnClose}
      />
    );
    expect(getByText('Yolo')).toBeTruthy();
  });

  it('calls onClose when close button is pressed', () => {
    const { getByTestId } = render(
      <MatchModal
        visible={true}
        animalNome="Yolo"
        animalFoto=""
        onClose={mockOnClose}
      />
    );
    fireEvent.click(getByTestId('match-close-button'));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});

