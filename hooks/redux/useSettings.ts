import { Canteen, Meal } from '@/services/mensaTypes';
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

  const addFavoriteMeals = (meal: Meal) => {
    const currentFavMeals = settingsState.favoriteMeals || [];
    const newFavMeals = [
      ...currentFavMeals,
      currentFavMeals.some(m => m.id === meal.id)
        ? meal
        : { ...meal, id: meal.id.toString() },
    ];
    dispatch(setFavoriteMeals(newFavMeals));
  };

  const removeFavoriteMeals = (meal: Meal) => {
    const favMeals = settingsState.favoriteMeals?.filter(m => m.id !== meal.id);
    dispatch(setFavoriteMeals(favMeals || []));
  };

  return {
    addFavoriteMeals,
    removeFavoriteMeals,
    favoriteMeals: settingsState.favoriteMeals || [],
    setPriceCategory,
    isDarkMode: settingsState.isDarkMode,
    toggleDarkMode,
    setFavoriteCanteen,
    favoriteCanteen: settingsState.favoriteCanteen,
    priceCategory: settingsState.priceCategory,
  };
};
