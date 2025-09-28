import React from 'react'

export default function ProgressCell({ info }) {

    const value = info.getValue();
    const color =
        value >= 80
            ? 'bg-green-500'
            : value >= 60
            ? 'bg-yellow-500'
            : 'bg-red-500';
    const textColor =
        value >= 80
            ? 'text-green-600 bg-green-100'
            : value >= 60
            ? 'text-yellow-600 bg-yellow-100'
            : 'text-red-600 bg-red-100';

    return (
        <div className="flex items-center space-x-2">
            <div className="w-full bg-gray-200 rounded-full h-2 max-w-20">
                <div
                    className={`h-2 rounded-full ${color}`}
                    style={{ width: `${value}%` }}
                />
            </div>
            <span
                className={`text-xs font-medium px-2 py-1 rounded ${textColor}`}
            >
                {value}%
            </span>
        </div> )
}
