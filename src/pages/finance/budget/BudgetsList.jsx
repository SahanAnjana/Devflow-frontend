// src/pages/finance/BudgetsList.jsx
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
import { getBudgets } from '../../../api/finance';
import FinanceLayout from '../../../components/layout/FinanceLayout';
import DataTable from '../../../components/common/DataTable';
import FilterToolbar from '../../../components/common/FilterToolbar';
import ActionMenu from '../../../components/common/ActionMenu';

const BudgetsList = () => {
  const navigate = useNavigate();
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    type: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getBudgets();
        setBudgets(data);
      } catch (err) {
        setError('Failed to load budgets');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const columns = [
    { field: 'name', header: 'Budget Name' },
    { field: 'amount', header: 'Amount', render: (item) => `$${item.amount}` },
    { field: 'remaining', header: 'Remaining', render: (item) => `$${item.remaining}` },
    { 
      field: 'status', 
      header: 'Status',
      render: (item) => (
        <Chip 
          label={item.status} 
          color={item.status === 'active' ? 'success' : 'error'}
          size="small"
        />
      )
    }
  ];

  const filterFields = [
    {
      name: 'status',
      label: 'Status',
      options: [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' }
      ],
      allLabel: 'All Statuses'
    },
    {
      name: 'type',
      label: 'Type',
      options: [
        { value: 'project', label: 'Project' },
        { value: 'department', label: 'Department' }
      ],
      allLabel: 'All Types'
    }
  ];

  const filteredBudgets = budgets.filter(budget => {
    const matchesStatus = !filters.status || budget.status === filters.status;
    const matchesType = !filters.type || budget.type === filters.type;
    return matchesStatus && matchesType;
  });

  return (
    <FinanceLayout>
      <Box sx={{ py: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Box>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
              Budgets
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Manage organizational budgets
            </Typography>
          </Box>
          <Button 
            variant="contained" 
            component={Link}
            to="/finance/budgets/create"
            startIcon={<AddIcon />}
          >
            New Budget
          </Button>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        <FilterToolbar
          filters={filters}
          onFilterChange={(e) => setFilters({ ...filters, [e.target.name]: e.target.value })}
          filterFields={filterFields}
        />

        <DataTable
          columns={columns}
          data={filteredBudgets}
          renderActions={(item) => (
            <ActionMenu
              itemId={item.id}
              actions={[
                { 
                  label: 'View Details', 
                  handler: (id) => navigate(`/finance/budgets/${id}`)
                },
                { 
                  label: 'Edit', 
                  handler: (id) => navigate(`/finance/budgets/${id}/edit`)
                }
              ]}
            />
          )}
          emptyMessage="No budgets found"
        />
      </Box>
    </FinanceLayout>
  );
};

export default BudgetsList;


