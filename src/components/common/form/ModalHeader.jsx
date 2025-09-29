import useLocale from '@/utils/hooks/global/useLocale';
import React from 'react';

export default function ModalHeader({ onClose, header }) {
    const { t, currentLocale } = useLocale();
    console.log('currentLocale', currentLocale);

    return (
        <div className="flex p-5 border-b border-gray-300 justify-between items-center mb-4">
            <h2 id="modal-title" className="text-xl font-semibold text-primary">
                {t(header)}
            </h2>
            <button
                onClick={() => onClose(false)}
                className="text-destructive hover:text-red-600 text-4xl duration-200 leading-none"
            >
                ×
            </button>
        </div>
    );
}
