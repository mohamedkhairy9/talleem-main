import React from 'react';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import useLocale from '@/utils/hooks/global/useLocale';

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
                    ✓ Yes
                </span>
            ) : (
                <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800 border border-gray-200">
                    ✗ No
                </span>
            )}
        </div>
    );

    // Get user name
    const userName =
        typeof notification?.notifiable?.name === 'string'
            ? notification?.notifiable?.name
            : notification?.notifiable?.name?.en ||
              notification?.notifiable?.name?.ar ||
              'N/A';

    // Get title based on language
    const title =
        typeof notification?.data?.title === 'string'
            ? notification?.data?.title
            : notification?.data?.title?.[currentLocale] ||
              notification?.data?.title?.en ||
              notification?.data?.title?.ar ||
              'N/A';

    // Get body based on language
    const body =
        typeof notification?.data?.body === 'string'
            ? notification?.data?.body
            : notification?.data?.body?.[currentLocale] ||
              notification?.data?.body?.en ||
              notification?.data?.body?.ar ||
              'N/A';

    return (
        <Modal onClose={onClose} size="3xl">
            <ModalHeader onClose={onClose} header="notifications.view" />
            <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
                {/* Notification Info */}
                <div className="space-y-3">
                    <h3 className="font-semibold text-lg text-gray-900 border-b pb-2">
                        Notification Information
                    </h3>
                    {renderField('ID', notification?.id)}
                    {renderField(t('table_headers.type'), notification?.type)}
                    {renderField('Template ID', notification?.template_id)}
                </div>

                {/* Content */}
                <div className="space-y-3">
                    <h3 className="font-semibold text-lg text-gray-900 border-b pb-2">
                        Content
                    </h3>
                    {renderField(t('table_headers.subject'), title)}
                    {renderField('Body', body)}
                    {renderField(
                        'Sending Type',
                        notification?.data?.sending_type
                    )}
                </div>

                {/* Bilingual Content */}
                {notification?.data?.title?.en &&
                    notification?.data?.title?.ar && (
                        <div className="space-y-3">
                            <h3 className="font-semibold text-lg text-gray-900 border-b pb-2">
                                Bilingual Content
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                    <h4 className="font-medium text-sm text-gray-700 mb-2">
                                        English
                                    </h4>
                                    {renderField(
                                        'Title (EN)',
                                        notification?.data?.title?.en
                                    )}
                                    {renderField(
                                        'Body (EN)',
                                        notification?.data?.body?.en
                                    )}
                                </div>
                                <div>
                                    <h4 className="font-medium text-sm text-gray-700 mb-2">
                                        Arabic
                                    </h4>
                                    {renderField(
                                        'Title (AR)',
                                        notification?.data?.title?.ar
                                    )}
                                    {renderField(
                                        'Body (AR)',
                                        notification?.data?.body?.ar
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                {/* Recipient Info */}
                <div className="space-y-3">
                    <h3 className="font-semibold text-lg text-gray-900 border-b pb-2">
                        Recipient Information
                    </h3>
                    {renderField(
                        'Notifiable Type',
                        notification?.notifiable_type
                    )}
                    {renderField('Notifiable ID', notification?.notifiable_id)}
                    {renderField(t('table_headers.user') + ' Name', userName)}
                    {renderField(
                        t('table_headers.email'),
                        notification?.notifiable?.email
                    )}
                    {renderField(
                        t('table_headers.phone'),
                        notification?.notifiable?.phone
                    )}
                    {renderField(
                        'User Type',
                        notification?.notifiable?.user_type
                    )}
                    {renderField(
                        'Branch ID',
                        notification?.notifiable?.branch_id
                    )}
                </div>

                {/* Status */}
                <div className="space-y-3">
                    <h3 className="font-semibold text-lg text-gray-900 border-b pb-2">
                        {t('table_headers.status')}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {renderBooleanField(
                            'Read',
                            notification?.read_at !== null
                        )}
                        {notification?.read_at &&
                            renderField(
                                'Read At',
                                new Date(notification.read_at).toLocaleString()
                            )}
                        {renderBooleanField(
                            'User Active',
                            notification?.notifiable?.status
                        )}
                    </div>
                </div>

                {/* Timestamps */}
                <div className="space-y-3">
                    <h3 className="font-semibold text-lg text-gray-900 border-b pb-2">
                        Timestamps
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {renderField(
                            t('table_headers.created_at'),
                            new Date(notification?.created_at).toLocaleString()
                        )}
                        {renderField(
                            t('table_headers.updated_at'),
                            new Date(notification?.updated_at).toLocaleString()
                        )}
                    </div>
                </div>

                {/* User Details */}
                {notification?.notifiable && (
                    <div className="space-y-3">
                        <h3 className="font-semibold text-lg text-gray-900 border-b pb-2">
                            Additional User Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {renderField(
                                'GUID',
                                notification?.notifiable?.guid || 'N/A'
                            )}
                            {renderField(
                                'Locale',
                                notification?.notifiable?.locale
                            )}
                            {renderField(
                                'FCM Token',
                                notification?.notifiable?.fcm_token || 'N/A'
                            )}
                            {renderField(
                                'Entity ID',
                                notification?.notifiable?.entity_id || 'N/A'
                            )}
                            {renderBooleanField(
                                'Email Verified',
                                notification?.notifiable?.email_verified_at !==
                                    null
                            )}
                        </div>
                    </div>
                )}
            </div>
        </Modal>
    );
}
