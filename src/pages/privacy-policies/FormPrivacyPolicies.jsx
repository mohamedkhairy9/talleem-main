import useRFH from '@/utils/hooks/global/useRFH';
import { privacyPoliciesSchema as schema } from '@/utils/yup/privacyPolicies.schemas';
import React from 'react';
import { privacyPoliciesFields } from './configs';
import InputRFH from '@/components/common/inputs/InputRFH';
import Btn from '@/components/common/buttons/Btn';
import { getNestedError } from '@/utils/helpers/getNestedError';
import { generateOptions } from '@/utils/helpers/global.fns';

export default function FormPrivacyPolicies({
    oldData,
    isPending,
    mutate,
    options
}) {
    const { register, errors, handleSubmit, control } = useRFH({
        schema,
        defaultValues: oldData
    });

    function onSubmit(data) {
        console.log('data', data);
        mutate(data, {
            onSuccess: () => {
                console.log('Updated successfully');
            }
        });
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {privacyPoliciesFields.map(field => (
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
                    defaultValue={oldData?.[field.name] || field.defaultValue}
                    options={generateOptions(options?.[field.name])}
                    rows={field.type === 'textarea' ? 8 : undefined}
                />
            ))}
            <Btn
                loading={isPending}
                className="py-[10px] w-full"
                type="submit"
                label="common.submit"
            />
        </form>
    );
}
