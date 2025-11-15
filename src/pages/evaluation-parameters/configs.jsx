import ActiveCell from '@/components/common/table/cells/ActiveCell';
import Cell from '@/components/common/table/cells/Cell';
import DateCell from '@/components/common/table/cells/DateCell';
import NameCell from '@/components/common/table/cells/NameCell';
import { createColumnHelper } from '@tanstack/react-table';
import React from 'react';
import { API_KEYS } from '@/api/endpoints';

const columnHelper = createColumnHelper();

export const evaluationParametersColumns = [
    columnHelper.accessor('name_display', {
        header: 'table_headers.name',
        cell: info => <NameCell directValue={info.getValue()} />
    }),
    columnHelper.accessor('program_name', {
        header: 'table_headers.program',
        cell: info => <Cell value={info.getValue()} />
    }),
    columnHelper.accessor('evaluation_for_display', {
        header: 'table_headers.evaluation_for',
        cell: info => <Cell value={info.getValue()} />
    }),
    columnHelper.accessor('total_grade', {
        header: 'table_headers.total_grade',
        cell: info => <Cell value={info.getValue()} />
    }),
    columnHelper.accessor('is_active', {
        header: 'table_headers.status',
        cell: info => <ActiveCell info={info} customKey="is_active" />
    }),
    columnHelper.accessor('created_at', {
        header: 'table_headers.created_at',
        cell: info => <DateCell fullDate value={info.getValue()} />,
        enableColumnFilter: false
    })
];

// Role Options (used for evaluation_for, dashboards, receivers)
export const roleOptions = [
    {
        value: 'student',
        label: {
            en: 'Student',
            ar: 'الطالب'
        }
    },
    {
        value: 'teacher',
        label: {
            en: 'Teacher',
            ar: 'المعلم'
        }
    },
    {
        value: 'entity',
        label: {
            en: 'Entity',
            ar: 'الجهة'
        }
    },
    {
        value: 'guest',
        label: {
            en: 'Guest',
            ar: 'الزائر'
        }
    },
    {
        value: 'employee',
        label: {
            en: 'Employee',
            ar: 'الموظف'
        }
    },
    {
        value: 'super-admin',
        label: {
            en: 'Super Admin',
            ar: 'المسؤول الرئيسي'
        }
    },
    {
        value: 'parent',
        label: {
            en: 'Parent',
            ar: 'ولي الأمر'
        }
    }
];

// Evaluation System Options
export const evaluationSystemOptions = [
    { 
        value: 'percentage',
        label: {
            en: 'Percentage',
            ar: 'مئوي'
        }
    },
    { 
        value: 'numeric',
        label: {
            en: 'Numeric',
            ar: 'رقمي'
        }
    }
];

// Simple Fields Configuration (only name fields - is_active will be handled separately)
export const simpleFields = [
    {
        name: 'name.en',
        label: 'validation.name.label.en',
        type: 'text',
        placeholder: 'validation.name.placeholder.en',
        editMode: true,
        viewMode: true
    },
    {
        name: 'name.ar',
        label: 'validation.name.label.ar',
        type: 'text',
        placeholder: 'validation.name.placeholder.ar',
        editMode: true,
        viewMode: true
    }
];

// Criteria Fields Configuration
export const criteriaFields = [
    {
        name: 'criteria_name.en',
        label: 'validation.criteria_name.label.en',
        type: 'text',
        placeholder: 'validation.criteria_name.placeholder.en'
    },
    {
        name: 'criteria_name.ar',
        label: 'validation.criteria_name.label.ar',
        type: 'text',
        placeholder: 'validation.criteria_name.placeholder.ar'
    },
    {
        name: 'degree',
        label: 'validation.degree.label',
        type: 'number',
        placeholder: 'validation.degree.placeholder'
    }
];

export const evaluationParametersFilters = [
    {
        name: 'search',
        type: 'text',
        placeholder: 'validation.search.placeholder',
        defaultValue: ''
    },
    {
        name: 'main_program_id',
        type: 'select',
        placeholder: 'validation.program.placeholder',
        defaultValue: ''
    },
    {
        name: 'is_active',
        type: 'select',
        placeholder: 'validation.status.placeholder',
        defaultValue: 1
    }
];

export const filtersDefaultValues = {
    is_active: true,
    search: '',
    main_program_id: ''
};

export const evaluationParametersDefaultValues = {
    is_active: true,
    criteria: [{ criteria_name: { en: '', ar: '' }, degree: '' }]
};

// API Calls Configuration
export const apiCalls = [ API_KEYS.MAIN_PROGRAMS];