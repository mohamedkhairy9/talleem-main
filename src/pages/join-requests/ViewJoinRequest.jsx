import React, { useMemo, useState } from 'react';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import ModalContent from '@/components/common/form/ModalContent';
import ModalFooter from '@/components/common/form/ModalFooter';
import { useJoinRequestDetailsQuery, useProcessJoinRequestStepMutation } from '@/api/hooks/useJoinRequests';
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
    entity_info: ['name', 'registration_date', 'license_number', 'phone', 'email', 'address', 'area', 'status', 'activities'],
    location: ['branch', 'city', 'neighborhood', 'location_type'],
    program: ['main_program', 'memorization_program_entity_type', 'education_program_entity_type', 'session_mode', 'min_acceptance_age', 'activity_ids'],
    manager: ['manager'],
    facilities: ['class_count', 'management_rooms_count', 'lecture_halls_count']
};

// Keys we never show (not user-readable)
const HIDDEN_KEYS = new Set(['id', 'created_at', 'updated_at', 'code']);

// Keys that indicate the object is "data" (e.g. manager), not a simple relation – do not collapse to name only
const DATA_OBJECT_KEYS = new Set([
    'years_of_experience', 'memorization_amount', 'date_of_birth', 'manager_phone', 'manager_email',
    'national_id', 'gender'
]);

// True if value looks like a simple relation object (has localized name, no manager-like data keys); show only name
function isRelationObject(value) {
    if (typeof value !== 'object' || value === null || Array.isArray(value)) return false;
    const nameObj = value?.name;
    if (typeof nameObj !== 'object' || nameObj === null || (nameObj.en === undefined && nameObj.ar === undefined)) return false;
    const keys = Object.keys(value);
    const hasDataKeys = keys.some(k => DATA_OBJECT_KEYS.has(k));
    return !hasDataKeys;
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

// Small map for lat/long (OpenStreetMap embed, no API key); kept small and low z-index so it stays under sticky headers
function LocationMap({ latitude, longitude }) {
    const lat = Number(latitude);
    const lon = Number(longitude);
    if (Number.isNaN(lat) || Number.isNaN(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
        return null;
    }
    const delta = 0.01;
    const bbox = [lon - delta, lat - delta, lon + delta, lat + delta].join(',');
    const embedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lon}`;
    return (
        <div className="w-full md:col-span-2 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 relative z-0">
            <div className="relative w-full aspect-[2/1] max-h-[180px]">
                <iframe
                    title="Location map"
                    src={embedUrl}
                    className="absolute inset-0 w-full h-full border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                />
            </div>
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

const HISTORY_ARRAY_KEYS = [
    'submitted_logs',
    'history',
    'histories',
    'logs',
    'approval_history',
    'approval_histories',
    'audit_trail',
    'audit_logs'
];

const HISTORY_DATE_KEYS = [
    'action_at',
    'acted_at',
    'processed_at',
    'approved_at',
    'rejected_at',
    'submitted_at',
    'created_at',
    'updated_at',
    'date',
    'datetime',
    'timestamp'
];

const HISTORY_COMMENT_KEYS = ['comment', 'comments', 'notes', 'reason', 'message', 'description'];
const HISTORY_ACTOR_KEYS = ['actor', 'user', 'approver', 'creator', 'created_by', 'performed_by', 'action_by', 'updated_by'];
const HISTORY_ROLE_KEYS = ['role', 'role_name', 'user_role', 'approver_role', 'actor_role'];
const STATUS_TEXT_MAP = {
    0: { en: 'Pending', ar: 'قيد الانتظار' },
    1: { en: 'Approved', ar: 'موافق' },
    2: { en: 'Rejected', ar: 'مرفوض' },
    3: { en: 'Need Review', ar: 'يحتاج مراجعة' },
    4: { en: 'Need Upload', ar: 'يحتاج رفع' }
};

function getLocalizedValue(value, currentLocale = 'en') {
    if (value == null) return '';
    if (typeof value === 'string' || typeof value === 'number') return String(value).trim();
    if (typeof value !== 'object' || Array.isArray(value)) return '';

    const localized =
        value[currentLocale] ??
        value.en ??
        value.ar ??
        value.En ??
        value.Ar ??
        '';

    return typeof localized === 'string' || typeof localized === 'number'
        ? String(localized).trim()
        : '';
}

function getValueByKeys(source, keys = []) {
    if (!source || typeof source !== 'object') return null;
    for (const key of keys) {
        const value = source[key];
        if (value !== null && value !== undefined && value !== '') {
            return value;
        }
    }
    return null;
}

function getDisplayPersonName(value, currentLocale = 'en') {
    if (value == null) return '';
    if (typeof value === 'string' || typeof value === 'number') return String(value).trim();
    if (typeof value !== 'object' || Array.isArray(value)) return '';

    const directName = getLocalizedValue(value.name, currentLocale);
    if (directName) return directName;

    const fullName = getLocalizedValue(value.full_name, currentLocale) || getLocalizedValue(value.display_name, currentLocale);
    if (fullName) return fullName;

    const firstName = getLocalizedValue(value.first_name, currentLocale);
    const lastName = getLocalizedValue(value.last_name, currentLocale);
    const combinedName = [firstName, lastName].filter(Boolean).join(' ').trim();
    if (combinedName) return combinedName;

    return getLocalizedValue(value, currentLocale);
}

function getDisplayRole(value, currentLocale = 'en') {
    if (value == null) return '';
    if (typeof value === 'string' || typeof value === 'number') return String(value).trim();
    if (typeof value !== 'object' || Array.isArray(value)) return '';

    const directRole =
        getLocalizedValue(value.role, currentLocale) ||
        getLocalizedValue(value.role_name, currentLocale) ||
        getLocalizedValue(value.user_role, currentLocale);
    if (directRole) return directRole;

    if (Array.isArray(value.roles)) {
        const roleNames = value.roles
            .map(role => getDisplayRole(role, currentLocale) || getDisplayPersonName(role, currentLocale))
            .filter(Boolean);
        if (roleNames.length > 0) return roleNames.join(', ');
    }

    return getLocalizedValue(value, currentLocale);
}

function getHistoryActorName(entry, currentLocale = 'en') {
    const actor = getValueByKeys(entry, HISTORY_ACTOR_KEYS);
    if (actor) {
        const actorName = getDisplayPersonName(actor, currentLocale);
        if (actorName) return actorName;
    }

    return getDisplayPersonName(
        getValueByKeys(entry, ['actor_name', 'user_name', 'approver_name', 'creator_name', 'created_by_name', 'performed_by_name']),
        currentLocale
    );
}

function getHistoryActorRole(entry, currentLocale = 'en') {
    const actor = getValueByKeys(entry, HISTORY_ACTOR_KEYS);
    if (actor) {
        const actorRole = getDisplayRole(actor, currentLocale);
        if (actorRole) return actorRole;
    }

    return getDisplayRole(getValueByKeys(entry, HISTORY_ROLE_KEYS), currentLocale);
}

function getHistoryStatusText(statusValue, currentLocale = 'en') {
    if (statusValue == null) return '';
    if (typeof statusValue === 'string') {
        const trimmed = statusValue.trim();
        if (!trimmed) return '';
        if (/^\d+$/.test(trimmed) && STATUS_TEXT_MAP[Number(trimmed)]) {
            return STATUS_TEXT_MAP[Number(trimmed)][currentLocale] || STATUS_TEXT_MAP[Number(trimmed)].en;
        }
        return trimmed;
    }
    if (typeof statusValue === 'number' && STATUS_TEXT_MAP[statusValue]) {
        return STATUS_TEXT_MAP[statusValue][currentLocale] || STATUS_TEXT_MAP[statusValue].en;
    }
    return String(statusValue);
}

function normalizeHistoryFiles(value) {
    if (!value) return [];
    if (Array.isArray(value)) {
        return value
            .map((item, index) => {
                if (typeof item === 'string') {
                    const name = item.split(/[/\\]/).pop() || `File ${index + 1}`;
                    return { url: item, name };
                }
                if (item && typeof item === 'object') {
                    const url = item.url || item.path || item.file || item.download_url || null;
                    const name = item.name || item.file_name || item.original_name || `File ${index + 1}`;
                    return { url, name };
                }
                return null;
            })
            .filter(Boolean);
    }

    if (typeof value === 'string') {
        return [{ url: value, name: value.split(/[/\\]/).pop() || 'File' }];
    }

    return [];
}

function getJoinRequestPayload(response) {
    if (!response || typeof response !== 'object') return null;
    if (response.data && typeof response.data === 'object' && !Array.isArray(response.data)) {
        return response.data;
    }
    return response;
}

function mergeJoinRequestData(oldData, detailedData) {
    if (!detailedData) return oldData;
    return {
        ...oldData,
        ...detailedData,
        request_type: detailedData.request_type ?? oldData?.request_type,
        form: detailedData.form ?? oldData?.form,
        current_phase: detailedData.current_phase ?? oldData?.current_phase,
        submitted_data: detailedData.submitted_data ?? oldData?.submitted_data
    };
}

function getHistoryBadgeClasses(statusText = '') {
    const text = statusText.toLowerCase();
    if (text.includes('approved') || text.includes('موافق')) return 'bg-green-100 text-green-800';
    if (text.includes('rejected') || text.includes('مرفوض')) return 'bg-red-100 text-red-800';
    if (text.includes('review') || text.includes('مراجعة')) return 'bg-blue-100 text-blue-800';
    if (text.includes('upload') || text.includes('رفع')) return 'bg-purple-100 text-purple-800';
    if (text.includes('pending') || text.includes('انتظار')) return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-700';
}

function parseHistoryDate(value) {
    if (!value) return null;
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function buildHistoryEntries(requestData, currentLocale = 'en', t) {
    if (!requestData) return [];

    const historySourceKey = HISTORY_ARRAY_KEYS.find(key => Array.isArray(requestData[key]));
    const rawEntries = historySourceKey ? requestData[historySourceKey] : [];
    const normalizedEntries = rawEntries.map((entry, index) => {
        const title =
            getLocalizedValue(getValueByKeys(entry, ['step_name', 'phase_name', 'action_label', 'title', 'name']), currentLocale) ||
            getHistoryStatusText(getValueByKeys(entry, ['status_text', 'status', 'action']), currentLocale) ||
            t('join_requests.history_action_fallback', 'Request Action');

        return {
            id: entry.id || `${requestData.id || 'request'}-history-${index}`,
            title,
            statusText: getHistoryStatusText(getValueByKeys(entry, ['status_text', 'status', 'action']), currentLocale),
            actorName: getHistoryActorName(entry, currentLocale) || '-',
            actorRole: getHistoryActorRole(entry, currentLocale) || '-',
            timestamp: getValueByKeys(entry, HISTORY_DATE_KEYS),
            comments: getLocalizedValue(getValueByKeys(entry, HISTORY_COMMENT_KEYS), currentLocale) || '',
            files: normalizeHistoryFiles(getValueByKeys(entry, ['files', 'attachments', 'documents']))
        };
    });

    const creatorName =
        getHistoryActorName(requestData, currentLocale) ||
        getDisplayPersonName(requestData.submitted_data?.name, currentLocale) ||
        '-';

    const creationEntry = requestData.created_at
        ? [{
            id: `${requestData.id || 'request'}-created`,
            title: t('join_requests.history_created', 'Request Created'),
            statusText: t('join_requests.history_created_status', 'Created'),
            actorName: creatorName,
            actorRole: getHistoryActorRole(requestData, currentLocale) || '-',
            timestamp: requestData.created_at,
            comments: '',
            files: []
        }]
        : [];

    return [...creationEntry, ...normalizedEntries]
        .filter((entry, index, arr) => arr.findIndex(item =>
            item.title === entry.title &&
            item.timestamp === entry.timestamp &&
            item.statusText === entry.statusText &&
            item.actorName === entry.actorName
        ) === index)
        .map((entry, index) => ({ ...entry, originalIndex: index }))
        .sort((a, b) => {
            const aDate = parseHistoryDate(a.timestamp);
            const bDate = parseHistoryDate(b.timestamp);
            if (aDate && bDate) return aDate - bDate;
            if (aDate) return -1;
            if (bDate) return 1;
            return a.originalIndex - b.originalIndex;
        });
}

export default function ViewJoinRequest({ onClose, oldData, isReadOnly = false }) {
    const { mutate: processStep, isPending } = useProcessJoinRequestStepMutation();
    const { t, currentLocale } = useLocale();
    const requestId = oldData?.id;
    const { data: detailsResponse, isFetching: isFetchingDetails } = useJoinRequestDetailsQuery(requestId, {
        enabled: Boolean(requestId)
    });
    const requestData = useMemo(
        () => mergeJoinRequestData(oldData, getJoinRequestPayload(detailsResponse)),
        [oldData, detailsResponse]
    );
    const historyEntries = useMemo(
        () => buildHistoryEntries(requestData, currentLocale, t),
        [requestData, currentLocale, t]
    );

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
                id: requestData?.id,
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
        if (key === 'activity_ids') return t('table_headers.activities');
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
        const pick = (obj) => {
            if (!obj || typeof obj !== 'object') return '';
            const raw = obj[currentLocale] ?? obj.en ?? obj.ar ?? obj.En ?? obj.Ar ?? '';
            const s = typeof raw === 'string' ? raw.trim() : String(raw || '').trim();
            return s;
        };
        if (value.en !== undefined || value.ar !== undefined || value.En !== undefined || value.Ar !== undefined) {
            const text = pick(value);
            if (text) return text;
        }
        if (value.name && typeof value.name === 'object') {
            const text = pick(value.name);
            if (text) return text;
        }
        return '-';
    };

    const getNameDisplay = (value) => {
        const d = getDisplayName(value);
        if (d !== '-') return d;
        return renderValue(value);
    };

    // Render activities array as a list of names (each item can have name: { en, ar })
    const getActivitiesDisplay = (value) => {
        if (!Array.isArray(value) || value.length === 0) return '-';
        const names = value.map(item => {
            if (!item || typeof item !== 'object') return '';
            const n = item.name;
            if (!n || typeof n !== 'object') return '';
            const s = n[currentLocale] ?? n.en ?? n.ar ?? '';
            return typeof s === 'string' ? s.trim() : String(s || '').trim();
        }).filter(Boolean);
        return names.length ? names.join(', ') : '-';
    };

    // Resolve activity_ids to names using the activities array from submitted_data
    const getActivityIdsDisplay = (activityIds, activitiesArray) => {
        if (!Array.isArray(activityIds) || activityIds.length === 0) return '-';
        if (!Array.isArray(activitiesArray) || activitiesArray.length === 0) return renderValue(activityIds, 'activity_ids');
        const names = activityIds.map(id => {
            const idNorm = typeof id === 'string' ? id.trim() : String(id);
            const activity = activitiesArray.find(a => a != null && (String(a.id) === idNorm || Number(a.id) === Number(id)));
            if (!activity?.name || typeof activity.name !== 'object') return '';
            const s = activity.name[currentLocale] ?? activity.name.en ?? activity.name.ar ?? '';
            return typeof s === 'string' ? s.trim() : String(s || '').trim();
        }).filter(Boolean);
        return names.length ? names.join(', ') : '-';
    };

    const isNestedObject = (value) => {
        return typeof value === 'object' &&
               value !== null &&
               !Array.isArray(value) &&
               !isMultilingual(value) &&
               Object.keys(value).length > 0;
    };

    // 1 / "1" / true => Active, 0 / "0" / false => Inactive
    const getStatusDisplay = (value) => {
        if (value === null || value === undefined) return '-';
        const v = value === true || value === 1 || value === '1';
        const i = value === false || value === 0 || value === '0';
        if (v) return t('common.active');
        if (i) return t('common.inactive');
        return String(value);
    };

    const renderValue = (value, key) => {
        if (value === null || value === undefined) return '-';
        if (key === 'status') return getStatusDisplay(value);
        if (typeof value === 'string' && value === '[object Object]') return '-';
        if (isDateObject(value)) return formatDateForDisplay(value);
        if (isMultilingual(value)) {
            const text = value[currentLocale] ?? value.en ?? value.ar ?? value.En ?? value.Ar ?? '';
            const s = typeof text === 'string' ? text.trim() : String(text || '').trim();
            return s || '-';
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

    // Renders all keys of a nested object (e.g. manager). Dynamic data: show every key we get.
    // Only hide internal keys (id, created_at, etc.) and *_id when the relation object is present.
    const renderNestedSection = (data, level = 0) => {
        if (!data || typeof data !== 'object') return null;
        const entries = Object.entries(data).filter(([key]) => !shouldHideKey(key, data));
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
                            valueRender={key === 'name' ? getNameDisplay(value) : renderValue(value, key)}
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
            .filter(k => !usedKeys.has(k) && !shouldHideKey(k, data) && k !== 'latitude' && k !== 'longitude')
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
                        <div className="space-y-4">
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
                                            valueRender={
                                                key === 'activities' && Array.isArray(value)
                                                    ? getActivitiesDisplay(value)
                                                    : key === 'activity_ids'
                                                    ? getActivityIdsDisplay(value, data.activities)
                                                    : renderValue(value, key)
                                            }
                                        />
                                    );
                                })}
                            </div>
                            {id === 'location' && data.latitude != null && data.longitude != null && (
                                <LocationMap key={`${data.latitude}-${data.longitude}`} latitude={data.latitude} longitude={data.longitude} />
                            )}
                        </div>
                    </AccordionSection>
                ))}
            </div>
        );
    };

    const requestTypeName = requestData?.request_type?.name?.[currentLocale] ||
        requestData?.request_type?.name?.en ||
        requestData?.request_type?.name?.ar ||
        '-';
    const formName = requestData?.form?.name?.[currentLocale] ||
        requestData?.form?.name?.en ||
        requestData?.form?.name?.ar ||
        '-';
    const phaseName = requestData?.current_phase?.name?.[currentLocale] ||
        requestData?.current_phase?.name?.en ||
        requestData?.current_phase?.name?.ar ||
        '-';

    return (
        <Modal onClose={onClose} size="5xl">
            <ModalHeader onClose={onClose} header="join_requests.view" />
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full min-h-0">
                <ModalContent className="min-h-0 flex flex-col">
                    <div className="flex-1 min-h-0 overflow-y-auto space-y-6 pr-1 modal-scroll">
                        {isFetchingDetails && (
                            <p className="text-xs text-gray-500">{t('join_requests.loading_latest_details', 'Loading latest request details...')}</p>
                        )}
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
                                <DataField label={t('table_headers.status')} valueRender={requestData?.status_text ?? '-'} />
                                <DataField label={t('table_headers.created_at')} valueRender={formatDateForDisplay(requestData?.created_at)} />
                            </div>
                        </AccordionSection>

                        {/* Submitted data – grouped sections */}
                        {requestData?.submitted_data && (
                            <>
                                <h3 className="text-base font-semibold text-gray-800 sticky top-0 z-10 bg-gray-50 py-2 -mx-1 px-1 rounded shadow-[0_1px_3px_0_rgba(0,0,0,0.06)]">
                                    {t('join_requests.submitted_data')}
                                </h3>
                                {renderSubmittedDataSections(requestData.submitted_data)}
                            </>
                        )}

                        {/* Take action – accordion, default open */}
                        {isReadOnly ? (
                            <AccordionSection
                                id="request_log"
                                title={t('join_requests.take_action')}
                                defaultOpen={true}
                                variant="primary"
                                className="border-2 border-primary-200 bg-primary-50/30"
                            >
                                <p className="text-sm text-primary-900">
                                    {t(
                                        'join_requests.read_only_log',
                                        'This request has already moved past your approval queue and is now shown here as a read-only log record.'
                                    )}
                                </p>
                            </AccordionSection>
                        ) : (
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
                        )}

                        <AccordionSection
                            id="request_history"
                            title={t('join_requests.history', 'History')}
                            defaultOpen={true}
                        >
                            {historyEntries.length > 0 ? (
                                <div className="space-y-4">
                                    {historyEntries.map(entry => (
                                        <div key={entry.id} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                                            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                                                <div className="space-y-1">
                                                    <p className="text-sm font-semibold text-gray-900">{entry.title}</p>
                                                    <p className="text-xs text-gray-500">
                                                        {entry.timestamp ? formatDateForDisplay(entry.timestamp) : '-'}
                                                    </p>
                                                </div>
                                                <span className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-medium ${getHistoryBadgeClasses(entry.statusText)}`}>
                                                    {entry.statusText || t('join_requests.history_status_unknown', 'Unknown')}
                                                </span>
                                            </div>

                                            <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2 lg:grid-cols-3">
                                                <DataField label={t('join_requests.history_actor', 'Actor')} value={entry.actorName || '-'} />
                                                <DataField label={t('join_requests.history_role', 'Role')} value={entry.actorRole || '-'} />
                                                <DataField
                                                    label={t('join_requests.history_action_date', 'Action Date')}
                                                    value={entry.timestamp ? formatDateForDisplay(entry.timestamp) : '-'}
                                                />
                                            </div>

                                            {entry.comments && (
                                                <div className="mt-4 border-t border-gray-200 pt-4">
                                                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                                        {t('join_requests.history_comments', 'Comments / Reason')}
                                                    </p>
                                                    <p className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{entry.comments}</p>
                                                </div>
                                            )}

                                            {entry.files.length > 0 && (
                                                <div className="mt-4 border-t border-gray-200 pt-4">
                                                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                                        {t('join_requests.history_files', 'Files')}
                                                    </p>
                                                    <div className="mt-2 space-y-1">
                                                        {entry.files.map((file, index) => (
                                                            <p key={`${entry.id}-file-${index}`} className="text-sm">
                                                                {file.url ? (
                                                                    <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">
                                                                        {file.name}
                                                                    </a>
                                                                ) : (
                                                                    <span className="text-gray-700">{file.name}</span>
                                                                )}
                                                            </p>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-600">
                                    {t('join_requests.history_empty', 'No history entries are available for this request yet.')}
                                </p>
                            )}
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
                    {!isReadOnly && (
                        <button
                            type="submit"
                            disabled={isPending}
                            className="px-4 py-2 bg-primary-600 text-white hover:bg-primary-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isPending ? t('common.saving') : t('join_requests.process')}
                        </button>
                    )}
                </ModalFooter>
            </form>
        </Modal>
    );
}

