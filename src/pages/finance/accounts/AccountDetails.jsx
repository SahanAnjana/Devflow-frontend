// src/pages/finance/AccountDetails.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
  Chip,
  CircularProgress,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemText,
  IconButton
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import { getAccountById } from '../../../api/finance-management/accounts';
import { getAccountTransactions } from '../../../api/finance-management/transactions';
import FinanceLayout from '../../../components/layout/FinanceLayout';
import ActionMenu from '../../../components/common/ActionMenu';
import DataTable from '../../../components/common/DataTable';

const AccountDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [account, setAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [accountData, transactionsData] = await Promise.all([
          getAccountById(id),
          getAccountTransactions(id)
        ]);
        setAccount(accountData);
        setTransactions(transactionsData);
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to load account details');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <FinanceLayout>
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      </FinanceLayout>
    );
  }

  if (error || !account) {
    return (
      <FinanceLayout>
        <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>
      </FinanceLayout>
    );
  }

  return (
    <FinanceLayout>
      <Box sx={{ py: 3 }}>
        <Box display="flex" alignItems="center" mb={3}>
          <IconButton onClick={() => navigate('/finance/accounts')} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
            {account.name}
          </Typography>
          <Chip 
            label={account.status} 
            color={account.status === 'active' ? 'success' : 'error'} 
            sx={{ ml: 2 }}
          />
          <Box sx={{ flexGrow: 1 }} />
          <ActionMenu
            itemId={id}
            actions={[
              { 
                label: 'Edit Account', 
                handler: () => navigate(`/finance/accounts/${id}/edit`),
                icon: <EditIcon />
              }
            ]}
          />
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Account Overview</Typography>
                <List>
                  <ListItem>
                    <ListItemText primary="Account Number" secondary={account.account_number || 'N/A'} />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemText primary="Current Balance" secondary={`$${account.balance.toFixed(2)}`} />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemText primary="Account Type" secondary={account.type} />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemText primary="Currency" secondary={account.currency} />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                  Recent Transactions
                </Typography>
                <DataTable
                  columns={[
                    { field: 'date', header: 'Date', render: (item) => new Date(item.date).toLocaleDateString() },
                    { field: 'description', header: 'Description' },
                    { field: 'amount', header: 'Amount', render: (item) => (
                      <Chip 
                        label={`$${Math.abs(item.amount).toFixed(2)}`} 
                        color={item.amount > 0 ? 'success' : 'error'}
                        variant="outlined"
                      />
                    )}
                  ]}
                  data={transactions.slice(0, 5)}
                  emptyMessage="No recent transactions"
                />
                <Button 
                  variant="outlined" 
                  fullWidth
                  sx={{ mt: 2 }}
                  onClick={() => navigate(`/finance/accounts/${id}/transactions`)}
                >
                  View All Transactions
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </FinanceLayout>
  );
};

export default AccountDetails;