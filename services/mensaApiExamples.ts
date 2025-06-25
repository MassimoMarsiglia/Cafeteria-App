/**
 * Example usage of the Mensa API Service
 * 
 * Import this into your React components to use the API
 */

import { mensaApi } from './mensaApi';

// API key is automatically loaded from .env file (EXPO_PUBLIC_MENSA_API_KEY)
// If you need to set it manually, you can still do:
// mensaApi.setApiKey('your-api-key-here');

/**
 * Example functions showing how to use the API
 */

// Get all canteens
export const getAllCanteens = async () => {
  try {
    const canteens = await mensaApi.getCanteens();
    return canteens;
  } catch (error) {
    console.error('Error fetching canteens:', error);
    throw error;
  }
};

// Get today's menu for a specific canteen
export const getTodaysMenuForCanteen = async (canteenId: string) => {
  try {
    const menu = await mensaApi.getTodaysMenu(canteenId);
    return menu;
  } catch (error) {
    console.error('Error fetching today\'s menu:', error);
    throw error;
  }
};

// Get meals with filter
export const getMealsForToday = async (canteenId?: string) => {
  try {
    const meals = await mensaApi.getMeals({
      canteenId: canteenId
    });
    return meals;
  } catch (error) {
    console.error('Error fetching meals:', error);
    throw error;
  }
};

// Get canteen with today's menu
export const getCanteenWithMenu = async (canteenId: string) => {
  try {
    const result = await mensaApi.getCanteenWithTodaysMenu(canteenId);
    return result;
  } catch (error) {
    console.error('Error fetching canteen with menu:', error);
    throw error;
  }
};

// Submit a meal review
export const submitMealReview = async (mealId: string, rating: number, comment?: string) => {
  try {
    const review = await mensaApi.createMealReview({
      mealId,
      rating,
      comment
    });
    return review;
  } catch (error) {
    console.error('Error submitting meal review:', error);
    throw error;
  }
};

// Submit a canteen review
export const submitCanteenReview = async (canteenId: string, rating: number, comment?: string) => {
  try {
    const review = await mensaApi.createCanteenReview({
      canteenId,
      rating,
      comment
    });
    return review;
  } catch (error) {
    console.error('Error submitting canteen review:', error);
    throw error;
  }
};

// Get reviews for a meal
export const getMealReviews = async (mealId: string) => {
  try {
    const reviews = await mensaApi.getMealReviews({ mealId });
    return reviews;
  } catch (error) {
    console.error('Error fetching meal reviews:', error);
    throw error;
  }
};

// Get reviews for a canteen
export const getCanteenReviews = async (canteenId: string) => {
  try {
    const reviews = await mensaApi.getCanteenReviews({ canteenId });
    return reviews;
  } catch (error) {
    console.error('Error fetching canteen reviews:', error);
    throw error;
  }
};
