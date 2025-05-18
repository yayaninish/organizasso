import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children }) {
  const { auth } = useAuth();

  if (!auth.token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
