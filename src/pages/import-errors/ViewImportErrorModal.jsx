import React from 'react';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import useLocale from '@/utils/hooks/global/useLocale';
import { formatDateForDisplay } from '@/utils/helpers/dateObjectHelpers';

export default function ViewImportErrorModal({ onClose, importError }) {
    const { t } = useLocale();

    if (!importError) {
        return (
            <Modal onClose={onClose} size="4xl">
                <ModalHeader
                    onClose={onClose}
                    header="import_errors.view_title"
                />
                <div className="p-6">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">
                            {t('import_errors.not_found')}
                        </h1>
                        <p className="text-gray-600 mb-6">
                            {t('import_errors.not_found_message')}
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
        if (value === null || value === undefined) {
            return 'N/A';
        }
        return value?.toString() || 'N/A';
    };

    return (
        <Modal onClose={onClose} size="4xl">
            <ModalHeader onClose={onClose} header="import_errors.view_title" />

            <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Basic Information */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">
                            {t('import_errors.basic_info')}
                        </h2>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {t('import_errors.id')}
                            </label>
                            <p className="text-gray-900 bg-gray-50 p-3 rounded-md">
                                {importError.id}
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {t('import_errors.model')}
                            </label>
                            <p className="text-gray-900 bg-gray-50 p-3 rounded-md">
                                {importError.model}
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {t('import_errors.created_at')}
                            </label>
                            <p className="text-gray-900 bg-gray-50 p-3 rounded-md">
                                {formatDateForDisplay(importError.created_at)}
                            </p>
                        </div>
                    </div>

                    {/* Response Information */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">
                            {t('import_errors.response_info')}
                        </h2>

                        {importError.response ? (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {t('import_errors.errors')}
                                </label>
                                <pre className="text-gray-900 bg-gray-50 p-3 rounded-md overflow-auto max-h-48">
                                    {JSON.stringify(importError.response.errors || importError.response, null, 2)}
                                </pre>
                            </div>
                        ) : (
                            <p className="text-gray-500">
                                {t('import_errors.no_response_info')}
                            </p>
                        )}
                    </div>
                </div>

                {/* Payload Information */}
                <div className="mt-6">
                    <h2 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">
                        {t('import_errors.payload_info')}
                    </h2>

                    {importError.payload ? (
                        <div className="bg-gray-50 p-4 rounded-md">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {Object.entries(importError.payload).map(([key, value]) => (
                                    <div key={key}>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                        </label>
                                        <p className="text-gray-900 break-words">
                                            {formatValue(value)}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-500">
                            {t('import_errors.no_payload_info')}
                        </p>
                    )}
                </div>

            </div>
        </Modal>
    );
}

