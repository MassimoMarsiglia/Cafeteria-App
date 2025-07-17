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
    async (prompt: string, mealName: string) => {
      setIsTyping(true);

      try {
        const openAi = new OpenAI({
          baseURL: 'https://openrouter.ai/api/v1',
          apiKey: 'API_KEY',
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
            text: `Das Gericht heißt "${meal[0].name}". Ich helfe dir dabei, ein Rezept dafür zu erstellen …

Bitte habe einen Moment Geduld – die Antwort des Bots kann ein paar Sekunden dauern`,
            sender: 'bot',
            createdAt: Date.now(),
          },
        ];
        const newMessage = await persistMessages(messages);
        if (!newMessage) return;
        setMessages(prev => [...prev, ...newMessage]);
        console.log('meal[0].name:', meal[0].name);

        const systemPrompt = `Du bist ein freundlicher KI-Kochassistent und sprichst ausschließlich Deutsch.

Deine Hauptaufgabe ist es, ein Rezept für das Gericht "${meal[0].name}" zu erstellen. Das Rezept soll alle notwendigen Schritte, Zutaten und Kochtechniken enthalten. Es soll klar, strukturiert und einfach verständlich sein – unabhängig vom kulinarischen Können der Leserinnen und Leser.

Zusätzlich kannst du auch allgemeine Fragen zum Kochen beantworten oder auf Smalltalk wie "Hallo", "Danke" usw. angemessen reagieren – ebenfalls auf Deutsch.

Wenn die Benutzerfrage keinen Bezug zum Rezept hat, antworte trotzdem höflich und hilfreich – aber immer auf Deutsch.`;
        callAIWithPrompt(systemPrompt, meal[0].name);
      } else {
        setMessages(messages);
      }
    };
    loadMessages();
  }, [
    meal,
    mealId,
    isLoading,
    callAIWithPrompt,
    findChatById,
    loadChat,
    newChat,
    persistMessages,
  ]);

  const sendMessage = async () => {
    if (inputText.trim().length === 0 || !meal) return;

    const userMessage: Message = {
      chatId: mealId as string,
      text: inputText,
      sender: 'user',
    };

    setInputText('');

    const newMessage = await persistMessages([userMessage]);
    if (!newMessage) return;
    setMessages(prev => [...prev, ...newMessage]);

    await callAIWithPrompt(inputText, meal[0].name);
  };

  const renderItem = ({ item }: { item: Message }) => (
    <MessageBubble message={item} />
  );

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-black">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 80}
      >
        <View className="flex-1">
          <FlatList
            ref={flatListRef}
            data={
              isTyping
                ? [
                    ...messages,
                    {
                      id: -1, // Use a numeric id for the typing indicator
                      sender: 'bot-typing',
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

          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View className="flex-row items-center border-t border-gray-300 dark:border-gray-700 px-4 py-4 bg-white dark:bg-black">
              <TextInput
                className="flex-1 min-h-12 px-4 py-2 rounded-full border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100"
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
          </TouchableWithoutFeedback>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatBotScreen;
