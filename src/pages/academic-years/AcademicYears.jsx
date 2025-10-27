import React from 'react';
import { useAcademicYearsQuery } from '@/api/hooks/useAcademicYears';
import Table from '@/components/common/table/Table';
import { academicYearsColumns, filtersDefaultValues } from './configs';
import useIsOpen from '@/utils/hooks/global/useIsOpen';
import useFiltering from '@/utils/hooks/global/useFiltering';
import CreateAcademicYear from './CreateAcademicYear';
import EditAcademicYear from './EditAcademicYear';
import DeleteAcademicYear from './DeleteAcademicYear';
import useLocale from '@/utils/hooks/global/useLocale';
import i18next from 'i18next';
import { getOriginalObject } from '@/utils/helpers/global.fns';
import ViewAcademicYear from './ViewAcademicYear';
import Filters from './Filters';

export default function AcademicYears() {
    const { isOpen, toggle } = useIsOpen();
    const { pagination, handleFilter, filters, setter, setFilters } =
        useFiltering(filtersDefaultValues);
    const { data, isLoading, refresh } = useAcademicYearsQuery(filters);
    const { t } = useLocale();

    const tableData = data?.data?.map(item => ({
        ...item,
        name: item.name?.[i18next.language]
    }));

    return (
        <div>
            <Table
                title={t('table_titles.academic_years')}
                refresh={refresh}
                loading={isLoading}
                data={tableData}
                serverPagination={true}
                totalCount={data?.meta?.total}
                columns={academicYearsColumns}
                toggleModals={toggle}
                pagination={pagination}
                setPagination={setter('pagination')}
                Filters={
                    <Filters filters={filters} handleFilter={handleFilter} />
                }
                setFilters={setFilters}
                filters={filters}
            />
            {isOpen.add && <CreateAcademicYear onClose={toggle.add} />}
            {isOpen.edit && (
                <EditAcademicYear
                    onClose={toggle.edit}
                    oldData={getOriginalObject(isOpen.edit, data?.data)}
                />
            )}
            {isOpen.view && (
                <ViewAcademicYear
                    onClose={toggle.view}
                    oldData={getOriginalObject(isOpen.view, data?.data)}
                />
            )}
            {isOpen.delete && (
                <DeleteAcademicYear
                    onClose={toggle.delete}
                    id={isOpen.delete?.id}
                />
            )}
        </div>
    );
}
