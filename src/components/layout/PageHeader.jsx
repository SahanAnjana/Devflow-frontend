// components/layout/PageHeader.jsx
import { Box, Typography, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export const PageHeader = ({ title, onBack }) => (
  <Box display="flex" alignItems="center" mb={3}>
    <IconButton 
      sx={{ mr: 2 }} 
      onClick={onBack}
      aria-label="back"
    >
      <ArrowBackIcon />
    </IconButton>
    <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
      {title}
    </Typography>
  </Box>
);