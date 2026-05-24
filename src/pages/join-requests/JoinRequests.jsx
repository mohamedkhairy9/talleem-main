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

const VALID_CATEGORIES = ['entities', 'teachers', 'supervisors'];

/** Fallback IDs when request types API is not available (e.g. branch manager). From request types sample. */
const FALLBACK_IDS = {
    entities: [3, 10, 11, 12, 13],
    teachers: [1, 7, 8, 9],
    supervisors: [2, 4, 5, 6]
};

function normalizeRequestTypeText(value) {
    return String(value ?? '')
        .trim()
        .toLowerCase()
        .replace(/[أإآ]/g, 'ا')
        .replace(/ؤ/g, 'و')
        .replace(/ئ/g, 'ي')
        .replace(/ة/g, 'ه')
        .replace(/ى/g, 'ي')
        .replace(/[_-]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

function getRequestTypeTexts(requestType) {
    const rawName = requestType?.name;
    const values =
        typeof rawName === 'object'
            ? [rawName?.en, rawName?.ar]
            : [rawName];

    return [...new Set(values.map(normalizeRequestTypeText).filter(Boolean))];
}

function resolveRequestTypeCategory(requestType) {
    const texts = getRequestTypeTexts(requestType);

    if (
        texts.some(
            text => text.includes('teacher') || text.includes('معلم') || text.includes('مدرس')
        )
    ) {
        return 'teachers';
    }

    if (texts.some(text => text.includes('student') || text.includes('طالب'))) {
        return 'supervisors';
    }

    if (texts.some(text => text.includes('entity') || text.includes('جهه') || text.includes('جهة'))) {
        return 'entities';
    }

    return null;
}

/** Map request types to category by actual request type labels across English and Arabic. */
function getRequestTypeIdsByCategory(requestTypesData, category) {
    if (!category) return [];
    if (requestTypesData?.data?.length) {
        const matchingIds = requestTypesData.data
            .filter(requestType => resolveRequestTypeCategory(requestType) === category)
            .map(requestType => requestType.id);

        if (matchingIds.length > 0) {
            return matchingIds;
        }
    }
    return FALLBACK_IDS[category] || [];
}

/** Get request type objects for the current category only (for tabs). */
function getRequestTypesForCategory(requestTypesData, category, requestTypeIds) {
    if (!category || requestTypeIds.length === 0) return [];
    if (requestTypesData?.data?.length) {
        const idSet = new Set(requestTypeIds);
        return requestTypesData.data
            .filter((t) => idSet.has(t.id))
            .map((type) => ({
                id: type.id,
                name:
                    typeof type.name === 'string'
                        ? type.name
                        : type.name?.[i18next.language] || type.name?.en || type.name?.ar || `Request Type ${type.id}`
            }));
    }
    return requestTypeIds.map((id) => ({ id, name: `Request Type ${id}` }));
}

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

    const requestTypeIds = useMemo(
        () => getRequestTypeIdsByCategory(requestTypesData, category),
        [requestTypesData, category]
    );

    const categoryRequestTypes = useMemo(
        () => getRequestTypesForCategory(requestTypesData, category, requestTypeIds),
        [requestTypesData, category, requestTypeIds]
    );
    const categoryRequestTypeIdsSet = useMemo(
        () => new Set(requestTypeIds.map(id => Number(id))),
        [requestTypeIds]
    );

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
    }, [categoryRequestTypes.length, selectedRequestTypeId]);

    const fetchFilters = useMemo(
        () => ({
            search: filters.search
        }),
        [filters.search]
    );

    const shouldFetchJoinRequests = Boolean(
        filtersInitialized &&
            category &&
            (branchManagerOnly || !isLoadingRequestTypes) &&
            selectedRequestTypeId !== null
    );

    const { data, isLoading, refresh } = useAllJoinRequestsQuery(fetchFilters, {
        enabled: shouldFetchJoinRequests
    }, {
        mode: 'all'
    });
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

    const requestTypesMap = useMemo(() => {
        const map = {};
        categoryRequestTypes.forEach((type) => {
            map[type.id] = type.name;
        });
        requestTypesData?.data?.forEach((type) => {
            const name =
                typeof type.name === 'object'
                    ? type.name?.[i18next.language] || type.name?.en || type.name?.ar
                    : type.name;
            if (name) map[type.id] = name;
        });
        return map;
    }, [categoryRequestTypes, requestTypesData?.data]);

    const handleTabChange = (requestTypeId) => {
        setSearchParams({ request_type_id: String(requestTypeId) }, { replace: true });
        setFilters((prev) => ({ ...prev, request_type_id: requestTypeId }));
    };

    if (!category || !filtersInitialized || (!branchManagerOnly && isLoadingRequestTypes)) {
        return <Loader />;
    }

    const columns = joinRequestsColumns(requestTypesMap);
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
