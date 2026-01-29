import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#0E1C14', color: '#fff' }}>
                <Loader2 className="animate-spin" size={40} />
            </div>
        );
    }

    return user ? <Outlet /> : <Navigate to="/admin/login" />;
};

export default ProtectedRoute;
