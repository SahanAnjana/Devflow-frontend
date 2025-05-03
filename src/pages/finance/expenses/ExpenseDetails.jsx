// src/pages/finance/ExpenseDetails.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
  CircularProgress,
  Alert,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  Avatar,
  IconButton
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import ReceiptIcon from '@mui/icons-material/Receipt';
import { getExpenseById } from '../../../api/finance-management/expenses';
import FinanceLayout from '../../../components/layout/FinanceLayout';
import ActionMenu from '../../../components/common/ActionMenu';

const ExpenseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [expense, setExpense] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const expenseData = await getExpenseById(id);
        setExpense(expenseData);
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to load expense details');
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

  if (error || !expense) {
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
          <IconButton onClick={() => navigate('/finance/expenses')} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
            {expense.description}
          </Typography>
          <Chip 
            label={expense.status} 
            color={
              expense.status === 'approved' ? 'success' : 
              expense.status === 'pending' ? 'warning' : 'error'
            } 
            sx={{ ml: 2 }}
          />
          <Box sx={{ flexGrow: 1 }} />
          <ActionMenu
            itemId={id}
            actions={[
              { 
                label: 'Edit Expense', 
                handler: () => navigate(`/finance/expenses/${id}/edit`),
                icon: <EditIcon />
              }
            ]}
          />
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Details</Typography>
                <List>
                  <ListItem>
                    <ListItemText 
                      primary="Amount" 
                      secondary={`$${expense.amount.toFixed(2)}`} 
                    />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemText 
                      primary="Date" 
                      secondary={new Date(expense.date).toLocaleDateString()} 
                    />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemText 
                      primary="Category" 
                      secondary={expense.category} 
                    />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemText 
                      primary="Submitted By" 
                      secondary={expense.submitted_by?.name || 'Unknown'} 
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                  Attachments
                </Typography>
                {expense.attachments?.length > 0 ? (
                  <Grid container spacing={2}>
                    {expense.attachments.map((file, index) => (
                      <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card variant="outlined">
                          <CardContent sx={{ textAlign: 'center' }}>
                            <ReceiptIcon sx={{ fontSize: 40, color: 'text.secondary' }} />
                            <Typography variant="body2" sx={{ mt: 1 }}>
                              {file.name}
                            </Typography>
                            <Button 
                              size="small" 
                              sx={{ mt: 1 }}
                              onClick={() => window.open(file.url, '_blank')}
                            >
                              View
                            </Button>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No attachments available
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </FinanceLayout>
  );
};

export default ExpenseDetails;