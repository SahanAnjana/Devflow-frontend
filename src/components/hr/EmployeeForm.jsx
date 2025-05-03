// src/components/hr/EmployeeForm.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  FormControlLabel,
  Switch,
  Alert,
  CircularProgress
} from '@mui/material';
import { getDepartments, getPositions, createEmployee, updateEmployee } from '../../api/hr';

const initialFormState = {
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  hire_date: '',
  department_id: '',
  position_id: '',
  salary: '',
  is_active: true,
  address: '',
  emergency_contact: '',
  emergency_phone: '',
};

const EmployeeForm = ({ employeeData = null, isEdit = false }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialFormState);
  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch departments and positions in parallel
        const [departmentsData, positionsData] = await Promise.all([
          getDepartments(),
          getPositions()
        ]);
        
        setDepartments(departmentsData);
        setPositions(positionsData);
        
        // If in edit mode, populate form with employee data
        if (isEdit && employeeData) {
          setFormData({
            ...employeeData,
            department_id: employeeData.department_id || '',
            position_id: employeeData.position_id || '',
            hire_date: employeeData.hire_date ? new Date(employeeData.hire_date).toISOString().split('T')[0] : '',
          });
        }
        
      } catch (err) {
        console.error('Error fetching form data:', err);
        setError('Failed to load form data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [isEdit, employeeData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
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
    if (!formData.first_name.trim()) errors.first_name = 'First name is required';
    if (!formData.last_name.trim()) errors.last_name = 'Last name is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    if (!formData.department_id) errors.department_id = 'Department is required';
    if (!formData.position_id) errors.position_id = 'Position is required';
    
    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailPattern.test(formData.email)) {
      errors.email = 'Invalid email format';
    }
    
    // Phone validation (optional field)
    const phonePattern = /^\+?[0-9]{10,15}$/;
    if (formData.phone && !phonePattern.test(formData.phone.replace(/\s/g, ''))) {
      errors.phone = 'Invalid phone format';
    }
    
    // Salary validation
    if (formData.salary && (isNaN(formData.salary) || parseFloat(formData.salary) < 0)) {
      errors.salary = 'Salary must be a positive number';
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
      
      // Format data for API
      const employeeSubmitData = {
        ...formData,
        salary: formData.salary ? parseFloat(formData.salary) : null,
      };
      
      if (isEdit) {
        await updateEmployee(employeeData.id, employeeSubmitData);
      } else {
        await createEmployee(employeeSubmitData);
      }
      
      // Redirect back to employees list
      navigate('/hr/employees');
      
    } catch (err) {
      console.error('Error submitting form:', err);
      setError(err.message || 'Failed to save employee. Please try again.');
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
            Personal Information
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="first_name"
                label="First Name"
                fullWidth
                value={formData.first_name}
                onChange={handleChange}
                error={Boolean(formErrors.first_name)}
                helperText={formErrors.first_name}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                name="last_name"
                label="Last Name"
                fullWidth
                value={formData.last_name}
                onChange={handleChange}
                error={Boolean(formErrors.last_name)}
                helperText={formErrors.last_name}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                name="email"
                label="Email"
                type="email"
                fullWidth
                value={formData.email}
                onChange={handleChange}
                error={Boolean(formErrors.email)}
                helperText={formErrors.email}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                name="phone"
                label="Phone"
                fullWidth
                value={formData.phone}
                onChange={handleChange}
                error={Boolean(formErrors.phone)}
                helperText={formErrors.phone}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                name="address"
                label="Address"
                fullWidth
                multiline
                rows={2}
                value={formData.address}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
          
          <Divider sx={{ my: 3 }} />
          
          <Typography variant="h6" gutterBottom>
            Employment Information
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={Boolean(formErrors.department_id)} required>
                <InputLabel>Department</InputLabel>
                <Select
                  name="department_id"
                  value={formData.department_id}
                  onChange={handleChange}
                  label="Department"
                >
                  {departments.map((dept) => (
                    <MenuItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </MenuItem>
                  ))}
                </Select>
                {formErrors.department_id && (
                  <FormHelperText>{formErrors.department_id}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={Boolean(formErrors.position_id)} required>
                <InputLabel>Position</InputLabel>
                <Select
                  name="position_id"
                  value={formData.position_id}
                  onChange={handleChange}
                  label="Position"
                >
                  {positions.map((position) => (
                    <MenuItem key={position.id} value={position.id}>
                      {position.title}
                    </MenuItem>
                  ))}
                </Select>
                {formErrors.position_id && (
                  <FormHelperText>{formErrors.position_id}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                name="hire_date"
                label="Hire Date"
                type="date"
                fullWidth
                value={formData.hire_date}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                name="salary"
                label="Salary"
                type="number"
                fullWidth
                value={formData.salary}
                onChange={handleChange}
                error={Boolean(formErrors.salary)}
                helperText={formErrors.salary}
                InputProps={{ inputProps: { min: 0, step: "any" } }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                name="emergency_contact"
                label="Emergency Contact Name"
                fullWidth
                value={formData.emergency_contact}
                onChange={handleChange}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                name="emergency_phone"
                label="Emergency Contact Phone"
                fullWidth
                value={formData.emergency_phone}
                onChange={handleChange}
              />
            </Grid>
            
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleChange}
                    color="primary"
                  />
                }
                label="Active Employee"
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button
          variant="outlined"
          onClick={() => navigate('/hr/employees')}
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
          {isEdit ? 'Update Employee' : 'Create Employee'}
        </Button>
      </Box>
    </Box>
  );
};

export default EmployeeForm;