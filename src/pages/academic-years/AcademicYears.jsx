import React from 'react';
import { useAcademicYearsQuery } from '@/api/hooks/useAcademicYears';
import Table from '@/components/common/table/Table';
import { academicYearsColumns } from './configs';
import useIsOpen from '@/utils/hooks/global/useIsOpen';
import usePagination from '@/utils/hooks/global/usePagination';
import CreateAcademicYear from './CreateAcademicYear';
import EditAcademicYear from './EditAcademicYear';
import DeleteAcademicYear from './DeleteAcademicYear';
import useLocale from '@/utils/hooks/global/useLocale';

export default function AcademicYears() {
    const { isOpen, toggle } = useIsOpen();
    const { pagination, setPagination } = usePagination();
    const { data, isLoading, refresh } = useAcademicYearsQuery(pagination);
    const { t } = useLocale();

    return (
        <div>
            <Table
                title={t('table_titles.academic_years')}
                refresh={refresh}
                loading={isLoading}
                data={data?.data}
                serverPagination={true}
                totalCount={data?.meta?.total}
                columns={academicYearsColumns}
                toggleModals={toggle}
                pagination={pagination}
                setPagination={setPagination}
            />
            {isOpen.add && <CreateAcademicYear onClose={toggle.add} />}
            {isOpen.edit && (
                <EditAcademicYear onClose={toggle.edit} oldData={isOpen.edit} />
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
