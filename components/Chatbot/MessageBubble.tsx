import { Message } from '@/database/schema';
import { stripMarkdown } from '@/utils/stripMarkdown';
import React from 'react';
import { Dimensions, Text, View } from 'react-native';
import TypingDots from './TypingDots';

const screenWidth = Dimensions.get('window').width;

export default function MessageBubble({ message }: { message: Message }) {
  if (message.sender === 'bot-typing') {
    return (
      <View
        className="my-1 p-3 rounded-lg bg-gray-200 dark:bg-gray-700 self-start"
        style={{ maxWidth: screenWidth - 32 }} // full width minus padding
      >
        <TypingDots />
      </View>
    );
  }

  const isUser = message.sender === 'user';
  const bubbleMaxWidth = isUser ? screenWidth * 0.66 : screenWidth - 32;

  return (
    <View
      pointerEvents="none"
      className={`my-1 p-3 rounded-lg flex-shrink ${
        isUser
          ? 'bg-indigo-200 dark:bg-indigo-600 self-end'
          : 'bg-gray-200 dark:bg-secondary-100 self-start'
      }`}
      style={{ maxWidth: bubbleMaxWidth }}
    >
      <Text
        selectable={false}
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
