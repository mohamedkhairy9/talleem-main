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
            // The active entity is selected only for supervisors who are
            // assigned to more than one entity. It is persisted so a refresh
            // does not lose the current working context.
            selectedSupervisorEntity: null,

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
                    isAuthenticated: false,
                    selectedSupervisorEntity: null
                }),

            setSelectedSupervisorEntity: entity =>
                set({ selectedSupervisorEntity: entity || null }),

            clearSelectedSupervisorEntity: () =>
                set({ selectedSupervisorEntity: null }),

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
                if (!resource) return false;

                // The permissions API can use snake_case while route guards
                // and navigation use kebab-case. Both forms identify the same
                // resource and must grant the same access.
                const resourceName = String(resource).trim();
                const resourceAliases = [
                    resourceName,
                    resourceName.replace(/-/g, "_"),
                    resourceName.replace(/_/g, "-"),
                ];

                return resourceAliases.some((alias) => {
                    const actions = permissionsMap.get(alias);
                    return actions ? actions.has(action) : false;
                });
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
                isAuthenticated: state.isAuthenticated,
                selectedSupervisorEntity: state.selectedSupervisorEntity
            })
        }
    )
);
