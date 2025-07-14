import { Canteen } from '@/services/mensaTypes';
import { AppDispatch, RootState } from '@/store';
import {
  setFavoriteCanteen as setCanteen,
  setFavoriteMeals,
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

  const setFavoriteCanteen = (canteen: Canteen) => {
    dispatch(setCanteen(canteen));
  };

  const toggleDarkMode = () => {
    dispatch(toggleDark());
  };

  const addFavoriteMeals = (mealIds: string[]) => {
    const currentFavMeals = settingsState.favoriteMeals || [];
    const newFavMeals = [
      ...currentFavMeals,
      ...mealIds.filter(id => !currentFavMeals.includes(id)),
    ];
    dispatch(setFavoriteMeals(newFavMeals));
  };

  const removeFavoriteMeals = (mealId: string) => {
    const favMeals = settingsState.favoriteMeals?.filter(m => m !== mealId);
    dispatch(setFavoriteMeals(favMeals || []));
  };

  return {
    addFavoriteMeals,
    removeFavoriteMeals,
    favoriteMealIds: settingsState.favoriteMeals || [],
    setPriceCategory,
    isDarkMode: settingsState.isDarkMode,
    toggleDarkMode,
    setFavoriteCanteen,
    favoriteCanteen: settingsState.favoriteCanteen,
    priceCategory: settingsState.priceCategory,
  };
};
