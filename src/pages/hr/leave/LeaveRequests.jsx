// src/pages/hr/LeaveRequests.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
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
  Tabs,
  Tab
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import FilterListIcon from '@mui/icons-material/FilterList';
import { getEmployees } from '../../../api/hr-management/employees';
import { getLeaves, approveLeave, rejectLeave, deleteLeave } from '../../../api/hr-management/leaves';
import HRLayout from '../../../components/layout/HRLayout';
import { useAuth } from '../../../context/AuthContext';

const LeaveRequests = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [leaves, setLeaves] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [filters, setFilters] = useState({
    employee_id: '',
    status: '',
    leave_type: '',
  });
  
  // Menu state
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selectedLeaveId, setSelectedLeaveId] = useState(null);
  
  // Action confirmation dialogs
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const isHRorAdmin = user?.role === 'hr' || user?.role === 'admin';

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch leaves and employees if HR or admin
        const fetchPromises = [
          isHRorAdmin ? getLeaves() : getLeaves({ employee_id: user.employee_id })
        ];
        
        if (isHRorAdmin) {
          fetchPromises.push(getEmployees());
        }
        
        const [leavesData, employeesData] = await Promise.all(fetchPromises);
        
        setLeaves(leavesData);
        if (employeesData) {
          setEmployees(employeesData);
        }
        
      } catch (err) {
        console.error('Error fetching leave requests:', err);
        setError('Failed to load leave requests. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [isHRorAdmin, user?.employee_id]);

  const handleOpenMenu = (event, leaveId) => {
    setMenuAnchorEl(event.currentTarget);
    setSelectedLeaveId(leaveId);
  };

  const handleCloseMenu = () => {
    setMenuAnchorEl(null);
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
      employee_id: '',
      status: '',
      leave_type: '',
    });
    setSearchTerm('');
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Delete handlers
  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
    handleCloseMenu();
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
  };

  const handleConfirmDelete = async () => {
    try {
      setActionLoading(true);
      await deleteLeave(selectedLeaveId);
      
      // Remove the leave from the list
      setLeaves(prevLeaves => 
        prevLeaves.filter(leave => leave.id !== selectedLeaveId)
      );
      
      setDeleteDialogOpen(false);
    } catch (err) {
      console.error('Error deleting leave request:', err);
      setError('Failed to delete leave request. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  // Approve handlers
  const handleApproveClick = () => {
    setApproveDialogOpen(true);
    handleCloseMenu();
  };

  const handleCancelApprove = () => {
    setApproveDialogOpen(false);
  };

  const handleConfirmApprove = async () => {
    try {
      setActionLoading(true);
      const updatedLeave = await approveLeave(selectedLeaveId);
      
      // Update the leave in the list
      setLeaves(prevLeaves => 
        prevLeaves.map(leave => 
          leave.id === selectedLeaveId ? updatedLeave : leave
        )
      );
      
      setApproveDialogOpen(false);
    } catch (err) {
      console.error('Error approving leave request:', err);
      setError('Failed to approve leave request. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  // Reject handlers
  const handleRejectClick = () => {
    setRejectDialogOpen(true);
    handleCloseMenu();
  };

  const handleCancelReject = () => {
    setRejectDialogOpen(false);
  };

  const handleConfirmReject = async () => {
    try {
      setActionLoading(true);
      const updatedLeave = await rejectLeave(selectedLeaveId);
      
      // Update the leave in the list
      setLeaves(prevLeaves => 
        prevLeaves.map(leave => 
          leave.id === selectedLeaveId ? updatedLeave : leave
        )
      );
      
      setRejectDialogOpen(false);
    } catch (err) {
      console.error('Error rejecting leave request:', err);
      setError('Failed to reject leave request. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  // Filter leaves based on active tab and filters
  const filteredLeaves = leaves.filter(leave => {
    // Tab filter (All, Pending, Approved, Rejected)
    const matchesTab = tabValue === 0 || 
      (tabValue === 1 && leave.status === 'pending') ||
      (tabValue === 2 && leave.status === 'approved') ||
      (tabValue === 3 && leave.status === 'rejected');
    
    // Search term filter (employee name or reason)
    const matchesSearch = searchTerm === '' || 
      (leave.employee?.first_name && leave.employee.first_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (leave.employee?.last_name && leave.employee.last_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (leave.reason && leave.reason.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Employee filter
    const matchesEmployee = filters.employee_id === '' || 
      leave.employee_id?.toString() === filters.employee_id;
    
    // Status filter (additional to tabs)
    const matchesStatus = filters.status === '' || 
      leave.status === filters.status;
    
    // Leave type filter
    const matchesLeaveType = filters.leave_type === '' || 
      leave.leave_type === filters.leave_type;
    
    return matchesTab && matchesSearch && matchesEmployee && matchesStatus && matchesLeaveType;
  });

  // Get employee name
  const getEmployeeName = (employeeId) => {
    const employee = employees.find(emp => emp.id === employeeId);
    return employee ? `${employee.first_name} ${employee.last_name}` : 'N/A';
  };

  // Format dates
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  // Get status chip color
  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'rejected':
        return 'error';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
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
              Leave Requests
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {isHRorAdmin ? 'Manage employee leave requests' : 'Manage your leave requests'}
            </Typography>
          </Grid>
          <Grid item>
            <Button 
              variant="contained" 
              color="primary" 
              startIcon={<AddIcon />}
              component={Link}
              to="/hr/leaves/create"
            >
              Request Leave
            </Button>
          </Grid>
        </Grid>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        <Card sx={{ mb: 3 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange} 
              aria-label="leave requests tabs"
            >
              <Tab label="All Requests" />
              <Tab label="Pending" />
              <Tab label="Approved" />
              <Tab label="Rejected" />
            </Tabs>
          </Box>
          
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  placeholder="Search leave requests..."
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
              
              {isHRorAdmin && (
                <Grid item xs={12} md={2}>
                  <FormControl fullWidth>
                    <InputLabel>Employee</InputLabel>
                    <Select
                      name="employee_id"
                      value={filters.employee_id}
                      onChange={handleFilterChange}
                      label="Employee"
                    >
                      <MenuItem value="">All Employees</MenuItem>
                      {employees.map((emp) => (
                        <MenuItem key={emp.id} value={emp.id.toString()}>
                          {`${emp.first_name} ${emp.last_name}`}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              )}
              
              <Grid item xs={12} md={isHRorAdmin ? 2 : 3}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    name="status"
                    value={filters.status}
                    onChange={handleFilterChange}
                    label="Status"
                  >
                    <MenuItem value="">All Status</MenuItem>
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="approved">Approved</MenuItem>
                    <MenuItem value="rejected">Rejected</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={isHRorAdmin ? 2 : 3}>
                <FormControl fullWidth>
                  <InputLabel>Leave Type</InputLabel>
                  <Select
                    name="leave_type"
                    value={filters.leave_type}
                    onChange={handleFilterChange}
                    label="Leave Type"
                  >
                    <MenuItem value="">All Types</MenuItem>
                    <MenuItem value="annual">Annual Leave</MenuItem>
                    <MenuItem value="sick">Sick Leave</MenuItem>
                    <MenuItem value="personal">Personal Leave</MenuItem>
                    <MenuItem value="unpaid">Unpaid Leave</MenuItem>
                    <MenuItem value="maternity">Maternity Leave</MenuItem>
                    <MenuItem value="paternity">Paternity Leave</MenuItem>
                    <MenuItem value="bereavement">Bereavement</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={2} display="flex" alignItems="center">
                <Button 
                  fullWidth
                  variant="outlined"
                  onClick={clearFilters}
                  startIcon={<FilterListIcon />}
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
                {isHRorAdmin && <TableCell>Employee</TableCell>}
                <TableCell>Leave Type</TableCell>
                <TableCell>Start Date</TableCell>
                <TableCell>End Date</TableCell>
                <TableCell>Duration</TableCell>
                <TableCell>Reason</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredLeaves.length > 0 ? (
                filteredLeaves.map((leave) => (
                  <TableRow key={leave.id}>
                    {isHRorAdmin && (
                      <TableCell>{getEmployeeName(leave.employee_id)}</TableCell>
                    )}
                    <TableCell>
                      {leave.leave_type?.charAt(0).toUpperCase() + leave.leave_type?.slice(1) || 'N/A'}
                    </TableCell>
                    <TableCell>{formatDate(leave.start_date)}</TableCell>
                    <TableCell>{formatDate(leave.end_date)}</TableCell>
                    <TableCell>{leave.duration || 'N/A'} days</TableCell>
                    <TableCell>
                      {leave.reason?.length > 30 
                        ? `${leave.reason.substring(0, 30)}...` 
                        : leave.reason || 'N/A'}
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={leave.status?.charAt(0).toUpperCase() + leave.status?.slice(1) || 'N/A'} 
                        color={getStatusColor(leave.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={(e) => handleOpenMenu(e, leave.id)}
                        aria-label="more options"
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={isHRorAdmin ? 8 : 7} align="center">
                    No leave requests found
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
          <MenuItem onClick={() => {
            navigate(`/hr/leaves/${selectedLeaveId}`);
            handleCloseMenu();
          }}>
            <ListItemIcon>
              <VisibilityIcon fontSize="small" />
            </ListItemIcon>
            View Details
          </MenuItem>
          
          {isHRorAdmin && (
            <MenuItem onClick={handleApproveClick}>
              <ListItemIcon>
                <CheckCircleIcon fontSize="small" color="success" />
              </ListItemIcon>
              Approve
            </MenuItem>
          )}
          
          {isHRorAdmin && (
            <MenuItem onClick={handleRejectClick}>
              <ListItemIcon>
                <CancelIcon fontSize="small" color="error" />
              </ListItemIcon>
              <Typography variant="inherit" color="error">
                Reject
              </Typography>
            </MenuItem>
          )}
          
          <MenuItem onClick={handleDeleteClick}>
            <ListItemIcon>
              <DeleteIcon fontSize="small" color="error" />
            </ListItemIcon>
            <Typography variant="inherit" color="error">
              Delete
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
              Are you sure you want to delete this leave request? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancelDelete} disabled={actionLoading}>
              Cancel
            </Button>
            <Button 
              onClick={handleConfirmDelete} 
              color="error" 
              disabled={actionLoading}
              startIcon={actionLoading ? <CircularProgress size={20} /> : null}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
        
        {/* Approve Confirmation Dialog */}
        <Dialog
          open={approveDialogOpen}
          onClose={handleCancelApprove}
        >
          <DialogTitle>Confirm Approval</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to approve this leave request?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancelApprove} disabled={actionLoading}>
              Cancel
            </Button>
            <Button 
              onClick={handleConfirmApprove} 
              color="primary" 
              disabled={actionLoading}
              startIcon={actionLoading ? <CircularProgress size={20} /> : null}
            >
              Approve
            </Button>
          </DialogActions>
        </Dialog>
        
        {/* Reject Confirmation Dialog */}
        <Dialog
          open={rejectDialogOpen}
          onClose={handleCancelReject}
        >
          <DialogTitle>Confirm Rejection</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to reject this leave request?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancelReject} disabled={actionLoading}>
              Cancel
            </Button>
            <Button 
              onClick={handleConfirmReject} 
              color="error" 
              disabled={actionLoading}
              startIcon={actionLoading ? <CircularProgress size={20} /> : null}
            >
              Reject
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </HRLayout>
  );
};

export default LeaveRequests;