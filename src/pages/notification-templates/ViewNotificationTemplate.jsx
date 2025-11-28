import React from 'react';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import useLocale from '@/utils/hooks/global/useLocale';

export default function ViewNotificationTemplate({ onClose, template }) {
    const { t } = useLocale();

    const renderField = (label, value) => (
        <div className="space-y-1">
            <label className="text-sm font-medium text-gray-600">{label}</label>
            <div className="px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
                {value || 'N/A'}
            </div>
        </div>
    );

    const renderBooleanField = (label, value) => (
        <div className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
            <span className="text-sm font-medium text-gray-700">{label}</span>
            {value ? (
                <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 border border-green-200">
                    ✓ {t('validation.enabled.label')}
                </span>
            ) : (
                <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800 border border-gray-200">
                    ✗ {t('validation.disabled.label')}
                </span>
            )}
        </div>
    );

    return (
        <Modal onClose={onClose} size="3xl">
            <ModalHeader onClose={onClose} header="notifications.template" />
            <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
                {/* Basic Info */}
                <div className="space-y-3">
                    <h3 className="font-semibold text-lg text-gray-900 border-b pb-2">
                        {t('activity_logs.basic_info')}
                    </h3>
                    {renderField(t('table_headers.id'), template?.id)}
                    {renderField(t('table_headers.type'), template?.type)}
                    {renderField(
                        t('table_headers.subject') + ' (EN)',
                        template?.subject?.en
                    )}
                    {renderField(
                        t('table_headers.subject') + ' (AR)',
                        template?.subject?.ar
                    )}
                </div>

                {/* Content */}
                <div className="space-y-3">
                    <h3 className="font-semibold text-lg text-gray-900 border-b pb-2">
                        Content
                    </h3>

                    {template?.inbox_content && (
                        <>
                            {renderField(
                                'Inbox Content (EN)',
                                template?.inbox_content?.en
                            )}
                            {renderField(
                                'Inbox Content (AR)',
                                template?.inbox_content?.ar
                            )}
                        </>
                    )}

                    {template?.email_content && (
                        <>
                            {renderField(
                                'Email Content (EN)',
                                template?.email_content?.en
                            )}
                            {renderField(
                                'Email Content (AR)',
                                template?.email_content?.ar
                            )}
                        </>
                    )}

                    {template?.sms_content && (
                        <>
                            {renderField(
                                'SMS Content (EN)',
                                template?.sms_content?.en
                            )}
                            {renderField(
                                'SMS Content (AR)',
                                template?.sms_content?.ar
                            )}
                        </>
                    )}
                </div>

                {/* Channels */}
                <div className="space-y-3">
                    <h3 className="font-semibold text-lg text-gray-900 border-b pb-2">
                        Notification Channels
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {renderBooleanField(
                            t('table_headers.sms'),
                            template?.send_via_sms
                        )}
                        {renderBooleanField('Email', template?.send_via_email)}
                        {renderBooleanField(
                            t('table_headers.inbox'),
                            template?.send_via_inbox
                        )}
                    </div>
                </div>

                {/* Settings */}
                <div className="space-y-3">
                    <h3 className="font-semibold text-lg text-gray-900 border-b pb-2">
                        Settings
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {renderBooleanField(
                            t('table_headers.status'),
                            template?.status
                        )}
                        {renderBooleanField(
                            'Active Users Only',
                            template?.active_users_only
                        )}
                        {renderBooleanField(
                            t('table_headers.scheduled'),
                            template?.is_scheduled
                        )}
                    </div>
                </div>

                {/* Schedule Info (if scheduled) */}
                {template?.is_scheduled && (
                    <div className="space-y-3">
                        <h3 className="font-semibold text-lg text-gray-900 border-b pb-2">
                            Schedule Information
                        </h3>
                        {renderField('Schedule Type', template?.schedule_type)}
                        {renderField('Day of Week', template?.day_of_week)}
                        {renderField('Month Period', template?.month_period)}
                        {renderField('Month of Year', template?.month_of_year)}
                        {renderField(
                            t('validation.start_date.label'),
                            template?.start_date
                        )}
                        {renderField('Start Time', template?.start_time)}
                        {renderField(
                            'Last Sent Date',
                            template?.last_sent_date
                        )}
                    </div>
                )}

                {/* Timestamps */}
                <div className="space-y-3">
                    <h3 className="font-semibold text-lg text-gray-900 border-b pb-2">
                        Timestamps
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {renderField(
                            t('table_headers.created_at'),
                            new Date(template?.created_at).toLocaleString()
                        )}
                        {renderField(
                            t('table_headers.updated_at'),
                            new Date(template?.updated_at).toLocaleString()
                        )}
                    </div>
                </div>
            </div>
        </Modal>
    );
}
