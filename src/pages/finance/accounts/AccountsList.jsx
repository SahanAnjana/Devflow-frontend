// src/pages/finance/AccountsList.jsx
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
import { getAccounts } from '../../../api/finance-management/accounts';
import FinanceLayout from '../../../components/layout/FinanceLayout';
import DataTable from '../../../components/common/DataTable';
import FilterToolbar from '../../../components/common/FilterToolbar';
import ActionMenu from '../../../components/common/ActionMenu';

const AccountsList = () => {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    type: ''
  });

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        setLoading(true);
        const data = await getAccounts();
        setAccounts(data);
      } catch (err) {
        setError('Failed to load accounts');
      } finally {
        setLoading(false);
      }
    };
    fetchAccounts();
  }, []);

  const columns = [
    { field: 'name', header: 'Account Name' },
    { field: 'type', header: 'Type' },
    { field: 'balance', header: 'Balance', render: (item) => `$${item.balance}` },
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
        { value: 'bank', label: 'Bank' },
        { value: 'cash', label: 'Cash' },
        { value: 'credit', label: 'Credit' }
      ],
      allLabel: 'All Types'
    }
  ];

  const filteredAccounts = accounts.filter(account => {
    const matchesStatus = !filters.status || account.status === filters.status;
    const matchesType = !filters.type || account.type === filters.type;
    return matchesStatus && matchesType;
  });

  return (
    <FinanceLayout>
      <Box sx={{ py: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Box>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
              Accounts
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Manage financial accounts
            </Typography>
          </Box>
          <Button 
            variant="contained" 
            component={Link}
            to="/finance/accounts/create"
            startIcon={<AddIcon />}
          >
            New Account
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
          data={filteredAccounts}
          renderActions={(item) => (
            <ActionMenu
              itemId={item.id}
              actions={[
                { 
                  label: 'View Details', 
                  handler: (id) => navigate(`/finance/accounts/${id}`)
                },
                { 
                  label: 'Edit', 
                  handler: (id) => navigate(`/finance/accounts/${id}/edit`)
                }
              ]}
            />
          )}
          emptyMessage="No accounts found"
        />
      </Box>
    </FinanceLayout>
  );
};

export default AccountsList;