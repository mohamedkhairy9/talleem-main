import React, { useMemo } from 'react';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import { useTriggerNotificationMutation } from '@/api/hooks/useNotifications';
import { useRolesQuery } from '@/api/hooks/useRoles';
import { allData } from '@/utils/constants/global.constants';
import Loader from '@/components/common/Loader';
import useRFH from '@/utils/hooks/global/useRFH';
import * as yup from 'yup';
import { t } from 'i18next';
import InputRFH from '@/components/common/inputs/InputRFH';
import Btn from '@/components/common/buttons/Btn';
import { getNestedError } from '@/utils/helpers/getNestedError';
import useLocale from '@/utils/hooks/global/useLocale';

const triggerSchema = yup.object({
    template_id: yup.number().required(t('validation.required')),
    roles: yup
        .array()
        .of(yup.string())
        .min(1, t('validation.required'))
        .required(t('validation.required'))
});

const extractCollection = response => {
    if (Array.isArray(response)) return response;
    if (Array.isArray(response?.data)) return response.data;
    if (Array.isArray(response?.items)) return response.items;
    return [];
};

const getLocalizedValue = (value, locale) => {
    if (typeof value === 'string') return value;
    if (!value || typeof value !== 'object') return '';
    return value[locale] || value[locale?.split('-')[0]] || value.en || value.ar || '';
};

const getRoleIdentifier = role => {
    if (typeof role?.name === 'string') return role.name;
    if (typeof role?.slug === 'string') return role.slug;
    if (typeof role?.key === 'string') return role.key;
    if (typeof role?.name?.en === 'string') return role.name.en;
    if (typeof role?.name?.ar === 'string') return role.name.ar;
    return null;
};

export default function TriggerNotification({ onClose, template }) {
    const { mutate, isPending } = useTriggerNotificationMutation();
    const { currentLocale } = useLocale();
    const { data: rolesData, isLoading: rolesLoading } = useRolesQuery(allData);
    const roleOptions = useMemo(
        () =>
            extractCollection(rolesData)
                .map(role => ({
                    value: getRoleIdentifier(role),
                    label:
                        getLocalizedValue(role.display_name, currentLocale) ||
                        getLocalizedValue(role.name, currentLocale) ||
                        role.slug ||
                        role.key
                }))
                .filter(role => role.value && role.label),
        [rolesData, currentLocale]
    );

    const { register, errors, handleSubmit, control } = useRFH({
        schema: triggerSchema,
        defaultValues: {
            template_id:
                template?.notification_template_id ||
                template?.template_id ||
                template?.id,
            roles: []
        }
    });

    function onSubmit(data) {
        mutate(
            {
                template_id: data.template_id,
                roles: data.roles
            },
            {
                onSuccess: () => {
                    onClose();
                }
            }
        );
    }

    if (rolesLoading) return <Loader />;

    return (
        <Modal onClose={onClose} size="lg">
            <ModalHeader onClose={onClose} header="notifications.trigger" />
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                    <h3 className="mb-2 font-semibold text-blue-900">
                        {t('notifications.template')}
                    </h3>
                    <p className="text-blue-800">
                        {template?.subject?.[currentLocale] ||
                            template?.subject?.en ||
                            template?.subject?.ar}
                    </p>
                </div>

                <InputRFH
                    control={control}
                    register={register}
                    error={getNestedError(errors, 'roles')}
                    type="select"
                    label="validation.roles.label"
                    placeholder="validation.roles.placeholder"
                    name="roles"
                    options={roleOptions}
                    isMulti
                    required
                />

                <Btn
                    loading={isPending}
                    className="w-full py-[10px]"
                    type="submit"
                    label="notifications.send_now"
                />
            </form>
        </Modal>
    );
}
