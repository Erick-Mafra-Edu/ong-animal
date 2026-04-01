import React from 'react';
import { createRoot } from 'react-dom/client';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import RootLayout from './app/_layout';
import './src/styles/global.css';

const container = document.getElementById('root');
const root = createRoot(container!);

root.render(
  <React.StrictMode>
    <GestureHandlerRootView style={{ flex: 1 }}>
      <RootLayout />
    </GestureHandlerRootView>
  </React.StrictMode>
);
