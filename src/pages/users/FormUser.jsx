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

// Helper to generate bilingual options (showing both en and ar)
const generateBilingualUserTypeOptions = (options = []) => {
    return options.map(opt => ({
        label: `${opt.label?.en || opt.label} / ${opt.label?.ar || opt.label}`,
        value: opt.value
    }));
};

// Resolve role to a single id for the async select (API may return role_id or roles array)
function useResolvedRoleId(oldData) {
    const { data: rolesData } = useRolesQuery({ per_page: 100 });
    const resolvedRoleId = React.useMemo(() => {
        if (oldData?.role_id != null && oldData.role_id !== '') return Number(oldData.role_id);
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

export default function FormUser({
    onClose,
    oldData,
    editMode,
    viewMode,
    isPending,
    mutate,
    options
}) {
    const { register, errors, handleSubmit, control, setValue } = useRFH({
        schema,
        defaultValues: oldData
    });

    const { resolvedRoleId, rolesReady } = useResolvedRoleId(oldData);
    const roleSyncedRef = useRef(false);

    // When roles API has loaded and we had role in oldData (role_id or roles[0]), set form value
    useEffect(() => {
        if (!rolesReady || roleSyncedRef.current) return;
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
                                    disabled={viewMode}
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
                                            ? generateBilingualUserTypeOptions(options?.[field.name])
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
