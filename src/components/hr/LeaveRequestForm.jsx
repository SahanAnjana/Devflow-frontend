// src/components/hr/LeaveRequestForm.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Alert,
  CircularProgress
} from '@mui/material';
import { requestLeave, updateLeave, getEmployees } from '../../api/hr';

const leaveTypes = [
  { value: 'VACATION', label: 'Vacation' },
  { value: 'SICK', label: 'Sick Leave' },
  { value: 'PERSONAL', label: 'Personal Leave' },
  { value: 'BEREAVEMENT', label: 'Bereavement' },
  { value: 'UNPAID', label: 'Unpaid Leave' },
  { value: 'OTHER', label: 'Other' }
];

const initialFormState = {
  employee_id: '',
  leave_type: '',
  start_date: '',
  end_date: '',
  reason: '',
  status: 'PENDING'
};

const LeaveRequestForm = ({ leaveData = null, isEdit = false, isAdmin = false }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState(initialFormState);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // If admin, fetch employees list
        if (isAdmin) {
          const employeesData = await getEmployees();
          setEmployees(employeesData);
        }
        
        // If editing, populate form with existing data
        if (isEdit && leaveData) {
          setFormData({
            ...leaveData,
            start_date: new Date(leaveData.start_date).toISOString().split('T')[0],
            end_date: new Date(leaveData.end_date).toISOString().split('T')[0],
          });
        } else if (!isAdmin) {
          // If not admin, set current user's employee_id
          setFormData(prev => ({
            ...prev,
            employee_id: user.employee_id
          }));
        }
        
      } catch (err) {
        console.error('Error fetching form data:', err);
        setError('Failed to load form data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [isEdit, leaveData, isAdmin, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear error when field is changed
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    
    // Required fields validation
    if (!formData.employee_id) errors.employee_id = 'Employee is required';
    if (!formData.leave_type) errors.leave_type = 'Leave type is required';
    if (!formData.start_date) errors.start_date = 'Start date is required';
    if (!formData.end_date) errors.end_date = 'End date is required';
    if (!formData.reason.trim()) errors.reason = 'Reason is required';
    
    // Date validation
    const startDate = new Date(formData.start_date);
    const endDate = new Date(formData.end_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (startDate < today && !isEdit) {
      errors.start_date = 'Start date cannot be in the past';
    }
    
    if (endDate < startDate) {
      errors.end_date = 'End date cannot be before start date';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setSubmitLoading(true);
      
      if (isEdit) {
        await updateLeave(leaveData.id, formData);
      } else {
        await requestLeave(formData);
      }
      
      // Redirect back to leaves list
      navigate('/hr/leaves');
      
    } catch (err) {
      console.error('Error submitting form:', err);
      setError(err.message || 'Failed to save leave request. Please try again.');
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" my={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Card>
        <CardContent>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
          
          <Typography variant="h6" gutterBottom>
            {isEdit ? 'Edit Leave Request' : 'New Leave Request'}
          </Typography>
          
          <Grid container spacing={3}>
            {isAdmin && (
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={Boolean(formErrors.employee_id)} required>
                  <InputLabel>Employee</InputLabel>
                  <Select
                    name="employee_id"
                    value={formData.employee_id}
                    onChange={handleChange}
                    label="Employee"
                  >
                    {employees.map((employee) => (
                      <MenuItem key={employee.id} value={employee.id}>
                        {`${employee.first_name} ${employee.last_name}`}
                      </MenuItem>
                    ))}
                  </Select>
                  {formErrors.employee_id && (
                    <FormHelperText>{formErrors.employee_id}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
            )}
            
            <Grid item xs={12} sm={isAdmin ? 6 : 12}>
              <FormControl fullWidth error={Boolean(formErrors.leave_type)} required>
                <InputLabel>Leave Type</InputLabel>
                <Select
                  name="leave_type"
                  value={formData.leave_type}
                  onChange={handleChange}
                  label="Leave Type"
                >
                  {leaveTypes.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
                {formErrors.leave_type && (
                  <FormHelperText>{formErrors.leave_type}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                name="start_date"
                label="Start Date"
                type="date"
                fullWidth
                required
                value={formData.start_date}
                onChange={handleChange}
                error={Boolean(formErrors.start_date)}
                helperText={formErrors.start_date}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                name="end_date"
                label="End Date"
                type="date"
                fullWidth
                required
                value={formData.end_date}
                onChange={handleChange}
                error={Boolean(formErrors.end_date)}
                helperText={formErrors.end_date}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                name="reason"
                label="Reason for Leave"
                fullWidth
                required
                multiline
                rows={4}
                value={formData.reason}
                onChange={handleChange}
                error={Boolean(formErrors.reason)}
                helperText={formErrors.reason}
              />
            </Grid>
            
            {isAdmin && isEdit && (
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    label="Status"
                  >
                    <MenuItem value="PENDING">Pending</MenuItem>
                    <MenuItem value="APPROVED">Approved</MenuItem>
                    <MenuItem value="REJECTED">Rejected</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            )}
          </Grid>
        </CardContent>
      </Card>
      
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button
          variant="outlined"
          onClick={() => navigate('/hr/leaves')}
          disabled={submitLoading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={submitLoading}
          startIcon={submitLoading ? <CircularProgress size={20} /> : null}
        >
          {isEdit ? 'Update Request' : 'Submit Request'}
        </Button>
      </Box>
    </Box>
  );
};

export default LeaveRequestForm;