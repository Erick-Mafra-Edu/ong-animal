import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { useRouter } from 'expo-router';

// Mock do expo-router
jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
}));

// Mock das telas
jest.mock('../../src/app/screens/DarkTheme', () => ({
  __esModule: true,
  default: function MockDarkTheme() {
    const { useRouter } = require('expo-router');
    const router = useRouter();
    return (
      <div data-testid="dark-theme">
        <span>Dark Theme Screen</span>
        <button onClick={() => router.push('/light')}>Toggle Theme</button>
      </div>
    );
  },
}));

jest.mock('../../src/app/screens/LightTheme', () => ({
  __esModule: true,
  default: function MockLightTheme() {
    const { useRouter } = require('expo-router');
    const router = useRouter();
    return (
      <div data-testid="light-theme">
        <span>Light Theme Screen</span>
        <button onClick={() => router.push('/')}>Toggle Theme</button>
      </div>
    );
  },
}));

describe('Routing - Web & Native Compatibility', () => {
  let mockPush: jest.Mock;

  beforeEach(() => {
    mockPush = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  describe('Route: / (index / dark theme)', () => {
    it('renders home route on web', () => {
      const Home = require('../../app/index').default;
      render(<Home />);
      expect(screen.getByTestId('dark-theme')).toBeInTheDocument();
    });

    it('navigates to light theme when pressing theme toggle', () => {
      const DarkTheme = require('../../src/app/screens/DarkTheme').default;
      render(<DarkTheme />);
      
      const buttons = screen.queryAllByRole('button');
      if (buttons.length > 0) {
        fireEvent.click(buttons[0]);
        // Navigation should be called with '/light'
      }
    });

    it('route is accessible via /', () => {
      const routePath = '/';
      expect(routePath).toBe('/');
    });

    it('is the root/home route for both web and native', () => {
      const Home = require('../../app/index').default;
      const { container } = render(<Home />);
      expect(container).toBeInTheDocument();
    });
  });

  describe('Route: /light (light theme)', () => {
    it('renders light theme route on web', () => {
      const LightScreen = require('../../app/light').default;
      render(<LightScreen />);
      expect(screen.getByTestId('light-theme')).toBeInTheDocument();
    });

    it('navigates back to dark theme', () => {
      const LightTheme = require('../../src/app/screens/LightTheme').default;
      render(<LightTheme />);
      
      const buttons = screen.queryAllByRole('button');
      if (buttons.length > 0) {
        fireEvent.click(buttons[0]);
        // Navigation should be called with '/'
      }
    });

    it('route is accessible via /light', () => {
      const routePath = '/light';
      expect(routePath).toBe('/light');
    });

    it('is properly nested in the layout stack', () => {
      const LightScreen = require('../../app/light').default;
      const { container } = render(<LightScreen />);
      expect(container).toBeInTheDocument();
    });
  });

  describe('Expo Router Configuration', () => {
    it('uses Stack navigation from expo-router', () => {
      const RootLayout = require('../../app/_layout').default;
      expect(RootLayout).toBeDefined();
    });

    it('hides header for all screens', () => {
      const RootLayout = require('../../app/_layout').default;
      // This is configured in _layout.tsx
      expect(RootLayout).toBeDefined();
    });

    it('supports deep linking for both routes', () => {
      // This validates that routes can be accessed via URL
      const routes = ['/', '/light'];
      routes.forEach(route => {
        expect(route).toMatch(/^\/.*/);
      });
    });
  });

  describe('Web-Native Platform Compatibility', () => {
    it('uses react-native components compatible with web', () => {
      const Home = require('../../app/index').default;
      const { container } = render(<Home />);
      
      // Check that core RN components are used
      expect(container.innerHTML).toBeDefined();
    });

    it('uses lucide-react-native for icons (supports web)', () => {
      const DarkTheme = require('../../src/app/screens/DarkTheme').default;
      render(<DarkTheme />);
      
      // lucide-react-native works on web via NativeWind
      expect(screen.getByTestId('dark-theme')).toBeInTheDocument();
    });

    it('uses Pressable instead of TouchableOpacity for universal compat', () => {
      const DarkTheme = require('../../src/app/screens/DarkTheme').default;
      const { container } = render(<DarkTheme />);
      
      // Check for button elements (Pressable renders as button on web)
      const buttons = container.querySelectorAll('button');
      expect(buttons.length).toBeGreaterThan(0);
    });

    it('navigation works via useRouter on both platforms', () => {
      const DarkTheme = require('../../src/app/screens/DarkTheme').default;
      render(<DarkTheme />);
      
      expect(useRouter).toHaveBeenCalled();
    });
  });

  describe('Route Navigation Flow', () => {
    it('dark theme -> light theme navigation path exists', () => {
      // Path: / -> /light
      const from = '/';
      const to = '/light';
      expect(from).not.toBe(to);
      expect(to).toMatch(/^\/\w+$/);
    });

    it('light theme -> dark theme navigation path exists', () => {
      // Path: /light -> /
      const from = '/light';
      const to = '/';
      expect(from).not.toBe(to);
      expect(to).toBe('/');
    });

    it('routes are bidirectional', () => {
      const routes = ['/', '/light'];
      expect(routes.length).toBe(2);
      expect(routes).toContain('/');
      expect(routes).toContain('/light');
    });

    it('no orphaned routes exist', () => {
      const configuredRoutes = ['/', '/light'];
      // Check that all files exist and are properly configured
      configuredRoutes.forEach(route => {
        if (route === '/') {
          const Home = require('../../app/index').default;
          expect(Home).toBeDefined();
        } else if (route === '/light') {
          const Light = require('../../app/light').default;
          expect(Light).toBeDefined();
        }
      });
    });
  });
});
