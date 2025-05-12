// src/pages/hr/EmployeesList.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  Typography,
  Chip,
  CircularProgress,
  Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { getDepartments } from '../../../api/hr-management/departments';
import { getEmployees, deleteEmployee } from '../../../api/hr-management/employees';
import HRLayout from '../../../components/layout/HRLayout';
import DataTable from '../../../components/common/DataTable';
import FilterToolbar from '../../../components/common/FilterToolbar';
import ActionMenu from '../../../components/common/ActionMenu';
import {ConfirmationDialog} from '../../../components/dialogs/ConfirmationDialog';

const EmployeesList = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    department_id: '',
    is_active: '',
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [employeesData, departmentsData] = await Promise.all([
          getEmployees(),
          getDepartments()
        ]);
        setEmployees(employeesData);
        setDepartments(departmentsData);
      } catch (err) {
        setError('Failed to load employees. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const columns = [
    { 
      field: 'name', 
      header: 'Name',
      render: (item) => `${item.first_name} ${item.last_name}`
    },
    { field: 'email', header: 'Email' },
    { 
      field: 'department', 
      header: 'Department',
      render: (item) => getDepartmentName(item.department_id)
    },
    { field: 'phone', header: 'Phone' },
    { 
      field: 'status', 
      header: 'Status',
      render: (item) => (
        <Chip 
          label={item.is_active ? 'Active' : 'Inactive'} 
          color={item.is_active ? 'success' : 'default'}
          size="small"
        />
      )
    }
  ];

  const filterColumns = [
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

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({ department_id: '', is_active: '' });
    setSearchTerm('');
  };

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = searchTerm === '' || 
      `${employee.first_name} ${employee.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDepartment = filters.department_id === '' || 
      employee.department_id?.toString() === filters.department_id;

    const matchesActive = filters.is_active === '' || 
      employee.is_active === (filters.is_active === 'true');

    return matchesSearch && matchesDepartment && matchesActive;
  });

  const handleDelete = (employeeId) => {
    setSelectedEmployeeId(employeeId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      setDeleteLoading(true);
      await deleteEmployee(selectedEmployeeId);
      setEmployees(prev => prev.filter(e => e.id !== selectedEmployeeId));
      setDeleteDialogOpen(false);
    } catch (err) {
      setError('Failed to delete employee. Please try again.');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <HRLayout>
      <Box sx={{ py: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
              Employees
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Manage your organization's employees
            </Typography>
          </Box>
          <Button 
            variant="contained" 
            component={Link}
            to="/hr/employees/create"
            startIcon={<AddIcon />}
          >
            Add Employee
          </Button>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        <FilterToolbar
          searchValue={searchTerm}
          onSearchChange={(e) => setSearchTerm(e.target.value)}
          onFilterChange={handleFilterChange}
          onClearFilters={clearFilters}
          filterColumns={filterColumns}
          filters={filters}
        />

        <DataTable
          columns={columns}
          data={filteredEmployees}
          renderActions={(item) => (
            <ActionMenu
              itemId={item.id}
              actions={[
                { 
                  label: 'View Details', 
                  handler: (id) => navigate(`/hr/employees/${id}`)
                },
                { 
                  label: 'Edit', 
                  handler: (id) => navigate(`/hr/employees/${id}`)
                },
                { 
                  label: 'Delete', 
                  handler: handleDelete,
                  color: 'error'
                }
              ]}
            />
          )}
          emptyMessage="No employees found"
        />

        <ConfirmationDialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          onConfirm={handleConfirmDelete}
          title="Confirm Delete"
          content="Are you sure you want to delete this employee? This action cannot be undone."
          confirmText="Delete"
          confirmColor="error"
          loading={deleteLoading}
        />
      </Box>
    </HRLayout>
  );
};

export default EmployeesList;