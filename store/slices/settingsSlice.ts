import { Canteen } from '@/services/mensaTypes';
import { createSlice } from '@reduxjs/toolkit';

interface SettingsState {
  isDarkMode: boolean;
  priceCategory: string;
  favoriteCanteen?: Canteen;
}

const initialState: SettingsState = {
  isDarkMode: true, // Start with dark mode
  priceCategory: '0',
  favoriteCanteen: undefined,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    toggleDarkMode(state) {
      state.isDarkMode = !state.isDarkMode;
    },
    setPriceCategory(state, action) {
      state.priceCategory = action.payload;
    },
    setFavoriteCanteen(state, action) {
      state.favoriteCanteen = action.payload;
    },
  },
});

export const { toggleDarkMode, setPriceCategory, setFavoriteCanteen } =
  settingsSlice.actions;
export default settingsSlice.reducer;
