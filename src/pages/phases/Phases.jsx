import React, { useMemo, useEffect } from 'react';
import { usePhasesQuery, useUpdatePhaseMutation } from '@/api/hooks/usePhases';
import { useRequestTypesQuery } from '@/api/hooks/useRequestTypes';
import useLocale from '@/utils/hooks/global/useLocale';
import i18next from 'i18next';
import Loader from '@/components/common/Loader';
import Table from '@/components/common/table/Table';
import { phasesColumns, filtersDefaultValues } from './configs';
import ActiveCell from '@/components/common/table/cells/ActiveCell';
import Cell from '@/components/common/table/cells/Cell';
import useIsOpen from '@/utils/hooks/global/useIsOpen';
import CreatePhase from './CreatePhase';
import EditPhase from './EditPhase';
import DeletePhase from './DeletePhase';
import ViewPhase from './ViewPhase';
import { getOriginalObject } from '@/utils/helpers/global.fns';
import useFiltering from '@/utils/hooks/global/useFiltering';
import Filters from './Filters';
import { useSearchParams } from 'react-router-dom';
import StepsList from './StepsList';

export default function Phases() {
    const { isOpen, toggle } = useIsOpen();
    const [searchParams, setSearchParams] = useSearchParams();
    const { pagination, handleFilter, filters, setter, setFilters } =
        useFiltering(filtersDefaultValues);
    const { data: requestTypesData, isLoading: isLoadingRequestTypes } = useRequestTypesQuery();
    const { mutate: updatePhase, isPending } = useUpdatePhaseMutation();
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
        // Wait for request types to load
        if (requestTypes.length === 0) return null;
        
        const urlParam = searchParams.get('request_type_id');
        if (urlParam) {
            const id = parseInt(urlParam);
            if (!isNaN(id) && requestTypes.some(rt => rt.id === id)) {
                return id;
            }
        }
        // Default to first request type if available
        return requestTypes.length > 0 ? requestTypes[0].id : null;
    }, [searchParams, requestTypes]);

    // Track if filters have been initialized with request_type_id
    const [filtersInitialized, setFiltersInitialized] = React.useState(false);

    // Initialize URL and filters when request types are loaded
    useEffect(() => {
        if (requestTypes.length > 0 && selectedRequestTypeId && !filtersInitialized) {
            const urlParam = searchParams.get('request_type_id');
            const urlRequestTypeId = urlParam ? parseInt(urlParam) : null;
            
            // Update URL if it's not set or invalid
            if (selectedRequestTypeId !== urlRequestTypeId) {
                setSearchParams({ request_type_id: selectedRequestTypeId.toString() }, { replace: true });
            }
            
            // Update filters to send to API (server-side filtering)
            setFilters(prev => ({ ...prev, request_type_id: selectedRequestTypeId }));
            setFiltersInitialized(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [requestTypes.length, selectedRequestTypeId, filtersInitialized]); // Only run when request types are loaded or selectedRequestTypeId changes

    // Only call phases API when request types are loaded, filters are initialized, and request_type_id is set
    const shouldFetchPhases = !isLoadingRequestTypes && filtersInitialized && selectedRequestTypeId !== null && filters.request_type_id === selectedRequestTypeId;
    const { data, isLoading, refresh } = usePhasesQuery(filters, { enabled: shouldFetchPhases });

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

    // Get all phases sorted by order (server already filters by request_type_id)
    const allPhases = useMemo(() => {
        if (!data?.data) return [];
        const phases = [...data.data];
        // Sort by order
        return phases.sort((a, b) => a.order - b.order);
    }, [data]);

    // Create a map of original phases by ID for efficient lookup
    const originalPhasesMap = useMemo(() => {
        const map = new Map();
        allPhases.forEach(phase => {
            map.set(phase.id, phase);
        });
        return map;
    }, [allPhases]);

    // Transform the data to match form expectations
    const formData = data?.data?.map(item => ({
        ...item
    }));

    // Render expanded row content
    const renderExpandedRow = (phase) => {
        return (
            <StepsList 
                steps={phase.steps} 
                phaseId={phase.id}
                requestTypeId={selectedRequestTypeId}
                onReorderComplete={refresh}
            />
        );
    };

    // Handle save order - called automatically after each drag
    const handleSaveOrder = (movedPhase, newOrder, onComplete) => {
        if (!movedPhase) {
            if (onComplete) onComplete();
            return;
        }

        // Check if order actually changed
        const originalPhase = originalPhasesMap.get(movedPhase.id);
        if (!originalPhase || originalPhase.order === newOrder) {
            if (onComplete) onComplete();
            return;
        }

        // Update only the moved phase
        const phaseData = {
            id: movedPhase.id,
            request_type_id: movedPhase.request_type_id,
            name: movedPhase.name,
            order: newOrder,
            status: movedPhase.status
        };

        updatePhase(phaseData, {
            onSuccess: () => {
                // Query invalidation will automatically trigger refetch
                // Clear optimistic state - it will be replaced by fresh data
                if (onComplete) onComplete();
            },
            onError: () => {
                // On error, refresh to revert optimistic update
                refresh();
                if (onComplete) onComplete();
            }
        });
    };

    // Show loader while request types are loading or filters are being initialized
    if (isLoadingRequestTypes || !filtersInitialized) return <Loader />;
    
    // Show loader while phases are loading
    if (isLoading) return <Loader />;

    const columns = phasesColumns(requestTypesMap);

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
                resource="phases"
                title={t('table_titles.phases')}
                refresh={refresh}
                loading={isLoading}
                data={allPhases}
                serverPagination={true}
                totalCount={data?.meta?.total}
                columns={columns}
                toggleModals={toggle}
                pagination={pagination}
                setPagination={setter('pagination')}
                Filters={
                    <Filters filters={filters} handleFilter={handleFilter} />
                }
                setFilters={setFilters}
                filters={filters}
                // Expandable rows props
                enableExpandableRows={true}
                renderExpandedRow={renderExpandedRow}
                getRowId={(row) => row.id.toString()}
                // Drag and drop props
                enableDragAndDrop={true}
                orderField="order"
                onSaveOrder={handleSaveOrder}
            />
            {isOpen.add && <CreatePhase onClose={toggle.add} />}
            {isOpen.edit && (
                <EditPhase
                    onClose={toggle.edit}
                    oldData={getOriginalObject(isOpen.edit, formData)}
                />
            )}
            {isOpen.view && (
                <ViewPhase
                    onClose={toggle.view}
                    oldData={getOriginalObject(isOpen.view, formData)}
                />
            )}
            {isOpen.delete && (
                <DeletePhase
                    onClose={toggle.delete}
                    id={isOpen.delete?.id}
                />
            )}
        </div>
    );
}
