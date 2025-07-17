import { Text } from '@/components/ui/text';
import { AntDesign } from '@expo/vector-icons';
import React from 'react';
import { RefreshControl, ScrollView, View } from 'react-native';

export interface ErrorStateProps {
  icon?: keyof typeof AntDesign.glyphMap;
  title: string;
  description: string;
  onRefresh: () => void;
  isRefreshing: boolean;
  minHeight: number;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  icon = 'wifi',
  title,
  description,
  onRefresh,
  isRefreshing,
  minHeight,
}) => {
  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
      }
    >
      <View
        className="flex-1 justify-center items-center"
        style={{ minHeight }}
      >
        <AntDesign name={icon} size={75} color="grey" className="mb-6" />
        <Text className="text-base font-medium mb-4 text-center">{title}</Text>
        <Text className="text-base font-small mb-4 text-center">{description}</Text>
      </View>
    </ScrollView>
  );
};
