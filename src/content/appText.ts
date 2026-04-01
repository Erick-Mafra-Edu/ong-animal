export interface HomeTextContent {
  title: string;
  subtitle: string;
}

export interface LoginTextContent {
  brandTitle: string;
  brandSubtitle: string;
  submitLabel: string;
}

export interface DevelopmentTextCatalog {
  home: HomeTextContent;
  login: LoginTextContent;
}

export const appText: DevelopmentTextCatalog = {
  home: {
    title: 'Encontre seu novo amigo',
    subtitle: 'Deslize para conhecer animais incriveis',
  },
  login: {
    brandTitle: 'ONG Animal',
    brandSubtitle: 'Encontre seu novo companheiro',
    submitLabel: 'Entrar',
  },
};