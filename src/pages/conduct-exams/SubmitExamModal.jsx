import React, { useEffect, useMemo, useState } from 'react';
import Modal from '@/components/common/form/Modal';
import ModalContent from '@/components/common/form/ModalContent';
import ModalFooter from '@/components/common/form/ModalFooter';
import useLocale from '@/utils/hooks/global/useLocale';

const getGradeKey = (segmentId, criteriaId) => `${segmentId}:${criteriaId}`;

export default function SubmitExamModal({
    student,
    segments = [],
    templates = [],
    initialTemplateId = '',
    isPending,
    errorMessage,
    onClose,
    onSubmit
}) {
    const { currentLocale } = useLocale();
    const [selectedTemplateId, setSelectedTemplateId] = useState(
        initialTemplateId || templates[0]?.id || ''
    );
    const [grades, setGrades] = useState({});
    const [validationError, setValidationError] = useState('');

    useEffect(() => {
        setSelectedTemplateId(initialTemplateId || templates[0]?.id || '');
    }, [initialTemplateId, templates]);

    const selectedTemplate = useMemo(
        () =>
            templates.find(
                template => String(template.id) === String(selectedTemplateId)
            ) || null,
        [selectedTemplateId, templates]
    );

    const criteria = selectedTemplate?.criteria || [];

    const handleGradeChange = (segmentId, criteriaId, value) => {
        setGrades(prev => ({
            ...prev,
            [getGradeKey(segmentId, criteriaId)]: value
        }));
    };

    const handleSubmit = e => {
        e.preventDefault();
        setValidationError('');

        if (!selectedTemplate || !criteria.length) {
            setValidationError(
                currentLocale === 'ar'
                    ? 'اختر نموذج تقييم يحتوي على معايير.'
                    : 'Select an evaluation template that has criteria.'
            );
            return;
        }

        if (!segments.length) {
            setValidationError(
                currentLocale === 'ar'
                    ? 'لا توجد مقاطع متاحة لتسليم الامتحان.'
                    : 'No segments are available to submit the exam.'
            );
            return;
        }

        const payloadSegments = [];

        for (const segment of segments) {
            const gradesPayload = [];

            for (const criterion of criteria) {
                const rawValue = grades[getGradeKey(segment.id, criterion.id)];

                if (rawValue === '' || rawValue === undefined) {
                    setValidationError(
                        currentLocale === 'ar'
                            ? 'أدخل جميع الدرجات المطلوبة قبل التسليم.'
                            : 'Enter all required grades before submitting.'
                    );
                    return;
                }

                const grade = Number(rawValue);

                if (Number.isNaN(grade) || grade < 0 || grade > Number(criterion.degree)) {
                    setValidationError(
                        currentLocale === 'ar'
                            ? 'تأكد أن كل درجة رقمية وتقع داخل الحد المسموح.'
                            : 'Make sure each grade is numeric and within the allowed maximum.'
                    );
                    return;
                }

                gradesPayload.push({
                    criteria_id: criterion.id,
                    grade
                });
            }

            payloadSegments.push({
                segment_id: segment.id,
                grades: gradesPayload
            });
        }

        onSubmit({
            segments: payloadSegments
        });
    };

    return (
        <Modal onClose={onClose} size="3xl">
            <form onSubmit={handleSubmit} className="flex h-full flex-col">
                <div className="flex items-center justify-between border-b border-gray-300 p-5">
                    <h2 className="text-xl font-semibold text-primary">
                        {currentLocale === 'ar'
                            ? 'تسليم الامتحان'
                            : 'Submit Exam'}
                    </h2>
                    <button
                        type="button"
                        onClick={() => onClose(false)}
                        className="text-4xl leading-none text-destructive duration-200 hover:text-red-600"
                    >
                        ×
                    </button>
                </div>

                <ModalContent className="space-y-5">
                    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                        <p className="text-sm text-gray-500">
                            {currentLocale === 'ar' ? 'الطالب' : 'Student'}
                        </p>
                        <p className="mt-1 text-lg font-semibold text-gray-900">
                            {student?.display_name || '-'}
                        </p>
                    </div>

                    {(errorMessage || validationError) && (
                        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                            {validationError || errorMessage}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            {currentLocale === 'ar'
                                ? 'نموذج التقييم'
                                : 'Evaluation Template'}
                        </label>
                        <select
                            value={selectedTemplateId}
                            onChange={e => setSelectedTemplateId(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-3 py-3 outline-none focus:border-accent"
                        >
                            <option value="">
                                {currentLocale === 'ar'
                                    ? 'اختر نموذج التقييم'
                                    : 'Select evaluation template'}
                            </option>
                            {templates.map(template => (
                                <option key={template.id} value={template.id}>
                                    {template.display_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {selectedTemplate && (
                        <div className="rounded-2xl border border-gray-200 bg-white p-4">
                            <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                                <span>
                                    {currentLocale === 'ar'
                                        ? `الدرجة الكلية: ${selectedTemplate.total_grade ?? '-'}`
                                        : `Total Grade: ${selectedTemplate.total_grade ?? '-'}`}
                                </span>
                                <span>
                                    {currentLocale === 'ar'
                                        ? `درجة النجاح: ${selectedTemplate.passing_grade ?? '-'}`
                                        : `Passing Grade: ${selectedTemplate.passing_grade ?? '-'}`}
                                </span>
                            </div>
                        </div>
                    )}

                    <div className="space-y-4">
                        {segments.map((segment, index) => (
                            <div
                                key={segment.id}
                                className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
                            >
                                <div className="mb-4">
                                    <h3 className="text-base font-semibold text-gray-900">
                                        {segment.display_name ||
                                            (currentLocale === 'ar'
                                                ? `المقطع ${index + 1}`
                                                : `Segment ${index + 1}`)}
                                    </h3>
                                    {segment.description && (
                                        <p className="mt-1 text-sm text-gray-500">
                                            {segment.description}
                                        </p>
                                    )}
                                </div>

                                <div className="grid gap-4 md:grid-cols-2">
                                    {criteria.map(criterion => (
                                        <div
                                            key={criterion.id}
                                            className="space-y-2 rounded-xl border border-gray-100 bg-gray-50 p-3"
                                        >
                                            <label className="block text-sm font-medium text-gray-700">
                                                {criterion.display_name}
                                            </label>
                                            <input
                                                type="number"
                                                min="0"
                                                max={criterion.degree}
                                                step="0.1"
                                                value={
                                                    grades[
                                                        getGradeKey(
                                                            segment.id,
                                                            criterion.id
                                                        )
                                                    ] ?? ''
                                                }
                                                onChange={e =>
                                                    handleGradeChange(
                                                        segment.id,
                                                        criterion.id,
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full rounded-lg border border-gray-300 px-3 py-3 outline-none focus:border-accent"
                                            />
                                            <p className="text-xs text-gray-500">
                                                {currentLocale === 'ar'
                                                    ? `الحد الأقصى ${criterion.degree}`
                                                    : `Max ${criterion.degree}`}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </ModalContent>

                <ModalFooter className="flex items-center justify-end gap-3">
                    <button
                        type="button"
                        onClick={() => onClose(false)}
                        className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                    >
                        {currentLocale === 'ar' ? 'إلغاء' : 'Cancel'}
                    </button>
                    <button
                        type="submit"
                        disabled={isPending || !segments.length}
                        className="inline-flex min-w-[160px] items-center justify-center rounded-lg bg-primary px-6 py-[10px] text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                        {isPending
                            ? currentLocale === 'ar'
                                ? 'جارٍ التسليم...'
                                : 'Submitting...'
                            : currentLocale === 'ar'
                            ? 'تسليم الامتحان'
                            : 'Submit Exam'}
                    </button>
                </ModalFooter>
            </form>
        </Modal>
    );
}
