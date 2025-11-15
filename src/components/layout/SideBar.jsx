import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { HiMenuAlt3, HiX, HiChevronDown } from 'react-icons/hi';
import Logo from '../common/Logo';
import { sideMenuTabs } from '../../utils/constants/configs';
import useLanguageStore from '../../utils/stores/language.store';
import useLocale from '../../utils/hooks/global/useLocale';

export default function SideBar() {
    const [isOpen, setIsOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const [expandedMenus, setExpandedMenus] = useState({});
    const [hoveredSubmenu, setHoveredSubmenu] = useState(null);
    const [submenuPosition, setSubmenuPosition] = useState({ top: 0 });
    const location = useLocation();
    const navigate = useNavigate();
    const { isRTL } = useLanguageStore();
    const { t } = useLocale();

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

    useEffect(() => {
        const newExpandedMenus = {};
        sideMenuTabs.forEach((tab, index) => {
            if (tab.subMenu && tab.subMenu.length > 0) {
                const hasActiveSubmenuItem = tab.subMenu.some(item =>
                    isActive(item.path)
                );
                if (hasActiveSubmenuItem) {
                    newExpandedMenus[index] = true;
                }
            }
        });
        setExpandedMenus(prev => ({ ...prev, ...newExpandedMenus }));
    }, [location.pathname]);

    useEffect(() => {
        const handleClickOutside = event => {
            if (hoveredSubmenu !== null && !isOpen && !isMobile) {
                const floatingMenu =
                    document.querySelector('.floating-submenu');
                const sidebar = document.querySelector('.sidebar-container');

                if (
                    floatingMenu &&
                    !floatingMenu.contains(event.target) &&
                    sidebar &&
                    !sidebar.contains(event.target)
                ) {
                    setHoveredSubmenu(null);
                }
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, [hoveredSubmenu, isOpen, isMobile]);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
        setHoveredSubmenu(null);
    };

    const handleNavigation = path => {
        navigate(path);
        if (isMobile) {
            setIsOpen(false);
        }
    };

    const toggleSubmenu = (index, event) => {
        if (!isOpen && !isMobile) {
            if (hoveredSubmenu === index) {
                setHoveredSubmenu(null);
            } else {
                const rect = event.currentTarget.getBoundingClientRect();
                setSubmenuPosition({ top: rect.top });
                setHoveredSubmenu(index);
            }
        } else {
            setExpandedMenus(prev => ({
                ...prev,
                [index]: !prev[index]
            }));
        }
    };

    const isActive = path => {
        if (path === '/') {
            return location.pathname === '/';
        }
        return location.pathname.startsWith(path);
    };

    const isSubmenuActive = subMenu => {
        const check = items =>
            items?.some(item =>
                item.subMenu && item.subMenu.length > 0
                    ? check(item.subMenu)
                    : isActive(item.path)
            );
        return check(subMenu);
    };

    const toggleNested = key => {
        setExpandedMenus(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const renderSubItems = (items, parentKey = '') => {
        return (
            <div className="space-y-1">
                {items.map((subItem, subIndex) => {
                    const key = parentKey
                        ? `${parentKey}-${subIndex}`
                        : `${subIndex}`;
                    const SubIcon = subItem.icon;
                    const hasNested =
                        subItem.subMenu && subItem.subMenu.length > 0;
                    const subActive = subItem.path
                        ? isActive(subItem.path)
                        : false;
                    const nestedActive = hasNested
                        ? isSubmenuActive(subItem.subMenu)
                        : false;
                    const subTitle = t(subItem.titleKey);
                    const isExpanded = !!expandedMenus[key];

                    return (
                        <div key={key} className="space-y-1">
                            <button
                                onClick={() =>
                                    hasNested
                                        ? toggleNested(key)
                                        : handleNavigation(subItem.path)
                                }
                                className={`
                                    w-full flex items-center gap-1 text-sm px-3 py-2 rounded-lg transition-all duration-200
                                    group relative
                                    ${isRTL ? 'text-right' : 'text-left'}
                                    ${subActive || nestedActive
                                        ? 'bg-primary-100/50 text-primary-700 font-medium'
                                        : 'text-gray-500 hover:gap-2 hover:text-primary hover:bg-gray-50'
                                    }
                                `}
                                aria-label={subTitle}
                            >
                                <div
                                    className={`
                                        flex items-center justify-center transition-all duration-200 shrink-0
                                        ${subActive || nestedActive
                                            ? 'text-primary-700'
                                            : 'group-hover:scale-105'
                                        }
                                    `}
                                >
                                    {SubIcon && <SubIcon size={16} />}
                                </div>

                                <span
                                    className={`
                                        font-medium transition-all duration-200 overflow-hidden whitespace-nowrap flex-1
                                        ${isRTL ? 'text-right' : 'text-left'}
                                        ${subActive || nestedActive
                                            ? 'font-semibold'
                                            : ''
                                        }
                                    `}
                                >
                                    {subTitle}
                                </span>

                                {hasNested && (
                                    <div
                                        className={`transition-transform duration-200 shrink-0 ${isExpanded ? 'rotate-180' : ''
                                            }`}
                                    >
                                        <HiChevronDown size={14} />
                                    </div>
                                )}
                            </button>

                            {hasNested && (
                                <div
                                    className={`overflow-hidden transition-all duration-300 ease-in-out ${isRTL ? 'pr-4' : 'pl-4'
                                        } ${isExpanded
                                            ? ' opacity-100 mt-1'
                                            : 'max-h-0 opacity-0'
                                        }`}
                                >
                                    {renderSubItems(subItem.subMenu, key)}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        );
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
                    className={`${isOpen ? 'w-[270px]' : 'w-[70px]'
                        } h-screen shrink-0 transition-all duration-200`}
                ></div>
            )}

            {isMobile && !isOpen && (
                <button
                    onClick={toggleSidebar}
                    className={`fixed top-4 z-50 p-2 bg-accent text-white rounded-lg shadow-lg hover:bg-primary-500 transition-colors duration-200 ${isRTL ? 'right-4' : 'left-4'
                        }`}
                    aria-label="Toggle menu"
                >
                    {isOpen ? <HiX size={24} /> : <HiMenuAlt3 size={24} />}
                </button>
            )}

            <div
                className={`flex shrink-0 flex-col sidebar-container
                fixed top-0 h-screen bg-white shadow-xl z-40
                transition-all duration-200 ease-in-out
                ${isOpen ? 'w-[270px]' : 'w-[70px]'}
                ${isRTL
                        ? 'right-0 border-l border-gray-200'
                        : 'left-0 border-r border-gray-200'
                    }
                ${isMobile && !isOpen
                        ? isRTL
                            ? 'translate-x-full'
                            : '-translate-x-full'
                        : 'translate-x-0'
                    }
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
                            className={`transition-all duration-200 overflow-hidden ${isOpen
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

                <nav
                    className="flex-1 p-3 space-y-1 overflow-y-auto custom-scrollbar"
                    tabIndex={0}
                >
                    {sideMenuTabs.map((tab, index) => {
                        const Icon = tab.icon;
                        const title = t(tab.titleKey);
                        const hasSubmenu =
                            tab.subMenu && tab.subMenu.length > 0;
                        const isExpanded = expandedMenus[index];
                        const submenuIsActive =
                            hasSubmenu && isSubmenuActive(tab.subMenu);
                        const active = tab.path ? isActive(tab.path) : false;

                        return (
                            <div key={index} className="space-y-1 relative">
                                <button
                                    onClick={e =>
                                        hasSubmenu
                                            ? toggleSubmenu(index, e)
                                            : handleNavigation(tab.path)
                                    }
                                    className={`
                                        w-full flex items-center gap-1 text-base px-3 py-2.5 rounded-lg transition-all duration-200
                                        group relative
                                        ${isRTL ? 'text-right' : 'text-left'}
                                        ${active || submenuIsActive
                                            ? 'bg-gradient-to-br from-primary-500 to-accent text-white shadow-sm'
                                            : 'text-gray-500 hover:gap-2 hover:text-primary hover:bg-gray-100'
                                        }
                                    `}
                                    aria-label={title}
                                    title={!isOpen ? title : ''}
                                >
                                    <div
                                        className={`
                                        flex items-center justify-center transition-all duration-200 shrink-0
                                        ${active || submenuIsActive
                                                ? 'text-white'
                                                : 'group-hover:scale-105'
                                            }
                                    `}
                                    >
                                        <Icon size={20} />
                                    </div>

                                    <span
                                        className={`
                                        font-medium transition-all duration-200 overflow-hidden whitespace-nowrap flex-1
                                        ${isRTL ? 'text-right' : 'text-left'}
                                        ${isOpen
                                                ? 'opacity-100 max-w-full'
                                                : 'opacity-0 max-w-0'
                                            }
                                        ${active || submenuIsActive
                                                ? 'font-semibold'
                                                : ''
                                            }
                                    `}
                                    >
                                        {title}
                                    </span>

                                    {hasSubmenu && isOpen && (
                                        <div
                                            className={`
                                            transition-transform duration-200 shrink-0
                                            ${isExpanded ? 'rotate-180' : ''}
                                        `}
                                        >
                                            <HiChevronDown size={16} />
                                        </div>
                                    )}

                                    {hasSubmenu && !isOpen && (
                                        <div
                                            className={`
                                            absolute ${isRTL ? 'left-1' : 'right-1'
                                                } top-1/2 -translate-y-1/2
                                            w-1 h-1 rounded-full
                                            ${active || submenuIsActive
                                                    ? 'bg-white'
                                                    : 'bg-primary-500'
                                                }
                                        `}
                                        />
                                    )}
                                </button>

                                {hasSubmenu && isOpen && (
                                    <div
                                        className={`overflow-hidden transition-all duration-300 ease-in-out ${isRTL ? 'pr-4' : 'pl-4'
                                            } ${isExpanded
                                                ? ' opacity-100 mt-1'
                                                : 'max-h-0 opacity-0'
                                            }`}
                                    >
                                        {renderSubItems(
                                            tab.subMenu,
                                            `${index}`
                                        )}
                                    </div>
                                )}

                                {hasSubmenu &&
                                    !isOpen &&
                                    !isMobile &&
                                    hoveredSubmenu === index && (
                                        <div
                                            className={`
                                             floating-submenu fixed z-50 w-56 bg-white shadow-2xl rounded-lg border border-gray-200 py-2
                                             ${isRTL
                                                    ? 'right-[70px]'
                                                    : 'left-[70px]'
                                                }
                                         `}
                                            style={{
                                                top: `${submenuPosition.top}px`
                                            }}
                                        >
                                            <div className="px-3 pb-2 mb-2 border-b border-gray-100">
                                                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                    {title}
                                                </span>
                                            </div>
                                            <div className="space-y-1 px-2">
                                                {tab.subMenu.map(
                                                    (subItem, subIndex) => {
                                                        const SubIcon =
                                                            subItem.icon;
                                                        const subActive =
                                                            isActive(
                                                                subItem.path
                                                            );
                                                        const subTitle = t(
                                                            subItem.titleKey
                                                        );

                                                        return (
                                                            <button
                                                                key={subIndex}
                                                                onClick={() => {
                                                                    handleNavigation(
                                                                        subItem.path
                                                                    );
                                                                    setHoveredSubmenu(
                                                                        null
                                                                    );
                                                                }}
                                                                className={`
                                                            w-full flex items-center gap-3 text-sm px-3 py-2.5 rounded-lg transition-all duration-200
                                                            group
                                                            ${isRTL
                                                                        ? 'text-right'
                                                                        : 'text-left'
                                                                    }
                                                            ${subActive
                                                                        ? 'bg-gradient-to-r from-primary-500 to-accent text-white shadow-sm'
                                                                        : 'text-gray-700 hover:bg-gray-50 hover:text-primary'
                                                                    }
                                                        `}
                                                                aria-label={
                                                                    subTitle
                                                                }
                                                            >
                                                                <div
                                                                    className={`
                                                            flex items-center justify-center transition-all duration-200 shrink-0
                                                            ${subActive
                                                                            ? 'text-white'
                                                                            : 'group-hover:scale-110'
                                                                        }
                                                        `}
                                                                >
                                                                    <SubIcon
                                                                        size={
                                                                            18
                                                                        }
                                                                    />
                                                                </div>

                                                                <span
                                                                    className={`
                                                            font-medium transition-all duration-200 whitespace-nowrap
                                                            ${subActive
                                                                            ? 'font-semibold'
                                                                            : ''
                                                                        }
                                                        `}
                                                                >
                                                                    {subTitle}
                                                                </span>
                                                            </button>
                                                        );
                                                    }
                                                )}
                                            </div>
                                        </div>
                                    )}
                            </div>
                        );
                    })}
                </nav>
                <div className="p-4 w-full self-end border-t border-gray-200">
                    <div
                        className={`
                        flex items-center gap-3 px-3 py-2 text-gray-500 transition-all duration-200 overflow-hidden
                        ${isOpen
                                ? 'opacity-100 max-w-full'
                                : 'opacity-0 max-w-0'
                            }
                    `}
                    >
                        <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse shrink-0" />
                        <span className="text-sm font-medium whitespace-nowrap">
                            {t('sidebar.system_online')}
                        </span>
                    </div>
                </div>
            </div>
        </>
    );
}
