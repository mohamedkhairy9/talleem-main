import { useMutation, useQueryClient } from '@tanstack/react-query';
import { successHandler, errorHandler } from '../../../api/handler';

export default function useCustomMutation({
    mutationFn,
    mutationKey,
    queryKeys = [],
    onSuccess,
    onError,
    onSettled,
    onMutate
}) {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn,
        mutationKey,
        onMutate,

        onSuccess: (data, variables, context) => {
            console.log('data', data);
            
            if (queryKeys && queryKeys.length > 0) {
                console.log('queryKeys', queryKeys);
                queryKeys.forEach(key => {
                    queryClient.invalidateQueries({ queryKey: [key] });
                });
            }
            if (onSuccess) {
                onSuccess(data, variables, context);
            }
            successHandler(data.message || 'Success');
        },

        onError: (error, variables, context) => {
            console.log('error', error);
            if (onError) {
                onError(error, variables, context);
            }
            errorHandler(error);
        },

        onSettled: (data, error, variables, context) => {
            if (onSettled) {
                onSettled(data, error, variables, context);
            }
        }
    });

    return mutation;
}
