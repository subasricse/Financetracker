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
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../features/auth/authSlice';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    name: '',
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
    const userData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
    };
    dispatch(register(userData));
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
            Register
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
              label="Name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              required
              error={!!formErrors.name}
              helperText={formErrors.name}
            />
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
              {auth.loading ? 'Registering...' : 'Registering now '}
            </Button>
            <Button
              fullWidth
              variant="text"
              color="primary "
              component="a"
              href="/login"
            >
            wlse login if youbhave an accou t :

              <><
            >
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
          Registration successful! Redirecting to ddashborard :////.....
          if you are good im good if your bad im your dad 
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Register;
