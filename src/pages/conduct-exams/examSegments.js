const JUZ_RANGES = {
    1: ['1:1', '2:141'], 2: ['2:142', '2:252'], 3: ['2:253', '3:92'],
    4: ['3:93', '4:23'], 5: ['4:24', '4:147'], 6: ['4:148', '5:81'],
    7: ['5:82', '6:110'], 8: ['6:111', '7:87'], 9: ['7:88', '8:40'],
    10: ['8:41', '9:92'], 11: ['9:93', '11:5'], 12: ['11:6', '12:52'],
    13: ['12:53', '14:52'], 14: ['15:1', '16:128'], 15: ['17:1', '18:74'],
    16: ['18:75', '21:112'], 17: ['21:1', '22:78'], 18: ['23:1', '25:20'],
    19: ['25:21', '27:55'], 20: ['27:56', '29:45'], 21: ['29:46', '33:30'],
    22: ['33:31', '36:27'], 23: ['36:28', '39:31'], 24: ['39:32', '41:46'],
    25: ['41:47', '45:37'], 26: ['46:1', '51:30'], 27: ['51:31', '57:29'],
    28: ['58:1', '66:12'], 29: ['67:1', '77:50'], 30: ['78:1', '114:6']
};

const normalizeJuzNumbers = values => [...new Set(
    (Array.isArray(values) ? values : [])
        .map(value => Number(value))
        .filter(value => Number.isInteger(value) && value >= 1 && value <= 30)
)].sort((left, right) => left - right);

const valueOf = (segment, camelCase, snakeCase, fallback = null) =>
    segment?.[camelCase] ?? segment?.[snakeCase] ?? fallback;

const getSubmissionSegmentId = (segment, fallback = null) =>
    valueOf(
        segment,
        'submissionSegmentId',
        'submission_segment_id',
        valueOf(
            segment,
            'quranExamSegmentItemId',
            'quran_exam_segment_item_id',
            valueOf(
                segment,
                'examSegmentItemId',
                'exam_segment_item_id',
                segment?.quran_exam_segment_item?.id ??
                    segment?.exam_segment_item?.id ??
                    segment?.exam_segment?.item?.id ??
                    segment?.item?.id ??
                    segment?.segment?.id ??
                    valueOf(segment, 'segmentId', 'segment_id', segment?.id ?? fallback)
            )
        )
    );

const normalizeSegment = (segment, index, fallbackJuz) => {
    const juzNumber = Number(valueOf(segment, 'juzNumber', 'juz_number', fallbackJuz)) || fallbackJuz;
    const id = valueOf(segment, 'id', 'segment_id', valueOf(segment, 'quranExamSegmentItemId', 'quran_exam_segment_item_id', juzNumber ?? index + 1));

    return {
        id,
        submissionSegmentId: getSubmissionSegmentId(segment, id),
        order: valueOf(segment, 'order', 'order', index + 1),
        juzNumber,
        firstVerseKey: valueOf(segment, 'firstVerseKey', 'first_verse_key'),
        lastVerseKey: valueOf(segment, 'lastVerseKey', 'last_verse_key'),
        columnTotal: valueOf(segment, 'columnTotal', 'column_total', 0)
    };
};

export const getExamConductionSegments = ({ examType, rawSegments, studentJuzNumbers, fallbackJuzNumbers }) => {
    const segments = Array.isArray(rawSegments) ? rawSegments : [];
    const juzNumbers = normalizeJuzNumbers(studentJuzNumbers).length
        ? normalizeJuzNumbers(studentJuzNumbers)
        : normalizeJuzNumbers(fallbackJuzNumbers);

    if (String(examType).trim().toLowerCase() === 'sard' && juzNumbers.length) {
        return juzNumbers.map((juzNumber, index) => {
            const rawSegment = segments[index] || {};
            const [firstVerseKey, lastVerseKey] = JUZ_RANGES[juzNumber] || [];
            return {
                ...normalizeSegment(rawSegment, index, juzNumber),
                juzNumber,
                firstVerseKey,
                lastVerseKey
            };
        });
    }

    if (segments.length) return segments.map((segment, index) => normalizeSegment(segment, index));
    return juzNumbers.map((juzNumber, index) => {
        const [firstVerseKey, lastVerseKey] = JUZ_RANGES[juzNumber] || [];
        return {
            id: juzNumber,
            submissionSegmentId: juzNumber,
            order: index + 1,
            juzNumber,
            firstVerseKey,
            lastVerseKey,
            columnTotal: 0
        };
    });
};

export const getExamConductionSubmissionSegmentId = segment =>
    getSubmissionSegmentId(segment, segment?.id ?? null);
