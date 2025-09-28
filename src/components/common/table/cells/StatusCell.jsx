import React from 'react';

export default function StatusCell({ info }) {
    const status = info.getValue();
    const statusColors = {
        active: 'bg-green-100 text-green-800 border-green-200',
        inactive: 'bg-red-100 text-red-800 border-red-200',
        pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        archived: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    const dotColor = {
        active: 'bg-green-500',
        inactive: 'bg-red-500',
        pending: 'bg-yellow-500',
        archived: 'bg-gray-500'
    };
    return (
        <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${dotColor[status]}`} />
            <span
                className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${
                    statusColors[status] || statusColors.pending
                }`}
            >
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        </div>
    );
}
