import React from 'react';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import useLocale from '@/utils/hooks/global/useLocale';
import { formatDateForDisplay } from '@/utils/helpers/dateObjectHelpers';

export default function ViewNotification({ onClose, notification }) {
    const { t, currentLocale } = useLocale();

    const renderField = (label, value) => (
        <div className="space-y-1">
            <label className="text-sm font-medium text-gray-600">{label}</label>
            <div className="px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 text-sm text-gray-900">
                {value || 'N/A'}
            </div>
        </div>
    );

    const renderBooleanField = (label, value) => (
        <div className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
            <span className="text-sm font-medium text-gray-700">{label}</span>
            {value ? (
                <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 border border-green-200">
                    ✓ {t('common.yes')}
                </span>
            ) : (
                <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800 border border-gray-200">
                    ✗ {t('common.no')}
                </span>
            )}
        </div>
    );

    // Helper function to extract nested values
    const extractValue = (obj, locale) => {
        if (!obj) return null;
        
        // If it's a string, return it
        if (typeof obj === 'string') return obj;
        
        // If it has the current locale
        if (obj[locale]) {
            // Check if it's nested again
            if (typeof obj[locale] === 'object' && obj[locale][locale]) {
                return obj[locale][locale];
            }
            return obj[locale];
        }
        
        // Fallback to en or ar
        if (obj.en) {
            if (typeof obj.en === 'object' && obj.en.en) {
                return obj.en.en;
            }
            return obj.en;
        }
        
        if (obj.ar) {
            if (typeof obj.ar === 'object' && obj.ar.ar) {
                return obj.ar.ar;
            }
            return obj.ar;
        }
        
        return null;
    };

    // Get user name
    const userName = extractValue(notification?.notifiable?.name, currentLocale) || 'N/A';

    // Get title based on language
    const title = extractValue(notification?.data?.title, currentLocale) || 'N/A';

    // Get body/content based on language
    const body = extractValue(notification?.data?.content, currentLocale) || 
                 extractValue(notification?.data?.body, currentLocale) || 'N/A';

    // Get English title
    const titleEn = extractValue(notification?.data?.title, 'en') || 'N/A';
    
    // Get Arabic title
    const titleAr = extractValue(notification?.data?.title, 'ar') || 'N/A';

    // Get English content
    const contentEn = extractValue(notification?.data?.content, 'en') || 
                      extractValue(notification?.data?.body, 'en') || 'N/A';
    
    // Get Arabic content
    const contentAr = extractValue(notification?.data?.content, 'ar') || 
                      extractValue(notification?.data?.body, 'ar') || 'N/A';

    // Sending type badge
    const getSendingTypeBadge = (type) => {
        const typeMap = {
            sms: {
                label: 'SMS',
                color: 'bg-purple-100 text-purple-800 border-purple-200',
                icon: '📱'
            },
            email: {
                label: t('notifications.email'),
                color: 'bg-blue-100 text-blue-800 border-blue-200',
                icon: '📧'
            },
            'in-app-inbox': {
                label: t('notifications.push'),
                color: 'bg-green-100 text-green-800 border-green-200',
                icon: '📬'
            },
            push: {
                label: t('notifications.push'),
                color: 'bg-indigo-100 text-indigo-800 border-indigo-200',
                icon: '📬'
            },
            whatsapp: {
                label: t('notifications.whatsapp'),
                color: 'bg-green-100 text-green-800 border-green-200',
                icon: '💬'
            }
        };
        
        const typeInfo = typeMap[type] || {
            label: type,
            color: 'bg-gray-100 text-gray-800 border-gray-200',
            icon: '📨'
        };

        return (
            <span className={`inline-flex items-center gap-1 px-3 py-1 text-sm font-medium rounded-full border ${typeInfo.color}`}>
                <span>{typeInfo.icon}</span>
                <span>{typeInfo.label}</span>
            </span>
        );
    };

    return (
        <Modal onClose={onClose} size="4xl">
            <ModalHeader onClose={onClose} header={t('notifications.view')} />
            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
                {/* Notification Info */}
                <div className="space-y-3">
                    <h3 className="font-semibold text-lg text-gray-900 border-b pb-2">
                        {t('notifications.notification_info')}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {renderField('ID', notification?.id)}
                        {renderField(t('table_headers.type'), notification?.type)}
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-600">
                                {t('notifications.sending_method')}
                            </label>
                            <div>
                                {getSendingTypeBadge(notification?.data?.sending_type)}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content - Current Language */}
                <div className="space-y-3">
                    <h3 className="font-semibold text-lg text-gray-900 border-b pb-2">
                        {t('notifications.content')} ({currentLocale === 'ar' ? 'عربي' : 'English'})
                    </h3>
                    {renderField(t('table_headers.subject'), title)}
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-600">
                            {t('notifications.message')}
                        </label>
                        <div className="px-3 py-3 bg-gray-50 rounded-lg border border-gray-200 text-sm text-gray-900 whitespace-pre-wrap">
                            {body}
                        </div>
                    </div>
                </div>

                {/* Bilingual Content */}
                {(titleEn !== 'N/A' || titleAr !== 'N/A') && (
                    <div className="space-y-3">
                        <h3 className="font-semibold text-lg text-gray-900 border-b pb-2">
                            {t('notifications.bilingual_content')}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* English */}
                            <div className="space-y-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                <h4 className="font-medium text-sm text-blue-900 flex items-center gap-2">
                                    <span>🇬🇧</span>
                                    <span>English</span>
                                </h4>
                                {renderField(t('notifications.title_en'), titleEn)}
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-600">
                                        {t('notifications.content_en')}
                                    </label>
                                    <div className="px-3 py-3 bg-white rounded-lg border border-blue-200 text-sm text-gray-900 whitespace-pre-wrap">
                                        {contentEn}
                                    </div>
                                </div>
                            </div>
                            
                            {/* Arabic */}
                            <div className="space-y-3 p-4 bg-green-50 rounded-lg border border-green-200">
                                <h4 className="font-medium text-sm text-green-900 flex items-center gap-2">
                                    <span>🇸🇦</span>
                                    <span>العربية</span>
                                </h4>
                                {renderField(t('notifications.title_ar'), titleAr)}
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-600">
                                        {t('notifications.content_ar')}
                                    </label>
                                    <div className="px-3 py-3 bg-white rounded-lg border border-green-200 text-sm text-gray-900 whitespace-pre-wrap" dir="rtl">
                                        {contentAr}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Recipient Info */}
                <div className="space-y-3">
                    <h3 className="font-semibold text-lg text-gray-900 border-b pb-2">
                        {t('notifications.recipient_info')}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {renderField(t('table_headers.user'), userName)}
                        {renderField(t('table_headers.email'), notification?.notifiable?.email)}
                        {renderField(t('table_headers.phone'), notification?.notifiable?.phone)}
                        {renderField(t('notifications.user_type'), notification?.notifiable?.user_type)}
                        {renderField(t('notifications.branch_id'), notification?.notifiable?.branch_id)}
                        {renderField(t('notifications.entity_id'), notification?.notifiable?.entity_id || 'N/A')}
                    </div>
                </div>

                {/* Status */}
                <div className="space-y-3">
                    <h3 className="font-semibold text-lg text-gray-900 border-b pb-2">
                        {t('table_headers.status')}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {renderBooleanField(
                            t('notifications.read_status'),
                            notification?.read_at !== null
                        )}
                        {notification?.read_at && renderField(
                            t('notifications.read_at'),
                            new Date(notification.read_at).toLocaleString(
                                currentLocale === 'ar' ? 'ar-EG' : 'en-US',
                                {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                }
                            )
                        )}
                        {renderBooleanField(
                            t('notifications.user_active'),
                            notification?.notifiable?.status
                        )}
                        {renderBooleanField(
                            t('notifications.email_verified'),
                            notification?.notifiable?.email_verified_at !== null
                        )}
                    </div>
                </div>

                {/* Timestamps */}
                <div className="space-y-3">
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
                </div>

                {/* Technical Details - Collapsible */}
                <details className="space-y-3">
                    <summary className="font-semibold text-lg text-gray-900 border-b pb-2 cursor-pointer hover:text-blue-600">
                        {t('notifications.technical_details')}
                    </summary>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3">
                        {renderField(t('notifications.notifiable_type'), notification?.notifiable_type)}
                        {renderField(t('notifications.notifiable_id'), notification?.notifiable_id)}
                        {renderField(t('notifications.template_id'), notification?.template_id || 'N/A')}
                        {renderField('GUID', notification?.notifiable?.guid || 'N/A')}
                        {renderField(t('notifications.locale'), notification?.notifiable?.locale)}
                        {renderField('FCM Token', notification?.notifiable?.fcm_token ? '••••••••' : 'N/A')}
                    </div>
                </details>
            </div>
        </Modal>
    );
}