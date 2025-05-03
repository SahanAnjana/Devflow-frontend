// components/common/LoadingWrapper.jsx
import { Box, CircularProgress } from '@mui/material';

export const LoadingWrapper = ({ loading, children }) => {
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" my={4}>
        <CircularProgress />
      </Box>
    );
  }
  return children;
};