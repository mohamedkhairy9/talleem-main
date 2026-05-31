import useRFH from '@/utils/hooks/global/useRFH';
import { usersSchema as schema } from '@/utils/yup/users.schemas';
import React, { useEffect, useRef } from 'react';
import { usersFields } from './configs';
import InputRFH from '@/components/common/inputs/InputRFH';
import Btn from '@/components/common/buttons/Btn';
import { getNestedError } from '@/utils/helpers/getNestedError';
import { generateOptions } from '@/utils/helpers/global.fns';
import ModalContent from '@/components/common/form/ModalContent';
import ModalFooter from '@/components/common/form/ModalFooter';
import { isFieldRequired } from '@/utils/helpers/schemaHelpers';
import { useRolesQuery } from '@/api/hooks/useRoles';
import { isAssignableRole } from '@/utils/helpers/assignableRoles';

// Resolve role to a single id for the async select (API may return role_id or roles array)
function useResolvedRoleId(oldData) {
    const { data: rolesData } = useRolesQuery({ per_page: 100 });
    const rolesList = rolesData?.data ?? [];
    const resolvedRoleId = React.useMemo(() => {
        if (!rolesData) return undefined;

        let role = null;

        if (oldData?.role_id != null && oldData.role_id !== '') {
            const normalizedRoleId =
                typeof oldData.role_id === 'number'
                    ? Number(oldData.role_id)
                    : typeof oldData.role_id === 'string' && /^\d+$/.test(oldData.role_id)
                    ? Number(oldData.role_id)
                    : null;

            if (normalizedRoleId != null) {
                role = rolesList.find(item => Number(item?.id) === normalizedRoleId) ?? null;
            }
        }

        const first = oldData?.roles?.[0];
        if (!role && first != null) {
            if (typeof first === 'number' || (typeof first === 'string' && /^\d+$/.test(first))) {
                role = rolesList.find(item => Number(item?.id) === Number(first)) ?? null;
            } else {
                role =
                    rolesList.find(
                        item =>
                            item.name === first ||
                            item.display_name?.en === first ||
                            item.display_name?.ar === first
                    ) ?? null;
            }
        }

        if (!role || !isAssignableRole(role)) return undefined;
        return Number(role.id);
    }, [oldData?.role_id, oldData?.roles, rolesData, rolesList]);
    const rolesReady = rolesData !== undefined;
    return { resolvedRoleId, rolesReady };
}

export default function FormUser({
    onClose,
    oldData,
    editMode,
    viewMode,
    isPending,
    mutate,
    options
}) {
    const { register, errors, handleSubmit, control, setValue, watch } = useRFH({
        schema,
        defaultValues: oldData
    });
    const branchId = watch('branch_id');

    const { resolvedRoleId, rolesReady } = useResolvedRoleId(oldData);
    const roleSyncedRef = useRef(false);
    const previousBranchIdRef = useRef(oldData?.branch_id);

    // When roles API has loaded and we had role in oldData (role_id or roles[0]), set form value
    useEffect(() => {
        if (!rolesReady || roleSyncedRef.current) return;

        // If we couldn't resolve yet (e.g. oldData.roles has a name and roles list not matched),
        // don't overwrite the current value with null; wait for a resolvable id.
        if (resolvedRoleId === undefined) return;

        setValue('role_id', resolvedRoleId ?? null);
        roleSyncedRef.current = true;
    }, [rolesReady, resolvedRoleId, setValue]);

    useEffect(() => {
        if (viewMode) return;

        const previousBranchId = previousBranchIdRef.current;
        if (
            previousBranchId !== undefined &&
            previousBranchId !== null &&
            branchId !== previousBranchId
        ) {
            setValue('entity_id', '');
        }

        previousBranchIdRef.current = branchId;
    }, [branchId, setValue, viewMode]);

    function onSubmit(data) {
        const normalizedName = data.name?.en?.trim?.() ?? '';
        const normalizedStatus =
            oldData?.status === 1 ||
            oldData?.status === true ||
            oldData?.status === '1';

        // Set locale fields to fixed 'en' value
        const submitData = {
            ...data,
            name: {
                en: normalizedName,
                ar: normalizedName
            },
            locale: 'en',
            current_app_locale: 'en',
            status: normalizedStatus ? 1 : 0,
            user_type: oldData?.user_type || 'employee'
        };

        // Edit mode: password is optional; don't send empty password
        if (editMode && (!submitData.password || submitData.password.trim() === '')) {
            delete submitData.password;
        }

        mutate(submitData, {
            onSuccess: () => {
                onClose();
            }
        });
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full">
            <ModalContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {usersFields
                    .filter(
                        field =>
                            (editMode && field.editMode) ||
                            (viewMode && field.viewMode) ||
                            (!editMode && !viewMode)
                    )
                    .map(field => {                        
                        const fieldDefaultValue =
                            field.name === 'name.en'
                                ? oldData?.name?.en || oldData?.name?.ar || field.defaultValue
                                : oldData?.[field.name] || field.defaultValue;
                        const hasBranchSelection =
                            branchId !== undefined && branchId !== null && branchId !== '';
                        const isFieldDisabled =
                            viewMode ||
                            (field.name === 'entity_id' && !hasBranchSelection);

                        return (
                            <div
                                key={
                                    field.name === 'entity_id'
                                        ? `entity_id-${String(branchId ?? 'no-branch')}`
                                        : field.name
                                }
                                className={
                                    field.type === 'textarea' ? 'md:col-span-2' : ''
                                }
                            >
                                <InputRFH
                                    p="px-3 py-3"
                                    control={control}
                                    register={register}
                                    error={getNestedError(errors, field.name)}
                                    type={field.type}
                                    placeholder={field.placeholder}
                                    disabled={isFieldDisabled}
                                    label={field.label}
                                    name={field.name}
                                    defaultValue={
                                        field.name === 'role_id'
                                            ? (rolesReady ? resolvedRoleId : undefined)
                                            : field.name === 'password' && viewMode
                                            ? '********'
                                            : fieldDefaultValue
                                    }
                                    isMulti={field.isMulti}
                                    options={
                                        field.name === 'role_id'
                                            ? undefined
                                            : generateOptions(options?.[field.name])
                                    }
                                    required={isFieldRequired(schema, field.name)}
                                    oldData={oldData}
                                    fieldParams={{
                                        entity_id: {
                                            branch_id: branchId ?? oldData?.branch_id
                                        }
                                    }}
                                />
                            </div>
                        );
                    })}
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
