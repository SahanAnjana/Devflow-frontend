import { ProtectedRoute } from './ProtectedRoute';

// CRM Pages
import CRMDashboard from '../pages/crm/CRMDashboard';
import Companies from '../pages/crm/Companies';
import Deals from '../pages/crm/Deals';
import Activities from '../pages/crm/Activities';
import Contracts from '../pages/crm/Contracts';
import Contacts from '../pages/crm/Contacts';
import Communications from '../pages/crm/Communications';

const crmRoutes = [
  {
    path: '/crm',
    element: (
      <ProtectedRoute roles={['admin', 'crm']}>
        <CRMDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: '/crm/companies',
    element: (
      <ProtectedRoute roles={['admin', 'crm']}>
        <Companies />
      </ProtectedRoute>
    ),
  },
  {
    path: '/crm/deals',
    element: (
      <ProtectedRoute roles={['admin', 'crm']}>
        <Deals />
      </ProtectedRoute>
    ),
  },
  {
    path: '/crm/activities',
    element: (
      <ProtectedRoute roles={['admin', 'crm']}>
        <Activities />
      </ProtectedRoute>
    ),
  },
  {
    path: '/crm/contracts',
    element: (
      <ProtectedRoute roles={['admin', 'crm']}>
        <Contracts />
      </ProtectedRoute>
    ),
  },
  {
    path: '/crm/contacts',
    element: (
      <ProtectedRoute roles={['admin', 'crm']}>
        <Contacts />
      </ProtectedRoute>
    ),
  },
  {
    path: '/crm/communications',
    element: (
      <ProtectedRoute roles={['admin', 'crm']}>
        <Communications />
      </ProtectedRoute>
    ),
  },
];

export default crmRoutes;
