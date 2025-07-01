import mensaApi from '@/services/mensaApi';
import { AppDispatch, RootState } from '@/store';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';


export const useCanteens = () => {
    const dispatch: AppDispatch = useCanteens();
    const canteenState = useSelector((state: RootState) => state.canteen);

    const fetchCanteens = () => {
        createAsyncThunk('canteen/fetchCanteens', async (_, { dispatch }) => {
            dispatch({ type: 'canteen/fetchCanteens' });
            try {
                const response = await mensaApi.getCanteens();
                const data = await response.json();
                dispatch({ type: 'canteen/fetchCanteensSuccess', payload: data });
            } catch (error) {
                dispatch({ type: 'canteen/fetchCanteensFailure', payload: error.message });
            }
        }
    };

}