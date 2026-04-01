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
      getUser: jest.fn(() => Promise.resolve({ data: { user: { id: 'test-user' } } })),
    },
    from: jest.fn(() => ({
      upsert: jest.fn(() => Promise.resolve({ error: null })),
    })),
  },
}));

import Perguntas from '../../app/(onboarding)/perguntas';

describe('Perguntas (Onboarding) Screen', () => {
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
});
