// src/pages/finance/CreateBudget.jsx
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
import { createBudget, getProjects, getDepartments } from '../../../api/finance';
import FinanceLayout from '../../../components/layout/FinanceLayout';
import FormSection from '../../../components/forms/FormSection';
import {FormStepper} from '../../../components/forms/FormStepper';

const CreateBudget = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [validationErrors, setValidationErrors] = useState({});
  const [projects, setProjects] = useState([]);
  const [departments, setDepartments] = useState([]);

  const [budgetForm, setBudgetForm] = useState({
    name: '',
    amount: 0,
    type: 'project',
    start_date: new Date(),
    end_date: new Date(),
    entity_id: '',
    description: ''
  });

  const steps = ['Basic Information', 'Budget Allocation'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projData, deptData] = await Promise.all([
          getProjects(),
          getDepartments()
        ]);
        setProjects(projData);
        setDepartments(deptData);
      } catch (err) {
        setError('Failed to load reference data');
      }
    };
    fetchData();
  }, []);

  const handleFormChange = (name, value) => {
    setBudgetForm(prev => ({ ...prev, [name]: value }));
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateStep = (step) => {
    const errors = {};
    
    if (step === 0) {
      if (!budgetForm.name.trim()) errors.name = 'Budget name is required';
      if (budgetForm.amount <= 0) errors.amount = 'Amount must be positive';
      if (budgetForm.start_date > budgetForm.end_date) errors.dates = 'End date must be after start date';
    }
    
    if (step === 1 && !budgetForm.entity_id) errors.entity_id = 'Please select a target entity';
    
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
      const newBudget = await createBudget(budgetForm);
      navigate(`/finance/budgets/${newBudget.id}`);
    } catch (err) {
      setError(err.message || 'Failed to create budget');
    } finally {
      setLoading(false);
    }
  };

  return (
    <FinanceLayout>
      <Box sx={{ py: 3 }}>
        <Box display="flex" alignItems="center" mb={3}>
          <IconButton onClick={() => navigate('/finance/budgets')} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
            Create New Budget
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
              <FormSection title="Basic Information">
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Budget Name"
                      name="name"
                      fullWidth
                      value={budgetForm.name}
                      onChange={(e) => handleFormChange('name', e.target.value)}
                      error={!!validationErrors.name}
                      helperText={validationErrors.name}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Amount"
                      name="amount"
                      type="number"
                      fullWidth
                      value={budgetForm.amount}
                      onChange={(e) => handleFormChange('amount', e.target.value)}
                      InputProps={{ startAdornment: '$' }}
                      error={!!validationErrors.amount}
                      helperText={validationErrors.amount}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <DatePicker
                      label="Start Date"
                      value={budgetForm.start_date}
                      onChange={(date) => handleFormChange('start_date', date)}
                      renderInput={(params) => <TextField {...params} fullWidth />}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <DatePicker
                      label="End Date"
                      value={budgetForm.end_date}
                      onChange={(date) => handleFormChange('end_date', date)}
                      renderInput={(params) => <TextField {...params} fullWidth />}
                    />
                  </Grid>
                </Grid>
              </FormSection>
            )}

            {activeStep === 1 && (
              <FormSection title="Budget Allocation">
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      select
                      label="Budget Type"
                      name="type"
                      value={budgetForm.type}
                      onChange={(e) => handleFormChange('type', e.target.value)}
                      fullWidth
                    >
                      <option value="project">Project</option>
                      <option value="department">Department</option>
                    </TextField>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      select
                      label={`Select ${budgetForm.type.charAt(0).toUpperCase() + budgetForm.type.slice(1)}`}
                      name="entity_id"
                      value={budgetForm.entity_id}
                      onChange={(e) => handleFormChange('entity_id', e.target.value)}
                      fullWidth
                      error={!!validationErrors.entity_id}
                      helperText={validationErrors.entity_id}
                    >
                      {(budgetForm.type === 'project' ? projects : departments).map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.name}
                        </option>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Description"
                      name="description"
                      multiline
                      rows={4}
                      fullWidth
                      value={budgetForm.description}
                      onChange={(e) => handleFormChange('description', e.target.value)}
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
              lastStepLabel="Create Budget"
              cancelPath="/finance/budgets"
            />
          </CardContent>
        </Card>
      </Box>
    </FinanceLayout>
  );
};

export default CreateBudget;
