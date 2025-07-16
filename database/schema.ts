import { InferInsertModel } from 'drizzle-orm';
import {
  foreignKey,
  integer,
  sqliteTable,
  text,
} from 'drizzle-orm/sqlite-core';

export const Chat = sqliteTable('chats', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  createdAt: integer('created_at').$defaultFn(() => Date.now().valueOf()),
});

export const Message = sqliteTable(
  'messages',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    text: text('text'),
    sender: text('sender').notNull(),
    chatId: text('chat_id').notNull(),
    createdAt: integer('created_at').$defaultFn(() => Date.now().valueOf()),
  },
  table => [
    foreignKey({
      columns: [table.chatId],
      foreignColumns: [Chat.id],
      name: 'fk_chat_messages',
    }),
  ],
);

export type Chat = InferInsertModel<typeof Chat>;
export type Message = InferInsertModel<typeof Message>;
