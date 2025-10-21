import React from 'react';
import { useGeneralBannersQuery } from '@/api/hooks/useGeneralBanners';
import Table from '@/components/common/table/Table';
import { generalBannersColumns } from './configs';
import useIsOpen from '@/utils/hooks/global/useIsOpen';
import usePagination from '@/utils/hooks/global/usePagination';
import CreateGeneralBanner from './CreateGeneralBanner';
import EditGeneralBanner from './EditGeneralBanner';
import DeleteGeneralBanner from './DeleteGeneralBanner';
import useLocale from '@/utils/hooks/global/useLocale';
import { getOriginalObject } from '@/utils/helpers/global.fns';
import ViewGeneralBanner from './ViewGeneralBanner';

export default function GeneralBanners() {
    const { isOpen, toggle } = useIsOpen();
    const { pagination, setPagination } = usePagination();
    const { data, isLoading, refresh } = useGeneralBannersQuery(pagination);
    const { t } = useLocale();

    const tableData = data?.data;
    const formData = data?.data;

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
                setPagination={setPagination}
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
