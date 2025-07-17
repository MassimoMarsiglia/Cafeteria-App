import { Chat, Message } from '@/database/schema';
import { useCallback } from 'react';
import {
  createChat,
  deleteChatById,
  getChatById,
} from '@/repository/chatRepository';

import {
  deleteMessagesByChatId,
  getMessagesByChatId,
  saveMessages,
} from '@/repository/messageRepository';

export const useChatBotService = () => {
    const newChat = useCallback(async (chat: Chat) => {
        await createChat(chat);
    }, []);

    const loadChat = useCallback(async (chatId: string) => {
        const messages = await getMessagesByChatId(chatId);
        return messages;
    }, []);

    const persistMessages = useCallback(async (messages: Message[]) => {
        return await saveMessages(messages);
    }, []);

    const findChatById = useCallback(async (id: string) => {
        return await getChatById(id);
    }, []);

    const deleteChat = useCallback(async (id: string) => {
        Promise.all([deleteChatById(id), deleteMessagesByChatId(id)]);
    }, []);

    return {
        newChat,
        loadChat,
        persistMessages,
        findChatById,
        deleteChat
    };
}