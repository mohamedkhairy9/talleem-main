import React, { useMemo } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Loader from '@/components/common/Loader';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import useLocale from '@/utils/hooks/global/useLocale';
import { useConductExamStudentResultQuery } from '@/api/hooks/useConductExams';
import { formatTimeRange, normalizeResultDetails } from './helpers';

function ConductExamResultContent() {
    const navigate = useNavigate();
    const location = useLocation();
    const { scheduledExamId, studentId } = useParams();
    const { currentLocale } = useLocale();
    const isArabic = currentLocale === 'ar';

    const resultQuery = useConductExamStudentResultQuery(scheduledExamId, studentId, {
        enabled: !!scheduledExamId && !!studentId && !location.state?.resultData
    });

    const result = useMemo(
        () => {
            const source = location.state?.resultData || resultQuery.data;
            return source ? normalizeResultDetails(source) : null;
        },
        [location.state?.resultData, resultQuery.data]
    );

    const handleBack = () => navigate('/conduct-exams');

    if (resultQuery.isLoading && !location.state?.resultData) {
        return <Loader />;
    }

    if (resultQuery.hasError || !result) {
        return (
            <div className="space-y-6">
                <section className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700 shadow-sm">
                    <h1 className="text-xl font-semibold">
                        {isArabic ? 'تعذر تحميل النتيجة' : 'Unable to load result'}
                    </h1>
                    <p className="mt-2 text-sm">
                        {resultQuery.errorMessage ||
                            (isArabic
                                ? 'لا يمكن عرض نتيجة هذا الامتحان الآن.'
                                : 'This exam result cannot be displayed right now.')}
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
                            {isArabic ? 'نتيجة الامتحان' : 'Exam Result'}
                        </h1>
                        <p className="mt-2 text-sm text-gray-600">
                            {isArabic
                                ? 'راجع الدرجات النهائية والتفصيلية للطالب.'
                                : 'Review the final and detailed grades for the student.'}
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

            <div className="grid gap-6 lg:grid-cols-[0.9fr,1.1fr]">
                <section className="space-y-6">
                    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                        <h2 className="text-lg font-semibold text-gray-900">
                            {isArabic ? 'ملخص النتيجة' : 'Result Summary'}
                        </h2>
                        <div className="mt-4 space-y-3 text-sm text-gray-700">
                            <p>
                                <span className="font-semibold text-gray-900">
                                    {isArabic ? 'الطالب:' : 'Student:'}
                                </span>{' '}
                                {result.studentName || '-'}
                            </p>
                            <p>
                                <span className="font-semibold text-gray-900">
                                    {isArabic ? 'نوع الامتحان:' : 'Exam Type:'}
                                </span>{' '}
                                {result.examType === 'sard'
                                    ? isArabic
                                        ? 'سرد'
                                        : 'Sard'
                                    : isArabic
                                    ? 'مقاطع'
                                    : 'Maqata3'}
                            </p>
                            <p>
                                <span className="font-semibold text-gray-900">
                                    {isArabic ? 'النتيجة النهائية:' : 'Final Grade:'}
                                </span>{' '}
                                {result.finalGrade}
                            </p>
                            <p>
                                <span className="font-semibold text-gray-900">
                                    {isArabic ? 'الحالة:' : 'Status:'}
                                </span>{' '}
                                {result.status || '-'}
                            </p>
                            <p>
                                <span className="font-semibold text-gray-900">
                                    {isArabic ? 'تم التقييم بواسطة:' : 'Conducted By:'}
                                </span>{' '}
                                {result.conductedBy || '-'}
                            </p>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                        <h2 className="text-lg font-semibold text-gray-900">
                            {isArabic ? 'بيانات الموعد' : 'Schedule Details'}
                        </h2>
                        <div className="mt-4 space-y-3 text-sm text-gray-700">
                            <p>
                                <span className="font-semibold text-gray-900">
                                    {isArabic ? 'التاريخ:' : 'Date:'}
                                </span>{' '}
                                {result.scheduledExamDate || '-'}
                            </p>
                            <p>
                                <span className="font-semibold text-gray-900">
                                    {isArabic ? 'الوقت:' : 'Time:'}
                                </span>{' '}
                                {formatTimeRange({
                                    timeFrom: result.scheduledExam?.time_from,
                                    timeTo: result.scheduledExam?.time_to
                                })}
                            </p>
                            <p>
                                <span className="font-semibold text-gray-900">
                                    {isArabic ? 'المقطع:' : 'Segment:'}
                                </span>{' '}
                                {result.scheduledExam?.exam_segment?.name?.ar ||
                                    result.scheduledExam?.exam_segment?.name?.en ||
                                    '-'}
                            </p>
                        </div>
                    </div>
                </section>

                <section className="space-y-6">
                    {result.segments.map(segment => (
                        <div
                            key={segment.id}
                            className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
                        >
                            <div className="flex flex-col gap-3 border-b border-gray-100 pb-4 md:flex-row md:items-start md:justify-between">
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900">
                                        {isArabic
                                            ? `المقطع ${segment.order}`
                                            : `Segment ${segment.order}`}
                                    </h2>
                                    <p className="mt-1 text-sm text-gray-500">
                                        {isArabic
                                            ? `الجزء ${segment.juzNumber}`
                                            : `Juz ${segment.juzNumber}`}
                                    </p>
                                </div>

                                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                                    {isArabic
                                        ? `المجموع ${segment.columnTotal}`
                                        : `Total ${segment.columnTotal}`}
                                </span>
                            </div>

                            <div className="mt-4 grid gap-4 md:grid-cols-2">
                                {segment.grades.map(grade => (
                                    <div
                                        key={grade.id}
                                        className="rounded-xl border border-gray-200 bg-gray-50 p-4"
                                    >
                                        <p className="text-sm font-semibold text-gray-900">
                                            {grade.criteriaName || '-'}
                                        </p>
                                        <p className="mt-1 text-xs text-gray-500">
                                            {isArabic
                                                ? `الحد الأقصى ${grade.maxDegree}`
                                                : `Max ${grade.maxDegree}`}
                                        </p>
                                        <p className="mt-3 text-lg font-bold text-primary">
                                            {grade.grade}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}

                    {!result.segments.length ? (
                        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-6 text-sm text-gray-500 shadow-sm">
                            {isArabic
                                ? 'لا توجد تفاصيل درجات متاحة لهذه النتيجة.'
                                : 'No segment grade details are available for this result.'}
                        </div>
                    ) : null}
                </section>
            </div>
        </div>
    );
}

export default function ConductExamResult() {
    return (
        <ErrorBoundary>
            <ConductExamResultContent />
        </ErrorBoundary>
    );
}
