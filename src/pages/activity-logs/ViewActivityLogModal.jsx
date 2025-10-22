import React from 'react';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import useLocale from '@/utils/hooks/global/useLocale';

export default function ViewActivityLogModal({ onClose, activityLog }) {
    const { t } = useLocale();

    if (!activityLog) {
        return (
            <Modal onClose={onClose} size="4xl">
                <ModalHeader
                    onClose={onClose}
                    header="activity_logs.view_title"
                />
                <div className="p-6">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">
                            Activity Log Not Found
                        </h1>
                        <p className="text-gray-600 mb-6">
                            The requested activity log could not be found.
                        </p>
                        <button
                            onClick={() => onClose(false)}
                            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                        >
                            {t('common.back')}
                        </button>
                    </div>
                </div>
            </Modal>
        );
    }

    const formatValue = value => {
        if (typeof value === 'object' && value !== null) {
            if (value.en && value.ar) {
                return `${value.en} (${value.ar})`;
            }
            return JSON.stringify(value, null, 2);
        }
        return value?.toString() || 'N/A';
    };

    const formatProperties = properties => {
        if (!properties || !properties.attributes) return 'No properties';

        const attributes = properties.attributes;
        return Object.entries(attributes).map(([key, value]) => (
            <div key={key} className="mb-2">
                <span className="font-medium text-gray-700">{key}:</span>
                <span className="ml-2 text-gray-900">{formatValue(value)}</span>
            </div>
        ));
    };

    return (
        <Modal onClose={onClose} size="4xl">
            <ModalHeader onClose={onClose} header="activity_logs.view_title" />

            <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-2">
                        <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                                activityLog.event === 'created'
                                    ? 'bg-green-100 text-green-800'
                                    : activityLog.event === 'updated'
                                    ? 'bg-blue-100 text-blue-800'
                                    : activityLog.event === 'deleted'
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-gray-100 text-gray-800'
                            }`}
                        >
                            {activityLog.event?.charAt(0).toUpperCase() +
                                activityLog.event?.slice(1)}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Basic Information */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">
                            {t('activity_logs.basic_info')}
                        </h2>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {t('activity_logs.description')}
                            </label>
                            <p className="text-gray-900 bg-gray-50 p-3 rounded-md">
                                {activityLog.description}
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {t('activity_logs.log_name')}
                            </label>
                            <p className="text-gray-900">
                                {activityLog.log_name}
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {t('activity_logs.created_at')}
                            </label>
                            <p className="text-gray-900">
                                {new Date(
                                    activityLog.created_at
                                ).toLocaleString()}
                            </p>
                        </div>
                    </div>

                    {/* User Information */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">
                            {t('activity_logs.user_info')}
                        </h2>

                        {activityLog.causer ? (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        {t('activity_logs.user_name')}
                                    </label>
                                    <p className="text-gray-900">
                                        {formatValue(activityLog.causer.name)}
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        {t('activity_logs.user_email')}
                                    </label>
                                    <p className="text-gray-900">
                                        {activityLog.causer.email}
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        {t('activity_logs.user_id')}
                                    </label>
                                    <p className="text-gray-900">
                                        {activityLog.causer.id}
                                    </p>
                                </div>
                            </>
                        ) : (
                            <p className="text-gray-500">
                                {t('activity_logs.no_user_info')}
                            </p>
                        )}
                    </div>
                </div>

                {/* Subject Information */}
                <div className="mt-6">
                    <h2 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">
                        {t('activity_logs.subject_info')}
                    </h2>

                    {activityLog.subject ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {t('activity_logs.subject_type')}
                                </label>
                                <p className="text-gray-900">
                                    {activityLog.subject.type}
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {t('activity_logs.subject_id')}
                                </label>
                                <p className="text-gray-900">
                                    {activityLog.subject.id}
                                </p>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {t('activity_logs.subject_name')}
                                </label>
                                <p className="text-gray-900">
                                    {formatValue(activityLog.subject.name)}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-500">
                            {t('activity_logs.no_subject_info')}
                        </p>
                    )}
                </div>

                {/* Properties */}
                <div className="mt-6">
                    <h2 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">
                        {t('activity_logs.properties')}
                    </h2>

                    <div className="bg-gray-50 p-4 rounded-md">
                        {formatProperties(activityLog.properties)}
                    </div>
                </div>

                {/* Actions */}
                <div className="mt-6 flex justify-end">
                    <button
                        onClick={() => onClose(false)}
                        className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                    >
                        {t('common.close')}
                    </button>
                </div>
            </div>
        </Modal>
    );
}
