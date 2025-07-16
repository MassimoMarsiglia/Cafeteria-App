import exportDatabase from '@/utils/database';
import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import OpenAI from 'openai';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import MessageBubble from '@/components/Chatbot/MessageBubble';
import { Chat, Message } from '@/database/schema';
import { useChatBotService } from '@/services/chatBotService';
import { useGetMealsQuery } from '@/services/mensaApi';

const ChatBotScreen = () => {
  const { mealId } = useLocalSearchParams();
  const { persistMessages, loadChat, newChat, findChatById } =
    useChatBotService();
  const {
    data: meal,
    isLoading,
    error,
  } = useGetMealsQuery({ ID: mealId as string });
  const flatListRef = useRef<FlatList<any>>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const callAIWithPrompt = useCallback(
    async (prompt: string) => {
      setIsTyping(true);

      try {
        const openAi = new OpenAI({
          baseURL: 'https://openrouter.ai/api/v1',
          apiKey:
            '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',
        });

        const response = await openAi.chat.completions.create({
          model: 'openai/gpt-4o',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 1000,
        });

        const aiReply = response.choices[0].message.content;

        const botMessage: Message = {
          chatId: mealId as string,
          text: aiReply || 'Keine Antwort erhalten.',
          sender: 'bot',
        };
        const newMessage = await persistMessages([botMessage]);
        if (!newMessage) return;
        setMessages(prev => [...prev, ...newMessage]);
      } catch (err) {
        console.error('AI API error:', err);
        const errorMessage: Message = {
          chatId: mealId as string,
          text: 'Fehler beim Abrufen der AI-Antwort.',
          sender: 'bot',
        };
        setMessages(prev => [...prev, errorMessage]);
      } finally {
        setIsTyping(false);
      }
    },
    [mealId],
  );

  useEffect(() => {
    const loadMessages = async () => {
      if (!meal || isLoading) return;

      const chat = await findChatById(mealId as string);
      if (!chat) {
        const chat: Chat = {
          id: mealId as string,
          name: meal[0].name,
        };
        await newChat(chat);
      }
      const messages = await loadChat(meal[0].id as string);
      if (messages.length === 0) {
        const messages = [
          {
            chatId: mealId as string,
            text: `Das Gericht heißt "${meal[0].name}". Ich helfe dir dabei, ein Rezept dafür zu erstellen …`,
            sender: 'bot',
            createdAt: Date.now(),
          },
        ];
        const newMessage = await persistMessages(messages);
        if (!newMessage) return;
        setMessages(prev => [...prev, ...newMessage]);

        const systemPrompt = `Du wirst ein Rezept erstellen, das auf dem Gericht "${meal[0].name}" basiert. Das Rezept soll alle notwendigen Schritte, Zutaten und Kochtechniken enthalten. Es soll so strukturiert sein, dass es leicht verständlich und umsetzbar ist – unabhängig vom kulinarischen Können der Leserinnen und Leser.`;
        callAIWithPrompt(systemPrompt);
      } else {
        setMessages(messages);
      }
    };
    loadMessages();
  }, [meal, mealId, isLoading, callAIWithPrompt]);

  const sendMessage = async () => {
    if (inputText.trim().length === 0 || !meal) return;

    const userMessage: Message = {
      chatId: mealId as string,
      text: inputText,
      sender: 'user',
    };

    const newMessage = await persistMessages([userMessage]);
    if (!newMessage) return;
    setMessages(prev => [...prev, ...newMessage]);

    const promptForAI = `Der Benutzer fragt nach „${meal[0].name}“. Seine Nachricht lautet: „${inputText}“. Bitte antworte hilfreich.`;
    callAIWithPrompt(promptForAI);
    setInputText('');
  };

  const renderItem = ({ item }: { item: Message }) => (
    <MessageBubble message={item} />
  );

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 40}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View className="flex-1">
            <FlatList
              ref={flatListRef}
              data={
                isTyping
                  ? [
                      ...messages,
                      {
                        id: -1, // Use a numeric id for the typing indicator
                        sender: 'bot',
                        chatId: mealId as string,
                        text: '',
                        createdAt: Date.now(),
                      },
                    ]
                  : messages
              }
              keyExtractor={item => String(item.id)}
              renderItem={renderItem}
              contentContainerStyle={{ padding: 16, flexGrow: 1 }}
              onContentSizeChange={() =>
                flatListRef.current?.scrollToEnd({ animated: true })
              }
              keyboardShouldPersistTaps="handled"
            />

            {/* Export DB Button, only for developing. Please uncomment when we don't need it  */}
            <TouchableOpacity
              onPress={exportDatabase}
              style={{
                position: 'absolute',
                bottom: 90, // above input bar
                right: 20,
                backgroundColor: '#4f46e5',
                paddingHorizontal: 16,
                paddingVertical: 10,
                borderRadius: 30,
                zIndex: 10,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 3,
                elevation: 5,
              }}
            >
              <Text style={{ color: 'white', fontWeight: 'bold' }}>
                📤 Export DB
              </Text>
            </TouchableOpacity>

            <View className="flex-row items-center border-t border-gray-300 dark:border-gray-700 px-4 py-4 bg-white dark:bg-gray-900">
              <TextInput
                className="flex-1 min-h-12 px-4 py-2 rounded-full border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                multiline
                value={inputText}
                onChangeText={setInputText}
                placeholder="Type your message..."
                onSubmitEditing={sendMessage}
              />
              <TouchableOpacity
                onPress={sendMessage}
                className="ml-2 bg-blue-600 dark:bg-blue-500 rounded-full p-3 items-center justify-center"
                accessibilityLabel="Send message"
              >
                <Feather name="send" size={24} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatBotScreen;
