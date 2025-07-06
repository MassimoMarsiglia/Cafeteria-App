import { mensaApi } from '@/services/mensaApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { configureStore } from '@reduxjs/toolkit';
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

const persistConfig = {
  key: 'schmausa-v1',
  storage: AsyncStorage,
  blacklist: [],
  version: 1,
};

const persistedMensaApiReducer = persistReducer(
  persistConfig,
  mensaApi.reducer,
);

export const store = configureStore({
  reducer: {
    sidebar: sidebarReducer,
    settings: settingsReducer,
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
