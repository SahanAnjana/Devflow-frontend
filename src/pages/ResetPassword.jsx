import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  IconButton,
  InputAdornment,
  TextField,
  Typography
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useAuth } from '../context/AuthContext';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { validateResetToken, resetPassword } = useAuth();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isValidToken, setIsValidToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Validate token on component mount
  useEffect(() => {
    const checkToken = async () => {
      if (!token) {
        setErrorMessage('Invalid or missing reset token');
        setIsValidToken(false);
        setIsLoading(false);
        return;
      }

      try {
        await validateResetToken(token);
        setIsValidToken(true);
      } catch (error) {
        console.error('Token validation failed:', error);
        setErrorMessage('This password reset link is invalid or has expired');
        setIsValidToken(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkToken();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset states
    setErrorMessage('');
    setSuccessMessage('');
    
    // Validation
    if (!newPassword || !confirmPassword) {
      setErrorMessage('Please fill in all fields');
      return;
    }

    if (newPassword.length < 8) {
      setErrorMessage('Password must be at least 8 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    setIsSubmitting(true);

    try {
      await resetPassword(token, newPassword);
      setSuccessMessage('Your password has been reset successfully');
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      console.error('Password reset failed:', error);
      setErrorMessage(
        error.response?.data?.detail || 
        'Failed to reset password. Please try again later.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Container maxWidth="sm" sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

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
              Create new password
            </Typography>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
              Get back to work.
            </Typography>
          </Box>
          
          <Box 
            component="img" 
            src="/reset-password-illustration.png" 
            alt="Reset Password" 
            sx={{ mt: 'auto', width: '100%', maxHeight: 300 }}
          />
        </Box>
        
        {/* Right Panel - Reset Password Form */}
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
            Reset Your Password
          </Typography>
          
          {!isValidToken ? (
            <Box>
              <Alert severity="error" sx={{ mb: 3 }}>
                {errorMessage || 'Invalid or expired reset link'}
              </Alert>
              <Button
                component={Link}
                to="/forgot-password"
                variant="contained"
                fullWidth
                sx={{ 
                  py: 1.5, 
                  bgcolor: '#4285F4',
                  '&:hover': {
                    bgcolor: '#3367D6'
                  }
                }}
              >
                Request New Password Reset
              </Button>
            </Box>
          ) : (
            <>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                Enter your new password below to reset your account password.
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
                  New Password
                </Typography>
                <TextField
                  fullWidth
                  type={showPassword ? 'text' : 'password'} 
                  placeholder="••••••••"
                  variant="outlined"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  error={!!errorMessage && !newPassword}
                  disabled={isSubmitting}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                  sx={{ mb: 3 }}
                />
                
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                  Confirm New Password
                </Typography>
                <TextField
                  fullWidth
                  type={showConfirmPassword ? 'text' : 'password'} 
                  placeholder="••••••••"
                  variant="outlined"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  error={!!errorMessage && !confirmPassword}
                  disabled={isSubmitting}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          edge="end"
                        >
                          {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
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
                  {isSubmitting ? 'Resetting...' : 'Reset Password'}
                </Button>
              </Box>
            </>
          )}
          
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
    </Container>
  );
};

export default ResetPassword;