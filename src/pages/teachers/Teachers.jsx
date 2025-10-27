import React from 'react';
import { useTeachersQuery } from '@/api/hooks/useTeachers';
import Table from '@/components/common/table/Table';
import { teachersColumns, filtersDefaultValues } from './configs';
import useIsOpen from '@/utils/hooks/global/useIsOpen';
import useFiltering from '@/utils/hooks/global/useFiltering';
import CreateTeacher from './CreateTeacher';
import EditTeacher from './EditTeacher';
import DeleteTeacher from './DeleteTeacher';
import ViewTeacher from './ViewTeacher';
import useLocale from '@/utils/hooks/global/useLocale';
import i18next from 'i18next';
import { getOriginalObject } from '@/utils/helpers/global.fns';
import Filters from './Filters';

export default function Teachers() {
    const { isOpen, toggle } = useIsOpen();
    const { pagination, handleFilter, filters, setter, setFilters } =
        useFiltering(filtersDefaultValues);
    const { data, isLoading, refresh } = useTeachersQuery(filters);
    const { t } = useLocale();

    const tableData = data?.data?.map(item => ({
        ...item,
        name: item.name?.[i18next.language],
        branch: item.branch?.[i18next.language],
        main_program: item.main_program?.[i18next.language]
    }));

    console.log('data', data?.data);

    const formData = data?.data?.map(item => ({
        ...item,
        user_id: item.user?.id,
        branch_id: item.branch?.id,
        main_program_id: item.main_program?.id,
        entity_id: item.entity?.id,
        nationality_id: item.nationality?.id,
        academic_qualification_id: item.academic_qualification?.id,
        specification_id: item.specification?.id,
        city_id: item.city?.id,
        education_program_entity_type_id:
            item.education_program_entity_type?.id,
        entity_category_id: item.entity_category?.id
    }));

    return (
        <div>
            <Table
                title={t('table_titles.teachers')}
                refresh={refresh}
                loading={isLoading}
                data={tableData}
                serverPagination={true}
                totalCount={data?.meta?.total}
                columns={teachersColumns}
                toggleModals={toggle}
                pagination={pagination}
                setPagination={setter('pagination')}
                Filters={
                    <Filters filters={filters} handleFilter={handleFilter} />
                }
                setFilters={setFilters}
                filters={filters}
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
        </div>
    );
}
