import useLocale from '@/utils/hooks/global/useLocale';
import React from 'react';

export default function Btn({
    onClick,
    loading,
    hidden,
    disabled,
    label,
    className = 'w-full',
    loaderSize = 'size-7',
    type
}) {
    const { t } = useLocale();
    if (hidden) return null;
    return (
        <button
            type={type}
            onClick={onClick}
            className={`btn btn-primary ${className}`}
            disabled={disabled || loading}
        >
            {loading && (
                <span
                    className={`${loaderSize} animate-spin shrink-0 rounded-full border-4 border-white border-t-transparent`}
                ></span>
            )}
            {!loading && (
                <span className="text-lg font-medium">{t(label)}</span>
            )}
        </button>
    );
}
