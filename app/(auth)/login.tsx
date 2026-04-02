import { View, Text, TextInput, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { supabase } from '../../services/supabase';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  const handleLogin = async () => {
    if (!email || !senha) {
      setErro('Preencha todos os campos.');
      return;
    }
    setLoading(true);
    setErro('');
    const { error } = await supabase.auth.signInWithPassword({ email, password: senha });
    setLoading(false);
    if (error) {
      setErro(error.message);
    } else {
      router.replace('/(tabs)/swipe');
    }
  };

  return (
    <ScrollView className="flex-1 bg-gray-900">
      <View className="flex-1 px-6 py-12">
        <View className="mb-10">
          <Text className="text-4xl font-bold text-white mb-2">ONG Animal 🐾</Text>
          <Text className="text-gray-400 text-lg">Encontre seu novo companheiro</Text>
        </View>

        <Text className="text-2xl font-bold text-white mb-8">Entrar</Text>

        <View className="gap-4">
          <View>
            <Text className="text-gray-300 mb-2 font-medium">E-mail</Text>
            <TextInput
              className="bg-gray-800 text-white rounded-xl px-4 py-4 text-base border border-gray-700"
              placeholder="seu@email.com"
              placeholderTextColor="#6b7280"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              testID="email-input"
            />
          </View>

          <View>
            <Text className="text-gray-300 mb-2 font-medium">Senha</Text>
            <TextInput
              className="bg-gray-800 text-white rounded-xl px-4 py-4 text-base border border-gray-700"
              placeholder="Sua senha"
              placeholderTextColor="#6b7280"
              value={senha}
              onChangeText={setSenha}
              secureTextEntry
              testID="senha-input"
            />
          </View>

          {erro ? (
            <Text className="text-red-400 text-sm">{erro}</Text>
          ) : null}

          <Pressable
            className="bg-orange-500 rounded-xl py-4 items-center mt-4"
            onPress={handleLogin}
            disabled={loading}
            testID="login-button"
          >
            <Text className="text-white font-bold text-lg">
              {loading ? 'Entrando...' : 'Entrar'}
            </Text>
          </Pressable>

          <Pressable
            className="items-center py-4"
            onPress={() => router.push('/(auth)/cadastro')}
            testID="cadastro-link"
          >
            <Text className="text-gray-400">
              Não tem conta?{' '}
              <Text className="text-orange-400 font-semibold">Cadastrar</Text>
            </Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}
