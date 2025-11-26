import React from 'react';
import { useCertificatesQuery } from '@/api/hooks/useCertificates';
import Table from '@/components/common/table/Table';
import { certificatesColumns, filtersDefaultValues } from './configs';
import useIsOpen from '@/utils/hooks/global/useIsOpen';
import useFiltering from '@/utils/hooks/global/useFiltering';
import CreateCertificate from './CreateCertificate';
import EditCertificate from './EditCertificate';
import DeleteCertificate from './DeleteCertificate';
import ViewCertificate from './ViewCertificate';
import useLocale from '@/utils/hooks/global/useLocale';
import i18next from 'i18next';
import { getOriginalObject } from '@/utils/helpers/global.fns';
import Filters from './Filters';

export default function Certificates() {
    const { isOpen, toggle } = useIsOpen();
    const { pagination, handleFilter, filters, setter, setFilters } =
        useFiltering(filtersDefaultValues);
    const { data, isLoading, refresh } = useCertificatesQuery(filters);
    const { t } = useLocale();

    const tableData = data?.data?.map(item => ({
        ...item,
        student_name: item.student?.name?.[i18next.language],
        certificate_name: item.certificate_name?.name?.[i18next.language],
        branch: item.branch?.name?.[i18next.language],
        entity: item.entity?.name?.[i18next.language],
        issued_by: item.issued_by
    }));

    const formData = data?.data?.map(item => ({
        id: item.id,
        issued_by: item.issued_by,
        main_program_id: item.main_program?.id,
        branch_id: item.branch?.id,
        entity_id: item.entity?.id,
        student_id: item.student?.id,
        certificate_name_id: item.certificate_name?.id,
        obtained_date: item.obtained_date,
        certificate_image: item.certificate_image
    }));

    return (
        <div>
            <Table
                title={t('table_titles.certificates')}
                refresh={refresh}
                loading={isLoading}
                data={tableData}
                serverPagination={true}
                totalCount={data?.meta?.total}
                columns={certificatesColumns}
                toggleModals={toggle}
                pagination={pagination}
                setPagination={setter('pagination')}
                Filters={
                    <Filters filters={filters} handleFilter={handleFilter} />
                }
                setFilters={setFilters}
                filters={filters}
            />
            {isOpen.add && <CreateCertificate onClose={toggle.add} />}
            {isOpen.edit && (
                <EditCertificate
                    onClose={toggle.edit}
                    oldData={getOriginalObject(isOpen.edit, formData)}
                />
            )}
            {isOpen.view && (
                <ViewCertificate
                    onClose={toggle.view}
                    oldData={getOriginalObject(isOpen.view, formData)}
                />
            )}
            {isOpen.delete && (
                <DeleteCertificate
                    onClose={toggle.delete}
                    id={isOpen.delete?.id}
                />
            )}
        </div>
    );
}