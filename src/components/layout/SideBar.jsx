import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { HiMenuAlt3, HiX } from 'react-icons/hi';
import Logo from '../common/Logo';
import { sideMenuTabs } from '../../utils/constants/configs';

export default function SideBar() {
    const [isOpen, setIsOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    // Handle responsive design
    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            if (mobile) {
                setIsOpen(false);
            } else {
                setIsOpen(true);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const handleNavigation = path => {
        navigate(path);
        if (isMobile) {
            setIsOpen(false);
        }
    };

    const isActive = path => {
        if (path === '/') {
            return location.pathname === '/';
        }
        return location.pathname.startsWith(path);
    };

    return (
        <>
            {isMobile && isOpen && (
                <div
                    className="fixed inset-0 animate-fade-in bg-black/50 z-40 duration-100"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {!isMobile && (
                <div
                    className={`${
                        isOpen ? 'w-[270px]' : 'w-[70px]'
                    } h-screen shrink-0 transition-all duration-200`}
                ></div>
            )}

            {isMobile && !isOpen && (
                <button
                    onClick={toggleSidebar}
                    className="fixed top-4 left-4 z-50 p-2 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-colors duration-200"
                    aria-label="Toggle menu"
                >
                    {isOpen ? <HiX size={24} /> : <HiMenuAlt3 size={24} />}
                </button>
            )}

            <div
                className={`flex shrink-0 flex-col
                fixed left-0 top-0 h-screen bg-white shadow-xl border-r border-gray-200 z-40
                transition-all duration-200 ease-in-out
                ${isOpen ? 'w-[270px]' : 'w-[70px]'}
                ${isMobile && !isOpen ? '-translate-x-full' : 'translate-x-0'}
            `}
            >
                <div className="flex justify-between items-center p-4 gap-2 border-b border-gray-200">
                    <Logo
                        onClick={() => setIsOpen(true)}
                        rounded="rounded-xl"
                        size="size-10"
                        textSize="text-sm"
                    />
                    {isOpen && (
                        <div
                            className={`transition-all duration-200 overflow-hidden ${
                                isOpen
                                    ? 'opacity-100 max-w-full'
                                    : 'opacity-0 max-w-0'
                            }`}
                        >
                            <span className="font-semibold text-lg text-gray-800 tracking-wide whitespace-nowrap">
                                DASHBOARD
                            </span>
                        </div>
                    )}

                    {!isMobile && isOpen && (
                        <button
                            onClick={toggleSidebar}
                            className={` text-gray-500 hover:text-indigo-500  rounded-lg transition-all duration-200 
                            `}
                            aria-label="Toggle sidebar"
                        >
                            <HiMenuAlt3 size={20} />
                        </button>
                    )}
                    {isOpen && <span></span>}
                </div>

                <nav className="flex-1 p-3 space-y-1 scrollbar-hide overflow-y-auto">
                    {sideMenuTabs.map(tab => {
                        const Icon = tab.icon;
                        const active = isActive(tab.path);

                        return (
                            <button
                                key={tab.path}
                                onClick={() => handleNavigation(tab.path)}
                                className={`
                                    w-full flex items-center gap-1 text-base px-3 py-2.5 rounded-lg transition-all duration-200
                                    group relative
                                    ${
                                        active
                                            ? 'bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white shadow-sm'
                                            : 'text-gray-500 hover:gap-2 hover:text-indigo-600 hover:bg-gray-100'
                                    }
                                `}
                                aria-label={tab.title}
                                title={!isOpen ? tab.title : ''}
                            >
                                <div
                                    className={`
                                    flex items-center justify-center transition-all duration-200 shrink-0
                                    ${
                                        active
                                            ? 'text-white'
                                            : 'group-hover:scale-105'
                                    }
                                `}
                                >
                                    <Icon size={20} />
                                </div>

                                <span
                                    className={`
                                    font-medium transition-all duration-200 overflow-hidden whitespace-nowrap
                                    ${
                                        isOpen
                                            ? 'opacity-100 max-w-full'
                                            : 'opacity-0 max-w-0'
                                    }
                                    ${active ? 'font-semibold' : ''}
                                `}
                                >
                                    {tab.title}
                                </span>
                            </button>
                        );
                    })}
                </nav>
                <div className="p-4 w-full self-end border-t border-gray-200">
                    <div
                        className={`
                        flex items-center gap-3 px-3 py-2 text-gray-500 transition-all duration-200 overflow-hidden
                        ${
                            isOpen
                                ? 'opacity-100 max-w-full'
                                : 'opacity-0 max-w-0'
                        }
                    `}
                    >
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shrink-0" />
                        <span className="text-sm font-medium whitespace-nowrap">
                            System Online
                        </span>
                    </div>
                </div>
            </div>
        </>
    );
}
