import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { normalizeRole } from '../constants/configs';
import { ROLE_SUPER_ADMIN } from '../constants/configs';
import { normalizeUserPermissions } from '../constants/permissions';

export const useUserStore = create(
    persist(
        (set, get) => ({
            // ===== State =====
            user: null,
            access_token: null,
            isAuthenticated: false,

            // ===== Actions =====
            setUser: (user, access_token) =>
                set({
                    user,
                    access_token,
                    isAuthenticated: !!access_token
                }),

            clearUser: () =>
                set({
                    user: null,
                    access_token: null,
                    isAuthenticated: false
                }),

            updateUser: updatedFields =>
                set({
                    user: { ...get().user, ...updatedFields }
                }),

            hasRole: role => {
                const { user } = get();
                if (!user?.roles?.length) return false;
                const needle = normalizeRole(role);
                if (!needle) return false;
                return user.roles.some(ro => normalizeRole(ro) === needle) || user.roles.includes(role) || false;
            },

            /** Check if current user has an action on a resource. Super_admin bypasses. */
            can: (resource, action) => {
                const { user } = get();
                if (!user) return false;
                if (get().hasRole(ROLE_SUPER_ADMIN)) return true;
                const permissionsMap = normalizeUserPermissions(user.permissions);
                const actions = permissionsMap.get(resource);
                return actions ? actions.has(action) : false;
            },

            /** Check if user has any of the given (resource, action) pairs. */
            canAny: (checks) => {
                if (!Array.isArray(checks) || checks.length === 0) return false;
                return checks.some(({ resource, action }) => get().can(resource, action));
            },

            /** Check if user has all of the given (resource, action) pairs. */
            canAll: (checks) => {
                if (!Array.isArray(checks) || checks.length === 0) return true;
                return checks.every(({ resource, action }) => get().can(resource, action));
            },

            /** Legacy: single permission string "resource.action" or literal string. */
            hasPermission: permission => {
                const { user } = get();
                if (!user) return false;
                if (get().hasRole(ROLE_SUPER_ADMIN)) return true;
                if (typeof permission === 'string' && permission.includes('.')) {
                    const [resource, action] = permission.split('.');
                    return get().can(resource?.trim(), action?.trim());
                }
                return user?.permissions?.includes(permission) || false;
            }
        }),
        {
            name: 'tallam-user-storage',
            partialize: state => ({
                user: state.user,
                access_token: state.access_token,
                isAuthenticated: state.isAuthenticated
            })
        }
    )
);
