import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, Navigate } from 'react-router-dom';
import { useUserStore } from '@/utils/stores/user.store';
import Navbar from './Navbar';
import SideBar from './SideBar';
import { getRequiredPermissionForPath } from '@/utils/constants/permissions';

// Access is controlled only by permissions (and super_admin bypass). Branch managers can access any path they have permission for.

export default function Layout() {
    const location = useLocation();
    const user = useUserStore(state => state.user);

    // Defer permission check to useEffect so we never redirect on first paint (avoids flash when store is ready after rehydration or navigation)
    const [permissionDenied, setPermissionDenied] = useState(false);
    useEffect(() => {
        const requiredPermission = getRequiredPermissionForPath(location.pathname);
        if (!requiredPermission || user == null) {
            setPermissionDenied(false);
            return;
        }
        const hasAccess = useUserStore.getState().can(requiredPermission.resource, requiredPermission.action);
        setPermissionDenied(!hasAccess);
    }, [location.pathname, user]);

    if (permissionDenied) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="bg-gray-100">
            <div className="flex-1 flex">
                <SideBar />
                <div className="w-full flex flex-col min-h-screen overflow-hidden">
                    <Navbar />

                    <main className="p-4 overflow-auto">
                        <Outlet />
                    </main>
                </div>
            </div>
        </div>
    );
}
