import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Sun } from 'lucide-react-native';
import { AnimalCard } from '../components/AnimalCard';

const sampleAnimals = [
  {
    name: 'Phoenix',
    age: 4,
    image: 'https://images.unsplash.com/photo-1570129477492-45b003493af0?w=600&h=600&fit=crop',
    tags: ['Adventure', 'Loyal', 'Energetic', 'Family-friendly'],
  },
];

export default function LightTheme() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="px-4 pt-6 pb-4 flex-row justify-between items-start">
        <View className="flex-1">
          <Text className="text-3xl font-bold text-gray-900 mb-1">Encontre seu novo amigo</Text>
          <Text className="text-gray-600">Deslize para conhecer animais incríveis</Text>
        </View>
        
        {/* Theme toggle button */}
        <Pressable
          onPress={() => router.push('/')}
          className="bg-gray-900/10 p-3 rounded-full"
        >
          <Sun className="w-6 h-6 text-gray-900" />
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
            isDarkTheme={false}
          />
        ))}
      </View>
    </View>
  );
}
