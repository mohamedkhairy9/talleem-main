import React from 'react';

// Simple wrapper for modal content - provides scrolling for content without ModalContent/ModalFooter
export default function ModalBody({ children }) {
    const childrenArray = React.Children.toArray(children);
    
    // Check if using new structure (ModalContent/ModalFooter)
    const hasModalStructure = childrenArray.some(child => {
        if (!React.isValidElement(child)) return false;
        
        // Check if it's ModalContent or form with flex-col h-full
        if (child.type?.name === 'ModalContent' || child.type?.displayName === 'ModalContent') {
            return true;
        }
        
        // Check if form has the new structure classes
        if (child.type === 'form' && child.props?.className?.includes('flex-col') && child.props?.className?.includes('h-full')) {
            return true;
        }
        
        return false;
    });

    // If using new structure, return as is
    if (hasModalStructure) {
        return <>{children}</>;
    }

    // Otherwise, wrap in scrollable container for old forms
    return (
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
            {children}
        </div>
    );
}


