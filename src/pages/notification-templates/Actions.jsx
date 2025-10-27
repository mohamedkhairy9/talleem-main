import React from 'react';
import { MdNotificationsActive, MdSchedule } from 'react-icons/md';
import useLocale from '@/utils/hooks/global/useLocale';

export default function Actions({ row, toggleModals }) {
    const { t } = useLocale();

    return (
        <>
            <button
                onClick={e => {
                    e.stopPropagation();
                    toggleModals?.trigger(row);
                }}
                className="p-1 text-green-600 hover:text-green-800 hover:bg-green-50 rounded transition-colors"
                title={t('notifications.trigger')}
            >
                <MdNotificationsActive className="w-4 h-4" />
            </button>
            <button
                onClick={e => {
                    e.stopPropagation();
                    toggleModals?.schedule(row);
                }}
                className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                title={t('notifications.schedule')}
            >
                <MdSchedule className="w-4 h-4" />
            </button>
        </>
    );
}
