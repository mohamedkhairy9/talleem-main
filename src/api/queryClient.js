// queryClient.js
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
            refetchOnWindowFocus: true
        },
        mutations: {
            onError: error => {
                console.error('Mutation error:', error);
            }
        }
    }
});
