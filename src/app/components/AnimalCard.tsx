import { View, Text, Image, ScrollView, Pressable } from 'react-native';
import { Heart, X, ThumbsUp, ImageOff } from 'lucide-react-native';
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
    <View className={`flex-1 ${isDarkTheme ? 'bg-gray-900' : 'bg-white'}`}>
      <ScrollView className="flex-1 px-4 py-8">
        {/* Image Section */}
        <View className={`rounded-2xl overflow-hidden mb-6 h-80 shadow-lg ${isDarkTheme ? 'bg-gray-800' : 'bg-gray-100'}`}>
          {!imageError ? (
            <>
              <Image
                source={{ uri: image }}
                className="w-full h-full"
                resizeMode="cover"
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
              />
              {!imageLoaded && (
                <View className="absolute inset-0 flex-1 items-center justify-center bg-gray-300/30">
                  <Text className="text-gray-600">Carregando imagem...</Text>
                </View>
              )}
            </>
          ) : (
            <View className="flex-1 items-center justify-center">
              <ImageOff className="w-16 h-16 text-gray-400 mb-2" />
              <Text className={`text-sm ${isDarkTheme ? 'text-gray-400' : 'text-gray-500'}`}>
                Imagem não disponível
              </Text>
            </View>
          )}
        </View>

        {/* Name and Age */}
        <View className="flex-row items-baseline gap-3 mb-6">
          <Text className={`text-4xl font-bold ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
            {name}
          </Text>
          <Text className={`text-2xl ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>
            {age}
          </Text>
        </View>

        {/* Tags */}
        <View className="flex-row flex-wrap gap-2 mb-6">
          {tags.map((tag, index) => (
            <View
              key={index}
              className={`px-4 py-2 rounded-full border ${
                isDarkTheme
                  ? 'bg-gray-700/50 border-gray-600'
                  : 'bg-gray-50 border-gray-300'
              }`}
            >
              <Text
                className={`text-sm font-medium ${
                  isDarkTheme ? 'text-gray-200' : 'text-gray-700'
                }`}
              >
                {tag}
              </Text>
            </View>
          ))}
        </View>

        {/* Description */}
        <Text
          className={`text-base leading-relaxed mb-8 ${
            isDarkTheme ? 'text-gray-300' : 'text-gray-600'
          }`}
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </Text>
      </ScrollView>

      {/* Action Buttons */}
      <View className={`flex-row gap-4 px-4 py-6 border-t ${isDarkTheme ? 'border-gray-700' : 'border-gray-200'}`}>
        {/* Reject Button */}
        <Pressable className="flex-1 flex-row items-center justify-center py-3 px-6 rounded-full border-2 border-red-500 bg-transparent">
          <X className="w-6 h-6 text-red-500 mr-2" />
          <Text className="text-red-500 font-semibold">Passar</Text>
        </Pressable>

        {/* Like Button */}
        <Pressable className="flex-1 flex-row items-center justify-center py-3 px-6 rounded-full border-2 border-orange-500 bg-transparent">
          <Text className="text-orange-600 font-semibold mr-2">R</Text>
          <Heart className="w-6 h-6 text-orange-500" />
        </Pressable>

        {/* Super Like Button */}
        <Pressable className="flex-1 flex-row items-center justify-center py-3 px-6 rounded-full border-2 border-green-600 bg-transparent">
          <ThumbsUp className="w-6 h-6 text-green-600 mr-2" />
          <Text className="text-green-600 font-semibold">L</Text>
        </Pressable>
      </View>
    </View>
  );
}
