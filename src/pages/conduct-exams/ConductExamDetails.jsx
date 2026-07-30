import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Loader from '@/components/common/Loader';
import useLocale from '@/utils/hooks/global/useLocale';
import { getLocalizedErrorMessage } from '@/utils/helpers/localizedMessages';
import {
    useConductExamDetailsQuery,
    useConductExamEvaluationTemplatesQuery,
    useSetConductExamModelMutation,
    useStartConductExamMutation
} from '@/api/hooks/useConductExams';
import {
    extractCollection,
    formatTimeRange,
    getStatusClasses,
    getStatusLabel,
    normalizeExamDetails,
    normalizeTemplateItem,
    EXAM_TYPES
} from './helpers';
import {
    getExamEarlyStartMinutes,
    getExamStartAvailability
} from './examTiming';
import { useConfigurationsQuery } from '@/api/hooks/useConfigurations';

const Info = ({ label, value }) => (
    <div>
        <p className="text-xs font-medium text-gray-500">{label}</p>
        <p className="mt-1 text-sm font-semibold text-gray-900">{value || '-'}</p>
    </div>
);

export default function ConductExamDetails() {
    const navigate = useNavigate();
    const { scheduledExamId } = useParams();
    const { currentLocale } = useLocale();
    const isArabic = currentLocale === 'ar';
    const [pageError, setPageError] = useState('');
    const [now, setNow] = useState(() => new Date());
    const [examModel, setExamModel] = useState({
        exam_type: 'maqata3',
        evaluation_parameter_id: ''
    });

    const detailsQuery = useConductExamDetailsQuery(scheduledExamId, {
        enabled: Boolean(scheduledExamId)
    });
    const templatesQuery = useConductExamEvaluationTemplatesQuery();
    const configurationsQuery = useConfigurationsQuery('tahfiz');
    const startMutation = useStartConductExamMutation();
    const setExamModelMutation = useSetConductExamModelMutation();
    const exam = useMemo(
        () => (detailsQuery.data ? normalizeExamDetails(detailsQuery.data) : null),
        [detailsQuery.data]
    );
    const templates = useMemo(
        () => extractCollection(templatesQuery.data).map(normalizeTemplateItem),
        [templatesQuery.data]
    );
    const earlyStartMinutes = useMemo(
        () => getExamEarlyStartMinutes(configurationsQuery.data),
        [configurationsQuery.data]
    );
    const startAvailability = useMemo(
        () => getExamStartAvailability(exam, now, earlyStartMinutes),
        [exam, now, earlyStartMinutes]
    );
    const startAvailabilityMessage = useMemo(() => {
        if (startAvailability.isAvailable) {
            return isArabic ? 'الامتحان متاح الآن ويمكن بدء تقييم الطلاب.' : 'The exam is currently available for student evaluation.';
        }
        if (startAvailability.reason === 'not_started') {
            if (startAvailability.earlyStartMinutes > 0) {
                return isArabic
                    ? `يمكن بدء الامتحان قبل موعده بـ ${startAvailability.earlyStartMinutes} دقيقة. لم يبدأ وقت الإتاحة بعد.`
                    : `The exam can start ${startAvailability.earlyStartMinutes} minutes early. The start window has not opened yet.`;
            }
            return isArabic ? 'لا يمكن بدء الامتحان قبل موعد بدايته.' : 'The exam cannot be started before its scheduled time.';
        }
        return isArabic ? 'انتهى وقت الامتحان، ولا يمكن بدء تقييم جديد.' : 'The exam time has ended, so a new evaluation cannot be started.';
    }, [
        isArabic,
        startAvailability.earlyStartMinutes,
        startAvailability.isAvailable,
        startAvailability.reason
    ]);
    const isExamEnded = startAvailability.reason === 'ended';
    const savedExamType = exam?.examType;
    const savedEvaluationParameterId = exam?.evaluationParameterId;
    const hasSavedExamModel = Boolean(
        exam?.evaluationParameterId && exam?.examType
    );
    const hasStartedStudents = exam?.students?.some(
        student => student.statusKey === 'started' || student.statusKey === 'submitted'
    );
    const selectedExamTemplate = useMemo(
        () =>
            templates.find(
                template =>
                    String(template.id) === String(exam?.evaluationParameterId)
            ) || null,
        [exam?.evaluationParameterId, templates]
    );
    const examModelRequiredMessage = isArabic
        ? 'اختر نموذج الاختبار العام واحفظه قبل بدء تقييم الطلاب.'
        : 'Select and save the general exam model before starting student evaluations.';

    useEffect(() => {
        const timer = window.setInterval(() => setNow(new Date()), 30_000);
        return () => window.clearInterval(timer);
    }, []);

    useEffect(() => {
        setExamModel({
            exam_type: savedExamType || 'maqata3',
            evaluation_parameter_id: savedEvaluationParameterId
                ? String(savedEvaluationParameterId)
                : ''
        });
    }, [savedExamType, savedEvaluationParameterId]);

    const handleSaveExamModel = () => {
        if (!examModel.evaluation_parameter_id || hasStartedStudents) return;

        setPageError('');
        setExamModelMutation.mutate(
            {
                scheduledExamId,
                data: {
                    exam_type: examModel.exam_type,
                    evaluation_parameter_id: Number(
                        examModel.evaluation_parameter_id
                    )
                }
            },
            {
                onError: error => {
                    setPageError(
                        getLocalizedErrorMessage(error) ||
                            (isArabic
                                ? 'تعذر حفظ نموذج الاختبار. حاول مرة أخرى.'
                                : 'Unable to save the exam model. Please try again.')
                    );
                }
            }
        );
    };

    const handleStart = student => {
        if (!student) return;
        if (!startAvailability.isAvailable) {
            setPageError(startAvailabilityMessage);
            return;
        }
        if (!hasSavedExamModel) {
            setPageError(examModelRequiredMessage);
            return;
        }
        setPageError('');
        startMutation.mutate(
            { scheduledExamId, studentId: student.id, data: {} },
            {
                onSuccess: response => {
                    const startData = response?.data?.data || response?.data || response;

                    navigate(
                        `/conduct-exams/${scheduledExamId}/students/${student.id}/conduct`,
                        {
                            state: {
                                student,
                                exam,
                                startData,
                                selectedTemplate: selectedExamTemplate,
                                startPayload: {
                                    exam_type: exam.examType,
                                    evaluation_parameter_id:
                                        exam.evaluationParameterId
                                }
                            }
                        }
                    );
                },
                onError: error => {
                    const rawMessage = String(
                        error?.rawMessage || error?.data?.message || error?.message || ''
                    ).toLowerCase();
                    const isCompletedExam = error?.status === 409 && rawMessage.includes('already completed');

                    if (isCompletedExam) {
                        navigate(`/conduct-exams/${scheduledExamId}/students/${student.id}/result`, {
                            state: { student, exam }
                        });
                        return;
                    }

                    setPageError(
                        getLocalizedErrorMessage(error) ||
                        (isArabic ? 'فشل بدء الامتحان. حاول مرة أخرى.' : 'Failed to start the exam. Please try again.')
                    );
                }
            }
        );
    };

    if (detailsQuery.isLoading || templatesQuery.isLoading) return <Loader />;

    if (detailsQuery.hasError || !exam) {
        return (
            <div className="space-y-5 rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
                <div>
                    <h1 className="text-xl font-bold">{isArabic ? 'تعذر تحميل تفاصيل الامتحان' : 'Unable to load exam details'}</h1>
                    <p className="mt-2 text-sm">{detailsQuery.errorMessage || (isArabic ? 'الامتحان غير متاح حاليًا.' : 'This exam is unavailable right now.')}</p>
                </div>
                <button type="button" onClick={() => navigate('/conduct-exams')} className="w-fit rounded-lg border border-red-300 px-4 py-2 text-sm font-semibold">
                    {isArabic ? 'العودة للقائمة' : 'Back to list'}
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="relative flex flex-col gap-4 overflow-hidden rounded-3xl bg-gradient-to-l from-primary via-primary to-sky-600 p-7 text-white shadow-lg md:flex-row md:items-start md:justify-between">
                <div className="absolute -end-12 -top-16 h-48 w-48 rounded-full bg-white/10" />
                <div className="relative">
                    <button type="button" onClick={() => navigate('/conduct-exams')} className="mb-3 text-sm font-semibold text-white/85 hover:text-white">
                        {isArabic ? '→ العودة لإجراء الامتحانات' : '← Back to Conduct Exams'}
                    </button>
                    <h1 className="text-2xl font-bold">{isArabic ? 'تفاصيل إجراء الامتحان' : 'Exam Conduction Details'}</h1>
                    <p className="mt-2 text-sm text-white/85">
                        {isArabic ? 'راجع بيانات الامتحان ثم ابدأ تقييم الطالب.' : 'Review the exam data, then start evaluating a student.'}
                    </p>
                </div>
                <span className="relative rounded-full border border-white/30 bg-white/15 px-3 py-1 text-sm font-semibold text-white">
                    {exam.students.length} {isArabic ? 'طالب' : 'students'}
                </span>
            </div>

            {pageError ? <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{pageError}</div> : null}

            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900">{isArabic ? 'بيانات الموعد' : 'Schedule Details'}</h2>
                <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    <Info label={isArabic ? 'الجهة' : 'Entity'} value={exam.entityName} />
                    <Info label={isArabic ? 'الفرع' : 'Branch'} value={exam.branchName} />
                    <Info label={isArabic ? 'التاريخ' : 'Date'} value={exam.examDate} />
                    <Info label={isArabic ? 'الوقت' : 'Time'} value={formatTimeRange(exam)} />
                    {earlyStartMinutes > 0 ? (
                        <Info
                            label={isArabic ? 'متاح للبدء قبل' : 'Early start access'}
                            value={isArabic ? `${earlyStartMinutes} دقيقة` : `${earlyStartMinutes} minutes`}
                        />
                    ) : null}
                    <Info label={isArabic ? 'المكان' : 'Location'} value={exam.location} />
                    <Info label={isArabic ? 'طريقة التقديم' : 'Method'} value={exam.method} />
                    <Info label={isArabic ? 'المسؤول' : 'Responsible'} value={exam.responsible} />
                </div>
            </section>

            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">
                            {isArabic ? 'نموذج الاختبار العام' : 'General Exam Model'}
                        </h2>
                        <p className="mt-1 text-sm text-gray-500">
                            {isArabic
                                ? 'يُختار مرة واحدة ويُطبّق تلقائيًا على جميع الطلاب في هذا الامتحان.'
                                : 'Select it once and it will be applied automatically to every student in this exam.'}
                        </p>
                    </div>
                    {hasSavedExamModel ? (
                        <span className="w-fit rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                            {isArabic ? 'تم حفظ النموذج' : 'Model saved'}
                        </span>
                    ) : null}
                </div>

                {hasStartedStudents ? (
                    <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                        {isArabic
                            ? 'لا يمكن تغيير نموذج الاختبار بعد بدء تقييم أحد الطلاب.'
                            : 'The exam model cannot be changed after a student evaluation has started.'}
                    </div>
                ) : null}

                <div className="mt-5 grid gap-5 lg:grid-cols-2">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            {isArabic ? 'طريقة التسميع' : 'Listening Method'}
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            {EXAM_TYPES.map(type => {
                                const isSelected = examModel.exam_type === type;

                                return (
                                    <button
                                        key={type}
                                        type="button"
                                        disabled={hasStartedStudents}
                                        onClick={() =>
                                            setExamModel(current => ({
                                                ...current,
                                                exam_type: type
                                            }))
                                        }
                                        className={`rounded-xl border px-4 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${
                                            isSelected
                                                ? 'border-primary bg-primary/5 text-primary'
                                                : 'border-gray-200 bg-white text-gray-700 hover:border-primary/40'
                                        }`}
                                    >
                                        {type === 'maqata3'
                                            ? isArabic
                                                ? 'مقاطع'
                                                : 'Maqata3'
                                            : isArabic
                                            ? 'سرد'
                                            : 'Sard'}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            {isArabic ? 'نموذج التقييم' : 'Evaluation Template'}
                        </label>
                        <select
                            value={examModel.evaluation_parameter_id}
                            disabled={hasStartedStudents}
                            onChange={event =>
                                setExamModel(current => ({
                                    ...current,
                                    evaluation_parameter_id: event.target.value
                                }))
                            }
                            className="w-full rounded-lg border border-gray-300 px-3 py-3 outline-none focus:border-primary disabled:cursor-not-allowed disabled:bg-gray-100"
                        >
                            <option value="">
                                {isArabic
                                    ? 'اختر نموذج التقييم'
                                    : 'Select evaluation template'}
                            </option>
                            {templates.map(template => (
                                <option key={template.id} value={template.id}>
                                    {template.displayName || template.display_name}
                                </option>
                            ))}
                        </select>
                        {hasSavedExamModel && selectedExamTemplate ? (
                            <p className="text-xs text-emerald-700">
                                {isArabic
                                    ? `النموذج المطبق: ${selectedExamTemplate.displayName}`
                                    : `Applied model: ${selectedExamTemplate.displayName}`}
                            </p>
                        ) : null}
                    </div>
                </div>

                <div className="mt-5 flex justify-end">
                    <button
                        type="button"
                        onClick={handleSaveExamModel}
                        disabled={
                            hasStartedStudents ||
                            !examModel.evaluation_parameter_id ||
                            setExamModelMutation.isPending
                        }
                        className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {setExamModelMutation.isPending
                            ? isArabic
                                ? 'جارٍ الحفظ...'
                                : 'Saving...'
                            : hasSavedExamModel
                            ? isArabic
                                ? 'تحديث النموذج'
                                : 'Update Model'
                            : isArabic
                            ? 'حفظ نموذج الاختبار'
                            : 'Save Exam Model'}
                    </button>
                </div>
            </section>

            <section className={`rounded-2xl border p-4 text-sm ${startAvailability.isAvailable ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-amber-200 bg-amber-50 text-amber-800'}`}>
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <p className="font-semibold">{startAvailabilityMessage}</p>
                    <p className="text-xs opacity-80">{isArabic ? `النطاق: ${formatTimeRange(exam)}` : `Window: ${formatTimeRange(exam)}`}</p>
                </div>
            </section>

            <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                <div className="border-b border-gray-200 px-6 py-4">
                    <h2 className="text-lg font-semibold text-gray-900">{isArabic ? 'الطلاب' : 'Students'}</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[720px] table-fixed text-center text-sm">
                        <thead className="bg-gray-50 text-gray-600">
                            <tr>
                                <th className="px-6 py-3 font-medium">{isArabic ? 'الطالب' : 'Student'}</th>
                                <th className="px-6 py-3 font-medium">{isArabic ? 'الأجزاء' : 'Juz Numbers'}</th>
                                <th className="px-6 py-3 font-medium">{isArabic ? 'الحالة' : 'Status'}</th>
                                <th className="px-6 py-3 font-medium">{isArabic ? 'الإجراءات' : 'Actions'}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {exam.students.map(student => {
                                const canStartStudent =
                                    student.statusKey !== 'submitted' &&
                                    startAvailability.isAvailable &&
                                    hasSavedExamModel &&
                                    !startMutation.isPending;
                                const canViewResult = student.statusKey === 'submitted';
                                const actionLabel = canViewResult
                                    ? (isArabic ? 'عرض الدرجات' : 'View Grades')
                                    : student.statusKey === 'started'
                                    ? (isExamEnded
                                        ? (isArabic ? 'لم تُرسل الدرجات' : 'Grades not submitted')
                                        : (isArabic ? 'بدء الامتحان' : 'Start Exam'))
                                    : student.statusKey === 'submitted'
                                    ? (isArabic ? 'تظهر الدرجات بعد انتهاء الموعد' : 'Grades appear after the exam ends')
                                    : (isArabic ? 'بدء الامتحان' : 'Start Exam');
                                const actionTitle = canStartStudent || canViewResult
                                    ? undefined
                                    : !hasSavedExamModel
                                    ? examModelRequiredMessage
                                    : student.statusKey === 'not_started'
                                    ? startAvailabilityMessage
                                    : actionLabel;

                                return (
                                <tr key={student.id}>
                                    <td className="px-6 py-4 font-medium text-gray-900">{student.displayName || '-'}</td>
                                    <td className="px-6 py-4 text-gray-600">{student.juzNumbers?.join(', ') || '-'}</td>
                                    <td className="px-6 py-4">
                                        <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClasses(student.statusKey)}`}>
                                            {getStatusLabel(student.statusKey, currentLocale)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            type="button"
                                            disabled={!canStartStudent && !canViewResult}
                                            title={actionTitle}
                                            onClick={() => {
                                                if (canViewResult) {
                                                    navigate(`/conduct-exams/${scheduledExamId}/students/${student.id}/result`);
                                                } else if (canStartStudent) {
                                                    handleStart(student);
                                                }
                                            }}
                                            className={`rounded-lg px-3 py-2 text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-40 ${
                                                canViewResult
                                                    ? 'border border-primary text-primary'
                                                    : 'bg-primary text-white'
                                            }`}
                                        >
                                            {actionLabel}
                                        </button>
                                    </td>
                                </tr>
                                );
                            })}
                            {!exam.students.length ? <tr><td colSpan="4" className="px-6 py-8 text-center text-gray-500">{isArabic ? 'لا يوجد طلاب مسجلون لهذا الامتحان.' : 'No students are assigned to this exam.'}</td></tr> : null}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}
