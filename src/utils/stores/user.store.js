import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
                return user?.roles?.includes(role) || false;
            },
            hasPermission: permission => {
                const { user } = get();
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
