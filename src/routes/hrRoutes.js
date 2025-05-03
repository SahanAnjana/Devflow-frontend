import HRDashboard from '../pages/hr/HRDashboard';
import EmployeesList from '../pages/hr/employee/EmployeesList';
import EmployeeDetails from '../pages/hr/employee/EmployeeDetails';
import CreateEmployee from '../pages/hr/employee/CreateEmployee';
import DepartmentsList from '../pages/hr/department/DepartmentsList';
import PositionsList from '../pages/hr/position/PositionsList';
import LeaveRequests from '../pages/hr/leave/LeaveRequests';
import CreateLeaveRequest from '../pages/hr/leave/CreateLeaveRequest';
import PerformanceReviews from '../pages/hr/performance/PerformanceReviews';
import CreatePerformanceReview from '../pages/hr/performance/CreatePerformanceReview';
import { ProtectedRoute } from './ProtectedRoute';

const hrRoutes = [
  {
    path: '/hr',
    element: (
      <ProtectedRoute roles={['admin', 'hr']}>
        <HRDashboard />
      </ProtectedRoute>
    )
  },
  // HR Employee Routes
  {
    path: '/hr/employees',
    element: (
      <ProtectedRoute roles={['admin', 'hr']}>
        <EmployeesList />
      </ProtectedRoute>
    )
  },
  {
    path: '/hr/employees/create',
    element: (
      <ProtectedRoute roles={['admin', 'hr']}>
        <CreateEmployee />
      </ProtectedRoute>
    )
  },
  {
    path: '/hr/employees/:id',
    element: (
      <ProtectedRoute roles={['admin', 'hr']}>
        <EmployeeDetails />
      </ProtectedRoute>
    )
  },
  // HR Department Routes
  {
    path: '/hr/departments',
    element: (
      <ProtectedRoute roles={['admin', 'hr']}>
        <DepartmentsList />
      </ProtectedRoute>
    )
  },
  // HR Position Routes
  {
    path: '/hr/positions',
    element: (
      <ProtectedRoute roles={['admin', 'hr']}>
        <PositionsList />
      </ProtectedRoute>
    )
  },
  // HR Leave Routes
  {
    path: '/hr/leaves',
    element: (
      <ProtectedRoute>
        <LeaveRequests />
      </ProtectedRoute>
    )
  },
  {
    path: '/hr/leaves/create',
    element: (
      <ProtectedRoute>
        <CreateLeaveRequest />
      </ProtectedRoute>
    )
  },
  // HR Performance Routes
  {
    path: '/hr/performance',
    element: (
      <ProtectedRoute>
        <PerformanceReviews />
      </ProtectedRoute>
    )
  },
  {
    path: '/hr/performance/create',
    element: (
      <ProtectedRoute roles={['admin', 'hr', 'manager']}>
        <CreatePerformanceReview />
      </ProtectedRoute>
    )
  }
];

export default hrRoutes;