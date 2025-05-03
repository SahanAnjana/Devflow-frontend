// src/pages/finance/CreateAccount.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
  TextField,
  CircularProgress,
  Alert,
  Stepper,
  Step,
  StepLabel,
  IconButton,
  Divider,
  FormControlLabel,
  Switch
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { createAccount } from '../../../api/finance-management/accounts';
import FinanceLayout from '../../../components/layout/FinanceLayout';
import FormSection from '../../../components/forms/FormSection';
import {FormStepper} from '../../../components/forms/FormStepper';

const CreateAccount = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [validationErrors, setValidationErrors] = useState({});

  const [accountForm, setAccountForm] = useState({
    name: '',
    type: 'bank',
    account_number: '',
    initial_balance: 0,
    currency: 'USD',
    is_active: true
  });

  const steps = ['Account Details', 'Additional Information'];

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAccountForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateStep = (step) => {
    const errors = {};
    
    if (step === 0) {
      if (!accountForm.name.trim()) errors.name = 'Account name is required';
      if (!accountForm.type) errors.type = 'Account type is required';
      if (accountForm.initial_balance < 0) errors.initial_balance = 'Balance cannot be negative';
    }
    
    return errors;
  };

  const handleNext = () => {
    const errors = validateStep(activeStep);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const newAccount = await createAccount(accountForm);
      navigate(`/finance/accounts/${newAccount.id}`);
    } catch (err) {
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <FinanceLayout>
      <Box sx={{ py: 3 }}>
        <Box display="flex" alignItems="center" mb={3}>
          <IconButton onClick={() => navigate('/finance/accounts')} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
            Create New Account
          </Typography>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        <Card>
          <CardContent>
            <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            {activeStep === 0 && (
              <FormSection title="Account Details">
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Account Name"
                      name="name"
                      fullWidth
                      value={accountForm.name}
                      onChange={handleFormChange}
                      error={!!validationErrors.name}
                      helperText={validationErrors.name}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      select
                      label="Account Type"
                      name="type"
                      value={accountForm.type}
                      onChange={handleFormChange}
                      fullWidth
                      required
                    >
                      <option value="bank">Bank Account</option>
                      <option value="cash">Cash</option>
                      <option value="credit">Credit Card</option>
                    </TextField>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Initial Balance"
                      name="initial_balance"
                      type="number"
                      fullWidth
                      value={accountForm.initial_balance}
                      onChange={handleFormChange}
                      InputProps={{ startAdornment: '$' }}
                      error={!!validationErrors.initial_balance}
                      helperText={validationErrors.initial_balance}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      select
                      label="Currency"
                      name="currency"
                      value={accountForm.currency}
                      onChange={handleFormChange}
                      fullWidth
                    >
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                    </TextField>
                  </Grid>
                </Grid>
              </FormSection>
            )}

            {activeStep === 1 && (
              <FormSection title="Additional Information">
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Account Number"
                      name="account_number"
                      fullWidth
                      value={accountForm.account_number}
                      onChange={handleFormChange}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          name="is_active"
                          checked={accountForm.is_active}
                          onChange={handleFormChange}
                        />
                      }
                      label="Account Active"
                    />
                  </Grid>
                </Grid>
              </FormSection>
            )}

            <FormStepper
              steps={steps}
              activeStep={activeStep}
              handleBack={handleBack}
              handleNext={handleNext}
              handleSubmit={handleSubmit}
              saveLoading={loading}
              lastStepLabel="Create Account"
              cancelPath="/finance/accounts"
            />
          </CardContent>
        </Card>
      </Box>
    </FinanceLayout>
  );
};

export default CreateAccount;
