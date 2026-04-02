import { Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeProvider } from '../src/context/ThemeContext';
import '../src/styles/global.css';

export default function RootLayout() {
  return (
    <ThemeProvider>
      <SafeAreaView className="flex-1" edges={['top']}>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(onboarding)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="(ong)" />
          <Stack.Screen name="chat" />
        </Stack>
      </SafeAreaView>
    </ThemeProvider>
  );
}
