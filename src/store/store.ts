import { configureStore } from '@reduxjs/toolkit';
import productsReducer from './productsSlice';
import cartReducer from './cartSlice';
import themeReducer from './themeSlice';
import authReducer from './authSlice';
import userReducer from './userSlice';
import { useDispatch } from 'react-redux';

export const store = configureStore({
  reducer: {
    products: productsReducer,
    cart: cartReducer,
    theme: themeReducer,
    auth: authReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();