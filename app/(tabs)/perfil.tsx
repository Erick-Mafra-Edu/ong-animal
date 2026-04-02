import { View, Text, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { supabase, UserProfile } from '../../services/supabase';
import { User, LogOut, Settings } from 'lucide-react-native';

export default function Perfil() {
  const router = useRouter();
  const [perfil, setPerfil] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarPerfil();
  }, []);

  const carregarPerfil = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();
      setPerfil(data);
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace('/(auth)/login');
  };

  if (loading) {
    return (
      <View className="flex-1 bg-gray-900 items-center justify-center">
        <Text className="text-gray-400">Carregando perfil...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-900">
      <View className="px-6 pt-12 pb-8">
        <Text className="text-2xl font-bold text-white mb-8">Meu Perfil</Text>

        {/* Avatar */}
        <View className="items-center mb-8">
          <View className="w-24 h-24 rounded-full bg-gray-800 border-4 border-orange-500 items-center justify-center">
            <User color="#f97316" size={48} />
          </View>
          <Text className="text-xl font-bold text-white mt-4" testID="perfil-nome">
            {perfil?.nome ?? 'Usuário'}
          </Text>
          <Text className="text-gray-400 mt-1" testID="perfil-cidade">
            📍 {perfil?.cidade ?? 'Cidade não informada'}
          </Text>
          <View className="bg-gray-800 px-4 py-1 rounded-full mt-2">
            <Text className="text-orange-400 text-sm font-medium capitalize">
              {perfil?.tipo_usuario === 'ong' ? '🏢 ONG' : '🏠 Adotante'}
            </Text>
          </View>
        </View>

        {/* Menu de opções */}
        <View className="gap-3">
          <Pressable
            className="bg-gray-800 rounded-xl p-4 flex-row items-center gap-4"
            onPress={() => router.push('/(onboarding)/perguntas')}
            testID="editar-preferencias"
          >
            <Settings color="#f97316" size={24} />
            <View className="flex-1">
              <Text className="text-white font-semibold">Editar preferências</Text>
              <Text className="text-gray-400 text-sm">Atualize suas preferências de adoção</Text>
            </View>
            <Text className="text-gray-500">›</Text>
          </Pressable>

          {perfil?.tipo_usuario === 'ong' && (
            <Pressable
              className="bg-gray-800 rounded-xl p-4 flex-row items-center gap-4"
              onPress={() => router.push('/(ong)/dashboard')}
              testID="painel-ong"
            >
              <View className="flex-1">
                <Text className="text-white font-semibold">Painel da ONG</Text>
                <Text className="text-gray-400 text-sm">Gerencie seus animais e adoções</Text>
              </View>
              <Text className="text-gray-500">›</Text>
            </Pressable>
          )}

          <Pressable
            className="bg-red-900/30 rounded-xl p-4 flex-row items-center gap-4 border border-red-900"
            onPress={handleLogout}
            testID="logout-button"
          >
            <LogOut color="#f87171" size={24} />
            <Text className="text-red-400 font-semibold">Sair da conta</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}
