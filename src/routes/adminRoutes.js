import AdminPanel from '../pages/AdminPanel';
import { ProtectedRoute } from './ProtectedRoute';

const adminRoutes = [
  {
    path: '/admin',
    element: (
      <ProtectedRoute roles={['admin']}>
        <AdminPanel />
      </ProtectedRoute>
    )
  }
];

export default adminRoutes;