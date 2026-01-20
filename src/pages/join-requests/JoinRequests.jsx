import React, { useMemo, useEffect } from 'react';
import { useJoinRequestsQuery } from '@/api/hooks/useJoinRequests';
import { useRequestTypesQuery } from '@/api/hooks/useRequestTypes';
import useLocale from '@/utils/hooks/global/useLocale';
import i18next from 'i18next';
import Loader from '@/components/common/Loader';
import Table from '@/components/common/table/Table';
import { joinRequestsColumns, filtersDefaultValues } from './configs';
import useFiltering from '@/utils/hooks/global/useFiltering';
import Filters from './Filters';
import { useSearchParams } from 'react-router-dom';

export default function JoinRequests() {
    const [searchParams, setSearchParams] = useSearchParams();
    const { pagination, handleFilter, filters, setter, setFilters } =
        useFiltering(filtersDefaultValues);
    const { data: requestTypesData, isLoading: isLoadingRequestTypes } = useRequestTypesQuery();
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

    // Initialize URL and filters when request types are loaded
    useEffect(() => {
        if (requestTypes.length > 0 && selectedRequestTypeId && !filtersInitialized) {
            const urlParam = searchParams.get('request_type_id');
            const urlRequestTypeId = urlParam ? parseInt(urlParam) : null;
            
            if (selectedRequestTypeId !== urlRequestTypeId) {
                setSearchParams({ request_type_id: selectedRequestTypeId.toString() }, { replace: true });
            }
            
            setFilters(prev => ({ ...prev, request_type_id: selectedRequestTypeId }));
            setFiltersInitialized(true);
        }
    }, [requestTypes.length, selectedRequestTypeId, filtersInitialized, setSearchParams, setFilters]);

    // Only call join requests API when request types are loaded, filters are initialized, and request_type_id is set
    const shouldFetchJoinRequests = !isLoadingRequestTypes && filtersInitialized && selectedRequestTypeId !== null && filters.request_type_id === selectedRequestTypeId;
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

    // Show loader while request types are loading or filters are being initialized
    if (isLoadingRequestTypes || !filtersInitialized) return <Loader />;

    const columns = joinRequestsColumns(requestTypesMap);

    return (
        <div>
            {/* Request Type Tabs */}
            {requestTypes.length > 0 && (
                <div className="mb-6">
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                            {requestTypes.map((requestType) => (
                                <button
                                    key={requestType.id}
                                    onClick={() => handleTabChange(requestType.id)}
                                    className={`
                                        whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors
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
            />
        </div>
    );
}

