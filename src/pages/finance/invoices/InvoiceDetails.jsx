// src/pages/finance/InvoiceDetails.jsx
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
  IconButton
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import EmailIcon from '@mui/icons-material/Email';
import PaidIcon from '@mui/icons-material/Paid';
import { getInvoiceById } from '../../../api/finance';
import FinanceLayout from '../../../components/layout/FinanceLayout';
import ActionMenu from '../../../components/common/ActionMenu';

const InvoiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const invoiceData = await getInvoiceById(id);
        setInvoice(invoiceData);
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to load invoice details');
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

  if (error || !invoice) {
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
          <IconButton onClick={() => navigate('/finance/invoices')} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
            Invoice #{invoice.invoice_number}
          </Typography>
          <Chip 
            label={invoice.status} 
            color={
              invoice.status === 'paid' ? 'success' : 
              invoice.status === 'overdue' ? 'error' : 'warning'
            } 
            sx={{ ml: 2 }}
          />
          <Box sx={{ flexGrow: 1 }} />
          <ActionMenu
            itemId={id}
            actions={[
              { 
                label: 'Edit Invoice', 
                handler: () => navigate(`/finance/invoices/${id}/edit`),
                icon: <EditIcon />
              },
              { 
                label: 'Send Invoice', 
                handler: () => console.log('Send invoice'),
                icon: <EmailIcon />,
                disabled: invoice.status !== 'draft'
              },
              { 
                label: 'Mark as Paid', 
                handler: () => console.log('Mark paid'),
                icon: <PaidIcon />,
                disabled: invoice.status === 'paid'
              }
            ]}
          />
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Items</Typography>
                <List>
                  {invoice.items.map((item, index) => (
                    <div key={index}>
                      <ListItem>
                        <ListItemText 
                          primary={item.description} 
                          secondary={`Quantity: ${item.quantity}`} 
                        />
                        <Typography>${item.amount.toFixed(2)}</Typography>
                      </ListItem>
                      <Divider />
                    </div>
                  ))}
                  <ListItem>
                    <ListItemText primary="Total Amount" />
                    <Typography variant="h6">${invoice.total_amount.toFixed(2)}</Typography>
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Client Information</Typography>
                <List>
                  <ListItem>
                    <ListItemText 
                      primary="Client Name" 
                      secondary={invoice.client_name} 
                    />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemText 
                      primary="Due Date" 
                      secondary={new Date(invoice.due_date).toLocaleDateString()} 
                    />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemText 
                      primary="Payment Terms" 
                      secondary={invoice.terms} 
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </FinanceLayout>
  );
};

export default InvoiceDetails;