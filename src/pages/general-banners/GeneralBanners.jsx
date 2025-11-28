import React from 'react';
import { useGeneralBannersQuery } from '@/api/hooks/useGeneralBanners';
import Table from '@/components/common/table/Table';
import { generalBannersColumns, filtersDefaultValues } from './configs';
import useIsOpen from '@/utils/hooks/global/useIsOpen';
import useFiltering from '@/utils/hooks/global/useFiltering';
import CreateGeneralBanner from './CreateGeneralBanner';
import EditGeneralBanner from './EditGeneralBanner';
import DeleteGeneralBanner from './DeleteGeneralBanner';
import useLocale from '@/utils/hooks/global/useLocale';
import { getOriginalObject } from '@/utils/helpers/global.fns';
import ViewGeneralBanner from './ViewGeneralBanner';
import Filters from './Filters';

export default function GeneralBanners() {
    const { isOpen, toggle } = useIsOpen();
    const { pagination, handleFilter, filters, setter, setFilters } =
        useFiltering(filtersDefaultValues);
    const { data, isLoading, refresh } = useGeneralBannersQuery(filters);
    const { t } = useLocale();

    const tableData = data?.data?.map(item => ({
        ...item,
        status: item.status
    }));
    const formData = data?.data?.map(({ created_at, ...item }) => item);

    return (
        <div>
            <Table
                title={t('table_titles.general_banners')}
                refresh={refresh}
                loading={isLoading}
                data={tableData}
                serverPagination={true}
                totalCount={data?.meta?.total}
                columns={generalBannersColumns}
                toggleModals={toggle}
                pagination={pagination}
                setPagination={setter('pagination')}
                Filters={
                    <Filters filters={filters} handleFilter={handleFilter} />
                }
                setFilters={setFilters}
                filters={filters}
            />
            {isOpen.add && <CreateGeneralBanner onClose={toggle.add} />}
            {isOpen.edit && (
                <EditGeneralBanner
                    onClose={toggle.edit}
                    oldData={getOriginalObject(isOpen.edit, formData)}
                />
            )}
            {isOpen.view && (
                <ViewGeneralBanner
                    onClose={toggle.view}
                    oldData={getOriginalObject(isOpen.view, formData)}
                />
            )}
            {isOpen.delete && (
                <DeleteGeneralBanner
                    onClose={toggle.delete}
                    id={isOpen.delete?.id}
                />
            )}
        </div>
    );
}
