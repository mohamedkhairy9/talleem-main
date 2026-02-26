import React, { useMemo, useEffect } from 'react';
import { useJoinRequestsQuery } from '@/api/hooks/useJoinRequests';
import { useRequestTypesQuery } from '@/api/hooks/useRequestTypes';
import { isBranchManagerOnly } from '@/api/axiosInstance';
import useLocale from '@/utils/hooks/global/useLocale';
import i18next from 'i18next';
import Loader from '@/components/common/Loader';
import Table from '@/components/common/table/Table';
import { joinRequestsColumns, filtersDefaultValues } from './configs';
import useFiltering from '@/utils/hooks/global/useFiltering';
import Filters from './Filters';
import { useSearchParams } from 'react-router-dom';
import useIsOpen from '@/utils/hooks/global/useIsOpen';
import ViewJoinRequest from './ViewJoinRequest';
import { getOriginalObject } from '@/utils/helpers/global.fns';

export default function JoinRequests() {
    const branchManagerOnly = isBranchManagerOnly();
    const { isOpen, toggle } = useIsOpen();
    const [searchParams, setSearchParams] = useSearchParams();
    const { pagination, handleFilter, filters, setter, setFilters } =
        useFiltering(filtersDefaultValues);
    // Branch manager: do not call dashboard request-types API (403). Use front join-requests only.
    const { data: requestTypesData, isLoading: isLoadingRequestTypes } = useRequestTypesQuery(
        {},
        { enabled: !branchManagerOnly }
    );
    const { t } = useLocale();

    // Get request types for tabs
    const requestTypes = useMemo(() => {
        if (!requestTypesData?.data) return [];
        return requestTypesData.data.map(type => ({
            id: type.id,
            name: typeof type.name === 'string' 
                ? type.name 
                : type.name?.[i18next.language] || type.name?.en || type.name?.ar || `Request Type ${type.id}`
        }));
    }, [requestTypesData]);

    // Get selected request_type_id from URL or default to first request type
    const selectedRequestTypeId = useMemo(() => {
        if (requestTypes.length === 0) return null;
        
        const urlParam = searchParams.get('request_type_id');
        if (urlParam) {
            const id = parseInt(urlParam);
            if (!isNaN(id) && requestTypes.some(rt => rt.id === id)) {
                return id;
            }
        }
        return requestTypes.length > 0 ? requestTypes[0].id : null;
    }, [searchParams, requestTypes]);

    // Track if filters have been initialized with request_type_id
    const [filtersInitialized, setFiltersInitialized] = React.useState(false);

    // Branch manager: no request-types from dashboard; mark ready so we can fetch join requests from front
    useEffect(() => {
        if (branchManagerOnly && !filtersInitialized) {
            setFiltersInitialized(true);
        }
    }, [branchManagerOnly, filtersInitialized]);

    // Initialize URL and filters when request types are loaded (super admin only)
    useEffect(() => {
        if (!branchManagerOnly && requestTypes.length > 0 && selectedRequestTypeId && !filtersInitialized) {
            const urlParam = searchParams.get('request_type_id');
            const urlRequestTypeId = urlParam ? parseInt(urlParam) : null;
            
            if (selectedRequestTypeId !== urlRequestTypeId) {
                setSearchParams({ request_type_id: selectedRequestTypeId.toString() }, { replace: true });
            }
            
            setFilters(prev => ({ ...prev, request_type_id: selectedRequestTypeId }));
            setFiltersInitialized(true);
        }
    }, [branchManagerOnly, requestTypes.length, selectedRequestTypeId, filtersInitialized, setSearchParams, setFilters]);

    // Only call join requests API when ready. Branch manager: no request_type_id needed (front API). Others: need request type.
    const shouldFetchJoinRequests = branchManagerOnly
        ? filtersInitialized
        : !isLoadingRequestTypes && filtersInitialized && selectedRequestTypeId !== null && filters.request_type_id === selectedRequestTypeId;
    const { data, isLoading, refresh } = useJoinRequestsQuery(filters, { enabled: shouldFetchJoinRequests });

    // Create a map of request type IDs to names
    const requestTypesMap = useMemo(() => {
        const map = {};
        requestTypes.forEach(type => {
            map[type.id] = type.name;
        });
        return map;
    }, [requestTypes]);

    // Handle tab change
    const handleTabChange = (requestTypeId) => {
        setSearchParams({ request_type_id: requestTypeId.toString() }, { replace: true });
        setFilters(prev => ({ ...prev, request_type_id: requestTypeId }));
    };

    // Show loader: branch manager = until filters initialized; others = until request types loaded and filters initialized
    if (!filtersInitialized || (!branchManagerOnly && isLoadingRequestTypes)) return <Loader />;

    const columns = joinRequestsColumns(requestTypesMap);

    return (
        <div>
            {/* Request Type Tabs: parent width, horizontal scroll only */}
            {requestTypes.length > 0 && (
                <div className="mb-6 min-w-0 w-full">
                    <div className="border-b border-gray-200 overflow-x-auto overflow-y-hidden custom-scrollbar-horizontal">
                        <nav className="-mb-px flex space-x-8 min-w-max pb-px" aria-label="Tabs">
                            {requestTypes.map((requestType) => (
                                <button
                                    key={requestType.id}
                                    onClick={() => handleTabChange(requestType.id)}
                                    className={`
                                        whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors flex-shrink-0
                                        ${selectedRequestTypeId === requestType.id
                                            ? 'border-primary-500 text-primary-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }
                                    `}
                                >
                                    {requestType.name}
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>
            )}

            <Table
                title={t('table_titles.join_requests')}
                refresh={refresh}
                loading={isLoading}
                data={data?.data || []}
                serverPagination={true}
                totalCount={data?.meta?.total}
                columns={columns}
                pagination={pagination}
                setPagination={setter('pagination')}
                Filters={
                    <Filters filters={filters} handleFilter={handleFilter} />
                }
                setFilters={setFilters}
                filters={filters}
                toggleModals={toggle}
                enableEdit={false}
                enableDelete={false}
            />
            {isOpen.view && (
                <ViewJoinRequest
                    onClose={toggle.view}
                    oldData={getOriginalObject(isOpen.view, data?.data || [])}
                />
            )}
        </div>
    );
}

