// components/forms/FormActionButtons.jsx
import { Box, Button, CircularProgress } from '@mui/material';

export const FormActionButtons = ({ 
  onCancel, 
  onSubmit, 
  submitLabel = 'Submit', 
  cancelLabel = 'Cancel', 
  loading = false,
  icon = null 
}) => (
  <Box display="flex" justifyContent="flex-end" mt={3}>
    <Button
      variant="outlined"
      sx={{ mr: 2 }}
      onClick={onCancel}
    >
      {cancelLabel}
    </Button>
    <Button
      variant="contained"
      color="primary"
      onClick={onSubmit}
      disabled={loading}
      startIcon={loading ? <CircularProgress size={20} /> : icon}
    >
      {submitLabel}
    </Button>
  </Box>
);