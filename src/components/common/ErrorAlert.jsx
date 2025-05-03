// components/common/ErrorAlert.jsx
import { Alert } from '@mui/material';

export const ErrorAlert = ({ error, sx = {} }) => {
  if (!error) return null;
  
  return (
    <Alert severity="error" sx={{ mb: 3, ...sx }}>
      {error}
    </Alert>
  );
};