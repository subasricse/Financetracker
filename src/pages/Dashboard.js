import React, { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
} from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { PieChart, Pie, Cell } from 'recharts';
import { useDispatch, useSelector } from 'react-redux';
import { addExpense, getExpenseStats } from '../features/expense/expenseSlice';

const Dashboard = () => {
  const dispatch = useDispatch();
  const expenseState = useSelector((state) => state.expense);
  const stats = expenseState.stats;
  const loading = expenseState.loading;
  const error = expenseState.error;
  const formErrors = expenseState.formErrors;
  const [formData, setFormData] = useState({
    amount: '',
    category: 'Food',
    description: '',
    type: 'expense'
  });

  useEffect(() => {
    dispatch(getExpenseStats());
  }, [dispatch]);

  const handleAddExpense = (e) => {
    e.preventDefault();
    
    // Validate form data
    if (!formData.amount || !formData.category || !formData.description || !formData.type) {
      return;
    }

    // Convert amount to number and validate
    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      return;
    }

    const expenseData = {
      amount,
      category: formData.category,
      description: formData.description,
      type: formData.type
    };

    dispatch(addExpense(expenseData))
      .then(() => {
        // Refresh stats after adding expense
        dispatch(getExpenseStats());
        // Reset form after successful submission
        setFormData({
          amount: '',
          category: 'Food',
          description: '',
          type: 'expense'
        });
      });
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Dashboard
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Add New Expense/Income
              </Typography>
              <form onSubmit={handleAddExpense}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Amount"
                      name="amount"
                      type="number"
                      required
                      error={!!formErrors?.amount}
                      helperText={formErrors?.amount}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>Category</InputLabel>
                      <Select
                        name="category"
                        label="Category"
                        required
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      >
                        <MenuItem value="Food">Food</MenuItem>
                        <MenuItem value="Travel">Travel</MenuItem>
                        <MenuItem value="Bills">Bills</MenuItem>
                        <MenuItem value="Shopping">Shopping</MenuItem>
                        <MenuItem value="Entertainment">Entertainment</MenuItem>
                        <MenuItem value="Other">Other</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Description"
                      name="description"
                      required
                      error={!!formErrors?.description}
                      helperText={formErrors?.description}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>Type</InputLabel>
                      <Select
                        name="type"
                        label="Type"
                        required
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      >
                        <MenuItem value="expense">Expense</MenuItem>
                        <MenuItem value="income">Income</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      fullWidth
                      disabled={loading}
                    >
                      {loading ? 'Adding...' : 'Add'}
                    </Button>
                    {error && (
                      <Alert severity="error" sx={{ mt: 2 }}>
                        {error}
                      </Alert>
                    )}
                  </Grid>
                </Grid>
              </form>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Monthly Summary
              </Typography>
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                  <CircularProgress />
                </Box>
              ) : error ? (
                <Box sx={{ py: 3 }}>
                  <Alert severity="error">{error}</Alert>
                </Box>
              ) : stats.categoryStats?.length ? (
                <Box sx={{ height: 300 }}>
                  <LineChart
                    width={500}
                    height={300}
                    data={stats.categoryStats}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="_id" label={{ value: 'Category', position: 'insideBottom' }} />
                    <YAxis label={{ value: 'Amount', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="total"
                      stroke="#8884d8"
                      activeDot={{ r: 8 }}
                      strokeWidth={2}
                    />
                  </LineChart>
                </Box>
              ) : (
                <Box sx={{ py: 3 }}>
                  <Alert severity="info">No expenses recorded yet</Alert>
                </Box>
              )}
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper elevation={2} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Expense Categories
              </Typography>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                  <CircularProgress />
                </Box>
              ) : error ? (
                <Box sx={{ py: 3 }}>
                  <Alert severity="error">{error}</Alert>
                </Box>
              ) : stats.categoryStats?.length ? (
                <Box sx={{ height: 300 }}>
                  <PieChart width={500} height={300}>
                    <Pie
                      data={stats.categoryStats}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="total"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {stats.categoryStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </Box>
              ) : (
                <Box sx={{ py: 3 }}>
                  <Alert severity="info">No expenses recorded yet</Alert>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Dashboard;
