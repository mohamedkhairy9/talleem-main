import useLocale from '@/utils/hooks/global/useLocale';
import React from 'react';

export default function NameCell({ info, directValue }) {
    console.log('directValue', directValue);
    console.log('info', info);

    const { currentLocale } = useLocale();
    return (
        <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white uppercase font-bold text-sm">
                    {directValue
                        ? typeof directValue === 'string'
                            ? directValue.charAt(0)
                            : directValue[currentLocale].charAt(0)
                        : info.getValue().charAt(0)}
                </span>
            </div>
            <div>
                <div className="font-semibold text-gray-900">
                    {directValue
                        ? typeof directValue === 'string'
                            ? directValue
                            : directValue[currentLocale]
                        : info.getValue()[currentLocale] || ''}
                </div>
            </div>
        </div>
    );
}
