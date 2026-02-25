import React, { useState } from 'react';
import { HiCalendar } from 'react-icons/hi';
import useDateFormatStore from '@/utils/stores/dateFormat.store';
import useLocale from '@/utils/hooks/global/useLocale';
import useLanguageStore from '@/utils/stores/language.store';

const FORMAT_OPTIONS = [
    { value: 'gregorian', label: { en: 'Gregorian', ar: 'ميلادي' } },
    { value: 'hijri', label: { en: 'Hijri', ar: 'هجري' } },
    { value: 'hijri_indic', label: { en: 'Hijri (Arabic numerals)', ar: 'هجري (أرقام عربية)' } }
];

export default function DateFormatSwitcher() {
    const { currentLocale } = useLocale();
    const isRTL = useLanguageStore((s) => s.isRTL);
    const { dateFormat: currentFormat, setDateFormat } = useDateFormatStore();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleFormatChange = (format) => {
        setDateFormat(format);
        setIsDropdownOpen(false);
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const currentLabel = FORMAT_OPTIONS.find((o) => o.value === currentFormat)?.label?.[currentLocale] ?? currentFormat;

    return (
        <div className="relative">
            <button
                onClick={toggleDropdown}
                className="relative text-gray-400 size-10 flex items-center justify-center hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                title={currentLocale === 'ar' ? 'تبديل عرض التاريخ (ميلادي / هجري)' : 'Switch date display (Gregorian / Hijri)'}
            >
                <HiCalendar className="h-6 w-6" />
            </button>

            {isDropdownOpen && (
                <>
                    <div
                        className="fixed w-screen h-screen left-0 inset-0 z-[50]"
                        onClick={() => setIsDropdownOpen(false)}
                    />

                    <div className={`absolute ${isRTL ? 'left-0' : 'right-0'} mt-2 w-52 rounded-lg shadow-lg bg-white border border-gray-300 z-[51]`}>
                        <div className="px-3 py-2 border-b border-gray-100">
                            <p className="text-xs font-medium text-gray-500">
                                {currentLocale === 'ar' ? 'عرض التاريخ' : 'Date display'}
                            </p>
                        </div>
                        <div>
                            {FORMAT_OPTIONS.map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => handleFormatChange(option.value)}
                                    className={`flex items-center justify-between w-full px-4 py-2 text-sm transition-colors duration-200 rounded-lg ${
                                        currentFormat === option.value
                                            ? 'bg-primary-50 text-primary-700'
                                            : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                                >
                                    <span className="font-medium">
                                        {option.label[currentLocale] ?? option.label.en}
                                    </span>
                                    {currentFormat === option.value && (
                                        <span className="text-primary-600">✓</span>
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
