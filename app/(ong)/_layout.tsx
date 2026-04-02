import { Stack } from 'expo-router';

export default function OngLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="dashboard" />
      <Stack.Screen name="cadastrar-animal" />
      <Stack.Screen name="interessados" />
      <Stack.Screen name="mensagens" />
    </Stack>
  );
}
