import React, { useRef, useState } from 'react';
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
  const [messages, setMessages] = useState([
    {
      id: '1',
      text: 'Hi! Ask me about a mensa meal and I will give you the recipe.',
      sender: 'bot',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef(null);

  const sendMessage = () => {
    if (inputText.trim().length === 0) return;

    const userMessage = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
    };
    setMessages(prevMessages => [...prevMessages, userMessage]);

    // Fetch recipe from TheMealDB API
    fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(inputText.trim())}`,
    )
      .then(res => res.json())
      .then(data => {
        let botReplyText = "Sorry, I couldn't find a recipe for that meal.";

        if (data.meals && data.meals.length > 0) {
          // Use the first matching meal
          const meal = data.meals[0];
          botReplyText = `*${meal.strMeal}*\n\nIngredients:\n`;

          // Gather ingredients and measurements
          for (let i = 1; i <= 20; i++) {
            const ingredient = meal[`strIngredient${i}`];
            const measure = meal[`strMeasure${i}`];
            if (ingredient && ingredient.trim() !== '') {
              botReplyText += `- ${measure} ${ingredient}\n`;
            }
          }

          botReplyText += `\nInstructions:\n${meal.strInstructions}`;
        }

        const botReply = {
          id: (Date.now() + 1).toString(),
          text: botReplyText,
          sender: 'bot',
        };
        setMessages(prevMessages => [...prevMessages, botReply]);
      })
      .catch(() => {
        const botReply = {
          id: (Date.now() + 1).toString(),
          text: 'Sorry, something went wrong while fetching the recipe.',
          sender: 'bot',
        };
        setMessages(prevMessages => [...prevMessages, botReply]);
      });

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
