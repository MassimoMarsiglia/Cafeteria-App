import exportDatabase from '@/utils/database';
import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import * as SQLite from 'expo-sqlite';
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

import MessageBubble from '@/components/Chatbot/MessageBubble';

type Message = {
  id: string;
  text?: string;
  sender: string;
};
// function stripMarkdown (in stripMarkdown)

const ChatBotScreen = () => {
  const { mealName } = useLocalSearchParams();
  const flatListRef = useRef(null);
  const [db, setDb] = useState<SQLite.SQLiteDatabase | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Open DB and create table
  useEffect(() => {
    const initDb = async () => {
      const database = await SQLite.openDatabaseAsync('chat.db');
      await database.execAsync(`
        CREATE TABLE IF NOT EXISTS messages (
          id TEXT PRIMARY KEY NOT NULL,
          text TEXT,
          sender TEXT,
          timestamp INTEGER,
          meal TEXT
        );
      `);
      setDb(database);
    };

    initDb();
  }, []);

  // 🔄 Load messages when DB and mealName are ready
  useEffect(() => {
    const loadMessages = async () => {
      if (!db || !mealName) return;
      const meal = Array.isArray(mealName) ? mealName[0] : mealName;

      try {
        const rows = await db.getAllAsync(
          `SELECT * FROM messages WHERE meal = ? ORDER BY timestamp ASC;`,
          [meal],
        );

        if (rows.length > 0) {
          setMessages(rows as Message[]);
        } else {
          const introMessage: Message = {
            id: Date.now().toString(),
            text: `Das Gericht heißt „${meal}“. Ich helfe dir dabei, ein Rezept dafür zu erstellen …

Bitte habe einen Moment Geduld – die Antwort des Bots kann ein paar Sekunden dauern`,
            sender: 'bot',
          };
          setMessages([introMessage]);
          await saveMessageToDB(introMessage, meal);

          const systemPrompt = `Du bist ein freundlicher KI-Kochassistent und sprichst ausschließlich Deutsch.

Deine Hauptaufgabe ist es, ein Rezept für das Gericht "${meal}" zu erstellen. Das Rezept soll alle notwendigen Schritte, Zutaten und Kochtechniken enthalten. Es soll klar, strukturiert und einfach verständlich sein – unabhängig vom kulinarischen Können der Leserinnen und Leser.

Zusätzlich kannst du auch allgemeine Fragen zum Kochen beantworten oder auf Smalltalk wie "Hallo", "Danke" usw. angemessen reagieren – ebenfalls auf Deutsch.

Wenn die Benutzerfrage keinen Bezug zum Rezept hat, antworte trotzdem höflich und hilfreich – aber immer auf Deutsch.`;
          callAIWithPrompt(systemPrompt, meal);
        }
      } catch (err) {
        console.error('SQLite load error:', err);
      }
    };

    loadMessages();
  }, [db, mealName]);

  const saveMessageToDB = async (msg: Message, meal: string) => {
    if (!db) return;
    await db.runAsync(
      `INSERT INTO messages (id, text, sender, timestamp, meal) VALUES (?, ?, ?, ?, ?);`,
      [msg.id, msg.text, msg.sender, Date.now(), meal],
    );
  };

  const callAIWithPrompt = async (prompt: string, meal: string) => {
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
      console.log('AI Response:', aiReply);
      const botMessage: Message = {
        id: Date.now().toString(),
        text: aiReply || 'Keine Antwort erhalten.',
        sender: 'bot',
      };

      setMessages(prev => [...prev, botMessage]);
      await saveMessageToDB(
        botMessage,
        Array.isArray(mealName) ? mealName[0] : mealName,
      );
    } catch (err) {
      console.error('AI API error:', err);
      const errorMessage: Message = {
        id: Date.now().toString(),
        text: 'Fehler beim Abrufen der AI-Antwort.',
        sender: 'bot',
      };
      setMessages(prev => [...prev, errorMessage]);
      await saveMessageToDB(
        errorMessage,
        Array.isArray(mealName) ? mealName[0] : mealName,
      );
    } finally {
      setIsTyping(false);
    }
  };

  const sendMessage = async () => {
    if (inputText.trim().length === 0 || !mealName) return;

    const meal = Array.isArray(mealName) ? mealName[0] : mealName;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
    };

    setMessages(prev => [...prev, userMessage]);
    await saveMessageToDB(userMessage, meal);

    // const promptForAI = `Der Benutzer fragt nach „${meal}“. Seine Nachricht lautet: „${inputText}“. Bitte antworte hilfreich.`;
    await callAIWithPrompt(inputText, meal);
    setInputText('');
  };

  const renderItem = ({ item }: { item: Message }) => (
    <MessageBubble message={item} />
  );

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-black">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 40}
      >
        <View className="flex-1">
          <FlatList
            scrollEnabled={true}
            ref={flatListRef}
            data={
              isTyping
                ? [
                    ...messages,
                    {
                      id: 'typing',
                      sender: 'bot-typing',
                    },
                  ]
                : messages
            }
            keyExtractor={item => item.id}
            renderItem={renderItem}
            contentContainerStyle={{ padding: 16, flexGrow: 1 }}
            onContentSizeChange={() =>
              flatListRef.current?.scrollToEnd({ animated: true })
            }
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
