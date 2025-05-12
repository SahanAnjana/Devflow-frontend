import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import {
  AppBar,
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import FolderIcon from '@mui/icons-material/Folder';
import BusinessIcon from '@mui/icons-material/Business';

const Dashboard = () => {
  const { logout, token, user } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isAdmin = user?.role === 'admin';

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ bgcolor: '#4285F4' }}>
        <Toolbar>
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              display: 'flex', 
              alignItems: 'center',
              fontWeight: 'bold',
              flexGrow: 1
            }}
          >
            <Box 
              component="img" 
              src="/logo-placeholder.png" 
              alt="Logo" 
              sx={{ width: 32, height: 32, mr: 1, bgcolor: 'white', borderRadius: 1 }}
            />
            Devflow
          </Typography>
          
          {isAdmin && (
            <Button 
              color="inherit" 
              component={Link} 
              to="/admin"
              startIcon={<AdminPanelSettingsIcon />}
              sx={{ mr: 2 }}
            >
              Admin
            </Button>
          )}
          
          <div>
            <IconButton
              size="large"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircleIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleClose}>Profile</MenuItem>
              <MenuItem onClick={handleClose}>Settings</MenuItem>
              {isAdmin && (
                <MenuItem onClick={() => { handleClose(); navigate('/admin'); }}>
                  <AdminPanelSettingsIcon fontSize="small" sx={{ mr: 1 }} />
                  Admin Panel
                </MenuItem>
              )}
              <MenuItem onClick={handleLogout}>
                <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
                Logout
              </MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
      
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h5" component="h2" sx={{ mb: 2, fontWeight: 'bold' }}>
                Welcome to Devflow Dashboard
              </Typography>
              <Typography variant="body1">
                This is your workflow management dashboard. Start planning, creating, and controlling your projects.
              </Typography>
              <Box 
                sx={{ 
                  display: 'flex',
                  justifyContent: 'center',
                  my: 4
                }}
              >
                <Box 
                  component="img" 
                  src="/workflow-illustration.png" 
                  alt="Workflow" 
                  sx={{ width: '50%', maxHeight: 300 }}
                />
              </Box>
              <Button 
                color="inherit" 
                component={Link} 
                to="/hr"
                startIcon={<PeopleAltIcon />}
                sx={{ mr: 2 }}
              >
                HR Dashboard
              </Button>
              <Button 
                color="inherit" 
                component={Link} 
                to="/finance"
                startIcon={<PeopleAltIcon />}
                sx={{ mr: 2 }}
              >
                Finance Dashboard
              </Button>
              <Button 
                color="inherit" 
                component={Link} 
                to="/pm"
                startIcon={<FolderIcon />}
                sx={{ mr: 2 }}
              >
                Project Management
              </Button>
              <Button 
                color="inherit" 
                component={Link} 
                to="/crm"
                startIcon={<BusinessIcon />}
                sx={{ mr: 2 }}
              >
                CRM Dashboard
              </Button>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" component="h3" sx={{ mb: 2, fontWeight: 'bold' }}>
                Recent Activity
              </Typography>
              <Typography variant="body2" color="text.secondary">
                No recent activities to display.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" component="h3" sx={{ mb: 2, fontWeight: 'bold' }}>
                Quick Actions
              </Typography>
              <Button variant="contained" sx={{ mr: 2, mb: 2 }}>
                Create Project
              </Button>
              <Button variant="outlined" sx={{ mb: 2 }}>
                View Tasks
              </Button>
              {isAdmin && (
                <Button 
                  variant="outlined" 
                  color="secondary" 
                  sx={{ mb: 2, ml: 2 }} 
                  startIcon={<AdminPanelSettingsIcon />}
                  component={Link}
                  to="/admin"
                >
                  Admin Panel
                </Button>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Dashboard;