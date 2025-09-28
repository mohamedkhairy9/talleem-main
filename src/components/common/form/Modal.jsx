import React, { useEffect, useRef } from 'react';

const Modal = ({
    isOpen=true,
    setIsOpen,
    children,
    closeOnBackdrop = true,
    closeOnEscape = true,
    size = 'md' // xs, sm, md, lg, xl, full
}) => {
    const modalRef = useRef(null);
    const backdropRef = useRef(null);

    // Size classes
    const sizeClasses = {
        xs: 'max-w-xs',
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        full: 'max-w-none w-full h-full'
    };

    // Handle backdrop click
    const handleBackdropClick = e => {
        if (closeOnBackdrop && e.target === backdropRef.current) {
            setIsOpen(false);
        }
    };

    // Handle escape key
    useEffect(() => {
        const handleEscape = e => {
            if (closeOnEscape && e.key === 'Escape' && isOpen) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            // Prevent body scroll
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, closeOnEscape, setIsOpen]);

    useEffect(() => {
        if (isOpen && modalRef.current) {
            const focusableElements = modalRef.current.querySelectorAll(
                'input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );

            if (focusableElements.length > 0) {
                focusableElements[0].focus();
            }
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div
            ref={backdropRef}
            className="fixed h-screen inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-all duration-300 ease-out"
            onClick={handleBackdropClick}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
        >
            <div
                ref={modalRef}
                className={`
          relative overflow-y-auto w-full ${sizeClasses[size]} 
          bg-white rounded-lg shadow-2xl 
          transform transition-all duration-300 ease-out
          animate-in fade-in zoom-in-95
          max-h-[90vh] overflow-hidden
          ${size === 'full' ? 'h-full' : ''}
        `}
                onClick={e => e.stopPropagation()}
            >
                {children}
            </div>
        </div>
    );
};

export default Modal;
