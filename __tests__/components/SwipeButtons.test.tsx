import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { SwipeButtons } from '../../src/components/SwipeButtons';

describe('SwipeButtons Component', () => {
  const mockOnReject = jest.fn();
  const mockOnLike = jest.fn();
  const mockOnInfo = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders reject, like, and info buttons', () => {
    const { getByTestId } = render(
      <SwipeButtons onReject={mockOnReject} onLike={mockOnLike} onInfo={mockOnInfo} />
    );
    expect(getByTestId('reject-button')).toBeTruthy();
    expect(getByTestId('like-button')).toBeTruthy();
    expect(getByTestId('info-button')).toBeTruthy();
  });

  it('calls onReject when reject button is pressed', () => {
    const { getByTestId } = render(
      <SwipeButtons onReject={mockOnReject} onLike={mockOnLike} onInfo={mockOnInfo} />
    );
    fireEvent.click(getByTestId('reject-button'));
    expect(mockOnReject).toHaveBeenCalledTimes(1);
  });

  it('calls onLike when like button is pressed', () => {
    const { getByTestId } = render(
      <SwipeButtons onReject={mockOnReject} onLike={mockOnLike} onInfo={mockOnInfo} />
    );
    fireEvent.click(getByTestId('like-button'));
    expect(mockOnLike).toHaveBeenCalledTimes(1);
  });

  it('calls onInfo when info button is pressed', () => {
    const { getByTestId } = render(
      <SwipeButtons onReject={mockOnReject} onLike={mockOnLike} onInfo={mockOnInfo} />
    );
    fireEvent.click(getByTestId('info-button'));
    expect(mockOnInfo).toHaveBeenCalledTimes(1);
  });
});
