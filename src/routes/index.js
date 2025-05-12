import { Navigate } from 'react-router-dom';
import publicRoutes from './publicRoutes';
import dashboardRoutes from './dashboardRoutes';
import adminRoutes from './adminRoutes';
import hrRoutes from './hrRoutes';
import financeRoutes from './financeRoutes';
import pmRoutes from './pmRoutes';
import crmRoutes from './crmRoutes';

// Combine all routes
const routes = [
  ...publicRoutes,
  ...dashboardRoutes,
  ...adminRoutes,
  ...hrRoutes,
  ...financeRoutes,
  ...pmRoutes,
  ...crmRoutes,
  // Catch all route - redirect to dashboard
  {
    path: '*',
    element: <Navigate to="/" />
  }
];

export default routes;