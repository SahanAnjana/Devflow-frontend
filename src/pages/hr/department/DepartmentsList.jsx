// src/pages/hr/DepartmentsList.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Typography,
  Chip,
  CircularProgress,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Grid
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PeopleIcon from '@mui/icons-material/People';
import { getDepartments } from '../../../api/hr-management/departments';
import HRLayout from '../../../components/layout/HRLayout';
import DataTable from '../../../components/common/DataTable';
import FilterToolbar from '../../../components/common/FilterToolbar';
import ActionMenu from '../../../components/common/ActionMenu';
import { ConfirmationDialog } from '../../../components/dialogs/ConfirmationDialog';

const DepartmentsList = () => {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ is_active: '' });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [departmentDialogOpen, setDepartmentDialogOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [dialogMode, setDialogMode] = useState('create');
  const [selectedDepartmentId, setSelectedDepartmentId] = useState(null);
  const [departmentForm, setDepartmentForm] = useState({
    name: '',
    description: '',
    manager_id: '',
    location: '',
    is_active: true
  });

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setLoading(true);
        const data = await getDepartments();
        setDepartments(data);
      } catch (err) {
        console.error('Error fetching departments:', err);
        setError('Failed to load departments. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchDepartments();
  }, []);

  const columns = [
    { 
      field: 'name', 
      header: 'Department Name',
    },
    { 
      field: 'description', 
      header: 'Description',
      render: (item) => item.description || 'N/A'
    },
    { 
      field: 'location', 
      header: 'Location',
      render: (item) => item.location || 'N/A'
    },
    { 
      field: 'employee_count', 
      header: 'Employees',
      render: (item) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <PeopleIcon fontSize="small" sx={{ mr: 1 }} />
          {item.employee_count || 0}
        </Box>
      )
    },
    { 
      field: 'status', 
      header: 'Status',
      render: (item) => (
        <Chip 
          label={item.is_active !== false ? 'Active' : 'Inactive'} 
          color={item.is_active !== false ? 'success' : 'default'}
          size="small"
        />
      )
    }
  ];

  const filterFields = [
    {
      name: 'is_active',
      label: 'Status',
      options: [
        { value: 'true', label: 'Active' },
        { value: 'false', label: 'Inactive' }
      ],
      allLabel: 'All Status',
      gridSize: 2
    }
  ];

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({ is_active: '' });
    setSearchTerm('');
  };

  const filteredDepartments = departments.filter(department => {
    const matchesSearch = searchTerm === '' || 
      department.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      department.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filters.is_active === '' || 
      department.is_active === (filters.is_active === 'true');

    return matchesSearch && matchesStatus;
  });

  const handleAddDepartment = () => {
    setDialogMode('create');
    setDepartmentForm({
      name: '',
      description: '',
      manager_id: '',
      location: '',
      is_active: true
    });
    setDepartmentDialogOpen(true);
  };

  const handleFormChange = (event) => {
    const { name, value, type, checked } = event.target;
    setDepartmentForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSaveDepartment = async () => {
    try {
      if (!departmentForm.name.trim()) {
        setError('Department name is required');
        return;
      }
      
      if (dialogMode === 'create') {
        const newDepartment = {
          ...departmentForm,
          id: Date.now(),
          employee_count: 0
        };
        setDepartments(prev => [...prev, newDepartment]);
      } else {
        const updatedDepartments = departments.map(dept => 
          dept.id === selectedDepartmentId ? { ...dept, ...departmentForm } : dept
        );
        setDepartments(updatedDepartments);
      }
      
      setDepartmentDialogOpen(false);
    } catch (err) {
      console.error('Error saving department:', err);
      setError('Failed to save department. Please try again.');
    }
  };

  const handleConfirmDelete = async () => {
    try {
      setDeleteLoading(true);
      setDepartments(prev => 
        prev.filter(dept => dept.id !== selectedDepartmentId)
      );
      setDeleteDialogOpen(false);
    } catch (err) {
      console.error('Error deleting department:', err);
      setError('Failed to delete department. Please try again.');
    } finally {
      setDeleteLoading(false);
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
        <Grid container justifyContent="space-between" alignItems="center" mb={3}>
          <Grid item>
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
              Departments
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Manage company departments and organizational structure
            </Typography>
          </Grid>
          <Grid item>
            <Button 
              variant="contained" 
              color="primary" 
              startIcon={<AddIcon />}
              onClick={handleAddDepartment}
            >
              Add Department
            </Button>
          </Grid>
        </Grid>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <FilterToolbar
          searchValue={searchTerm}
          onSearchChange={handleSearchChange}
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={clearFilters}
          filterFields={filterFields}
        />

        <DataTable
          columns={columns}
          data={filteredDepartments}
          renderActions={(item) => (
            <ActionMenu
              itemId={item.id}
              actions={[
                { 
                  label: 'Edit', 
                  handler: (id) => {
                    const department = departments.find(dept => dept.id === id);
                    setSelectedDepartmentId(id);
                    setDialogMode('edit');
                    setDepartmentForm({
                      name: department.name || '',
                      description: department.description || '',
                      manager_id: department.manager_id || '',
                      location: department.location || '',
                      is_active: department.is_active !== false
                    });
                    setDepartmentDialogOpen(true);
                  }
                },
                { 
                  label: 'Delete', 
                  handler: (id) => {
                    setSelectedDepartmentId(id);
                    setDeleteDialogOpen(true);
                  },
                  color: 'error'
                }
              ]}
            />
          )}
          emptyMessage="No departments found"
        />

        {/* Department Form Dialog */}
        <Dialog
          open={departmentDialogOpen}
          onClose={() => setDepartmentDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            {dialogMode === 'create' ? 'Add Department' : 'Edit Department'}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  name="name"
                  label="Department Name"
                  fullWidth
                  required
                  value={departmentForm.name}
                  onChange={handleFormChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="description"
                  label="Description"
                  fullWidth
                  multiline
                  rows={3}
                  value={departmentForm.description}
                  onChange={handleFormChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="location"
                  label="Location"
                  fullWidth
                  value={departmentForm.location}
                  onChange={handleFormChange}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDepartmentDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleSaveDepartment} 
              variant="contained" 
              color="primary"
            >
              {dialogMode === 'create' ? 'Create' : 'Save Changes'}
            </Button>
          </DialogActions>
        </Dialog>

        <ConfirmationDialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          onConfirm={handleConfirmDelete}
          title="Confirm Delete"
          content="Are you sure you want to delete this department? This may affect employee records."
          confirmText="Delete"
          confirmColor="error"
          loading={deleteLoading}
        />
      </Box>
    </HRLayout>
  );
};

export default DepartmentsList;