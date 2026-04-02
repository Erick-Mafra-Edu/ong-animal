import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';

const mockReplace = jest.fn();
const mockPush = jest.fn();
const mockSignInWithPassword = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: jest.fn(() => ({
    replace: mockReplace,
    push: mockPush,
    back: jest.fn(),
  })),
}));

jest.mock('../../services/supabase', () => ({
  supabase: {
    auth: {
      signInWithPassword: (...args: unknown[]) => mockSignInWithPassword(...args),
    },
  },
}));

import Login from '../../app/(auth)/login';

describe('Login Screen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSignInWithPassword.mockResolvedValue({ error: null });
  });

  it('renders email and password inputs', () => {
    const { getByTestId } = render(<Login />);
    expect(getByTestId('email-input')).toBeTruthy();
    expect(getByTestId('senha-input')).toBeTruthy();
  });

  it('renders login button', () => {
    const { getByTestId } = render(<Login />);
    expect(getByTestId('login-button')).toBeTruthy();
  });

  it('renders link to cadastro screen', () => {
    const { getByTestId } = render(<Login />);
    expect(getByTestId('cadastro-link')).toBeTruthy();
  });

  it('shows app title', () => {
    const { getByText } = render(<Login />);
    expect(getByText('ONG Animal 🐾')).toBeTruthy();
  });

  it('shows error when fields are empty and login is pressed', async () => {
    const { getByTestId, findByText } = render(<Login />);
    fireEvent.click(getByTestId('login-button'));
    expect(await findByText('Preencha todos os campos.')).toBeTruthy();
    expect(mockSignInWithPassword).not.toHaveBeenCalled();
  });

  it('logs in successfully and redirects to swipe tab', async () => {
    const { getByTestId } = render(<Login />);

    fireEvent.change(getByTestId('email-input'), { target: { value: 'teste@ong.com' } });
    fireEvent.change(getByTestId('senha-input'), { target: { value: '123456' } });
    fireEvent.click(getByTestId('login-button'));

    await waitFor(() => {
      expect(mockSignInWithPassword).toHaveBeenCalledWith({
        email: 'teste@ong.com',
        password: '123456',
      });
      expect(mockReplace).toHaveBeenCalledWith('/(tabs)/swipe');
    });
  });

  it('shows auth error and does not navigate on failed login', async () => {
    mockSignInWithPassword.mockResolvedValueOnce({
      error: { message: 'Credenciais invalidas' },
    });

    const { getByTestId, findByText } = render(<Login />);

    fireEvent.change(getByTestId('email-input'), { target: { value: 'teste@ong.com' } });
    fireEvent.change(getByTestId('senha-input'), { target: { value: 'senha-errada' } });
    fireEvent.click(getByTestId('login-button'));

    expect(await findByText('Credenciais invalidas')).toBeTruthy();
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it('navigates to cadastro from login screen', () => {
    const { getByTestId } = render(<Login />);
    fireEvent.click(getByTestId('cadastro-link'));
    expect(mockPush).toHaveBeenCalledWith('/(auth)/cadastro');
  });
});
