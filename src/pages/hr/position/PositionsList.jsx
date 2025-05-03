// src/pages/hr/PositionsList.jsx
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
  MenuItem,
  Grid
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { getDepartments } from '../../../api/hr-management/departments';
import { getPositions } from '../../../api/hr-management/positions';
import HRLayout from '../../../components/layout/HRLayout';
import DataTable from '../../../components/common/DataTable';
import FilterToolbar from '../../../components/common/FilterToolbar';
import ActionMenu from '../../../components/common/ActionMenu';
import { ConfirmationDialog } from '../../../components/dialogs/ConfirmationDialog';

const PositionsList = () => {
  const navigate = useNavigate();
  const [positions, setPositions] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    department_id: '',
    is_active: ''
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [positionDialogOpen, setPositionDialogOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [dialogMode, setDialogMode] = useState('create');
  const [selectedPositionId, setSelectedPositionId] = useState(null);
  const [positionForm, setPositionForm] = useState({
    title: '',
    department_id: '',
    min_salary: '',
    max_salary: '',
    description: '',
    is_active: true
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [positionsData, departmentsData] = await Promise.all([
          getPositions(),
          getDepartments()
        ]);
        setPositions(positionsData);
        setDepartments(departmentsData);
      } catch (err) {
        console.error('Error fetching positions data:', err);
        setError('Failed to load positions. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const columns = [
    { field: 'title', header: 'Title' },
    { 
      field: 'department', 
      header: 'Department',
      render: (item) => getDepartmentName(item.department_id)
    },
    { 
      field: 'salary_range', 
      header: 'Salary Range',
      render: (item) => (
        item.min_salary && item.max_salary 
          ? `$${item.min_salary} - $${item.max_salary}`
          : item.min_salary 
            ? `From $${item.min_salary}`
            : item.max_salary
              ? `Up to $${item.max_salary}`
              : 'N/A'
      )
    },
    { 
      field: 'description', 
      header: 'Description',
      render: (item) => item.description || 'N/A'
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
      name: 'department_id',
      label: 'Department',
      options: departments.map(dept => ({
        value: dept.id.toString(),
        label: dept.name
      })),
      allLabel: 'All Departments',
      gridSize: 3
    },
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

  const getDepartmentName = (departmentId) => {
    const department = departments.find(dept => dept.id === departmentId);
    return department?.name || 'N/A';
  };

  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({ department_id: '', is_active: '' });
    setSearchTerm('');
  };

  const filteredPositions = positions.filter(position => {
    const matchesSearch = searchTerm === '' || 
      position.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      position.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDepartment = filters.department_id === '' || 
      position.department_id?.toString() === filters.department_id;

    const matchesStatus = filters.is_active === '' || 
      position.is_active === (filters.is_active === 'true');

    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const handleAddPosition = () => {
    setDialogMode('create');
    setPositionForm({
      title: '',
      department_id: '',
      min_salary: '',
      max_salary: '',
      description: '',
      is_active: true
    });
    setPositionDialogOpen(true);
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPositionForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSavePosition = async () => {
    try {
      if (!positionForm.title.trim()) {
        setError('Position title is required');
        return;
      }

      if (positionForm.min_salary && positionForm.max_salary && 
          Number(positionForm.min_salary) > Number(positionForm.max_salary)) {
        setError('Minimum salary cannot be greater than maximum salary');
        return;
      }
      
      if (dialogMode === 'create') {
        const newPosition = { ...positionForm, id: Date.now() };
        setPositions(prev => [...prev, newPosition]);
      } else {
        const updatedPositions = positions.map(pos => 
          pos.id === selectedPositionId ? { ...pos, ...positionForm } : pos
        );
        setPositions(updatedPositions);
      }
      
      setPositionDialogOpen(false);
      setError(null);
    } catch (err) {
      console.error('Error saving position:', err);
      setError('Failed to save position. Please try again.');
    }
  };

  const handleConfirmDelete = async () => {
    try {
      setDeleteLoading(true);
      setPositions(prev => prev.filter(pos => pos.id !== selectedPositionId));
      setDeleteDialogOpen(false);
    } catch (err) {
      console.error('Error deleting position:', err);
      setError('Failed to delete position. Please try again.');
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
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
              Positions
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Manage job positions and salary ranges
            </Typography>
          </Grid>
          <Grid item>
            <Button 
              variant="contained" 
              startIcon={<AddIcon />}
              onClick={handleAddPosition}
            >
              Add Position
            </Button>
          </Grid>
        </Grid>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

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
          data={filteredPositions}
          renderActions={(item) => (
            <ActionMenu
              itemId={item.id}
              actions={[
                { 
                  label: 'Edit', 
                  handler: (id) => {
                    const position = positions.find(pos => pos.id === id);
                    setSelectedPositionId(id);
                    setDialogMode('edit');
                    setPositionForm({
                      title: position.title || '',
                      department_id: position.department_id || '',
                      min_salary: position.min_salary || '',
                      max_salary: position.max_salary || '',
                      description: position.description || '',
                      is_active: position.is_active !== false
                    });
                    setPositionDialogOpen(true);
                  }
                },
                { 
                  label: 'Delete', 
                  handler: (id) => {
                    setSelectedPositionId(id);
                    setDeleteDialogOpen(true);
                  },
                  color: 'error'
                }
              ]}
            />
          )}
          emptyMessage="No positions found"
        />

        {/* Position Form Dialog */}
        <Dialog
          open={positionDialogOpen}
          onClose={() => setPositionDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            {dialogMode === 'create' ? 'Add Position' : 'Edit Position'}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  name="title"
                  label="Position Title"
                  fullWidth
                  required
                  value={positionForm.title}
                  onChange={handleFormChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="department_id"
                  label="Department"
                  select
                  fullWidth
                  value={positionForm.department_id}
                  onChange={handleFormChange}
                >
                  <MenuItem value="">Select Department</MenuItem>
                  {departments.map((dept) => (
                    <MenuItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="min_salary"
                  label="Minimum Salary"
                  fullWidth
                  type="number"
                  value={positionForm.min_salary}
                  onChange={handleFormChange}
                  InputProps={{ startAdornment: '$' }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="max_salary"
                  label="Maximum Salary"
                  fullWidth
                  type="number"
                  value={positionForm.max_salary}
                  onChange={handleFormChange}
                  InputProps={{ startAdornment: '$' }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="description"
                  label="Description"
                  fullWidth
                  multiline
                  rows={3}
                  value={positionForm.description}
                  onChange={handleFormChange}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setPositionDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleSavePosition} 
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
          content="Are you sure you want to delete this position? This may affect employee records."
          confirmText="Delete"
          confirmColor="error"
          loading={deleteLoading}
        />
      </Box>
    </HRLayout>
  );
};

export default PositionsList;