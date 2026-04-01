# ONG Animal - Pet Adoption Application

Uma aplicação mobile de adoção de animais de estimação construída com Expo e React Native.

## Características

- 📱 Aplicativo mobile nativo (iOS e Android)
- 🎨 Design moderno e responsivo
- 🌓 Tema claro e escuro
- 🐾 Catálogo de animais disponíveis para adoção
- ⚡ Construído com Expo, React Native e TypeScript

## Instalação

### Pré-requisitos

- Node.js 18+
- npm ou yarn
- Expo CLI: `npm install -g expo-cli`

### Setup

```bash
# Instalar dependências
npm install

# Iniciar o projeto (selecione a plataforma)
npm start

# Para Android
npm run android

# Para iOS
npm run ios
```

## Estrutura do Projeto

```
app/                     # Rotas da aplicação (Expo Router)
├── _layout.tsx         # Layout raiz
├── index.tsx           # Tela inicial (Dark theme)
└── light.tsx           # Tela light theme

src/
├── app/
│   ├── components/     # Componentes reutilizáveis
│   ├── screens/        # Telas da aplicação
│   ├── App.tsx
│   └── Root.tsx
└── styles/             # Estilos globais
```

## Tecnologias Utilizadas

- **Expo** - Plataforma para desenvolvimento React Native
- **React Native** - Framework mobile
- **TypeScript** - Tipagem estática
- **Expo Router** - Roteamento nativo
- **NativeWind** - Tailwind CSS para React Native
- **Lucide React Native** - Ícones

## Scripts Disponíveis

```bash
npm start      # Inicia o servidor Expo
npm run ios    # Compila para iOS
npm run android # Compila para Android
npm run lint   # Executa linter
```

## Contribuindo

Este projeto é parte de um trabalho acadêmico. Contribuições são bem-vindas!

## Licença

MIT

