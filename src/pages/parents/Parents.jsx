import React from 'react';
import { useParentsQuery } from '@/api/hooks/useParents';
import Table from '@/components/common/table/Table';
import { parentsColumns, filtersDefaultValues } from './configs';
import useIsOpen from '@/utils/hooks/global/useIsOpen';
import useFiltering from '@/utils/hooks/global/useFiltering';
import CreateParent from './CreateParent';
import EditParent from './EditParent';
import DeleteParent from './DeleteParent';
import ViewParent from './ViewParent';
import useLocale from '@/utils/hooks/global/useLocale';
import i18next from 'i18next';
import { getOriginalObject } from '@/utils/helpers/global.fns';
import Filters from './Filters';

export default function Parents() {
    const { isOpen, toggle } = useIsOpen();
    const { pagination, handleFilter, filters, setter, setFilters } =
        useFiltering(filtersDefaultValues);
    const { data, isLoading, refresh } = useParentsQuery(filters);
    const { t } = useLocale();

    const tableData = data?.data?.map(item => ({
        ...item,
        name: item.name?.[i18next.language]
    }));

    const formData = data?.data?.map(({ created_at, updated_at, students, ...item}) => item);

    return (
        <div>
            <Table
                title={t('table_titles.parents')}
                enableAdd={false}

                refresh={refresh}
                loading={isLoading}
                data={tableData}
                serverPagination={true}
                totalCount={data?.meta?.total}
                columns={parentsColumns}
                toggleModals={toggle}
                pagination={pagination}
                setPagination={setter('pagination')}
                Filters={
                    <Filters filters={filters} handleFilter={handleFilter} />
                }
                setFilters={setFilters}
                filters={filters}
            />
            {/* {isOpen.add && <CreateParent onClose={toggle.add} />} */}
            {isOpen.edit && (
                <EditParent
                    onClose={toggle.edit}
                    oldData={getOriginalObject(isOpen.edit, formData)}
                />
            )}
            {isOpen.view && (
                <ViewParent
                    onClose={toggle.view}
                    oldData={getOriginalObject(isOpen.view, formData)}
                />
            )}
            {isOpen.delete && (
                <DeleteParent onClose={toggle.delete} id={isOpen.delete?.id} />
            )}
        </div>
    );
}
