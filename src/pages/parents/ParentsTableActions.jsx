import React from 'react';
import { useTranslation } from 'react-i18next';
import { MdPersonAdd } from 'react-icons/md';

export default function ParentsTableActions({ row, toggleModals }) {
    const { t } = useTranslation();

    return (
        <button
            type="button"
            onClick={e => {
                e.stopPropagation();
                toggleModals?.assignStudent?.(row);
            }}
            className="p-1 text-green-600 hover:text-green-800 hover:bg-green-50 rounded transition-colors"
            title={t('parents.assign_student') || 'Assign student'}
        >
            <MdPersonAdd className="w-4 h-4" />
        </button>
    );
}
