import { useLocalSearchParams } from 'expo-router';
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
        text: `The meal is called "${mealName}". Let me help you generate a receipe for it...`,
        sender: 'bot',
      };
      setMessages([introMessage]);

      const systemPrompt = `The meal is called "${mealName}". Can you explain what this meal is or suggest a recipe for it?`;
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
  }, [mealName]);

  async function callAIWithPrompt(prompt: string) {
    try {
      const response = await fetch('YOUR_AI_API_ENDPOINT', {
        method: 'POST',
        headers: {
          Authorization: 'Bearer YOUR_API_TOKEN',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: prompt,
        }),
      });

      const data = await response.json();
      const aiReply = data[0]?.generated_text || 'Sorry, no response from AI.';

      const botMessage = {
        id: Date.now().toString(),
        text: aiReply,
        sender: 'bot',
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
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

    const promptForAI = `User is asking about "${mealName}". Their message: "${inputText}". Please respond helpfully.`;

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
              contentContainerStyle={{ padding: 16 }}
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
