import { View, Text, Image, Pressable } from 'react-native';
import { Heart, X, RotateCcw, ImageOff, Info, BadgeCheck } from 'lucide-react-native';
import { useState } from 'react';

interface AnimalCardProps {
  name: string;
  age: number;
  image: string;
  tags: string[];
  isDarkTheme?: boolean;
}

export function AnimalCard({ name, age, image, tags, isDarkTheme = false }: AnimalCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <View className="flex-1 px-1 pb-1">
      <View
        className={`flex-1 rounded-lg overflow-hidden border ${
          isDarkTheme ? 'border-white/20 bg-black' : 'border-black/10 bg-black'
        }`}
      >
        {!imageError ? (
          <>
            <Image
              source={{ uri: image }}
              className="absolute inset-0 w-full h-full"
              resizeMode="cover"
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
              testID="animal-image"
            />
            {!imageLoaded && (
              <View className="absolute inset-0 items-center justify-center bg-black/25">
                <Text className="text-white font-medium">Carregando imagem...</Text>
              </View>
            )}
          </>
        ) : (
          <View className="flex-1 items-center justify-center bg-gray-800">
            <ImageOff color="#9CA3AF" size={64} />
            <Text className="text-sm text-gray-300 mt-2">Imagem nao disponivel</Text>
          </View>
        )}

        <View className="absolute top-1 left-2 right-2 flex-row gap-1">
          <View className="h-1 flex-1 rounded-full bg-white" />
          <View className="h-1 flex-1 rounded-full bg-[#505965]" />
          <View className="h-1 flex-1 rounded-full bg-[#505965]" />
        </View>

        <View className="absolute inset-0 bg-black/20" />

        <View className="absolute bottom-20 left-0 right-0 h-64 bg-black/60" />

        <View className="absolute bottom-20 left-0 right-0 px-5 pb-3">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <Text className="text-white text-4xl font-bold">{name}</Text>
              <Text className="text-white text-3xl">{age}</Text>
              <BadgeCheck color="#3B82F6" size={18} />
            </View>
            <Pressable className="w-7 h-7 rounded-full bg-white items-center justify-center" testID="info-button">
              <Info color="#1F2937" size={16} />
            </Pressable>
          </View>

          <View className="flex-row flex-wrap gap-1.5 mt-2">
            {tags.map((tag) => (
              <View key={tag} className="px-3 py-1 rounded-full border border-white bg-[#505965CC]">
                <Text className="text-white text-xs font-medium">{tag}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      <View className="mt-3 px-5 flex-row items-center justify-between">
        <Pressable className="w-12 h-12 rounded-full border border-[#CD7105] bg-transparent items-center justify-center" testID="rewind-button">
          <RotateCcw color="#F59E0B" size={22} />
        </Pressable>
        <Pressable className="w-14 h-14 rounded-full border-2 border-[#FF4458] bg-transparent items-center justify-center" testID="reject-button">
          <X color="#F43F5E" size={28} />
        </Pressable>
        <Pressable className="w-14 h-14 rounded-full border-2 border-[#129E68] bg-transparent items-center justify-center" testID="like-button">
          <Heart color="#10B981" size={26} />
        </Pressable>
      </View>
    </View>
  );
}
