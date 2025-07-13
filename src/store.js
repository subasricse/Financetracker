import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import expenseReducer from './features/expense/expenseSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    expense: expenseReducer,
  },
});
