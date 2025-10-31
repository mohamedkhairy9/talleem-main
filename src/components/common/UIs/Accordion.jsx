import React from 'react';

export default function Accordion({ title, open = false, onToggle, children }) {
    return (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
            <button
                type="button"
                onClick={onToggle}
                className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 flex items-center justify-between transition-colors"
            >
                <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
                <svg
                    className={`w-5 h-5 text-gray-600 transform transition-transform ${
                        open ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                    />
                </svg>
            </button>
            {open && <div className="p-4 space-y-4">{children}</div>}
        </div>
    );
}
