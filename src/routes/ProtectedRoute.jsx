import { Navigate } from 'react-router-dom';
import { useUserStore } from '../utils/stores/user.store';

export default function ProtectedRoute({ children, requiredPermissions=[] }) {
    const isAuthenticated = useUserStore(state => state.isAuthenticated);

    const userPermissions =
        useUserStore(state => state.user?.permissions) || [];
    const userRoles = useUserStore(state => state.user?.roles) || [];

    const hasPermission = requiredPermissions.every(p =>
        userPermissions.includes(p)
    );

    if (!isAuthenticated) return <Navigate to="/login" replace />;

    return children;
}
