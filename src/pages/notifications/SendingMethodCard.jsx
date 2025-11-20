import React from 'react';

export default function SendingMethodCard({ method, selected, onToggle, t }) {
    return (
        <div
            onClick={onToggle}
            className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all ${
                selected
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
            }`}
        >
            <input
                type="checkbox"
                checked={selected}
                onChange={() => {}}
                className="absolute top-3 right-3"
            />
            <div className="text-center">
                <div className="text-2xl mb-2">{method.icon}</div>
                <div className="font-medium">{t(method.labelKey)}</div>
            </div>
        </div>
    );
}