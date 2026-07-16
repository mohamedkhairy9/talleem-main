import React from 'react';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import useLocale from '@/utils/hooks/global/useLocale';
import { formatDateForDisplay } from '@/utils/helpers/dateObjectHelpers';

const FALLBACK = 'N/A';

function extractValue(value, locale) {
    if (value === null || value === undefined) return null;
    if (typeof value === 'string' || typeof value === 'number') {
        return String(value);
    }
    if (Array.isArray(value)) {
        return value.map(item => extractValue(item, locale)).filter(Boolean).join(', ');
    }

    const localizedValue =
        value?.[locale] ||
        value?.[locale?.split('-')[0]] ||
        value?.en ||
        value?.ar;

    return localizedValue && localizedValue !== value
        ? extractValue(localizedValue, locale)
        : null;
}

function formatLabel(value) {
    if (value === null || value === undefined || value === '') return FALLBACK;
    return String(value)
        .replace(/_/g, ' ')
        .replace(/-/g, ' ')
        .replace(/\b\w/g, char => char.toUpperCase());
}

function getNotificationData(notification) {
    return notification?.data || {};
}

function getSendingType(notification) {
    const data = getNotificationData(notification);
    return (
        data.sending_type ||
        data.delivery_method ||
        notification?.sending_type ||
        notification?.delivery_method ||
        FALLBACK
    );
}

export default function ViewNotification({ onClose, notification }) {
    const { t, currentLocale } = useLocale();
    const data = getNotificationData(notification);

    const title =
        extractValue(data.title, currentLocale) ||
        extractValue(notification?.title, currentLocale) ||
        extractValue(data.subject, currentLocale) ||
        FALLBACK;
    const body =
        extractValue(data.content, currentLocale) ||
        extractValue(data.body, currentLocale) ||
        extractValue(data.message, currentLocale) ||
        extractValue(notification?.content, currentLocale) ||
        FALLBACK;
    const titleEn =
        extractValue(data.title, 'en') ||
        extractValue(notification?.title, 'en') ||
        FALLBACK;
    const titleAr =
        extractValue(data.title, 'ar') ||
        extractValue(notification?.title, 'ar') ||
        FALLBACK;
    const contentEn =
        extractValue(data.content, 'en') ||
        extractValue(data.body, 'en') ||
        extractValue(data.message, 'en') ||
        extractValue(notification?.content, 'en') ||
        FALLBACK;
    const contentAr =
        extractValue(data.content, 'ar') ||
        extractValue(data.body, 'ar') ||
        extractValue(data.message, 'ar') ||
        extractValue(notification?.content, 'ar') ||
        FALLBACK;
    const recipientName =
        extractValue(notification?.notifiable?.name, currentLocale) ||
        notification?.notifiable?.email ||
        notification?.notifiable?.phone ||
        FALLBACK;
    const isRead = Boolean(notification?.read_at);

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
                {value ? t('common.yes') : t('common.no')}
            </span>
        </div>
    );

    return (
        <Modal onClose={onClose} size="4xl">
            <ModalHeader onClose={onClose} header={t('notifications.view')} />
            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
                <section className="space-y-3">
                    <h3 className="font-semibold text-lg text-gray-900 border-b pb-2">
                        {t('notifications.notification_info')}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {renderField('ID', notification?.id)}
                        {renderField(
                            t('table_headers.type'),
                            formatLabel(notification?.type_label || notification?.type)
                        )}
                        {renderField(
                            t('notifications.sending_method'),
                            formatLabel(getSendingType(notification))
                        )}
                        {renderField(
                            t('notifications.template_id'),
                            notification?.template_id || data.template_id
                        )}
                    </div>
                </section>

                <section className="space-y-3">
                    <h3 className="font-semibold text-lg text-gray-900 border-b pb-2">
                        {t('notifications.content')}
                    </h3>
                    {renderField(t('table_headers.subject'), title)}
                    {renderField(t('notifications.message'), body)}
                </section>

                <section className="space-y-3">
                    <h3 className="font-semibold text-lg text-gray-900 border-b pb-2">
                        {t('notifications.bilingual_content')}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <h4 className="font-medium text-sm text-blue-900">
                                English
                            </h4>
                            {renderField(t('notifications.title_en'), titleEn)}
                            {renderField(t('notifications.content_en'), contentEn)}
                        </div>
                        <div className="space-y-3 p-4 bg-green-50 rounded-lg border border-green-200">
                            <h4 className="font-medium text-sm text-green-900">
                                العربية
                            </h4>
                            {renderField(t('notifications.title_ar'), titleAr)}
                            {renderField(t('notifications.content_ar'), contentAr)}
                        </div>
                    </div>
                </section>

                <section className="space-y-3">
                    <h3 className="font-semibold text-lg text-gray-900 border-b pb-2">
                        {t('notifications.recipient_info')}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {renderField(t('table_headers.user'), recipientName)}
                        {renderField(
                            t('table_headers.email'),
                            notification?.notifiable?.email
                        )}
                        {renderField(
                            t('table_headers.phone'),
                            notification?.notifiable?.phone
                        )}
                        {renderField(
                            t('notifications.user_type'),
                            notification?.notifiable?.user_type
                        )}
                        {renderField(
                            t('notifications.branch_id'),
                            notification?.notifiable?.branch_id
                        )}
                        {renderField(
                            t('notifications.entity_id'),
                            notification?.notifiable?.entity_id
                        )}
                    </div>
                </section>

                <section className="space-y-3">
                    <h3 className="font-semibold text-lg text-gray-900 border-b pb-2">
                        {t('table_headers.status')}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {renderBooleanField(t('notifications.read_status'), isRead)}
                        {renderField(
                            t('notifications.read_at'),
                            notification?.read_at
                                ? formatDateForDisplay(notification.read_at)
                                : FALLBACK
                        )}
                        {renderBooleanField(
                            t('notifications.user_active'),
                            Boolean(notification?.notifiable?.status)
                        )}
                        {renderBooleanField(
                            t('notifications.email_verified'),
                            Boolean(notification?.notifiable?.email_verified_at)
                        )}
                    </div>
                </section>

                <section className="space-y-3">
                    <h3 className="font-semibold text-lg text-gray-900 border-b pb-2">
                        {t('notifications.timestamps')}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {renderField(
                            t('table_headers.created_at'),
                            formatDateForDisplay(notification?.created_at)
                        )}
                        {renderField(
                            t('table_headers.updated_at'),
                            formatDateForDisplay(notification?.updated_at)
                        )}
                    </div>
                </section>

                <details className="space-y-3">
                    <summary className="font-semibold text-lg text-gray-900 border-b pb-2 cursor-pointer hover:text-blue-600">
                        {t('notifications.technical_details')}
                    </summary>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3">
                        {renderField(
                            t('notifications.notifiable_type'),
                            notification?.notifiable_type
                        )}
                        {renderField(
                            t('notifications.notifiable_id'),
                            notification?.notifiable_id
                        )}
                        {renderField('GUID', notification?.notifiable?.guid)}
                        {renderField(
                            t('notifications.locale'),
                            notification?.notifiable?.locale
                        )}
                        {renderField(
                            'FCM Token',
                            notification?.notifiable?.fcm_token ? 'Available' : FALLBACK
                        )}
                    </div>
                </details>
            </div>
        </Modal>
    );
}
