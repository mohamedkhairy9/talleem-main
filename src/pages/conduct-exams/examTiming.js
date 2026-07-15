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

export const getExamStartAvailability = (exam, now = new Date()) => {
    const startsAt = toLocalDateTime(exam?.examDate ?? exam?.exam_date, exam?.timeFrom ?? exam?.time_from);
    const endsAt = toLocalDateTime(exam?.examDate ?? exam?.exam_date, exam?.timeTo ?? exam?.time_to);

    if (!startsAt || !endsAt) {
        return { isAvailable: true, reason: 'missing_schedule', startsAt, endsAt };
    }

    if (now < startsAt) {
        return { isAvailable: false, reason: 'not_started', startsAt, endsAt };
    }

    if (now > endsAt) {
        return { isAvailable: false, reason: 'ended', startsAt, endsAt };
    }

    return { isAvailable: true, reason: 'available', startsAt, endsAt };
};
