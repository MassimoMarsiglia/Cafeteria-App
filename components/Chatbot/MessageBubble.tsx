import { stripMarkdown } from '@/utils/stripMarkdown';
import React from 'react';
import { Text, View } from 'react-native';
import TypingDots from './TypingDots';
import { Message } from '@/database/schema';

export default function MessageBubble({ message }: { message: Message }) {
  if (message.sender === 'bot-typing') {
    return (
      <View className="my-1 p-3 rounded-lg bg-gray-200 dark:bg-gray-700 self-start max-w-4/5">
        <TypingDots />
      </View>
    );
  }

  const isUser = message.sender === 'user';

  return (
    <View
      className={`my-1 p-3 rounded-lg max-w-4/5 ${
        isUser
          ? 'bg-indigo-200 dark:bg-indigo-600 self-end'
          : 'bg-gray-200 dark:bg-gray-700 self-start'
      }`}
    >
      <Text
        className={
          isUser
            ? 'text-gray-900 dark:text-white'
            : 'text-gray-900 dark:text-gray-100'
        }
      >
        {stripMarkdown(message.text || '')}
      </Text>
    </View>
  );
}
