import React, { useMemo, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useAllJoinRequestsQuery } from '@/api/hooks/useJoinRequests';
import { useRequestTypesQuery } from '@/api/hooks/useRequestTypes';
import { isBranchManagerOnly } from '@/api/axiosInstance';
import useLocale from '@/utils/hooks/global/useLocale';
import i18next from 'i18next';
import Loader from '@/components/common/Loader';
import Table from '@/components/common/table/Table';
import { joinRequestsColumns, filtersDefaultValues } from './configs';
import useFiltering from '@/utils/hooks/global/useFiltering';
import Filters from './Filters';
import useIsOpen from '@/utils/hooks/global/useIsOpen';
import ViewJoinRequest from './ViewJoinRequest';
import { getOriginalObject } from '@/utils/helpers/global.fns';
import {
    buildRequestTypesMap,
    getRequestTypeIdsByCategory,
    getRequestTypesForCategory
} from './joinRequestTypeDisplay';

const VALID_CATEGORIES = ['entities', 'teachers', 'supervisors'];

export default function JoinRequests() {
    const branchManagerOnly = isBranchManagerOnly();
    const { category: urlCategory } = useParams();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const { isOpen, toggle } = useIsOpen();
    const { pagination, handleFilter, filters, setter, setFilters } =
        useFiltering(filtersDefaultValues);
    const { data: requestTypesData, isLoading: isLoadingRequestTypes } = useRequestTypesQuery(
        {},
        { enabled: !branchManagerOnly }
    );
    const { t } = useLocale();

    const category = VALID_CATEGORIES.includes(urlCategory) ? urlCategory : null;

    useEffect(() => {
        if (urlCategory && !VALID_CATEGORIES.includes(urlCategory)) {
            navigate('/join-requests/entities', { replace: true });
            return;
        }
        if (!urlCategory) {
            navigate('/join-requests/entities', { replace: true });
        }
    }, [urlCategory, navigate]);

    const [filtersInitialized, setFiltersInitialized] = React.useState(false);

    useEffect(() => {
        if (branchManagerOnly && !filtersInitialized) {
            setFiltersInitialized(true);
        }
    }, [branchManagerOnly, filtersInitialized]);

    useEffect(() => {
        if (category) {
            setFiltersInitialized(true);
        }
    }, [category]);

    const fetchFilters = useMemo(
        () => ({
            search: filters.search
        }),
        [filters.search]
    );

    const shouldFetchJoinRequests = Boolean(
        filtersInitialized &&
            category &&
            (branchManagerOnly || !isLoadingRequestTypes)
    );

    const { data, isLoading, refresh } = useAllJoinRequestsQuery(fetchFilters, {
        enabled: shouldFetchJoinRequests
    }, {
        mode: 'all'
    });

    const discoverableJoinRequests = useMemo(
        () => data?.data || [],
        [data?.data]
    );

    const requestTypeIds = useMemo(
        () => getRequestTypeIdsByCategory(requestTypesData, category, discoverableJoinRequests),
        [requestTypesData, category, discoverableJoinRequests]
    );

    const categoryRequestTypes = useMemo(
        () => getRequestTypesForCategory(
            requestTypesData,
            category,
            requestTypeIds,
            discoverableJoinRequests,
            i18next.language
        ),
        [requestTypesData, category, requestTypeIds, discoverableJoinRequests]
    );

    const categoryRequestTypeIdsSet = useMemo(
        () => new Set(requestTypeIds.map(id => Number(id))),
        [requestTypeIds]
    );

    const selectedRequestTypeId = useMemo(() => {
        const urlId = searchParams.get('request_type_id');
        if (urlId) {
            const id = parseInt(urlId, 10);
            if (!Number.isNaN(id) && requestTypeIds.includes(id)) return id;
        }
        return categoryRequestTypes.length > 0 ? categoryRequestTypes[0].id : null;
    }, [searchParams, requestTypeIds, categoryRequestTypes]);

    useEffect(() => {
        if (categoryRequestTypes.length > 0 && selectedRequestTypeId !== null) {
            const urlId = searchParams.get('request_type_id');
            const currentId = urlId ? parseInt(urlId, 10) : null;
            if (currentId !== selectedRequestTypeId) {
                setSearchParams({ request_type_id: String(selectedRequestTypeId) }, { replace: true });
            }
            setFilters((prev) => ({ ...prev, request_type_id: selectedRequestTypeId }));
        }
    }, [
        categoryRequestTypes.length,
        searchParams,
        selectedRequestTypeId,
        setFilters,
        setSearchParams
    ]);

    const filteredJoinRequests = useMemo(() => {
        const allJoinRequests = data?.data || [];

        return allJoinRequests.filter(item => {
            const requestTypeId = Number(item?.request_type_id);

            if (!categoryRequestTypeIdsSet.has(requestTypeId)) {
                return false;
            }

            if (selectedRequestTypeId == null) {
                return true;
            }

            return requestTypeId === Number(selectedRequestTypeId);
        });
    }, [data?.data, categoryRequestTypeIdsSet, selectedRequestTypeId]);

    const pendingLookupFilters = useMemo(() => ({
        search: fetchFilters.search
    }), [fetchFilters.search]);
    const { data: pendingData } = useAllJoinRequestsQuery(pendingLookupFilters, {
        enabled: shouldFetchJoinRequests && branchManagerOnly
    }, {
        mode: 'pending'
    });
    const actionableRequestIds = useMemo(() => {
        if (!branchManagerOnly) return null;
        return new Set(
            (pendingData?.data || [])
                .filter(item => {
                    const requestTypeId = Number(item?.request_type_id);
                    if (!categoryRequestTypeIdsSet.has(requestTypeId)) {
                        return false;
                    }

                    if (selectedRequestTypeId == null) {
                        return true;
                    }

                    return requestTypeId === Number(selectedRequestTypeId);
                })
                .map(item => item.id)
        );
    }, [
        branchManagerOnly,
        pendingData?.data,
        categoryRequestTypeIdsSet,
        selectedRequestTypeId
    ]);

    const requestTypesMap = useMemo(
        () => buildRequestTypesMap(
            categoryRequestTypes,
            discoverableJoinRequests,
            i18next.language,
            requestTypesData
        ),
        [categoryRequestTypes, discoverableJoinRequests, requestTypesData]
    );

    const handleTabChange = (requestTypeId) => {
        setSearchParams({ request_type_id: String(requestTypeId) }, { replace: true });
        setFilters((prev) => ({ ...prev, request_type_id: requestTypeId }));
    };

    if (!category || !filtersInitialized || (!branchManagerOnly && isLoadingRequestTypes)) {
        return <Loader />;
    }

    const columns = joinRequestsColumns(requestTypesMap, i18next.language);
    const tableTitle =
        category === 'entities'
            ? t('sidebar.join_requests_entities')
            : category === 'teachers'
              ? t('sidebar.join_requests_teachers')
              : t('sidebar.join_requests_supervisors');

    return (
        <div>
            {categoryRequestTypes.length > 0 && (
                <div className="mb-6 min-w-0 w-full">
                    <div className="border-b border-gray-200 overflow-x-auto overflow-y-hidden custom-scrollbar-horizontal">
                        <nav className="-mb-px flex space-x-8 min-w-max pb-px" aria-label="Tabs">
                            {categoryRequestTypes.map((requestType) => (
                                <button
                                    key={requestType.id}
                                    type="button"
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
                resource="join_requests"
                title={tableTitle}
                refresh={refresh}
                loading={isLoading}
                data={filteredJoinRequests}
                serverPagination={false}
                totalCount={filteredJoinRequests.length}
                columns={columns}
                pagination={pagination}
                setPagination={setter('pagination')}
                Filters={<Filters filters={filters} handleFilter={handleFilter} />}
                setFilters={setFilters}
                filters={filters}
                toggleModals={toggle}
                enableEdit={false}
                enableDelete={false}
            />
            {isOpen.view && (
                <ViewJoinRequest
                    onClose={toggle.view}
                    oldData={getOriginalObject(isOpen.view, filteredJoinRequests)}
                    isReadOnly={branchManagerOnly && !actionableRequestIds?.has(isOpen.view?.id)}
                />
            )}
        </div>
    );
}
