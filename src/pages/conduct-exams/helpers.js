export const EXAM_TYPES = ['maqata3', 'sard'];

export const firstNonEmpty = (...values) =>
    values.find(value => value !== undefined && value !== null && value !== '');

export const firstObject = (...values) =>
    values.find(value => value && typeof value === 'object' && !Array.isArray(value));

export const getLocalizedValue = value => {
    if (value == null || value === '') return value;
    if (typeof value === 'object' && !Array.isArray(value)) {
        return firstNonEmpty(value.ar, value.en, value.name, value.label, value.value);
    }
    return value;
};

export const getDisplayDate = value => {
    if (value == null || value === '') return value;
    if (typeof value === 'object' && !Array.isArray(value)) {
        return firstNonEmpty(value.gregorian, value.date, value.hijri, value.hijri_indic);
    }
    return value;
};

export const extractCollection = response => {
    if (Array.isArray(response)) return response;
    if (Array.isArray(response?.data)) return response.data;
    if (Array.isArray(response?.items)) return response.items;
    if (Array.isArray(response?.results)) return response.results;
    if (Array.isArray(response?.branches)) return response.branches;
    if (Array.isArray(response?.entities)) return response.entities;
    if (Array.isArray(response?.students)) return response.students;
    if (Array.isArray(response?.criteria)) return response.criteria;
    if (Array.isArray(response?.segments)) return response.segments;
    if (Array.isArray(response?.scheduled_exams)) return response.scheduled_exams;
    if (Array.isArray(response?.grades)) return response.grades;
    if (Array.isArray(response?.data?.data)) return response.data.data;
    return [];
};

export const extractRecord = response =>
    response?.data?.data || response?.data || response || null;

export const normalizeBranchItem = (item, index) => ({
    id: firstNonEmpty(item?.id, `branch-${index}`),
    displayName: firstNonEmpty(
        getLocalizedValue(item?.name),
        item?.branch_name,
        item?.title,
        item?.label,
        item?.name
    )
});

export const normalizeEntityItem = (item, index) => {
    const branch = firstObject(item?.branch, item?.current_branch);
    const mainProgram = firstObject(item?.main_program, item?.program);

    return {
        id: firstNonEmpty(item?.id, `entity-${index}`),
        displayName: firstNonEmpty(
            getLocalizedValue(item?.name),
            item?.entity_name,
            item?.title
        ),
        branchId: firstNonEmpty(item?.branch_id, branch?.id),
        branchName: firstNonEmpty(getLocalizedValue(branch?.name), item?.branch_name),
        mainProgram: firstNonEmpty(
            getLocalizedValue(mainProgram?.name),
            item?.main_program_name
        ),
        phone: firstNonEmpty(item?.phone, item?.mobile),
        raw: item
    };
};

export const normalizeSegmentItem = (item, index) => ({
    id: firstNonEmpty(item?.id, item?.segment_id, item?.juz_number, `segment-${index}`),
    order: firstNonEmpty(item?.order, index + 1),
    juzNumber: firstNonEmpty(item?.juz_number, item?.id, item?.segment_id, index + 1),
    firstVerseKey: firstNonEmpty(item?.first_verse_key, null),
    lastVerseKey: firstNonEmpty(item?.last_verse_key, null),
    columnTotal: firstNonEmpty(item?.column_total, 0),
    displayName: firstNonEmpty(
        getLocalizedValue(item?.name),
        item?.segment_name,
        item?.title,
        item?.label,
        item?.number != null ? `#${item.number}` : null,
        item?.id != null ? `#${item.id}` : `Segment ${index + 1}`
    ),
    description: firstNonEmpty(
        item?.description,
        item?.first_verse_key && item?.last_verse_key
            ? `${item.first_verse_key} - ${item.last_verse_key}`
            : null
    ),
    raw: item
});

export const resolveStudentStatus = student => {
    const normalized = String(
        firstNonEmpty(
            student?.status_text,
            student?.status,
            student?.exam_status,
            student?.submitted_at ? 'submitted' : null,
            student?.started_at ? 'started' : null,
            'not_started'
        )
    ).toLowerCase();

    if (
        normalized.includes('submit') ||
        normalized.includes('complete') ||
        normalized.includes('result')
    ) {
        return 'submitted';
    }
    if (normalized.includes('start') || normalized.includes('progress')) {
        return 'started';
    }
    return 'not_started';
};

export const normalizeStudentItem = (item, index) => {
    const student = firstObject(item?.student, item?.user, item?.profile);
    const segments = extractCollection(
        firstNonEmpty(item?.segments, item?.exam_segments, item?.student_segments, [])
    );

    return {
        id: firstNonEmpty(item?.student_id, student?.id, item?.id, `student-${index}`),
        displayName: firstNonEmpty(
            getLocalizedValue(student?.name),
            getLocalizedValue(item?.name),
            item?.student_name,
            item?.full_name
        ),
        startedAt: firstNonEmpty(getDisplayDate(item?.started_at), getDisplayDate(item?.start_at)),
        submittedAt: firstNonEmpty(
            getDisplayDate(item?.submitted_at),
            getDisplayDate(item?.completed_at)
        ),
        statusKey: resolveStudentStatus(item),
        statusLabel: firstNonEmpty(item?.status_text, item?.status, item?.exam_status),
        evaluationParameterId: firstNonEmpty(
            item?.evaluation_parameter_id,
            item?.evaluation_template_id,
            item?.template_id
        ),
        examType: firstNonEmpty(item?.exam_type, item?.type),
        juzNumbers: Array.isArray(item?.juz_numbers) ? item.juz_numbers : [],
        segments: segments.map(normalizeSegmentItem),
        raw: item
    };
};

export const normalizeTemplateItem = (item, index) => ({
    id: firstNonEmpty(item?.id, `template-${index}`),
    displayName: firstNonEmpty(
        getLocalizedValue(item?.name),
        item?.template_name,
        item?.title
    ),
    totalGrade: item?.total_grade,
    passingGrade: item?.passing_grade,
    evaluationSystem: getLocalizedValue(item?.evaluation_system),
    criteria: extractCollection(item?.criteria).map((criterion, criteriaIndex) => ({
        id: firstNonEmpty(criterion?.id, criterion?.criteria_id, `criteria-${criteriaIndex}`),
        displayName: firstNonEmpty(
            getLocalizedValue(criterion?.criteria_name),
            criterion?.name
        ),
        degree: firstNonEmpty(criterion?.degree, criterion?.grade, criterion?.max_degree, 0)
    }))
});

export const normalizeExamItem = (item, index) => {
    const branch = firstObject(item?.branch, item?.current_branch);
    const entity = firstObject(item?.entity, item?.current_entity);
    const template = firstObject(
        item?.evaluation_template,
        item?.evaluation_parameter,
        item?.template
    );

    return {
        id: firstNonEmpty(item?.id, item?.scheduled_exam_id, `exam-${index}`),
        displayName: firstNonEmpty(
            getLocalizedValue(item?.name),
            item?.exam_name,
            getLocalizedValue(template?.name),
            item?.title,
            item?.exam_type,
            getDisplayDate(item?.scheduled_at || item?.exam_date || item?.date) || 'Exam'
        ),
        branchId: firstNonEmpty(item?.branch_id, branch?.id),
        branchName: firstNonEmpty(getLocalizedValue(branch?.name), item?.branch_name),
        entityId: firstNonEmpty(item?.entity_id, entity?.id),
        entityName: firstNonEmpty(getLocalizedValue(entity?.name), item?.entity_name),
        scheduledAt: firstNonEmpty(
            getDisplayDate(item?.scheduled_at),
            getDisplayDate(item?.exam_date),
            getDisplayDate(item?.date),
            getDisplayDate(item?.start_at)
        ),
        examDate: firstNonEmpty(getDisplayDate(item?.exam_date), getDisplayDate(item?.date)),
        timeFrom: firstNonEmpty(item?.time_from, item?.start_time, item?.time, item?.starts_at),
        timeTo: firstNonEmpty(item?.time_to, item?.end_time),
        status: firstNonEmpty(item?.status_text, item?.status, item?.exam_status),
        studentsCount: firstNonEmpty(
            item?.students_count,
            extractCollection(item?.students).length,
            extractCollection(item?.exam_students).length,
            0
        ),
        evaluationParameterId: firstNonEmpty(
            item?.evaluation_parameter_id,
            item?.evaluation_template_id,
            template?.id
        ),
        available: item?.available,
        teachers: extractCollection(item?.teachers),
        raw: item
    };
};

export const normalizeExamDetails = response => {
    const exam = extractRecord(response) || {};
    const normalizedExam = normalizeExamItem(exam, 0);
    const students = extractCollection(
        firstNonEmpty(exam?.students, exam?.exam_students, exam?.participants, [])
    ).map(normalizeStudentItem);
    const segments = extractCollection(
        firstNonEmpty(exam?.segments, exam?.exam_segments, exam?.items, [])
    ).map(normalizeSegmentItem);
    const teachers = extractCollection(firstNonEmpty(exam?.teachers, [])).map(
        (teacher, index) => ({
            id: firstNonEmpty(teacher?.id, `teacher-${index}`),
            displayName: firstNonEmpty(getLocalizedValue(teacher?.name), teacher?.name)
        })
    );

    return {
        ...normalizedExam,
        location: firstNonEmpty(exam?.location, exam?.room_name),
        method: firstNonEmpty(exam?.method, exam?.attendance_type),
        responsible: firstNonEmpty(exam?.responsible, exam?.responsible_by),
        students,
        segments,
        teachers,
        raw: exam
    };
};

export const normalizeResultDetails = response => {
    const result = extractRecord(response) || {};
    const scheduledExam = result?.scheduled_exam || {};
    const resultSegments = [
        result?.segments,
        result?.student_exam_segments,
        result?.exam_segments,
        result?.result_segments
    ].map(extractCollection).find(items => items.length) || [];

    return {
        id: result?.id,
        status: firstNonEmpty(result?.status, result?.status_text, 'submitted'),
        finalGrade: firstNonEmpty(result?.final_grade, result?.total_grade, '-'),
        examType: firstNonEmpty(result?.exam_type, 'maqata3'),
        conductedBy: result?.conducted_by?.name || '-',
        studentName: firstNonEmpty(getLocalizedValue(result?.student?.name), result?.student?.name),
        scheduledExam,
        scheduledExamDate: getDisplayDate(scheduledExam?.exam_date || scheduledExam?.date),
        segments: resultSegments.map((segment, index) => {
            const rawGrades = [
                segment?.grades,
                segment?.criteria_grades,
                segment?.evaluation_grades,
                segment?.evaluations,
                segment?.segment_grades,
                segment?.details?.grades
            ].map(extractCollection).find(items => items.length) || [];
            const grades = rawGrades.map((grade, gradeIndex) => ({
                id: firstNonEmpty(grade?.id, `${segment?.id}-${gradeIndex}`),
                criteriaName: firstNonEmpty(
                    getLocalizedValue(grade?.criteria_name),
                    getLocalizedValue(grade?.criterion?.name),
                    getLocalizedValue(grade?.criteria?.name),
                    getLocalizedValue(grade?.evaluation_criterion?.name),
                    grade?.name
                ),
                maxDegree: firstNonEmpty(
                    grade?.max_degree,
                    grade?.degree,
                    grade?.criterion?.degree,
                    grade?.criteria?.degree,
                    '-'
                ),
                grade: firstNonEmpty(grade?.grade, grade?.score, grade?.value, '-')
            }));
            const calculatedTotal = grades.reduce((total, grade) => {
                const value = Number(grade.grade);
                return Number.isFinite(value) ? total + value : total;
            }, 0);
            const suppliedTotal = firstNonEmpty(
                segment?.total_grade,
                segment?.total,
                segment?.score,
                segment?.column_total
            );

            return {
                id: firstNonEmpty(segment?.id, segment?.segment_id, `segment-result-${index}`),
                order: firstNonEmpty(segment?.order, segment?.segment_order, index + 1),
                juzNumber: firstNonEmpty(segment?.juz_number, segment?.juz?.number, '-'),
                columnTotal: Number(suppliedTotal) || calculatedTotal || 0,
                grades
            };
        })
    };
};

export const resolveTemplateForStudent = (student, examDetails, templates = []) => {
    const candidateId = firstNonEmpty(
        student?.evaluationParameterId,
        examDetails?.evaluationParameterId,
        templates[0]?.id
    );

    return (
        templates.find(template => String(template.id) === String(candidateId)) ||
        templates[0] ||
        null
    );
};

export const resolveSegmentsForStudent = (student, examDetails) => {
    if (student?.sessionSegments?.length) return student.sessionSegments;
    if (student?.segments?.length) return student.segments;
    if (examDetails?.segments?.length) return examDetails.segments;
    if (Array.isArray(student?.juzNumbers) && student.juzNumbers.length) {
        return student.juzNumbers.map((juzNumber, index) =>
            normalizeSegmentItem(
                {
                    id: juzNumber,
                    order: index + 1,
                    juz_number: juzNumber,
                    first_verse_key: null,
                    last_verse_key: null,
                    column_total: 0
                },
                index
            )
        );
    }
    return [];
};

export const getStatusLabel = (statusKey, locale) => {
    if (statusKey === 'submitted') {
        return locale === 'ar' ? 'تم التقييم' : 'Completed';
    }
    if (statusKey === 'started') {
        return locale === 'ar' ? 'بدأ الامتحان' : 'Started';
    }
    return locale === 'ar' ? 'لم يبدأ' : 'Not started';
};

export const getStatusClasses = statusKey => {
    if (statusKey === 'submitted') {
        return 'border-emerald-200 bg-emerald-50 text-emerald-700';
    }
    if (statusKey === 'started') {
        return 'border-sky-200 bg-sky-50 text-sky-700';
    }
    return 'border-gray-200 bg-gray-50 text-gray-700';
};

export const formatTimeRange = exam => {
    if (!exam?.timeFrom && !exam?.timeTo) return '-';
    if (exam?.timeFrom && exam?.timeTo) {
        const [startTime, endTime] = [exam.timeFrom, exam.timeTo].sort();
        return `${startTime} - ${endTime}`;
    }
    return exam?.timeFrom || exam?.timeTo || '-';
};

export const buildGradeKey = (segmentId, criteriaId) => `${segmentId}:${criteriaId}`;
