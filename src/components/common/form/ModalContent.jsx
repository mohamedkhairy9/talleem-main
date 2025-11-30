import React from 'react';

export default function ModalContent({ children, className = '' }) {
    return (
        <div className={`flex-1 overflow-y-auto overflow-x-hidden p-4 ${className}`}>
            {children}
        </div>
    );
}


