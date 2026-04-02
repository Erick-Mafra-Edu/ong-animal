import { View, Text, Pressable } from 'react-native';
import { X, Heart, Info } from 'lucide-react-native';

interface SwipeButtonsProps {
  onReject: () => void;
  onLike: () => void;
  onInfo: () => void;
}

export function SwipeButtons({ onReject, onLike, onInfo }: SwipeButtonsProps) {
  return (
    <View className="flex-row justify-center gap-6 px-8 py-6">
      <Pressable
        className="w-16 h-16 rounded-full bg-gray-800 border-2 border-red-500 items-center justify-center shadow-lg"
        onPress={onReject}
        testID="reject-button"
      >
        <X color="#ef4444" size={28} />
      </Pressable>

      <Pressable
        className="w-20 h-20 rounded-full bg-orange-500 items-center justify-center shadow-lg"
        onPress={onLike}
        testID="like-button"
      >
        <Heart color="#ffffff" size={32} />
      </Pressable>

      <Pressable
        className="w-16 h-16 rounded-full bg-gray-800 border-2 border-blue-500 items-center justify-center shadow-lg"
        onPress={onInfo}
        testID="info-button"
      >
        <Info color="#3b82f6" size={28} />
      </Pressable>
    </View>
  );
}
