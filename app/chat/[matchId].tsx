import { View, Text, TextInput, Pressable, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { supabase } from '../../services/supabase';
import { createChatAdapter, ChatMessage, IChatAdapter } from '../../services/chat';
import { Send, ArrowLeft } from 'lucide-react-native';

export default function ChatScreen() {
  const { matchId } = useLocalSearchParams<{ matchId: string }>();
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [texto, setTexto] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const adapterRef = useRef<IChatAdapter | null>(null);
  const flatListRef = useRef<any>(null);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !mounted) return;

      setUserId(user.id);

      const adapter = createChatAdapter();
      adapterRef.current = adapter;

      const historico = await adapter.getHistory(matchId);
      if (mounted) setMessages(historico);

      adapter.onMessage((msg) => {
        if (mounted) {
          setMessages((prev) => {
            if (prev.find((m) => m.id === msg.id)) return prev;
            return [...prev, msg];
          });
        }
      });

      await adapter.connect(matchId);
      if (mounted) setLoading(false);
    };

    init();

    return () => {
      mounted = false;
      adapterRef.current?.disconnect();
    };
  }, [matchId]);

  const enviarMensagem = async () => {
    const conteudo = texto.trim();
    if (!conteudo || !userId || !adapterRef.current) return;

    setTexto('');
    await adapterRef.current.sendMessage(matchId, userId, conteudo);
  };

  useEffect(() => {
    if (messages.length > 0) {
      flatListRef.current?.scrollToEnd?.({ animated: true });
    }
  }, [messages]);

  if (loading) {
    return (
      <View className="flex-1 bg-gray-900 items-center justify-center">
        <Text className="text-gray-400">Carregando conversa...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-gray-900"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      {/* Header */}
      <View className="px-4 pt-12 pb-4 flex-row items-center gap-3 border-b border-gray-800">
        <Pressable onPress={() => router.back()} testID="back-button">
          <ArrowLeft color="#9ca3af" size={24} />
        </Pressable>
        <Text className="text-white font-bold text-lg flex-1">Conversa</Text>
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, gap: 8 }}
        testID="messages-list"
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center py-12">
            <Text className="text-gray-500 text-center">
              Nenhuma mensagem ainda.{'\n'}Diga olá! 👋
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          const isOwn = item.sender_id === userId;
          return (
            <View
              className={`max-w-xs px-4 py-2 rounded-2xl ${
                isOwn
                  ? 'self-end bg-orange-500 rounded-br-sm'
                  : 'self-start bg-gray-700 rounded-bl-sm'
              }`}
              testID={`message-${item.id}`}
            >
              <Text className={isOwn ? 'text-white' : 'text-gray-100'}>
                {item.conteudo}
              </Text>
              <Text
                className={`text-xs mt-1 ${isOwn ? 'text-orange-200' : 'text-gray-400'}`}
              >
                {new Date(item.created_at).toLocaleTimeString('pt-BR', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            </View>
          );
        }}
      />

      {/* Input */}
      <View className="flex-row items-center px-4 py-3 gap-3 border-t border-gray-800 bg-gray-900">
        <TextInput
          className="flex-1 bg-gray-800 text-white rounded-full px-4 py-3"
          placeholder="Digite uma mensagem..."
          placeholderTextColor="#6b7280"
          value={texto}
          onChangeText={setTexto}
          multiline
          testID="message-input"
        />
        <Pressable
          className="w-12 h-12 bg-orange-500 rounded-full items-center justify-center"
          onPress={enviarMensagem}
          testID="send-button"
        >
          <Send color="white" size={20} />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
