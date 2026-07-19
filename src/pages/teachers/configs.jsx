import Cell from '@/components/common/table/cells/Cell';
import ActiveCell from '@/components/common/table/cells/ActiveCell';
import DateCell from '@/components/common/table/cells/DateCell';
import NameCell from '@/components/common/table/cells/NameCell';
import { createColumnHelper } from '@tanstack/react-table';
import React from 'react';
import { getMaxDateForMinAge, getTodayDate } from '@/utils/helpers/dateHelpers';

const columnHelper = createColumnHelper();

export const teacherLicenseFilterOptions = [
    {
        label: { ar: '\u0645\u0631\u062e\u0635', en: 'Licensed' },
        value: 'licensed'
    },
    {
        label: { ar: '\u063a\u064a\u0631 \u0645\u0631\u062e\u0635', en: 'Unlicensed' },
        value: 'unlicensed'
    }
];

export const teachersColumns = [
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
    columnHelper.accessor('gender', {
        header: 'table_headers.gender',
        cell: info => <Cell value={info.getValue()} />
    }),
    columnHelper.accessor('license_number', {
        header: 'table_headers.license_number',
        cell: info => <Cell value={info.getValue()} />
    }),

    columnHelper.accessor('main_program', {
        header: 'table_headers.main_program',
        cell: info => <Cell value={info.row.original.main_program} />
    }),
    columnHelper.accessor('status', {
        header: 'table_headers.status',
        cell: info => <ActiveCell info={info} />
    }),
    columnHelper.accessor('registration_date', {
        header: 'table_headers.registration_date',
        cell: info => <DateCell fullDate value={info.getValue()} />,
        enableColumnFilter: false
    })
];

export const teachersFields = [
    // Right Column - Primary Information
    {
        name: 'name.ar',
        label: 'validation.name.label.ar',
        type: 'text',
        placeholder: 'validation.name.placeholder.ar',
        editMode: true,
        viewMode: true
    },
    {
        name: 'name.en',
        label: 'validation.name.label.en',
        type: 'text',
        placeholder: 'validation.name.placeholder.en',
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
        name: 'entry_type',
        label: 'validation.entry_type.label',
        type: 'select',
        placeholder: 'validation.entry_type.placeholder',
        editMode: false,
        viewMode: false
    },
    {
        name: 'license_number',
        label: 'validation.license_number.label',
        type: 'text',
        placeholder: 'validation.license_number.placeholder',
        editMode: true,
        viewMode: true,
        conditional: true,
        showWhen: { entry_type: 'active_with_license' }
    },
    {
        name: 'license_image',
        label: 'validation.license_image.label',
        type: 'file',
        placeholder: 'validation.license_image.placeholder',
        editMode: true,
        viewMode: true,
        conditional: true,
        showWhen: { entry_type: 'active_with_license' },
        accept: 'image/*,.pdf,.PDF'
    },
    {
        name: 'license_issue_date',
        label: 'validation.license_issue_date.label',
        type: 'date',
        placeholder: 'validation.license_issue_date.placeholder',
        editMode: true,
        viewMode: true,
        conditional: true,
        showWhen: { entry_type: 'active_with_license' },
        max: getTodayDate()
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
        name: 'city_id',
        label: 'validation.city_id.label',
        type: 'select',
        placeholder: 'validation.city_id.placeholder',
        editMode: true,
        viewMode: true
    },
    {
        name: 'branch_id',
        label: 'validation.branch_id.label',
        type: 'select',
        placeholder: 'validation.branch_id.placeholder',
        info: 'info.branch_id',
        editMode: true,
        viewMode: true
    },
    {
        name: 'entity_ids',
        label: 'validation.entity_ids.label',
        type: 'select',
        placeholder: 'validation.entity_ids.placeholder',
        editMode: true,
        viewMode: true,
        isMulti: true
    },

    {
        name: 'education_program_entity_type_classification',
        label: 'validation.education_program_entity_type_classification.label',
        type: 'text',
        placeholder: 'validation.education_program_entity_type_classification.placeholder',
        editMode: true,
        viewMode: true,
        conditional: true,
        showWhen: { main_program_id: 1 },
        readOnly: true
    },
    {
        name: 'entity_category_id',
        label: 'validation.entity_category_id.label',
        type: 'text',
        placeholder: 'validation.entity_category_id.placeholder',
        info: 'info.entity_type',
        editMode: true,
        viewMode: true,
        conditional: true,
        showWhen: { main_program_id: [1, 2] },
        readOnly: true
    },
    {
        name: 'nationality_id',
        label: 'validation.nationality_id.label',
        type: 'select',
        placeholder: 'validation.nationality_id.placeholder',
        editMode: true,
        viewMode: true
    },
    {
        name: 'academic_qualification_id',
        label: 'validation.academic_qualification_id.label',
        type: 'select',
        placeholder: 'validation.academic_qualification_id.placeholder',
        editMode: true,
        viewMode: true
    },
    {
        name: 'major_id',
        label: 'validation.major_id.label',
        type: 'select',
        placeholder: 'validation.major_id.placeholder',
        editMode: true,
        viewMode: true
    },
    {
        name: 'dob',
        label: 'validation.dob.label',
        type: 'date',
        placeholder: 'validation.dob.placeholder',
        editMode: true,
        viewMode: true,
        max: getMaxDateForMinAge(18),
        min: getMaxDateForMinAge(80)
    },
    {
        name: 'years_of_experience',
        label: 'validation.years_of_experience.label',
        type: 'number',
        placeholder: 'validation.years_of_experience.placeholder',
        editMode: true,
        viewMode: true
    },
    {
        name: 'memorization_amount',
        label: 'validation.memorization_amount.label',
        type: 'text',
        placeholder: 'validation.memorization_amount.placeholder',
        editMode: true,
        viewMode: true
    },
    // Left Column - Additional Information
    {
        name: 'profile_image',
        label: 'validation.profile_picture.label',
        type: 'file',
        placeholder: 'validation.profile_picture.placeholder',
        editMode: true,
        viewMode: true,
        accept: 'image/*'
    },
    {
        name: 'registration_date',
        label: 'validation.registration_date.label',
        type: 'date',
        placeholder: 'validation.registration_date.placeholder',
        editMode: true,
        viewMode: true,
        max: getTodayDate()
    },
    {
        name: 'national_id',
        label: 'validation.national_id.label',
        type: 'text',
        placeholder: 'validation.national_id.placeholder',
        editMode: true,
        viewMode: true
    },
    {
        name: 'gender',
        label: 'validation.gender.label',
        type: 'select',
        placeholder: 'validation.gender.placeholder',
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
        name: 'files',
        label: 'validation.fles.label',
        type: 'file',
        placeholder: 'validation.fles.placeholder',
        editMode: true,
        viewMode: true,
        multiple: true
    }
];

export const teachersDefaultValues = {
    status: 'active',
    name: {
        en: '',
        ar: ''
    },
    gender: '',
    registration_date: '',
    entity_ids: []
};

export const teachersFilters = [
    {
        name: 'search',
        type: 'text',
        placeholder: 'validation.search.placeholder',
        defaultValue: ''
    },
    {
        name: 'license_filter',
        type: 'select',
        placeholder: 'validation.license_filter.placeholder',
        defaultValue: 'licensed'
    },
    {
        name: 'status',
        type: 'select',
        placeholder: 'validation.status.placeholder',
        defaultValue: 'active'
    }
];

export const filtersDefaultValues = {
    license_filter: 'licensed',
    status: 'active',
    search: ''
};
