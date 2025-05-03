import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAllUsers, deleteUser, updateUser, createRole } from '../api/auth-management/admin';
import {
  AppBar,
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Tab,
  Tabs,
  TextField,
  Toolbar,
  Typography,
  Avatar,
  Tooltip,
  Snackbar,
  Alert,
  Card,
  CardContent,
  Chip
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

// TabPanel component for tab content
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const AdminPanel = () => {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  
  // Dialog states
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editUserData, setEditUserData] = useState({ email: '', password: '' });
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [newRoleData, setNewRoleData] = useState({ name: '', description: '', permissions: '' });

  // Load all users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const userData = await getAllUsers();
      setUsers(userData);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch users:', err);
      setError('Failed to load users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Delete user handlers
  const openDeleteDialog = (user) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const handleDeleteUser = async () => {
    try {
      await deleteUser(selectedUser.id);
      setUsers(users.filter(u => u.id !== selectedUser.id));
      setSuccessMessage(`User ${selectedUser.email} deleted successfully`);
      setDeleteDialogOpen(false);
    } catch (err) {
      setError(`Failed to delete user: ${err.message}`);
    }
  };

  // Edit user handlers
  const openEditDialog = (user) => {
    setSelectedUser(user);
    setEditUserData({ email: user.email, password: '' });
    setEditDialogOpen(true);
  };

  const handleUpdateUser = async () => {
    try {
      await updateUser(selectedUser.id, editUserData);
      // Update the user in the local state
      setUsers(users.map(u => 
        u.id === selectedUser.id ? { ...u, email: editUserData.email } : u
      ));
      setSuccessMessage(`User ${selectedUser.email} updated successfully`);
      setEditDialogOpen(false);
    } catch (err) {
      setError(`Failed to update user: ${err.message}`);
    }
  };

  // Create role handlers
  const handleCreateRole = async () => {
    try {
      // Parse permissions string to array
      const permissions = newRoleData.permissions.split(',').map(p => p.trim());
      
      await createRole({
        name: newRoleData.name,
        description: newRoleData.description,
        permissions
      });
      
      setSuccessMessage(`Role "${newRoleData.name}" created successfully`);
      setRoleDialogOpen(false);
      setNewRoleData({ name: '', description: '', permissions: '' });
    } catch (err) {
      setError(`Failed to create role: ${err.message}`);
    }
  };

  // Handle notification close
  const handleCloseSnackbar = () => {
    setSuccessMessage(null);
    setError(null);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ bgcolor: '#4285F4' }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => navigate('/')}
            sx={{ mr: 2 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <AdminPanelSettingsIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            Admin Dashboard
          </Typography>
        </Toolbar>
      </AppBar>
      
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ width: '100%', mb: 2 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            aria-label="admin tabs"
            centered
          >
            <Tab label="User Management" />
            <Tab label="Role Management" />
            <Tab label="System Overview" />
          </Tabs>
          
          {/* User Management Tab */}
          <TabPanel value={activeTab} index={0}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6" component="div">
                User Management
              </Typography>
              <Button 
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate('/register')}
              >
                Add New User
              </Button>
            </Box>
            
            {loading ? (
              <Typography>Loading users...</Typography>
            ) : error ? (
              <Alert severity="error">{error}</Alert>
            ) : (
              <Paper elevation={3}>
                <List>
                  {users.map((user) => (
                    <div key={user.id}>
                      <ListItem
                        secondaryAction={
                          <Box>
                            <Tooltip title="Edit User">
                              <IconButton edge="end" onClick={() => openEditDialog(user)}>
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete User">
                              <IconButton edge="end" onClick={() => openDeleteDialog(user)}>
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        }
                      >
                        <ListItemAvatar>
                          <Avatar>
                            <AccountCircleIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={user.email}
                          secondary={
                            <span>
                              {user.role || 'No role assigned'} • 
                              {user.is_active ? ' Active' : ' Inactive'} • 
                              ID: {user.id}
                            </span>
                          }
                        />
                      </ListItem>
                      <Divider variant="inset" component="li" />
                    </div>
                  ))}
                </List>
              </Paper>
            )}
          </TabPanel>
          
          {/* Role Management Tab */}
          <TabPanel value={activeTab} index={1}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6" component="div">
                Role Management
              </Typography>
              <Button 
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setRoleDialogOpen(true)}
              >
                Create New Role
              </Button>
            </Box>
            
            <Grid container spacing={3}>
              {/* Sample Role Cards - In a real app, you'd fetch these from the API */}
              <Grid item xs={12} md={4}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Admin
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Full system access with all permissions
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      <Chip label="user:create" size="small" />
                      <Chip label="user:read" size="small" />
                      <Chip label="user:update" size="small" />
                      <Chip label="user:delete" size="small" />
                      <Chip label="*" size="small" />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      User
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Standard user with limited permissions
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      <Chip label="projects:read" size="small" />
                      <Chip label="tasks:read" size="small" />
                      <Chip label="tasks:update" size="small" />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Manager
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Project management and reporting
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      <Chip label="projects:*" size="small" />
                      <Chip label="tasks:*" size="small" />
                      <Chip label="reports:read" size="small" />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </TabPanel>
          
          {/* System Overview Tab */}
          <TabPanel value={activeTab} index={2}>
            <Typography variant="h6" gutterBottom>
              System Overview
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="h4" component="div" gutterBottom>
                    {users.length}
                  </Typography>
                  <Typography variant="body1">Total Users</Typography>
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="h4" component="div" gutterBottom>
                    3
                  </Typography>
                  <Typography variant="body1">User Roles</Typography>
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="h4" component="div" gutterBottom>
                    {users.filter(u => u.is_active).length}
                  </Typography>
                  <Typography variant="body1">Active Users</Typography>
                </Paper>
              </Grid>
              
              <Grid item xs={12}>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    System Information
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography variant="body1">
                      <strong>API Endpoint:</strong> http://localhost:8000
                    </Typography>
                    <Typography variant="body1">
                      <strong>Current Admin:</strong> {user?.email || 'Unknown'}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Last Database Backup:</strong> Not Available
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </TabPanel>
        </Paper>
      </Container>
      
      {/* Delete User Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the user {selectedUser?.email}? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteUser} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Edit User Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
      >
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Email Address"
            type="email"
            fullWidth
            variant="outlined"
            value={editUserData.email}
            onChange={(e) => setEditUserData({ ...editUserData, email: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="New Password (leave blank to keep current)"
            type="password"
            fullWidth
            variant="outlined"
            value={editUserData.password}
            onChange={(e) => setEditUserData({ ...editUserData, password: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleUpdateUser} variant="contained">
            Update
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Create Role Dialog */}
      <Dialog
        open={roleDialogOpen}
        onClose={() => setRoleDialogOpen(false)}
      >
        <DialogTitle>Create New Role</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Role Name"
            fullWidth
            variant="outlined"
            value={newRoleData.name}
            onChange={(e) => setNewRoleData({ ...newRoleData, name: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            variant="outlined"
            value={newRoleData.description}
            onChange={(e) => setNewRoleData({ ...newRoleData, description: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Permissions (comma-separated)"
            fullWidth
            variant="outlined"
            value={newRoleData.permissions}
            onChange={(e) => setNewRoleData({ ...newRoleData, permissions: e.target.value })}
            helperText="Example: user:read, user:write, project:*"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRoleDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleCreateRole} variant="contained">
            Create
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Success Snackbar */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {successMessage}
        </Alert>
      </Snackbar>
      
      {/* Error Snackbar */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminPanel;