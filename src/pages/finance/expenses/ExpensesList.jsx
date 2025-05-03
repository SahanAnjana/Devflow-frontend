// src/pages/finance/ExpensesList.jsx
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
import { getExpenses } from '../../../api/finance-management/expenses';
import FinanceLayout from '../../../components/layout/FinanceLayout';
import DataTable from '../../../components/common/DataTable';
import FilterToolbar from '../../../components/common/FilterToolbar';
import ActionMenu from '../../../components/common/ActionMenu';

const ExpensesList = () => {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    category: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getExpenses();
        setExpenses(data);
      } catch (err) {
        setError('Failed to load expenses');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const columns = [
    { field: 'description', header: 'Description' },
    { field: 'amount', header: 'Amount', render: (item) => `$${item.amount}` },
    { field: 'date', header: 'Date', render: (item) => new Date(item.date).toLocaleDateString() },
    { 
      field: 'status', 
      header: 'Status',
      render: (item) => (
        <Chip 
          label={item.status} 
          color={
            item.status === 'approved' ? 'success' : 
            item.status === 'pending' ? 'warning' : 'error'
          }
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
        { value: 'pending', label: 'Pending' },
        { value: 'approved', label: 'Approved' },
        { value: 'rejected', label: 'Rejected' }
      ],
      allLabel: 'All Statuses'
    },
    {
      name: 'category',
      label: 'Category',
      options: [
        { value: 'travel', label: 'Travel' },
        { value: 'supplies', label: 'Supplies' },
        { value: 'equipment', label: 'Equipment' }
      ],
      allLabel: 'All Categories'
    }
  ];

  const filteredExpenses = expenses.filter(expense => {
    const matchesStatus = !filters.status || expense.status === filters.status;
    const matchesCategory = !filters.category || expense.category === filters.category;
    return matchesStatus && matchesCategory;
  });

  return (
    <FinanceLayout>
      <Box sx={{ py: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Box>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
              Expenses
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Manage and track expenses
            </Typography>
          </Box>
          <Button 
            variant="contained" 
            component={Link}
            to="/finance/expenses/create"
            startIcon={<AddIcon />}
          >
            New Expense
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
          data={filteredExpenses}
          renderActions={(item) => (
            <ActionMenu
              itemId={item.id}
              actions={[
                { 
                  label: 'View Details', 
                  handler: (id) => navigate(`/finance/expenses/${id}`)
                },
                { 
                  label: 'Edit', 
                  handler: (id) => navigate(`/finance/expenses/${id}/edit`)
                }
              ]}
            />
          )}
          emptyMessage="No expenses found"
        />
      </Box>
    </FinanceLayout>
  );
};

export default ExpensesList;
