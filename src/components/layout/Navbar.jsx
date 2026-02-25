import React, { useState } from 'react';
import {
    HiSearch,
    HiChevronDown,
    HiLogout,
    HiUser,
    HiCog
} from 'react-icons/hi';
import { useUserStore } from '@/utils/stores/user.store';
import { useLogoutMutation } from '@/api/hooks/useAuth';
import LanguageSwitcher from '@/components/common/LanguageSwitcher';
import DateFormatSwitcher from '@/components/common/DateFormatSwitcher';
import useLocale from '@/utils/hooks/global/useLocale';

export default function Navbar() {
    const {isRTL, currentLocale } = useLocale()
    const { t } = useLocale();
    const user = useUserStore(state => state.user);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const { mutate: logout } = useLogoutMutation();

    const handleLogout = () => {
        logout();
        setIsDropdownOpen(false);
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    return (
        <div className="w-full bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-end">
                <div className="flex gap-4 items-center">
                    <DateFormatSwitcher />
                    <LanguageSwitcher />

                    <div className="relative">
                        <button
                            onClick={toggleDropdown}
                            className="flex items-center space-x-3 rounded-full rounded-r-lg hover:bg-gray-100 transition-colors duration-200 focus:outline-none "
                        >
                            <div className="size-10 rounded-full bg-accent flex items-center justify-center">
                                <span className="text-base font-medium text-white">
                                    {user?.name[currentLocale]?.charAt(0).toUpperCase() || (currentLocale === "en" ? 'U' : "م")}
                                </span>
                            </div>

                            <div className="hidden md:block text-left">
                                <p className="text-sm font-medium text-gray-900">
                                    {user?.name[currentLocale] || (currentLocale === "en" ? "User" : "مستخدم")}
                                </p>
                                <p className="text-xs text-gray-500 capitalize">
                                    {user?.user_type || 'Member'}
                                </p>
                            </div>

                            <HiChevronDown
                                className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
                                    isDropdownOpen ? 'rotate-180' : ''
                                }`}
                            />
                        </button>

                        {isDropdownOpen && (
                            <>
                                <div
                                    className="fixed  w-screen h-screen left-0 inset-0 z-[50]"
                                    onClick={() => setIsDropdownOpen(false)}
                                />

                                <div className={`absolute ${isRTL ? 'left-0' : 'right-0'}  mt-2 w-56 rounded-lg shadow-lg bg-white border border-gray-300 z-[51]`}>
                                    <div className="">
                                        <div className="px-4 py-3 border-b border-gray-100">
                                            <p className="text-sm font-medium text-gray-900">
                                                {user?.name[currentLocale] || (currentLocale === "en" ? "User" : "مستخدم")}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {user?.email ||
                                                    'user@example.com'}
                                            </p>
                                        </div>

                                        <div className="border-t border-gray-100">
                                            <button
                                                onClick={handleLogout}
                                                className="flex items-center w-full px-4 gap-2 hover:gap-2 rounded-b-lg py-2 text-sm text-red-700 hover:bg-red-50  duration-200"
                                            >
                                                <HiLogout className="mr-3 h-4 w-4 text-red-400" />
                                                <span>{t('logout')}</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
