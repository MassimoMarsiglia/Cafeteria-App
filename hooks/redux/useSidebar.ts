import { useSelector } from 'react-redux';
import { useAppDispatch } from './redux';
import { AppDispatch, RootState } from '@/store';
import {
  openSidebar as open,
  closeSidebar as close,
  toggleSidebar as toggle,
} from '@/store/slices/sidebarSlice';

export const useSidebar = () => {
  const dispatch: AppDispatch = useAppDispatch();
  const sidebarState = useSelector((state: RootState) => state.sidebar);

  const openSidebar = () => {
    dispatch(open());
  };

  const closeSidebar = () => {
    dispatch(close());
  };

  const toggleSidebar = () => {
    dispatch(toggle());
  };

  return { openSidebar, closeSidebar, toggleSidebar, sidebarState };
};
