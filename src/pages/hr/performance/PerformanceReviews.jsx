// src/pages/hr/PerformanceReviews.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Rating,
  Tabs,
  Tab,
  CircularProgress,
  Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { 
  getEmployees,
  getEmployeeById
} from '../../../api/hr-management/employees';
import { 
  getPerformanceReviews, 
  getOwnPerformanceReviews, 
  getReviewsAsReviewer, 
  deletePerformanceReview 
} from '../../../api/hr-management/performances';
import HRLayout from '../../../components/layout/HRLayout';
import { useAuth } from '../../../context/AuthContext';
import FilterToolbar from '../../../components/common/FilterToolbar';
import ActionMenu from '../../../components/common/ActionMenu';
import ConfirmationDialog from '../../../components/common/ConfirmationDialog';

const PerformanceReviews = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [filters, setFilters] = useState({
    employee_id: '',
    reviewer_id: '',
    review_period: '',
  });
  
  // Action confirmation dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const isHRorAdmin = user?.role === 'hr' || user?.role === 'admin';
  const isManager = user?.role === 'manager';

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        let reviewsData = [];
        const fetchPromises = [];
        
        // Fetch different types of reviews based on user role and active tab
        if (isHRorAdmin) {
          // HR and admins can see all reviews
          fetchPromises.push(getPerformanceReviews());
          fetchPromises.push(getEmployees());
        } else if (isManager) {
          // Managers can see reviews they conducted
          if (tabValue === 0) {
            fetchPromises.push(getReviewsAsReviewer());
          } else {
            fetchPromises.push(getOwnPerformanceReviews());
          }
        } else {
          // Regular employees can only see their own reviews
          fetchPromises.push(getOwnPerformanceReviews());
        }
        
        const results = await Promise.all(fetchPromises);
        reviewsData = results[0];
        
        if (results.length > 1 && isHRorAdmin) {
          setEmployees(results[1]);
        }
        
        setReviews(reviewsData);
        
      } catch (err) {
        console.error('Error fetching performance reviews:', err);
        setError('Failed to load performance reviews. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [isHRorAdmin, isManager, tabValue, user?.employee_id]);

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
      reviewer_id: '',
      review_period: '',
    });
    setSearchTerm('');
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleViewReview = (reviewId) => {
    navigate(`/hr/performance/${reviewId}`);
  };
  
  const handleEditReview = (reviewId) => {
    navigate(`/hr/performance/edit/${reviewId}`);
  };

  const handleDeleteReview = (reviewId) => {
    setSelectedReviewId(reviewId);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteReview = async () => {
    if (!selectedReviewId) return;
    
    try {
      setActionLoading(true);
      await deletePerformanceReview(selectedReviewId);
      
      // Remove deleted review from state
      setReviews(reviews.filter(review => review.id !== selectedReviewId));
      
      setDeleteDialogOpen(false);
      setSelectedReviewId(null);
    } catch (err) {
      console.error('Error deleting performance review:', err);
      setError('Failed to delete performance review. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCreateReview = () => {
    navigate('/hr/performance/create');
  };

  // Filter reviews based on search term and filters
  const filteredReviews = reviews.filter(review => {
    // Search term filter
    const employeeName = `${review.employee_first_name} ${review.employee_last_name}`.toLowerCase();
    const reviewerName = `${review.reviewer_first_name} ${review.reviewer_last_name}`.toLowerCase();
    const searchMatch = searchTerm === '' || 
      employeeName.includes(searchTerm.toLowerCase()) ||
      reviewerName.includes(searchTerm.toLowerCase()) ||
      review.review_period.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Drop-down filters
    const employeeMatch = filters.employee_id === '' || review.employee_id === filters.employee_id;
    const reviewerMatch = filters.reviewer_id === '' || review.reviewer_id === filters.reviewer_id;
    const periodMatch = filters.review_period === '' || review.review_period === filters.review_period;
    
    return searchMatch && employeeMatch && reviewerMatch && periodMatch;
  });

  const getEmployeeName = (employeeId) => {
    const employee = employees.find(emp => emp.id === employeeId);
    return employee ? `${employee.first_name} ${employee.last_name}` : 'N/A';
  };

  // Generate filter fields based on data
  const filterFields = [
    {
      name: 'employee_id',
      label: 'Employee',
      gridSize: 3,
      options: employees.map(emp => ({
        value: emp.id,
        label: `${emp.first_name} ${emp.last_name}`
      }))
    },
    {
      name: 'reviewer_id',
      label: 'Reviewer',
      gridSize: 3,
      options: employees.map(emp => ({
        value: emp.id,
        label: `${emp.first_name} ${emp.last_name}`
      }))
    },
    {
      name: 'review_period',
      label: 'Period',
      gridSize: 2,
      options: [
        { value: "Q1 2024", label: "Q1 2024" },
        { value: "Q2 2024", label: "Q2 2024" },
        { value: "Q3 2024", label: "Q3 2024" },
        { value: "Q4 2024", label: "Q4 2024" },
        { value: "2023 Annual", label: "2023 Annual" },
        { value: "2024 Annual", label: "2024 Annual" }
      ]
    }
  ];

  // Generate action items for each review
  const getReviewActions = (review) => {
    const actions = [
      {
        label: 'View Details',
        icon: <VisibilityIcon fontSize="small" />,
        handler: handleViewReview
      }
    ];

    // Only HR, admins, and the original reviewer can edit or delete
    if (isHRorAdmin || review.reviewer_id === user?.employee_id) {
      actions.push(
        {
          label: 'Edit Review',
          icon: <EditIcon fontSize="small" />,
          handler: handleEditReview
        },
        {
          label: 'Delete Review',
          icon: <DeleteIcon fontSize="small" color="error" />,
          handler: handleDeleteReview,
          color: 'error'
        }
      );
    }

    return actions;
  };

  return (
    <HRLayout>
      <Box sx={{ py: 3 }}>
        {/* Page Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" component="h1">
            Performance Reviews
          </Typography>
          
          {(isHRorAdmin || isManager) && (
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleCreateReview}
            >
              Create Review
            </Button>
          )}
        </Box>
        
        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        {/* Role-based Tabs */}
        {isManager && (
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange}
            sx={{ mb: 3 }}
            textColor="primary"
            indicatorColor="primary"
          >
            <Tab label="Reviews I've Conducted" />
            <Tab label="My Reviews" />
          </Tabs>
        )}
        
        {/* Filter Toolbar */}
        <FilterToolbar
          searchValue={searchTerm}
          onSearchChange={handleSearchChange}
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={clearFilters}
          filterFields={isHRorAdmin ? filterFields : []}
        />
        
        {/* Reviews Table */}
        {loading ? (
          <Box display="flex" justifyContent="center" sx={{ my: 4 }}>
            <CircularProgress />
          </Box>
        ) : filteredReviews.length === 0 ? (
          <Alert severity="info" sx={{ mt: 2 }}>
            No performance reviews found. {(isHRorAdmin || isManager) && 'Click the Create Review button to add one.'}
          </Alert>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Employee</TableCell>
                  <TableCell>Reviewer</TableCell>
                  <TableCell>Review Period</TableCell>
                  <TableCell>Review Date</TableCell>
                  <TableCell align="center">Overall Rating</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredReviews.map((review) => (
                  <TableRow key={review.id}>
                    <TableCell>
                      {getEmployeeName(review.employee_id)} 
                    </TableCell>
                    <TableCell>
                      {getEmployeeName(review.reviewer_id)} 
                    </TableCell>
                    <TableCell>{review.review_period}</TableCell>
                    <TableCell>
                      {new Date(review.review_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell align="center">
                      <Box display="flex" alignItems="center" justifyContent="center">
                        <Rating 
                          value={review.overall_rating} 
                          readOnly 
                          precision={0.1} 
                          size="small"
                        />
                        <Typography variant="body2" sx={{ ml: 1 }}>
                        ({(review.overall_rating || 0).toFixed(1)})
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <ActionMenu 
                        actions={getReviewActions(review)} 
                        itemId={review.id}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
      
      {/* Confirmation Dialog for Delete */}
      <ConfirmationDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        title="Delete Performance Review"
        message="Are you sure you want to delete this performance review? This action cannot be undone."
        onConfirm={confirmDeleteReview}
        confirmLabel="Delete"
        confirmColor="error"
        loading={actionLoading}
      />
    </HRLayout>
  );
};

export default PerformanceReviews;