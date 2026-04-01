import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';

export default function Root() {
  return (
    <SafeAreaView className="flex-1">
      <Stack />
    </SafeAreaView>
  );
}
