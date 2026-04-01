import { View, Text, Pressable, Modal, Image } from 'react-native';
import { Heart } from 'lucide-react-native';

interface MatchModalProps {
  visible: boolean;
  animalNome: string;
  animalFoto: string;
  onClose: () => void;
}

export function MatchModal({ visible, animalNome, animalFoto, onClose }: MatchModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      testID="match-modal"
    >
      <View className="flex-1 bg-black/80 items-center justify-center px-6">
        <View className="bg-gray-900 rounded-3xl p-8 items-center w-full max-w-sm border border-orange-500">
          <Heart color="#f97316" size={48} />
          <Text className="text-3xl font-bold text-white mt-4 mb-2">
            É um Match! 🎉
          </Text>
          <Text className="text-gray-400 text-center mb-6">
            Você demonstrou interesse em {animalNome}. A ONG será notificada!
          </Text>

          {animalFoto ? (
            <Image
              source={{ uri: animalFoto }}
              className="w-32 h-32 rounded-full mb-6 border-4 border-orange-500"
              resizeMode="cover"
              testID="match-animal-foto"
            />
          ) : null}

          <Text className="text-white font-semibold text-xl mb-6">{animalNome}</Text>

          <Text className="text-gray-400 text-center text-sm mb-8">
            Aguarde a aprovação da ONG para iniciar o contato 💛
          </Text>

          <Pressable
            className="bg-orange-500 rounded-xl py-4 px-8 w-full items-center"
            onPress={onClose}
            testID="match-close-button"
          >
            <Text className="text-white font-bold text-lg">Continuar explorando</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
