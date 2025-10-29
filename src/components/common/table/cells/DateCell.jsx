import useLanguageStore from '@/utils/stores/language.store';
import React from 'react';

export default function DateCell({ value, fullDate = false }) {
    const isRTL = useLanguageStore(state => state.isRTL);
    const dateObj = new Date(value);

    const formatDate = (date, isFullDate) => {
        if (isFullDate) {
            return {
                date: date.toLocaleDateString(isRTL ? 'ar-EG' : 'en-US', {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                }),
                time: date.toLocaleTimeString(isRTL ? 'ar-EG' : 'en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                })
            };
        }
        return {
            date: date.toLocaleDateString(isRTL ? 'ar-EG' : 'en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
            }),
            time: null
        };
    };

    const { date, time } = formatDate(dateObj, fullDate);

    const now = new Date();
    const diffInDays = Math.floor((now - dateObj) / (1000 * 60 * 60 * 24));

    const getTimeIndicator = daysDiff => {
        if (daysDiff < 0) return { color: 'bg-blue-500', label: 'Future' };
        if (daysDiff === 0) return { color: 'bg-green-500', label: 'Today' };
        if (daysDiff === 1)
            return { color: 'bg-yellow-500', label: 'Yesterday' };
        if (daysDiff < 7) return { color: 'bg-orange-500', label: 'This week' };
        return { color: 'bg-gray-500', label: 'Older' };
    };

    const timeIndicator = getTimeIndicator(diffInDays);

    return (
        <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${timeIndicator.color}`} />

            <div className="flex flex-col">
                <div className="font-medium text-gray-900 text-sm">{date}</div>
                {fullDate && time && (
                    <div className="text-xs text-gray-500">{time}</div>
                )}
                {!fullDate && (
                    <div className="text-xs text-gray-400">
                        {timeIndicator.label}
                    </div>
                )}
            </div>
        </div>
    );
}
