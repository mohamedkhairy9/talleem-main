import React from 'react';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import useLocale from '@/utils/hooks/global/useLocale';
import { formatDateForDisplay } from '@/utils/helpers/dateObjectHelpers';
import { useNotificationTemplateQuery } from '@/api/hooks/useNotificationTemplates';

const FALLBACK = 'N/A';

function formatLabel(value) {
    if (value === null || value === undefined || value === '') return FALLBACK;
    return String(value)
        .replace(/_/g, ' ')
        .replace(/-/g, ' ')
        .replace(/\b\w/g, char => char.toUpperCase());
}

function getLocalizedValue(value, locale) {
    if (!value) return '';
    if (typeof value === 'string') return value;
    return value?.[locale] || value?.en || value?.ar || '';
}

function getRoleNames(template, locale) {
    if (Array.isArray(template?.target_role_labels)) {
        return template.target_role_labels
            .map(role =>
                locale === 'ar'
                    ? role?.display_name || role?.name
                    : role?.name || role?.display_name
            )
            .filter(Boolean)
            .join(', ');
    }

    if (Array.isArray(template?.target_roles)) {
        return template.target_roles.map(formatLabel).join(', ');
    }

    return '';
}

function getDeliveryMethods(template) {
    if (Array.isArray(template?.delivery_methods)) {
        return template.delivery_methods.map(formatLabel).join(', ');
    }

    const methods = [
        template?.send_via_inbox && 'Inbox',
        template?.send_via_email && 'Email',
        template?.send_via_sms && 'SMS',
        template?.send_via_whatsapp && 'WhatsApp'
    ].filter(Boolean);

    return methods.join(', ');
}

function getDeliveryMethodOptions(template) {
    if (!Array.isArray(template?.delivery_method_options)) return '';

    return template.delivery_method_options
        .map(option => option?.label || formatLabel(option?.value))
        .filter(Boolean)
        .join(', ');
}

function getTemplateId(template) {
    return (
        template?.notification_template_id ||
        template?.template_id ||
        template?.id
    );
}

function extractTemplateDetails(response, fallback) {
    return (
        response?.data?.data ||
        response?.data ||
        response?.notification_template ||
        response ||
        fallback
    );
}

export default function ViewNotificationTemplate({ onClose, template }) {
    const { t, currentLocale } = useLocale();
    const templateId = getTemplateId(template);
    const {
        data: templateDetailsResponse,
        isLoading,
        hasError
    } = useNotificationTemplateQuery(templateId, {
        enabled: Boolean(templateId)
    });
    const templateDetails = extractTemplateDetails(templateDetailsResponse, template);

    const renderField = (label, value) => (
        <div className="space-y-1">
            <label className="text-sm font-medium text-gray-600">{label}</label>
            <div className="px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 text-sm text-gray-900 whitespace-pre-wrap">
                {value || FALLBACK}
            </div>
        </div>
    );

    const renderBooleanField = (label, value) => (
        <div className="flex items-center justify-between gap-3 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
            <span className="text-sm font-medium text-gray-700">{label}</span>
            <span
                className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${
                    value
                        ? 'bg-green-100 text-green-800 border-green-200'
                        : 'bg-gray-100 text-gray-800 border-gray-200'
                }`}
            >
                {value ? t('validation.enabled.label') : t('validation.disabled.label')}
            </span>
        </div>
    );

    const renderContentBlock = (title, value) => {
        if (!value) return null;
        return (
            <div className="space-y-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h4 className="font-medium text-sm text-gray-900">{title}</h4>
                {renderField(`${title} (EN)`, value?.en)}
                {renderField(`${title} (AR)`, value?.ar)}
            </div>
        );
    };

    return (
        <Modal onClose={onClose} size="4xl">
            <ModalHeader onClose={onClose} header="notifications.template" />
            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
                <section className="space-y-3">
                    <h3 className="font-semibold text-lg text-gray-900 border-b pb-2">
                        {t('activity_logs.basic_info')}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {renderField(
                            'Notification Template ID',
                            getTemplateId(templateDetails)
                        )}
                        {renderField(t('table_headers.id'), templateDetails?.id)}
                        {renderField(
                            t('table_headers.type'),
                            formatLabel(templateDetails?.type_label || templateDetails?.type)
                        )}
                        {renderField(
                            t('table_headers.subject') + ' (EN)',
                            templateDetails?.subject?.en
                        )}
                        {renderField(
                            t('table_headers.subject') + ' (AR)',
                            templateDetails?.subject?.ar
                        )}
                        {renderField(
                            t('notifications.role'),
                            getRoleNames(templateDetails, currentLocale)
                        )}
                        {renderField(
                            t('table_headers.sent_via'),
                            getDeliveryMethods(templateDetails)
                        )}
                        {renderField(
                            'Available Delivery Methods',
                            getDeliveryMethodOptions(templateDetails)
                        )}
                    </div>
                    {isLoading && (
                        <p className="text-sm text-gray-500">
                            Loading latest template details...
                        </p>
                    )}
                    {hasError && (
                        <p className="text-sm text-red-600">
                            Could not load latest template details. Showing table data.
                        </p>
                    )}
                </section>

                <section className="space-y-3">
                    <h3 className="font-semibold text-lg text-gray-900 border-b pb-2">
                        {t('notifications.content')}
                    </h3>
                    {renderField(
                        t('table_headers.subject'),
                        getLocalizedValue(templateDetails?.subject, currentLocale)
                    )}
                    {renderField(
                        t('notifications.message'),
                        getLocalizedValue(templateDetails?.content, currentLocale) ||
                            getLocalizedValue(
                                templateDetails?.inbox_content,
                                currentLocale
                            )
                    )}
                </section>

                <section className="space-y-3">
                    <h3 className="font-semibold text-lg text-gray-900 border-b pb-2">
                        {t('notifications.bilingual_content')}
                    </h3>
                    <div className="grid grid-cols-1 gap-4">
                        {renderContentBlock(
                            t('notifications.content'),
                            templateDetails?.content
                        )}
                        {renderContentBlock(
                            t('table_headers.inbox'),
                            templateDetails?.inbox_content
                        )}
                        {renderContentBlock(
                            t('notifications.email_content'),
                            templateDetails?.email_content
                        )}
                        {renderContentBlock(
                            t('notifications.sms_content'),
                            templateDetails?.sms_content
                        )}
                        {renderContentBlock(
                            t('notifications.whatsapp_content'),
                            templateDetails?.whatsapp_content
                        )}
                    </div>
                </section>

                <section className="space-y-3">
                    <h3 className="font-semibold text-lg text-gray-900 border-b pb-2">
                        {t('table_headers.sent_via')}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                        {renderBooleanField(
                            t('table_headers.inbox'),
                            templateDetails?.send_via_inbox
                        )}
                        {renderBooleanField(
                            t('table_headers.email'),
                            templateDetails?.send_via_email
                        )}
                        {renderBooleanField(
                            t('table_headers.sms'),
                            templateDetails?.send_via_sms
                        )}
                        {renderBooleanField(
                            t('notifications.whatsapp'),
                            templateDetails?.send_via_whatsapp
                        )}
                    </div>
                </section>

                <section className="space-y-3">
                    <h3 className="font-semibold text-lg text-gray-900 border-b pb-2">
                        {t('table_headers.status')}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {renderBooleanField(
                            t('table_headers.status'),
                            templateDetails?.status
                        )}
                        {renderBooleanField(
                            'Active Users Only',
                            templateDetails?.active_users_only
                        )}
                        {renderBooleanField(
                            t('table_headers.scheduled'),
                            templateDetails?.is_scheduled
                        )}
                    </div>
                </section>

                <section className="space-y-3">
                    <h3 className="font-semibold text-lg text-gray-900 border-b pb-2">
                        Variables
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {(templateDetails?.available_variables || []).length > 0 ? (
                            templateDetails.available_variables.map(variable => (
                                <span
                                    key={variable}
                                    className="inline-flex rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-700"
                                >
                                    {variable}
                                </span>
                            ))
                        ) : (
                            <span className="text-sm text-gray-500">{FALLBACK}</span>
                        )}
                    </div>
                </section>

                {templateDetails?.is_scheduled && (
                    <section className="space-y-3">
                        <h3 className="font-semibold text-lg text-gray-900 border-b pb-2">
                            Schedule Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {renderField(
                                'Schedule Type',
                                templateDetails?.schedule_type
                            )}
                            {renderField('Day of Week', templateDetails?.day_of_week)}
                            {renderField(
                                'Month Period',
                                templateDetails?.month_period
                            )}
                            {renderField(
                                'Month of Year',
                                templateDetails?.month_of_year
                            )}
                            {renderField(
                                t('validation.start_date.label'),
                                templateDetails?.start_date
                            )}
                            {renderField('Start Time', templateDetails?.start_time)}
                            {renderField(
                                'Last Sent Date',
                                templateDetails?.last_sent_date
                            )}
                        </div>
                    </section>
                )}

                <section className="space-y-3">
                    <h3 className="font-semibold text-lg text-gray-900 border-b pb-2">
                        Timestamps
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {renderField(
                            t('table_headers.created_at'),
                            formatDateForDisplay(templateDetails?.created_at)
                        )}
                        {renderField(
                            t('table_headers.updated_at'),
                            formatDateForDisplay(templateDetails?.updated_at)
                        )}
                    </div>
                </section>
            </div>
        </Modal>
    );
}
