import * as SQLite from 'expo-sqlite';

type Message = {
  id: string;
  text: string;
  sender: string;
  timestamp?: number;
  meal?: string;
};

export const openChatDatabase = async () => {
  const db = await SQLite.openDatabaseAsync('chat.db');
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY NOT NULL,
      text TEXT,
      sender TEXT,
      timestamp INTEGER,
      meal TEXT
    );
  `);
  return db;
};

export const saveMessage = async (
  db: SQLite.SQLiteDatabase,
  message: Message,
  meal: string,
) => {
  await db.runAsync(
    `INSERT INTO messages (id, text, sender, timestamp, meal) VALUES (?, ?, ?, ?, ?);`,
    [message.id, message.text, message.sender, Date.now(), meal],
  );
};
