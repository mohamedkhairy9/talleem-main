import React, { useState } from 'react';

export default function useIsOpen() {
    const [isOpen, setIsOpen] = useState({
        add: false,
        edit: false,
        delete: false,
        view: false
    });

    const toggle = {
        add: () => setIsOpen({ ...isOpen, add: !isOpen.add }),
        edit: (value) => setIsOpen({ ...isOpen, edit: value || !isOpen.edit }),
        delete: (value) => setIsOpen({ ...isOpen, delete: value || !isOpen.delete }),
        view: (value) => setIsOpen({ ...isOpen, view: value || !isOpen.view })
    };

    return { isOpen, toggle };
}
