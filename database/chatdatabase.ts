import { drizzle } from 'drizzle-orm/expo-sqlite';
import { openDatabaseSync } from 'expo-sqlite';
import { Platform } from 'react-native';

// Type for the database instance
type DatabaseInstance = ReturnType<typeof drizzle> | null;

// Handle different database initialization for web vs native
let expo = null;
let chatdb: DatabaseInstance = null;

if (Platform.OS !== 'web') {
  try {
    expo = openDatabaseSync('chat.db');
    chatdb = drizzle(expo);
  } catch (error) {
    console.error('Error opening database:', error);
    chatdb = null;
  }
} else {
  console.log('Web platform detected - database features are disabled');
}

// Helper function to check if database is available
export const isDatabaseAvailable = (): boolean => {
  return chatdb !== null && Platform.OS !== 'web';
};

export { chatdb };
