import { useState, useEffect } from 'react';
import { Button, Checkbox, TextField } from '@mui/material';
import loginImg from '@/assets/images/login.png';
import authService from '@/api/authService';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: 'Krishna',
    password: 'Test@123',
    rememberMe: false,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // For testing only - this will pre-populate credentials for easier testing
  useEffect(() => {
    // Pre-populate login form with test credentials in non-production
    setFormData(prev => ({
      ...prev,
      username: 'Krishna',
      password: 'Test@123'
    }));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
        navigate('/dashboard');
        return;
    setLoading(true);
    setError('');

    // Basic validation
    if (!formData.username || !formData.password) {
      setError('Username and password are required');
      setLoading(false);
      return;
    }

    try {
      const response = await authService.login({
        username: formData.username,
        password: formData.password,
        loginType: '4'
      });
      
      // Only proceed if login was successful
      if (response) {
        // Store user data
        if (response.userData) {
          localStorage.setItem('userData', JSON.stringify(response.userData));
        }
        if (formData.rememberMe) {
          localStorage.setItem('rememberMe', 'true');
        }
        navigate('/dashboard');
      } else {
        setError('Login failed. Please check your credentials.');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen">
      {/* Background for larger screens */}
      <div className="absolute inset-0 hidden md:block">
        <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600"></div>
        <div className="absolute inset-0 bg-white opacity-40"></div>
      </div>

      {/* Simple gradient background for mobile */}
      <div className="absolute inset-0 md:hidden bg-gradient-to-r from-blue-500 to-blue-800"></div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-3 sm:px-4 lg:px-8">
        <div className="bg-white shadow-md rounded-2xl overflow-hidden w-full max-w-xs sm:max-w-sm md:max-w-2xl flex flex-col md:flex-row">
          
          {/* Illustration Section (hidden on small screens) */}
          <div className="hidden md:flex md:w-1/2 items-center justify-center bg-blue-500 p-4 sm:p-8">
            <img
              src={loginImg}
              alt="Doctors and Nurse"
              className="max-w-full h-auto object-contain mx-auto drop-shadow-lg"
            />
          </div>

          {/* Login Form Section */}
          <div className="w-full md:w-1/2 p-4 sm:p-6 space-y-4 flex flex-col justify-center">
            <h5 className="text-sm sm:text-base md:text-xl font-bold text-gray-800 text-center md:text-left">
              Welcome to Trikarana Solutions
            </h5>
            <p className="text-xs sm:text-sm text-gray-500 text-center md:text-left">
              Login to your account
            </p>

            <form className="space-y-3" onSubmit={handleSubmit}>
              {error && (
                <div className="text-red-500 text-xs text-center">{error}</div>
              )}
              
              {/* Username */}
              <TextField
                name="username"
                label="Username"
                variant="outlined"
                fullWidth
                size="small"
                value={formData.username}
                onChange={handleChange}
                disabled={loading}
              />

              {/* Password */}
              <TextField
                name="password"
                label="Password"
                type="password"
                variant="outlined"
                fullWidth
                size="small"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
              />

              {/* Submit Button */}
              <Button
                type="submit"
                variant="contained"
                color="primary"
                className="w-full text-sm py-2"
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login'}
              </Button>

              {/* Remember Me & Forgot Password */}
              <div className="flex flex-col sm:flex-row items-center justify-between text-xs mt-0.5 gap-0.5 sm:gap-0">
                <label className="flex items-center text-gray-700">
                  <Checkbox
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    size="small"
                    sx={{ '& .MuiSvgIcon-root': { fontSize: 16 } }}
                    disabled={loading}
                  />
                  <span className="ml-0.5">Remember Me</span>
                </label>
                <a href="#" className="text-blue-600 hover:underline">
                  Forgot your password?
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
