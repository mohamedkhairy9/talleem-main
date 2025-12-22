import useRFH from '@/utils/hooks/global/useRFH';
import { usersSchema as schema } from '@/utils/yup/users.schemas';
import React from 'react';
import { usersFields } from './configs';
import InputRFH from '@/components/common/inputs/InputRFH';
import Btn from '@/components/common/buttons/Btn';
import { getNestedError } from '@/utils/helpers/getNestedError';
import { generateOptions } from '@/utils/helpers/global.fns';
import ModalContent from '@/components/common/form/ModalContent';
import ModalFooter from '@/components/common/form/ModalFooter';
import { isFieldRequired } from '@/utils/helpers/schemaHelpers';

// Helper to generate bilingual options (showing both en and ar)
const generateBilingualUserTypeOptions = (options = []) => {
    return options.map(opt => ({
        label: `${opt.label?.en || opt.label} / ${opt.label?.ar || opt.label}`,
        value: opt.value
    }));
};

export default function FormUser({
    onClose,
    oldData,
    editMode,
    viewMode,
    isPending,
    mutate,
    options
}) {
    const { register, errors, handleSubmit, control } = useRFH({
        schema,
        defaultValues: oldData
    });

    // Debug logs
    console.log('FormUser - oldData:', oldData);
    console.log('FormUser - oldData.roles:', oldData?.roles);
    console.log('FormUser - oldData.roles type:', typeof oldData?.roles);
    console.log('FormUser - oldData.roles isArray:', Array.isArray(oldData?.roles));

    // Generate role options from the roles array in the response
    const roleOptions = React.useMemo(() => {
        console.log('Generating roleOptions - oldData?.roles:', oldData?.roles);
        if (!oldData?.roles || !Array.isArray(oldData.roles)) {
            console.log('No roles found or not an array, returning empty array');
            return [];
        }
        // Create options from the roles array - each role becomes an option
        const options = oldData.roles.map(role => ({
            label: role,
            value: role,
            id: role,
            name: role
        }));
        console.log('Generated roleOptions:', options);
        return options;
    }, [oldData?.roles]);

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
                                        field.name === 'roles' && Array.isArray(oldData?.[field.name])
                                            ? oldData[field.name]
                                            : oldData?.[field.name] || field.defaultValue
                                    }
                                    isMulti={field.isMulti}
                                    options={
                                        field.name === 'user_type'
                                            ? generateBilingualUserTypeOptions(options?.[field.name])
                                            : field.name === 'roles'
                                            ? roleOptions
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
