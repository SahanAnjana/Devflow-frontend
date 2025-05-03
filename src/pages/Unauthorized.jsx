import { Box, Button, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

const Unauthorized = () => {
  return (
    <Box 
      display="flex" 
      flexDirection="column" 
      alignItems="center" 
      justifyContent="center" 
      sx={{ 
        height: '80vh', 
        textAlign: 'center' 
      }}
    >
      <Box 
        component="img" 
        src="/unauthorized.png" 
        alt="Unauthorized" 
        sx={{ width: 120, height: 120, mb: 3 }}
      />
      
      <Typography variant="h4" component="h1" gutterBottom>
        Access Denied
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 4, maxWidth: 500 }}>
        You don't have permission to access this page. Please contact your administrator if you believe this is an error.
      </Typography>
      
      <Button 
        component={Link} 
        to="/" 
        variant="contained" 
        color="primary"
      >
        Return to Dashboard
      </Button>
    </Box>
  );
};

export default Unauthorized;