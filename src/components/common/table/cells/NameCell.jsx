import useLocale from '@/utils/hooks/global/useLocale';
import React from 'react';

export default function NameCell({ info, directValue }) {
    const { currentLocale } = useLocale();

    if (!directValue && !info) {
        return null
    }

    // Helper function to get the display value
    const getDisplayValue = () => {
        if (directValue) {
            if (typeof directValue === 'string') {
                return directValue;
            }
            return directValue[currentLocale] || directValue.en || directValue.ar || '';
        }
        if (info) {
            const value = info.getValue();
            if (typeof value === 'string') {
                return value;
            }
            return value?.[currentLocale] || value?.en || value?.ar || '';
        }
        return '';
    };

    // Helper function to get the first character for the avatar
    const getFirstChar = () => {
        const displayValue = getDisplayValue();
        if (!displayValue || typeof displayValue !== 'string') {
            return '?';
        }
        return displayValue.charAt(0) || '?';
    };

    const displayValue = getDisplayValue();

    return (
        <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white uppercase font-bold text-sm">
                    {getFirstChar()}
                </span>
            </div>
            <div>
                <div className="font-semibold text-gray-900">
                    {displayValue || '-'}
                </div>
            </div>
        </div>
    );
}
