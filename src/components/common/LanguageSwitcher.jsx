import React, { useState, useEffect } from 'react';
import { HiTranslate } from 'react-icons/hi';
import useLanguageStore from '@/utils/stores/language.store';

export default function LanguageSwitcher() {
    const { language: currentLocale, setLanguage } = useLanguageStore();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const languages = [
        { code: 'en', name: 'English' },
        { code: 'ar', name: 'العربية' }
    ];

    const handleLanguageChange = languageCode => {
        try {
            setLanguage(languageCode);
            setIsDropdownOpen(false);
        } catch (error) {
            console.error('Error switching language:', error);
        }
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    useEffect(() => {
        const { initializeLanguage } = useLanguageStore.getState();
        initializeLanguage();
    }, []);

    return (
        <div className="relative">
            <button
                onClick={toggleDropdown}
                className="relative text-gray-400 size-10 flex items-center justify-center hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                title="Change Language"
            >
                <HiTranslate className="h-6 w-6" />
            </button>

            {isDropdownOpen && (
                <>
                    <div
                        className="fixed w-screen h-screen left-0 inset-0 z-[50]"
                        onClick={() => setIsDropdownOpen(false)}
                    />

                    <div className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg bg-white border border-gray-300 z-[51]">
                        <div className="">
                            {languages.map(language => (
                                <button
                                    key={language.code}
                                    onClick={() =>
                                        handleLanguageChange(language.code)
                                    }
                                    className={`flex items-center rounded-lg justify-between w-full px-4 py-2 text-sm transition-colors duration-200 ${
                                        currentLocale === language.code
                                            ? 'bg-primary-50 text-primary-700'
                                            : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                                >
                                    <span className="font-medium">
                                        {language.name}
                                    </span>
                                    {currentLocale === language.code && (
                                        <span className=" text-primary-600">
                                            ✓
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
