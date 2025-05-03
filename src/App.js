// frontend/src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { AuthProvider } from './context/AuthContext';
import { useState, useEffect } from 'react';
import {
  CssBaseline,
  CircularProgress,
  Box,
  Container
} from '@mui/material';

import routes from './routes';


function App() {
  const [loading, setLoading] = useState(true);

  // Check for existing token on initial load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // You could add token validation here
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <AuthProvider>
        <CssBaseline />
        <Router>
          <Container maxWidth="xl">
            <Routes>
              {routes.map((route, index) => (
                <Route key={index} path={route.path} element={route.element} />
              ))}
            </Routes>
          </Container>
        </Router>
      </AuthProvider>
    </LocalizationProvider>
  );
}

export default App;