// components/dialogs/ConfirmationDialog.jsx
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    CircularProgress
  } from '@mui/material';
  
export const ConfirmationDialog = ({
    open,
    onClose,
    onConfirm,
    title,
    content,
    confirmText,
    confirmColor = 'primary',
    loading
  }) => {
    return (
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{content}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={loading}>Cancel</Button>
          <Button
            onClick={onConfirm}
            color={confirmColor}
            disabled={loading}
            startIcon={loading && <CircularProgress size={20} />}
          >
            {confirmText}
          </Button>
        </DialogActions>
      </Dialog>
    );
  };