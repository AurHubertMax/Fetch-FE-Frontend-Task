import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';

function ProtectedRoute() {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
        console.log('Not authenticated, redirecting to login');
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}

export default ProtectedRoute;