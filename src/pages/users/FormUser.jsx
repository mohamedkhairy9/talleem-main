import useRFH from '@/utils/hooks/global/useRFH';
import { usersSchema as schema } from '@/utils/yup/users.schemas';
import React, { useEffect, useRef } from 'react';
import { usersFields } from './configs';
import InputRFH from '@/components/common/inputs/InputRFH';
import Btn from '@/components/common/buttons/Btn';
import { getNestedError } from '@/utils/helpers/getNestedError';
import { generateOptions } from '@/utils/helpers/global.fns';
import useLocale from '@/utils/hooks/global/useLocale';
import ModalContent from '@/components/common/form/ModalContent';
import ModalFooter from '@/components/common/form/ModalFooter';
import { isFieldRequired } from '@/utils/helpers/schemaHelpers';
import { useRolesQuery } from '@/api/hooks/useRoles';
import { useAssignUserRoleMutation } from '@/api/hooks/useUsers';
import {
    isAssignableRole
} from '@/utils/helpers/assignableRoles';
import {
    buildUserSubmissionPayload,
    getUserEditPolicy,
    isUserFieldEditable,
    normalizeSelectedIds
} from './userFormPolicy';

function getSelectionKey(value) {
    return normalizeSelectedIds(value)
        .map(item => String(item))
        .sort()
        .join(',');
}

function getSavedUserId(response, fallbackId) {
    return (
        fallbackId ??
        response?.id ??
        response?.data?.id ??
        response?.data?.data?.id ??
        null
    );
}

function getSystemRoleLabel(role, locale) {
    if (role && typeof role === 'object') {
        return (
            role.display_name?.[locale] ||
            role.name?.[locale] ||
            role.label?.[locale] ||
            role.display_name?.en ||
            role.name?.en ||
            role.label?.en ||
            role.name ||
            role.label ||
            ''
        );
    }

    const normalizedRole = String(role ?? '').trim().toLowerCase();
    const roleLabels = {
        teacher: { ar: 'معلم', en: 'Teacher' },
        student: { ar: 'طالب', en: 'Student' },
        supervisor: { ar: 'مشرف', en: 'Supervisor' },
        entity_manager: { ar: 'مدير جهة', en: 'Entity Manager' },
        'entity manager': { ar: 'مدير جهة', en: 'Entity Manager' }
    };

    return roleLabels[normalizedRole]?.[locale] || String(role ?? '');
}

function getSystemRoleLabels(roles, fallbackRole, locale) {
    const candidates = Array.isArray(roles)
        ? roles
        : roles
        ? [roles]
        : [];

    if (fallbackRole) {
        candidates.push(fallbackRole);
    }

    return [
        ...new Set(
            candidates
                .map(role => getSystemRoleLabel(role, locale))
                .filter(Boolean)
        )
    ];
}

// Resolve role to a single id for the async select (API may return role_id or roles array)
function useResolvedRoleId(oldData) {
    const { data: rolesData } = useRolesQuery({ per_page: 100 });
    const resolvedRoleId = React.useMemo(() => {
        if (!rolesData) return undefined;
        const rolesList = rolesData?.data ?? [];

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
    }, [oldData?.role_id, oldData?.roles, rolesData]);
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
    const { currentLocale } = useLocale();
    const editPolicy = React.useMemo(
        () => getUserEditPolicy(oldData),
        [oldData]
    );
    const reservedSystemRole = editPolicy.reservedSystemRole;
    const isReservedSystemUser = Boolean(reservedSystemRole);
    const displayedRoles = React.useMemo(
        () =>
            getSystemRoleLabels(
                oldData?.roles,
                reservedSystemRole,
                currentLocale
            ),
        [currentLocale, oldData?.roles, reservedSystemRole]
    );
    const normalizedDefaultValues = React.useMemo(() => ({
        ...oldData,
        branch_id: normalizeSelectedIds(
            oldData?.branch_id ?? oldData?.branches ?? oldData?.branch
        ),
        entity_id: normalizeSelectedIds(
            oldData?.entity_id ?? oldData?.entities ?? oldData?.entity
        )
    }), [oldData]);

    const { register, errors, handleSubmit, control, setValue, watch } = useRFH({
        schema,
        defaultValues: normalizedDefaultValues
    });
    const assignUserRoleMutation = useAssignUserRoleMutation();
    const branchId = watch('branch_id');

    const { resolvedRoleId, rolesReady } = useResolvedRoleId(oldData);
    const roleSyncedRef = useRef(false);
    const previousBranchSelectionRef = useRef(
        getSelectionKey(normalizedDefaultValues.branch_id)
    );

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

        const currentBranchSelection = getSelectionKey(branchId);
        const previousBranchSelection = previousBranchSelectionRef.current;

        if (
            previousBranchSelection &&
            currentBranchSelection !== previousBranchSelection
        ) {
            setValue('entity_id', []);
        }

        previousBranchSelectionRef.current = currentBranchSelection;
    }, [branchId, setValue, viewMode]);

    function onSubmit(data) {
        const submitData = buildUserSubmissionPayload(data, oldData, {
            editMode,
            editPolicy
        });
        const selectedRoleId = isReservedSystemUser
            ? null
            : Number(data.role_id);

        // Roles are assigned through the dedicated user-role endpoint after
        // the user has been created or updated.
        delete submitData.role_id;

        // Edit mode: password is optional; don't send empty password
        if (editMode && (!submitData.password || submitData.password.trim() === '')) {
            delete submitData.password;
        }

        mutate(submitData, {
            onSuccess: response => {
                const userId = getSavedUserId(response, oldData?.id);

                if (!selectedRoleId || !userId || isReservedSystemUser) {
                    onClose();
                    return;
                }

                assignUserRoleMutation.mutate(
                    { userId, roleId: selectedRoleId },
                    { onSuccess: onClose }
                );
            },
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
                                : field.name === 'branch_id'
                                ? normalizedDefaultValues.branch_id
                                : field.name === 'entity_id'
                                ? normalizedDefaultValues.entity_id
                                : oldData?.[field.name] ?? field.defaultValue;
                        const hasBranchSelection =
                            normalizeSelectedIds(branchId).length > 0;
                        const isEditableInEditMode =
                            !editMode || isUserFieldEditable(field.name, editPolicy);
                        const isFieldDisabled =
                            viewMode ||
                            !isEditableInEditMode ||
                            (field.name === 'entity_id' && !hasBranchSelection);

                        if (
                            field.name === 'role_id' &&
                            (isReservedSystemUser || viewMode)
                        ) {
                            return (
                                <div key={field.name}>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        {isReservedSystemUser
                                            ? currentLocale === 'ar'
                                                ? 'دور النظام'
                                                : 'System Role'
                                            : currentLocale === 'ar'
                                            ? 'الأدوار'
                                            : 'Roles'}
                                    </label>
                                    <div className="flex min-h-12 flex-wrap items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700">
                                        {displayedRoles.length ? (
                                            displayedRoles.map(role => (
                                                <span
                                                    key={role}
                                                    className="rounded-md bg-white px-2 py-1 font-medium text-gray-700 shadow-sm"
                                                >
                                                    {role}
                                                </span>
                                            ))
                                        ) : (
                                            '-'
                                        )}
                                    </div>
                                    {!viewMode && (
                                        <p className="mt-1 text-xs text-gray-500">
                                            {currentLocale === 'ar'
                                                ? 'هذا الدور يُدار تلقائيًا من خلال إجراءات النظام ولا يمكن تعديله هنا.'
                                                : 'This role is managed by system workflows and cannot be changed here.'}
                                        </p>
                                    )}
                                </div>
                            );
                        }

                        return (
                            <div
                                key={
                                    field.name === 'entity_id'
                                        ? `entity_id-${getSelectionKey(branchId) || 'no-branch'}`
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
                                        entity_id:
                                            normalizeSelectedIds(branchId).length > 0
                                                ? {
                                                    branches_id: normalizeSelectedIds(branchId)
                                                }
                                                : {
                                                    branches_id: normalizedDefaultValues.branch_id
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
                        loading={isPending || assignUserRoleMutation.isPending}
                        className="py-[10px] w-full"
                        type="submit"
                        label="common.submit"
                    />
                </ModalFooter>
            )}
        </form>
    );
}
