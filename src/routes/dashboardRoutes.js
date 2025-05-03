import Dashboard from '../pages/Dashboard';
import { ProtectedRoute } from './ProtectedRoute';

const dashboardRoutes = [
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    )
  }
];

export default dashboardRoutes;