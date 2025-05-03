// src/components/common/ConfirmationDialog.jsx
import { 
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    CircularProgress
  } from '@mui/material';
  
  /**
   * Reusable confirmation dialog component
   * @param {Object} props Component props
   * @param {boolean} props.open Whether dialog is open
   * @param {function} props.onClose Handler for dialog close
   * @param {string} props.title Dialog title
   * @param {string} props.message Dialog message
   * @param {function} props.onConfirm Handler for confirm action
   * @param {string} props.confirmLabel Label for confirm button
   * @param {string} props.confirmColor Color for confirm button
   * @param {string} props.cancelLabel Label for cancel button
   * @param {boolean} props.loading Whether confirmation action is loading
   */
  const ConfirmationDialog = ({
    open,
    onClose,
    title = 'Confirm Action',
    message = 'Are you sure you want to proceed?',
    onConfirm,
    confirmLabel = 'Confirm',
    confirmColor = 'primary',
    cancelLabel = 'Cancel',
    loading = false
  }) => {
    return (
      <Dialog
        open={open}
        onClose={loading ? undefined : onClose}
      >
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button 
            onClick={onConfirm} 
            color={confirmColor} 
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {confirmLabel}
          </Button>
        </DialogActions>
      </Dialog>
    );
  };
  
  export default ConfirmationDialog;