// src/pages/hr/CreateEmployee.jsx
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
  Divider
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import FormSection from '../../../components/forms/FormSection';
import {FormStepper} from '../../../components/forms/FormStepper';
import {SelectField} from '../../../components/fields/SelectField';
import {DateField} from '../../../components/fields/DateField';
import { getDepartments } from '../../../api/hr-management/departments';
import { createEmployee } from '../../../api/hr-management/employees';
import { getPositions } from '../../../api/hr-management/positions';
import HRLayout from '../../../components/layout/HRLayout';

const CreateEmployee = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [error, setError] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);
  const [activeStep, setActiveStep] = useState(0);
  const [validationErrors, setValidationErrors] = useState({});
  
  const [employeeForm, setEmployeeForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    department_id: '',
    position_id: '',
    hire_date: '',
    salary: '',
    address: '',
    is_active: true,
    username: '',
    password: '',
    send_welcome_email: true
  });

  const steps = [
    'Personal Information',
    'Employment Details',
    'Account Setup'
  ];

  useEffect(() => {
    const fetchReferenceData = async () => {
      try {
        setLoading(true);
        const [departmentsData, positionsData] = await Promise.all([
          getDepartments(),
          getPositions()
        ]);
        
        setDepartments(departmentsData);
        setPositions(positionsData);
        
      } catch (err) {
        console.error('Error fetching reference data:', err);
        setError('Failed to load reference data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchReferenceData();
  }, []);

  const handleFormChange = (event) => {
    const { name, value, type, checked } = event.target;
    setEmployeeForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
    
    if ((name === 'first_name' || name === 'last_name') && 
        employeeForm.first_name && employeeForm.last_name) {
      const firstName = name === 'first_name' ? value : employeeForm.first_name;
      const lastName = name === 'last_name' ? value : employeeForm.last_name;
      const suggestedUsername = `${firstName.toLowerCase()}.${lastName.toLowerCase()}`;
      
      setEmployeeForm(prev => ({
        ...prev,
        username: suggestedUsername
      }));
    }
  };

  const handleNext = () => {
    const errors = validateStep(activeStep);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const validateStep = (step) => {
    const errors = {};
    
    if (step === 0) {
      if (!employeeForm.first_name.trim()) errors.first_name = 'First name is required';
      if (!employeeForm.last_name.trim()) errors.last_name = 'Last name is required';
      if (!employeeForm.email.trim()) {
        errors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(employeeForm.email)) {
        errors.email = 'Invalid email format';
      }
    } else if (step === 1) {
      if (!employeeForm.department_id) errors.department_id = 'Department is required';
      if (!employeeForm.position_id) errors.position_id = 'Position is required';
      if (!employeeForm.hire_date) errors.hire_date = 'Hire date is required';
    } else if (step === 2) {
      if (!employeeForm.username.trim()) errors.username = 'Username is required';
      if (!employeeForm.password.trim()) {
        errors.password = 'Password is required';
      } else if (employeeForm.password.length < 8) {
        errors.password = 'Password must be at least 8 characters';
      }
    }
    
    return errors;
  };

  const handleSubmit = async () => {
    const errors = validateStep(activeStep);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    
    try {
      setSaveLoading(true);
      const newEmployee = await createEmployee(employeeForm);
      navigate(`/hr/employees/${newEmployee.id}`);
      
    } catch (err) {
      console.error('Error creating employee:', err);
      setError('Failed to create employee. Please try again.');
    } finally {
      setSaveLoading(false);
    }
  };

  if (loading) {
    return (
      <HRLayout>
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      </HRLayout>
    );
  }

  return (
    <HRLayout>
      <Box sx={{ py: 3 }}>
        <Box display="flex" alignItems="center" mb={3}>
          <IconButton 
            sx={{ mr: 2 }} 
            onClick={() => navigate('/hr/employees')}
            aria-label="back"
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
            Add New Employee
          </Typography>
        </Box>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            
            {/* Step 1: Personal Information */}
            {activeStep === 0 && (
              <FormSection title="Personal Information">
                <Grid item xs={12} md={6}>
                  <TextField
                    label="First Name"
                    name="first_name"
                    fullWidth
                    value={employeeForm.first_name}
                    onChange={handleFormChange}
                    required
                    error={!!validationErrors.first_name}
                    helperText={validationErrors.first_name}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Last Name"
                    name="last_name"
                    fullWidth
                    value={employeeForm.last_name}
                    onChange={handleFormChange}
                    required
                    error={!!validationErrors.last_name}
                    helperText={validationErrors.last_name}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Email"
                    name="email"
                    type="email"
                    fullWidth
                    value={employeeForm.email}
                    onChange={handleFormChange}
                    required
                    error={!!validationErrors.email}
                    helperText={validationErrors.email}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Phone"
                    name="phone"
                    fullWidth
                    value={employeeForm.phone}
                    onChange={handleFormChange}
                    error={!!validationErrors.phone}
                    helperText={validationErrors.phone}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Address"
                    name="address"
                    fullWidth
                    multiline
                    rows={3}
                    value={employeeForm.address}
                    onChange={handleFormChange}
                    error={!!validationErrors.address}
                    helperText={validationErrors.address}
                  />
                </Grid>
              </FormSection>
            )}
            
            {/* Step 2: Employment Details */}
            {activeStep === 1 && (
              <FormSection title="Employment Details">
                <Grid item xs={12} md={6}>
                  <SelectField
                    label="Department"
                    name="department_id"
                    value={employeeForm.department_id}
                    onChange={handleFormChange}
                    options={departments.map(dept => ({
                      value: dept.id,
                      label: dept.name
                    }))}
                    required
                    error={validationErrors.department_id}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <SelectField
                    label="Position"
                    name="position_id"
                    value={employeeForm.position_id}
                    onChange={handleFormChange}
                    options={positions
                      .filter(pos => !employeeForm.department_id || 
                        pos.department_id === employeeForm.department_id)
                      .map(pos => ({
                        value: pos.id,
                        label: pos.title
                      }))}
                    required
                    error={validationErrors.position_id}
                    disabled={!employeeForm.department_id}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <DateField
                    label="Hire Date"
                    name="hire_date"
                    value={employeeForm.hire_date}
                    onChange={handleFormChange}
                    required
                    error={validationErrors.hire_date}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Salary"
                    name="salary"
                    type="number"
                    fullWidth
                    value={employeeForm.salary}
                    onChange={handleFormChange}
                    error={!!validationErrors.salary}
                    helperText={validationErrors.salary}
                    InputProps={{
                      startAdornment: <Box component="span" sx={{ mr: 1 }}>$</Box>,
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <SelectField
                    label="Status"
                    name="is_active"
                    value={employeeForm.is_active}
                    onChange={handleFormChange}
                    options={[
                      { value: true, label: 'Active' },
                      { value: false, label: 'Inactive' }
                    ]}
                  />
                </Grid>
              </FormSection>
            )}
            
            {/* Step 3: Account Setup */}
            {activeStep === 2 && (
              <FormSection title="Account Setup">
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Username"
                    name="username"
                    fullWidth
                    required
                    value={employeeForm.username}
                    onChange={handleFormChange}
                    error={!!validationErrors.username}
                    helperText={validationErrors.username}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Password"
                    name="password"
                    type="password"
                    fullWidth
                    required
                    value={employeeForm.password}
                    onChange={handleFormChange}
                    error={!!validationErrors.password}
                    helperText={validationErrors.password || 'Password must be at least 8 characters'}
                  />
                </Grid>
                <Grid item xs={12}>
                  <SelectField
                    label="Send Welcome Email"
                    name="send_welcome_email"
                    value={employeeForm.send_welcome_email}
                    onChange={handleFormChange}
                    options={[
                      { value: true, label: 'Yes' },
                      { value: false, label: 'No' }
                    ]}
                    helperText="Send login credentials to the employee's email"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Alert severity="info" sx={{ my: 2 }}>
                    A welcome email will be sent to the employee with their login credentials if selected.
                  </Alert>
                </Grid>
              </FormSection>
            )}
            
            <FormStepper
              steps={steps}
              activeStep={activeStep}
              handleBack={handleBack}
              handleNext={handleNext}
              handleSubmit={handleSubmit}
              saveLoading={saveLoading}
              lastStepLabel="Create Employee"
              cancelPath="/hr/employees"
            />
          </CardContent>
        </Card>
      </Box>
    </HRLayout>
  );
};

export default CreateEmployee;