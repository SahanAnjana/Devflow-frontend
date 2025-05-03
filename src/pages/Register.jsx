import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  IconButton,
  InputAdornment,
  TextField,
  Typography
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      // Handle password mismatch
      return;
    }

    try {
      await register(email, password);
      setRegistrationSuccess(true);
    } catch (error) {
      console.error('Registration failed:', error);
      // Handle error state here
    }
  };

  if (registrationSuccess) {
    return (
      <Container maxWidth="sm" sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box 
          sx={{ 
            width: '100%',
            padding: 5,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
            borderRadius: 2,
          }}
        >
          <Box 
            component="img" 
            src="/workflow-illustration.png" 
            alt="Success" 
            sx={{ width: '60%', maxHeight: 250, mb: 4 }}
          />
          
          <Typography variant="h5" component="h2" sx={{ mb: 4, fontWeight: 'bold' }}>
            You are successfully registered!
          </Typography>
          
          <Button
            variant="contained"
            onClick={() => navigate('/')}
            sx={{ 
              py: 1.5, 
              px: 4,
              bgcolor: '#4285F4',
              '&:hover': {
                bgcolor: '#3367D6'
              }
            }}
            endIcon={<ArrowForwardIcon />}
          >
            Let's Start
          </Button>
        </Box>
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
              Your place to work
            </Typography>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
              Plan. Create. Control.
            </Typography>
          </Box>
          
          <Box 
            component="img" 
            src="/workflow-illustration.png" 
            alt="Workflow" 
            sx={{ mt: 'auto', width: '100%', maxHeight: 300 }}
          />
        </Box>
        
        {/* Right Panel - Registration Form */}
        <Box 
          sx={{ 
            width: '50%', 
            padding: 5,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}
        >
          <Typography variant="h5" component="h2" sx={{ mb: 4, fontWeight: 'bold' }}>
            Create your account
          </Typography>
          
          <Box component="form" onSubmit={handleSubmit}>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
              Email Address
            </Typography>
            <TextField
              fullWidth
              placeholder="youremail@gmail.com"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 3 }}
            />
            
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
              Password
            </Typography>
            <TextField
              fullWidth
              type={showPassword ? 'text' : 'password'} 
              placeholder="••••••••"
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
              Confirm Password
            </Typography>
            <TextField
              fullWidth
              type={showPassword ? 'text' : 'password'} 
              placeholder="••••••••"
              variant="outlined"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
              sx={{ mb: 4 }}
              error={password !== confirmPassword && confirmPassword !== ''}
              helperText={password !== confirmPassword && confirmPassword !== '' ? 'Passwords do not match' : ''}
            />
            
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ 
                py: 1.5, 
                bgcolor: '#4285F4',
                '&:hover': {
                  bgcolor: '#3367D6'
                }
              }}
              endIcon={<ArrowForwardIcon />}
            >
              Sign Up
            </Button>
            
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography variant="body2">
                Already have an account? <Link to="/login" style={{ color: '#4285F4', textDecoration: 'none' }}>Sign in</Link>
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default Register;