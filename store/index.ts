import { configureStore } from '@reduxjs/toolkit';
import sidebarReducer from './slices/sidebarSlice';
import { mensaApi } from '@/services/mensaApi';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
