import useLocale from '@/utils/hooks/global/useLocale';
import React from 'react';
import { getStatusPresentation } from './statusPresentation';

export default function ActiveCell({ value = null, info = null }) {
    const { t } = useLocale();
    const status = value ?? info?.getValue();
    const presentation = getStatusPresentation(status);

    return (
        <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${presentation.dotClassName}`} />
            <span
                className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${presentation.className}`}
            >
                {presentation.labelKey ? t(presentation.labelKey) : presentation.label}
            </span>
        </div>
    );
}
