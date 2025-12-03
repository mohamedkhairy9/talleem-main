import React from 'react';
import {
    useStudentsQuery,
    useExportExampleFileMutation
} from '@/api/hooks/useStudents';
import Table from '@/components/common/table/Table';
import { studentsColumns, filtersDefaultValues } from './configs';
import useIsOpen from '@/utils/hooks/global/useIsOpen';
import useFiltering from '@/utils/hooks/global/useFiltering';
import CreateStudent from './CreateStudent';
import EditStudent from './EditStudent';
import DeleteStudent from './DeleteStudent';
import ViewStudent from './ViewStudent';
import ImportStudent from './ImportStudent';
import useLocale from '@/utils/hooks/global/useLocale';
import { getOriginalObject } from '@/utils/helpers/global.fns';
import Filters from './Filters';
import useExportExample from '@/utils/hooks/global/useExportExample';

export default function Students() {
    const { isOpen, toggle } = useIsOpen();
    const { pagination, handleFilter, filters, setter, setFilters } =
        useFiltering(filtersDefaultValues);
    const { data, isLoading, refresh } = useStudentsQuery(filters);
    const { t } = useLocale();
    const { mutate } = useExportExampleFileMutation();
    const { handleExportExample } = useExportExample({mutate, filename: 'students_example.xlsx'});

    const tableData = data?.data;

    const formData = data?.data?.map(item => ({
        ...item,
        branch_id: item.branch?.id,
        main_program_id: 
            item.main_program ? item.main_program.id : item.main_program_id?.id, // leaving it as it is until fixed
        // entity_category_id: item.entity_category?.id,
        education_program_entity_type_classification: item.education_program_entity_type?.name?.en || '',
        entity_category_id:
            item.main_program?.id == 1
                ? item.education_program_entity_type?.id
                : null,
        // Memorization program entity type
        memorization_program_entity_type: item.memorization_program_entity_type?.name?.en || item.memorization_program_entity_type?.name?.ar || '',
        memorization_program_entity_type_id: item.memorization_program_entity_type?.id,
        city_id: item.city?.id,
        kinship_id: item.kinship?.id,
        academic_level_id: item.academic_level?.id,
        academic_qualification_id: item.academic_qualification?.id,
        entity_id: item.entity?.id,
        nationality_id: item.nationality?.id,
        specification_id: item.specification?.id,
        qualification: {
            ...item.qualification,
            major_id: item.major?.id || item.qualification?.major_id
        },
        has_medical_issues: +item.has_medical_issues
    }));

    return (
        <div>
            <Table
                title={t('table_titles.students')}
                refresh={refresh}
                loading={isLoading}
                data={tableData}
                serverPagination={true}
                totalCount={data?.meta?.total}
                columns={studentsColumns}
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
                onExportExample={handleExportExample}
            />
            {isOpen.add && <CreateStudent onClose={toggle.add} />}
            {isOpen.edit && (
                <EditStudent
                    onClose={toggle.edit}
                    oldData={getOriginalObject(isOpen.edit, formData)}
                />
            )}
            {isOpen.view && (
                <ViewStudent
                    onClose={toggle.view}
                    oldData={getOriginalObject(isOpen.view, formData)}
                />
            )}
            {isOpen.delete && (
                <DeleteStudent onClose={toggle.delete} id={isOpen.delete?.id} />
            )}
            {isOpen.import && <ImportStudent onClose={toggle.import} />}
        </div>
    );
}
