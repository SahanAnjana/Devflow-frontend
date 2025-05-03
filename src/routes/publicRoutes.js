import Login from '../pages/Login';
import ForgotPassword from '../pages/ForgotPassword';
import Register from '../pages/Register';
import Unauthorized from '../pages/Unauthorized';

const publicRoutes = [
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/forgot-password',
    element: <ForgotPassword />
  },
  {
    path: '/register',
    element: <Register />
  },
  {
    path: '/unauthorized',
    element: <Unauthorized />
  }
];

export default publicRoutes;