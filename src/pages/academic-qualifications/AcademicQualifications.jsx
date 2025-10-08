import React from 'react';
import { useAcademicQualificationsQuery } from '@/api/hooks/useAcademicQualifications';
import Table from '@/components/common/table/Table';
import { academicQualificationsColumns } from './configs';
import useIsOpen from '@/utils/hooks/global/useIsOpen';
import usePagination from '@/utils/hooks/global/usePagination';
import CreateAcademicQualification from './CreateAcademicQualification';
import EditAcademicQualification from './EditAcademicQualification';
import DeleteAcademicQualification from './DeleteAcademicQualification';
import useLocale from '@/utils/hooks/global/useLocale';
import i18next from 'i18next';
import { getOriginalObject } from '@/utils/helpers/global.fns';

export default function AcademicQualifications() {
    const { isOpen, toggle } = useIsOpen();
    const { pagination, setPagination } = usePagination();
    const { data, isLoading, refresh } =
        useAcademicQualificationsQuery(pagination);
    const { t } = useLocale();

    console.log('data', data);
    console.log('isOpen', isOpen.edit);

    const tableData = data?.data?.map(item => ({
        ...item,
        name: item.name?.[i18next.language]
    }));

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
                setPagination={setPagination}
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
                    oldData={getOriginalObject(isOpen.edit, data?.data)}
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
