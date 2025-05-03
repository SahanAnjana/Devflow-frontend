// components/forms/FormStepper.jsx
import { Box, Button, CircularProgress } from '@mui/material';


export const FormStepper = ({ steps, activeStep, handleBack, handleNext, handleSubmit, saveLoading, lastStepLabel }) => {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button
          variant="outlined"
          disabled={activeStep === 0}
          onClick={handleBack}
        >
          Back
        </Button>
        <Box>
          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={saveLoading}
            >
              {saveLoading ? <CircularProgress size={24} /> : lastStepLabel}
            </Button>
          ) : (
            <Button variant="contained" color="primary" onClick={handleNext}>
              Next
            </Button>
          )}
        </Box>
      </Box>
    );
  };
