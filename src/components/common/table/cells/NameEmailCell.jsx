import React from 'react';

export default function NameEmailCell({ info }) {
    const row = info.row.original;
    const initials = info
        .getValue()
        .split(' ')
        .map(n => n[0])
        .join('');

    return (
        <div className="flex items-center space-x-3">
            <div className="w-8 h-8 uppercase bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                {initials}
            </div>
            <div>
                <div className="font-medium text-gray-900">
                    {info.getValue()}
                </div>
                <div className="text-sm text-gray-500">{row.email}</div>
            </div>
        </div>
    );
}
