// src/pages/hr/CreateLeaveRequest.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Grid,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Divider,
  Card,
  CardContent,
  Typography,
  Stepper,
  Step,
  StepLabel,
  IconButton
} from '@mui/material';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { getEmployees } from '../../../api/hr-management/employees';
import { requestLeave } from '../../../api/hr-management/leaves';
import { useAuth } from '../../../context/AuthContext';
import HRLayout from '../../../components/layout/HRLayout';
import FormSection from '../../../components/forms/FormSection';
import { FormTextField } from '../../../components/forms/FormTextField';
import { DateField } from '../../../components/fields/DateField';
import { SelectField } from '../../../components/fields/SelectField';
import { FormStepper } from '../../../components/forms/FormStepper';
import { LoadingWrapper } from '../../../components/common/LoadingWrapper';
import { ErrorAlert } from '../../../components/common/ErrorAlert';

const CreateLeaveRequest = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [error, setError] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [activeStep, setActiveStep] = useState(0);
  const [validationErrors, setValidationErrors] = useState({});
  
  // Pre-selected employee ID from navigation state
  const preSelectedEmployeeId = location.state?.employeeId;
  
  const isHRorAdmin = user?.role === 'hr' || user?.role === 'admin';
  
  // Leave form state
  const [leaveForm, setLeaveForm] = useState({
    employee_id: preSelectedEmployeeId || (user?.employee_id || ''),
    leave_type: '',
    start_date: '',
    end_date: '',
    reason: '',
    contact_information: '',
    document_url: '',
    half_day: false
  });
  
  const steps = [
    'Leave Request Details',
    'Leave Reason & Contact Info'
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch employees if HR or admin
        if (isHRorAdmin) {
          const employeesData = await getEmployees();
          setEmployees(employeesData);
        }
        
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [isHRorAdmin]);

  const handleFormChange = (event) => {
    const { name, value, type, checked } = event.target;
    setLeaveForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const calculateDuration = () => {
    if (!leaveForm.start_date || !leaveForm.end_date) {
      return 0;
    }
    
    const start = new Date(leaveForm.start_date);
    const end = new Date(leaveForm.end_date);
    
    // Get the difference in days
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end dates
    
    return leaveForm.half_day ? diffDays - 0.5 : diffDays;
  };

  const validateStep = (step) => {
    const errors = {};
    
    if (step === 0) {
      if (!leaveForm.employee_id) errors.employee_id = 'Employee is required';
      if (!leaveForm.leave_type) errors.leave_type = 'Leave type is required';
      if (!leaveForm.start_date) errors.start_date = 'Start date is required';
      if (!leaveForm.end_date) {
        errors.end_date = 'End date is required';
      } else if (new Date(leaveForm.end_date) < new Date(leaveForm.start_date)) {
        errors.end_date = 'End date cannot be before start date';
      }
    } else if (step === 1) {
      if (!leaveForm.reason.trim()) errors.reason = 'Reason for leave is required';
    }
    
    return errors;
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

  const handleSubmit = async () => {
    const errors = validateStep(activeStep);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    
    try {
      setSaveLoading(true);
      
      // Calculate duration
      const duration = calculateDuration();
      
      // Submit leave request
      const leaveData = {
        ...leaveForm,
        duration
      };
      
      await requestLeave(leaveData);
      
      // Navigate to leave details page or back to leaves list
      navigate('/hr/leaves');
      
    } catch (err) {
      console.error('Error creating leave request:', err);
      setError('Failed to create leave request. Please try again.');
    } finally {
      setSaveLoading(false);
    }
  };

  if (loading) {
    return (
      <HRLayout>
        <LoadingWrapper loading={true} />
      </HRLayout>
    );
  }

  return (
    <HRLayout>
      <Box sx={{ py: 3 }}>
        <Box display="flex" alignItems="center" mb={3}>
          <IconButton 
            sx={{ mr: 2 }} 
            onClick={() => navigate('/hr/leaves')}
            aria-label="back"
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
            Submit Leave Request
          </Typography>
        </Box>
        
        <ErrorAlert error={error} />
        
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            
            {/* Step 1: Leave Request Details */}
            {activeStep === 0 && (
              <FormSection title="Leave Request Details">
                {isHRorAdmin && (
                  <Grid item xs={12} md={6}>
                    <SelectField
                      label="Employee"
                      name="employee_id"
                      value={leaveForm.employee_id}
                      onChange={handleFormChange}
                      options={employees.map((emp) => ({
                        value: emp.id,
                        label: `${emp.first_name} ${emp.last_name}`
                      }))}
                      required
                      error={validationErrors.employee_id}
                      disabled={!!preSelectedEmployeeId}
                    />
                  </Grid>
                )}
                
                <Grid item xs={12} md={isHRorAdmin ? 6 : 12}>
                  <SelectField
                    label="Leave Type"
                    name="leave_type"
                    value={leaveForm.leave_type}
                    onChange={handleFormChange}
                    options={[
                      { value: "annual", label: "Annual Leave" },
                      { value: "sick", label: "Sick Leave" },
                      { value: "personal", label: "Personal Leave" },
                      { value: "unpaid", label: "Unpaid Leave" },
                      { value: "maternity", label: "Maternity Leave" },
                      { value: "paternity", label: "Paternity Leave" },
                      { value: "bereavement", label: "Bereavement" }
                    ]}
                    required
                    error={validationErrors.leave_type}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <DateField
                    label="Start Date"
                    name="start_date"
                    value={leaveForm.start_date}
                    onChange={handleFormChange}
                    required
                    error={validationErrors.start_date}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <DateField
                    label="End Date"
                    name="end_date"
                    value={leaveForm.end_date}
                    onChange={handleFormChange}
                    required
                    error={validationErrors.end_date}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <SelectField
                    label="Half Day"
                    name="half_day"
                    value={leaveForm.half_day}
                    onChange={handleFormChange}
                    options={[
                      { value: false, label: "No" },
                      { value: true, label: "Yes" }
                    ]}
                    helperText="Select 'Yes' if requesting a half-day leave"
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <FormTextField
                    label="Duration (days)"
                    value={calculateDuration()}
                    disabled
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </FormSection>
            )}
            
            {/* Step 2: Leave Reason & Contact Info */}
            {activeStep === 1 && (
              <FormSection title="Leave Reason & Contact Information">
                <Grid item xs={12}>
                  <FormTextField
                    label="Reason for Leave"
                    name="reason"
                    multiline
                    rows={4}
                    value={leaveForm.reason}
                    onChange={handleFormChange}
                    required
                    error={validationErrors.reason}
                    helperText="Please provide a detailed reason for your leave request"
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <FormTextField
                    label="Contact Information During Leave"
                    name="contact_information"
                    value={leaveForm.contact_information}
                    onChange={handleFormChange}
                    helperText="Phone number or email where you can be reached during leave (optional)"
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <FormTextField
                    label="Supporting Document URL"
                    name="document_url"
                    value={leaveForm.document_url}
                    onChange={handleFormChange}
                    helperText="URL to any supporting documents, e.g. medical certificate (optional)"
                  />
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
              lastStepLabel="Submit Request"
              cancelPath="/hr/leaves"
            />
          </CardContent>
        </Card>
      </Box>
    </HRLayout>
  );
};

export default CreateLeaveRequest;