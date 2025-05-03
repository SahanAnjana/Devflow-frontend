import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  TextField,
  Typography
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { forgotPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset states
    setErrorMessage('');
    setSuccessMessage('');
    
    // Basic validation
    if (!email) {
      setErrorMessage('Please enter your email address');
      return;
    }

    if (!email.includes('@')) {
      setErrorMessage('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);

    try {
      // Replace with your actual API endpoint
      let response = await forgotPassword(email);
      
      // Show success message
      setSuccessMessage(response.message);
      setEmail(''); // Clear the form
    } catch (error) {
      console.error('Password reset request failed:', error);
      setErrorMessage(
        error.response?.data?.detail || 
        'Unable to process your request. Please try again later.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ height: '100vh', display: 'flex', alignItems: 'center' }}>
      <Box sx={{ 
        display: 'flex', 
        width: '100%', 
        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
        borderRadius: 2,
        overflow: 'hidden'
      }}>
        {/* Left Panel */}
        <Box 
          sx={{ 
            width: '50%', 
            backgroundColor: '#4285F4', 
            padding: 5,
            color: 'white',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Box sx={{ mb: 4 }}>
            <Typography 
              variant="h6" 
              component="div" 
              sx={{ 
                display: 'flex', 
                alignItems: 'center',
                fontWeight: 'bold',
                mb: 6
              }}
            >
              <Box 
                component="img" 
                src="/logo-placeholder.png" 
                alt="Logo" 
                sx={{ width: 32, height: 32, mr: 1, bgcolor: 'white', borderRadius: 1 }}
              />
              Devflow
            </Typography>
            
            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 1 }}>
              Reset your password
            </Typography>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
              Get back on track.
            </Typography>
          </Box>
          
          <Box 
            component="img" 
            src="/forgot-password-illustration.png" 
            alt="Password Reset" 
            sx={{ mt: 'auto', width: '100%', maxHeight: 300 }}
          />
        </Box>
        
        {/* Right Panel - Password Reset Form */}
        <Box 
          sx={{ 
            width: '50%', 
            padding: 5,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}
        >
          <Typography variant="h5" component="h2" sx={{ mb: 2, fontWeight: 'bold' }}>
            Forgot Password
          </Typography>
          
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Enter your email address and we'll send you instructions to reset your password.
          </Typography>
          
          {/* Success Message */}
          {successMessage && (
            <Alert severity="success" sx={{ mb: 3 }}>
              {successMessage}
            </Alert>
          )}
          
          {/* Error Message */}
          {errorMessage && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {errorMessage}
            </Alert>
          )}
          
          <Box component="form" onSubmit={handleSubmit}>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
              Email Address
            </Typography>
            <TextField
              fullWidth
              placeholder="youremail@gmail.com"
              variant="outlined"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={!!errorMessage}
              disabled={isSubmitting}
              sx={{ mb: 4 }}
            />
            
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={isSubmitting}
              sx={{ 
                py: 1.5, 
                bgcolor: '#4285F4',
                '&:hover': {
                  bgcolor: '#3367D6'
                }
              }}
              endIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <ArrowForwardIcon />}
            >
              {isSubmitting ? 'Sending...' : 'Send Reset Instructions'}
            </Button>
            
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Link to="/login" style={{ 
                color: '#4285F4', 
                textDecoration: 'none', 
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px'
              }}>
                <ArrowBackIcon fontSize="small" /> 
                <Typography variant="body2">
                  Back to Login
                </Typography>
              </Link>
            </Box>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default ForgotPassword;