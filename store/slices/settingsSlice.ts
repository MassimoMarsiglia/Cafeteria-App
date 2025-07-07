import { createSlice } from '@reduxjs/toolkit';
import sidebarSlice from './sidebarSlice';
import { Canteen } from '@/services/mensaTypes';

type colourTheme = 'light' | 'dark';

interface SettingsState {
  isDarkMode: colourTheme;
  priceCategory: string;
  favoriteCanteen?: Canteen;
}

const initialState: SettingsState = {
  isDarkMode: "dark",
  priceCategory: '0',
  favoriteCanteen: undefined,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    toggleDarkMode(state) {
      state.isDarkMode = state.isDarkMode === 'dark' ? 'light' : 'dark';
    },
    setPriceCategory(state, action) {
      state.priceCategory = action.payload;
    },
    setFavoriteCanteen(state, action) {
      state.favoriteCanteen = action.payload;
    }
  },
});

export const { toggleDarkMode, setPriceCategory, setFavoriteCanteen } = settingsSlice.actions;
export default settingsSlice.reducer;
