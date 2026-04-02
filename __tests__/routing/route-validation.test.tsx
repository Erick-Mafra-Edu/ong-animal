import React from 'react';
import { render } from '@testing-library/react';
import RootLayout from '../../app/_layout';

jest.mock('expo-router', () => {
  const ScreenMock = jest.fn(({ name }: { name: string }) => (
    <div data-testid={`route-${name}`}>{name}</div>
  ));

  const StackMock = ({ children }: { children: React.ReactNode }) => (
    <div data-testid="stack">{children}</div>
  );

  StackMock.Screen = ScreenMock;
  return { Stack: StackMock };
});

describe('Validacao de implantacao (web/native)', () => {
  it('carrega o layout raiz sem quebrar', () => {
    const { getByTestId } = render(<RootLayout />);
    expect(getByTestId('stack')).toBeTruthy();
  });

  it('registra as rotas principais do app', () => {
    const { getByTestId } = render(<RootLayout />);
    expect(getByTestId('route-index')).toBeTruthy();
    expect(getByTestId('route-(auth)')).toBeTruthy();
    expect(getByTestId('route-(onboarding)')).toBeTruthy();
    expect(getByTestId('route-(tabs)')).toBeTruthy();
    expect(getByTestId('route-(ong)')).toBeTruthy();
  });

  it('nao possui rota legada /light', () => {
    const { queryByTestId } = render(<RootLayout />);
    expect(queryByTestId('route-light')).toBeNull();
  });

  it('usa entrada universal do expo-router', () => {
    const pkg = require('../../package.json');
    expect(pkg.main).toBe('expo-router/entry');
  });
});
