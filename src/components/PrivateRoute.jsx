// src/components/PrivateRoute.jsx
import { Navigate } from 'react-router-dom';
import useAuthStore from '../store/auth';

const PrivateRoute = ({ children }) => {
  const token = useAuthStore((state) => state.token);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;