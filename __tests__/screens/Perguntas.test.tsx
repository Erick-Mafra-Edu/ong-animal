import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';

const mockReplace = jest.fn();
const mockUpsert = jest.fn();
const mockGetUser = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: jest.fn(() => ({
    replace: mockReplace,
    push: jest.fn(),
    back: jest.fn(),
  })),
}));

jest.mock('../../services/supabase', () => ({
  supabase: {
    auth: {
      getUser: (...args: unknown[]) => mockGetUser(...args),
    },
    from: jest.fn(() => ({
      upsert: (...args: unknown[]) => mockUpsert(...args),
    })),
  },
}));

import Perguntas from '../../app/(onboarding)/perguntas';

describe('Perguntas (Onboarding) Screen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetUser.mockResolvedValue({ data: { user: { id: 'test-user' } } });
    mockUpsert.mockResolvedValue({ error: null });
  });

  it('renders the first question', () => {
    const { getByTestId } = render(<Perguntas />);
    expect(getByTestId('pergunta-titulo')).toBeTruthy();
  });

  it('shows progress indicator', () => {
    const { getByText } = render(<Perguntas />);
    expect(getByText(/1 de /)).toBeTruthy();
  });

  it('renders answer options', () => {
    const { getByTestId } = render(<Perguntas />);
    // First question is about tipo_moradia with options casa/apartamento
    expect(getByTestId('opcao-casa')).toBeTruthy();
    expect(getByTestId('opcao-apartamento')).toBeTruthy();
  });

  it('renders the advance button', () => {
    const { getByTestId } = render(<Perguntas />);
    expect(getByTestId('avancar-button')).toBeTruthy();
  });

  it('allows selecting an answer option', () => {
    const { getByTestId } = render(<Perguntas />);
    fireEvent.click(getByTestId('opcao-casa'));
    // Button should become enabled (no disabled attribute)
    const btn = getByTestId('avancar-button');
    expect(btn).toBeTruthy();
  });

  it('completes onboarding and saves preferences', async () => {
    const { getByTestId } = render(<Perguntas />);

    const respostasPorEtapa = [
      'casa',
      'true',
      'moderado',
      'medio',
      'sim',
      'cachorro',
      'medio',
      'adulto',
    ];

    respostasPorEtapa.forEach((valor) => {
      fireEvent.click(getByTestId(`opcao-${valor}`));
      fireEvent.click(getByTestId('avancar-button'));
    });

    await waitFor(() => {
      expect(mockGetUser).toHaveBeenCalled();
      expect(mockUpsert).toHaveBeenCalledWith({
        user_id: 'test-user',
        tipo_moradia: 'casa',
        tem_criancas: true,
        tempo_para_brincar: 'moderado',
        nivel_atividade: 'medio',
        experiencia_animais: 'sim',
        prefere_tipo: 'cachorro',
        prefere_porte: 'medio',
        prefere_idade: 'adulto',
      });
      expect(mockReplace).toHaveBeenCalledWith('/(tabs)/swipe');
    });
  });
});
