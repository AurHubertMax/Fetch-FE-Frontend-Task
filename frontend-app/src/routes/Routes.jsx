import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';
import ProtectedRoute from './ProtectedRoute';

import Login from '../pages/login/loginPage';
import Dashboard from '../pages/dashboard/dashboard';

function AppRoutes() {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  return (
    <Routes>
      <Route 
        path="/login" 
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} 
      />
      
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>
      
      <Route 
        path="*" 
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />} 
      />
    </Routes>
  );
}

export default AppRoutes;