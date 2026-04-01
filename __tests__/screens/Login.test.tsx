import React from 'react';
import { render, fireEvent } from '@testing-library/react';

jest.mock('expo-router', () => ({
  useRouter: jest.fn(() => ({
    replace: jest.fn(),
    push: jest.fn(),
    back: jest.fn(),
  })),
}));

jest.mock('../../services/supabase', () => ({
  supabase: {
    auth: {
      signInWithPassword: jest.fn(() => Promise.resolve({ error: null })),
    },
  },
}));

import Login from '../../app/(auth)/login';

describe('Login Screen', () => {
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
  });
});
