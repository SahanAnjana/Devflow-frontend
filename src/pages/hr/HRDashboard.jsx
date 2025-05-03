// src/pages/hr/HRDashboard.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  CardActions,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  CircularProgress,
  Alert
} from '@mui/material';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import BusinessIcon from '@mui/icons-material/Business';
import WorkIcon from '@mui/icons-material/Work';
import EventNoteIcon from '@mui/icons-material/EventNote';
import AssessmentIcon from '@mui/icons-material/Assessment';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { getDepartments } from '../../api/hr-management/departments';
import { getEmployees } from '../../api/hr-management/employees';
import { getLeaves } from '../../api/hr-management/leaves';
import HRLayout from '../../components/layout/HRLayout';

const HRDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    employees: 0,
    departments: 0,
    pendingLeaves: 0
  });
  const [recentLeaves, setRecentLeaves] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch data in parallel
        const [employeesData, departmentsData, leavesData] = await Promise.all([
          getEmployees(),
          getDepartments(),
          getLeaves({ status: 'pending' })
        ]);
        
        setStats({
          employees: employeesData.length || 0,
          departments: departmentsData.length || 0,
          pendingLeaves: leavesData.length || 0
        });
        
        // Set recent leaves (assuming the API returns them sorted by date)
        setRecentLeaves(leavesData.slice(0, 5));
        
        setError(null);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <HRLayout>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress />
        </Box>
      </HRLayout>
    );
  }

  if (error) {
    return (
      <HRLayout>
        <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>
      </HRLayout>
    );
  }

  return (
    <HRLayout>
      <Box sx={{ py: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          HR Dashboard
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Manage your organization's human resources
        </Typography>
        
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {/* Quick Stats */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, textAlign: 'center', bgcolor: '#f9f9f9' }}>
              <PeopleAltIcon color="primary" sx={{ fontSize: 40 }} />
              <Typography variant="h4" sx={{ my: 1 }}>{stats.employees}</Typography>
              <Typography variant="body1">Total Employees</Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, textAlign: 'center', bgcolor: '#f9f9f9' }}>
              <BusinessIcon color="primary" sx={{ fontSize: 40 }} />
              <Typography variant="h4" sx={{ my: 1 }}>{stats.departments}</Typography>
              <Typography variant="body1">Departments</Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, textAlign: 'center', bgcolor: '#f9f9f9' }}>
              <EventNoteIcon color="primary" sx={{ fontSize: 40 }} />
              <Typography variant="h4" sx={{ my: 1 }}>{stats.pendingLeaves}</Typography>
              <Typography variant="body1">Pending Leave Requests</Typography>
            </Paper>
          </Grid>
          
          {/* HR Modules */}
          <Grid item xs={12}>
            <Typography variant="h5" sx={{ mt: 3, mb: 2 }}>
              HR Modules
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PeopleAltIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">Employee Management</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Manage employee profiles, onboarding, and records.
                </Typography>
              </CardContent>
              <CardActions>
                <Button 
                  size="small" 
                  color="primary" 
                  component={Link} 
                  to="/hr/employees"
                  endIcon={<ArrowForwardIcon />}
                >
                  Manage Employees
                </Button>
              </CardActions>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <BusinessIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">Departments</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Organize company structure and department management.
                </Typography>
              </CardContent>
              <CardActions>
                <Button 
                  size="small" 
                  color="primary" 
                  component={Link} 
                  to="/hr/departments"
                  endIcon={<ArrowForwardIcon />}
                >
                  Manage Departments
                </Button>
              </CardActions>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <WorkIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">Positions</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Define job positions, roles, and salary ranges.
                </Typography>
              </CardContent>
              <CardActions>
                <Button 
                  size="small" 
                  color="primary" 
                  component={Link} 
                  to="/hr/positions"
                  endIcon={<ArrowForwardIcon />}
                >
                  Manage Positions
                </Button>
              </CardActions>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <EventNoteIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">Leave Management</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Process leave requests, track time off, and manage attendance.
                </Typography>
              </CardContent>
              <CardActions>
                <Button 
                  size="small" 
                  color="primary" 
                  component={Link} 
                  to="/hr/leaves"
                  endIcon={<ArrowForwardIcon />}
                >
                  Manage Leaves
                </Button>
              </CardActions>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <AssessmentIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">Performance Reviews</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Conduct employee evaluations and performance tracking.
                </Typography>
              </CardContent>
              <CardActions>
                <Button 
                  size="small" 
                  color="primary" 
                  component={Link} 
                  to="/hr/performance"
                  endIcon={<ArrowForwardIcon />}
                >
                  Manage Reviews
                </Button>
              </CardActions>
            </Card>
          </Grid>
          
          {/* Recent Leave Requests */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3, mt: 2 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Recent Leave Requests
              </Typography>
              
              {recentLeaves.length > 0 ? (
                <List>
                  {recentLeaves.map((leave) => (
                    <Box key={leave.id}>
                      <ListItem>
                        <ListItemIcon>
                          <EventNoteIcon />
                        </ListItemIcon>
                        <ListItemText 
                          primary={`${leave.employee_name || 'Employee'} - ${leave.leave_type}`}
                          secondary={`${new Date(leave.start_date).toLocaleDateString()} to ${new Date(leave.end_date).toLocaleDateString()}`}
                        />
                        <Button 
                          variant="outlined" 
                          size="small" 
                          component={Link}
                          to={`/hr/leaves?id=${leave.id}`}
                        >
                          Review
                        </Button>
                      </ListItem>
                      <Divider variant="inset" component="li" />
                    </Box>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No pending leave requests.
                </Typography>
              )}
              
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <Button 
                  variant="contained" 
                  color="primary"
                  component={Link}
                  to="/hr/leaves"
                >
                  View All Leaves
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </HRLayout>
  );
};

export default HRDashboard;