// src/pages/admin/UserManagement.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TextField,
  InputAdornment,
  Chip,
  Menu,
  MenuItem,
  ListItemIcon,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  Grid
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { getAllUsers, deleteUser } from '../../api/auth';
import HRLayout from '../../components/layout/HRLayout';

const UserManagement = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    role: '',
  });
  
  // Menu state
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  
  // Delete confirmation dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  
  // Role creation dialog
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const data = await getAllUsers();
        setUsers(data);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to load users. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, []);

  const handleOpenMenu = (event, userId) => {
    setMenuAnchorEl(event.currentTarget);
    setSelectedUserId(userId);
  };

  const handleCloseMenu = () => {
    setMenuAnchorEl(null);
  };

  const handleEditUser = () => {
    navigate(`/admin/users/${selectedUserId}/edit`);
    handleCloseMenu();
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
    handleCloseMenu();
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
  };

  const handleConfirmDelete = async () => {
    try {
      setDeleteLoading(true);
      await deleteUser(selectedUserId);
      
      // Remove the user from the list
      setUsers(prevUsers => 
        prevUsers.filter(user => user.id !== selectedUserId)
      );
      
      setDeleteDialogOpen(false);
    } catch (err) {
      console.error('Error deleting user:', err);
      setError('Failed to delete user. Please try again.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      role: '',
    });
    setSearchTerm('');
  };

  // Filter users
  const filteredUsers = users.filter(user => {
    // Search term filter
    const matchesSearch = searchTerm === '' || 
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Role filter
    const matchesRole = filters.role === '' || 
      user.role?.toLowerCase() === filters.role.toLowerCase();
    
    return matchesSearch && matchesRole;
  });

  // Open role creation dialog
  const handleOpenRoleDialog = () => {
    setRoleDialogOpen(true);
  };

  // Close role creation dialog
  const handleCloseRoleDialog = () => {
    setRoleDialogOpen(false);
  };

  if (loading) {
    return (
      <HRLayout>
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      </HRLayout>
    );
  }

  return (
    <HRLayout>
      <Box sx={{ py: 3 }}>
        <Grid container justifyContent="space-between" alignItems="center" mb={3}>
          <Grid item>
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
              User Management
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Manage user accounts and permissions
            </Typography>
          </Grid>
          <Grid item>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button 
                variant="outlined" 
                color="primary" 
                startIcon={<AdminPanelSettingsIcon />}
                onClick={handleOpenRoleDialog}
              >
                Manage Roles
              </Button>
              <Button 
                variant="contained" 
                color="primary" 
                startIcon={<AddIcon />}
                onClick={() => navigate('/admin/users/create')}
              >
                Add User
              </Button>
            </Box>
          </Grid>
        </Grid>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  placeholder="Search by email..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Role</InputLabel>
                  <Select
                    name="role"
                    value={filters.role}
                    onChange={handleFilterChange}
                    label="Role"
                  >
                    <MenuItem value="">All Roles</MenuItem>
                    <MenuItem value="admin">Admin</MenuItem>
                    <MenuItem value="hr">HR</MenuItem>
                    <MenuItem value="employee">Employee</MenuItem>
                    <MenuItem value="manager">Manager</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={2} display="flex" alignItems="center">
                <Button 
                  fullWidth
                  variant="outlined"
                  onClick={clearFilters}
                >
                  Clear Filters
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell>Last Login</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Chip 
                        label={user.role || 'User'} 
                        color={user.role === 'admin' ? 'error' : user.role === 'hr' ? 'primary' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                    </TableCell>
                    <TableCell>
                      {user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never'}
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={user.is_active ? 'Active' : 'Inactive'} 
                        color={user.is_active ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={(e) => handleOpenMenu(e, user.id)}
                        aria-label="more options"
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No users found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        {/* Actions Menu */}
        <Menu
          anchorEl={menuAnchorEl}
          open={Boolean(menuAnchorEl)}
          onClose={handleCloseMenu}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem onClick={handleEditUser}>
            <ListItemIcon>
              <EditIcon fontSize="small" />
            </ListItemIcon>
            Edit User
          </MenuItem>
          <MenuItem onClick={handleDeleteClick}>
            <ListItemIcon>
              <DeleteIcon fontSize="small" color="error" />
            </ListItemIcon>
            <Typography variant="inherit" color="error">
              Delete User
            </Typography>
          </MenuItem>
        </Menu>
        
        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={handleCancelDelete}
        >
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this user? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancelDelete} disabled={deleteLoading}>
              Cancel
            </Button>
            <Button 
              onClick={handleConfirmDelete} 
              color="error" 
              disabled={deleteLoading}
              startIcon={deleteLoading ? <CircularProgress size={20} /> : null}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
        
        {/* Role Management Dialog */}
        <Dialog
          open={roleDialogOpen}
          onClose={handleCloseRoleDialog}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Role Management</DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2 }}>
              {/* Role management form would go here */}
              <Typography variant="body1" gutterBottom>
                Create and manage roles and permissions for the system.
              </Typography>
              {/* This would typically be a form with role name, permissions checkboxes, etc. */}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseRoleDialog}>Close</Button>
            <Button variant="contained" color="primary">Save Changes</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </HRLayout>
  );
};

export default UserManagement;