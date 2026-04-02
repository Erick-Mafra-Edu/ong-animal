import { View, Text, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { supabase } from '../../services/supabase';
import { PlusCircle, Users } from 'lucide-react-native';

export default function Dashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({
    total: 0,
    disponiveis: 0,
    adotados: 0,
    interessados: 0,
  });

  useEffect(() => {
    carregarStats();
  }, []);

  const carregarStats = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: animais } = await supabase
      .from('animals')
      .select('*')
      .eq('ong_id', user.id);

    if (animais) {
      const total = animais.length;
      const disponiveis = animais.filter(a => a.status === 'disponivel').length;
      const adotados = animais.filter(a => a.status === 'adotado').length;

      const animalIds = animais.map(a => a.id);
      let interessados = 0;
      if (animalIds.length > 0) {
        const { count } = await supabase
          .from('matches')
          .select('*', { count: 'exact', head: true })
          .in('animal_id', animalIds)
          .eq('status', 'aguardando');
        interessados = count ?? 0;
      }

      setStats({ total, disponiveis, adotados, interessados });
    }
  };

  return (
    <ScrollView className="flex-1 bg-gray-900">
      <View className="px-6 pt-12 pb-8">
        <Text className="text-2xl font-bold text-white mb-2">Painel da ONG 🏢</Text>
        <Text className="text-gray-400 mb-8">Gerencie seus animais para adoção</Text>

        {/* Cards de estatísticas */}
        <View className="flex-row flex-wrap gap-4 mb-8">
          <View className="flex-1 bg-gray-800 rounded-2xl p-4 min-w-[140px]" testID="stat-total">
            <Text className="text-3xl font-bold text-white">{stats.total}</Text>
            <Text className="text-gray-400 text-sm mt-1">Total de animais</Text>
          </View>
          <View className="flex-1 bg-gray-800 rounded-2xl p-4 min-w-[140px]" testID="stat-disponiveis">
            <Text className="text-3xl font-bold text-green-400">{stats.disponiveis}</Text>
            <Text className="text-gray-400 text-sm mt-1">Disponíveis</Text>
          </View>
          <View className="flex-1 bg-gray-800 rounded-2xl p-4 min-w-[140px]" testID="stat-adotados">
            <Text className="text-3xl font-bold text-blue-400">{stats.adotados}</Text>
            <Text className="text-gray-400 text-sm mt-1">Adotados</Text>
          </View>
          <View className="flex-1 bg-gray-800 rounded-2xl p-4 min-w-[140px]" testID="stat-interessados">
            <Text className="text-3xl font-bold text-orange-400">{stats.interessados}</Text>
            <Text className="text-gray-400 text-sm mt-1">Aguardando</Text>
          </View>
        </View>

        {/* Ações rápidas */}
        <Text className="text-lg font-semibold text-white mb-4">Ações rápidas</Text>
        <View className="gap-3">
          <Pressable
            className="bg-orange-500 rounded-2xl p-5 flex-row items-center gap-4"
            onPress={() => router.push('/(ong)/cadastrar-animal')}
            testID="cadastrar-animal-btn"
          >
            <PlusCircle color="#ffffff" size={28} />
            <View className="flex-1">
              <Text className="text-white font-bold text-lg">Cadastrar animal</Text>
              <Text className="text-orange-200 text-sm">Adicionar novo animal para adoção</Text>
            </View>
          </Pressable>

          <Pressable
            className="bg-gray-800 rounded-2xl p-5 flex-row items-center gap-4"
            onPress={() => router.push('/(ong)/interessados')}
            testID="ver-interessados-btn"
          >
            <Users color="#f97316" size={28} />
            <View className="flex-1">
              <Text className="text-white font-bold text-lg">Ver interessados</Text>
              <Text className="text-gray-400 text-sm">Aprovar ou recusar adoções</Text>
            </View>
            {stats.interessados > 0 && (
              <View className="bg-orange-500 rounded-full w-6 h-6 items-center justify-center">
                <Text className="text-white text-xs font-bold">{stats.interessados}</Text>
              </View>
            )}
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}
