import React from 'react';

export default function RoleCell({ info } = {}) {
    const role = info.row.original.display_name
    const KEY = info.row.original.name?.toLowerCase()?.replace(' ', '_');
    const roleColors = {
        administration: 'bg-red-100 text-red-800 border-red-200',
        branch_manager: 'bg-purple-100 text-purple-800 border-purple-200',
        entity_manager: 'bg-blue-100 text-blue-800 border-blue-200',
        teacher: 'bg-green-100 text-green-800 border-green-200',
        parent: 'bg-sky-100 text-sky-800 border-sky-200',
        guest: 'bg-gray-100 text-gray-800 border-gray-200',
    };
    return (
        <span
            className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${
                roleColors[KEY] || roleColors.user
            }`}
        >
            {role.charAt(0).toUpperCase() + role.slice(1)}
        </span>
    );
}
