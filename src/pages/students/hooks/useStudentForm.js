import { useEffect, useMemo, useState, useRef, useCallback } from 'react';
import { useEntitiesQuery } from '@/api/hooks/useEntities';
import { useEntityQuery } from '@/api/hooks/useEntities';
import { allData } from '@/utils/constants/global.constants';
import calculateAge from '@/utils/helpers/ageCalculation';
import i18next from 'i18next';
import { entitiesService } from '@/api/services/entities.service';
import { createAsyncLoadOptionsWithIncluded } from '@/utils/helpers/asyncSelectHelpers';

// Helper to extract education entity type data from oldData
const extractEducationEntityTypeData = (oldData) => {
    if (!oldData?.education_program_entity_type_id) {
        return { id: null, classification: null, name: null };
    }
    const educationEntityType = oldData.education_program_entity_type_id;
    if (typeof educationEntityType === 'object' && educationEntityType !== null) {
        return {
            id: educationEntityType.id,
            classification: educationEntityType.educational_entity_classification,
            name: educationEntityType.name
        };
    }
    return { id: educationEntityType, classification: null, name: null };
};

export function useStudentForm({ oldData, editMode, viewMode, watch, setValue, parentInfoAgeThreshold }) {
    const lang = i18next.language;
    const previousParamsRef = useRef(null);
    const previousBranchIdRef = useRef(null);
    const previousMainProgramIdRef = useRef(null);

    // Profile picture state
    const [profileImagePreview, setProfileImagePreview] = useState(
        oldData?.profile_picture || null
    );
    const [profileImageChanged, setProfileImageChanged] = useState(false);

    // Extract education entity type info
    const educationEntityTypeInfo = useMemo(() =>
        extractEducationEntityTypeData(oldData),
        [oldData]
    );

    // Watch form values
    const mainProgramId = watch('main_program_id');
    const branchId = watch('branch_id');
    const entityId = watch('entity_id');
    const dateOfBirth = watch('date_of_birth');

    // Calculate age and determine if parent fields should be shown
    const studentAge = useMemo(() => calculateAge(dateOfBirth), [dateOfBirth]);
    const shouldShowParentFields =
        studentAge !== null && studentAge < parentInfoAgeThreshold;

    // Entities query - ONLY when both main_program_id AND branch_id are selected
    // In edit mode, use oldData values if form values are not set yet
    const entitiesQueryParams = useMemo(() => {
        const currentBranchId = branchId || (editMode ? oldData?.branch_id : null);
        const currentMainProgramId = mainProgramId || (editMode ? oldData?.main_program_id : null);
        
        // Only query when BOTH are selected
        if (!currentBranchId || !currentMainProgramId) {
            return null;
        }

        // Create params key to check if they've changed
        const paramsKey = `${currentBranchId}-${currentMainProgramId}`;
        
        // If params haven't changed, return previous params object (prevents re-query)
        if (previousParamsRef.current?.key === paramsKey && previousParamsRef.current?.params) {
            return previousParamsRef.current.params;
        }

        const params = {
            ...allData,
            branch_id: currentBranchId,
            main_program_id: currentMainProgramId
        };

        previousParamsRef.current = { key: paramsKey, params };
        return params;
    }, [branchId, mainProgramId, editMode, oldData?.branch_id, oldData?.main_program_id]);

    // Entities query - only enabled when we have both branch and program
    // Use empty object as fallback but ensure enabled is false when params are null
    const { data: entitiesData, isLoading: entitiesLoading } = useEntitiesQuery(
        entitiesQueryParams || {},
        {
            enabled: !!entitiesQueryParams && !!entitiesQueryParams.branch_id && !!entitiesQueryParams.main_program_id
        }
    );

    // Get entities from API response
    const entities = useMemo(() => {
        const fetchedEntities = entitiesData?.data || [];
        
        // In edit/view mode, include selected entity from oldData if it's not in fetched results
        if ((editMode || viewMode) && oldData?.entity_id && oldData?.entity) {
            const selectedEntity = oldData.entity;
            if (selectedEntity && !fetchedEntities.some(e => e.id === selectedEntity.id)) {
                return [selectedEntity, ...fetchedEntities];
            }
        }
        
        return fetchedEntities;
    }, [entitiesData?.data, editMode, viewMode, oldData?.entity_id, oldData?.entity]);

    const normalizedEntityId = useMemo(() => {
        if (entityId === undefined || entityId === null || entityId === '') return null;
        const parsedEntityId = Number(entityId);
        return Number.isNaN(parsedEntityId) ? null : parsedEntityId;
    }, [entityId]);

    const selectedEntity = useMemo(() => {
        if (!normalizedEntityId || !entities.length) return null;
        return entities.find(entity => entity.id === normalizedEntityId) || null;
    }, [normalizedEntityId, entities]);

    const { data: selectedEntityData } = useEntityQuery(normalizedEntityId, {
        enabled: !!normalizedEntityId && !selectedEntity
    });

    const resolvedSelectedEntity = selectedEntity || selectedEntityData?.data || selectedEntityData || null;

    // Get selected entity's education program entity type
    const selectedEntityEducationType = useMemo(() => {
        return resolvedSelectedEntity?.education_program_entity_type || null;
    }, [resolvedSelectedEntity]);

    // Get selected entity's memorization program entity type
    const selectedEntityMemorizationType = useMemo(() => {
        return resolvedSelectedEntity?.memorization_program_entity_type || null;
    }, [resolvedSelectedEntity]);

    // Clear entity when branch or main program changes (and fetch new entities)
    useEffect(() => {
        // Skip in view mode
        if (viewMode) return;

        const currentBranchId = branchId || (editMode ? oldData?.branch_id : null);
        const currentMainProgramId = mainProgramId || (editMode ? oldData?.main_program_id : null);

        // Check if branch changed
        const branchChanged = currentBranchId && currentBranchId !== previousBranchIdRef.current;
        // Check if main program changed
        const mainProgramChanged = currentMainProgramId && currentMainProgramId !== previousMainProgramIdRef.current;

        // Only clear entity if branch or program actually changed (not on initial load)
        if ((branchChanged || mainProgramChanged) && 
            (previousBranchIdRef.current !== null || previousMainProgramIdRef.current !== null)) {
            setValue('entity_id', '');
            setValue('entity_category_id', '');
            setValue('education_program_entity_type_classification', '');
            setValue('memorization_program_entity_type', '');
            setValue('memorization_program_entity_type_id', '');
        }

        // Update refs
        previousBranchIdRef.current = currentBranchId;
        previousMainProgramIdRef.current = currentMainProgramId;
    }, [branchId, mainProgramId, editMode, viewMode, oldData?.branch_id, oldData?.main_program_id, setValue]);

    // Auto-fill entity category and classification when entity is selected (CREATE mode only)
    useEffect(() => {
        if (editMode || viewMode || !selectedEntityEducationType) return;

        setValue('entity_category_id', selectedEntityEducationType.id, {
            shouldValidate: true,
            shouldDirty: true
        });

        const classificationText = selectedEntityEducationType.name?.[lang] ||
            selectedEntityEducationType.name?.en ||
            selectedEntityEducationType.name?.ar;

        if (classificationText) {
            setValue('education_program_entity_type_classification', classificationText, {
                shouldValidate: true,
                shouldDirty: true
            });
        }
    }, [selectedEntityEducationType, editMode, viewMode, lang, setValue]);

    // Auto-fill memorization entity type when entity is selected (CREATE and EDIT mode)
    useEffect(() => {
        if (viewMode) return;

        if (Number(mainProgramId) !== 2 || !normalizedEntityId || !selectedEntityMemorizationType) {
            setValue('memorization_program_entity_type', '', {
                shouldValidate: true,
                shouldDirty: true
            });
            setValue('memorization_program_entity_type_id', '', {
                shouldValidate: true,
                shouldDirty: true
            });
            return;
        }

        const entityTypeName = selectedEntityMemorizationType.name?.[lang] ||
            selectedEntityMemorizationType.name?.en ||
            selectedEntityMemorizationType.name?.ar;

        if (entityTypeName) {
            setValue('memorization_program_entity_type', entityTypeName, {
                shouldValidate: true,
                shouldDirty: true
            });
        }

        if (selectedEntityMemorizationType.id) {
            setValue('memorization_program_entity_type_id', selectedEntityMemorizationType.id, {
                shouldValidate: true,
                shouldDirty: true
            });
        }
    }, [selectedEntityMemorizationType, viewMode, lang, mainProgramId, normalizedEntityId, setValue]);

    // Update profile image preview when oldData changes
    useEffect(() => {
        if (profileImageChanged) return;
        const profilePic = oldData?.profile_picture;
        setProfileImagePreview(profilePic || null);
    }, [oldData?.profile_picture, profileImageChanged]);

    // Check if branch or main program have changed from original values
    const hasBranchOrProgramChanged = useMemo(() => {
        if (!editMode && !viewMode) return false; // Not applicable in create mode
        
        const currentBranchId = branchId || oldData?.branch_id;
        const currentMainProgramId = mainProgramId || oldData?.main_program_id;
        const originalBranchId = oldData?.branch_id;
        const originalMainProgramId = oldData?.main_program_id;
        
        return currentBranchId !== originalBranchId || currentMainProgramId !== originalMainProgramId;
    }, [branchId, mainProgramId, editMode, viewMode, oldData?.branch_id, oldData?.main_program_id]);

    // Create loadOptions function for entity field with dynamic branch_id and main_program_id
    const entityLoadOptions = useCallback((searchQuery, loadedOptions, additional = {}) => {
        const currentBranchId = branchId || (editMode ? oldData?.branch_id : null);
        const currentMainProgramId = mainProgramId || (editMode ? oldData?.main_program_id : null);
        
        // Don't load if both params are not available - return empty but don't error
        if (!currentBranchId || !currentMainProgramId) {
            return Promise.resolve({
                options: [],
                hasMore: false
            });
        }

        // Get include option from oldData (for edit/view mode) ONLY if branch/program haven't changed
        let includeOption = null;
        if ((editMode || viewMode) && oldData?.entity_id && oldData?.entity && !hasBranchOrProgramChanged) {
            includeOption = oldData.entity;
        }

        // Create loadOptions with dynamic params
        const loadOptionsFn = createAsyncLoadOptionsWithIncluded(
            entitiesService.getEntities,
            {
                ...allData,
                branch_id: currentBranchId,
                main_program_id: currentMainProgramId
            },
            includeOption
        );

        // Pass the full additional object to preserve pagination state
        return loadOptionsFn(searchQuery, loadedOptions, additional);
    }, [branchId, mainProgramId, editMode, viewMode, oldData?.branch_id, oldData?.main_program_id, oldData?.entity_id, oldData?.entity, hasBranchOrProgramChanged]);

    // Get default options for entity field (for edit/view mode)
    const entityDefaultOptions = useMemo(() => {
        const currentBranchId = branchId || (editMode ? oldData?.branch_id : null);
        const currentMainProgramId = mainProgramId || (editMode ? oldData?.main_program_id : null);
        
        // Only load on open if both params are available
        if (!currentBranchId || !currentMainProgramId) {
            return false; // Don't load until params are ready
        }
        
        // Only include old entity if branch/program haven't changed
        if ((editMode || viewMode) && oldData?.entity_id && oldData?.entity && !hasBranchOrProgramChanged) {
            const lang = i18next.language;
            const entity = oldData.entity;
            const name = entity.name?.[lang] || entity.name?.en || entity.name?.ar || entity.name || '';
            return [{
                label: name,
                value: entity.id,
                id: entity.id,
                name: entity.name
            }];
        }
        return true; // Load on open when params are ready
    }, [branchId, mainProgramId, editMode, viewMode, oldData?.branch_id, oldData?.main_program_id, oldData?.entity_id, oldData?.entity, hasBranchOrProgramChanged]);

    return {
        profileImagePreview,
        profileImageChanged,
        setProfileImagePreview,
        setProfileImageChanged,
        educationEntityTypeInfo,
        entities,
        entitiesLoading,
        selectedEntityEducationType,
        selectedEntityMemorizationType,
        shouldShowParentFields,
        mainProgramId,
        branchId,
        entityLoadOptions,
        entityDefaultOptions
    };
}
