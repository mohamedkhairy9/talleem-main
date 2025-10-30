import React from 'react';
import { useAcademicQualificationsQuery } from '@/api/hooks/useAcademicQualifications';
import Table from '@/components/common/table/Table';
import { academicQualificationsColumns, filtersDefaultValues } from './configs';
import useIsOpen from '@/utils/hooks/global/useIsOpen';
import useFiltering from '@/utils/hooks/global/useFiltering';
import CreateAcademicQualification from './CreateAcademicQualification';
import EditAcademicQualification from './EditAcademicQualification';
import DeleteAcademicQualification from './DeleteAcademicQualification';
import useLocale from '@/utils/hooks/global/useLocale';
import i18next from 'i18next';
import { getOriginalObject } from '@/utils/helpers/global.fns';
import ViewAcademicQualification from './ViewAcademicQualification';
import Filters from './Filters';

export default function AcademicQualifications() {
    const { isOpen, toggle } = useIsOpen();
    const { pagination, handleFilter, filters, setter, setFilters } =
        useFiltering(filtersDefaultValues);
    const { data, isLoading, refresh } =
        useAcademicQualificationsQuery(filters);
    const { t } = useLocale();

    console.log('data', data);
    console.log('isOpen', isOpen.edit);

    const tableData = data?.data?.map(item => ({
        ...item,
        name: item.name?.[i18next.language]
    }));

    const formData = data?.data?.map(item => ({
        id: item.id,
        name: item.name,
        status: item.status
    }))

    return (
        <div>
            <Table
                title={t('table_titles.academic_qualifications')}
                refresh={refresh}
                loading={isLoading}
                data={tableData}
                serverPagination={true}
                totalCount={data?.meta?.total}
                columns={academicQualificationsColumns}
                toggleModals={toggle}
                pagination={pagination}
                setPagination={setter('pagination')}
                Filters={
                    <Filters filters={filters} handleFilter={handleFilter} />
                }
                setFilters={setFilters}
                filters={filters}
            />
            {isOpen.add && (
                <CreateAcademicQualification
                    isOpen={isOpen.add}
                    onClose={toggle.add}
                />
            )}
            {isOpen.edit && (
                <EditAcademicQualification
                    isOpen={isOpen.edit}
                    onClose={toggle.edit}
                    oldData={getOriginalObject(isOpen.edit, formData)}
                />
            )}
            {isOpen.view && (
                <ViewAcademicQualification
                    onClose={toggle.view}
                    oldData={getOriginalObject(isOpen.view, formData)}
                />
            )}
            {isOpen.delete && (
                <DeleteAcademicQualification
                    onClose={toggle.delete}
                    id={isOpen.delete?.id}
                />
            )}
        </div>
    );
}
