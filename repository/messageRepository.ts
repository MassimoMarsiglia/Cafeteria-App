import { chatdb } from '@/database/chatdatabase';
import { Message } from '@/database/schema';
import { asc, eq } from 'drizzle-orm';

export const saveMessage = async (message: Message) => {
  try {
    await chatdb.insert(Message).values(message);
  } catch (error) {
    console.error('Error saving message to database:', error);
  }
};

export const saveMessages = async (messages: Message[]) => {
  try {
    const savedMessages = await chatdb
      .insert(Message)
      .values(messages)
      .returning();
    return savedMessages;
  } catch (error) {
    console.error('Error saving messages to database:', error);
  }
};

export const getMessagesByChatId = async (chatId: string) => {
  try {
    const messages = await chatdb
      .select()
      .from(Message)
      .where(eq(Message.chatId, chatId))
      .orderBy(asc(Message.createdAt));
    return messages;
  } catch (error) {
    console.error('Error fetching messages from database:', error);
    return [];
  }
};

export const deleteMessagesByChatId = async (chatId: string) => {
  try {
    await chatdb.delete(Message).where(eq(Message.chatId, chatId));
  } catch (error) {
    console.error('Error deleting messages by chat ID from database:', error);
  }
};
