import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loginError, setLoginError] = useState('');
  const { login, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    
    if (!email || !password) {
      setLoginError('Please enter both email and password');
      return;
    }
    
    try {
      await login(email, password);
      navigate('/');
    } catch (error) {
      console.error('Login failed:', error);
      setLoginError(error.response?.data?.detail || 'Login failed. Please check your credentials.');
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
        
        {/* Right Panel - Login Form */}
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
            Sign In to Devflow
          </Typography>
          
          {/* Error Alert */}
          {(loginError || error) && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {loginError || error}
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 3 }}
              error={!!loginError && !email}
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
              error={!!loginError && !password}
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
              sx={{ mb: 2 }}
            />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4, alignItems: 'center' }}>
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                }
                label="Remember me"
              />
              <Link to="/forgot-password" style={{ color: 'inherit', textDecoration: 'none' }}>
                <Typography variant="body2">Forgot Password?</Typography>
              </Link>
            </Box>
            
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
              Sign In
            </Button>
            
            {/* <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography variant="body2">
                Don't have an account? <Link to="/register" style={{ color: '#4285F4', textDecoration: 'none' }}>Create one</Link>
              </Typography>
            </Box> */}
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;