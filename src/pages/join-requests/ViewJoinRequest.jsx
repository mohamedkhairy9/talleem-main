import React, { useState } from 'react';
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
import { formatDateForDisplay, isDateObject } from '@/utils/helpers/dateObjectHelpers';
import { getNestedError } from '@/utils/helpers/getNestedError';
import * as yup from 'yup';
import { t } from 'i18next';

const statusOptions = [
    { label: { ar: 'موافق', en: 'Approved' }, value: 1 },
    { label: { ar: 'مرفوض', en: 'Rejected' }, value: 2 },
    { label: { ar: 'يحتاج مراجعة', en: 'Need Review' }, value: 3 },
    { label: { ar: 'يحتاج رفع', en: 'Need Upload' }, value: 4 }
];

// Group submitted_data keys into logical sections for review
const SECTION_KEYS = {
    entity_info: ['name', 'registration_date', 'license_number', 'phone', 'email', 'address', 'area', 'status'],
    location: ['branch', 'city', 'neighborhood', 'location_type', 'latitude', 'longitude'],
    program: ['main_program', 'memorization_program_entity_type', 'education_program_entity_type', 'session_mode', 'min_acceptance_age', 'activity_ids'],
    manager: ['manager'],
    facilities: ['class_count', 'management_rooms_count', 'lecture_halls_count']
};

// Keys we never show (not user-readable)
const HIDDEN_KEYS = new Set(['id', 'created_at', 'updated_at', 'code']);

// True if value looks like a relation object (has localized name); show only name, not full object with id
function isRelationObject(value) {
    return (
        typeof value === 'object' &&
        value !== null &&
        !Array.isArray(value) &&
        typeof value?.name === 'object' &&
        value.name !== null &&
        (value.name.en !== undefined || value.name.ar !== undefined)
    );
}

const processStepSchema = yup.object({
    status: yup.number().required(t('validation.required')),
    notes: yup.string().nullable().optional(),
    files: yup.mixed().nullable().optional()
});

// Reusable row for label + value
function DataField({ label, value, valueRender }) {
    return (
        <div className="flex flex-col gap-0.5">
            <span className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</span>
            <span className="text-sm text-gray-900 break-words min-h-[1.25rem]">
                {valueRender != null ? valueRender : (value ?? '-')}
            </span>
        </div>
    );
}

// Accordion section: collapsible header + content
function AccordionSection({ id, title, defaultOpen, children, className = '', variant = 'default' }) {
    const [open, setOpen] = useState(!!defaultOpen);
    const isPrimary = variant === 'primary';
    const headerClass = isPrimary
        ? 'w-full px-4 py-3 bg-primary-100/80 border-b border-primary-200 flex items-center justify-between gap-2 text-left hover:bg-primary-100 transition-colors'
        : 'w-full px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between gap-2 text-left hover:bg-gray-100 transition-colors';
    const titleClass = isPrimary ? 'text-sm font-semibold text-primary-900' : 'text-sm font-semibold text-gray-800';
    return (
        <section className={`rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden ${className}`}>
            <button
                type="button"
                onClick={() => setOpen(prev => !prev)}
                className={headerClass}
                aria-expanded={open}
            >
                <h3 className={titleClass}>{title}</h3>
                <span className="text-gray-500 shrink-0" aria-hidden>
                    {open ? '▼' : '▶'}
                </span>
            </button>
            {open && <div className="p-4">{children}</div>}
        </section>
    );
}

export default function ViewJoinRequest({ onClose, oldData }) {
    const { mutate: processStep, isPending } = useProcessJoinRequestStepMutation();
    const { t, currentLocale } = useLocale();

    const { register, errors, handleSubmit, control, setValue } = useRFH({
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

    const formatKey = (key) => {
        return key
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    const getFieldLabel = (key) => {
        const i18nKey = `table_headers.${key}`;
        const translated = t(i18nKey);
        return translated !== i18nKey ? translated : formatKey(key);
    };

    const isMultilingual = (value) => {
        return typeof value === 'object' &&
               value !== null &&
               !Array.isArray(value) &&
               (value.en !== undefined || value.ar !== undefined);
    };

    // Get display text for a "name" field (object with en/ar or string); never return an object
    const getDisplayName = (value) => {
        if (value == null) return '-';
        if (typeof value === 'string') return value === '[object Object]' ? '-' : value;
        if (typeof value !== 'object' || Array.isArray(value)) return '-';
        // Prefer current locale, then en, then ar; use nullish so empty string still falls through
        const pick = (obj) => {
            if (!obj || typeof obj !== 'object') return '';
            const s = obj[currentLocale] ?? obj.en ?? obj.ar ?? '';
            return typeof s === 'string' ? s.trim() : '';
        };
        if (value.en !== undefined || value.ar !== undefined) {
            const text = pick(value);
            if (text) return text;
        }
        if (value.name && typeof value.name === 'object') {
            const text = pick(value.name);
            if (text) return text;
        }
        return '-';
    };

    const isNestedObject = (value) => {
        return typeof value === 'object' &&
               value !== null &&
               !Array.isArray(value) &&
               !isMultilingual(value) &&
               Object.keys(value).length > 0;
    };

    const renderValue = (value) => {
        if (value === null || value === undefined) return '-';
        if (typeof value === 'string' && value === '[object Object]') return '-';
        if (isDateObject(value)) return formatDateForDisplay(value);
        if (isMultilingual(value)) {
            const text = value[currentLocale] || value.en || value.ar || '';
            return (text && String(text).trim()) ? text : '-';
        }
        if (Array.isArray(value)) {
            if (value.length === 0) return '-';
            if (value.some(item => typeof item === 'object' && item !== null)) {
                return `(${value.length} items)`;
            }
            return value.map((item, idx) => {
                if (typeof item === 'string') {
                    if (item.includes('/') || item.includes('\\')) {
                        return item.split(/[/\\]/).pop() || item;
                    }
                    return item;
                }
                return `Item ${idx + 1}`;
            }).join(', ');
        }
        if (typeof value === 'boolean') {
            return value ? t('common.yes') : t('common.no');
        }
        if (typeof value === 'number') return String(value);
        return String(value);
    };

    const shouldHideKey = (key, data) => {
        if (key === 'id' || HIDDEN_KEYS.has(key)) return true;
        if (key.endsWith('_id')) {
            const relationKey = key.replace(/_id$/, '');
            const relation = data[relationKey];
            if (relation != null && typeof relation === 'object' && !Array.isArray(relation)) return true;
        }
        return false;
    };

    const renderNestedSection = (data, level = 0) => {
        if (!data || typeof data !== 'object') return null;
        const entries = Object.entries(data).filter(([key, value]) => {
            if (value == null || (Array.isArray(value) && value.length === 0)) return false;
            if (shouldHideKey(key, data)) return false;
            return true;
        });
        if (entries.length === 0) return null;
        const gridClass = level > 0
            ? 'grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 p-4 bg-gray-50/80 rounded-lg border border-gray-100'
            : 'grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3';
        return (
            <div className={gridClass}>
                {entries.map(([key, value]) => {
                    if (isRelationObject(value)) {
                        const name = value.name?.[currentLocale] || value.name?.en || value.name?.ar || '-';
                        return (
                            <DataField key={key} label={getFieldLabel(key)} valueRender={name} />
                        );
                    }
                    if (isNestedObject(value)) {
                        const nested = renderNestedSection(value, level + 1);
                        if (!nested) return null;
                        return (
                            <div key={key} className="md:col-span-2">
                                <h4 className="text-sm font-semibold text-gray-700 mb-2">{getFieldLabel(key)}</h4>
                                {nested}
                            </div>
                        );
                    }
                    return (
                        <DataField
                            key={key}
                            label={getFieldLabel(key)}
                            valueRender={key === 'name' ? getDisplayName(value) : renderValue(value)}
                        />
                    );
                })}
            </div>
        );
    };

    const getSectionTitleKey = (sectionId) => `join_requests.section_${sectionId}`;

    const renderSubmittedDataSections = (data) => {
        if (!data || typeof data !== 'object') return null;
        const allKeys = Object.keys(data);
        const usedKeys = new Set();
        const sections = [];

        Object.entries(SECTION_KEYS).forEach(([sectionId, keys]) => {
            const entries = keys
                .filter(k => data[k] != null && !(Array.isArray(data[k]) && data[k].length === 0))
                .map(k => {
                    usedKeys.add(k);
                    return [k, data[k]];
                });
            if (entries.length > 0) {
                sections.push({ id: sectionId, titleKey: getSectionTitleKey(sectionId), entries });
            }
        });

        const otherEntries = allKeys
            .filter(k => !usedKeys.has(k) && !shouldHideKey(k, data))
            .map(k => [k, data[k]])
            .filter(([, v]) => v != null && !(Array.isArray(v) && v.length === 0));
        if (otherEntries.length > 0) {
            sections.push({ id: 'other', titleKey: 'join_requests.section_other', entries: otherEntries });
        }

        return (
            <div className="space-y-4">
                {sections.map(({ id, titleKey, entries }) => (
                    <AccordionSection
                        key={id}
                        id={id}
                        title={t(titleKey)}
                        defaultOpen={id === 'entity_info'}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                            {entries.map(([key, value]) => {
                                if (isRelationObject(value)) {
                                    const name = value.name?.[currentLocale] || value.name?.en || value.name?.ar || '-';
                                    return (
                                        <DataField key={key} label={getFieldLabel(key)} valueRender={name} />
                                    );
                                }
                                if (isNestedObject(value)) {
                                    const nested = renderNestedSection(value);
                                    if (!nested) return null;
                                    return (
                                        <div key={key} className="md:col-span-2">
                                            <h4 className="text-sm font-semibold text-gray-700 mb-2">{getFieldLabel(key)}</h4>
                                            {nested}
                                        </div>
                                    );
                                }
                                return (
                                    <DataField
                                        key={key}
                                        label={getFieldLabel(key)}
                                        valueRender={renderValue(value)}
                                    />
                                );
                            })}
                        </div>
                    </AccordionSection>
                ))}
            </div>
        );
    };

    const requestTypeName = oldData?.request_type?.name?.[currentLocale] ||
        oldData?.request_type?.name?.en ||
        oldData?.request_type?.name?.ar ||
        '-';
    const formName = oldData?.form?.name?.[currentLocale] ||
        oldData?.form?.name?.en ||
        oldData?.form?.name?.ar ||
        '-';
    const phaseName = oldData?.current_phase?.name?.[currentLocale] ||
        oldData?.current_phase?.name?.en ||
        oldData?.current_phase?.name?.ar ||
        '-';

    return (
        <Modal onClose={onClose} size="5xl">
            <ModalHeader onClose={onClose} header="join_requests.view" />
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full min-h-0">
                <ModalContent className="min-h-0 flex flex-col">
                    <div className="flex-1 min-h-0 overflow-y-auto space-y-6 pr-1">
                        {/* Request info – accordion */}
                        <AccordionSection
                            id="request_info"
                            title={t('join_requests.request_info')}
                            defaultOpen={true}
                        >
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
                                <DataField label={t('table_headers.request_type')} valueRender={requestTypeName} />
                                <DataField label={t('table_headers.form')} valueRender={formName} />
                                <DataField label={t('table_headers.current_phase')} valueRender={phaseName} />
                                <DataField label={t('table_headers.status')} valueRender={oldData?.status_text ?? '-'} />
                                <DataField label={t('table_headers.created_at')} valueRender={formatDateForDisplay(oldData?.created_at)} />
                            </div>
                        </AccordionSection>

                        {/* Submitted data – grouped sections */}
                        {oldData?.submitted_data && (
                            <>
                                <h3 className="text-base font-semibold text-gray-800 sticky top-0 bg-gray-50/95 py-1 -mx-1 px-1 rounded">
                                    {t('join_requests.submitted_data')}
                                </h3>
                                {renderSubmittedDataSections(oldData.submitted_data)}
                            </>
                        )}

                        {/* Take action – accordion, default open */}
                        <AccordionSection
                            id="take_action"
                            title={t('join_requests.take_action')}
                            defaultOpen={true}
                            variant="primary"
                            className="border-2 border-primary-200 bg-primary-50/30"
                        >
                            <p className="text-xs text-primary-700 mb-4">{t('join_requests.process_step')}</p>
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
                        </AccordionSection>
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

