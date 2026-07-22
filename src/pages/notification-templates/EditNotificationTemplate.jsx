import React, { useEffect, useMemo } from 'react';
import * as yup from 'yup';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import InputRFH from '@/components/common/inputs/InputRFH';
import Btn from '@/components/common/buttons/Btn';
import Loader from '@/components/common/Loader';
import useRFH from '@/utils/hooks/global/useRFH';
import useLocale from '@/utils/hooks/global/useLocale';
import { allData } from '@/utils/constants/global.constants';
import { useRolesQuery } from '@/api/hooks/useRoles';
import {
    useNotificationTemplateQuery,
    useUpdateNotificationTemplateMutation
} from '@/api/hooks/useNotificationTemplates';

const extractCollection = response => {
    if (Array.isArray(response)) return response;
    if (Array.isArray(response?.data)) return response.data;
    if (Array.isArray(response?.items)) return response.items;
    if (Array.isArray(response?.results)) return response.results;
    return [];
};

const extractTemplate = (response, fallback) =>
    response?.data?.data ||
    response?.data ||
    response?.notification_template ||
    response ||
    fallback;

const getLocalizedValue = (value, locale) => {
    if (typeof value === 'string') return value;
    if (!value || typeof value !== 'object') return '';
    return value[locale] || value[locale?.split('-')[0]] || value.en || value.ar || '';
};

const getRoleIdentifier = role => {
    if (typeof role === 'string') return role;
    if (typeof role?.name === 'string') return role.name;
    if (typeof role?.slug === 'string') return role.slug;
    if (typeof role?.key === 'string') return role.key;
    if (typeof role?.name?.en === 'string') return role.name.en;
    if (typeof role?.name?.ar === 'string') return role.name.ar;
    if (typeof role?.display_name === 'string') return role.display_name;
    return null;
};

const getTemplateId = template =>
    template?.notification_template_id || template?.template_id || template?.id;

const getDeliveryMethods = template => {
    if (Array.isArray(template?.delivery_methods)) {
        return template.delivery_methods.join(', ');
    }

    return [
        template?.send_via_inbox && 'Inbox',
        template?.send_via_email && 'Email',
        template?.send_via_sms && 'SMS',
        template?.send_via_whatsapp && 'WhatsApp'
    ]
        .filter(Boolean)
        .join(', ');
};

export default function EditNotificationTemplate({ onClose, template }) {
    const { currentLocale } = useLocale();
    const isArabic = currentLocale === 'ar';
    const templateId = getTemplateId(template);
    const detailsQuery = useNotificationTemplateQuery(templateId, {
        enabled: Boolean(templateId)
    });
    const rolesQuery = useRolesQuery(allData);
    const { mutate, isPending } = useUpdateNotificationTemplateMutation();
    const resolvedTemplate = extractTemplate(detailsQuery.data, template);
    const roles = useMemo(() => extractCollection(rolesQuery.data), [rolesQuery.data]);
    const schema = useMemo(
        () =>
            yup.object({
                content_ar: yup.string(),
                content_en: yup.string(),
                target_roles: yup
                    .array()
                    .min(1, isArabic ? 'اختر دورًا واحدًا على الأقل' : 'Select at least one role')
                    .required(isArabic ? 'اختر دورًا واحدًا على الأقل' : 'Select at least one role')
            }),
        [isArabic]
    );
    const { register, errors, handleSubmit, control, reset } = useRFH({
        schema,
        defaultValues: {
            content_ar: '',
            content_en: '',
            target_roles: []
        }
    });

    const roleOptions = useMemo(
        () =>
            roles
                .map(role => ({
                    value: getRoleIdentifier(role),
                    label:
                        getLocalizedValue(role.display_name, currentLocale) ||
                        getLocalizedValue(role.name, currentLocale) ||
                        role.slug ||
                        role.key
                }))
                .filter(role => role.value && role.label),
        [roles, currentLocale]
    );

    useEffect(() => {
        const configuredRoles = Array.isArray(resolvedTemplate?.target_roles)
            ? resolvedTemplate.target_roles.map(getRoleIdentifier).filter(Boolean)
            : Array.isArray(resolvedTemplate?.target_role_labels)
            ? resolvedTemplate.target_role_labels
                  .map(getRoleIdentifier)
                  .filter(Boolean)
            : [];

        reset({
            content_ar: getLocalizedValue(
                resolvedTemplate?.content || resolvedTemplate?.inbox_content,
                'ar'
            ),
            content_en: getLocalizedValue(
                resolvedTemplate?.content || resolvedTemplate?.inbox_content,
                'en'
            ),
            target_roles: configuredRoles
        });
    }, [resolvedTemplate, reset]);

    const onSubmit = data => {
        mutate(
            {
                id: templateId,
                data: {
                    content: {
                        ar: data.content_ar?.trim() || '',
                        en: data.content_en?.trim() || ''
                    },
                    target_roles: data.target_roles
                }
            },
            { onSuccess: onClose }
        );
    };

    if (detailsQuery.isLoading || rolesQuery.isLoading) return <Loader />;

    return (
        <Modal onClose={onClose} size="3xl">
            <ModalHeader
                onClose={onClose}
                header={isArabic ? 'تعديل قالب الإشعار' : 'Edit Notification Template'}
            />
            <form onSubmit={handleSubmit(onSubmit)} className="max-h-[75vh] space-y-5 overflow-y-auto p-6">
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700">
                    <span className="font-semibold">{isArabic ? 'طرق الإرسال الثابتة: ' : 'Fixed delivery methods: '}</span>
                    {getDeliveryMethods(resolvedTemplate) || '-'}
                </div>
                <InputRFH
                    control={control}
                    register={register}
                    error={errors.target_roles?.message}
                    type="select"
                    name="target_roles"
                    label={isArabic ? 'الأدوار المستهدفة' : 'Target roles'}
                    placeholder={isArabic ? 'اختر الأدوار' : 'Select roles'}
                    options={roleOptions}
                    isMulti
                    required
                />
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <InputRFH
                        control={control}
                        register={register}
                        error={errors.content_ar?.message}
                        type="textarea"
                        name="content_ar"
                        label={isArabic ? 'محتوى الإشعار (عربي)' : 'Notification content (Arabic)'}
                        placeholder={isArabic ? 'اكتب محتوى الإشعار بالعربية' : 'Enter Arabic notification content'}
                        p="min-h-32 px-3 py-3"
                    />
                    <InputRFH
                        control={control}
                        register={register}
                        error={errors.content_en?.message}
                        type="textarea"
                        name="content_en"
                        label={isArabic ? 'محتوى الإشعار (إنجليزي)' : 'Notification content (English)'}
                        placeholder={isArabic ? 'اكتب محتوى الإشعار بالإنجليزية' : 'Enter English notification content'}
                        p="min-h-32 px-3 py-3"
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
                        label={isArabic ? 'حفظ التعديلات' : 'Save changes'}
                    />
                </div>
            </form>
        </Modal>
    );
}
