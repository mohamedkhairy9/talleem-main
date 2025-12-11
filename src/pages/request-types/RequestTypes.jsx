import React from 'react';
import { useRequestTypesQuery } from '@/api/hooks/useRequestTypes';
import Table from '@/components/common/table/Table';
import { requestTypesColumns, filtersDefaultValues } from './configs';
import useIsOpen from '@/utils/hooks/global/useIsOpen';
import CreateRequestType from './CreateRequestType';
import EditRequestType from './EditRequestType';
import DeleteRequestType from './DeleteRequestType';
import useLocale from '@/utils/hooks/global/useLocale';
import i18next from 'i18next';
import { getOriginalObject } from '@/utils/helpers/global.fns';
import ViewRequestType from './ViewRequestType';
import useFiltering from '@/utils/hooks/global/useFiltering';
import Filters from './Filters';

export default function RequestTypes() {
    const { isOpen, toggle } = useIsOpen();
    const { pagination, handleFilter, filters, setter, setFilters } =
        useFiltering(filtersDefaultValues);
    const { data, isLoading, refresh } = useRequestTypesQuery(filters);
    const { t } = useLocale();

    const tableData = data?.data?.map(item => ({
        ...item,
        // Handle name - could be string or object
        name: typeof item.name === 'string' 
            ? item.name 
            : item.name?.[i18next.language] || item.name
    }));

    // Transform the data to match form expectations
    const formData = data?.data?.map(item => {
        // If name is a string, convert it to object format for the form
        // The API response shows name as string, but form expects object with en/ar
        let nameObj = item.name;
        if (typeof item.name === 'string') {
            // If it's a string, create object with the string value for both languages
            // This handles the case where API returns name as string
            nameObj = {
                en: item.name,
                ar: item.name
            };
        }
        return {
            ...item,
            name: nameObj
        };
    });

    return (
        <div>
            <Table
                title={t('table_titles.request_types')}
                refresh={refresh}
                loading={isLoading}
                data={tableData}
                serverPagination={true}
                totalCount={data?.meta?.total}
                columns={requestTypesColumns}
                toggleModals={toggle}
                pagination={pagination}
                setPagination={setter('pagination')}
                Filters={
                    <Filters filters={filters} handleFilter={handleFilter} />
                }
                setFilters={setFilters}
                filters={filters}
            />
            {isOpen.add && <CreateRequestType onClose={toggle.add} />}
            {isOpen.edit && (
                <EditRequestType
                    onClose={toggle.edit}
                    oldData={getOriginalObject(isOpen.edit, formData)}
                />
            )}
            {isOpen.view && (
                <ViewRequestType
                    onClose={toggle.view}
                    oldData={getOriginalObject(isOpen.view, formData)}
                />
            )}
            {isOpen.delete && (
                <DeleteRequestType
                    onClose={toggle.delete}
                    id={isOpen.delete?.id}
                />
            )}
        </div>
    );
}

