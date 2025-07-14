import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as SQLite from 'expo-sqlite';

const exportDatabase = async () => {
  try {
    // Path to your SQLite DB file inside the app sandbox
    const dbPath = FileSystem.documentDirectory + 'SQLite/chat.db';

    const info = await FileSystem.getInfoAsync(dbPath);
    if (info.exists) {
      console.log('Exporting DB from:', dbPath);
      await Sharing.shareAsync(dbPath);
    } else {
      console.warn('Database file not found at:', dbPath);
      alert('Database file not found.');
    }
  } catch (error) {
    console.error('Error exporting database:', error);
    alert('Failed to export database. Check console for details.');
  }
};

export default exportDatabase;

const openDb = async () => {
  return SQLite.openDatabaseAsync('chat.db');
};

export const getSavedMeals = async (): Promise<string[]> => {
  try {
    const db = await openDb();

    const rows = await db.getAllAsync('SELECT DISTINCT meal FROM messages;');
    const meals = rows.map((row: any) => row.meal);
    return meals;
  } catch (error) {
    console.error('Error fetching meals:', error);
    throw error;
  }
};
