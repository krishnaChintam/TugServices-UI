import { useState, useEffect } from 'react';
import { Button, Checkbox, TextField, Box, Typography, Link, Paper,Snackbar, Alert } from '@mui/material';
import authService from '@/api/authService';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from "react-icons/fa";

const LoginPage = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    rememberMe: false,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      username: '',
      password: ''
    }));
  }, []);

  const handleClick = (e) => {
    e.preventDefault();
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setOpen(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.username || !formData.password) {
      setError('Username and password are required.');
      setLoading(false);
      return;
    }

    try {
      console.log('Attempting login with credentials:', { username: formData.username, password: '***' });
      const response = await authService.login({
        username: formData.username,
        password: formData.password,
      });

      if (response && response.success) {
        if (response.userData) {
          localStorage.setItem('userData', JSON.stringify(response.userData));
        }
        if (formData.rememberMe) {
          localStorage.setItem('rememberMe', 'true');
        }
        navigate('/dashboard');
      } else {
        console.log('Login failed: No response received or success false');
        setError('Login failed. Please check your credentials.');
      }
    } catch (err) {
      console.error('Login error caught:', err);
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        bgcolor: '#f0f2f5',
        p: 2,
      }}
    >
    <Snackbar
      open={open}
      autoHideDuration={4000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert onClose={handleClose} severity="info" variant="filled" sx={{ width: '100%' }}>
        Please contact admin for password reset.
      </Alert>
    </Snackbar>
      <Paper
        elevation={3}
        sx={{
          p: { xs: 3, md: 5 },
          width: '100%',
          maxWidth: '400px',
          borderRadius: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Company Logo Placeholder */}
        {/* Uncomment the import statement at the top and replace 'CompanyLogo' with your imported logo */}
        {/* You can adjust width/height/margin as needed */}
        {/* <Box sx={{ mb: 3 }}>
          <img src={CompanyLogo} alt="Company Logo" style={{ maxWidth: '150px', height: 'auto' }} />
        </Box> */}
        
        {/* For now, I'll use text as a placeholder since I don't have your image file */}
        <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', mb: 1, color: '#1976d2' }}> {/* Example brand color */}
          TUG
        </Typography>

        <Typography variant="h6" component="h1" sx={{ fontWeight: 'bold', mb: 1, color: '#333' }}>
          Welcome to Tug Services
        </Typography>
        <Typography variant="body2" sx={{ mb: 4, color: '#666' }}>
          Sign in to continue
        </Typography>
        
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          {error && (
            <Typography color="error" variant="body2" sx={{ mb: 2, textAlign: 'center' }}>
              {error}
            </Typography>
          )}

          <TextField
            name="username"
            label="Username"
            variant="outlined"
            fullWidth
            margin="normal"
            size="small"
            value={formData.username}
            onChange={handleChange}
            disabled={loading}
          />

          <TextField
            name="password"
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            size="small"
            value={formData.password}
            onChange={handleChange}
            disabled={loading}
          />
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1, mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Checkbox
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                size="small"
                disabled={loading}
                sx={{ p: 0.5 }}
              />
              <Typography variant="body2" sx={{ color: '#666', ml: 0.5 }}>
                Remember Me
              </Typography>
            </Box>
            <Link
              href="#"
              variant="body2"
              underline="hover"
              onClick={handleClick}
            >
              Forgot password?
            </Link>
          </Box>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            sx={{ mt: 2, py: 1.5, textTransform: 'none' }}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Sign In'}
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default LoginPage;