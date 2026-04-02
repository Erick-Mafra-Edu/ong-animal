import { View, Text, Pressable, FlatList, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { supabase, Match, Animal, UserProfile } from '../../services/supabase';
import { CheckCircle, XCircle, MessageCircle } from 'lucide-react-native';

interface Interessado {
  match: Match;
  animal: Animal;
  adotante: UserProfile;
}

export default function Interessados() {
  const router = useRouter();
  const [interessados, setInteressados] = useState<Interessado[]>([]);
  const [aprovados, setAprovados] = useState<Interessado[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarInteressados();
  }, []);

  const carregarInteressados = async () => {
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

    const animalIds = animais.map(a => a.id);

    const { data: matchesPendentes } = await supabase
      .from('matches')
      .select('*')
      .in('animal_id', animalIds)
      .eq('status', 'aguardando');

    const { data: matchesAprovados } = await supabase
      .from('matches')
      .select('*')
      .in('animal_id', animalIds)
      .eq('status', 'aprovado');

    const allMatches = [
      ...(matchesPendentes ?? []),
      ...(matchesAprovados ?? []),
    ];

    if (allMatches.length) {
      const userIds = [...new Set(allMatches.map(m => m.user_id))];
      const { data: usuarios } = await supabase
        .from('users')
        .select('*')
        .in('id', userIds);

      const buildLista = (matches: Match[]): Interessado[] =>
        matches.map(match => ({
          match,
          animal: animais.find(a => a.id === match.animal_id)!,
          adotante: (usuarios ?? []).find(u => u.id === match.user_id) as UserProfile,
        })).filter(i => i.animal && i.adotante);

      setInteressados(buildLista(matchesPendentes ?? []));
      setAprovados(buildLista(matchesAprovados ?? []));
    }

    setLoading(false);
  };

  const atualizarStatus = async (matchId: string, status: 'aprovado' | 'recusado') => {
    const { error } = await supabase
      .from('matches')
      .update({ status })
      .eq('id', matchId);

    if (error) return;

    if (status === 'aprovado') {
      const aprovado = interessados.find(i => i.match.id === matchId);
      if (aprovado) {
        setAprovados(prev => [...prev, { ...aprovado, match: { ...aprovado.match, status: 'aprovado' } }]);
      }
    }
    setInteressados(prev => prev.filter(i => i.match.id !== matchId));
  };

  if (loading) {
    return (
      <View className="flex-1 bg-gray-900 items-center justify-center">
        <Text className="text-gray-400">Carregando interessados...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-900">
      <View className="px-6 pt-12 pb-4 flex-row items-center gap-4">
        <Pressable onPress={() => router.back()} testID="back-button">
          <Text className="text-gray-400">←</Text>
        </Pressable>
        <Text className="text-2xl font-bold text-white">Interessados</Text>
      </View>

      {interessados.length === 0 && aprovados.length === 0 ? (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-5xl mb-4">👥</Text>
          <Text className="text-xl font-bold text-white text-center mb-2">
            Nenhum interessado pendente
          </Text>
          <Text className="text-gray-400 text-center">
            Quando alguém demonstrar interesse em seus animais, aparecerá aqui.
          </Text>
        </View>
      ) : (
        <FlatList
          data={[
            ...interessados.map(i => ({ ...i, secao: 'pendente' as const })),
            ...aprovados.map(i => ({ ...i, secao: 'aprovado' as const })),
          ]}
          keyExtractor={item => item.match.id}
          contentContainerStyle={{ padding: 16, gap: 12 }}
          renderItem={({ item }) => (
            <View className="bg-gray-800 rounded-2xl overflow-hidden" testID={`interessado-${item.match.id}`}>
              <View className="flex-row p-4 gap-4">
                {/* Foto do animal */}
                <View className="w-20 h-20 rounded-xl bg-gray-700 overflow-hidden">
                  {item.animal.foto_url ? (
                    <Image
                      source={{ uri: item.animal.foto_url }}
                      className="w-full h-full"
                      resizeMode="cover"
                    />
                  ) : null}
                </View>

                {/* Informações */}
                <View className="flex-1">
                  <Text className="text-white font-bold text-lg">{item.animal.nome}</Text>
                  <Text className="text-gray-400 text-sm capitalize">
                    {item.animal.tipo} • {item.animal.porte}
                  </Text>
                  <View className="mt-2 bg-gray-700 rounded-lg px-3 py-1 self-start">
                    <Text className="text-gray-300 text-sm">
                      Adotante: {item.adotante?.nome ?? 'Desconhecido'}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Botões de ação */}
              {item.secao === 'pendente' ? (
                <View className="flex-row border-t border-gray-700">
                  <Pressable
                    className="flex-1 flex-row items-center justify-center gap-2 py-4 border-r border-gray-700"
                    onPress={() => atualizarStatus(item.match.id, 'recusado')}
                    testID={`recusar-${item.match.id}`}
                  >
                    <XCircle color="#f87171" size={20} />
                    <Text className="text-red-400 font-semibold">Recusar</Text>
                  </Pressable>
                  <Pressable
                    className="flex-1 flex-row items-center justify-center gap-2 py-4"
                    onPress={() => atualizarStatus(item.match.id, 'aprovado')}
                    testID={`aprovar-${item.match.id}`}
                  >
                    <CheckCircle color="#4ade80" size={20} />
                    <Text className="text-green-400 font-semibold">Aprovar</Text>
                  </Pressable>
                </View>
              ) : (
                <View className="flex-row border-t border-gray-700">
                  <View className="flex-1 flex-row items-center justify-center gap-2 py-3">
                    <CheckCircle color="#4ade80" size={16} />
                    <Text className="text-green-400 text-sm font-semibold">Aprovado</Text>
                  </View>
                  <Pressable
                    className="flex-1 flex-row items-center justify-center gap-2 py-4 border-l border-gray-700"
                    onPress={() => router.push(`/chat/${item.match.id}`)}
                    testID={`chat-${item.match.id}`}
                  >
                    <MessageCircle color="#f97316" size={20} />
                    <Text className="text-orange-400 font-semibold">Chat</Text>
                  </Pressable>
                </View>
              )}
            </View>
          )}
        />
      )}
    </View>
  );
}
