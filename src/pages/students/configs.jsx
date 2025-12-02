import Cell from '@/components/common/table/cells/Cell';
import DateCell from '@/components/common/table/cells/DateCell';
import NameCell from '@/components/common/table/cells/NameCell';
import { getMaxDateForMinAge, getYesterdayDate } from '@/utils/helpers/dateHelpers';
import { createColumnHelper } from '@tanstack/react-table';
import React from 'react';

const columnHelper = createColumnHelper();

export const studentsColumns = [
    columnHelper.accessor('name', {
        header: 'table_headers.name',
        cell: info => <NameCell directValue={info.row.original.name} />
    }),
    columnHelper.accessor('national_id', {
        header: 'table_headers.national_id',
        cell: info => <Cell value={info.getValue()} />
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
        cell: info => <Cell value={info.row.original.branch?.name} />
    }),
    columnHelper.accessor('status', {
        header: 'table_headers.status',
        cell: info => {
            const status = info.getValue();
            const isActive = status === 1 || status === true;
            return (
                <div className="flex items-center space-x-2">
                    <div
                        className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-500' : 'bg-red-500'
                            }`}
                    />
                    <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${isActive
                            ? 'bg-green-100 text-green-800 border-green-200'
                            : 'bg-red-100 text-red-800 border-red-200'
                            }`}
                    >
                        {isActive ? 'Active' : 'Inactive'}
                    </span>
                </div>
            );
        }
    }),
    columnHelper.accessor('created_at', {
        header: 'table_headers.created_at',
        cell: info => <DateCell fullDate value={info.getValue()} />,
        enableColumnFilter: false
    })
];

export const studentsFields = [
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
        editMode: true,
        viewMode: true,
        info: 'info.branch_id'
    },

    {
        name: 'entity_id',
        label: 'validation.entity_id.label',
        type: 'select',
        placeholder: 'validation.entity_id.placeholder',
        editMode: true,
        viewMode: true,
        conditional: true,
        info: 'info.entity',
        showWhen: { main_program_id: [1, 2] }
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
        info: 'info.entity_category',
        showWhen: { main_program_id: 1 }
    },
    {
        name: 'status',
        label: 'validation.status.label',
        type: 'select',
        placeholder: 'validation.status.placeholder',
        defaultValue: true,
        editMode: true,
        viewMode: true
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
        name: 'nationality_id',
        label: 'validation.nationality_id.label',
        type: 'select',
        placeholder: 'validation.nationality_id.placeholder',
        editMode: true,
        viewMode: true
    },
    {
        name: 'school_name',
        label: 'validation.school_name.label',
        type: 'text',
        placeholder: 'validation.school_name.placeholder',
        editMode: true,
        viewMode: true,
        conditional: true,
        showWhen: { main_program_id: 2 }
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
        name: 'date_of_birth',
        label: 'validation.date_of_birth.label',
        type: 'date',
        placeholder: 'validation.date_of_birth.placeholder',
        editMode: true,
        viewMode: true,
        max: getMaxDateForMinAge(2), // Students must be at least 2 years old
        min: getMaxDateForMinAge(70)
    },
    // UPDATED: Replace single parent_name with bilingual fields
    {
        name: 'parent_name.en',
        label: 'validation.parent_name.label_en',
        type: 'text',
        placeholder: 'validation.parent_name.placeholder_en',
        editMode: true,
        viewMode: true,
        conditional: true,
        showWhen: { isMinor: true }
    },
    {
        name: 'parent_name.ar',
        label: 'validation.parent_name.label_ar',
        type: 'text',
        placeholder: 'validation.parent_name.placeholder_ar',
        editMode: true,
        viewMode: true,
        conditional: true,
        showWhen: { isMinor: true }
    },
    {
        name: 'kinship_id',
        label: 'validation.kinship_id.label',
        type: 'select',
        placeholder: 'validation.kinship_id.placeholder',
        editMode: true,
        viewMode: true,
        conditional: true,
        showWhen: { isMinor: true }
    },
    {
        name: 'has_medical_issues',
        label: 'validation.has_medical_issues.label',
        type: 'select',
        placeholder: 'validation.has_medical_issues.placeholder',
        defaultValue: 0,
        editMode: true,
        viewMode: true
    },
    {
        name: 'issue_description',
        label: 'validation.issue_description.label',
        type: 'textarea',
        placeholder: 'validation.issue_description.placeholder',
        editMode: true,
        viewMode: true
    },
    {
        name: 'parent_phone_1',
        label: 'validation.parent_phone_1.label',
        type: 'text',
        placeholder: 'validation.parent_phone_1.placeholder',
        editMode: true,
        viewMode: true,
        conditional: true,
        showWhen: { isMinor: true }
    },
    {
        name: 'parent_phone_2',
        label: 'validation.parent_phone_2.label',
        type: 'text',
        placeholder: 'validation.parent_phone_2.placeholder',
        editMode: true,
        viewMode: true,
        conditional: true,
        showWhen: { isMinor: true }
    },
    {
        name: 'registration_date',
        label: 'validation.registration_date.label',
        type: 'date',
        placeholder: 'validation.registration_date.placeholder',
        editMode: true,
        viewMode: true,
        max: getYesterdayDate()
    },
    {
        name: 'academic_level_id',
        label: 'validation.academic_level_id.label',
        type: 'select',
        placeholder: 'validation.academic_level_id.placeholder',
        editMode: true,
        viewMode: true,
        conditional: true,
    },
    {
        name: 'specification_id',
        label: 'validation.specification_id.label',
        type: 'select',
        placeholder: 'validation.specification_id.placeholder',
        editMode: true,
        viewMode: true,
        conditional: true,
        showWhen: { main_program_id: [1, 2] }
    },
    {
        name: 'profile_picture',
        label: 'validation.profile_picture.label',
        type: 'file',
        placeholder: 'validation.profile_picture.placeholder',
        editMode: true,
        viewMode: true,
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
        name: 'files',
        label: 'validation.files.label',
        type: 'file',
        placeholder: 'validation.files.placeholder',
        editMode: true,
        viewMode: true,
        multiple: true
    },
];

export const studentsDefaultValues = {
    status: 1,
    has_medical_issues: 0,
    name: {
        en: '',
        ar: ''
    },
    department: {
        en: '',
        ar: ''
    },
    parent_name: { // Add this
        en: '',
        ar: ''
    },
    qualification: {
        has_high_school: 0,
        high_school_grade: 0,
        has_bachelors_degree: 0,
        major_id: null,
        has_memorized_quran_5_parts: 0,
        memorized_quran_parts: 0
    }
};
export const studentsFilters = [
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
        defaultValue: 1
    }
];

export const filtersDefaultValues = {
    status: true,
    search: ''
};
