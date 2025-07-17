import { chatdb, isDatabaseAvailable } from '@/database/chatdatabase';
import { Chat } from '@/database/schema';
import { desc, eq } from 'drizzle-orm';

export const createChat = async (chat: Chat) => {
  if (!isDatabaseAvailable()) {
    console.warn('Database not available on web platform');
    return;
  }

  try {
    await chatdb!.insert(Chat).values(chat);
  } catch (error) {
    console.error('Error creating chat in database:', error);
  }
};

export const getAllChats = async () => {
  if (!isDatabaseAvailable()) {
    console.warn('Database not available on web platform');
    return [];
  }

  try {
    const chats = await chatdb!
      .select()
      .from(Chat)
      .orderBy(desc(Chat.createdAt));
    return chats;
  } catch (error) {
    console.error('Error fetching chats from database:', error);
    return [];
  }
};

export const getChatByName = async (name: string) => {
  if (!isDatabaseAvailable()) {
    console.warn('Database not available on web platform');
    return null;
  }

  try {
    const chat = await chatdb!
      .select()
      .from(Chat)
      .where(eq(Chat.name, name))
      .limit(1);
    return chat.length > 0 ? chat[0] : null;
  } catch (error) {
    console.error('Error fetching chat by name from database:', error);
    return null;
  }
};

export const getChatById = async (id: string) => {
  if (!isDatabaseAvailable()) {
    console.warn('Database not available on web platform');
    return null;
  }

  try {
    const chat = await chatdb!
      .select()
      .from(Chat)
      .where(eq(Chat.id, id))
      .limit(1);
    return chat.length > 0 ? chat[0] : null;
  } catch (error) {
    console.error('Error fetching chat by ID from database:', error);
    return null;
  }
};

export const deleteChatById = async (id: string) => {
  if (!isDatabaseAvailable()) {
    console.warn('Database not available on web platform');
    return;
  }

  try {
    await chatdb!.delete(Chat).where(eq(Chat.id, id));
  } catch (error) {
    console.error('Error deleting chat by ID from database:', error);
  }
};
