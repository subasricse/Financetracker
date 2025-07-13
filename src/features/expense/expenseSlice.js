import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const addExpense = createAsyncThunk(
  'expense/add',
  async (expenseData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Not authenticated');
      }

      // Validate amount
      if (typeof expenseData.amount !== 'number' || expenseData.amount <= 0) {
        throw new Error('Amount must be a positive number');
      }

      // Add current date if not provided
      const expenseWithDate = {
        ...expenseData,
        date: new Date().toISOString()
      };

      const response = await axios.post(
        'http://localhost:5000/api/expenses',
        expenseWithDate,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Expense creation error:', error);
      const errorMessage = error.response?.data?.message || error.message;
      const errorFields = error.response?.data?.fields || null;
      
      // Handle specific validation errors
      if (error.response?.data?.errors) {
        const fields = {};
        Object.entries(error.response.data.errors).forEach(([field, error]) => {
          fields[field] = error.message;
        });
        return rejectWithValue({
          message: 'Validation failed',
          fields
        });
      }

      return rejectWithValue({
        message: errorMessage,
        fields: errorFields
      });
    }
  }
);

export const getExpenses = createAsyncThunk(
  'expense/getAll',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Not authenticated');
      }

      const response = await axios.get('http://localhost:5000/api/expenses', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      return response.data;
    } catch (error) {
      console.error('Expense fetch error:', error);
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const getExpenseStats = createAsyncThunk(
  'expense/getStats',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/expenses/stats', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const expenseSlice = createSlice({
  name: 'expense',
  initialState: {
    expenses: [],
    stats: {},
    loading: false,
    error: null,
    formErrors: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addExpense.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.formErrors = null;
      })
      .addCase(addExpense.fulfilled, (state, action) => {
        state.loading = false;
        state.expenses.push(action.payload);
        state.error = null;
        state.formErrors = null;
      })
      .addCase(addExpense.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to add expense';
        state.formErrors = action.payload?.fields || null;
      })
      .addCase(getExpenses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getExpenses.fulfilled, (state, action) => {
        state.loading = false;
        state.expenses = action.payload;
        state.error = null;
      })
      .addCase(getExpenses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch expenses';
      })
      .addCase(getExpenseStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getExpenseStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
        state.error = null;
      })
      .addCase(getExpenseStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch expense stats';
      });
  },
});

export default expenseSlice.reducer;
