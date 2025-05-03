// src/pages/finance/CreateInvoice.jsx
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
  IconButton
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { DatePicker } from '@mui/x-date-pickers';
import AddIcon from '@mui/icons-material/Add';
import { createInvoice } from '../../../api/finance';
import FinanceLayout from '../../../components/layout/FinanceLayout';
import FormSection from '../../../components/forms/FormSection';
import {FormStepper} from '../../../components/forms/FormStepper';

const CreateInvoice = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [validationErrors, setValidationErrors] = useState({});
  const [clients, setClients] = useState([]);
  const [items, setItems] = useState([{ description: '', amount: 0 }]);

  const [invoiceForm, setInvoiceForm] = useState({
    client_id: '',
    due_date: new Date(),
    terms: 'Net 30',
    notes: ''
  });

  const steps = ['Client Information', 'Invoice Items', 'Review'];

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const data = await getClients();
        setClients(data);
      } catch (err) {
        setError('Failed to load clients');
      }
    };
    fetchClients();
  }, []);

  const handleFormChange = (name, value) => {
    setInvoiceForm(prev => ({ ...prev, [name]: value }));
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, { description: '', amount: 0 }]);
  };

  const validateStep = (step) => {
    const errors = {};
    
    if (step === 0) {
      if (!invoiceForm.client_id) errors.client_id = 'Client is required';
      if (!invoiceForm.due_date) errors.due_date = 'Due date is required';
    }
    
    if (step === 1) {
      items.forEach((item, index) => {
        if (!item.description.trim()) errors[`item${index}_desc`] = 'Description required';
        if (item.amount <= 0) errors[`item${index}_amount`] = 'Amount must be positive';
      });
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
      const invoiceData = {
        ...invoiceForm,
        items: items.map(item => ({
          description: item.description,
          amount: parseFloat(item.amount)
        }))
      };
      const newInvoice = await createInvoice(invoiceData);
      navigate(`/finance/invoices/${newInvoice.id}`);
    } catch (err) {
      setError(err.message || 'Failed to create invoice');
    } finally {
      setLoading(false);
    }
  };

  return (
    <FinanceLayout>
      <Box sx={{ py: 3 }}>
        <Box display="flex" alignItems="center" mb={3}>
          <IconButton onClick={() => navigate('/finance/invoices')} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
            Create New Invoice
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
              <FormSection title="Client Information">
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      select
                      label="Client"
                      name="client_id"
                      value={invoiceForm.client_id}
                      onChange={(e) => handleFormChange('client_id', e.target.value)}
                      fullWidth
                      error={!!validationErrors.client_id}
                      helperText={validationErrors.client_id}
                      required
                    >
                      {clients.map(client => (
                        <option key={client.id} value={client.id}>
                          {client.name}
                        </option>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <DatePicker
                      label="Due Date"
                      value={invoiceForm.due_date}
                      onChange={(date) => handleFormChange('due_date', date)}
                      renderInput={(params) => <TextField {...params} fullWidth />}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Terms"
                      name="terms"
                      value={invoiceForm.terms}
                      onChange={(e) => handleFormChange('terms', e.target.value)}
                      fullWidth
                    />
                  </Grid>
                </Grid>
              </FormSection>
            )}

            {activeStep === 1 && (
              <FormSection title="Invoice Items">
                {items.map((item, index) => (
                  <Grid container spacing={2} key={index} sx={{ mb: 2 }}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Description"
                        value={item.description}
                        onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                        fullWidth
                        error={!!validationErrors[`item${index}_desc`]}
                        helperText={validationErrors[`item${index}_desc`]}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        label="Amount"
                        type="number"
                        value={item.amount}
                        onChange={(e) => handleItemChange(index, 'amount', e.target.value)}
                        InputProps={{ startAdornment: '$' }}
                        fullWidth
                        error={!!validationErrors[`item${index}_amount`]}
                        helperText={validationErrors[`item${index}_amount`]}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <Button 
                        variant="outlined" 
                        color="error"
                        onClick={() => setItems(items.filter((_, i) => i !== index))}
                        sx={{ mt: 1 }}
                      >
                        Remove
                      </Button>
                    </Grid>
                  </Grid>
                ))}
                <Button 
                  variant="outlined" 
                  startIcon={<AddIcon />}
                  onClick={addItem}
                  sx={{ mt: 2 }}
                >
                  Add Item
                </Button>
              </FormSection>
            )}

            {activeStep === 2 && (
              <FormSection title="Review & Submit">
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="h6">Client: {clients.find(c => c.id === invoiceForm.client_id)?.name}</Typography>
                    <Typography variant="body1">Due Date: {new Date(invoiceForm.due_date).toLocaleDateString()}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="h6">Items:</Typography>
                    {items.map((item, index) => (
                      <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography>{item.description}</Typography>
                        <Typography>${item.amount.toFixed(2)}</Typography>
                      </Box>
                    ))}
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Notes"
                      name="notes"
                      multiline
                      rows={3}
                      fullWidth
                      value={invoiceForm.notes}
                      onChange={(e) => handleFormChange('notes', e.target.value)}
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
              lastStepLabel="Create Invoice"
              cancelPath="/finance/invoices"
            />
          </CardContent>
        </Card>
      </Box>
    </FinanceLayout>
  );
};

export default CreateInvoice;