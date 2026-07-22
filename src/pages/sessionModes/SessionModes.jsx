import React from 'react';
import { useSessionModesQuery } from '@/api/hooks/useSessionModes';
import Table from '@/components/common/table/Table';
import { sessionModesColumns, filtersDefaultValues } from './configs';
import useIsOpen from '@/utils/hooks/global/useIsOpen';
import useFiltering from '@/utils/hooks/global/useFiltering';
import CreateSessionMode from './CreateSessionMode';
import EditSessionMode from './EditSessionMode';
import DeleteSessionMode from './DeleteSessionMode';
import useLocale from '@/utils/hooks/global/useLocale';
import i18next from 'i18next';
import { getOriginalObject } from '@/utils/helpers/global.fns';
import {
    getSessionModeDisplayName,
    normalizeSessionModeOptions
} from '@/utils/helpers/sessionModeLabels';
import ViewSessionMode from './ViewSessionMode';
import Filters from './Filters';

export default function SessionModes() {
    const { isOpen, toggle } = useIsOpen();
    const { pagination, handleFilter, filters, setter, setFilters } =
        useFiltering(filtersDefaultValues);
    const { data, isLoading, refresh } = useSessionModesQuery(filters);
    const { t } = useLocale();

    const tableData = data?.data?.map(item => ({
        ...item,
        name: getSessionModeDisplayName(item.name, i18next.language)
    }));

    const formData = normalizeSessionModeOptions(data?.data).map(item => ({
        id: item.id,
        name: item.name,
        status: item.status
    }));

    return (
        <div>
            <Table
                resource="session_modes"
                title={t('table_titles.session_modes')}
                refresh={refresh}
                loading={isLoading}
                data={tableData}
                serverPagination={true}
                totalCount={data?.meta?.total}
                columns={sessionModesColumns}
                toggleModals={toggle}
                pagination={pagination}
                setPagination={setter('pagination')}
                Filters={
                    <Filters filters={filters} handleFilter={handleFilter} />
                }
                setFilters={setFilters}
                filters={filters}
            />
            {isOpen.add && <CreateSessionMode onClose={toggle.add} />}
            {isOpen.edit && (
                <EditSessionMode
                    onClose={toggle.edit}
                    oldData={getOriginalObject(isOpen.edit, formData)}
                />
            )}
            {isOpen.view && (
                <ViewSessionMode
                    onClose={toggle.view}
                    oldData={getOriginalObject(isOpen.view, formData)}
                />
            )}
            {isOpen.delete && (
                <DeleteSessionMode onClose={toggle.delete} id={isOpen.delete?.id} />
            )}
        </div>
    );
}
