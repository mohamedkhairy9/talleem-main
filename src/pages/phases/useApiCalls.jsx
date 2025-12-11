import { useRequestTypesQuery } from '@/api/hooks/useRequestTypes';
import i18next from 'i18next';

export default function useApiCalls({ apiCalls }) {
    const { data: requestTypesData, isLoading: requestTypesLoading } = useRequestTypesQuery();

    // Transform request types data to options format
    const requestTypesOptions = requestTypesData?.data?.map(type => {
        const name = typeof type.name === 'string' 
            ? type.name 
            : type.name?.[i18next.language] || type.name?.en || type.name?.ar || `Request Type ${type.id}`;
        return {
            id: type.id,
            name: name
        };
    });

    return {
        requestTypesData: requestTypesOptions ? { data: requestTypesOptions } : null,
        isLoading: requestTypesLoading
    };
}

