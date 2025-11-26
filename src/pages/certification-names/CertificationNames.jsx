import React from 'react';
import { useCertificateNamesQuery } from '@/api/hooks/useCertificateNames';
import Table from '@/components/common/table/Table';
import { certificateNamesColumns, filtersDefaultValues } from './configs';
import useIsOpen from '@/utils/hooks/global/useIsOpen';
import CreateCertificateName from './CreateCertificateName';
import EditCertificateName from './EditCertificateName';
import DeleteCertificateName from './DeleteCertificateName';
import useLocale from '@/utils/hooks/global/useLocale';
import { getOriginalObject } from '@/utils/helpers/global.fns';
import ViewCertificateName from './ViewCertificateName';
import useFiltering from '@/utils/hooks/global/useFiltering';
import Filters from './Filters';

export default function CertificateNames() {
    const { isOpen, toggle } = useIsOpen();
    const { pagination, handleFilter, filters, setter, setFilters } =
        useFiltering(filtersDefaultValues);
    const { data, isLoading, refresh } = useCertificateNamesQuery(filters);
    const { t } = useLocale();

    const tableData = data?.data;

    const formData = data?.data?.map(item => ({
        ...item,
        main_program_id: item.main_program?.id
    }));

    return (
        <div>
            <Table
                title={t('table_titles.certificate_names')}
                refresh={refresh}
                loading={isLoading}
                data={tableData}
                serverPagination={true}
                totalCount={data?.meta?.total}
                columns={certificateNamesColumns}
                toggleModals={toggle}
                pagination={pagination}
                setPagination={setter('pagination')}
                Filters={
                    <Filters filters={filters} handleFilter={handleFilter} />
                }
                setFilters={setFilters}
                filters={filters}
            />
            {isOpen.add && <CreateCertificateName onClose={toggle.add} />}
            {isOpen.edit && (
                <EditCertificateName
                    onClose={toggle.edit}
                    oldData={getOriginalObject(isOpen.edit, formData)}
                />
            )}
            {isOpen.view && (
                <ViewCertificateName
                    onClose={toggle.view}
                    oldData={getOriginalObject(isOpen.view, formData)}
                />
            )}
            {isOpen.delete && (
                <DeleteCertificateName
                    onClose={toggle.delete}
                    id={isOpen.delete?.id}
                />
            )}
        </div>
    );
}
