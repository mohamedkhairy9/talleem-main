import React from 'react';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import ModalContent from '@/components/common/form/ModalContent';
import ModalFooter from '@/components/common/form/ModalFooter';
import { useProcessJoinRequestStepMutation } from '@/api/hooks/useJoinRequests';
import useRFH from '@/utils/hooks/global/useRFH';
import InputRFH from '@/components/common/inputs/InputRFH';
import FileInputRFH from '@/components/common/inputs/FileInputRFH';
import useLocale from '@/utils/hooks/global/useLocale';
import { generateOptions } from '@/utils/helpers/global.fns';
import { formatDateForDisplay } from '@/utils/helpers/dateObjectHelpers';
import { getNestedError } from '@/utils/helpers/getNestedError';
import * as yup from 'yup';
import { t } from 'i18next';

const statusOptions = [
    { label: { ar: 'موافق', en: 'Approved' }, value: 1 },
    { label: { ar: 'مرفوض', en: 'Rejected' }, value: 2 },
    { label: { ar: 'يحتاج مراجعة', en: 'Need Review' }, value: 3 },
    { label: { ar: 'يحتاج رفع', en: 'Need Upload' }, value: 4 }
];

const processStepSchema = yup.object({
    status: yup.number().required(t('validation.required')),
    notes: yup.string().nullable().optional(),
    files: yup.mixed().nullable().optional()
});

export default function ViewJoinRequest({ onClose, oldData }) {
    const { mutate: processStep, isPending } = useProcessJoinRequestStepMutation();
    const { t, currentLocale } = useLocale();

    const { register, errors, handleSubmit, control, watch, setValue } = useRFH({
        schema: processStepSchema,
        defaultValues: {
            status: '',
            notes: '',
            files: null
        }
    });

    const onSubmit = data => {
        processStep(
            {
                id: oldData.id,
                data: {
                    status: data.status,
                    notes: data.notes || null,
                    files: data.files || null
                }
            },
            {
                onSuccess: () => {
                    onClose();
                }
            }
        );
    };

    // Format key for display (convert snake_case to Title Case)
    const formatKey = (key) => {
        return key
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    // Check if object is multilingual (has en/ar keys)
    const isMultilingual = (value) => {
        return typeof value === 'object' && 
               value !== null && 
               !Array.isArray(value) &&
               (value.en !== undefined || value.ar !== undefined);
    };

    // Check if object is a nested object (not multilingual, not array, not null)
    const isNestedObject = (value) => {
        return typeof value === 'object' && 
               value !== null && 
               !Array.isArray(value) &&
               !isMultilingual(value) &&
               Object.keys(value).length > 0;
    };

    // Render a single value
    const renderValue = (value) => {
        if (value === null || value === undefined) return '-';
        
        // Handle multilingual objects
        if (isMultilingual(value)) {
            return value[currentLocale] || value.en || value.ar || '-';
        }
        
        // Handle arrays
        if (Array.isArray(value)) {
            if (value.length === 0) return '-';
            // Check if array contains objects
            if (value.some(item => typeof item === 'object' && item !== null)) {
                return `(${value.length} items)`;
            }
            // For file arrays or simple arrays, show file names or values
            return value.map((item, idx) => {
                if (typeof item === 'string') {
                    // If it looks like a file path, show just the filename
                    if (item.includes('/') || item.includes('\\')) {
                        return item.split(/[/\\]/).pop() || item;
                    }
                    return item;
                }
                return `Item ${idx + 1}`;
            }).join(', ');
        }
        
        // Handle booleans
        if (typeof value === 'boolean') {
            return value ? t('common.yes') : t('common.no');
        }
        
        // Handle numbers
        if (typeof value === 'number') {
            return String(value);
        }
        
        return String(value);
    };

    // Recursively render submitted data
    const renderSubmittedData = (data, level = 0) => {
        if (!data || typeof data !== 'object') return null;

        const isNested = level > 0;
        
        // Filter out null, undefined, and empty arrays
        const filteredEntries = Object.entries(data).filter(([key, value]) => {
            // Skip null or undefined
            if (value === null || value === undefined) return false;
            
            // Skip empty arrays
            if (Array.isArray(value) && value.length === 0) return false;
            
            // For nested objects, check if they have any valid entries recursively
            if (isNestedObject(value)) {
                // Check if nested object has any non-null, non-empty entries
                const hasValidEntries = Object.values(value).some(v => {
                    if (v === null || v === undefined) return false;
                    if (Array.isArray(v) && v.length === 0) return false;
                    if (typeof v === 'object' && !Array.isArray(v) && Object.keys(v).length === 0) return false;
                    return true;
                });
                return hasValidEntries;
            }
            
            return true;
        });

        // If no valid entries after filtering, return null
        if (filteredEntries.length === 0) return null;
        
        return (
            <div className={isNested ? "grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg" : "grid grid-cols-1 md:grid-cols-2 gap-4"}>
                {filteredEntries.map(([key, value]) => {
                    // Handle nested objects
                    if (isNestedObject(value)) {
                        const nestedContent = renderSubmittedData(value, level + 1);
                        // Only render if nested content has valid entries
                        if (!nestedContent) return null;
                        
                        return (
                            <div key={key} className="md:col-span-2">
                                <h4 className="text-md font-semibold text-gray-800 mb-3 mt-2">
                                    {formatKey(key)}
                                </h4>
                                {nestedContent}
                            </div>
                        );
                    }

                    // Handle simple values, arrays, multilingual objects
                    return (
                        <div key={key}>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {formatKey(key)}
                            </label>
                            <div className="text-sm text-gray-900 break-words">
                                {renderValue(value)}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <Modal onClose={onClose} size="5xl">
            <ModalHeader onClose={onClose} header="join_requests.view" />
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full min-h-0">
                <ModalContent className="min-h-0">
                    {/* Request Info Section */}
                    <div className="space-y-4 mb-6">
                        <h3 className="text-lg font-semibold mb-4">{t('join_requests.request_info')}</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {t('table_headers.request_type')}
                                </label>
                                <div className="text-sm text-gray-900">
                                    {oldData?.request_type?.name?.[currentLocale] ||
                                     oldData?.request_type?.name?.en ||
                                     oldData?.request_type?.name?.ar ||
                                     '-'}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {t('table_headers.form')}
                                </label>
                                <div className="text-sm text-gray-900">
                                    {oldData?.form?.name?.[currentLocale] || 
                                     oldData?.form?.name?.en || 
                                     oldData?.form?.name?.ar || 
                                     '-'}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {t('table_headers.current_phase')}
                                </label>
                                <div className="text-sm text-gray-900">
                                    {oldData?.current_phase?.name?.[currentLocale] || 
                                     oldData?.current_phase?.name?.en || 
                                     oldData?.current_phase?.name?.ar || 
                                     '-'}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {t('table_headers.status')}
                                </label>
                                <div className="text-sm text-gray-900">
                                    {oldData?.status_text || '-'}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {t('table_headers.created_at')}
                                </label>
                                <div className="text-sm text-gray-900">
                                    {formatDateForDisplay(oldData?.created_at)}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Submitted Data Section - Display All Fields Dynamically */}
                    {oldData?.submitted_data && (
                        <div className="space-y-4 mb-6 border-t pt-6">
                            <h3 className="text-lg font-semibold mb-4">{t('join_requests.submitted_data')}</h3>
                            {renderSubmittedData(oldData.submitted_data)}
                        </div>
                    )}

                    {/* Process Step Form Section */}
                    <div className="border-t pt-6">
                        <h3 className="text-lg font-semibold mb-4">{t('join_requests.process_step')}</h3>
                        
                        <div className="space-y-4">
                            <InputRFH
                                p="px-3 py-3"
                                control={control}
                                register={register}
                                error={getNestedError(errors, 'status')}
                                type="select"
                                placeholder="validation.process_step.status.placeholder"
                                label="validation.process_step.status.label"
                                name="status"
                                options={generateOptions(statusOptions)}
                                required={true}
                            />

                            <InputRFH
                                p="px-3 py-3"
                                control={control}
                                register={register}
                                error={getNestedError(errors, 'notes')}
                                type="textarea"
                                placeholder="validation.process_step.notes.placeholder"
                                label="validation.process_step.notes.label"
                                name="notes"
                            />

                            <FileInputRFH
                                error={getNestedError(errors, 'files')}
                                placeholder="validation.process_step.files.placeholder"
                                label="validation.process_step.files.label"
                                name="files"
                                register={register}
                                setValue={setValue}
                                multiple={true}
                            />
                        </div>
                    </div>
                </ModalContent>

                <ModalFooter>
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                        {t('common.cancel')}
                    </button>
                    <button
                        type="submit"
                        disabled={isPending}
                        className="px-4 py-2 bg-primary-600 text-white hover:bg-primary-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isPending ? t('common.saving') : t('join_requests.process')}
                    </button>
                </ModalFooter>
            </form>
        </Modal>
    );
}

