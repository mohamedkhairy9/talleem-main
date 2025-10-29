import React from 'react';
import { useStudentsQuery } from '@/api/hooks/useStudents';
import Table from '@/components/common/table/Table';
import { studentsColumns, filtersDefaultValues } from './configs';
import useIsOpen from '@/utils/hooks/global/useIsOpen';
import useFiltering from '@/utils/hooks/global/useFiltering';
import CreateStudent from './CreateStudent';
import EditStudent from './EditStudent';
import DeleteStudent from './DeleteStudent';
import ViewStudent from './ViewStudent';
import useLocale from '@/utils/hooks/global/useLocale';
import { getOriginalObject } from '@/utils/helpers/global.fns';
import Filters from './Filters';

export default function Students() {
    const { isOpen, toggle } = useIsOpen();
    const { pagination, handleFilter, filters, setter, setFilters } =
        useFiltering(filtersDefaultValues);
    const { data, isLoading, refresh } = useStudentsQuery(filters);
    const { t } = useLocale();

    const tableData = data?.data;

    console.log('tableData', tableData);

    const formData = data?.data?.map(item => ({
        ...item,
        branch_id: item.branch?.id,
        main_program_id: item.main_program?.id,
        entity_category_id: item.entity_category?.id,
        education_program_entity_type_id:
            item.education_program_entity_type?.id,
        city_id: item.city?.id,
        kinship_id: item.kinship?.id,
        academic_level_id: item.academic_level?.id,
        entity_id: item.entity?.id,
        nationality_id: item.nationality?.id
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
        </div>
    );
}
