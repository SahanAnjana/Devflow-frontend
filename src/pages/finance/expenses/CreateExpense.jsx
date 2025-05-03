// src/pages/finance/CreateExpense.jsx
import { useState } from 'react';
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
  IconButton
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { DatePicker } from '@mui/x-date-pickers';
import { createExpense } from '../../../api/finance-management/expenses';
import FinanceLayout from '../../../components/layout/FinanceLayout';
import FormSection from '../../../components/forms/FormSection';
import {FormStepper} from '../../../components/forms/FormStepper';

const CreateExpense = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [validationErrors, setValidationErrors] = useState({});
  const [files, setFiles] = useState([]);

  const [expenseForm, setExpenseForm] = useState({
    description: '',
    amount: 0,
    category: 'travel',
    date: new Date(),
    vendor: '',
    receipt: null
  });

  const steps = ['Expense Details', 'Attachments'];

  const handleFormChange = (name, value) => {
    setExpenseForm(prev => ({ ...prev, [name]: value }));
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleFileUpload = (e) => {
    const newFiles = Array.from(e.target.files);
    setFiles([...files, ...newFiles]);
  };

  const validateStep = (step) => {
    const errors = {};
    
    if (step === 0) {
      if (!expenseForm.description.trim()) errors.description = 'Description is required';
      if (expenseForm.amount <= 0) errors.amount = 'Amount must be positive';
      if (!expenseForm.date) errors.date = 'Date is required';
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
      const formData = new FormData();
      Object.entries(expenseForm).forEach(([key, value]) => {
        formData.append(key, value);
      });
      files.forEach(file => formData.append('attachments', file));
      
      const newExpense = await createExpense(formData);
      navigate(`/finance/expenses/${newExpense.id}`);
    } catch (err) {
      setError(err.message || 'Failed to create expense');
    } finally {
      setLoading(false);
    }
  };

  return (
    <FinanceLayout>
      <Box sx={{ py: 3 }}>
        <Box display="flex" alignItems="center" mb={3}>
          <IconButton onClick={() => navigate('/finance/expenses')} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
            Create New Expense
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
              <FormSection title="Expense Details">
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      label="Description"
                      name="description"
                      fullWidth
                      value={expenseForm.description}
                      onChange={(e) => handleFormChange('description', e.target.value)}
                      error={!!validationErrors.description}
                      helperText={validationErrors.description}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Amount"
                      name="amount"
                      type="number"
                      fullWidth
                      value={expenseForm.amount}
                      onChange={(e) => handleFormChange('amount', e.target.value)}
                      InputProps={{ startAdornment: '$' }}
                      error={!!validationErrors.amount}
                      helperText={validationErrors.amount}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      select
                      label="Category"
                      name="category"
                      value={expenseForm.category}
                      onChange={(e) => handleFormChange('category', e.target.value)}
                      fullWidth
                    >
                      <option value="travel">Travel</option>
                      <option value="supplies">Supplies</option>
                      <option value="equipment">Equipment</option>
                      <option value="other">Other</option>
                    </TextField>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <DatePicker
                      label="Date"
                      value={expenseForm.date}
                      onChange={(date) => handleFormChange('date', date)}
                      renderInput={(params) => <TextField {...params} fullWidth />}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Vendor"
                      name="vendor"
                      fullWidth
                      value={expenseForm.vendor}
                      onChange={(e) => handleFormChange('vendor', e.target.value)}
                    />
                  </Grid>
                </Grid>
              </FormSection>
            )}

            {activeStep === 1 && (
              <FormSection title="Attachments">
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <input
                      accept=".pdf,.jpg,.png"
                      style={{ display: 'none' }}
                      id="receipt-upload"
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                    />
                    <label htmlFor="receipt-upload">
                      <Button variant="contained" component="span">
                        Upload Receipts
                      </Button>
                    </label>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      {files.length} files selected
                    </Typography>
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
              lastStepLabel="Create Expense"
              cancelPath="/finance/expenses"
            />
          </CardContent>
        </Card>
      </Box>
    </FinanceLayout>
  );
};

export default CreateExpense;

