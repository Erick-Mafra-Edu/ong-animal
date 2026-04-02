import { View, Text, TextInput, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { supabase } from '../../services/supabase';

const TIPOS = ['cachorro', 'gato'];
const PORTES = ['pequeno', 'medio', 'grande'];
const NIVEIS_ENERGIA = ['baixo', 'medio', 'alto'];

export default function CadastrarAnimal() {
  const router = useRouter();
  const [nome, setNome] = useState('');
  const [tipo, setTipo] = useState('');
  const [idade, setIdade] = useState('');
  const [porte, setPorte] = useState('');
  const [nivelEnergia, setNivelEnergia] = useState('');
  const [descricao, setDescricao] = useState('');
  const [fotoUrl, setFotoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  const handleCadastrar = async () => {
    if (!nome || !tipo || !idade || !porte || !nivelEnergia) {
      setErro('Preencha todos os campos obrigatórios.');
      return;
    }

    setLoading(true);
    setErro('');

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setErro('Usuário não autenticado.');
      setLoading(false);
      return;
    }

    const { error } = await supabase.from('animals').insert({
      ong_id: user.id,
      nome,
      tipo,
      idade,
      porte,
      nivel_energia: nivelEnergia,
      descricao,
      foto_url: fotoUrl,
      status: 'disponivel',
    });

    setLoading(false);
    if (error) {
      setErro(error.message);
    } else {
      router.replace('/(ong)/dashboard');
    }
  };

  const SeletorOpcoes = ({
    label,
    opcoes,
    valor,
    aoSelecionar,
    testIDPrefix,
  }: {
    label: string;
    opcoes: string[];
    valor: string;
    aoSelecionar: (v: string) => void;
    testIDPrefix: string;
  }) => (
    <View>
      <Text className="text-gray-300 mb-2 font-medium">{label}</Text>
      <View className="flex-row flex-wrap gap-2">
        {opcoes.map(opcao => (
          <Pressable
            key={opcao}
            className={`px-4 py-2 rounded-full border ${
              valor === opcao
                ? 'bg-orange-500 border-orange-500'
                : 'bg-gray-800 border-gray-700'
            }`}
            onPress={() => aoSelecionar(opcao)}
            testID={`${testIDPrefix}-${opcao}`}
          >
            <Text
              className={`font-medium capitalize ${
                valor === opcao ? 'text-white' : 'text-gray-400'
              }`}
            >
              {opcao}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );

  return (
    <ScrollView className="flex-1 bg-gray-900">
      <View className="px-6 py-12">
        <Text className="text-2xl font-bold text-white mb-8">Cadastrar animal</Text>

        <View className="gap-5">
          <View>
            <Text className="text-gray-300 mb-2 font-medium">Nome *</Text>
            <TextInput
              className="bg-gray-800 text-white rounded-xl px-4 py-4 text-base border border-gray-700"
              placeholder="Nome do animal"
              placeholderTextColor="#6b7280"
              value={nome}
              onChangeText={setNome}
              testID="nome-input"
            />
          </View>

          <SeletorOpcoes
            label="Tipo *"
            opcoes={TIPOS}
            valor={tipo}
            aoSelecionar={setTipo}
            testIDPrefix="tipo"
          />

          <View>
            <Text className="text-gray-300 mb-2 font-medium">Idade *</Text>
            <TextInput
              className="bg-gray-800 text-white rounded-xl px-4 py-4 text-base border border-gray-700"
              placeholder="Ex: 2 anos, 6 meses"
              placeholderTextColor="#6b7280"
              value={idade}
              onChangeText={setIdade}
              testID="idade-input"
            />
          </View>

          <SeletorOpcoes
            label="Porte *"
            opcoes={PORTES}
            valor={porte}
            aoSelecionar={setPorte}
            testIDPrefix="porte"
          />

          <SeletorOpcoes
            label="Nível de energia *"
            opcoes={NIVEIS_ENERGIA}
            valor={nivelEnergia}
            aoSelecionar={setNivelEnergia}
            testIDPrefix="energia"
          />

          <View>
            <Text className="text-gray-300 mb-2 font-medium">Descrição</Text>
            <TextInput
              className="bg-gray-800 text-white rounded-xl px-4 py-4 text-base border border-gray-700"
              placeholder="Conte um pouco sobre o animal..."
              placeholderTextColor="#6b7280"
              value={descricao}
              onChangeText={setDescricao}
              multiline
              numberOfLines={4}
              testID="descricao-input"
            />
          </View>

          <View>
            <Text className="text-gray-300 mb-2 font-medium">URL da foto</Text>
            <TextInput
              className="bg-gray-800 text-white rounded-xl px-4 py-4 text-base border border-gray-700"
              placeholder="https://..."
              placeholderTextColor="#6b7280"
              value={fotoUrl}
              onChangeText={setFotoUrl}
              keyboardType="url"
              autoCapitalize="none"
              testID="foto-input"
            />
          </View>

          {erro ? (
            <Text className="text-red-400 text-sm">{erro}</Text>
          ) : null}

          <Pressable
            className="bg-orange-500 rounded-xl py-4 items-center mt-2"
            onPress={handleCadastrar}
            disabled={loading}
            testID="cadastrar-button"
          >
            <Text className="text-white font-bold text-lg">
              {loading ? 'Cadastrando...' : 'Cadastrar animal'}
            </Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}
