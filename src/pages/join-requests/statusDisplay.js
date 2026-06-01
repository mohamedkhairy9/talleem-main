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

const NEW_STATUS_TEXT = {
    en: 'New',
    ar: 'جديد'
};

const STATUS_TEXT_MAP = {
    0: { en: 'Pending', ar: 'قيد الانتظار' },
    1: { en: 'Approved', ar: 'موافق' },
    2: { en: 'Rejected', ar: 'مرفوض' },
    3: { en: 'Need Review', ar: 'يحتاج مراجعة' },
    4: { en: 'Need Upload', ar: 'يحتاج رفع' }
};

const ARABIC_DISPLAY_STATUS_MAP = {
    new: 'جديد',
    pending: 'قيد المراجعة',
    approved: 'تم القبول',
    rejected: 'مرفوض',
    needReview: 'بحاجة لمراجعة',
    needUpload: 'بحاجة لرفع'
};

function normalizeText(value) {
    return String(value ?? '')
        .trim()
        .toLowerCase()
        .replace(/[أإآ]/g, 'ا')
        .replace(/ؤ/g, 'و')
        .replace(/ئ/g, 'ي')
        .replace(/ة/g, 'ه')
        .replace(/ى/g, 'ي')
        .replace(/[_-]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

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

export function localizeJoinRequestStatusText(statusText, currentLocale = 'en') {
    if (statusText == null) return '';

    const rawText = String(statusText).trim();
    if (!rawText || currentLocale !== 'ar') {
        return rawText;
    }

    const normalized = normalizeText(rawText);

    if (normalized.includes('جديد') || normalized.includes('new')) return ARABIC_DISPLAY_STATUS_MAP.new;
    if (normalized.includes('pending') || normalized.includes('انتظار') || normalized.includes('قيد المراجعه')) {
        return ARABIC_DISPLAY_STATUS_MAP.pending;
    }
    if (
        normalized.includes('approved') ||
        normalized.includes('accepted') ||
        normalized.includes('موافق') ||
        normalized.includes('قبول')
    ) {
        return ARABIC_DISPLAY_STATUS_MAP.approved;
    }
    if (normalized.includes('rejected') || normalized.includes('declined') || normalized.includes('مرفوض')) {
        return ARABIC_DISPLAY_STATUS_MAP.rejected;
    }
    if (normalized.includes('review') || normalized.includes('مراجعه')) {
        return ARABIC_DISPLAY_STATUS_MAP.needReview;
    }
    if (normalized.includes('upload') || normalized.includes('رفع')) {
        return ARABIC_DISPLAY_STATUS_MAP.needUpload;
    }

    return rawText;
}

function getHistoryEntries(request) {
    if (!request || typeof request !== 'object') return [];
    const historyKey = HISTORY_ARRAY_KEYS.find(key => Array.isArray(request[key]));
    return historyKey ? request[historyKey] : [];
}

function parseDate(value) {
    if (!value) return null;
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function getEntryDate(entry) {
    return getValueByKeys(entry, HISTORY_DATE_KEYS);
}

function getCurrentPhaseIdentifiers(request, currentLocale = 'en') {
    const identifiers = new Set();
    const currentPhase = request?.current_phase;

    if (currentPhase?.id != null) {
        identifiers.add(`id:${String(currentPhase.id)}`);
    }

    const phaseNames = [
        getLocalizedValue(currentPhase?.name, currentLocale),
        getLocalizedValue(currentPhase?.name, 'en'),
        getLocalizedValue(currentPhase?.name, 'ar')
    ];

    phaseNames
        .map(normalizeText)
        .filter(Boolean)
        .forEach(name => identifiers.add(`name:${name}`));

    return identifiers;
}

function addEntryIdentifiers(identifiers, value, currentLocale = 'en') {
    if (value == null) return;

    if (typeof value === 'string' || typeof value === 'number') {
        const normalized = normalizeText(value);
        if (normalized) {
            identifiers.add(`name:${normalized}`);
        }
        return;
    }

    if (typeof value !== 'object' || Array.isArray(value)) return;

    if (value.id != null) {
        identifiers.add(`id:${String(value.id)}`);
    }

    const names = [
        getLocalizedValue(value.name, currentLocale),
        getLocalizedValue(value.name, 'en'),
        getLocalizedValue(value.name, 'ar'),
        getLocalizedValue(value, currentLocale),
        getLocalizedValue(value, 'en'),
        getLocalizedValue(value, 'ar')
    ];

    names
        .map(normalizeText)
        .filter(Boolean)
        .forEach(name => identifiers.add(`name:${name}`));
}

function getHistoryEntryPhaseIdentifiers(entry, currentLocale = 'en') {
    const identifiers = new Set();

    ['current_phase_id', 'phase_id', 'step_id'].forEach(key => {
        if (entry?.[key] != null && entry[key] !== '') {
            identifiers.add(`id:${String(entry[key])}`);
        }
    });

    [
        entry?.current_phase,
        entry?.phase,
        entry?.step,
        entry?.current_step,
        entry?.step_name,
        entry?.phase_name,
        entry?.current_phase_name
    ].forEach(value => addEntryIdentifiers(identifiers, value, currentLocale));

    return identifiers;
}

function isApprovedEntry(entry) {
    const rawStatus = getValueByKeys(entry, ['status_text', 'status', 'action']);
    const normalized = normalizeText(rawStatus);
    return rawStatus === 1 || normalized.includes('approved') || normalized.includes('موافق') || normalized.includes('قبول');
}

function isPendingRequest(request) {
    if (!request) return false;
    if (request.status === 0 || request.status === '0') return true;
    const normalized = normalizeText(request.status_text);
    return normalized.includes('pending') || normalized.includes('انتظار') || normalized.includes('قيد المراجعه');
}

export function shouldDisplayNewJoinRequestStatus(request, currentLocale = 'en') {
    if (!isPendingRequest(request)) return false;

    const currentPhaseIdentifiers = getCurrentPhaseIdentifiers(request, currentLocale);
    if (currentPhaseIdentifiers.size === 0) return false;

    const historyEntries = getHistoryEntries(request).filter(isApprovedEntry);
    if (historyEntries.length === 0) return false;

    const latestApprovedEntry = [...historyEntries].sort((a, b) => {
        const aDate = parseDate(getEntryDate(a));
        const bDate = parseDate(getEntryDate(b));
        if (aDate && bDate) return bDate - aDate;
        if (aDate) return -1;
        if (bDate) return 1;
        return 0;
    })[0];

    if (!latestApprovedEntry) return false;

    const latestPhaseIdentifiers = getHistoryEntryPhaseIdentifiers(latestApprovedEntry, currentLocale);
    if (latestPhaseIdentifiers.size === 0) return false;

    for (const identifier of currentPhaseIdentifiers) {
        if (latestPhaseIdentifiers.has(identifier)) {
            return false;
        }
    }

    return true;
}

export function getJoinRequestDisplayStatus(request, currentLocale = 'en') {
    if (shouldDisplayNewJoinRequestStatus(request, currentLocale)) {
        return {
            key: 'new',
            text: NEW_STATUS_TEXT[currentLocale] || NEW_STATUS_TEXT.en
        };
    }

    if (typeof request?.status_text === 'string' && request.status_text.trim()) {
        const localizedText = localizeJoinRequestStatusText(request.status_text, currentLocale);
        return {
            key: normalizeText(localizedText),
            text: localizedText
        };
    }

    if (request?.status != null && STATUS_TEXT_MAP[Number(request.status)]) {
        const fallbackText = STATUS_TEXT_MAP[Number(request.status)][currentLocale] || STATUS_TEXT_MAP[Number(request.status)].en;
        const localizedFallbackText = localizeJoinRequestStatusText(fallbackText, currentLocale) || fallbackText;
        return {
            key: normalizeText(localizedFallbackText),
            text: localizedFallbackText
        };
    }

    return {
        key: 'unknown',
        text: '-'
    };
}

export function getJoinRequestStatusBadgeClasses(statusKey = '') {
    const normalized = normalizeText(statusKey);

    if (normalized.includes('approved') || normalized.includes('موافق') || normalized.includes('قبول')) {
        return 'bg-green-100 text-green-800 border-green-200';
    }

    if (normalized.includes('rejected') || normalized.includes('مرفوض')) {
        return 'bg-red-100 text-red-800 border-red-200';
    }

    if (normalized.includes('new') || normalized.includes('جديد')) {
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }

    if (normalized.includes('pending') || normalized.includes('انتظار') || normalized.includes('قيد المراجعه')) {
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }

    if (normalized.includes('review') || normalized.includes('مراجعه')) {
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }

    if (normalized.includes('upload') || normalized.includes('رفع')) {
        return 'bg-purple-100 text-purple-800 border-purple-200';
    }

    return 'bg-gray-100 text-gray-700 border-gray-200';
}
