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
    const { register, errors, handleSubmit, control, watch, setValue } = useRFH({
        schema,
        defaultValues: oldData
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
                    users.unshift({ id: oldData.assigned_to_id, name: `User ${oldData.assigned_to_id}`, email: '' });
                }
            }
            return users.map(user => ({
                label: user.name || user.email || `User ${user.id}`,
                value: user.id
            }));
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
            return roles.map(role => ({
                label: role.display_name?.en || role.display_name?.ar || role.name || `Role ${role.id}`,
                value: role.id
            }));
        }
        return [];
    }, [assignedToType, usersData, rolesData, oldData, viewMode, editMode]);

    function onSubmit(data) {
        const submissionData = editMode && oldData?.id 
            ? { ...data, id: oldData.id } 
            : data;
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

