import React from 'react';
import {
    useTeachersQuery,
    useUnlicensedTeachersQuery,
    useExportExampleFileMutation
} from '@/api/hooks/useTeachers';
import Table from '@/components/common/table/Table';
import {
    teachersColumns,
    filtersDefaultValues,
    teacherLicenseFilterOptions
} from './configs';
import useIsOpen from '@/utils/hooks/global/useIsOpen';
import useFiltering from '@/utils/hooks/global/useFiltering';
import CreateTeacher from './CreateTeacher';
import EditTeacher from './EditTeacher';
import DeleteTeacher from './DeleteTeacher';
import ViewTeacher from './ViewTeacher';
import ImportTeacher from './ImportTeacher';
import useLocale from '@/utils/hooks/global/useLocale';
import i18next from 'i18next';
import {
    generateOptions,
    getOriginalObject
} from '@/utils/helpers/global.fns';
import Filters from './Filters';
import useExportExample from '@/utils/hooks/global/useExportExample';
import FilterSelect from '@/components/common/inputs/FilterSelect';

const extractCollection = response => {
    if (Array.isArray(response)) return response;
    if (Array.isArray(response?.data)) return response.data;
    if (Array.isArray(response?.items)) return response.items;
    if (Array.isArray(response?.results)) return response.results;
    if (Array.isArray(response?.teachers)) return response.teachers;
    return [];
};

export default function Teachers() {
    const { isOpen, toggle } = useIsOpen();
    const { pagination, handleFilter, filters, setter, setFilters } =
        useFiltering(filtersDefaultValues);
    const isUnlicensedView = filters?.license_filter === 'unlicensed';
    const { license_filter: _licenseFilter, ...teacherListFilters } = filters;
    const unlicensedTeacherFilters = { ...teacherListFilters };

    delete unlicensedTeacherFilters.status;

    const {
        data: teachersResponse,
        isLoading: isTeachersLoading,
        refresh: refreshTeachers
    } = useTeachersQuery(teacherListFilters, {
        enabled: !isUnlicensedView
    });
    const {
        data: unlicensedTeachersResponse,
        isLoading: isUnlicensedTeachersLoading,
        refresh: refreshUnlicensedTeachers
    } = useUnlicensedTeachersQuery(unlicensedTeacherFilters, {
        enabled: isUnlicensedView
    });
    const { t } = useLocale();
    const { mutate } = useExportExampleFileMutation();
    const { handleExportExample } = useExportExample({
        mutate,
        filename: 'teachers_example.xlsx'
    });
    const handleTeachersExportExample = () =>
        handleExportExample({
            unlicensed: isUnlicensedView ? 1 : 0
        });
    const toolbarLicenseFilter = (
        <div className="min-w-[180px]">
            <FilterSelect
                name="license_filter"
                placeholder="validation.license_filter.placeholder"
                value={filters?.license_filter}
                onChange={({ value }) =>
                    handleFilter('license_filter', value)
                }
                options={generateOptions(teacherLicenseFilterOptions)}
            />
        </div>
    );
    const sourceResponse = isUnlicensedView
        ? unlicensedTeachersResponse
        : teachersResponse;
    const dataList = extractCollection(sourceResponse);
    const isLoading = isUnlicensedView
        ? isUnlicensedTeachersLoading
        : isTeachersLoading;
    const refresh = isUnlicensedView
        ? refreshUnlicensedTeachers
        : refreshTeachers;
    const totalCount =
        sourceResponse?.meta?.total ??
        sourceResponse?.total ??
        sourceResponse?.data?.length ??
        dataList.length;

    const tableData = dataList.map(item => ({
        ...item,
        name: item.name?.[i18next.language],
        branch: item.branch?.[i18next.language],
        main_program: item.main_program?.name?.[i18next.language]
    }));

    const formData = dataList.map(item => {
        // Map gender from Arabic text to value
        let genderValue = item.gender;
        if (typeof item.gender === 'string') {
            // Map Arabic gender text to values
            if (item.gender === 'أنثى' || item.gender === '\u0623\u0646\u062b\u0649') {
                genderValue = 'female';
            } else if (item.gender === 'ذكر' || item.gender === '\u0630\u0643\u0631') {
                genderValue = 'male';
            }
        }

        return {
            ...item,
            user_id: item.user?.id,
            branch_id: item.branch?.id,
            main_program_id: item.main_program?.id,
            entity_id: item.entity != null ? Number(item.entity.id) : undefined,
            entity: item.entity ?? undefined,
            major_id: item.major?.id,
            nationality_id: item.nationality != null ? Number(item.nationality.id) : undefined,
            nationality: item.nationality ?? undefined,
            academic_qualification_id: item.academic_qualification?.id,
            specification_id: item.specification?.id,
            city_id: item.city?.id,
            gender: genderValue,
            education_program_entity_type_classification: null, // Will be set in FormTeacher based on entity_category_id
            education_program_entity_type_id: item.education_program_entity_type ?? null,
            memorization_program_entity_type_id: item.memorization_program_entity_type ?? null,
            entity_category_id:
                item.main_program?.id == 1
                    ? item.education_program_entity_type?.id
                    : item.main_program?.id == 2
                    ? item.memorization_program_entity_type?.id
                    : null,
            // Ensure profile_picture and files are passed through
            profile_picture: item.profile_picture || item.profile_image || '',
            profile_image: item.profile_image || item.profile_picture || '',
            // Transform files array: ensure proper format for FileInputRFH
            files: Array.isArray(item.files) 
                ? item.files.map(file => {
                    // If it's already an object with url property, return as is
                    if (typeof file === 'object' && file !== null && file.url) {
                        return file;
                    }
                    // If it's a URL string, convert to object format
                    if (typeof file === 'string') {
                        const fileName = file.split('/').pop() || 'file';
                        return {
                            url: file,
                            name: fileName,
                            size: null
                        };
                    }
                    return file;
                })
                : []
        };
    });

    return (
        <div>
            <Table
                resource="teachers"
                title={t('table_titles.teachers')}
                refresh={refresh}
                loading={isLoading}
                data={tableData}
                serverPagination={true}
                totalCount={totalCount}
                columns={teachersColumns}
                toggleModals={toggle}
                pagination={pagination}
                setPagination={setter('pagination')}
                Filters={
                    <Filters filters={filters} handleFilter={handleFilter} />
                }
                setFilters={setFilters}
                filters={filters}
                enableImport={true}
                enableExportExample={true}
                onImport={toggle.import}
                onExportExample={handleTeachersExportExample}
                ToolbarExtra={toolbarLicenseFilter}
            />
            {isOpen.add && <CreateTeacher onClose={toggle.add} />}
            {isOpen.edit && (
                <EditTeacher
                    onClose={toggle.edit}
                    oldData={getOriginalObject(isOpen.edit, formData)}
                />
            )}
            {isOpen.view && (
                <ViewTeacher
                    onClose={toggle.view}
                    oldData={getOriginalObject(isOpen.view, formData)}
                />
            )}
            {isOpen.delete && (
                <DeleteTeacher onClose={toggle.delete} id={isOpen.delete?.id} />
            )}
            {isOpen.import && <ImportTeacher onClose={toggle.import} />}
        </div>
    );
}
