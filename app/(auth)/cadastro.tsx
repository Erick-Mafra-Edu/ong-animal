import { View, Text, TextInput, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { supabase, TipoUsuario } from '../../services/supabase';

export default function Cadastro() {
  const router = useRouter();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [cidade, setCidade] = useState('');
  const [tipoUsuario, setTipoUsuario] = useState<TipoUsuario>('adotante');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  const handleCadastro = async () => {
    if (!nome || !email || !senha || !cidade) {
      setErro('Preencha todos os campos.');
      return;
    }
    setLoading(true);
    setErro('');

    const { data, error } = await supabase.auth.signUp({ email, password: senha });
    if (error || !data.user) {
      setLoading(false);
      setErro(error?.message ?? 'Erro ao cadastrar.');
      return;
    }

    const { error: profileError } = await supabase.from('users').insert({
      id: data.user.id,
      nome,
      cidade,
      tipo_usuario: tipoUsuario,
    });

    setLoading(false);
    if (profileError) {
      setErro(profileError.message);
      return;
    }

    if (tipoUsuario === 'adotante') {
      router.replace('/(onboarding)/perguntas');
    } else {
      router.replace('/(ong)/dashboard');
    }
  };

  return (
    <ScrollView className="flex-1 bg-gray-900">
      <View className="flex-1 px-6 py-12">
        <Pressable
          className="mb-8"
          onPress={() => router.back()}
          testID="back-button"
        >
          <Text className="text-gray-400">← Voltar</Text>
        </Pressable>

        <Text className="text-2xl font-bold text-white mb-8">Criar conta</Text>

        <View className="gap-4">
          <View>
            <Text className="text-gray-300 mb-2 font-medium">Nome</Text>
            <TextInput
              className="bg-gray-800 text-white rounded-xl px-4 py-4 text-base border border-gray-700"
              placeholder="Seu nome completo"
              placeholderTextColor="#6b7280"
              value={nome}
              onChangeText={setNome}
              testID="nome-input"
            />
          </View>

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
              placeholder="Mínimo 6 caracteres"
              placeholderTextColor="#6b7280"
              value={senha}
              onChangeText={setSenha}
              secureTextEntry
              testID="senha-input"
            />
          </View>

          <View>
            <Text className="text-gray-300 mb-2 font-medium">Cidade</Text>
            <TextInput
              className="bg-gray-800 text-white rounded-xl px-4 py-4 text-base border border-gray-700"
              placeholder="Sua cidade"
              placeholderTextColor="#6b7280"
              value={cidade}
              onChangeText={setCidade}
              testID="cidade-input"
            />
          </View>

          <View>
            <Text className="text-gray-300 mb-3 font-medium">Tipo de conta</Text>
            <View className="flex-row gap-3">
              <Pressable
                className={`flex-1 py-3 rounded-xl items-center border-2 ${
                  tipoUsuario === 'adotante'
                    ? 'bg-orange-500 border-orange-500'
                    : 'bg-transparent border-gray-700'
                }`}
                onPress={() => setTipoUsuario('adotante')}
                testID="tipo-adotante"
              >
                <Text className={`font-semibold ${tipoUsuario === 'adotante' ? 'text-white' : 'text-gray-400'}`}>
                  🏠 Adotante
                </Text>
              </Pressable>
              <Pressable
                className={`flex-1 py-3 rounded-xl items-center border-2 ${
                  tipoUsuario === 'ong'
                    ? 'bg-orange-500 border-orange-500'
                    : 'bg-transparent border-gray-700'
                }`}
                onPress={() => setTipoUsuario('ong')}
                testID="tipo-ong"
              >
                <Text className={`font-semibold ${tipoUsuario === 'ong' ? 'text-white' : 'text-gray-400'}`}>
                  🏢 ONG
                </Text>
              </Pressable>
            </View>
          </View>

          {erro ? (
            <Text className="text-red-400 text-sm">{erro}</Text>
          ) : null}

          <Pressable
            className="bg-orange-500 rounded-xl py-4 items-center mt-4"
            onPress={handleCadastro}
            disabled={loading}
            testID="cadastrar-button"
          >
            <Text className="text-white font-bold text-lg">
              {loading ? 'Cadastrando...' : 'Criar conta'}
            </Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}
