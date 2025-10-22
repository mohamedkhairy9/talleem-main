import React from 'react';
import { useCountriesQuery } from '@/api/hooks/useCountries';
import Table from '@/components/common/table/Table';
import { countriesColumns } from './configs';
import useIsOpen from '@/utils/hooks/global/useIsOpen';
import usePagination from '@/utils/hooks/global/usePagination';
import CreateCountry from './CreateCountry';
import EditCountry from './EditCountry';
import DeleteCountry from './DeleteCountry';
import ViewCountry from './ViewCountry';
import useLocale from '@/utils/hooks/global/useLocale';
import i18next from 'i18next';
import { getOriginalObject } from '@/utils/helpers/global.fns';

export default function Countries() {
    const { isOpen, toggle } = useIsOpen();
    const { pagination, setPagination } = usePagination();
    const { data, isLoading, refresh } = useCountriesQuery(pagination);
    const { t } = useLocale();

    const tableData = data?.data?.map(item => ({
        ...item,
        name: item.name?.[i18next.language]
    }));

    const formData = data?.data?.map(item => ({
        ...item,
        'name.en': item.name?.en,
        'name.ar': item.name?.ar,
        short_name: item.short_name,
        phone_code: item.phone_code
    }));

    return (
        <div>
            <Table
                title={t('table_titles.countries')}
                refresh={refresh}
                loading={isLoading}
                data={tableData}
                serverPagination={true}
                totalCount={data?.meta?.total}
                columns={countriesColumns}
                toggleModals={toggle}
                pagination={pagination}
                setPagination={setPagination}
            />
            {isOpen.add && <CreateCountry onClose={toggle.add} />}
            {isOpen.edit && (
                <EditCountry
                    onClose={toggle.edit}
                    oldData={getOriginalObject(isOpen.edit, formData)}
                />
            )}
            {isOpen.view && (
                <ViewCountry
                    onClose={toggle.view}
                    oldData={getOriginalObject(isOpen.view, formData)}
                />
            )}
            {isOpen.delete && (
                <DeleteCountry onClose={toggle.delete} id={isOpen.delete?.id} />
            )}
        </div>
    );
}
