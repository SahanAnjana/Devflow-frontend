// src/pages/hr/EmployeeDetails.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  Tabs,
  Tab,
  Divider,
  Avatar,
  Stack,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonIcon from '@mui/icons-material/Person';
import WorkIcon from '@mui/icons-material/Work';
import EventNoteIcon from '@mui/icons-material/EventNote';
import AssessmentIcon from '@mui/icons-material/Assessment';
import { getEmployeeById, updateEmployee } from '../../../api/hr-management/employees';
import { getDepartments } from '../../../api/hr-management/departments';
import { getPositions } from '../../../api/hr-management/positions';
import HRLayout from '../../../components/layout/HRLayout';

const EmployeeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [error, setError] = useState(null);
  const [employee, setEmployee] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  
  // Employee form state
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
    is_active: true
  });

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        setLoading(true);
        
        // Fetch employee data and reference data in parallel
        const [employeeData, departmentsData, positionsData] = await Promise.all([
          getEmployeeById(id),
          getDepartments(),
          getPositions()
        ]);
        
        setEmployee(employeeData);
        setDepartments(departmentsData);
        setPositions(positionsData);
        
        // Initialize form with employee data
        setEmployeeForm({
          first_name: employeeData.first_name || '',
          last_name: employeeData.last_name || '',
          email: employeeData.email || '',
          phone: employeeData.phone || '',
          department_id: employeeData.department_id || '',
          position_id: employeeData.position_id || '',
          hire_date: employeeData.hire_date || '',
          salary: employeeData.salary || '',
          address: employeeData.address || '',
          is_active: employeeData.is_active !== false
        });
        
      } catch (err) {
        console.error('Error fetching employee data:', err);
        setError('Failed to load employee data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchEmployeeData();
  }, [id]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleFormChange = (event) => {
    const { name, value, type, checked } = event.target;
    setEmployeeForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleToggleEditMode = () => {
    if (editMode) {
      // Reset form to original employee data if canceling edit
      setEmployeeForm({
        first_name: employee.first_name || '',
        last_name: employee.last_name || '',
        email: employee.email || '',
        phone: employee.phone || '',
        department_id: employee.department_id || '',
        position_id: employee.position_id || '',
        hire_date: employee.hire_date || '',
        salary: employee.salary || '',
        address: employee.address || '',
        is_active: employee.is_active !== false
      });
    }
    setEditMode(!editMode);
  };

  const handleSaveEmployee = async () => {
    try {
      setSaveLoading(true);
      const updatedEmployee = await updateEmployee(id, employeeForm);
      setEmployee(updatedEmployee);
      setEditMode(false);
      setError(null);
    } catch (err) {
      console.error('Error updating employee:', err);
      setError('Failed to update employee. Please try again.');
    } finally {
      setSaveLoading(false);
    }
  };

  const getDepartmentName = (departmentId) => {
    const department = departments.find(dept => dept.id === departmentId);
    return department ? department.name : 'N/A';
  };

  const getPositionName = (positionId) => {
    const position = positions.find(pos => pos.id === positionId);
    return position ? position.title : 'N/A';
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

  if (!employee) {
    return (
      <HRLayout>
        <Alert severity="error">Employee not found.</Alert>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate('/hr/employees')}
          sx={{ mt: 2 }}
        >
          Back to Employees
        </Button>
      </HRLayout>
    );
  }

  return (
    <HRLayout>
      <Box sx={{ py: 3 }}>
        <Box display="flex" alignItems="center" mb={2}>
          <IconButton 
            sx={{ mr: 2 }} 
            onClick={() => navigate('/hr/employees')}
            aria-label="back"
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Employee Details
          </Typography>
        </Box>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item>
                <Avatar 
                  sx={{ width: 80, height: 80, bgcolor: 'primary.main' }}
                >
                  {employee.first_name?.charAt(0)}{employee.last_name?.charAt(0)}
                </Avatar>
              </Grid>
              <Grid item xs>
                <Typography variant="h5">
                  {employee.first_name} {employee.last_name}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  {getPositionName(employee.position_id)} - {getDepartmentName(employee.department_id)}
                </Typography>
                <Box mt={1}>
                  <Chip 
                    label={employee.is_active ? 'Active' : 'Inactive'} 
                    color={employee.is_active ? 'success' : 'default'}
                    size="small"
                  />
                </Box>
              </Grid>
              <Grid item>
                <Button
                  variant={editMode ? "outlined" : "contained"}
                  color={editMode ? "inherit" : "primary"}
                  startIcon={editMode ? null : <EditIcon />}
                  onClick={handleToggleEditMode}
                  sx={{ mr: 1 }}
                >
                  {editMode ? 'Cancel' : 'Edit'}
                </Button>
                {editMode && (
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={saveLoading ? <CircularProgress size={20} /> : <SaveIcon />}
                    onClick={handleSaveEmployee}
                    disabled={saveLoading}
                  >
                    Save
                  </Button>
                )}
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        
        <Box sx={{ mb: 3 }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            aria-label="employee details tabs"
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab icon={<PersonIcon />} iconPosition="start" label="Personal Info" />
            <Tab icon={<WorkIcon />} iconPosition="start" label="Employment" />
            <Tab icon={<EventNoteIcon />} iconPosition="start" label="Leave History" />
            <Tab icon={<AssessmentIcon />} iconPosition="start" label="Performance" />
          </Tabs>
        </Box>
        
        {/* Personal Information Tab */}
        {tabValue === 0 && (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Personal Information
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="First Name"
                    name="first_name"
                    fullWidth
                    value={employeeForm.first_name}
                    onChange={handleFormChange}
                    disabled={!editMode}
                    required
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Last Name"
                    name="last_name"
                    fullWidth
                    value={employeeForm.last_name}
                    onChange={handleFormChange}
                    disabled={!editMode}
                    required
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
                    disabled={!editMode}
                    required
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Phone"
                    name="phone"
                    fullWidth
                    value={employeeForm.phone}
                    onChange={handleFormChange}
                    disabled={!editMode}
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
                    disabled={!editMode}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}
        
        {/* Employment Tab */}
        {tabValue === 1 && (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Employment Details
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth disabled={!editMode}>
                    <InputLabel>Department</InputLabel>
                    <Select
                      name="department_id"
                      value={employeeForm.department_id}
                      onChange={handleFormChange}
                      label="Department"
                    >
                      {departments.map((dept) => (
                        <MenuItem key={dept.id} value={dept.id}>
                          {dept.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth disabled={!editMode}>
                    <InputLabel>Position</InputLabel>
                    <Select
                      name="position_id"
                      value={employeeForm.position_id}
                      onChange={handleFormChange}
                      label="Position"
                    >
                      {positions
                        .filter(pos => !employeeForm.department_id || pos.department_id === employeeForm.department_id)
                        .map((pos) => (
                          <MenuItem key={pos.id} value={pos.id}>
                            {pos.title}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Hire Date"
                    name="hire_date"
                    type="date"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    value={employeeForm.hire_date}
                    onChange={handleFormChange}
                    disabled={!editMode}
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
                    disabled={!editMode}
                    InputProps={{
                      startAdornment: <Box component="span" sx={{ mr: 1 }}>$</Box>,
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth disabled={!editMode}>
                    <InputLabel>Status</InputLabel>
                    <Select
                      name="is_active"
                      value={employeeForm.is_active}
                      onChange={handleFormChange}
                      label="Status"
                    >
                      <MenuItem value={true}>Active</MenuItem>
                      <MenuItem value={false}>Inactive</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}
        
        {/* Leave History Tab */}
        {tabValue === 2 && (
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6">
                  Leave History
                </Typography>
                <Button 
                  variant="outlined" 
                  color="primary" 
                  onClick={() => navigate('/hr/leaves/create', { state: { employeeId: id } })}
                >
                  Request Leave
                </Button>
              </Box>
              <Divider sx={{ mb: 3 }} />
              
              {/* This would display leave history data from API */}
              <Typography color="text.secondary">
                No leave history available.
              </Typography>
            </CardContent>
          </Card>
        )}
        
        {/* Performance Tab */}
        {tabValue === 3 && (
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6">
                  Performance Reviews
                </Typography>
                <Button 
                  variant="outlined" 
                  color="primary" 
                  onClick={() => navigate('/hr/performance/create', { state: { employeeId: id } })}
                >
                  New Review
                </Button>
              </Box>
              <Divider sx={{ mb: 3 }} />
              
              {/* This would display performance review data from API */}
              <Typography color="text.secondary">
                No performance reviews available.
              </Typography>
            </CardContent>
          </Card>
        )}
      </Box>
    </HRLayout>
  );
};

export default EmployeeDetails;