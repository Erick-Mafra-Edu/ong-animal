import { View, Text, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { supabase } from '../../services/supabase';

interface Pergunta {
  id: string;
  titulo: string;
  opcoes: { label: string; valor: string }[];
  campo: string;
}

const perguntas: Pergunta[] = [
  {
    id: 'moradia',
    titulo: 'Onde você mora?',
    campo: 'tipo_moradia',
    opcoes: [
      { label: '🏠 Casa', valor: 'casa' },
      { label: '🏢 Apartamento', valor: 'apartamento' },
    ],
  },
  {
    id: 'criancas',
    titulo: 'Tem crianças em casa?',
    campo: 'tem_criancas',
    opcoes: [
      { label: '✅ Sim', valor: 'true' },
      { label: '❌ Não', valor: 'false' },
    ],
  },
  {
    id: 'tempo',
    titulo: 'Quanto tempo tem para brincar com seu pet?',
    campo: 'tempo_para_brincar',
    opcoes: [
      { label: '⏰ Pouco (< 1h/dia)', valor: 'pouco' },
      { label: '🕐 Moderado (1-3h/dia)', valor: 'moderado' },
      { label: '🕑 Muito (> 3h/dia)', valor: 'muito' },
    ],
  },
  {
    id: 'atividade',
    titulo: 'Qual seu nível de atividade física?',
    campo: 'nivel_atividade',
    opcoes: [
      { label: '🛋️ Sedentário', valor: 'baixo' },
      { label: '🚶 Moderado', valor: 'medio' },
      { label: '🏃 Ativo', valor: 'alto' },
    ],
  },
  {
    id: 'experiencia',
    titulo: 'Já teve animais antes?',
    campo: 'experiencia_animais',
    opcoes: [
      { label: '🐾 Sim, já tive', valor: 'sim' },
      { label: '🆕 É meu primeiro', valor: 'nao' },
    ],
  },
  {
    id: 'tipo',
    titulo: 'Prefere qual tipo de animal?',
    campo: 'prefere_tipo',
    opcoes: [
      { label: '🐕 Cachorro', valor: 'cachorro' },
      { label: '🐈 Gato', valor: 'gato' },
      { label: '💛 Qualquer um', valor: 'qualquer' },
    ],
  },
  {
    id: 'porte',
    titulo: 'Prefere qual porte?',
    campo: 'prefere_porte',
    opcoes: [
      { label: '🐭 Pequeno', valor: 'pequeno' },
      { label: '🐕 Médio', valor: 'medio' },
      { label: '🦮 Grande', valor: 'grande' },
      { label: '💛 Qualquer', valor: 'qualquer' },
    ],
  },
  {
    id: 'idade',
    titulo: 'Prefere qual faixa etária?',
    campo: 'prefere_idade',
    opcoes: [
      { label: '🐣 Filhote', valor: 'filhote' },
      { label: '🐾 Adulto', valor: 'adulto' },
      { label: '🦴 Idoso', valor: 'idoso' },
      { label: '💛 Qualquer', valor: 'qualquer' },
    ],
  },
];

export default function Perguntas() {
  const router = useRouter();
  const [etapaAtual, setEtapaAtual] = useState(0);
  const [respostas, setRespostas] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const perguntaAtual = perguntas[etapaAtual];
  const progresso = ((etapaAtual) / perguntas.length) * 100;

  const selecionarOpcao = (campo: string, valor: string) => {
    setRespostas(prev => ({ ...prev, [campo]: valor }));
  };

  const avancar = async () => {
    if (!respostas[perguntaAtual.campo]) return;

    if (etapaAtual < perguntas.length - 1) {
      setEtapaAtual(prev => prev + 1);
    } else {
      await salvarPreferencias();
    }
  };

  const salvarPreferencias = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from('user_preferences').upsert({
        user_id: user.id,
        tipo_moradia: respostas['tipo_moradia'],
        tem_criancas: respostas['tem_criancas'] === 'true',
        tempo_para_brincar: respostas['tempo_para_brincar'],
        nivel_atividade: respostas['nivel_atividade'],
        experiencia_animais: respostas['experiencia_animais'],
        prefere_tipo: respostas['prefere_tipo'],
        prefere_porte: respostas['prefere_porte'],
        prefere_idade: respostas['prefere_idade'],
      });
    }
    setLoading(false);
    router.replace('/(tabs)/swipe');
  };

  return (
    <View className="flex-1 bg-gray-900">
      {/* Barra de progresso */}
      <View className="px-6 pt-12 pb-4">
        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-gray-400 text-sm">
            {etapaAtual + 1} de {perguntas.length}
          </Text>
          <Text className="text-gray-400 text-sm">
            {Math.round(((etapaAtual + 1) / perguntas.length) * 100)}%
          </Text>
        </View>
        <View className="h-2 bg-gray-700 rounded-full">
          <View
            className="h-2 bg-orange-500 rounded-full"
            style={{ width: `${((etapaAtual + 1) / perguntas.length) * 100}%` }}
          />
        </View>
      </View>

      <ScrollView className="flex-1 px-6 py-8">
        {/* Título da pergunta */}
        <Text className="text-3xl font-bold text-white mb-10" testID="pergunta-titulo">
          {perguntaAtual.titulo}
        </Text>

        {/* Opções */}
        <View className="gap-3">
          {perguntaAtual.opcoes.map(opcao => {
            const selecionada = respostas[perguntaAtual.campo] === opcao.valor;
            return (
              <Pressable
                key={opcao.valor}
                className={`py-4 px-6 rounded-xl border-2 ${
                  selecionada
                    ? 'bg-orange-500 border-orange-500'
                    : 'bg-gray-800 border-gray-700'
                }`}
                onPress={() => selecionarOpcao(perguntaAtual.campo, opcao.valor)}
                testID={`opcao-${opcao.valor}`}
              >
                <Text
                  className={`text-lg font-medium ${selecionada ? 'text-white' : 'text-gray-300'}`}
                >
                  {opcao.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      {/* Botão avançar */}
      <View className="px-6 py-6">
        <Pressable
          className={`py-4 rounded-xl items-center ${
            respostas[perguntaAtual.campo]
              ? 'bg-orange-500'
              : 'bg-gray-700'
          }`}
          onPress={avancar}
          disabled={!respostas[perguntaAtual.campo] || loading}
          testID="avancar-button"
        >
          <Text className="text-white font-bold text-lg">
            {loading ? 'Salvando...' : etapaAtual < perguntas.length - 1 ? 'Próximo →' : 'Começar a explorar 🐾'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
