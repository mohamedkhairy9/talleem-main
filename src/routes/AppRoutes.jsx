import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import { routes } from './routes';
import Login from '../pages/auth/Login';
import Layout from '@/components/layout/Layout';

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />

            <Route
                path="/"
                element={
                    <ProtectedRoute>
                        <Layout />
                    </ProtectedRoute>
                }
            >
                {routes.map(route => (
                    <Route
                        key={route.path}
                        index={route.index}
                        element={route.element}
                        path={route.path}
                    />
                ))}
            </Route>
        </Routes>
    );
}
