import React from 'react';

const EventTypeCell = ({ value }) => {
    const eventColors = {
        created: 'bg-green-100 text-green-800',
        updated: 'bg-blue-100 text-blue-800',
        deleted: 'bg-red-100 text-red-800'
    };

    const colorClass = eventColors[value] || 'bg-gray-100 text-gray-800';

    return (
        <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}
        >
            {value?.charAt(0).toUpperCase() + value?.slice(1)}
        </span>
    );
};

export default EventTypeCell;
