import { Stack } from 'expo-router';

export default function App() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ 
          headerShown: false,
          title: 'ONG Animal'
        }} 
      />
      <Stack.Screen 
        name="light" 
        options={{ 
          headerShown: false,
          title: 'Light Theme'
        }} 
      />
    </Stack>
  );
}
