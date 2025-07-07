import { Canteen } from '@/services/mensaApi';
import { createSlice } from '@reduxjs/toolkit';

interface CanteenState {
  canteens: Canteen[];
  loading: boolean;
  error: string | null;
}
const initialState: CanteenState = {
  canteens: [],
  loading: false,
  error: null,
};

const canteenSlice = createSlice({
  name: 'canteen',
  initialState,
  reducers: {
    fetchCanteens(state) {
      state.loading = true;
      state.error = null;
    },
    fetchCanteensSuccess(state, action) {
      state.canteens = action.payload;
      state.loading = false;
    },
    fetchCanteensFailure(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { fetchCanteens, fetchCanteensSuccess, fetchCanteensFailure } =
  canteenSlice.actions;
