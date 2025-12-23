import useRFH from '@/utils/hooks/global/useRFH';
import { inspectorAssignmentsSchema as schema } from '@/utils/yup/inspectorAssignments.schemas';
import React, { useMemo, useEffect, useRef } from 'react';
import { inspectorAssignmentsFields } from './configs';
import InputRFH from '@/components/common/inputs/InputRFH';
import Btn from '@/components/common/buttons/Btn';
import { getNestedError } from '@/utils/helpers/getNestedError';
import { generateOptions } from '@/utils/helpers/global.fns';
import ModalContent from '@/components/common/form/ModalContent';
import ModalFooter from '@/components/common/form/ModalFooter';
import { isFieldRequired } from '@/utils/helpers/schemaHelpers';
import { useEntitiesQuery } from '@/api/hooks/useEntities';
import useCustomQueries from '@/utils/hooks/global/useCustomQueries';
import { API_KEYS } from '@/api/endpoints';
import { usersService } from '@/api/services/users.service';
import i18next from 'i18next';
import useLocale from '@/utils/hooks/global/useLocale';

export default function FormInspectorAssignment({
    onClose,
    oldData,
    editMode,
    viewMode,
    isPending,
    mutate,
    options
}) {

    const { register, errors, handleSubmit, control, watch, setValue } = useRFH({
        schema,
        defaultValues: oldData || {
            status: true,
            assignment_type: 'regular',
            main_program_id: '',
            branch_id: '',
            entity_ids: [],
            supervisor_ids: '',
            from_date: '',
            to_date: '',
            notes: ''
        }
    });

    const assignmentType = watch('assignment_type');
    const selectedBranchId = watch('branch_id');
    const selectedProgramId = watch('main_program_id');
    const selectedEntityIds = watch('entity_ids');

    // Get program and entity IDs from oldData for edit/view mode
    const programIdForQuery = selectedProgramId || oldData?.main_program_id || oldData?.main_program?.id;
    
    // Get entity IDs - prioritize selected, fallback to oldData
    const entityIdsForQuery = useMemo(() => {
        if (Array.isArray(selectedEntityIds) && selectedEntityIds.length > 0) {
            return selectedEntityIds;
        }
        
        if (oldData?.entity_ids) {
            return Array.isArray(oldData.entity_ids) ? oldData.entity_ids : [oldData.entity_ids];
        }
        
        if (oldData?.entities && Array.isArray(oldData.entities)) {
            return oldData.entities.map(e => e?.id || e);
        }
        
        return [];
    }, [selectedEntityIds, oldData?.entity_ids, oldData?.entities]);

    // Prepare entities query params (use oldData values in edit/view mode)
    const branchIdForEntitiesQuery = selectedBranchId || oldData?.branch_id || oldData?.branch?.id;
    const programIdForEntitiesQuery = selectedProgramId || oldData?.main_program_id || oldData?.main_program?.id;
    
    const entitiesQueryParams = useMemo(() => {
        if (!branchIdForEntitiesQuery || !programIdForEntitiesQuery) {
            return null;
        }
        return {
            branch_id: branchIdForEntitiesQuery,
            main_program_id: programIdForEntitiesQuery
        };
    }, [branchIdForEntitiesQuery, programIdForEntitiesQuery]);

    // Fetch entities with dynamic params - enable query if we have params OR if we have oldData entities (for view mode)
    const shouldEnableEntitiesQuery = !!entitiesQueryParams || ((viewMode || editMode) && oldData?.entities && oldData.entities.length > 0);
    const { data: entitiesData } = useEntitiesQuery(entitiesQueryParams || {}, {
        enabled: shouldEnableEntitiesQuery
    });

    // Include entities from oldData in view/edit mode to ensure selected values are visible
    const entitiesOptions = useMemo(() => {
        const apiEntities = entitiesData?.data || [];
        const allEntities = [...apiEntities];
        
        // In view/edit mode, add entities from oldData if they're not already in the list
        if ((viewMode || editMode) && oldData?.entities) {
            const oldEntities = Array.isArray(oldData.entities) ? oldData.entities : [oldData.entities];
            const seenIds = new Set(apiEntities.map(e => e?.id || e));
            
            oldEntities.forEach(entity => {
                const entityId = entity?.id || entity;
                if (entityId && !seenIds.has(entityId)) {
                    seenIds.add(entityId);
                    // If entity is an object, use it; otherwise create a minimal object
                    if (typeof entity === 'object' && entity !== null) {
                        allEntities.push(entity);
                    } else {
                        allEntities.push({ id: entityId, name: { en: `Entity ${entityId}`, ar: `جهة ${entityId}` } });
                    }
                }
            });
        }
        
        // Also check supervisors.entities for additional entities
        if ((viewMode || editMode) && oldData?.supervisors) {
            const supervisors = Array.isArray(oldData.supervisors) ? oldData.supervisors : [oldData.supervisors];
            const seenIds = new Set(allEntities.map(e => e?.id || e));
            
            supervisors.forEach(supervisor => {
                if (supervisor?.entities && Array.isArray(supervisor.entities)) {
                    supervisor.entities.forEach(entity => {
                        const entityId = entity?.id || entity;
                        if (entityId && !seenIds.has(entityId)) {
                            seenIds.add(entityId);
                            if (typeof entity === 'object' && entity !== null) {
                                allEntities.push(entity);
                            } else {
                                allEntities.push({ id: entityId, name: { en: `Entity ${entityId}`, ar: `جهة ${entityId}` } });
                            }
                        }
                    });
                }
            });
        }
        
        return allEntities;
    }, [entitiesData, viewMode, editMode, oldData?.entities, oldData?.supervisors]);

    // Prepare users queries for each selected entity
    // Use fixed number of queries to maintain stable hook order
    const MAX_ENTITY_QUERIES = 20;
    
    const usersQueriesConfig = useMemo(() => {
        const queries = [];
        const safeEntityIds = Array.isArray(entityIdsForQuery) ? entityIdsForQuery : [];
        
        // In view mode, enable queries even if we have oldData to ensure options are loaded
        const shouldFetchUsers = !!programIdForQuery && safeEntityIds.length > 0;
        
        for (let i = 0; i < MAX_ENTITY_QUERIES; i++) {
            const entityId = safeEntityIds[i];
            const shouldEnable = shouldFetchUsers && !!entityId && i < safeEntityIds.length;
            
            queries.push({
                queryKey: [API_KEYS.USERS, 'employee', programIdForQuery || null, entityId || null, i],
                queryFn: () => {
                    if (!entityId || !programIdForQuery) {
                        return Promise.resolve({ data: [] });
                    }
                    return usersService.getUsers({
                        user_type: 'employee',
                        entity_id: entityId,
                        main_program_id: programIdForQuery
                    });
                },
                enabled: shouldEnable
            });
        }
        
        return queries;
    }, [programIdForQuery, entityIdsForQuery]);

    // Fetch users for all selected entities
    const { queries: usersQueries } = useCustomQueries(usersQueriesConfig);

    // Combine and deduplicate users from all queries
    const usersOptions = useMemo(() => {
        const allUsers = [];
        const seenIds = new Set();

        // In view/edit mode, include selected supervisors first to ensure they're always available
        // This is critical for view mode where the field needs to display the selected value
        if ((viewMode || editMode) && oldData?.supervisors) {
            let supervisors = [];
            
            if (Array.isArray(oldData.supervisors)) {
                supervisors = oldData.supervisors.filter(Boolean);
            } else if (oldData.supervisors && typeof oldData.supervisors === 'object') {
                supervisors = [oldData.supervisors];
            }
            
            supervisors.forEach(supervisor => {
                if (supervisor?.id && !seenIds.has(supervisor.id)) {
                    seenIds.add(supervisor.id);
                    allUsers.push(supervisor);
                }
            });
        }

        // Add users from fetched queries
        usersQueries?.forEach(query => {
            if (query?.data?.data) {
                query.data.data.forEach(user => {
                    if (user?.id && !seenIds.has(user.id)) {
                        seenIds.add(user.id);
                        allUsers.push(user);
                    }
                });
            }
        });

        return allUsers;
    }, [usersQueries, viewMode, editMode, oldData?.supervisors]);

    const hasSelectedEntity = entityIdsForQuery.length > 0;

    // Reset entities when branch or program changes (create mode only)
    const prevBranchIdRef = useRef(selectedBranchId);
    const prevProgramIdRef = useRef(selectedProgramId);
    
    useEffect(() => {
        if (!editMode) {
            const branchChanged = prevBranchIdRef.current !== selectedBranchId;
            const programChanged = prevProgramIdRef.current !== selectedProgramId;
            
            if (branchChanged || programChanged) {
                setValue('entity_ids', []);
            }
            
            prevBranchIdRef.current = selectedBranchId;
            prevProgramIdRef.current = selectedProgramId;
        }
    }, [selectedBranchId, selectedProgramId, setValue, editMode]);

    // Reset supervisors when assignment type, program, or entities change (create mode only)
    useEffect(() => {
        if (!editMode) {
            setValue('supervisor_ids', assignmentType === 'committee' ? [] : '');
        }
    }, [assignmentType, selectedProgramId, selectedEntityIds, setValue, editMode]);

    // In view mode, ensure supervisor_ids is set after options are loaded
    useEffect(() => {
        if (viewMode && oldData?.supervisor_ids !== undefined && usersOptions.length > 0) {
            const supervisorId = oldData.supervisor_ids;
            const supervisorExists = usersOptions.some(u => u?.id === supervisorId);
            
            if (supervisorExists) {
                if (assignmentType === 'committee') {
                    const ids = Array.isArray(supervisorId) ? supervisorId : [supervisorId];
                    setValue('supervisor_ids', ids, { shouldValidate: false });
                } else {
                    const id = Array.isArray(supervisorId) ? supervisorId[0] : supervisorId;
                    setValue('supervisor_ids', id, { shouldValidate: false });
                }
            } 
        }
    }, [viewMode, oldData?.supervisor_ids, usersOptions, assignmentType, setValue]);

    const isEntitiesDisabled = !selectedBranchId || !selectedProgramId;
    const isSupervisorDisabled = !programIdForQuery || !hasSelectedEntity;
    const { t } = useLocale();

    // Get supervisors with entities for display in view mode
    const supervisorsWithEntities = useMemo(() => {
        if (!viewMode || !oldData?.supervisors) return [];
        
        return oldData.supervisors.map(supervisor => {
            const supervisorName = supervisor.name 
                ? (typeof supervisor.name === 'object' 
                    ? supervisor.name[i18next.language] || supervisor.name.ar || supervisor.name.en
                    : supervisor.name)
                : '-';
            
            const entities = supervisor.entities || [];
            const entityNames = entities.map(e => {
                if (typeof e.name === 'object' && e.name !== null) {
                    return e.name[i18next.language] || e.name.ar || e.name.en;
                }
                return e.name || '';
            }).filter(name => name);
            
            return {
                supervisorName,
                entities: entityNames
            };
        });
    }, [viewMode, oldData?.supervisors]);

    const onSubmit = (data) => {
        const submissionData = {
            ...data,
            entity_ids: Array.isArray(data.entity_ids) ? data.entity_ids : [data.entity_ids],
            supervisor_ids: Array.isArray(data.supervisor_ids) ? data.supervisor_ids : [data.supervisor_ids]
        };
        
        const finalData = editMode ? { ...submissionData, id: oldData.id } : submissionData;
        
        mutate(finalData, {
            onSuccess: () => onClose()
        });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full">
            <ModalContent>
            <div className="grid grid-cols-1 gap-4">
                {inspectorAssignmentsFields
                    .filter(
                        field =>
                            (editMode && field.editMode) ||
                            (viewMode && field.viewMode) ||
                            (!editMode && !viewMode)
                    )
                    .map(field => {
                        let fieldOptions = options?.[field.name];
                        let isMultiple = false;

                        if (field.name === 'entity_ids') {
                            fieldOptions = entitiesOptions;
                            isMultiple = true;
                        } else if (field.name === 'supervisor_ids') {
                            fieldOptions = usersOptions;
                            isMultiple = assignmentType === 'committee';
                            
                        }

                        const isDisabled = viewMode || 
                            (field.name === 'entity_ids' && isEntitiesDisabled) ||
                            (field.name === 'supervisor_ids' && !viewMode && isSupervisorDisabled);

                        // Handle supervisor_ids defaultValue - ensure correct format
                        let supervisorDefaultValue = field.defaultValue;
                        if (field.name === 'supervisor_ids' && oldData?.supervisor_ids !== undefined) {
                            if (isMultiple) {
                                // Committee mode: ensure it's an array
                                supervisorDefaultValue = Array.isArray(oldData.supervisor_ids) 
                                    ? oldData.supervisor_ids 
                                    : oldData.supervisor_ids !== '' && oldData.supervisor_ids !== null
                                    ? [oldData.supervisor_ids]
                                    : [];
                            } else {
                                // Regular mode: ensure it's a single value
                                supervisorDefaultValue = Array.isArray(oldData.supervisor_ids)
                                    ? oldData.supervisor_ids[0] || ''
                                    : oldData.supervisor_ids;
                            }
                        }

                        return (
                            <InputRFH
                                key={field.name}
                                p="px-3 py-3"
                                control={control}
                                register={register}
                                error={getNestedError(errors, field.name)}
                                type={field.type}
                                placeholder={field.placeholder}
                                disabled={isDisabled}
                                label={field.label}
                                name={field.name}
                                options={generateOptions(fieldOptions)}
                                defaultValue={
                                    field.name === 'entity_ids' 
                                        ? (oldData?.entity_ids || [])
                                        : field.name === 'supervisor_ids'
                                        ? supervisorDefaultValue
                                        : oldData?.[field.name] || field.defaultValue
                                }
                                isMulti={isMultiple}
                                required={isFieldRequired(schema, field.name)}
                            />
                        );
                    })}
                
                {/* Display supervisors with entities in view mode */}
                {viewMode && supervisorsWithEntities.length > 0 && (
                    <div className="col-span-full">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            {t('table_headers.supervisors')} & {t('table_headers.entities')}
                        </label>
                        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                            {supervisorsWithEntities.map((item, index) => (
                                <div key={index} className="border-b border-gray-200 pb-3 last:border-b-0 last:pb-0">
                                    <div className="font-semibold text-gray-900 mb-1">
                                        {item.supervisorName}
                                    </div>
                                    <div className="text-sm text-gray-600 ml-4">
                                        {item.entities.length > 0 ? (
                                            <span>{t('table_headers.entities')}: {item.entities.join(', ')}</span>
                                        ) : (
                                            <span className="text-gray-400">-</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            </ModalContent>
            {!viewMode && (
                <ModalFooter>
                    <Btn
                        loading={isPending}
                        className="py-[10px] w-full"
                        type="submit"
                        label="common.submit"
                    />
                </ModalFooter>
            )}
        </form>
    );
}