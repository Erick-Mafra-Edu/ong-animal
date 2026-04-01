import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Moon } from 'lucide-react-native';
import { AnimalCard } from '../components/AnimalCard';

const sampleAnimals = [
  {
    name: 'Yolo',
    age: 2,
    image: 'https://images.unsplash.com/photo-1587300411107-ec45cf43c7a6?w=600&h=600&fit=crop',
    tags: ['Online shopping', 'Amateur cook', 'Anime', 'Horror films', 'Skincare'],
  },
];

export default function DarkTheme() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-gray-900">
      {/* Header */}
      <View className="px-4 pt-6 pb-4 flex-row justify-between items-start">
        <View className="flex-1">
          <Text className="text-3xl font-bold text-white mb-1">Encontre seu novo amigo</Text>
          <Text className="text-gray-400">Deslize para conhecer animais incríveis</Text>
        </View>
        
        {/* Theme toggle button */}
        <Pressable
          onPress={() => router.push('/light')}
          className="bg-white/10 p-3 rounded-full"
        >
          <Moon className="w-6 h-6 text-white" />
        </Pressable>
      </View>

      {/* Main content */}
      <View className="flex-1">
        {sampleAnimals.map((animal, index) => (
          <AnimalCard
            key={index}
            name={animal.name}
            age={animal.age}
            image={animal.image}
            tags={animal.tags}
            isDarkTheme={true}
          />
        ))}
      </View>
    </View>
  );
}
