import Cell from '@/components/common/table/cells/Cell';
import ActiveCell from '@/components/common/table/cells/ActiveCell';
import DateCell from '@/components/common/table/cells/DateCell';
import NameCell from '@/components/common/table/cells/NameCell';
import { createColumnHelper } from '@tanstack/react-table';
import React from 'react';
import { API_KEYS } from '@/api/endpoints';
import i18next from 'i18next';

const columnHelper = createColumnHelper();

export const inspectorAssignmentsColumns = [
    columnHelper.accessor('assignment_type', {
        header: 'table_headers.assignment_type',
        cell: info => (
            <Cell
                withLocale={true}
                value={
                    info.row.original.assignment_type === 'regular'
                        ? 'inspector_assignments.regular'
                        : 'inspector_assignments.committee'
                }
            />
        )
    }),
    columnHelper.accessor('main_program_id', {
        header: 'table_headers.program',
        cell: info => <Cell value={info.row.original.main_program?.name} />
    }),
    columnHelper.accessor('branch_id', {
        header: 'table_headers.branch',
        cell: info => <Cell value={info.row.original.branch?.name} />
    }),
    columnHelper.accessor('entities', {
        header: 'table_headers.entities',
        cell: info => {
            const entities = info.getValue();
            if (!entities || entities.length === 0) return <Cell value="-" />;
            
            // استخراج الأسماء بناءً على اللغة الحالية
            const names = entities.map(e => {
                if (typeof e.name === 'object' && e.name !== null) {
                    return e.name[i18next.language] || e.name.ar || e.name.en;
                }
                return e.name || '';
            }).filter(name => name); // إزالة القيم الفارغة
            
            return <Cell value={names.join(', ') || '-'} />;
        }
    }),
    columnHelper.accessor('supervisors', {
        header: 'table_headers.supervisors',
        cell: info => {
            const supervisors = info.getValue();
            if (!supervisors || supervisors.length === 0) return <Cell value="-" />;
            
            // استخراج الأسماء بناءً على اللغة الحالية
            const names = supervisors.map(s => {
                if (typeof s.name === 'object' && s.name !== null) {
                    return s.name[i18next.language] || s.name.ar || s.name.en;
                }
                return s.name || '';
            }).filter(name => name); // إزالة القيم الفارغة
            
            return <Cell value={names.join(', ') || '-'} />;
        }
    }),
    columnHelper.accessor('from_date', {
        header: 'table_headers.start_date',
        cell: info => <DateCell value={info.getValue()} />
    }),
    columnHelper.accessor('to_date', {
        header: 'table_headers.end_date',
        cell: info => <DateCell value={info.getValue()} />
    }),
    columnHelper.accessor('status', {
        header: 'table_headers.status',
        cell: info => <ActiveCell info={info} />
    }),
    columnHelper.accessor('created_at', {
        header: 'table_headers.created_at',
        cell: info => <DateCell fullDate value={info.getValue()} />,
        enableColumnFilter: false
    })
];

export const inspectorAssignmentsFields = [
    {
        name: 'assignment_type',
        label: 'validation.assignment_type.label',
        type: 'select',
        placeholder: 'validation.assignment_type.placeholder',
        editMode: true,
        viewMode: true
    },
    {
        name: 'main_program_id',
        label: 'validation.main_program_id.label',
        type: 'select',
        placeholder: 'validation.main_program_id.placeholder',
        editMode: true,
        viewMode: true
    },
    {
        name: 'branch_id',
        label: 'validation.branch_id.label',
        type: 'select',
        placeholder: 'validation.branch_id.placeholder',
        editMode: true,
        viewMode: true
    },
    {
        name: 'entity_ids',
        label: 'validation.entity_ids.label',
        type: 'select',
        placeholder: 'validation.entity_ids.placeholder',
        editMode: true,
        viewMode: true
    },
    {
        name: 'supervisor_ids',
        label: 'validation.supervisor_ids.label',
        type: 'select',
        placeholder: 'validation.supervisor_ids.placeholder',
        editMode: true,
        viewMode: true
    },
    {
        name: 'from_date',
        label: 'validation.start_date.label',
        type: 'date',
        placeholder: 'validation.start_date.placeholder',
        editMode: true,
        viewMode: true
    },
    {
        name: 'to_date',
        label: 'validation.end_date.label',
        type: 'date',
        placeholder: 'validation.end_date.placeholder',
        editMode: true,
        viewMode: true
    },
    {
        name: 'notes',
        label: 'validation.notes.label',
        type: 'textarea',
        placeholder: 'validation.notes.placeholder',
        editMode: true,
        viewMode: true
    },
    {
        name: 'status',
        label: 'validation.status.label',
        type: 'select',
        placeholder: 'validation.status.placeholder',
        defaultValue: true,
        editMode: true,
        viewMode: true
    }
];

export const inspectorAssignmentsFilters = [
    {
        name: 'search',
        type: 'text',
        placeholder: 'validation.search.placeholder',
        defaultValue: ''
    },
    {
        name: 'assignment_type',
        type: 'select',
        placeholder: 'validation.assignment_type.placeholder',
        defaultValue: ''
    },
    {
        name: 'branch_id',
        type: 'select',
        placeholder: 'validation.branch_id.placeholder',
        defaultValue: ''
    },
    {
        name: 'status',
        type: 'select',
        placeholder: 'validation.status.placeholder',
        defaultValue: 1
    }
];

export const filtersDefaultValues = {
    status: true,
    search: '',
    assignment_type: '',
    branch_id: ''
};

export const inspectorAssignmentsDefaultValues = {
    status: true,
    assignment_type: 'regular',
    main_program_id: '',
    branch_id: '',
    entity_ids: [],
    supervisor_ids: '', // empty string for regular mode (single select)
    from_date: '',
    to_date: '',
    notes: ''
};

export const apiCalls = [
    API_KEYS.BRANCHES,
    API_KEYS.MAIN_PROGRAMS
];