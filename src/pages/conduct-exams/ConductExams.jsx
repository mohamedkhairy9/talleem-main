import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Loader from '@/components/common/Loader';
import useLocale from '@/utils/hooks/global/useLocale';
import { getLocalizedErrorMessage } from '@/utils/helpers/localizedMessages';
import {
    useConductExamBranchesQuery,
    useConductExamDetailsQuery,
    useConductExamEntitiesQuery,
    useConductExamEvaluationTemplatesQuery,
    useConductExamTodayQuery,
    useStartConductExamMutation
} from '@/api/hooks/useConductExams';
import {
    EXAM_TYPES,
    extractCollection,
    formatTimeRange,
    getLocalizedValue,
    getStatusClasses,
    getStatusLabel,
    normalizeBranchItem,
    normalizeEntityItem,
    normalizeExamDetails,
    normalizeExamItem,
    normalizeTemplateItem,
    resolveTemplateForStudent
} from './helpers';

const getExamTypeLabel = (type, isArabic) => {
    if (type === 'sard') return isArabic ? 'سرد' : 'Sard';
    return isArabic ? 'مقاطع' : 'Maqata3';
};

export default function ConductExams() {
    const navigate = useNavigate();
    const { currentLocale } = useLocale();
    const isArabic = currentLocale === 'ar';

    const [selectedBranchId, setSelectedBranchId] = useState('');
    const [selectedEntityId, setSelectedEntityId] = useState('');
    const [selectedExamId, setSelectedExamId] = useState(null);
    const [selectedExamType, setSelectedExamType] = useState('maqata3');
    const [selectedTemplateId, setSelectedTemplateId] = useState('');
    const [pageError, setPageError] = useState('');

    const branchesQuery = useConductExamBranchesQuery();
    const entitiesQuery = useConductExamEntitiesQuery(
        selectedBranchId ? { branch_id: selectedBranchId } : {}
    );
    const todayQuery = useConductExamTodayQuery();
    const templatesQuery = useConductExamEvaluationTemplatesQuery();
    const examDetailsQuery = useConductExamDetailsQuery(selectedExamId, {
        enabled: !!selectedExamId
    });
    const startMutation = useStartConductExamMutation();

    const branches = useMemo(
        () => extractCollection(branchesQuery.data).map(normalizeBranchItem),
        [branchesQuery.data]
    );
    const entities = useMemo(
        () => extractCollection(entitiesQuery.data).map(normalizeEntityItem),
        [entitiesQuery.data]
    );
    const todayExams = useMemo(
        () => extractCollection(todayQuery.data).map(normalizeExamItem),
        [todayQuery.data]
    );
    const templates = useMemo(
        () => extractCollection(templatesQuery.data).map(normalizeTemplateItem),
        [templatesQuery.data]
    );
    const selectedExamDetails = useMemo(
        () => (examDetailsQuery.data ? normalizeExamDetails(examDetailsQuery.data) : null),
        [examDetailsQuery.data]
    );

    const filteredTodayExams = useMemo(
        () =>
            todayExams.filter(exam => {
                const branchMatches = selectedBranchId
                    ? String(exam.branchId) === String(selectedBranchId)
                    : true;
                const entityMatches = selectedEntityId
                    ? String(exam.entityId) === String(selectedEntityId)
                    : true;
                return branchMatches && entityMatches;
            }),
        [todayExams, selectedBranchId, selectedEntityId]
    );

    useEffect(() => {
        if (
            selectedEntityId &&
            !entities.some(entity => String(entity.id) === String(selectedEntityId))
        ) {
            setSelectedEntityId('');
        }
    }, [entities, selectedEntityId]);

    useEffect(() => {
        if (!filteredTodayExams.length) {
            setSelectedExamId(null);
            return;
        }

        if (
            !selectedExamId ||
            !filteredTodayExams.some(exam => String(exam.id) === String(selectedExamId))
        ) {
            setSelectedExamId(filteredTodayExams[0].id);
        }
    }, [filteredTodayExams, selectedExamId]);

    useEffect(() => {
        if (!templates.length) {
            setSelectedTemplateId('');
            return;
        }

        if (
            !selectedTemplateId ||
            !templates.some(template => String(template.id) === String(selectedTemplateId))
        ) {
            setSelectedTemplateId(String(templates[0].id));
        }
    }, [selectedTemplateId, templates]);

    const selectedTemplate = useMemo(
        () =>
            templates.find(template => String(template.id) === String(selectedTemplateId)) ||
            null,
        [selectedTemplateId, templates]
    );

    const handleViewResult = student => {
        if (!selectedExamId) return;

        navigate(`/conduct-exams/${selectedExamId}/students/${student.id}/result`, {
            state: {
                student,
                exam: selectedExamDetails
            }
        });
    };

    const handleContinueConduct = student => {
        if (!selectedExamId) return;

        const studentTemplate = resolveTemplateForStudent(student, selectedExamDetails, templates);

        navigate(`/conduct-exams/${selectedExamId}/students/${student.id}/conduct`, {
            state: {
                student,
                exam: selectedExamDetails,
                selectedTemplate: studentTemplate,
                startPayload: {
                    exam_type: student.examType || selectedExamType,
                    evaluation_parameter_id:
                        studentTemplate?.id || student.evaluationParameterId || selectedTemplateId
                }
            }
        });
    };

    const handleStartExam = student => {
        if (!selectedExamId) return;

        if (!selectedTemplateId) {
            setPageError(
                isArabic
                    ? 'اختر نموذج التقييم أولًا قبل بدء الامتحان.'
                    : 'Select an evaluation template before starting the exam.'
            );
            return;
        }

        setPageError('');

        startMutation.mutate(
            {
                scheduledExamId: selectedExamId,
                studentId: student.id,
                data: {
                    exam_type: selectedExamType,
                    evaluation_parameter_id: Number(selectedTemplateId)
                }
            },
            {
                onSuccess: response => {
                    navigate(
                        `/conduct-exams/${selectedExamId}/students/${student.id}/conduct`,
                        {
                            state: {
                                student,
                                exam: selectedExamDetails,
                                startData: response,
                                selectedTemplate,
                                startPayload: {
                                    exam_type: selectedExamType,
                                    evaluation_parameter_id: Number(selectedTemplateId)
                                }
                            }
                        }
                    );
                },
                onError: error => {
                    setPageError(
                        getLocalizedErrorMessage(error) ||
                            (isArabic
                                ? 'فشل بدء الامتحان.'
                                : 'Failed to start the exam.')
                    );
                }
            }
        );
    };

    const isInitialLoading =
        branchesQuery.isLoading ||
        entitiesQuery.isLoading ||
        todayQuery.isLoading ||
        templatesQuery.isLoading;

    if (isInitialLoading) {
        return <Loader />;
    }

    return (
        <div className="space-y-6">
            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            {isArabic ? 'إجراء الامتحانات' : 'Conduct Exams'}
                        </h1>
                        <p className="mt-2 max-w-3xl text-sm text-gray-600">
                            {isArabic
                                ? 'اختر الامتحان ثم حدد نوعه ونموذج التقييم، وبعدها ابدأ الامتحان للطالب ليكمل باقي الخطوات.'
                                : 'Choose the exam, select the exam type and evaluation template, then start the student exam and continue the remaining steps.'}
                        </p>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-3">
                        <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
                            <p className="text-xs text-gray-500">
                                {isArabic ? 'الفروع' : 'Branches'}
                            </p>
                            <p className="mt-1 text-xl font-semibold text-gray-900">
                                {branches.length}
                            </p>
                        </div>
                        <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
                            <p className="text-xs text-gray-500">
                                {isArabic ? 'الجهات' : 'Entities'}
                            </p>
                            <p className="mt-1 text-xl font-semibold text-gray-900">
                                {entities.length}
                            </p>
                        </div>
                        <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
                            <p className="text-xs text-gray-500">
                                {isArabic ? 'امتحانات اليوم' : 'Today Exams'}
                            </p>
                            <p className="mt-1 text-xl font-semibold text-gray-900">
                                {filteredTodayExams.length}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                            {isArabic ? 'الفرع' : 'Branch'}
                        </label>
                        <select
                            value={selectedBranchId}
                            onChange={event => setSelectedBranchId(event.target.value)}
                            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-primary"
                        >
                            <option value="">
                                {isArabic ? 'كل الفروع' : 'All branches'}
                            </option>
                            {branches.map(branch => (
                                <option key={branch.id} value={branch.id}>
                                    {branch.displayName}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                            {isArabic ? 'الجهة' : 'Entity'}
                        </label>
                        <select
                            value={selectedEntityId}
                            onChange={event => setSelectedEntityId(event.target.value)}
                            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-primary"
                        >
                            <option value="">
                                {isArabic ? 'كل الجهات' : 'All entities'}
                            </option>
                            {entities.map(entity => (
                                <option key={entity.id} value={entity.id}>
                                    {entity.displayName}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </section>

            <div className="grid gap-6 xl:grid-cols-[0.92fr,1.08fr]">
                <section className="space-y-4">
                    {filteredTodayExams.map(exam => {
                        const isSelected = String(exam.id) === String(selectedExamId);

                        return (
                            <button
                                key={exam.id}
                                type="button"
                                onClick={() => setSelectedExamId(exam.id)}
                                className={`w-full rounded-2xl border p-5 text-start shadow-sm transition ${
                                    isSelected
                                        ? 'border-primary bg-primary/5'
                                        : 'border-gray-200 bg-white hover:border-primary/40'
                                }`}
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-900">
                                            {exam.displayName}
                                        </h2>
                                        <p className="mt-1 text-sm text-gray-500">
                                            {exam.entityName || '-'}
                                        </p>
                                    </div>
                                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                                        {exam.studentsCount} {isArabic ? 'طالب' : 'students'}
                                    </span>
                                </div>

                                <div className="mt-4 grid gap-2 text-sm text-gray-600">
                                    <p>
                                        {isArabic
                                            ? `الفرع: ${exam.branchName || '-'}`
                                            : `Branch: ${exam.branchName || '-'}`}
                                    </p>
                                    <p>
                                        {isArabic
                                            ? `التاريخ: ${exam.examDate || exam.scheduledAt || '-'}`
                                            : `Date: ${exam.examDate || exam.scheduledAt || '-'}`}
                                    </p>
                                    <p>
                                        {isArabic
                                            ? `الوقت: ${formatTimeRange(exam)}`
                                            : `Time: ${formatTimeRange(exam)}`}
                                    </p>
                                </div>
                            </button>
                        );
                    })}

                    {!filteredTodayExams.length ? (
                        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-6 text-sm text-gray-500">
                            {isArabic
                                ? 'لا توجد امتحانات مطابقة للتصفية الحالية.'
                                : 'No exams match the current filters.'}
                        </div>
                    ) : null}
                </section>

                <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">
                    {!selectedExamId ? (
                        <div className="p-6 text-sm text-gray-500">
                            {isArabic
                                ? 'اختر امتحانًا من القائمة لعرض التفاصيل والطلاب.'
                                : 'Select an exam from the list to view its details and students.'}
                        </div>
                    ) : null}

                    {selectedExamId && examDetailsQuery.isLoading ? (
                        <div className="p-6">
                            <Loader />
                        </div>
                    ) : null}

                    {selectedExamId && selectedExamDetails ? (
                        <div className="space-y-6 p-6">
                            {pageError ? (
                                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                    {pageError}
                                </div>
                            ) : null}

                            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
                                <h2 className="text-xl font-semibold text-gray-900">
                                    {selectedExamDetails.displayName}
                                </h2>
                                <div className="mt-4 grid gap-3 text-sm text-gray-600 md:grid-cols-2">
                                    <p>
                                        {isArabic
                                            ? `الجهة: ${selectedExamDetails.entityName || '-'}`
                                            : `Entity: ${selectedExamDetails.entityName || '-'}`}
                                    </p>
                                    <p>
                                        {isArabic
                                            ? `الفرع: ${selectedExamDetails.branchName || '-'}`
                                            : `Branch: ${selectedExamDetails.branchName || '-'}`}
                                    </p>
                                    <p>
                                        {isArabic
                                            ? `التاريخ: ${selectedExamDetails.examDate || '-'}`
                                            : `Date: ${selectedExamDetails.examDate || '-'}`}
                                    </p>
                                    <p>
                                        {isArabic
                                            ? `الوقت: ${formatTimeRange(selectedExamDetails)}`
                                            : `Time: ${formatTimeRange(selectedExamDetails)}`}
                                    </p>
                                </div>
                            </div>

                            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                                {isArabic
                                    ? 'اختر نوع الامتحان ونموذج التقييم أولًا، ثم ابدأ الامتحان للطالب من الجدول.'
                                    : 'Select the exam type and evaluation template first, then start the student exam from the table.'}
                            </div>

                            <div className="grid gap-6 lg:grid-cols-2">
                                <div>
                                    <h3 className="mb-3 text-lg font-semibold text-gray-900">
                                        {isArabic ? 'نوع الامتحان' : 'Exam Type'}
                                    </h3>
                                    <div className="flex flex-wrap gap-3">
                                        {EXAM_TYPES.map(type => {
                                            const isSelected = selectedExamType === type;

                                            return (
                                                <button
                                                    key={type}
                                                    type="button"
                                                    onClick={() => setSelectedExamType(type)}
                                                    className={`min-w-[140px] rounded-2xl border px-6 py-4 text-base font-semibold transition ${
                                                        isSelected
                                                            ? 'border-primary bg-primary/10 text-primary'
                                                            : 'border-gray-200 bg-white text-gray-700 hover:border-primary/40'
                                                    }`}
                                                >
                                                    {getExamTypeLabel(type, isArabic)}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="mb-3 text-lg font-semibold text-gray-900">
                                        {isArabic ? 'نموذج التقييم' : 'Evaluation Template'}
                                    </h3>
                                    <div className="grid gap-3 md:grid-cols-2">
                                        {templates.map(template => {
                                            const isSelected =
                                                String(template.id) === String(selectedTemplateId);

                                            return (
                                                <button
                                                    key={template.id}
                                                    type="button"
                                                    onClick={() =>
                                                        setSelectedTemplateId(String(template.id))
                                                    }
                                                    className={`rounded-2xl border p-4 text-start transition ${
                                                        isSelected
                                                            ? 'border-primary bg-primary/10'
                                                            : 'border-gray-200 bg-white hover:border-primary/40'
                                                    }`}
                                                >
                                                    <p className="text-sm font-semibold text-gray-900">
                                                        {template.displayName}
                                                    </p>
                                                    <div className="mt-2 space-y-1 text-xs text-gray-500">
                                                        <p>
                                                            {isArabic
                                                                ? `نظام التقييم: ${template.evaluationSystem || '-'}`
                                                                : `Evaluation System: ${template.evaluationSystem || '-'}`}
                                                        </p>
                                                        <p>
                                                            {isArabic
                                                                ? `إجمالي الدرجة: ${template.totalGrade ?? '-'}`
                                                                : `Total Grade: ${template.totalGrade ?? '-'}`}
                                                        </p>
                                                        <p>
                                                            {isArabic
                                                                ? `المعيار: ${template.criteria.length}`
                                                                : `Criteria: ${template.criteria.length}`}
                                                        </p>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <div className="mb-4 flex items-center justify-between">
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        {isArabic ? 'الطلاب' : 'Students'}
                                    </h3>
                                    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                                        {selectedExamDetails.students.length}{' '}
                                        {isArabic ? 'طالب' : 'students'}
                                    </span>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-4 py-3 text-start text-xs font-semibold uppercase tracking-wide text-gray-500">
                                                    {isArabic ? 'الطالب' : 'Student'}
                                                </th>
                                                <th className="px-4 py-3 text-start text-xs font-semibold uppercase tracking-wide text-gray-500">
                                                    {isArabic ? 'أرقام الأجزاء' : 'Juz Numbers'}
                                                </th>
                                                <th className="px-4 py-3 text-start text-xs font-semibold uppercase tracking-wide text-gray-500">
                                                    {isArabic ? 'حالة الامتحان' : 'Exam Status'}
                                                </th>
                                                <th className="px-4 py-3 text-start text-xs font-semibold uppercase tracking-wide text-gray-500">
                                                    {isArabic ? 'الإجراءات' : 'Actions'}
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100 bg-white">
                                            {selectedExamDetails.students.map(student => (
                                                <tr key={student.id}>
                                                    <td className="px-4 py-4 text-sm font-medium text-gray-900">
                                                        {student.displayName || '-'}
                                                    </td>
                                                    <td className="px-4 py-4 text-sm text-gray-600">
                                                        {student.juzNumbers?.length
                                                            ? student.juzNumbers.join(', ')
                                                            : '-'}
                                                    </td>
                                                    <td className="px-4 py-4 text-sm">
                                                        <span
                                                            className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClasses(
                                                                student.statusKey
                                                            )}`}
                                                        >
                                                            {student.statusLabel ||
                                                                getStatusLabel(
                                                                    student.statusKey,
                                                                    currentLocale
                                                                )}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <div className="flex flex-wrap gap-2">
                                                            {student.statusKey === 'submitted' ? (
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        handleViewResult(student)
                                                                    }
                                                                    className="rounded-lg border border-gray-200 bg-[#eef8f8] px-3 py-2 text-xs font-semibold text-[#4f8e8e] transition hover:bg-[#e4f3f3]"
                                                                >
                                                                    {isArabic
                                                                        ? 'عرض النتيجة'
                                                                        : 'View Result'}
                                                                </button>
                                                            ) : (
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        student.statusKey ===
                                                                        'started'
                                                                            ? handleContinueConduct(
                                                                                  student
                                                                              )
                                                                            : handleStartExam(
                                                                                  student
                                                                              )
                                                                    }
                                                                    disabled={
                                                                        startMutation.isPending &&
                                                                        String(student.id) ===
                                                                            String(
                                                                                startMutation
                                                                                    .variables
                                                                                    ?.studentId
                                                                            )
                                                                    }
                                                                    className="rounded-lg border border-gray-200 bg-[#eef8f8] px-3 py-2 text-xs font-semibold text-[#4f8e8e] transition hover:bg-[#e4f3f3] disabled:cursor-not-allowed disabled:opacity-70"
                                                                >
                                                                    {isArabic
                                                                        ? 'بدء الامتحان'
                                                                        : 'Start Exam'}
                                                                </button>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    ) : null}
                </section>
            </div>
        </div>
    );
}
