const getDateValue = value => {
    if (!value) return '';
    if (typeof value === 'string') return value.trim().slice(0, 10);
    if (typeof value === 'object') {
        return String(value.gregorian || value.date || value.value || '').trim().slice(0, 10);
    }
    return '';
};

const getTimeValue = value => {
    if (!value) return '';
    const normalized = String(value).trim().slice(0, 8);
    return /^\d{2}:\d{2}(:\d{2})?$/.test(normalized) ? normalized : '';
};

const toLocalDateTime = (date, time) => {
    const normalizedDate = getDateValue(date);
    const normalizedTime = getTimeValue(time);
    if (!normalizedDate || !normalizedTime) return null;

    const dateTime = new Date(`${normalizedDate}T${normalizedTime}`);
    return Number.isNaN(dateTime.getTime()) ? null : dateTime;
};

const EARLY_START_CONFIGURATION_KEYS = new Set([
    'exam_start_before_time',
    'exam_start_before_minutes',
    'exam_start_early_minutes',
    'student_exam_start_before_time',
    'student_exam_start_before_minutes',
    'student_can_start_exam_before_time',
    'student_can_start_exam_before_minutes',
    'allowed_exam_start_before_minutes'
]);

const flattenConfigurations = value => {
    if (Array.isArray(value)) return value.flatMap(flattenConfigurations);
    if (!value || typeof value !== 'object') return [];
    if ('key' in value) return [value];

    return Object.values(value).flatMap(flattenConfigurations);
};

const isEarlyStartConfiguration = configuration => {
    const key = String(configuration?.key || '').trim().toLowerCase();
    if (EARLY_START_CONFIGURATION_KEYS.has(key)) return true;

    const searchableText = [
        configuration?.key,
        configuration?.label,
        configuration?.name,
        configuration?.title,
        configuration?.description
    ]
        .filter(Boolean)
        .join(' ')
        .trim()
        .toLowerCase();

    return (
        /بدء.*اختبار.*قبل.*بداية/.test(searchableText) ||
        /قبل.*بداية.*اختبار/.test(searchableText) ||
        /start.*(exam|test).*before/.test(searchableText) ||
        /before.*(exam|test).*start/.test(searchableText) ||
        (/exam|test/.test(searchableText) &&
            /start/.test(searchableText) &&
            /before/.test(searchableText))
    );
};

export const getExamEarlyStartMinutes = configurations => {
    const configuration = flattenConfigurations(configurations).find(
        isEarlyStartConfiguration
    );
    const minutes = Number(configuration?.value);

    return Number.isFinite(minutes) && minutes > 0 ? minutes : 0;
};

export const getExamStartAvailability = (
    exam,
    now = new Date(),
    earlyStartMinutes = 0
) => {
    const examDate = exam?.examDate ?? exam?.exam_date;
    const firstTime = toLocalDateTime(examDate, exam?.timeFrom ?? exam?.time_from);
    const secondTime = toLocalDateTime(examDate, exam?.timeTo ?? exam?.time_to);
    const [startsAt, endsAt] = [firstTime, secondTime].every(Boolean)
        ? [firstTime, secondTime].sort((first, second) => first - second)
        : [firstTime, secondTime];
    const safeEarlyStartMinutes = Math.max(0, Number(earlyStartMinutes) || 0);
    const availableFrom = startsAt
        ? new Date(startsAt.getTime() - safeEarlyStartMinutes * 60 * 1000)
        : null;

    if (!startsAt || !endsAt) {
        return {
            isAvailable: true,
            reason: 'missing_schedule',
            startsAt,
            endsAt,
            availableFrom,
            earlyStartMinutes: safeEarlyStartMinutes
        };
    }

    if (now < availableFrom) {
        return {
            isAvailable: false,
            reason: 'not_started',
            startsAt,
            endsAt,
            availableFrom,
            earlyStartMinutes: safeEarlyStartMinutes
        };
    }

    if (now > endsAt) {
        return {
            isAvailable: false,
            reason: 'ended',
            startsAt,
            endsAt,
            availableFrom,
            earlyStartMinutes: safeEarlyStartMinutes
        };
    }

    return {
        isAvailable: true,
        reason: 'available',
        startsAt,
        endsAt,
        availableFrom,
        earlyStartMinutes: safeEarlyStartMinutes
    };
};
