import React from 'react';
import { render, waitFor } from '@testing-library/react';

const mockPush = jest.fn();
const mockGetUser = jest.fn();
const mockFrom = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: jest.fn(() => ({
    push: mockPush,
    replace: jest.fn(),
    back: jest.fn(),
  })),
}));

jest.mock('../../services/supabase', () => ({
  supabase: {
    auth: {
      getUser: (...args: unknown[]) => mockGetUser(...args),
    },
    from: (...args: unknown[]) => mockFrom(...args),
  },
}));

import Dashboard from '../../app/(ong)/dashboard';

const buildSelectChain = (data: unknown[], count?: number) => {
  const chain: Record<string, jest.Mock> = {};
  chain.select = jest.fn(() => chain);
  chain.eq = jest.fn(() => chain);
  chain.in = jest.fn(() => chain);
  chain.then = jest.fn((resolve: (value: unknown) => unknown) =>
    resolve({ data, count: count ?? 0, error: null })
  );
  return chain;
};

describe('Dashboard ONG', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetUser.mockResolvedValue({ data: { user: { id: 'ong-id-1' } } });

    mockFrom.mockImplementation((table: string) => {
      if (table === 'animals') {
        return buildSelectChain([
          { id: 'a1', status: 'disponivel' },
          { id: 'a2', status: 'adotado' },
        ]);
      }
      if (table === 'matches') {
        return buildSelectChain([], 1);
      }
      return buildSelectChain([]);
    });
  });

  it('renders the dashboard heading', () => {
    const { getByText } = render(<Dashboard />);
    expect(getByText('Painel da ONG 🏢')).toBeTruthy();
  });

  it('renders all four stat cards', () => {
    const { getByTestId } = render(<Dashboard />);
    expect(getByTestId('stat-total')).toBeTruthy();
    expect(getByTestId('stat-disponiveis')).toBeTruthy();
    expect(getByTestId('stat-adotados')).toBeTruthy();
    expect(getByTestId('stat-interessados')).toBeTruthy();
  });

  it('renders the register animal quick action button', () => {
    const { getByTestId } = render(<Dashboard />);
    expect(getByTestId('cadastrar-animal-btn')).toBeTruthy();
  });

  it('renders the interessados quick action button', () => {
    const { getByTestId } = render(<Dashboard />);
    expect(getByTestId('ver-interessados-btn')).toBeTruthy();
  });

  it('navigates to cadastrar-animal when button is pressed', () => {
    const { getByTestId } = render(<Dashboard />);
    getByTestId('cadastrar-animal-btn').click();
    expect(mockPush).toHaveBeenCalledWith('/(ong)/cadastrar-animal');
  });

  it('navigates to interessados when button is pressed', () => {
    const { getByTestId } = render(<Dashboard />);
    getByTestId('ver-interessados-btn').click();
    expect(mockPush).toHaveBeenCalledWith('/(ong)/interessados');
  });

  it('loads and displays stats after mount', async () => {
    const { getByTestId } = render(<Dashboard />);
    await waitFor(() => {
      expect(mockGetUser).toHaveBeenCalled();
    });
    expect(getByTestId('stat-total')).toBeTruthy();
  });
});
