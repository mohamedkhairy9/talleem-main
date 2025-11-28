import React from 'react';

export default function EnabledCell({ isEnabled }) {
    return (
        <div className="flex items-center space-x-2">
            <div
                className={`w-2 h-2 rounded-full ${
                    isEnabled ? 'bg-green-500' : 'bg-red-500'
                }`}
            />
            <span
                className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${
                    isEnabled
                        ? 'bg-green-100 text-green-800 border-green-200'
                        : 'bg-red-100 text-red-800 border-red-200'
                }`}
            >
                {isEnabled ? 'Enabled' : 'Disabled'}
            </span>
        </div>
    );
}
