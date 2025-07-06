import { configureStore } from '@reduxjs/toolkit';
import sidebarReducer from './slices/sidebarSlice';
import { mensaApi } from '@/services/mensaApi';

export const store = configureStore({
  reducer: {
    [mensaApi.reducerPath]: mensaApi.reducer,
    sidebar: sidebarReducer,
  },
  middleware: gDM => gDM().concat(mensaApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
