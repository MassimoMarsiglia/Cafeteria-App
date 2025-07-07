import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  Additive,
  Badge,
  Canteen,
  CanteenFilter,
  CanteenReview,
  CanteenReviewFilter,
  CreateCanteenReviewRequest,
  CreateMealReviewRequest,
  Meal,
  MealFilter,
  MealReview,
  MealReviewFilter,
  Menu,
  MenuFilter,
} from './mensaTypes';
import { Action } from '@reduxjs/toolkit';
import { REHYDRATE } from 'redux-persist';

const BASE_URL = 'https://mensa.gregorflachs.de/api/v1';

// Tags for cache‑invalidation
type Tag =
  | 'Canteen'
  | 'Meal'
  | 'Menu'
  | 'Badge'
  | 'Additive'
  | 'MealReview'
  | 'CanteenReview';

function isRehydrate(action: Action): action is Action<typeof REHYDRATE> {
  return action.type === REHYDRATE;
}

export const mensaApi = createApi({
  reducerPath: 'mensaApi',

  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    timeout: 30_000,
    prepareHeaders: headers => {
      const apiKey = process.env.EXPO_PUBLIC_MENSA_API_KEY;
      if (apiKey) headers.set('X-API-KEY', apiKey);
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  extractRehydrationInfo(action, { reducerPath }) {
    if (isRehydrate(action)) {
      // if you persisted only the api slice:
      return (action as any).payload?.[reducerPath];
      // …or, if you persisted the whole root state with a custom key:
      // return action.payload
    }
  },

  tagTypes: [
    'Canteen',
    'Meal',
    'Menu',
    'Badge',
    'Additive',
    'MealReview',
    'CanteenReview',
  ],

  endpoints: build => ({
    getCanteens: build.query<Canteen[], CanteenFilter | void>({
      query: filter => ({
        url: 'canteen',
        params: {
          ...filter,
          clickandcollect: filter?.clickandcollect ?? false,
        },
      }),
      providesTags: _r => ['Canteen'],
    }),

    getMeals: build.query<Meal[], MealFilter | void>({
      query: filter => ({ url: 'meal', params: filter ?? {} }),
      providesTags: _r => ['Meal'],
    }),

    getMenus: build.query<Menu[], MenuFilter | void>({
      query: filter => ({ url: 'menue', params: filter ?? {} }),
      providesTags: _r => ['Menu'],
    }),

    getBadges: build.query<Badge[], void>({
      query: () => 'badge',
      providesTags: _r => ['Badge'],
    }),

    getAdditives: build.query<Additive[], void>({
      query: () => 'additive',
      providesTags: _r => ['Additive'],
    }),

    getMealReviews: build.query<MealReview[], MealReviewFilter | void>({
      query: filter => ({ url: 'mealreview', params: filter ?? {} }),
      providesTags: _r => ['MealReview'],
    }),
    getCanteenReviews: build.query<CanteenReview[], CanteenReviewFilter | void>(
      {
        query: filter => ({ url: 'canteenreview', params: filter ?? {} }),
        providesTags: _r => ['CanteenReview'],
      },
    ),

    createMealReview: build.mutation<MealReview, CreateMealReviewRequest>({
      query: body => ({
        url: 'mealreview',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['MealReview'],
    }),

    createCanteenReview: build.mutation<
      CanteenReview,
      CreateCanteenReviewRequest
    >({
      query: body => ({
        url: 'canteenreview',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['CanteenReview'],
    }),

    updateMealReview: build.mutation<MealReview, MealReview>({
      query: body => ({
        url: 'mealreview',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['MealReview'],
    }),

    updateCanteenReview: build.mutation<CanteenReview, CanteenReview>({
      query: body => ({
        url: 'canteenreview',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['CanteenReview'],
    }),

    deleteMealReview: build.mutation<MealReview, string>({
      query: id => ({
        url: `mealreview/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['MealReview'],
    }),

    deleteCanteenReview: build.mutation<CanteenReview, string>({
      query: id => ({
        url: `canteenreview/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['CanteenReview'],
    }),
  }),
});

export const {
  useGetCanteensQuery,
  useGetMealsQuery,
  useGetMenusQuery,
  useGetBadgesQuery,
  useGetAdditivesQuery,
  useGetMealReviewsQuery,
  useGetCanteenReviewsQuery,
  useCreateMealReviewMutation,
  useCreateCanteenReviewMutation,
  useUpdateMealReviewMutation,
  useUpdateCanteenReviewMutation,
  useDeleteMealReviewMutation,
  useDeleteCanteenReviewMutation,
} = mensaApi;
