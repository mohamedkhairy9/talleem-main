import React from 'react';
import { Outlet, useLocation, Navigate } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';
import Navbar from './Navbar';
import SideBar from './SideBar';
import { useUserStore } from '@/utils/stores/user.store';
import { ROLE_SUPER_ADMIN, ROLE_BRANCH_ADMIN, normalizeRole } from '@/utils/constants/configs';

// Branch manager can only access home and join requests (not request-types, phases, or join-request-forms).
const BRANCH_ADMIN_ALLOWED_PATHS = ['/', '/join-requests'];

function isBranchAdminOnly(userRoles) {
    if (!userRoles?.length) return false;
    const normalized = userRoles.map(normalizeRole);
    const isSuperAdmin = normalized.includes(normalizeRole(ROLE_SUPER_ADMIN));
    const isBranchAdmin = normalized.includes(normalizeRole(ROLE_BRANCH_ADMIN));
    return isBranchAdmin && !isSuperAdmin;
}

function isPathAllowedForBranchAdmin(pathname) {
    if (pathname === '/') return true;
    return BRANCH_ADMIN_ALLOWED_PATHS.some(p => p !== '/' && pathname.startsWith(p));
}

export default function Layout() {
    const location = useLocation();
    // Sidebar/layout: we only use user.roles (not user_type).
    const userRoles = useUserStore(
        useShallow(state => {
            const u = state.user;
            return u?.roles ?? [];
        })
    );
    const branchAdminOnly = isBranchAdminOnly(userRoles);
    const pathAllowed = isPathAllowedForBranchAdmin(location.pathname);

    if (branchAdminOnly && !pathAllowed) {
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
