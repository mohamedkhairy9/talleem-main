import React, { useMemo } from 'react';
import FormPhase from './FormPhase';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import { useCreatePhaseMutation } from '@/api/hooks/usePhases';
import { enabledDisabledOptions } from '@/utils/constants/options';
import useApiCalls from './useApiCalls';
import Loader from '@/components/common/Loader';
import { apiCalls } from './configs';
import { usePhasesQuery } from '@/api/hooks/usePhases';
import { useSearchParams } from 'react-router-dom';
import { useRequestTypesQuery } from '@/api/hooks/useRequestTypes';

export default function CreatePhase({ onClose }) {
    const { mutate, isPending } = useCreatePhaseMutation();
    const [searchParams] = useSearchParams();
    const { data: requestTypesData, isLoading: isLoadingRequestTypes } = useRequestTypesQuery();
    const { requestTypesData: requestTypesOptions, isLoading: isLoadingApiCalls } = useApiCalls({ apiCalls });

    // Get selected request_type_id from URL or default to first request type
    const selectedRequestTypeId = useMemo(() => {
        if (!requestTypesData?.data || requestTypesData.data.length === 0) return null;
        
        const urlParam = searchParams.get('request_type_id');
        if (urlParam) {
            const id = parseInt(urlParam);
            if (!isNaN(id) && requestTypesData.data.some(rt => rt.id === id)) {
                return id;
            }
        }
        // Default to first request type if available
        return requestTypesData.data.length > 0 ? requestTypesData.data[0].id : null;
    }, [searchParams, requestTypesData]);

    // Fetch phases filtered by request_type_id
    const phasesFilters = useMemo(() => {
        if (!selectedRequestTypeId) return {};
        return { request_type_id: selectedRequestTypeId };
    }, [selectedRequestTypeId]);

    const { data: phasesData, isLoading: isLoadingPhases } = usePhasesQuery(phasesFilters, { 
        enabled: selectedRequestTypeId !== null 
    });

    // Calculate the next order number based on phases for the current request_type_id
    const nextOrder = useMemo(() => {
        // If we don't have a selected request type yet, default to 1
        if (!selectedRequestTypeId) return 1;
        
        // If phases are still loading, default to 1 (will be updated when data loads)
        if (isLoadingPhases || !phasesData?.data) return 1;
        
        // Filter phases by request_type_id (should already be filtered by API, but double-check)
        const filteredPhases = phasesData.data.filter(p => p.request_type_id === selectedRequestTypeId);
        
        if (filteredPhases.length === 0) return 1;
        
        const maxOrder = Math.max(...filteredPhases.map(p => p.order || 0));
        return maxOrder + 1;
    }, [phasesData, selectedRequestTypeId, isLoadingPhases]);

    // Wait for phases to load if we have a selected request type (to calculate correct order)
    const shouldWaitForPhases = selectedRequestTypeId !== null && isLoadingPhases;
    const isLoading = isLoadingRequestTypes || isLoadingApiCalls || shouldWaitForPhases;
    if (isLoading) return <Loader />;

    return (
        <Modal onClose={onClose}>
            <ModalHeader onClose={onClose} header="phases.create" />
            <FormPhase
                mutate={mutate}
                isPending={isPending}
                onClose={onClose}
                options={{
                    status: enabledDisabledOptions,
                    request_type_id: requestTypesOptions?.data
                }}
                oldData={{ 
                    status: true,
                    order: nextOrder
                }}
            />
        </Modal>
    );
}

