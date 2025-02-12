import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserData {
  orders: any[];
  preferences: Record<string, any>;
}

const initialState: UserData = {
  orders: JSON.parse(localStorage.getItem('userOrders') || '[]'),
  preferences: JSON.parse(localStorage.getItem('userPreferences') || '{}'),
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserOrders: (state, action: PayloadAction<any[]>) => {
      state.orders = action.payload;
      localStorage.setItem('userOrders', JSON.stringify(action.payload));
    },
    setUserPreferences: (state, action: PayloadAction<Record<string, any>>) => {
      state.preferences = action.payload;
      localStorage.setItem('userPreferences', JSON.stringify(action.payload));
    },
  },
});

export const { setUserOrders, setUserPreferences } = userSlice.actions;
export default userSlice.reducer; 