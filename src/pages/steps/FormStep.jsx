import useRFH from '@/utils/hooks/global/useRFH';
import { createStepSchema as schema } from '@/utils/yup/steps.schemas';
import React, { useEffect, useMemo } from 'react';
import { stepsFields } from './configs';
import InputRFH from '@/components/common/inputs/InputRFH';
import Btn from '@/components/common/buttons/Btn';
import { getNestedError } from '@/utils/helpers/getNestedError';
import { generateOptions } from '@/utils/helpers/global.fns';
import { isFieldRequired } from '@/utils/helpers/schemaHelpers';
import ModalContent from '@/components/common/form/ModalContent';
import ModalFooter from '@/components/common/form/ModalFooter';
import { useUsersQuery } from '@/api/hooks/useUsers';
import { useRolesQuery } from '@/api/hooks/useRoles';
import { useJoinRequestFormsQuery } from '@/api/hooks/useJoinRequestForms';

export default function FormStep({
    onClose,
    oldData,
    editMode,
    viewMode,
    isPending,
    mutate,
    options,
    onStepCreated
}) {
    // Convert status from number (1/0) to boolean (true/false) for form display
    const normalizedOldData = useMemo(() => {
        if (!oldData) return oldData;
        return {
            ...oldData,
            status: oldData.status === 1 || oldData.status === true ? true : false
        };
    }, [oldData]);

    const { register, errors, handleSubmit, control, watch, setValue } = useRFH({
        schema,
        defaultValues: normalizedOldData
    });

    // Watch assigned_to_type to determine which API to call
    const assignedToType = watch('assigned_to_type') || oldData?.assigned_to_type;

    // Fetch users when assigned_to_type is "user" (or in view/edit mode to show selected value)
    const shouldFetchUsers = assignedToType === 'user' || (viewMode || editMode) && oldData?.assigned_to_type === 'user';
    const { data: usersData } = useUsersQuery(
        { status: true },
        { enabled: shouldFetchUsers }
    );

    // Fetch roles when assigned_to_type is "role" (or in view/edit mode to show selected value)
    const shouldFetchRoles = assignedToType === 'role' || (viewMode || editMode) && oldData?.assigned_to_type === 'role';
    const { data: rolesData } = useRolesQuery(
        { status: true },
        { enabled: shouldFetchRoles }
    );

    // Fetch join request forms for the select dropdown
    const { data: joinRequestFormsData } = useJoinRequestFormsQuery(
        { status: true },
        { enabled: true }
    );

    // Reset assigned_to_id when assigned_to_type changes (only in create/edit mode, not view mode)
    useEffect(() => {
        if (!viewMode && assignedToType && assignedToType !== oldData?.assigned_to_type) {
            setValue('assigned_to_id', '');
        }
    }, [assignedToType, oldData?.assigned_to_type, setValue, viewMode]);

    // Generate options for assigned_to_id based on assigned_to_type
    const assignedToIdOptions = useMemo(() => {
        const currentAssignedToType = assignedToType || oldData?.assigned_to_type;
        
        if (currentAssignedToType === 'user') {
            const users = usersData?.data || [];
            // In view/edit mode, ensure the selected user is included even if not in the list
            if ((viewMode || editMode) && oldData?.assigned_to_id) {
                const selectedUser = users.find(u => u.id === oldData.assigned_to_id);
                if (!selectedUser) {
                    // Add the selected user if not found in the list
                    users.unshift({ 
                        id: oldData.assigned_to_id, 
                        name: { en: `User ${oldData.assigned_to_id}`, ar: `User ${oldData.assigned_to_id}` }, 
                        email: '' 
                    });
                }
            }
            return users.map(user => {
                // Safely extract label from name object
                let label = `User ${user.id}`; // Default fallback
                
                if (user.name) {
                    if (typeof user.name === 'object' && user.name !== null) {
                        // Handle multilingual object {en: "...", ar: "..."}
                        label = user.name.en || user.name.ar || label;
                    } else if (typeof user.name === 'string') {
                        // Handle string name
                        label = user.name;
                    }
                } else if (user.email) {
                    // Fallback to email if name is not available
                    label = user.email;
                }
                
                // Ensure label is always a string (safety check)
                if (typeof label !== 'string') {
                    label = String(label) || `User ${user.id}`;
                }
                
                return {
                    label: label,
                    value: user.id
                };
            });
        } else if (currentAssignedToType === 'role') {
            const roles = rolesData?.data || [];
            // In view/edit mode, ensure the selected role is included even if not in the list
            if ((viewMode || editMode) && oldData?.assigned_to_id) {
                const selectedRole = roles.find(r => r.id === oldData.assigned_to_id);
                if (!selectedRole) {
                    // Add the selected role if not found in the list
                    roles.unshift({ id: oldData.assigned_to_id, display_name: { en: `Role ${oldData.assigned_to_id}`, ar: `Role ${oldData.assigned_to_id}` } });
                }
            }
            return roles.map(role => {
                // Safely extract label from display_name object
                let label = `Role ${role.id}`; // Default fallback
                
                if (role.display_name) {
                    if (typeof role.display_name === 'object' && role.display_name !== null) {
                        // Handle multilingual object {en: "...", ar: "..."}
                        label = role.display_name.en || role.display_name.ar || label;
                    } else if (typeof role.display_name === 'string') {
                        // Handle string display_name
                        label = role.display_name;
                    }
                } else if (role.name) {
                    // Handle name field (could be string or object)
                    if (typeof role.name === 'object' && role.name !== null) {
                        label = role.name.en || role.name.ar || label;
                    } else if (typeof role.name === 'string') {
                        label = role.name;
                    }
                }
                
                // Ensure label is always a string (safety check)
                if (typeof label !== 'string') {
                    label = String(label) || `Role ${role.id}`;
                }
                
                return {
                    label: label,
                    value: role.id
                };
            });
        }
        return [];
    }, [assignedToType, usersData, rolesData, oldData, viewMode, editMode]);

    // Generate options for join_request_form_id from API
    const joinRequestFormOptions = useMemo(() => {
        const forms = joinRequestFormsData?.data || [];
        // In view/edit mode, ensure the selected form is included even if not in the list
        if ((viewMode || editMode) && oldData?.join_request_form_id) {
            const selectedForm = forms.find(f => f.id === oldData.join_request_form_id);
            if (!selectedForm) {
                // Add the selected form if not found in the list
                forms.unshift({ 
                    id: oldData.join_request_form_id, 
                    name: { en: `Form ${oldData.join_request_form_id}`, ar: `Form ${oldData.join_request_form_id}` }
                });
            }
        }
        return forms.map(form => {
            // Safely extract label from name object
            let label = `Form ${form.id}`; // Default fallback
            
            if (form.name) {
                if (typeof form.name === 'object' && form.name !== null) {
                    // Handle multilingual object {en: "...", ar: "..."}
                    label = form.name.en || form.name.ar || label;
                } else if (typeof form.name === 'string') {
                    // Handle string name
                    label = form.name;
                }
            }
            
            // Ensure label is always a string (safety check)
            if (typeof label !== 'string') {
                label = String(label) || `Form ${form.id}`;
            }
            
            return {
                label: label,
                value: form.id
            };
        });
    }, [joinRequestFormsData, oldData, viewMode, editMode]);

    function onSubmit(data) {
        // Convert status from boolean to number (1/0) for API
        const submissionData = {
            ...data,
            status: data.status ? 1 : 0
        };
        
        if (editMode && oldData?.id) {
            submissionData.id = oldData.id;
        }
        
        mutate(submissionData, {
            onSuccess: () => {
                onClose();
                // Call onStepCreated callback if provided (for CreateStep)
                if (onStepCreated) {
                    onStepCreated();
                }
            }
        });
    }

    // Helper to get options for a field
    const getFieldOptions = (fieldName) => {
        if (fieldName === 'assigned_to_id') {
            return generateOptions(assignedToIdOptions);
        }
        if (fieldName === 'join_request_form_id') {
            return generateOptions(joinRequestFormOptions);
        }
        return generateOptions(options?.[fieldName]);
    };

    // Helper to check if field should be disabled
    const isFieldDisabled = (fieldName) => {
        if (viewMode) return true;
        if (fieldName === 'assigned_to_id' && !assignedToType) {
            return true;
        }
        return false;
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full">
            <ModalContent>
                <div className="space-y-2">
                    {stepsFields
                        .filter(
                            field =>
                                (editMode && field.editMode) ||
                                (viewMode && field.viewMode) ||
                                (!editMode && !viewMode)
                        )
                        .map(field => (
                            <InputRFH
                                p="px-3 py-3"
                                control={control}
                                register={register}
                                error={getNestedError(errors, field.name)}
                                key={field.name}
                                type={field.type}
                                placeholder={field.placeholder}
                                label={field.label}
                                name={field.name}
                                disabled={isFieldDisabled(field.name)}
                                defaultValue={
                                    oldData?.[field.name] || field.defaultValue
                                }
                                options={getFieldOptions(field.name)}
                                required={isFieldRequired(schema, field.name)}
                            />
                        ))}
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

