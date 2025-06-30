import { Feather } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

type BusinessHour = {
  businessHourType: string;
  openAt: string;
  closeAt: string;
};

type DayObj = {
  day: string;
  businessHours: BusinessHour[];
};

export default function CollapsibleDay({ dayObj }: { dayObj: DayObj }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Pressable
      onPress={() => setExpanded(!expanded)}
      className="mb-4 bg-neutral-300 dark:bg-neutral-800 rounded-lg px-6 py-4"
    >
      <View className="flex-row justify-between items-center">
        <View className="flex-row items-center space-x-2">
          <Text className="text-black dark:text-white font-semibold text-xl">
            {dayObj.day}
          </Text>
          {expanded && <Feather name="calendar" size={24} color="green" />}
        </View>

        <Feather
          name={expanded ? 'chevron-up' : 'chevron-down'}
          color="white"
          size={24}
        />
      </View>

      {expanded && (
        <View className="mt-4">
          {dayObj.businessHours.length > 0 ? (
            dayObj.businessHours.map((hours, idx) => (
              <Text
                key={idx}
                className="text-gray-800 dark:text-gray-300 text-base mb-1"
              >
                {hours.businessHourType}: {hours.openAt} - {hours.closeAt}
              </Text>
            ))
          ) : (
            <Text className="text-gray-800 dark:text-gray-300">Closed</Text>
          )}
        </View>
      )}
    </Pressable>
  );
}
