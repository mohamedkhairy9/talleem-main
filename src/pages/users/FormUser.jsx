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

const FIXED_ROLE_USER_TYPES = new Set([
    'teacher',
    'student',
    'parent',
    'entity',
    'entity-manager',
    'entity_manager'
]);

// Helper to generate bilingual options (showing both en and ar)
const generateBilingualUserTypeOptions = (options = []) => {
    return options.map(opt => ({
        label: `${opt.label?.en || opt.label} / ${opt.label?.ar || opt.label}`,
        value: opt.value
    }));
};

function normalizeUserType(value) {
    return (value ?? '').toString().trim().toLowerCase().replace(/\s+/g, '-').replace(/_/g, '-');
}

function isFixedRoleUserType(value) {
    return FIXED_ROLE_USER_TYPES.has(normalizeUserType(value));
}

// Resolve role to a single id for the async select (API may return role_id or roles array)
function useResolvedRoleId(oldData) {
    const { data: rolesData } = useRolesQuery({ per_page: 100 });
    const resolvedRoleId = React.useMemo(() => {
        // role_id may come as a number OR a role name (string). Only accept numeric.
        if (oldData?.role_id != null && oldData.role_id !== '') {
            if (typeof oldData.role_id === 'number') return Number(oldData.role_id);
            if (typeof oldData.role_id === 'string' && /^\d+$/.test(oldData.role_id)) return Number(oldData.role_id);
        }
        const first = oldData?.roles?.[0];
        if (first == null) return undefined;
        if (typeof first === 'number' || (typeof first === 'string' && /^\d+$/.test(first))) return Number(first);
        const rolesList = rolesData?.data ?? [];
        const role = rolesList.find(
            ro => ro.name === first || ro.display_name?.en === first || ro.display_name?.ar === first
        );
        return role?.id;
    }, [oldData?.role_id, oldData?.roles, rolesData?.data]);
    const rolesReady = rolesData !== undefined;
    return { resolvedRoleId, rolesReady };
}

function ensureCurrentUserTypeOption(options = [], currentValue) {
    if (!currentValue) return options;
    const exists = options.some(opt => opt?.value === currentValue);
    if (exists) return options;
    // Add current value as a display-only fallback so edit/view doesn't render empty
    return [
        ...options,
        {
            label: { en: String(currentValue), ar: String(currentValue) },
            value: currentValue
        }
    ];
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
    const watchedUserType = watch('user_type');
    const currentUserType = watchedUserType ?? oldData?.user_type;
    const isFixedRoleProfile = isFixedRoleUserType(currentUserType);
    const isLockedFixedRoleProfile = editMode && isFixedRoleUserType(oldData?.user_type);

    const { resolvedRoleId, rolesReady } = useResolvedRoleId(oldData);
    const roleSyncedRef = useRef(false);

    // When roles API has loaded and we had role in oldData (role_id or roles[0]), set form value
    useEffect(() => {
        if (!rolesReady || roleSyncedRef.current) return;

        // If we couldn't resolve yet (e.g. oldData.roles has a name and roles list not matched),
        // don't overwrite the current value with null; wait for a resolvable id.
        if (resolvedRoleId === undefined) return;

        setValue('role_id', resolvedRoleId ?? null);
        roleSyncedRef.current = true;
    }, [rolesReady, resolvedRoleId, setValue]);

    function onSubmit(data) {
        // Set locale fields to fixed 'en' value
        const submitData = {
            ...data,
            locale: 'en',
            current_app_locale: 'en',
            status: data.status ? 1 : 0
        };

        // Edit mode: password is optional; don't send empty password
        if (editMode && (!submitData.password || submitData.password.trim() === '')) {
            delete submitData.password;
        }

        // Fixed-profile accounts own their role assignment and should not be changed here.
        if (isFixedRoleProfile) {
            delete submitData.role_id;
        }

        // Existing fixed-profile accounts should also keep their original user type.
        if (isLockedFixedRoleProfile) {
            delete submitData.user_type;
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
                        const isFieldDisabled =
                            viewMode ||
                            (field.name === 'role_id' && isFixedRoleProfile) ||
                            (field.name === 'user_type' && isLockedFixedRoleProfile);

                        return (
                            <div
                                key={field.name}
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
                                            ? (rolesReady ? resolvedRoleId : (oldData?.role_id ?? oldData?.[field.name]))
                                            : oldData?.[field.name] || field.defaultValue
                                    }
                                    isMulti={field.isMulti}
                                    options={
                                        field.name === 'user_type'
                                            ? generateBilingualUserTypeOptions(
                                                  ensureCurrentUserTypeOption(options?.[field.name] ?? [], oldData?.user_type)
                                              )
                                            : field.name === 'role_id'
                                            ? undefined
                                            : generateOptions(options?.[field.name])
                                    }
                                    required={isFieldRequired(schema, field.name)}
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
