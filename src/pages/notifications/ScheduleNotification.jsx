import React, { useMemo } from 'react';
import * as yup from 'yup';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import InputRFH from '@/components/common/inputs/InputRFH';
import Btn from '@/components/common/buttons/Btn';
import useRFH from '@/utils/hooks/global/useRFH';
import useLocale from '@/utils/hooks/global/useLocale';
import { useScheduleNotificationMutation } from '@/api/hooks/useNotifications';
import { useNotificationTemplatesQuery } from '@/api/hooks/useNotificationTemplates';
import { useRolesQuery } from '@/api/hooks/useRoles';
import { allData } from '@/utils/constants/global.constants';

const extractCollection = response => {
    if (Array.isArray(response)) return response;
    if (Array.isArray(response?.data)) return response.data;
    if (Array.isArray(response?.items)) return response.items;
    if (Array.isArray(response?.results)) return response.results;
    return [];
};

const getLocalizedText = (value, locale) => {
    if (typeof value === 'string') return value;
    if (!value || typeof value !== 'object') return '';

    return value[locale] || value[locale?.split('-')[0]] || value.en || value.ar || '';
};

export default function ScheduleNotification({ onClose }) {
    const { currentLocale } = useLocale();
    const isArabic = currentLocale === 'ar';
    const { data: templatesResponse, isLoading: isTemplatesLoading } =
        useNotificationTemplatesQuery(allData);
    const { data: rolesResponse, isLoading: isRolesLoading } =
        useRolesQuery(allData);
    const { mutate, isPending } = useScheduleNotificationMutation();

    const schema = useMemo(
        () =>
            yup.object({
                template_id: yup
                    .number()
                    .required(isArabic ? 'اختر قالب الإشعار' : 'Select a notification template'),
                roles: yup
                    .array()
                    .min(1, isArabic ? 'اختر دورًا واحدًا على الأقل' : 'Select at least one role')
                    .required(isArabic ? 'اختر دورًا واحدًا على الأقل' : 'Select at least one role'),
                scheduled_date: yup
                    .string()
                    .required(isArabic ? 'اختر التاريخ' : 'Select a date'),
                scheduled_time: yup
                    .string()
                    .required(isArabic ? 'اختر الوقت' : 'Select a time')
            }),
        [isArabic]
    );

    const { register, errors, handleSubmit, control } = useRFH({
        schema,
        defaultValues: {
            template_id: null,
            roles: [],
            scheduled_date: '',
            scheduled_time: ''
        }
    });

    const templateOptions = useMemo(
        () =>
            extractCollection(templatesResponse).map(template => ({
                value: template.id,
                label:
                    getLocalizedText(template.subject, currentLocale) ||
                    getLocalizedText(template.title, currentLocale) ||
                    getLocalizedText(template.name, currentLocale) ||
                    `#${template.id}`
            })),
        [templatesResponse, currentLocale]
    );

    const roleOptions = useMemo(
        () =>
            extractCollection(rolesResponse)
                .map(role => {
                    const value = role.name || role.slug || role.key;
                    return {
                        value,
                        label:
                            getLocalizedText(role.display_name, currentLocale) ||
                            getLocalizedText(role.name, currentLocale) ||
                            role.slug ||
                            role.key
                    };
                })
                .filter(role => role.value),
        [rolesResponse, currentLocale]
    );

    const onSubmit = data => {
        mutate(
            {
                template_id: Number(data.template_id),
                roles: data.roles,
                scheduled_date: data.scheduled_date,
                scheduled_time: data.scheduled_time
            },
            { onSuccess: onClose }
        );
    };

    return (
        <Modal onClose={onClose} size="2xl">
            <ModalHeader
                onClose={onClose}
                header={isArabic ? 'جدولة إشعار' : 'Schedule Notification'}
            />
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 p-6">
                <InputRFH
                    control={control}
                    register={register}
                    error={errors.template_id?.message}
                    type="select"
                    name="template_id"
                    label={isArabic ? 'قالب الإشعار' : 'Notification Template'}
                    placeholder={isArabic ? 'اختر قالب الإشعار' : 'Select notification template'}
                    options={templateOptions}
                    loading={isTemplatesLoading}
                    required
                />
                <InputRFH
                    control={control}
                    register={register}
                    error={errors.roles?.message}
                    type="select"
                    name="roles"
                    label={isArabic ? 'الأدوار' : 'Roles'}
                    placeholder={isArabic ? 'اختر الأدوار' : 'Select roles'}
                    options={roleOptions}
                    loading={isRolesLoading}
                    isMulti
                    required
                />
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <InputRFH
                        control={control}
                        register={register}
                        error={errors.scheduled_date?.message}
                        type="date"
                        name="scheduled_date"
                        label={isArabic ? 'تاريخ الإرسال' : 'Scheduled Date'}
                        required
                    />
                    <InputRFH
                        control={control}
                        register={register}
                        error={errors.scheduled_time?.message}
                        type="time"
                        name="scheduled_time"
                        label={isArabic ? 'وقت الإرسال' : 'Scheduled Time'}
                        required
                    />
                </div>
                <div className="flex gap-3 border-t pt-4">
                    <Btn
                        type="button"
                        onClick={onClose}
                        className="flex-1 bg-gray-200 py-3 text-gray-800 hover:bg-gray-300"
                        label="common.cancel"
                    />
                    <Btn
                        type="submit"
                        loading={isPending}
                        className="flex-1 py-3"
                        label={isArabic ? 'جدولة الإشعار' : 'Schedule Notification'}
                    />
                </div>
            </form>
        </Modal>
    );
}
