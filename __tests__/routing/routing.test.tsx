import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import Home from '../../app/index';
import Login from '../../app/(auth)/login';
import { ThemeProvider } from '../../src/context/ThemeContext';

const mockPush = jest.fn();
const mockReplace = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
  }),
}));

jest.mock('../../services/supabase', () => ({
  supabase: {
    auth: {
      signInWithPassword: jest.fn(() => Promise.resolve({ error: null })),
    },
  },
}));

jest.mock('../../src/components/AnimalCard', () => ({
  __esModule: true,
  AnimalCard: () => <div data-testid="animal-card">Animal</div>,
}));

describe('Fluxos de usuario', () => {
  beforeEach(() => {
    mockPush.mockClear();
    mockReplace.mockClear();
  });

  it('renderiza rota inicial com conteudo principal', () => {
    const { getByTestId } = render(
      <ThemeProvider>
        <Home />
      </ThemeProvider>
    );
    expect(getByTestId('animal-card')).toBeTruthy();
  });

  it('fluxo login vazio mostra validacao', async () => {
    const { getByTestId, findByText } = render(<Login />);
    fireEvent.click(getByTestId('login-button'));
    expect(await findByText('Preencha todos os campos.')).toBeTruthy();
  });

  it('fluxo de cadastro navega para tela de cadastro', () => {
    const { getByTestId } = render(<Login />);
    fireEvent.click(getByTestId('cadastro-link'));
    expect(mockPush).toHaveBeenCalledWith('/(auth)/cadastro');
  });
});
