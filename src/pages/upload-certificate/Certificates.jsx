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

    const tableData = data?.data?.map(item => {
        const certificateName = item.certificate_name;
        const localizedCertificateName =
            (typeof certificateName === 'string' ? certificateName : '') ||
            certificateName?.[i18next.language] ||
            certificateName?.name?.[i18next.language] ||
            certificateName?.[i18next.language?.split('-')?.[0]] ||
            certificateName?.name?.[i18next.language?.split('-')?.[0]] ||
            certificateName?.ar ||
            certificateName?.en ||
            certificateName?.name ||
            item.certificate_name_name ||
            '-';

        return {
            ...item,
            student_name: item.student?.name?.[i18next.language],
            certificate_name: localizedCertificateName,
            issued_from: item.issued_from,
            is_active: item.is_active
        };
    });

    const formData = data?.data?.map(item => ({
        id: item.id,
        main_program_id: item.main_program_id ?? item.student?.main_program_id,
        branch_id: item.branch_id ?? item.student?.branch?.id,
        entity_id: item.entity_id ?? item.student?.primary_entity_id,
        student_id: item.student_id ?? item.student?.id,
        certificate_name_id: item.certificate_name_id ?? item.certificate_name?.id,
        certificate_name: item.certificate_name,
        issued_date: item.issued_date,
        is_active: item.is_active,
        file: item.image_url,
        issued_from_value: item.issued_from_value
    }));

    return (
        <div>
            <Table
                resource="certificates"
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
