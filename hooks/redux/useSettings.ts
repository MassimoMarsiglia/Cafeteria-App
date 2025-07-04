import { AppDispatch, RootState } from '@/store';
import {
  setPriceCategory as setPriceCat,
  toggleDarkMode as toggleDark,
} from '@/store/slices/settingsSlice';
import { useSelector } from 'react-redux';
import { useAppDispatch } from './redux';

export const useSettings = () => {
  const dispatch: AppDispatch = useAppDispatch();
  const settingsState = useSelector((state: RootState) => state.settings);

  const setPriceCategory = (category: string) => {
    dispatch(setPriceCat(category));
  };

  const toggleDarkMode = () => {
    dispatch(toggleDark());
  };

  return {
    setPriceCategory,
    isDarkMode: settingsState.isDarkMode,
    toggleDarkMode,
    priceCategory: settingsState.priceCategory,
  };
};
