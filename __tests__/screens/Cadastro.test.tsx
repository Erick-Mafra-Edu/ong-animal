import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import Cadastro from '../../app/(auth)/cadastro';

const mockReplace = jest.fn();
const mockBack = jest.fn();
const mockSignUp = jest.fn();
const mockInsert = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: jest.fn(() => ({
    replace: mockReplace,
    push: jest.fn(),
    back: mockBack,
  })),
}));

jest.mock('../../services/supabase', () => ({
  supabase: {
    auth: {
      signUp: (...args: unknown[]) => mockSignUp(...args),
    },
    from: jest.fn(() => ({
      insert: (...args: unknown[]) => mockInsert(...args),
    })),
  },
}));

describe('Cadastro Screen Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSignUp.mockResolvedValue({
      data: { user: { id: 'new-user-id' } },
      error: null,
    });
    mockInsert.mockResolvedValue({ error: null });
  });

  const preencherFormularioBase = (getByTestId: (id: string) => HTMLElement) => {
    fireEvent.change(getByTestId('nome-input'), { target: { value: 'Erick Teste' } });
    fireEvent.change(getByTestId('email-input'), { target: { value: 'erick@teste.com' } });
    fireEvent.change(getByTestId('senha-input'), { target: { value: '123456' } });
    fireEvent.change(getByTestId('cidade-input'), { target: { value: 'Campinas' } });
  };

  it('shows validation error when required fields are empty', async () => {
    const { getByTestId, findByText } = render(<Cadastro />);

    fireEvent.click(getByTestId('cadastrar-button'));

    expect(await findByText('Preencha todos os campos.')).toBeTruthy();
    expect(mockSignUp).not.toHaveBeenCalled();
  });

  it('creates adotante account and redirects to onboarding', async () => {
    const { getByTestId } = render(<Cadastro />);

    preencherFormularioBase(getByTestId);
    fireEvent.click(getByTestId('tipo-adotante'));
    fireEvent.click(getByTestId('cadastrar-button'));

    await waitFor(() => {
      expect(mockSignUp).toHaveBeenCalledWith({
        email: 'erick@teste.com',
        password: '123456',
      });
      expect(mockInsert).toHaveBeenCalledWith({
        id: 'new-user-id',
        nome: 'Erick Teste',
        cidade: 'Campinas',
        tipo_usuario: 'adotante',
      });
      expect(mockReplace).toHaveBeenCalledWith('/(onboarding)/perguntas');
    });
  });

  it('creates ONG account and redirects to ONG dashboard', async () => {
    const { getByTestId } = render(<Cadastro />);

    preencherFormularioBase(getByTestId);
    fireEvent.click(getByTestId('tipo-ong'));
    fireEvent.click(getByTestId('cadastrar-button'));

    await waitFor(() => {
      expect(mockInsert).toHaveBeenCalledWith({
        id: 'new-user-id',
        nome: 'Erick Teste',
        cidade: 'Campinas',
        tipo_usuario: 'ong',
      });
      expect(mockReplace).toHaveBeenCalledWith('/(ong)/dashboard');
    });
  });

  it('shows auth error when sign up fails', async () => {
    mockSignUp.mockResolvedValueOnce({
      data: { user: null },
      error: { message: 'Email ja cadastrado' },
    });

    const { getByTestId, findByText } = render(<Cadastro />);

    preencherFormularioBase(getByTestId);
    fireEvent.click(getByTestId('cadastrar-button'));

    expect(await findByText('Email ja cadastrado')).toBeTruthy();
    expect(mockInsert).not.toHaveBeenCalled();
    expect(mockReplace).not.toHaveBeenCalled();
  });
});
