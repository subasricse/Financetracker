import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Snackbar,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../features/auth/authSlice';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [successOpen, setSuccessOpen] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(formData));
  };

  useEffect(() => {
    if (auth.error) {
      try {
        const errorData = JSON.parse(auth.error);
        if (errorData.fields) {
          setFormErrors(errorData.fields);
        }
      } catch (e) {
        setFormErrors({ general: auth.error });
      }
    } else {
      setFormErrors({});
    }
  }, [auth.error]);

  useEffect(() => {
    if (auth.isAuthenticated) {
      setSuccessOpen(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    }
  }, [auth.isAuthenticated, navigate]);

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            please login helperText
          </Typography>
          {formErrors.general && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {formErrors.general}
            </Alert>
          )}
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              margin="normal"
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              error={!!formErrors.email}
              helperText={formErrors.email}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              error={!!formErrors.password}
              helperText={formErrors.password}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={auth.loading}
              sx={{ mt: 3, mb: 2 }}
            >
              {auth.loading ? 'Logging in...' : 'Login'}
            </Button>
            <Button
              fullWidth
              variant="text"
              color="primary"
              component="a"
              href="/register"
            >
              Don't have an account? Register
            </Button>
          </form>
        </Paper>
      </Box>
      <Snackbar
        open={successOpen}
        autoHideDuration={2000}
        onClose={() => setSuccessOpen(false)}
      >
        <Alert severity="success">
          Login successful! Redirecting to dashboard...
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Login;
