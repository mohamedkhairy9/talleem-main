import React from 'react';
import { useJoinRequestFormsQuery } from '@/api/hooks/useJoinRequestForms';
import Table from '@/components/common/table/Table';
import { joinRequestFormsColumns, filtersDefaultValues } from './configs';
import useIsOpen from '@/utils/hooks/global/useIsOpen';
import useFiltering from '@/utils/hooks/global/useFiltering';
import CreateJoinRequestForm from './CreateJoinRequestForm';
import EditJoinRequestForm from './EditJoinRequestForm';
import DeleteJoinRequestForm from './DeleteJoinRequestForm';
import useLocale from '@/utils/hooks/global/useLocale';
import i18next from 'i18next';
import { getOriginalObject } from '@/utils/helpers/global.fns';
import ViewJoinRequestForm from './ViewJoinRequestForm';
import Filters from './Filters';

export default function JoinRequestForms() {
    const { isOpen, toggle } = useIsOpen();
    const { pagination, handleFilter, filters, setter, setFilters } =
        useFiltering(filtersDefaultValues);
    const { data, isLoading, refresh } = useJoinRequestFormsQuery(filters);
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
        let nameObj = item.name;
        if (typeof item.name === 'string') {
            nameObj = {
                en: item.name,
                ar: item.name
            };
        }

        // Handle description
        let descriptionObj = item.description;
        if (descriptionObj && typeof descriptionObj === 'string') {
            descriptionObj = {
                en: descriptionObj,
                ar: descriptionObj
            };
        }

        // Normalize fields labels
        const normalizedFields = (item.data?.fields || []).map(field => ({
            ...field,
            label: typeof field.label === 'string' 
                ? { en: field.label, ar: field.label }
                : field.label || { en: '', ar: '' }
        }));

        return {
            ...item,
            name: nameObj,
            description: descriptionObj,
            data: {
                fields: normalizedFields
            }
        };
    });

    return (
        <div>
            <Table
                resource="join_request_forms"
                title={t('table_titles.join_request_forms')}
                refresh={refresh}
                loading={isLoading}
                data={tableData}
                serverPagination={true}
                totalCount={data?.meta?.total}
                columns={joinRequestFormsColumns}
                toggleModals={toggle}
                pagination={pagination}
                setPagination={setter('pagination')}
                Filters={
                    <Filters filters={filters} handleFilter={handleFilter} />
                }
                setFilters={setFilters}
                filters={filters}
            />
            {isOpen.add && <CreateJoinRequestForm onClose={toggle.add} />}
            {isOpen.edit && (
                <EditJoinRequestForm
                    onClose={toggle.edit}
                    oldData={getOriginalObject(isOpen.edit, formData)}
                />
            )}
            {isOpen.view && (
                <ViewJoinRequestForm
                    onClose={toggle.view}
                    oldData={getOriginalObject(isOpen.view, formData)}
                />
            )}
            {isOpen.delete && (
                <DeleteJoinRequestForm
                    onClose={toggle.delete}
                    id={isOpen.delete?.id}
                />
            )}
        </div>
    );
}

