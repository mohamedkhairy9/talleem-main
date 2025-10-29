import React from 'react';
import i18next from 'i18next';

export default function Cell({ value }) {
    return (
        <div className="text-sm text-gray-700 font-medium">
            {typeof value === 'object' ? value[i18next.language] : value}
        </div>
    );
}
