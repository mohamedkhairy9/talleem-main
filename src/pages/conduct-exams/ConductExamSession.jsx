import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Loader from '@/components/common/Loader';
import useLocale from '@/utils/hooks/global/useLocale';
import { getLocalizedErrorMessage } from '@/utils/helpers/localizedMessages';
import {
    useConductExamDetailsQuery,
    useConductExamEvaluationTemplatesQuery,
    useSubmitConductExamMutation
} from '@/api/hooks/useConductExams';
import {
    buildGradeKey,
    extractCollection,
    extractRecord,
    firstNonEmpty,
    normalizeExamDetails,
    normalizeTemplateItem,
    resolveTemplateForStudent
} from './helpers';
import InteractiveExamMushaf from './InteractiveExamMushaf';
import {
    getExamConductionSegments,
    getExamConductionSubmissionSegmentId
} from './examSegments';

const getExamTypeLabel = (type, isArabic) => {
    if (type === 'sard') return isArabic ? 'سرد' : 'Sard';
    return isArabic ? 'مقاطع' : 'Maqata3';
};

const getGradeError = (value, maxDegree, isArabic) => {
    if (value === '' || value === null || value === undefined) {
        return isArabic ? 'هذه الدرجة مطلوبة.' : 'This grade is required.';
    }

    const numericValue = Number(value);
    if (Number.isNaN(numericValue)) {
        return isArabic ? 'الدرجة يجب أن تكون رقمًا صحيحًا.' : 'Grade must be numeric.';
    }
    if (numericValue < 0) {
        return isArabic ? 'الدرجة لا يمكن أن تكون أقل من صفر.' : 'Grade cannot be less than 0.';
    }
    if (numericValue > Number(maxDegree || 0)) {
        return isArabic
            ? `الدرجة لا يمكن أن تتجاوز ${Number(maxDegree || 0)}.`
            : `Grade cannot exceed ${Number(maxDegree || 0)}.`;
    }

    return '';
};

export default function ConductExamSession() {
    const navigate = useNavigate();
    const location = useLocation();
    const { scheduledExamId, studentId } = useParams();
    const { currentLocale } = useLocale();
    const isArabic = currentLocale === 'ar';

    const examDetailsQuery = useConductExamDetailsQuery(scheduledExamId, {
        enabled: !!scheduledExamId
    });
    const templatesQuery = useConductExamEvaluationTemplatesQuery();
    const submitMutation = useSubmitConductExamMutation();

    const examDetails = useMemo(
        () => (examDetailsQuery.data ? normalizeExamDetails(examDetailsQuery.data) : null),
        [examDetailsQuery.data]
    );
    const templates = useMemo(
        () => extractCollection(templatesQuery.data).map(normalizeTemplateItem),
        [templatesQuery.data]
    );

    const selectedStudent = useMemo(() => {
        const stateStudent = location.state?.student;
        if (stateStudent && String(stateStudent.id) === String(studentId)) {
            return stateStudent;
        }

        return (
            examDetails?.students?.find(student => String(student.id) === String(studentId)) ||
            null
        );
    }, [examDetails?.students, location.state?.student, studentId]);

    const fallbackTemplate = useMemo(
        () => resolveTemplateForStudent(selectedStudent, examDetails, templates),
        [selectedStudent, examDetails, templates]
    );

    const sessionData = useMemo(
        () => extractRecord(location.state?.startData),
        [location.state?.startData]
    );
    const hasActiveSession = Boolean(sessionData?.id || sessionData?.exam_session_id || sessionData?.status);

    const [selectedTemplateId, setSelectedTemplateId] = useState('');
    const [grades, setGrades] = useState({});
    const [errors, setErrors] = useState({});
    const [pageError, setPageError] = useState('');
    const [isMushafOpen, setIsMushafOpen] = useState(false);
    const [activeSegmentId, setActiveSegmentId] = useState(null);

    useEffect(() => {
        const stateTemplateId = location.state?.selectedTemplate?.id;
        const payloadTemplateId = location.state?.startPayload?.evaluation_parameter_id;
        const candidateId =
            stateTemplateId || payloadTemplateId || fallbackTemplate?.id || templates[0]?.id || '';

        setSelectedTemplateId(previous => previous || candidateId);
    }, [
        fallbackTemplate?.id,
        location.state?.selectedTemplate?.id,
        location.state?.startPayload?.evaluation_parameter_id,
        templates
    ]);

    const selectedTemplate = useMemo(
        () =>
            templates.find(template => String(template.id) === String(selectedTemplateId)) ||
            fallbackTemplate ||
            null,
        [fallbackTemplate, selectedTemplateId, templates]
    );

    const examType =
        location.state?.startPayload?.exam_type || sessionData?.exam_type || selectedStudent?.examType || 'maqata3';
    const sessionSegments = useMemo(() => {
        const candidates = [
            sessionData?.segments,
            sessionData?.exam_segments,
            sessionData?.quran_exam_segment_items,
            sessionData?.exam_segment?.items,
            sessionData?.student_exam?.segments,
            sessionData?.student_exam?.exam_segments,
            sessionData?.student_exam?.quran_exam_segment_items,
            sessionData?.student_exam?.exam_segment?.items,
            sessionData?.exam_session?.segments,
            sessionData?.exam_session?.exam_segments,
            sessionData?.exam_session?.quran_exam_segment_items,
            sessionData?.exam_session?.exam_segment?.items,
            sessionData?.session?.segments,
            sessionData?.session?.exam_segments,
            sessionData?.session?.quran_exam_segment_items,
            sessionData?.session?.exam_segment?.items
        ];

        return candidates.map(extractCollection).find(items => items.length) || [];
    }, [sessionData]);
    const segments = useMemo(() => getExamConductionSegments({
        examType,
        rawSegments: sessionSegments.length
            ? sessionSegments
            : (!hasActiveSession ? (
                selectedStudent?.raw?.segments ||
                selectedStudent?.raw?.exam_segments ||
                selectedStudent?.raw?.quran_exam_segment_items ||
                examDetails?.raw?.segments ||
                examDetails?.raw?.exam_segments ||
                examDetails?.raw?.quran_exam_segment_items ||
                examDetails?.raw?.exam_segment?.items ||
                []
            ) : []),
        studentJuzNumbers: selectedStudent?.juzNumbers,
        fallbackJuzNumbers: sessionSegments.map(segment => segment?.juz_number ?? segment?.juzNumber)
    }), [examDetails?.raw?.exam_segment?.items, examDetails?.raw?.exam_segments, examDetails?.raw?.quran_exam_segment_items, examDetails?.raw?.segments, examType, hasActiveSession, selectedStudent?.juzNumbers, selectedStudent?.raw?.exam_segments, selectedStudent?.raw?.quran_exam_segment_items, selectedStudent?.raw?.segments, sessionSegments]);

    const criteria = useMemo(() => {
        const sessionCriteria = extractCollection(sessionData?.evaluation_parameter?.criteria).map(
            (criterion, index) => ({
                id: firstNonEmpty(criterion?.id, criterion?.criteria_id, `criteria-${index}`),
                displayName: firstNonEmpty(
                    criterion?.criteria_name?.ar,
                    criterion?.criteria_name?.en,
                    criterion?.name,
                    criterion?.criteria_name
                ),
                degree: firstNonEmpty(criterion?.degree, criterion?.max_degree, criterion?.grade, 0)
            })
        );

        if (sessionCriteria.length) return sessionCriteria;
        return selectedTemplate?.criteria || [];
    }, [selectedTemplate?.criteria, sessionData?.evaluation_parameter?.criteria]);
    useEffect(() => {
        if (!segments.length || !criteria.length) return;

        const nextGrades = {};
        segments.forEach(segment => {
            criteria.forEach(criterion => {
                nextGrades[buildGradeKey(segment.id, criterion.id)] = '';
            });
        });

        setGrades(nextGrades);
        setErrors({});
    }, [criteria, segments]);

    useEffect(() => {
        if (!segments.length) return;

        if (!segments.some(segment => String(segment.id) === String(activeSegmentId))) {
            setActiveSegmentId(segments[0].id);
        }
    }, [activeSegmentId, segments]);

    const activeSegment = useMemo(
        () =>
            segments.find(
                segment => String(segment.id) === String(activeSegmentId)
            ) || null,
        [activeSegmentId, segments]
    );

    const handleBack = () => navigate('/conduct-exams');

    const handleGradeChange = (segmentId, criteriaId, value) => {
        const gradeKey = buildGradeKey(segmentId, criteriaId);
        const criterion = criteria.find(item => String(item.id) === String(criteriaId));

        setGrades(previous => ({
            ...previous,
            [gradeKey]: value
        }));
        setErrors(previous => ({
            ...previous,
            [gradeKey]: getGradeError(value, criterion?.degree, isArabic)
        }));
    };

    const handleSubmit = () => {
        if (!hasActiveSession) {
            setPageError(
                isArabic
                    ? 'لا توجد جلسة امتحان فعالة. ارجع لتفاصيل الامتحان واضغط بدء الامتحان أولًا.'
                    : 'There is no active exam session. Go back to the exam details and start the exam first.'
            );
            return;
        }

        if (!segments.length || !criteria.length) {
            setPageError(
                isArabic
                    ? 'تعذر تجهيز نموذج التقييم. تأكد من وجود المقاطع ونموذج التقييم.'
                    : 'Unable to build the grading form. Make sure segments and template are available.'
            );
            return;
        }

        const nextErrors = {};
        const payload = {
            segments: segments.map(segment => ({
                segment_id: getExamConductionSubmissionSegmentId(segment),
                grades: criteria.map(criterion => {
                    const gradeKey = buildGradeKey(segment.id, criterion.id);
                    const rawValue = grades[gradeKey];
                    const error = getGradeError(rawValue, criterion.degree, isArabic);

                    if (error) {
                        nextErrors[gradeKey] = error;
                    }

                    return {
                        criteria_id: criterion.id,
                        grade: Number(rawValue)
                    };
                })
            }))
        };

        setErrors(nextErrors);

        if (Object.keys(nextErrors).length > 0) {
            setPageError(
                isArabic
                    ? 'أكمل جميع الدرجات المطلوبة قبل الإرسال.'
                    : 'Fill in all required grades before submitting.'
            );
            return;
        }

        setPageError('');

        submitMutation.mutate(
            {
                scheduledExamId,
                studentId,
                data: payload
            },
            {
                onSuccess: response => {
                    navigate(`/conduct-exams/${scheduledExamId}/students/${studentId}/result`, {
                        state: {
                            student: selectedStudent,
                            exam: examDetails,
                            resultData: response
                        }
                    });
                },
                onError: error => {
                    setPageError(
                        getLocalizedErrorMessage(error) ||
                            (isArabic
                                ? 'فشل إرسال درجات الامتحان.'
                                : 'Failed to submit exam grades.')
                    );
                }
            }
        );
    };

    if (examDetailsQuery.isLoading || templatesQuery.isLoading) {
        return <Loader />;
    }

    if (examDetailsQuery.hasError || !examDetails || !selectedStudent) {
        return (
            <div className="space-y-6">
                <section className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700 shadow-sm">
                    <h1 className="text-xl font-semibold">
                        {isArabic ? 'تعذر تحميل بيانات الامتحان' : 'Unable to load exam data'}
                    </h1>
                    <p className="mt-2 text-sm">
                        {examDetailsQuery.errorMessage ||
                            (isArabic
                                ? 'لا يمكن فتح صفحة التقييم لهذا الطالب الآن.'
                                : 'This grading page cannot be opened right now.')}
                    </p>
                </section>

                <button
                    type="button"
                    onClick={handleBack}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                >
                    {isArabic ? 'العودة لإجراء الامتحانات' : 'Back to Conduct Exams'}
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            {isArabic ? 'متابعة الامتحان' : 'Started Exam Summary'}
                        </h1>
                        <p className="mt-2 text-sm text-gray-600">
                            {isArabic
                                ? 'راجع بيانات الجلسة أولًا، ثم افتح المصحف أو انتقل لخطوة إدخال الدرجات.'
                                : 'Review the started session first, then open the Mushaf or continue to grade submission.'}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleBack}
                        className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                    >
                        {isArabic ? 'العودة' : 'Back'}
                    </button>
                </div>
            </section>

            {pageError ? (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {pageError}
                </div>
            ) : null}

            {!hasActiveSession ? (
                <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                    {isArabic
                        ? 'لم تصل بيانات جلسة البدء لهذه الصفحة. ارجع لتفاصيل الامتحان، ثم اضغط بدء الامتحان لتجهيز الجلسة بشكل صحيح.'
                        : 'The start-session data is missing. Return to the exam details and start the exam to prepare the session correctly.'}
                </div>
            ) : null}

            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="mb-5 flex flex-wrap items-center gap-3">
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                        {sessionData?.status || (isArabic ? 'تم البدء' : 'Started')}
                    </span>
                    <button
                        type="button"
                        onClick={() => setIsMushafOpen(true)}
                        disabled={!segments.length || !criteria.length}
                        className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        {isArabic ? 'فتح المقطع والتقييم' : 'Open Segment & Evaluate'}
                    </button>
                </div>

                <div className="grid gap-4 border-b border-gray-100 pb-5 md:grid-cols-5">
                    <div>
                        <p className="text-sm text-gray-500">{isArabic ? 'الطالب' : 'Student'}</p>
                        <p className="mt-1 font-semibold text-gray-900">
                            {selectedStudent.displayName || '-'}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">
                            {isArabic ? 'نوع الامتحان' : 'Exam Type'}
                        </p>
                        <p className="mt-1 font-semibold text-gray-900">
                            {getExamTypeLabel(examType, isArabic)}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">
                            {isArabic ? 'نموذج التقييم' : 'Evaluation Template'}
                        </p>
                        <p className="mt-1 font-semibold text-gray-900">
                            {selectedTemplate?.displayName || '-'}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">
                            {isArabic ? 'رقم الجلسة' : 'Session Number'}
                        </p>
                        <p className="mt-1 font-semibold text-gray-900">
                            {sessionData?.id || sessionData?.exam_session_id || '-'}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">
                            {isArabic ? 'تمت البداية بواسطة' : 'Conducted By'}
                        </p>
                        <p className="mt-1 font-semibold text-gray-900">
                            {sessionData?.conducted_by?.name || '-'}
                        </p>
                    </div>
                </div>

                <div className="mt-5 overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 border border-gray-200">
                        <thead className="bg-sky-50">
                            <tr>
                                <th className="px-4 py-3 text-start text-sm font-semibold text-gray-900">
                                    {isArabic ? 'المقطع' : 'Segment'}
                                </th>
                                <th className="px-4 py-3 text-start text-sm font-semibold text-gray-900">
                                    {isArabic ? 'الجزء' : 'Juz'}
                                </th>
                                <th className="px-4 py-3 text-start text-sm font-semibold text-gray-900">
                                    {isArabic ? 'بداية المقطع' : 'First Verse'}
                                </th>
                                <th className="px-4 py-3 text-start text-sm font-semibold text-gray-900">
                                    {isArabic ? 'نهاية المقطع' : 'Last Verse'}
                                </th>
                                <th className="px-4 py-3 text-start text-sm font-semibold text-gray-900">
                                    {isArabic ? 'المجموع' : 'Total'}
                                </th>
                                <th className="px-4 py-3 text-start text-sm font-semibold text-gray-900">
                                    {isArabic ? 'الإجراءات' : 'Actions'}
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {segments.length ? (
                                segments.map(segment => {
                                    const isActiveSegment =
                                        String(segment.id) === String(activeSegmentId);

                                    return (
                                    <tr
                                        key={segment.id}
                                        onClick={() => setActiveSegmentId(segment.id)}
                                        className={`cursor-pointer transition-colors ${
                                            isActiveSegment
                                                ? 'bg-primary/10 ring-1 ring-inset ring-primary/40'
                                                : 'hover:bg-sky-50/60'
                                        }`}
                                    >
                                        <td className="px-4 py-3 text-sm text-gray-900">
                                            {segment.order ?? '-'}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-900">
                                            {segment.juzNumber ?? '-'}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-900">
                                            {segment.firstVerseKey || '-'}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-900">
                                            {segment.lastVerseKey || '-'}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-900">
                                            {segment.columnTotal ?? 0}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-900">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setActiveSegmentId(segment.id);
                                                    setIsMushafOpen(true);
                                                }}
                                                className="rounded-lg border border-gray-300 px-3 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-50"
                                            >
                                                {isArabic ? 'فتح المقطع والتقييم' : 'Open & Evaluate'}
                                            </button>
                                        </td>
                                    </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td
                                        colSpan="6"
                                        className="px-4 py-6 text-center text-sm text-gray-500"
                                    >
                                        {isArabic
                                            ? 'لا توجد مقاطع متاحة لهذا الامتحان حتى الآن.'
                                            : 'No segments are available for this exam yet.'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>

            {segments.length && criteria.length ? (
                <section className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-gray-600">
                        {isArabic
                            ? 'افتح كل مقطع لإدخال درجات معايير تقييمه، ثم احفظ النتيجة النهائية.'
                            : 'Open every segment to enter its criterion scores, then submit the final result.'}
                    </p>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={submitMutation.isPending}
                        className="shrink-0 rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                        {submitMutation.isPending
                            ? isArabic
                                ? 'جارٍ الإرسال...'
                                : 'Submitting...'
                            : isArabic
                            ? 'إنهاء الامتحان وحفظ الدرجات'
                            : 'Submit Grades'}
                    </button>
                </section>
            ) : null}

            {isMushafOpen ? (
                <div className="fixed inset-0 z-[60] overflow-hidden">
                    <div
                        className="fixed inset-0 bg-black/50"
                        aria-hidden="true"
                        onClick={() => setIsMushafOpen(false)}
                    />
                    <div className="relative flex min-h-full items-center justify-center p-4">
                        <div className="relative z-10 flex max-h-[calc(100vh-2rem)] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl">
                            <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        {isArabic ? 'المصحف' : 'Mushaf'}
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        {isArabic
                                            ? 'راجع المقطع المحدد ثم أدخل درجات معايير التقييم الخاصة به.'
                                            : 'Review the selected segment, then enter its evaluation criteria scores.'}
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setIsMushafOpen(false)}
                                    className="rounded-lg border border-gray-300 px-3 py-1 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                                >
                                    {isArabic ? 'إغلاق' : 'Close'}
                                </button>
                            </div>

                            <div className="space-y-5 overflow-y-auto p-4">
                                <InteractiveExamMushaf
                                    segments={segments}
                                    activeSegmentId={activeSegmentId}
                                    onSegmentChange={setActiveSegmentId}
                                />

                                {activeSegment && criteria.length ? (
                                    <section className="rounded-2xl border border-primary/30 bg-primary/[0.03] p-4">
                                        <div className="flex flex-col gap-2 border-b border-primary/15 pb-3 sm:flex-row sm:items-center sm:justify-between">
                                            <div>
                                                <h4 className="font-semibold text-gray-900">
                                                    {isArabic
                                                        ? `تقييم المقطع ${activeSegment.order}`
                                                        : `Evaluate Segment ${activeSegment.order}`}
                                                </h4>
                                                <p className="mt-1 text-xs text-gray-500">
                                                    {isArabic
                                                        ? `الجزء ${activeSegment.juzNumber || '-'}`
                                                        : `Juz ${activeSegment.juzNumber || '-'}`}
                                                </p>
                                            </div>
                                            <span className="w-fit rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                                                {isArabic
                                                    ? 'المعايير مرتبطة بهذا المقطع'
                                                    : 'Criteria linked to this segment'}
                                            </span>
                                        </div>

                                        <div className="mt-4 grid gap-4 md:grid-cols-2">
                                            {criteria.map(criterion => {
                                                const gradeKey = buildGradeKey(
                                                    activeSegment.id,
                                                    criterion.id
                                                );

                                                return (
                                                    <div
                                                        key={criterion.id}
                                                        className="rounded-xl border border-gray-200 bg-white p-4"
                                                    >
                                                        <label className="mb-2 block text-sm font-semibold text-gray-900">
                                                            {criterion.displayName}
                                                        </label>
                                                        <p className="mb-2 text-xs text-gray-500">
                                                            {isArabic
                                                                ? `الحد الأقصى ${criterion.degree}`
                                                                : `Max ${criterion.degree}`}
                                                        </p>
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            max={criterion.degree}
                                                            step="0.1"
                                                            value={grades[gradeKey] ?? ''}
                                                            onChange={event =>
                                                                handleGradeChange(
                                                                    activeSegment.id,
                                                                    criterion.id,
                                                                    event.target.value
                                                                )
                                                            }
                                                            className={`h-12 w-full rounded-lg border bg-white px-3 text-sm outline-none transition ${
                                                                errors[gradeKey]
                                                                    ? 'border-red-400 focus:border-red-500'
                                                                    : 'border-gray-300 focus:border-primary'
                                                            }`}
                                                        />
                                                        <p className="mt-2 min-h-4 text-xs text-red-600">
                                                            {errors[gradeKey] || ''}
                                                        </p>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </section>
                                ) : null}
                            </div>
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    );
}
