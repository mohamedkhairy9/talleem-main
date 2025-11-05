import { API_KEYS } from '@/api/endpoints';
import Cell from '@/components/common/table/cells/Cell';
import ActiveCell from '@/components/common/table/cells/ActiveCell';
import DateCell from '@/components/common/table/cells/DateCell';
import NameCell from '@/components/common/table/cells/NameCell';
import { createColumnHelper } from '@tanstack/react-table';
import React from 'react';

const columnHelper = createColumnHelper();

export const entitiesColumns = [
    columnHelper.accessor('name', {
        header: 'table_headers.name',
        cell: info => <NameCell directValue={info.row.original.name} />
    }),
    columnHelper.accessor('email', {
        header: 'table_headers.email',
        cell: info => <Cell value={info.getValue()} />
    }),
    columnHelper.accessor('phone', {
        header: 'table_headers.phone',
        cell: info => <Cell value={info.getValue()} />
    }),
    columnHelper.accessor('branch', {
        header: 'table_headers.branch',
        cell: info => <Cell value={info.row.original.branch} />
    }),
    columnHelper.accessor('main_program', {
        header: 'table_headers.main_program',
        cell: info => <Cell value={info.row.original.main_program} />
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

export const entitiesFields = [
    {
        name: 'name.en',
        label: 'validation.entity_name.label.en',
        type: 'text',
        placeholder: 'validation.entity_name.placeholder.en',
        editMode: true,
        viewMode: true
    },
    {
        name: 'name.ar',
        label: 'validation.entity_name.label.ar',
        type: 'text',
        placeholder: 'validation.name.placeholder.ar',
        editMode: true,
        viewMode: true
    },
    {
        name: 'status',
        label: 'validation.status.label',
        type: 'select',
        placeholder: 'validation.status.placeholder',
        defaultValue: 'active',
        editMode: true,
        viewMode: true
    },
    {
        name: 'city_id',
        label: 'validation.city_id.label',
        type: 'select',
        placeholder: 'validation.city_id.placeholder',
        editMode: true,
        viewMode: true
    },
    {
        name: 'neighborhood_id',
        label: 'validation.neighborhood_id.label',
        type: 'select',
        placeholder: 'validation.neighborhood_id.placeholder',
        editMode: true,
        viewMode: true,
        info: 'info.neighborhood_id'
    },
    {
        name: 'branch_id',
        label: 'validation.branch_id.label',
        type: 'select',
        placeholder: 'validation.branch_id.placeholder',
        editMode: true,
        viewMode: true,
        info: 'info.branch_id'
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
        name: 'education_program_entity_type_classification',
        label: 'validation.education_program_entity_type_classification.label',
        type: 'select',
        placeholder:
            'validation.education_program_entity_type_classification.placeholder',
        editMode: true,
        viewMode: true,
        conditional: true,
        showWhen: { main_program_id: 1 }
    },
    {
        name: 'entity_category_id',
        label: 'validation.entity_category_id.label',
        type: 'select',
        placeholder: 'validation.entity_category_id.placeholder',
        editMode: true,
        viewMode: true,
        conditional: true,
        showWhen: { main_program_id: [1, 2] }
    },
    {
        name: 'location_type_id',
        label: 'validation.location_type_id.label',
        type: 'select',
        placeholder: 'validation.location_type_id.placeholder',
        editMode: true,
        viewMode: true
    },

    {
        name: 'min_acceptance_age',
        label: 'validation.min_acceptance_age.label',
        type: 'number',
        placeholder: 'validation.min_acceptance_age.placeholder',
        editMode: true,
        viewMode: true
    },
    {
        name: 'phone',
        label: 'validation.phone.label',
        type: 'text',
        placeholder: 'validation.phone.placeholder',
        editMode: true,
        viewMode: true
    },
    {
        name: 'email',
        label: 'validation.email.label',
        type: 'email',
        placeholder: 'validation.email.placeholder',
        editMode: true,
        viewMode: true
    },
    {
        name: 'address',
        label: 'validation.address.label',
        type: 'textarea',
        placeholder: 'validation.address.placeholder',
        editMode: true,
        viewMode: true
    },
    {
        name: 'area',
        label: 'validation.area.label',
        type: 'text',
        placeholder: 'validation.area.placeholder',
        editMode: true,
        viewMode: true
    },
    {
        name: 'class_count',
        label: 'validation.class_count.label',
        type: 'number',
        placeholder: 'validation.class_count.placeholder',
        editMode: true,
        viewMode: true
    },
    {
        name: 'management_rooms_count',
        label: 'validation.management_rooms_count.label',
        type: 'number',
        placeholder: 'validation.management_rooms_count.placeholder',
        editMode: true,
        viewMode: true
    },
    {
        name: 'lecture_holes_count',
        label: 'validation.lecture_holes_count.label',
        type: 'number',
        placeholder: 'validation.lecture_holes_count.placeholder',
        editMode: true,
        viewMode: true
    },
    {
        name: 'activity_ids',
        label: 'validation.activity_ids.label',
        type: 'select',
        placeholder: 'validation.activity_ids.placeholder',
        editMode: true,
        viewMode: true,
        isMulti: true
    },
    {
        name: 'registration_date',
        label: 'validation.registration_date.label',
        type: 'date',
        placeholder: 'validation.registration_date.placeholder',
        editMode: true,
        viewMode: true
    },
    {
        name: 'license_number',
        label: 'validation.license_number.label',
        type: 'text',
        placeholder: 'validation.license_number.placeholder',
        editMode: true,
        viewMode: true
    },
    {
        name: 'files',
        label: 'validation.files.label',
        type: 'file',
        placeholder: 'validation.files.placeholder',
        editMode: true,
        viewMode: true,
        multiple: true
    }
];

export const managerFields = [
    {
        name: 'manager.name.en',
        label: 'validation.name.label.en',
        type: 'text',
        placeholder: 'validation.name.placeholder.en',
        editMode: true,
        viewMode: true,
        section: 'manager'
    },
    {
        name: 'manager.name.ar',
        label: 'validation.name.label.ar',
        type: 'text',
        placeholder: 'validation.name.placeholder.ar',
        editMode: true,
        viewMode: true,
        section: 'manager'
    },
    {
        name: 'manager.status',
        label: 'validation.status.label',
        type: 'select',
        placeholder: 'validation.status.placeholder',
        defaultValue: true,
        editMode: true,
        viewMode: true,
        section: 'manager'
    },
    {
        name: 'manager.manager_email',
        label: 'validation.manager_email.label',
        type: 'email',
        placeholder: 'validation.manager_email.placeholder',
        editMode: true,
        viewMode: true,
        section: 'manager'
    },
    {
        name: 'manager.manager_phone',
        label: 'validation.manager_phone.label',
        type: 'text',
        placeholder: 'validation.manager_phone.placeholder',
        editMode: true,
        viewMode: true,
        section: 'manager'
    },
    {
        name: 'manager.national_id',
        label: 'validation.national_id.label',
        type: 'text',
        placeholder: 'validation.national_id.placeholder',
        editMode: true,
        viewMode: true,
        section: 'manager'
    },
    {
        name: 'manager.gender',
        label: 'validation.gender.label',
        type: 'select',
        placeholder: 'validation.gender.placeholder',
        editMode: true,
        viewMode: true,
        section: 'manager'
    },
    {
        name: 'manager.nationality_id',
        label: 'validation.nationality_id.label',
        type: 'select',
        placeholder: 'validation.nationality_id.placeholder',
        editMode: true,
        viewMode: true,
        section: 'manager'
    },
    {
        name: 'manager.city_id',
        label: 'validation.city_id.label',
        type: 'select',
        placeholder: 'validation.city_id.placeholder',
        editMode: true,
        viewMode: true,
        section: 'manager'
    },
    {
        name: 'manager.academic_qualification_id',
        label: 'validation.academic_qualification_id.label',
        type: 'select',
        placeholder: 'validation.academic_qualification_id.placeholder',
        editMode: true,
        viewMode: true,
        section: 'manager'
    },
    {
        name: 'manager.specification_id',
        label: 'validation.specification_id.label',
        type: 'select',
        placeholder: 'validation.specification_id.placeholder',
        editMode: true,
        viewMode: true,
        section: 'manager'
    },
    {
        name: 'manager.date_of_birth',
        label: 'validation.date_of_birth.label',
        type: 'date',
        placeholder: 'validation.date_of_birth.placeholder',
        editMode: true,
        viewMode: true,
        section: 'manager'
    },
    {
        name: 'manager.address',
        label: 'validation.address.label',
        type: 'textarea',
        placeholder: 'validation.address.placeholder',
        editMode: true,
        viewMode: true,
        section: 'manager'
    },
    {
        name: 'manager.memorization_amount',
        label: 'validation.memorization_amount.label',
        type: 'text',
        placeholder: 'validation.memorization_amount.placeholder',
        editMode: true,
        viewMode: true,
        section: 'manager'
    },
    {
        name: 'manager.years_of_experience',
        label: 'validation.years_of_experience.label',
        type: 'number',
        placeholder: 'validation.years_of_experience.placeholder',
        editMode: true,
        viewMode: true,
        section: 'manager'
    },
    {
        name: 'manager.profile_image',
        label: 'validation.profile_image.label',
        type: 'file',
        placeholder: 'validation.profile_image.placeholder',
        editMode: true,
        viewMode: true,
        accept: 'image/*',
        section: 'manager'
    },
    {
        name: 'manager.files',
        label: 'validation.files.label',
        type: 'file',
        placeholder: 'validation.files.placeholder',
        editMode: true,
        viewMode: true,
        multiple: true,
        section: 'manager'
    }
];

export const entitiesDefaultValues = {
    status: 'active',
    name: {
        en: '',
        ar: ''
    },
    activities: [],
    class_count: 0,
    management_rooms_count: 0,
    lecture_holes_count: 0,
    min_acceptance_age: 1,
    manager: {
        status: true
    }
};

export const entitiesFilters = [
    {
        name: 'search',
        type: 'text',
        placeholder: 'validation.search.placeholder',
        defaultValue: ''
    },
    {
        name: 'status',
        type: 'select',
        placeholder: 'validation.status.placeholder',
        defaultValue: 'active'
    }
];

export const filtersDefaultValues = {
    status: 'active',
    search: ''
};

export const apiCalls = [
    API_KEYS.BRANCHES,
    API_KEYS.MAIN_PROGRAMS,
    API_KEYS.EDUCATION_PROGRAM_ENTITY_TYPES,
    API_KEYS.MEMORIZATION_PROGRAM_ENTITY_TYPES,
    API_KEYS.CITIES,
    API_KEYS.NEIGHBORHOODS,
    API_KEYS.LOCATION_TYPES,
    API_KEYS.USERS,
    API_KEYS.ACTIVITIES,
    API_KEYS.NATIONALITIES,
    API_KEYS.ACADEMIC_LEVELS,
    API_KEYS.SPECIFICATIONS,
    API_KEYS.ACADEMIC_QUALIFICATIONS
];
