import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';

const mockReplace = jest.fn();
const mockGetUser = jest.fn();
const mockInsert = jest.fn();

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
      insert: (...args: unknown[]) => mockInsert(...args),
    })),
  },
}));

import CadastrarAnimal from '../../app/(ong)/cadastrar-animal';

describe('CadastrarAnimal Screen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetUser.mockResolvedValue({ data: { user: { id: 'ong-id-1' } } });
    mockInsert.mockResolvedValue({ error: null });
  });

  it('renders the screen heading', () => {
    const { getAllByText } = render(<CadastrarAnimal />);
    expect(getAllByText('Cadastrar animal').length).toBeGreaterThanOrEqual(1);
  });

  it('renders name input', () => {
    const { getByTestId } = render(<CadastrarAnimal />);
    expect(getByTestId('nome-input')).toBeTruthy();
  });

  it('renders idade input', () => {
    const { getByTestId } = render(<CadastrarAnimal />);
    expect(getByTestId('idade-input')).toBeTruthy();
  });

  it('renders descricao input', () => {
    const { getByTestId } = render(<CadastrarAnimal />);
    expect(getByTestId('descricao-input')).toBeTruthy();
  });

  it('renders foto URL input', () => {
    const { getByTestId } = render(<CadastrarAnimal />);
    expect(getByTestId('foto-input')).toBeTruthy();
  });

  it('renders tipo selectors', () => {
    const { getByTestId } = render(<CadastrarAnimal />);
    expect(getByTestId('tipo-cachorro')).toBeTruthy();
    expect(getByTestId('tipo-gato')).toBeTruthy();
  });

  it('renders porte selectors', () => {
    const { getByTestId } = render(<CadastrarAnimal />);
    expect(getByTestId('porte-pequeno')).toBeTruthy();
    expect(getByTestId('porte-medio')).toBeTruthy();
    expect(getByTestId('porte-grande')).toBeTruthy();
  });

  it('renders energia selectors', () => {
    const { getByTestId } = render(<CadastrarAnimal />);
    expect(getByTestId('energia-baixo')).toBeTruthy();
    expect(getByTestId('energia-medio')).toBeTruthy();
    expect(getByTestId('energia-alto')).toBeTruthy();
  });

  it('renders the submit button', () => {
    const { getByTestId } = render(<CadastrarAnimal />);
    expect(getByTestId('cadastrar-button')).toBeTruthy();
  });

  it('shows validation error when required fields are empty', async () => {
    const { getByTestId, findByText } = render(<CadastrarAnimal />);
    fireEvent.click(getByTestId('cadastrar-button'));
    expect(await findByText('Preencha todos os campos obrigatórios.')).toBeTruthy();
    expect(mockInsert).not.toHaveBeenCalled();
  });

  it('inserts animal and redirects to dashboard on success', async () => {
    const { getByTestId } = render(<CadastrarAnimal />);

    fireEvent.change(getByTestId('nome-input'), { target: { value: 'Rex' } });
    fireEvent.change(getByTestId('idade-input'), { target: { value: '2 anos' } });
    fireEvent.click(getByTestId('tipo-cachorro'));
    fireEvent.click(getByTestId('porte-medio'));
    fireEvent.click(getByTestId('energia-alto'));
    fireEvent.click(getByTestId('cadastrar-button'));

    await waitFor(() => {
      expect(mockInsert).toHaveBeenCalledWith(
        expect.objectContaining({
          ong_id: 'ong-id-1',
          nome: 'Rex',
          tipo: 'cachorro',
          idade: '2 anos',
          porte: 'medio',
          nivel_energia: 'alto',
          status: 'disponivel',
        })
      );
      expect(mockReplace).toHaveBeenCalledWith('/(ong)/dashboard');
    });
  });

  it('shows error message when insert fails', async () => {
    mockInsert.mockResolvedValueOnce({ error: { message: 'Erro ao salvar' } });

    const { getByTestId, findByText } = render(<CadastrarAnimal />);

    fireEvent.change(getByTestId('nome-input'), { target: { value: 'Fido' } });
    fireEvent.change(getByTestId('idade-input'), { target: { value: '1 ano' } });
    fireEvent.click(getByTestId('tipo-gato'));
    fireEvent.click(getByTestId('porte-pequeno'));
    fireEvent.click(getByTestId('energia-baixo'));
    fireEvent.click(getByTestId('cadastrar-button'));

    expect(await findByText('Erro ao salvar')).toBeTruthy();
    expect(mockReplace).not.toHaveBeenCalled();
  });
});
