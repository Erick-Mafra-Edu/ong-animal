import { View, Text, FlatList, Pressable, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { supabase, Match, Animal, UserProfile } from '../../services/supabase';
import { MessageCircle, ArrowLeft } from 'lucide-react-native';

interface ConversaOng {
  match: Match;
  animal: Animal;
  adotante: UserProfile;
}

export default function MensagensOng() {
  const router = useRouter();
  const [conversas, setConversas] = useState<ConversaOng[]>([]);
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

    const { data: animais } = await supabase
      .from('animals')
      .select('*')
      .eq('ong_id', user.id);

    if (!animais?.length) {
      setLoading(false);
      return;
    }

    const animalIds = animais.map((a) => a.id);
    const { data: matches } = await supabase
      .from('matches')
      .select('*')
      .in('animal_id', animalIds)
      .eq('status', 'aprovado');

    if (matches?.length) {
      const userIds = matches.map((m) => m.user_id);
      const { data: usuarios } = await supabase
        .from('users')
        .select('*')
        .in('id', userIds);

      const lista: ConversaOng[] = matches.map((match) => ({
        match,
        animal: animais.find((a) => a.id === match.animal_id)!,
        adotante: (usuarios ?? []).find((u) => u.id === match.user_id) as UserProfile,
      }));

      setConversas(lista.filter((c) => c.animal && c.adotante));
    }

    setLoading(false);
  };

  if (loading) {
    return (
      <View className="flex-1 bg-gray-900 items-center justify-center">
        <Text className="text-gray-400">Carregando mensagens...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-900">
      <View className="px-6 pt-12 pb-4 flex-row items-center gap-4">
        <Pressable onPress={() => router.back()} testID="back-button">
          <ArrowLeft color="#9ca3af" size={24} />
        </Pressable>
        <Text className="text-2xl font-bold text-white flex-1">Mensagens</Text>
      </View>

      {conversas.length === 0 ? (
        <View className="flex-1 items-center justify-center px-6">
          <MessageCircle color="#f97316" size={64} />
          <Text className="text-xl font-bold text-white mt-4 mb-2 text-center">
            Nenhuma conversa ativa
          </Text>
          <Text className="text-gray-400 text-center">
            As conversas com adotantes aprovados aparecerão aqui.
          </Text>
        </View>
      ) : (
        <FlatList
          data={conversas}
          keyExtractor={(item) => item.match.id}
          contentContainerStyle={{ padding: 16, gap: 12 }}
          testID="mensagens-list"
          renderItem={({ item }) => (
            <Pressable
              className="bg-gray-800 rounded-2xl p-4 flex-row items-center gap-4"
              onPress={() => router.push(`/chat/${item.match.id}`)}
              testID={`mensagem-${item.match.id}`}
            >
              <View className="w-14 h-14 rounded-full bg-gray-700 overflow-hidden">
                {item.animal.foto_url ? (
                  <Image
                    source={{ uri: item.animal.foto_url }}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                ) : null}
              </View>
              <View className="flex-1">
                <Text className="text-white font-bold">{item.adotante?.nome ?? 'Adotante'}</Text>
                <Text className="text-gray-400 text-sm">
                  Sobre: {item.animal.nome}
                </Text>
              </View>
              <MessageCircle color="#f97316" size={20} />
            </Pressable>
          )}
        />
      )}
    </View>
  );
}
