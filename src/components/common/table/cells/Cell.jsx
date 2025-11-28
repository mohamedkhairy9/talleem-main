import React from 'react';
import i18next from 'i18next';
import useLocale from '@/utils/hooks/global/useLocale';

export default function Cell({ value, withLocale }) {
    const { t } = useLocale();
    if (withLocale) {
        return (
            <div className="text-sm text-gray-700 font-medium">{t(value)}</div>
        );
    } else {
        return (
            <div className="text-sm text-gray-700 font-medium">
                {value !== null && typeof value === 'object'
                    ? value[i18next.language]
                    : value}
            </div>
        );
    }
}
