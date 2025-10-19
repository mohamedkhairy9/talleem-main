import React from 'react';
import { useNationalitiesQuery } from '@/api/hooks/useNationalities';
import Table from '@/components/common/table/Table';
import { nationalitiesColumns } from './configs';
import useIsOpen from '@/utils/hooks/global/useIsOpen';
import usePagination from '@/utils/hooks/global/usePagination';
import CreateNationality from './CreateNationality';
import EditNationality from './EditNationality';
import DeleteNationality from './DeleteNationality';
import ViewNationality from './ViewNationality';
import useLocale from '@/utils/hooks/global/useLocale';
import i18next from 'i18next';
import { getOriginalObject } from '@/utils/helpers/global.fns';

export default function Nationalities() {
    const { isOpen, toggle } = useIsOpen();
    const { pagination, setPagination } = usePagination();
    const { data, isLoading, refresh } = useNationalitiesQuery(pagination);
    const { t } = useLocale();

    const tableData = data?.data?.map(item => ({
        ...item,
        name: item.name?.[i18next.language]
    }));

    const formData = data?.data?.map(item => ({
        ...item,
        country_id: item.country_id,
        'name.en': item.name?.en,
        'name.ar': item.name?.ar
    }));

    return (
        <div>
            <Table
                title={t('table_titles.nationalities')}
                refresh={refresh}
                loading={isLoading}
                data={tableData}
                serverPagination={true}
                totalCount={data?.meta?.total}
                columns={nationalitiesColumns}
                toggleModals={toggle}
                pagination={pagination}
                setPagination={setPagination}
            />
            {isOpen.add && <CreateNationality onClose={toggle.add} />}
            {isOpen.edit && (
                <EditNationality
                    onClose={toggle.edit}
                    oldData={getOriginalObject(isOpen.edit, formData)}
                />
            )}
            {isOpen.view && (
                <ViewNationality
                    onClose={toggle.view}
                    oldData={getOriginalObject(isOpen.view, formData)}
                />
            )}
            {isOpen.delete && (
                <DeleteNationality
                    onClose={toggle.delete}
                    id={isOpen.delete?.id}
                />
            )}
        </div>
    );
}
