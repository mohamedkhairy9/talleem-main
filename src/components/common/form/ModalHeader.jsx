import useLocale from '@/utils/hooks/global/useLocale';
import React from 'react';

export default function ModalHeader({ onClose, header }) {
    const { t, currentLocale } = useLocale();

    return (
        <div className="flex-shrink-0 sticky top-0 z-10 flex p-5 bg-white border-b border-gray-300 rounded-t-lg justify-between items-center">
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
