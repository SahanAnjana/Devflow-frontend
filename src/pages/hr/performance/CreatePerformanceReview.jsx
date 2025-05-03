// src/pages/hr/CreatePerformanceReview.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Grid,
  Typography,
  Alert,
  Divider,
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
  IconButton,
  CircularProgress
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AssessmentIcon from '@mui/icons-material/Assessment';
import { getEmployees } from '../../../api/hr-management/employees';
import { createPerformanceReview } from '../../../api/hr-management/performances';
import { useAuth } from '../../../context/AuthContext';
import HRLayout from '../../../components/layout/HRLayout';
import FormSection from '../../../components/forms/FormSection';
import { FormTextField } from '../../../components/forms/FormTextField';
import { DateField } from '../../../components/fields/DateField';
import { SelectField } from '../../../components/fields/SelectField';
import { FormStepper } from '../../../components/forms/FormStepper';
import { ErrorAlert } from '../../../components/common/ErrorAlert';
import RatingField from '../../../components/fields/RatingField';

const CreatePerformanceReview = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [error, setError] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [activeStep, setActiveStep] = useState(0);
  const [validationErrors, setValidationErrors] = useState({});
  
  // Pre-selected employee ID from navigation state
  const preSelectedEmployeeId = location.state?.employeeId;
  
  const isHRorAdmin = user?.role === 'hr' || user?.role === 'admin';
  const isManager = user?.role === 'manager';
  
  // Review form state
  const [reviewForm, setReviewForm] = useState({
    employee_id: preSelectedEmployeeId || '',
    reviewer_id: user?.employee_id || '',
    review_date: new Date().toISOString().split('T')[0],
    review_period: '',
    performance_goals: '',
    achievements: '',
    areas_for_improvement: '',
    training_needs: '',
    employee_comments: '',
    reviewer_comments: '',
    job_knowledge_rating: 0,
    work_quality_rating: 0,
    attendance_punctuality_rating: 0,
    communication_rating: 0,
    teamwork_rating: 0,
    problem_solving_rating: 0,
    overall_rating: 0
  });

  const steps = [
    'Review Information',
    'Performance Evaluation',
    'Performance Ratings',
    'Comments and Feedback'
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch employees
        const employeesData = await getEmployees();
        setEmployees(employeesData);
        
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setReviewForm(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleRatingChange = (name, value) => {
    // Calculate overall rating whenever any rating changes
    const ratingFields = [
      'job_knowledge_rating',
      'work_quality_rating',
      'attendance_punctuality_rating',
      'communication_rating',
      'teamwork_rating',
      'problem_solving_rating'
    ];
    
    const updatedForm = {
      ...reviewForm,
      [name]: value
    };
    
    const ratingSum = ratingFields.reduce((sum, field) => {
      return sum + (field === name ? value : updatedForm[field] || 0);
    }, 0);
    
    const overallRating = Math.round((ratingSum / ratingFields.length) * 10) / 10;
    
    setReviewForm(prev => ({
      ...prev,
      [name]: value,
      overall_rating: overallRating
    }));
    
    // Clear validation error
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const validateStep = (step) => {
    const errors = {};
    
    if (step === 0) {
      if (!reviewForm.employee_id) errors.employee_id = 'Employee is required';
      if (!reviewForm.reviewer_id) errors.reviewer_id = 'Reviewer is required';
      if (!reviewForm.review_date) errors.review_date = 'Review date is required';
      if (!reviewForm.review_period) errors.review_period = 'Review period is required';
    } else if (step === 1) {
      // No mandatory fields in step 1, but you could add validation if needed
    } else if (step === 2) {
      // Check if any rating is still at 0
      const ratingFields = [
        'job_knowledge_rating',
        'work_quality_rating',
        'attendance_punctuality_rating',
        'communication_rating',
        'teamwork_rating',
        'problem_solving_rating'
      ];
      
      const hasZeroRating = ratingFields.some(field => reviewForm[field] === 0);
      if (hasZeroRating) {
        errors.job_knowledge_rating = 'Please complete all ratings';
      }
    } else if (step === 3) {
      if (!reviewForm.reviewer_comments.trim()) errors.reviewer_comments = 'Reviewer comments are required';
    }
    
    return errors;
  };

  const handleNext = () => {
    const errors = validateStep(activeStep);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async () => {
    const errors = validateStep(activeStep);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    
    try {
      setSaveLoading(true);
      
      // Submit performance review
      await createPerformanceReview(reviewForm);
      
      // Navigate to performance reviews list
      navigate('/hr/performance');
      
    } catch (err) {
      console.error('Error creating performance review:', err);
      setError('Failed to create performance review. Please try again.');
    } finally {
      setSaveLoading(false);
    }
  };

  // Rating field definitions for cleaner JSX
  const ratingFields = [
    {
      name: 'job_knowledge_rating',
      label: 'Job Knowledge',
      description: 'Understanding of job duties, skills, and procedures'
    },
    {
      name: 'work_quality_rating',
      label: 'Work Quality',
      description: 'Accuracy, thoroughness, and effectiveness of work'
    },
    {
      name: 'attendance_punctuality_rating',
      label: 'Attendance & Punctuality',
      description: 'Reliability in attendance and meeting deadlines'
    },
    {
      name: 'communication_rating',
      label: 'Communication',
      description: 'Clarity and effectiveness in verbal and written communication'
    },
    {
      name: 'teamwork_rating',
      label: 'Teamwork',
      description: 'Ability to work with others and contribute to team goals'
    },
    {
      name: 'problem_solving_rating',
      label: 'Problem Solving',
      description: 'Ability to identify and resolve issues effectively'
    }
  ];

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
        <Box display="flex" alignItems="center" mb={3}>
          <IconButton 
            sx={{ mr: 2 }} 
            onClick={() => navigate('/hr/performance')}
            aria-label="back"
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
            Create Performance Review
          </Typography>
        </Box>
        
        <ErrorAlert error={error} />
        
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            
            {/* Step 1: Review Information */}
            {activeStep === 0 && (
              <FormSection title="Review Information">
                <Grid item xs={12} md={6}>
                  <SelectField
                    label="Employee"
                    name="employee_id"
                    value={reviewForm.employee_id}
                    onChange={handleFormChange}
                    options={employees.map((employee) => ({
                      value: employee.id,
                      label: `${employee.first_name} ${employee.last_name}`
                    }))}
                    required
                    error={validationErrors.employee_id}
                    disabled={!!preSelectedEmployeeId}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <SelectField
                    label="Reviewer"
                    name="reviewer_id"
                    value={reviewForm.reviewer_id}
                    onChange={handleFormChange}
                    options={employees
                      .filter(emp => isHRorAdmin || emp.id === user?.employee_id)
                      .map((employee) => ({
                        value: employee.id,
                        label: `${employee.first_name} ${employee.last_name}`
                      }))}
                    required
                    error={validationErrors.reviewer_id}
                    disabled={!isHRorAdmin} // Only HR/Admin can change reviewer
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <DateField
                    label="Review Date"
                    name="review_date"
                    value={reviewForm.review_date}
                    onChange={handleFormChange}
                    required
                    error={validationErrors.review_date}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <SelectField
                    label="Review Period"
                    name="review_period"
                    value={reviewForm.review_period}
                    onChange={handleFormChange}
                    options={[
                      { value: "Q1 2024", label: "Q1 2024" },
                      { value: "Q2 2024", label: "Q2 2024" },
                      { value: "Q3 2024", label: "Q3 2024" },
                      { value: "Q4 2024", label: "Q4 2024" },
                      { value: "2023 Annual", label: "2023 Annual" },
                      { value: "2024 Annual", label: "2024 Annual" }
                    ]}
                    required
                    error={validationErrors.review_period}
                  />
                </Grid>
              </FormSection>
            )}
            
            {/* Step 2: Performance Evaluation */}
            {activeStep === 1 && (
              <FormSection title="Performance Evaluation">
                <Grid item xs={12}>
                  <FormTextField
                    label="Performance Goals"
                    name="performance_goals"
                    multiline
                    rows={3}
                    value={reviewForm.performance_goals}
                    onChange={handleFormChange}
                    helperText="List the performance goals set for this review period"
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <FormTextField
                    label="Key Achievements"
                    name="achievements"
                    multiline
                    rows={3}
                    value={reviewForm.achievements}
                    onChange={handleFormChange}
                    helperText="Highlight key accomplishments during this period"
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <FormTextField
                    label="Areas for Improvement"
                    name="areas_for_improvement"
                    multiline
                    rows={3}
                    value={reviewForm.areas_for_improvement}
                    onChange={handleFormChange}
                    helperText="Identify areas that need development or improvement"
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <FormTextField
                    label="Training & Development Needs"
                    name="training_needs"
                    multiline
                    rows={2}
                    value={reviewForm.training_needs}
                    onChange={handleFormChange}
                    helperText="Recommend specific training or development activities"
                  />
                </Grid>
              </FormSection>
            )}
            
            {/* Step 3: Performance Ratings */}
            {activeStep === 2 && (
              <FormSection title="Performance Ratings">
                {validationErrors.job_knowledge_rating && (
                  <Grid item xs={12}>
                    <Alert severity="error" sx={{ mt: 1, mb: 2 }}>
                      {validationErrors.job_knowledge_rating}
                    </Alert>
                  </Grid>
                )}
                
                {/* Map through rating fields using the reusable RatingField component */}
                {ratingFields.map((field) => (
                  <RatingField
                    key={field.name}
                    name={field.name}
                    label={field.label}
                    value={reviewForm[field.name]}
                    onChange={handleRatingChange}
                    description={field.description}
                  />
                ))}
                
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Box display="flex" alignItems="center">
                    <Typography component="legend" variant="h6" sx={{ mr: 2 }}>Overall Rating:</Typography>
                    <RatingField
                      name="overall_rating"
                      label=""
                      value={reviewForm.overall_rating}
                      readOnly
                      precision={0.1}
                      gridSize={10}
                    />
                    <Typography variant="h6" sx={{ ml: 1 }}>
                      ({reviewForm.overall_rating.toFixed(1)})
                    </Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    This is the average of all rating categories above
                  </Typography>
                </Grid>
              </FormSection>
            )}
            
            {/* Step 4: Comments and Feedback */}
            {activeStep === 3 && (
              <FormSection title="Comments and Feedback">
                <Grid item xs={12}>
                  <FormTextField
                    label="Reviewer Comments"
                    name="reviewer_comments"
                    multiline
                    rows={4}
                    value={reviewForm.reviewer_comments}
                    onChange={handleFormChange}
                    required
                    error={validationErrors.reviewer_comments}
                    helperText="Provide detailed feedback including strengths, areas to improve, and action items"
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <FormTextField
                    label="Employee Comments"
                    name="employee_comments"
                    multiline
                    rows={4}
                    value={reviewForm.employee_comments}
                    onChange={handleFormChange}
                    helperText="Optional: Employee can provide their own comments and reflections"
                  />
                </Grid>
              </FormSection>
            )}
            
            <FormStepper
              steps={steps}
              activeStep={activeStep}
              handleBack={handleBack}
              handleNext={handleNext}
              handleSubmit={handleSubmit}
              saveLoading={saveLoading}
              lastStepLabel="Create Review"
              cancelPath="/hr/performance"
            />
          </CardContent>
        </Card>
      </Box>
    </HRLayout>
  );
};

export default CreatePerformanceReview;