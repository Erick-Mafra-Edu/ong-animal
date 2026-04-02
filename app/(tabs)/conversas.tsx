import { View, Text, FlatList, Pressable, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { supabase, Match, Animal } from '../../services/supabase';
import { MessageCircle } from 'lucide-react-native';

interface Conversa {
  match: Match;
  animal: Animal;
}

export default function Conversas() {
  const router = useRouter();
  const [conversas, setConversas] = useState<Conversa[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarConversas();
  }, []);

  const carregarConversas = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }

    const { data: matches } = await supabase
      .from('matches')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'aprovado');

    if (matches?.length) {
      const animalIds = matches.map((m) => m.animal_id);
      const { data: animais } = await supabase
        .from('animals')
        .select('*')
        .in('id', animalIds);

      const lista: Conversa[] = matches.map((match) => ({
        match,
        animal: (animais ?? []).find((a) => a.id === match.animal_id) as Animal,
      }));

      setConversas(lista.filter((c) => c.animal));
    }

    setLoading(false);
  };

  if (loading) {
    return (
      <View className="flex-1 bg-gray-900 items-center justify-center">
        <Text className="text-gray-400">Carregando conversas...</Text>
      </View>
    );
  }

  if (conversas.length === 0) {
    return (
      <View className="flex-1 bg-gray-900 items-center justify-center px-6">
        <MessageCircle color="#f97316" size={64} />
        <Text className="text-2xl font-bold text-white mt-4 mb-2 text-center">
          Nenhuma conversa ainda
        </Text>
        <Text className="text-gray-400 text-center">
          Quando um match for aprovado por uma ONG, a conversa aparecerá aqui.
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-900">
      <View className="px-6 pt-12 pb-4">
        <Text className="text-2xl font-bold text-white">Conversas 💬</Text>
        <Text className="text-gray-400 mt-1">{conversas.length} conversa{conversas.length !== 1 ? 's' : ''}</Text>
      </View>

      <FlatList
        data={conversas}
        keyExtractor={(item) => item.match.id}
        contentContainerStyle={{ padding: 16, gap: 12 }}
        testID="conversas-list"
        renderItem={({ item }) => (
          <Pressable
            className="bg-gray-800 rounded-2xl overflow-hidden flex-row items-center p-4 gap-4"
            onPress={() => router.push(`/chat/${item.match.id}`)}
            testID={`conversa-${item.match.id}`}
          >
            <View className="w-16 h-16 rounded-full bg-gray-700 overflow-hidden">
              {item.animal.foto_url ? (
                <Image
                  source={{ uri: item.animal.foto_url }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              ) : null}
            </View>
            <View className="flex-1">
              <Text className="text-white font-bold text-base">{item.animal.nome}</Text>
              <Text className="text-gray-400 text-sm capitalize">
                {item.animal.tipo} • {item.animal.porte}
              </Text>
            </View>
            <MessageCircle color="#f97316" size={20} />
          </Pressable>
        )}
      />
    </View>
  );
}
