import React, { useState } from 'react';

export default function useIsOpen() {
    const [isOpen, setIsOpen] = useState({
        add: false,
        edit: false,
        delete: false,
        view: false,
        assignPermission: false,
        removePermission: false,
        trigger: false,
        schedule: false
    });

    const toggle = {
        add: () => setIsOpen({ ...isOpen, add: !isOpen.add }),
        edit: value => setIsOpen({ ...isOpen, edit: value || !isOpen.edit }),
        delete: value =>
            setIsOpen({ ...isOpen, delete: value || !isOpen.delete }),
        view: value => setIsOpen({ ...isOpen, view: value || !isOpen.view }),
        assignPermission: value =>
            setIsOpen({
                ...isOpen,
                assignPermission: value || !isOpen.assignPermission
            }),
        removePermission: value =>
            setIsOpen({
                ...isOpen,
                removePermission: value || !isOpen.removePermission
            }),
        trigger: value =>
            setIsOpen({ ...isOpen, trigger: value || !isOpen.trigger }),
        schedule: value =>
            setIsOpen({ ...isOpen, schedule: value || !isOpen.schedule })
    };

    return { isOpen, toggle };
}
