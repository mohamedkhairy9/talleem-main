import { useQuery } from '@tanstack/react-query';

export default function useCustomQuery({
    queryKey,
    queryFn,
    enabled = true,
    staleTime = 1000 * 60 * 5, // 5 minutes
    cacheTime = 1000 * 60 * 10, // 10 minutes
    retry = 0,
    retryDelay = 1000,
    refetchOnMount = true,
    refetchOnWindowFocus = false,
    refetchOnReconnect = true,
    onSuccess,
    onError,
    onSettled,
    select,
    meta,
    ...restOptions
}) {
    const query = useQuery({
        queryKey: Array.isArray(queryKey) ? queryKey : [queryKey],
        queryFn,
        enabled,
        staleTime,
        cacheTime,
        retry,
        retryDelay,
        refetchOnMount,
        refetchOnWindowFocus,
        refetchOnReconnect,
        onSuccess,
        onError,
        onSettled,
        select,
        meta,
        ...restOptions
    });

    return {
        ...query,
        // Additional utility properties
        isEmpty:
            !query.data ||
            (Array.isArray(query.data) && query.data.length === 0),
        isInitialLoading: query.isLoading && query.isInitialLoading,
        hasData: !!query.data,

        // Utility methods
        refresh: () => query.refetch(),
        invalidate: () => query.queryClient?.invalidateQueries(query.queryKey),
        reset: () => query.queryClient?.resetQueries(query.queryKey),

        // State helpers
        isLoadingInitial: query.isLoading && !query.data,
        isRefetching: query.isLoading && !!query.data,

        // Error helpers
        errorMessage: query.error?.message || query.error || null,
        hasError: !!query.error,

        // Status helpers
        isStale: query.status === 'success' && query.isStale,
        isBackground: query.isFetching && !query.isLoading
    };
}
