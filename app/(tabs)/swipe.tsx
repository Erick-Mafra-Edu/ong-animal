import { View, Text, Image, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';
import { supabase, Animal } from '../../services/supabase';
import { SwipeButtons } from '../../src/app/components/SwipeButtons';
import { MatchModal } from '../../src/app/components/MatchModal';
import { ImageOff } from 'lucide-react-native';

export default function Swipe() {
  const [animais, setAnimais] = useState<Animal[]>([]);
  const [indiceAtual, setIndiceAtual] = useState(0);
  const [loading, setLoading] = useState(true);
  const [matchVisible, setMatchVisible] = useState(false);
  const [showDetalhes, setShowDetalhes] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    carregarAnimais();
  }, []);

  const carregarAnimais = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('animals')
      .select('*')
      .eq('status', 'disponivel');
    setAnimais(data ?? []);
    setLoading(false);
  };

  const registrarSwipe = async (interesse: boolean) => {
    const animal = animais[indiceAtual];
    if (!animal) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from('swipes').insert({
        user_id: user.id,
        animal_id: animal.id,
        interesse,
      });

      if (interesse) {
        await supabase.from('matches').insert({
          user_id: user.id,
          animal_id: animal.id,
          status: 'aguardando',
        });
        setMatchVisible(true);
        return;
      }
    }

    proximoAnimal();
  };

  const proximoAnimal = () => {
    setIndiceAtual(prev => prev + 1);
    setShowDetalhes(false);
    setImageError(false);
  };

  if (loading) {
    return (
      <View className="flex-1 bg-gray-900 items-center justify-center">
        <ActivityIndicator size="large" color="#f97316" />
        <Text className="text-gray-400 mt-4">Carregando animais...</Text>
      </View>
    );
  }

  const animalAtual = animais[indiceAtual];

  if (!animalAtual) {
    return (
      <View className="flex-1 bg-gray-900 items-center justify-center px-6">
        <Text className="text-6xl mb-4">🐾</Text>
        <Text className="text-2xl font-bold text-white mb-2 text-center">
          Você viu todos os animais!
        </Text>
        <Text className="text-gray-400 text-center mb-8">
          Volte mais tarde para ver novos amigos disponíveis para adoção.
        </Text>
        <Pressable
          className="bg-orange-500 rounded-xl py-4 px-8"
          onPress={carregarAnimais}
          testID="recarregar-button"
        >
          <Text className="text-white font-bold">Recarregar</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-900">
      {/* Header */}
      <View className="px-6 pt-12 pb-4 flex-row justify-between items-center">
        <Text className="text-2xl font-bold text-white">Explorar 🐾</Text>
        <Text className="text-gray-400 text-sm">
          {indiceAtual + 1} / {animais.length}
        </Text>
      </View>

      <ScrollView className="flex-1">
        {/* Card do animal */}
        <View className="mx-4 rounded-3xl overflow-hidden bg-gray-800 shadow-2xl">
          {/* Foto */}
          <View className="h-96 bg-gray-700">
            {!imageError && animalAtual.foto_url ? (
              <Image
                source={{ uri: animalAtual.foto_url }}
                className="w-full h-full"
                resizeMode="cover"
                onError={() => setImageError(true)}
                testID="animal-image"
              />
            ) : (
              <View className="flex-1 items-center justify-center">
                <ImageOff color="#6b7280" size={48} />
                <Text className="text-gray-400 mt-2">Sem foto disponível</Text>
              </View>
            )}

            {/* Overlay com informações básicas */}
            <View className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
              <Text className="text-3xl font-bold text-white" testID="animal-nome">
                {animalAtual.nome}
              </Text>
              <View className="flex-row gap-2 mt-2">
                <View className="bg-orange-500/80 px-3 py-1 rounded-full">
                  <Text className="text-white text-sm font-medium">{animalAtual.idade}</Text>
                </View>
                <View className="bg-blue-500/80 px-3 py-1 rounded-full">
                  <Text className="text-white text-sm font-medium">{animalAtual.porte}</Text>
                </View>
                <View className="bg-green-500/80 px-3 py-1 rounded-full">
                  <Text className="text-white text-sm font-medium">{animalAtual.nivel_energia}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Detalhes expandíveis */}
          {showDetalhes && (
            <View className="p-6">
              <Text className="text-lg font-semibold text-white mb-2">Sobre {animalAtual.nome}</Text>
              <Text className="text-gray-300 leading-relaxed" testID="animal-descricao">
                {animalAtual.descricao}
              </Text>
              <View className="flex-row flex-wrap gap-2 mt-4">
                <View className="bg-gray-700 px-3 py-1 rounded-full">
                  <Text className="text-gray-300 text-sm capitalize">{animalAtual.tipo}</Text>
                </View>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Botões de ação */}
      <SwipeButtons
        onReject={() => registrarSwipe(false)}
        onLike={() => registrarSwipe(true)}
        onInfo={() => setShowDetalhes(!showDetalhes)}
      />

      {/* Modal de match */}
      <MatchModal
        visible={matchVisible}
        animalNome={animalAtual.nome}
        animalFoto={animalAtual.foto_url}
        onClose={() => {
          setMatchVisible(false);
          proximoAnimal();
        }}
      />
    </View>
  );
}
