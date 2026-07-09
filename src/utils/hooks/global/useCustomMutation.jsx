import { useMutation, useQueryClient } from '@tanstack/react-query';
import { successHandler, errorHandler } from '../../../api/handler';

export default function useCustomMutation({
    mutationFn,
    mutationKey,
    queryKeys = [],
    onSuccess,
    onError,
    onSettled,
    onMutate,
    showSuccessToast = true,
    showErrorToast = true
}) {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn,
        mutationKey,
        onMutate,

        onSuccess: (data, variables, context) => {
            console.log('data', data);
            
            if (queryKeys && queryKeys.length > 0) {
                queryKeys.forEach(key => {
                    queryClient.invalidateQueries({ queryKey: [key] });
                });
            }
            if (onSuccess) {
                onSuccess(data, variables, context);
            }
            if (showSuccessToast) {
                successHandler(data.message || 'Success');
            }
        },

        onError: (error, variables, context) => {
            console.log('error', error);
            if (onError) {
                onError(error, variables, context);
            }
            if (showErrorToast) {
                errorHandler(error);
            }
        },

        onSettled: (data, error, variables, context) => {
            if (onSettled) {
                onSettled(data, error, variables, context);
            }
        }
    });

    return mutation;
}
