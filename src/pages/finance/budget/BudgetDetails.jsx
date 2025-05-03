// src/pages/finance/BudgetDetails.jsx
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
  LinearProgress,
  Chip,
  Divider,
  IconButton
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import { getBudgetById, getBudgetsByDepartment } from '../../../api/finance';
import FinanceLayout from '../../../components/layout/FinanceLayout';
import ActionMenu from '../../../components/common/ActionMenu';

const BudgetDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [budget, setBudget] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const budgetData = await getBudgetById(id);
        setBudget(budgetData);
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to load budget details');
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

  if (error || !budget) {
    return (
      <FinanceLayout>
        <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>
      </FinanceLayout>
    );
  }

  const progress = ((budget.amount - budget.remaining) / budget.amount) * 100;

  return (
    <FinanceLayout>
      <Box sx={{ py: 3 }}>
        <Box display="flex" alignItems="center" mb={3}>
          <IconButton onClick={() => navigate('/finance/budgets')} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
            {budget.name}
          </Typography>
          <Chip 
            label={budget.status} 
            color={budget.status === 'active' ? 'success' : 'error'} 
            sx={{ ml: 2 }}
          />
          <Box sx={{ flexGrow: 1 }} />
          <ActionMenu
            itemId={id}
            actions={[
              { 
                label: 'Edit Budget', 
                handler: () => navigate(`/finance/budgets/${id}/edit`),
                icon: <EditIcon />
              }
            ]}
          />
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Budget Overview</Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Total Budget
                  </Typography>
                  <Typography variant="h4">${budget.amount.toFixed(2)}</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Remaining Balance
                  </Typography>
                  <Typography variant="h4" color={budget.remaining < 0 ? 'error' : 'inherit'}>
                    ${budget.remaining.toFixed(2)}
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={progress} 
                  color={progress >= 90 ? 'error' : progress >= 75 ? 'warning' : 'primary'}
                  sx={{ height: 8, borderRadius: 4 }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                  <Typography variant="caption">{progress.toFixed(1)}% Used</Typography>
                  <Typography variant="caption">${(budget.amount - budget.remaining).toFixed(2)} Spent</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Details</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" color="text.secondary">Type</Typography>
                    <Typography>{budget.type}</Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" color="text.secondary">Period</Typography>
                    <Typography>
                      {new Date(budget.start_date).toLocaleDateString()} - {' '}
                      {new Date(budget.end_date).toLocaleDateString()}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">Description</Typography>
                    <Typography>{budget.description || 'No description provided'}</Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </FinanceLayout>
  );
};

export default BudgetDetails;