import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react';

const mockPush = jest.fn();
const mockGetUser = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: jest.fn(() => ({ push: mockPush, back: jest.fn() })),
}));

const buildChain = (result: any) => {
  const chain: any = {};
  chain.select = jest.fn().mockReturnValue(chain);
  chain.eq = jest.fn().mockReturnValue(chain);
  chain.in = jest.fn().mockReturnValue(chain);
  chain.order = jest.fn().mockReturnValue(chain);
  // Make the chain thenable so await works
  chain.then = (resolve: any, reject: any) => Promise.resolve(result).then(resolve, reject);
  return chain;
};

let fromCallCount = 0;
let fromResponses: any[] = [];
const mockFrom = jest.fn(() => {
  const response = fromResponses[fromCallCount] ?? { data: [], error: null };
  fromCallCount++;
  return buildChain(response);
});

jest.mock('../../services/supabase', () => ({
  supabase: {
    auth: {
      getUser: (...args: unknown[]) => mockGetUser(...args),
    },
    from: (...args: unknown[]) => mockFrom(...args),
  },
}));

import Conversas from '../../app/(tabs)/conversas';

describe('Conversas Screen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    fromCallCount = 0;
    fromResponses = [];
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } });
  });

  it('shows loading state initially', () => {
    mockGetUser.mockReturnValue(new Promise(() => {}));
    const { getByText } = render(<Conversas />);
    expect(getByText('Carregando conversas...')).toBeTruthy();
  });

  it('shows empty state when no approved matches', async () => {
    fromResponses = [{ data: [], error: null }];

    const { getByText } = render(<Conversas />);
    await waitFor(() => {
      expect(getByText('Nenhuma conversa ainda')).toBeTruthy();
    });
  });

  it('renders conversation list with approved matches', async () => {
    const mockMatches = [
      { id: 'match-1', user_id: 'user-1', animal_id: 'animal-1', status: 'aprovado', created_at: '' },
    ];
    const mockAnimals = [
      { id: 'animal-1', nome: 'Rex', tipo: 'cachorro', porte: 'médio', foto_url: '', status: 'disponivel', ong_id: 'ong-1', idade: '2 anos', nivel_energia: 'alto', descricao: '', created_at: '' },
    ];

    fromResponses = [
      { data: mockMatches },
      { data: mockAnimals },
    ];

    const { getByText } = render(<Conversas />);
    await waitFor(() => {
      expect(getByText('Rex')).toBeTruthy();
    });
  });

  it('navigates to chat when conversation is pressed', async () => {
    const mockMatches = [
      { id: 'match-1', user_id: 'user-1', animal_id: 'animal-1', status: 'aprovado', created_at: '' },
    ];
    const mockAnimals = [
      { id: 'animal-1', nome: 'Rex', tipo: 'cachorro', porte: 'médio', foto_url: '', status: 'disponivel', ong_id: 'ong-1', idade: '2 anos', nivel_energia: 'alto', descricao: '', created_at: '' },
    ];

    fromResponses = [
      { data: mockMatches },
      { data: mockAnimals },
    ];

    const { getByTestId } = render(<Conversas />);
    await waitFor(() => {
      expect(getByTestId('conversa-match-1')).toBeTruthy();
    });

    fireEvent.click(getByTestId('conversa-match-1'));
    expect(mockPush).toHaveBeenCalledWith('/chat/match-1');
  });
});
