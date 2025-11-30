import React from 'react';

export default function ModalFooter({ children, className = '' }) {
    return (
        <div className={`flex-shrink-0 sticky bottom-0 z-10 bg-white border-t border-gray-300 p-4 rounded-b-lg ${className}`}>
            {children}
        </div>
    );
}


