import { AppDispatch, RootState } from '@/store';
import {
  setPriceCategory as setPriceCat,
  toggleDarkMode as toggleDark,
  setFavoriteCanteen as setCanteen,
} from '@/store/slices/settingsSlice';
import { useSelector } from 'react-redux';
import { useAppDispatch } from './redux';
import { Canteen } from '@/services/mensaTypes';

export const useSettings = () => {
  const dispatch: AppDispatch = useAppDispatch();
  const settingsState = useSelector((state: RootState) => state.settings);

  const setPriceCategory = (category: string) => {
    dispatch(setPriceCat(category));
  };
  
  const setFavoriteCanteen = (canteen: Canteen) => {
    dispatch(setCanteen(canteen));
  }

  const toggleDarkMode = () => {
    dispatch(toggleDark());
  };

  return {
    setPriceCategory,
    isDarkMode: settingsState.isDarkMode,
    toggleDarkMode,
    setFavoriteCanteen,
    favoriteCanteen: settingsState.favoriteCanteen,
    priceCategory: settingsState.priceCategory,
  };
};
