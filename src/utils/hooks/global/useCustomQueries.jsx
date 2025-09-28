import { useQueries } from '@tanstack/react-query';

export default function useCustomQueries(queries, options = {}) {
    const {
        staleTime = 1000 * 60 * 5, // 5 minutes
        cacheTime = 1000 * 60 * 10, // 10 minutes
        retry = 3,
        retryDelay = 1000,
        refetchOnWindowFocus = false,
        refetchOnMount = true,
        refetchOnReconnect = true,
        ...globalOptions
    } = options;

    // Enhance each query with defaults
    const enhancedQueries = queries.map(query => ({
        queryKey: Array.isArray(query.queryKey)
            ? query.queryKey
            : [query.queryKey],
        staleTime,
        cacheTime,
        retry,
        retryDelay,
        refetchOnWindowFocus,
        refetchOnMount,
        refetchOnReconnect,
        ...globalOptions,
        ...query // Query-specific options override globals
    }));

    const results = useQueries({
        queries: enhancedQueries
    });

    // Enhanced results with utilities
    const enhancedResults = results.map((result, index) => ({
        ...result,
        // Additional utility properties
        isEmpty:
            !result.data ||
            (Array.isArray(result.data) && result.data.length === 0),
        isInitialLoading: result.isLoading && result.isInitialLoading,
        hasData: !!result.data,

        // Utility methods
        refresh: () => result.refetch(),
        invalidate: () =>
            result.queryClient?.invalidateQueries(
                enhancedQueries[index].queryKey
            ),
        reset: () =>
            result.queryClient?.resetQueries(enhancedQueries[index].queryKey),

        // State helpers
        isLoadingInitial: result.isLoading && !result.data,
        isRefetching: result.isLoading && !!result.data,

        // Error helpers
        errorMessage: result.error?.message || result.error || null,
        hasError: !!result.error,

        // Status helpers
        isStale: result.status === 'success' && result.isStale,
        isBackground: result.isFetching && !result.isLoading
    }));

    // Global utilities for all queries
    const globalUtils = {
        // Check if any query is loading
        isAnyLoading: results.some(q => q.isLoading),

        // Check if all queries are loading
        areAllLoading: results.every(q => q.isLoading),

        // Check if any query has error
        hasAnyError: results.some(q => q.isError),

        // Check if all queries have errors
        haveAllErrors: results.every(q => q.isError),

        // Check if all queries are successful
        areAllSuccessful: results.every(q => q.isSuccess),

        // Check if any query is successful
        isAnySuccessful: results.some(q => q.isSuccess),

        // Get all errors
        errors: results.filter(q => q.isError).map(q => q.error),

        // Get all data
        data: results.map(q => q.data),

        // Get successful data only
        successfulData: results.filter(q => q.isSuccess).map(q => q.data),

        // Refresh all queries
        refreshAll: () => results.forEach(q => q.refetch()),

        // Get loading count
        loadingCount: results.filter(q => q.isLoading).length,

        // Get error count
        errorCount: results.filter(q => q.isError).length,

        // Get success count
        successCount: results.filter(q => q.isSuccess).length,

        // Get completion percentage
        completionPercentage: Math.round(
            (results.filter(q => !q.isLoading).length / results.length) * 100
        ),

        // Check if all queries are done (success or error)
        areAllDone: results.every(q => !q.isLoading)
    };

    return {
        queries: enhancedResults,
        ...globalUtils
    };
}

// const { queries, isAnyLoading, areAllSuccessful, data } = useCustomQueries([
//   {
//     queryKey: ['users'],
//     queryFn: fetchUsers,
//   },
//   {
//     queryKey: ['posts'],
//     queryFn: fetchPosts,
//     enabled: !!user,
//   },
//   {
//     queryKey: ['comments'],
//     queryFn: fetchComments,
//     ...QueryPresets.realtime
//   }
// ]);

// const [usersQuery, postsQuery, commentsQuery] = queries;
