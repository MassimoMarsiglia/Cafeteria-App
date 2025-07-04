import { createSlice } from '@reduxjs/toolkit';
import sidebarSlice from './sidebarSlice';

type colourTheme = 'light' | 'dark';

interface SettingsState {
  isDarkMode: colourTheme;
  priceCategory: string;
}

const initialState: SettingsState = {
  isDarkMode: "dark",
  priceCategory: '0',
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
  },
});

export const { toggleDarkMode, setPriceCategory } = settingsSlice.actions;
export default settingsSlice.reducer;
