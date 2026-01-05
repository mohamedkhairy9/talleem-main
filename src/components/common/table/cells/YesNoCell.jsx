import useLocale from '@/utils/hooks/global/useLocale';
import React from 'react';

export default function YesNoCell({ value = null, info = null }) {
    const { t } = useLocale();
    const status = value || info?.getValue();
    const statusColors = {
        true: 'bg-green-100 text-green-800 border-green-200',
        false: 'bg-red-100 text-red-800 border-red-200',
        1: 'bg-green-100 text-green-800 border-green-200',
        0: 'bg-red-100 text-red-800 border-red-200'
    };
    const dotColor = {
        1: 'bg-green-500',
        true: 'bg-green-500',
        0: 'bg-red-500',
        false: 'bg-red-500'
    };
    return (
        <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${dotColor[status]}`} />
            <span
                className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${
                    statusColors[status] || statusColors.false
                }`}
            >
                {status ? t('common.yes') : t('common.no')}
            </span>
        </div>
    );
}

