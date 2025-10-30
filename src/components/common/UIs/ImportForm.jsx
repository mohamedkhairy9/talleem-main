import useLocale from '@/utils/hooks/global/useLocale';
import React, { useState } from 'react';
import Modal from '../form/Modal';
import ModalHeader from '../form/ModalHeader';
import Btn from '../buttons/Btn';

export default function ImportForm({ onClose, isPending, mutate }) {
    const { t } = useLocale();
    const [file, setFile] = useState(null);
    const fileInputRef = React.useRef(null);

    const handleFileChange = e => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            const validExtensions = ['.xlsx', '.xls', '.csv'];
            const fileExtension =
                '.' + selectedFile.name.split('.').pop().toLowerCase();

            if (validExtensions.includes(fileExtension)) {
                setFile(selectedFile);
            } else {
                alert(
                    t('validation.file_type_invalid') ||
                        'Please select an Excel file (.xlsx, .xls, or .csv)'
                );
                setFile(null);
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            }
        }
    };

    const handleRemoveFile = () => {
        setFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = () => {
        if (!file) {
            alert(t('validation.file_required') || 'Please select a file');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        mutate(formData, {
            onSuccess: () => {
                onClose();
            }
        });
    };

    return (
        <Modal onClose={onClose} size="lg">
            <ModalHeader onClose={onClose} header="entities.import" />
            <div className="p-4 space-y-4">
                {/* File Upload Area */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('common.select_file')}
                    </label>
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-primary-500 transition-colors bg-gray-50"
                    >
                        {file ? (
                            <div className="space-y-2">
                                <div className="text-green-600 text-4xl">✓</div>
                                <p className="text-sm font-medium text-gray-700">
                                    {file.name}
                                </p>
                                <button
                                    type="button"
                                    onClick={e => {
                                        e.stopPropagation();
                                        handleRemoveFile();
                                    }}
                                    className="text-xs text-red-600 hover:text-red-700 underline"
                                >
                                    {t('common.remove')}
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <div className="text-gray-400 text-5xl">📄</div>
                                <p className="text-sm text-gray-700 font-medium">
                                    {t('common.click_to_select_file') ||
                                        'Click to select Excel file'}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {t('common.supported_formats') ||
                                        'Supported: .xlsx, .xls, .csv'}
                                </p>
                            </div>
                        )}
                    </div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        accept=".xlsx,.xls,.csv"
                        onChange={handleFileChange}
                    />
                </div>

                {/* Info Box */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start">
                        <div className="ml-3">
                            <p className="text-sm text-blue-700">
                                {t('entities.import_info') ||
                                    'Make sure your Excel file matches the example format. Download the example file to see the correct format.'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                    <Btn
                        onClick={handleSubmit}
                        loading={isPending}
                        label="common.upload"
                        className="w-full py-2.5"
                        disabled={!file}
                    />
                </div>
            </div>
        </Modal>
    );
}
