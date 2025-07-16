import { mensaApi } from '@/services/mensaApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { configureStore } from '@reduxjs/toolkit';
import Storage from 'expo-sqlite/kv-store';
import { Platform } from 'react-native';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'redux-persist';
import settingsReducer from './slices/settingsSlice';
import sidebarReducer from './slices/sidebarSlice';

const storage = () => (Platform.OS === 'web' ? AsyncStorage : Storage);

const persistConfig = {
  key: 'schmausa-cache/v1',
  storage: storage(),
  blacklist: [],
  version: 1,
};

const settingsPersistConfig = {
  key: 'schmausa-settings/v1',
  storage: storage(),
  blacklist: [],
  version: 1,
};

const persistedSettingsReducer = persistReducer(
  settingsPersistConfig,
  settingsReducer,
);

const persistedMensaApiReducer = persistReducer(
  persistConfig,
  mensaApi.reducer,
);

export const store = configureStore({
  reducer: {
    sidebar: sidebarReducer,
    settings: persistedSettingsReducer,
    [mensaApi.reducerPath]: persistedMensaApiReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
    }).concat(mensaApi.middleware),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
