import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite";
const expo = openDatabaseSync("chat.db");

export const chatdb = drizzle(expo);
