import { View, Text, FlatList, Image, Pressable } from 'react-native';
import { useEffect, useState } from 'react';
import { supabase, Animal } from '../../services/supabase';
import { Heart } from 'lucide-react-native';

export default function Favoritos() {
  const [favoritos, setFavoritos] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarFavoritos();
  }, []);

  const carregarFavoritos = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }

    const { data: swipes } = await supabase
      .from('swipes')
      .select('animal_id')
      .eq('user_id', user.id)
      .eq('interesse', true);

    if (swipes && swipes.length > 0) {
      const animalIds = swipes.map(s => s.animal_id);
      const { data: animais } = await supabase
        .from('animals')
        .select('*')
        .in('id', animalIds);
      setFavoritos(animais ?? []);
    }

    setLoading(false);
  };

  if (loading) {
    return (
      <View className="flex-1 bg-gray-900 items-center justify-center">
        <Text className="text-gray-400">Carregando favoritos...</Text>
      </View>
    );
  }

  if (favoritos.length === 0) {
    return (
      <View className="flex-1 bg-gray-900 items-center justify-center px-6">
        <Heart color="#f97316" size={64} />
        <Text className="text-2xl font-bold text-white mt-4 mb-2 text-center">
          Nenhum favorito ainda
        </Text>
        <Text className="text-gray-400 text-center">
          Dê like nos animais que você gostou para vê-los aqui!
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-900">
      <View className="px-6 pt-12 pb-4">
        <Text className="text-2xl font-bold text-white">Favoritos ❤️</Text>
        <Text className="text-gray-400 mt-1">{favoritos.length} animais</Text>
      </View>

      <FlatList
        data={favoritos}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 16, gap: 12 }}
        renderItem={({ item }) => (
          <View className="bg-gray-800 rounded-2xl overflow-hidden flex-row" testID={`favorito-${item.id}`}>
            <View className="w-24 h-24 bg-gray-700">
              {item.foto_url ? (
                <Image
                  source={{ uri: item.foto_url }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              ) : null}
            </View>
            <View className="flex-1 p-4 justify-center">
              <Text className="text-white font-bold text-lg">{item.nome}</Text>
              <Text className="text-gray-400 text-sm capitalize">{item.tipo} • {item.idade} • {item.porte}</Text>
              <View className="mt-2">
                <View className={`px-2 py-0.5 rounded-full self-start ${item.status === 'disponivel' ? 'bg-green-900' : 'bg-red-900'}`}>
                  <Text className={`text-xs font-medium ${item.status === 'disponivel' ? 'text-green-400' : 'text-red-400'}`}>
                    {item.status === 'disponivel' ? '✅ Disponível' : '❌ Adotado'}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
}
