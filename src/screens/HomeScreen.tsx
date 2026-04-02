import { View, Pressable, Text } from 'react-native';
import { Moon, Sun } from 'lucide-react-native';
import { AnimalCard } from '../components/AnimalCard';
import { useTheme } from '../context/ThemeContext';

const sampleAnimals = [
  {
    name: 'Yolo',
    age: 26,
    image: 'https://firebasestorage.googleapis.com/v0/b/codeless-app.appspot.com/o/projects%2F0SObcceZFqcMj44PAXdK%2F2caeaa6e02fa3ae736d01407675af388d36db7dcRectangle.png?alt=media&token=d65ade4e-cfa2-493d-924f-9f6d4275a669',
    tags: ['Online shopping', 'Amateur cook', 'Anime', 'Horror films', 'Skincare'],
  },
];

export default function HomeScreen() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <View className={`flex-1 ${isDark ? 'bg-[#111827]' : 'bg-[#F0F2F4]'}`}>
      <View className="absolute top-14 right-4 z-20">
        <Pressable
          onPress={toggleTheme}
          className={`w-10 h-10 rounded-full items-center justify-center ${isDark ? 'bg-white/10' : 'bg-black/10'}`}
          testID="theme-toggle"
        >
          {isDark ? <Sun color="#FFFFFF" size={20} /> : <Moon color="#111827" size={20} />}
        </Pressable>
      </View>

      <View className="flex-1 px-3 pt-12 pb-5 md:flex-row md:items-center md:justify-center md:gap-8 md:px-8">
        <View
          className={`hidden md:flex md:w-[360px] md:rounded-2xl md:p-7 ${
            isDark ? 'md:bg-white/5' : 'md:bg-white/80'
          }`}
        >
          <Text className={`text-3xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Encontre seu novo amigo
          </Text>
          <Text className={`text-base leading-7 mb-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Explore perfis no estilo swipe. Veja os detalhes, compare interesses e decida rapido: aceitar ou pular.
          </Text>

          <View className="gap-3">
            <Pressable className="rounded-full py-3 px-5 bg-emerald-500/90" testID="accept-cta">
              <Text className="text-white font-semibold text-center">Aceitar perfil</Text>
            </Pressable>
            <Pressable
              className={`rounded-full py-3 px-5 border ${
                isDark ? 'border-white/25 bg-white/5' : 'border-gray-300 bg-white'
              }`}
              testID="reject-cta"
            >
              <Text className={`font-semibold text-center ${isDark ? 'text-white' : 'text-gray-800'}`}>
                Nao agora
              </Text>
            </Pressable>
          </View>
        </View>

        <View className="flex-1 md:max-w-[390px] md:h-[760px] md:flex-none">
          {sampleAnimals.map((animal) => (
            <AnimalCard
              key={animal.name}
              name={animal.name}
              age={animal.age}
              image={animal.image}
              tags={animal.tags}
              isDarkTheme={isDark}
            />
          ))}
        </View>
      </View>
    </View>
  );
}
