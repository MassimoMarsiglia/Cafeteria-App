import { useLocalSearchParams } from 'expo-router';
import OpenAI from 'openai';
import { useEffect, useRef, useState } from 'react';
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

const ChatBotScreen = () => {
  const { mealName } = useLocalSearchParams();
  const flatListRef = useRef(null);
  const [messages, setMessages] = useState([
    { id: '1', text: 'Loading meal info...', sender: 'bot' },
  ]);
  const [inputText, setInputText] = useState('');

  // First AI message based on mealName
  useEffect(() => {
    if (mealName) {
      const introMessage = {
        id: Date.now().toString(),
        text: `Das Gericht heißt "${mealName}". Ich helfe dir dabei, ein Rezept dafür zu erstellen …`,
        sender: 'bot',
      };
      setMessages([introMessage]);

      const systemPrompt = `Du wirst ein Rezept erstellen, das auf den meal "${mealName}" basiert. Das Rezept soll alle notwendigen Schritte, Zutaten und Kochtechniken enthalten. Es soll so strukturiert sein, dass es leicht verständlich und umsetzbar ist – unabhängig vom kulinarischen Können der Leserinnen und Leser.`;
      callAIWithPrompt(systemPrompt);
    } else {
      setMessages([
        {
          id: Date.now().toString(),
          text: 'No meal name provided.',
          sender: 'bot',
        },
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function callAIWithPrompt(prompt: string) {
    try {
      const openAi = new OpenAI({
        baseURL: 'https://openrouter.ai/api/v1',
        // I already have an account on OpenRouter so u guys can use my API Key or create one in OpenRouter
        // There are also another free API with limited requests, u guys can check here: https://chatgpt.com/share/686ffe71-6634-8009-b10f-06000e1e797a
        // The ChatBot only works when u guys put the API_KEY here and please don't push API_KEY to github public
        apiKey: 'API_KEY',
      });
      const response = await openAi.chat.completions.create({
        model: 'openai/gpt-4o',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_completion_tokens: 1000,
      });
      const data = response.choices[0].message.content;
      console.log('HuggingFace AI response:', data);
      const aiReply = data!;

      const botMessage = {
        id: Date.now().toString(),
        text: aiReply,
        sender: 'bot',
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      console.log(err);
      const errorMessage = {
        id: Date.now().toString(),
        text: 'Error calling AI service',
        sender: 'bot',
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  }

  const sendMessage = () => {
    if (inputText.trim().length === 0) return;

    const userMessage = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
    };
    setMessages(prev => [...prev, userMessage]);

    const promptForAI = `Der Benutzer fragt nach „${mealName}“. Seine Nachricht lautet: „${inputText}“. Bitte antworte hilfreich.`;

    callAIWithPrompt(promptForAI);

    setInputText('');
  };

  const renderItem = ({ item }) => (
    <View
      className={`my-1 p-3 rounded-lg max-w-4/5 ${
        item.sender === 'user'
          ? 'bg-blue-600 self-end'
          : 'bg-blue-100 self-start'
      }`}
    >
      <Text
        className={`${item.sender === 'user' ? 'text-white' : 'text-black'}`}
      >
        {item.text}
      </Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 40}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View className="flex-1">
            <FlatList
              ref={flatListRef}
              data={messages}
              keyExtractor={item => item.id}
              renderItem={renderItem}
              contentContainerStyle={{ padding: 16, flexGrow: 1 }}
              onContentSizeChange={() =>
                flatListRef.current?.scrollToEnd({ animated: true })
              }
              keyboardShouldPersistTaps="handled"
            />

            <View className="flex-row items-center border-t border-gray-300 px-4 py-3 bg-white">
              <TextInput
                className="flex-1 h-10 px-4 rounded-full border border-gray-300"
                value={inputText}
                onChangeText={setInputText}
                placeholder="Type your message..."
                onSubmitEditing={sendMessage}
              />
              <TouchableOpacity
                onPress={sendMessage}
                className="ml-2 bg-blue-600 px-4 py-2 rounded-full"
              >
                <Text className="text-white font-bold">Send</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatBotScreen;
