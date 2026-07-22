import React, { useEffect, useMemo, useState } from 'react';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import Btn from '@/components/common/buttons/Btn';
import useLocale from '@/utils/hooks/global/useLocale';
import { useCreateEvaluationMutation } from '@/api/hooks/useEvaluations';
import { useEntitiesQuery } from '@/api/hooks/useEntities';
import { useTeachersQuery } from '@/api/hooks/useTeachers';
import { useStudentsQuery } from '@/api/hooks/useStudents';
import { useEvaluationParametersQuery } from '@/api/hooks/useEvaluationParameters';
import { useUserStore } from '@/utils/stores/user.store';
import {
    canSubmitEvaluationTemplate,
    extractCollection,
    getLocalizedText
} from './helpers';

const today = () => new Date().toISOString().slice(0, 10);

const getTargetName = (item, locale) =>
    getLocalizedText(item?.name, locale) ||
    item?.full_name ||
    item?.name ||
    item?.user?.full_name ||
    getLocalizedText(item?.user?.name, locale) ||
    `#${item?.id}`;

const getEvaluationType = evaluationFor => {
    const value = String(
        getLocalizedText(evaluationFor, 'en') ||
            getLocalizedText(evaluationFor, 'ar') ||
            evaluationFor ||
            ''
    ).toLowerCase();

    if (value.includes('student') || value.includes('طالب')) return 'student';
    if (value.includes('teacher') || value.includes('معلم')) return 'teacher';
    if (value.includes('entity') || value.includes('جهة')) return 'entity';
    return null;
};

export default function CreateEvaluation({ onClose }) {
    const { currentLocale } = useLocale();
    const isArabic = currentLocale === 'ar';
    const currentUser = useUserStore(state => state.user);
    const { mutate, isPending, error } = useCreateEvaluationMutation();
    const [form, setForm] = useState({
        evaluation_parameter_id: '',
        evaluated_type: 'entity',
        evaluated_id: '',
        evaluation_date: today(),
        notes: ''
    });
    const [scores, setScores] = useState({});
    const [formError, setFormError] = useState('');

    const {
        data: evaluationParametersResponse,
        isLoading: templatesLoading
    } = useEvaluationParametersQuery({ page: 1, per_page: 100 });
    const { data: entitiesResponse } = useEntitiesQuery(
        { page: 1, per_page: 100 },
        { enabled: form.evaluated_type === 'entity' }
    );
    const { data: teachersResponse } = useTeachersQuery(
        { page: 1, per_page: 100 },
        { enabled: form.evaluated_type === 'teacher' }
    );
    const { data: studentsResponse } = useStudentsQuery(
        { page: 1, per_page: 100 },
        { enabled: form.evaluated_type === 'student' }
    );

    const templates = extractCollection(evaluationParametersResponse);
    const availableTemplates = useMemo(
        () =>
            templates.filter(template =>
                canSubmitEvaluationTemplate(template, currentUser)
            ),
        [currentUser, templates]
    );
    const selectedTemplate = templates.find(
        template => String(template.id) === String(form.evaluation_parameter_id)
    );
    const criteria = useMemo(
        () =>
            Array.isArray(selectedTemplate?.criteria)
                ? selectedTemplate.criteria
                : [],
        [selectedTemplate?.criteria]
    );
    const targets = useMemo(() => {
        if (form.evaluated_type === 'teacher') return extractCollection(teachersResponse);
        if (form.evaluated_type === 'student') return extractCollection(studentsResponse);
        return extractCollection(entitiesResponse);
    }, [entitiesResponse, form.evaluated_type, studentsResponse, teachersResponse]);

    useEffect(() => {
        setForm(previous => ({ ...previous, evaluated_id: '' }));
    }, [form.evaluated_type]);

    useEffect(() => {
        const templateType = getEvaluationType(selectedTemplate?.evaluation_for);
        if (templateType) {
            setForm(previous =>
                previous.evaluated_type === templateType
                    ? previous
                    : {
                          ...previous,
                          evaluated_type: templateType,
                          evaluated_id: ''
                      }
            );
        }
    }, [selectedTemplate]);

    useEffect(() => {
        setScores(
            Object.fromEntries(
                criteria.map(criterion => [criterion.id, criterion.score ?? ''])
            )
        );
    }, [criteria, form.evaluation_parameter_id]);

    const changeField = event => {
        const { name, value } = event.target;
        setForm(previous => ({ ...previous, [name]: value }));
    };

    const handleSubmit = event => {
        event.preventDefault();
        setFormError('');

        if (!form.evaluation_parameter_id || !form.evaluated_id || !form.evaluation_date) {
            setFormError(isArabic ? 'يرجى استكمال الحقول المطلوبة.' : 'Please complete the required fields.');
            return;
        }

        if (!canSubmitEvaluationTemplate(selectedTemplate, currentUser)) {
            setFormError(
                isArabic
                    ? 'ليس لديك صلاحية لإرسال هذا التقييم.'
                    : 'You do not have permission to submit this evaluation template.'
            );
            return;
        }

        if (!criteria.length) {
            setFormError(isArabic ? 'القالب المختار لا يحتوي على معايير.' : 'The selected template has no criteria.');
            return;
        }

        const criteriaScores = criteria.map(criterion => {
            const score = Number(scores[criterion.id]);
            return {
                criteria_id: criterion.id,
                score,
                notes: null
            };
        });

        if (criteriaScores.some(item => Number.isNaN(item.score) || item.score < 0)) {
            setFormError(isArabic ? 'أدخل درجة صحيحة لكل معيار.' : 'Enter a valid score for every criterion.');
            return;
        }

        mutate(
            {
                evaluation_parameter_id: Number(form.evaluation_parameter_id),
                evaluated_type: form.evaluated_type,
                evaluated_id: Number(form.evaluated_id),
                evaluation_date: form.evaluation_date,
                notes: form.notes || null,
                criteria_scores: criteriaScores
            },
            { onSuccess: onClose }
        );
    };

    return (
        <Modal onClose={onClose} size="4xl">
            <ModalHeader onClose={onClose} header={isArabic ? 'إضافة تقييم' : 'Add Evaluation'} />
            <form onSubmit={handleSubmit} className="space-y-5 overflow-y-auto p-6">
                {(formError || error?.message) && (
                    <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                        {formError || error.message}
                    </div>
                )}

                <div className="grid gap-4 md:grid-cols-2">
                    <label className="space-y-1 text-sm font-medium text-gray-700">
                        {isArabic ? 'قالب التقييم *' : 'Evaluation Template *'}
                        <select name="evaluation_parameter_id" value={form.evaluation_parameter_id} onChange={changeField} disabled={templatesLoading} className="w-full rounded-lg border border-gray-300 bg-white px-3 py-3 font-normal outline-none focus:border-accent">
                            <option value="">{isArabic ? 'اختر قالب التقييم' : 'Select evaluation template'}</option>
                            {availableTemplates.map(template => (
                                <option key={template.id} value={template.id}>
                                    {getLocalizedText(template.name, currentLocale) || `#${template.id}`}
                                </option>
                            ))}
                        </select>
                        {!templatesLoading && !availableTemplates.length && (
                            <span className="block text-xs font-normal text-amber-700">
                                {isArabic
                                    ? 'لا توجد قوالب تقييم متاحة لصلاحياتك الحالية.'
                                    : 'No evaluation templates are available for your current dashboard.'}
                            </span>
                        )}
                    </label>
                    <label className="space-y-1 text-sm font-medium text-gray-700">
                        {isArabic ? 'نوع المُقيَّم *' : 'Evaluated Type *'}
                        <select name="evaluated_type" value={form.evaluated_type} onChange={changeField} className="w-full rounded-lg border border-gray-300 bg-white px-3 py-3 font-normal outline-none focus:border-accent">
                            <option value="entity">{isArabic ? 'جهة' : 'Entity'}</option>
                            <option value="teacher">{isArabic ? 'معلم' : 'Teacher'}</option>
                            <option value="student">{isArabic ? 'طالب' : 'Student'}</option>
                        </select>
                    </label>
                    <label className="space-y-1 text-sm font-medium text-gray-700">
                        {isArabic ? 'المُقيَّم *' : 'Evaluated User *'}
                        <select name="evaluated_id" value={form.evaluated_id} onChange={changeField} className="w-full rounded-lg border border-gray-300 bg-white px-3 py-3 font-normal outline-none focus:border-accent">
                            <option value="">{isArabic ? 'اختر المُقيَّم' : 'Select user'}</option>
                            {targets.map(target => (
                                <option key={target.id} value={target.id}>
                                    {getTargetName(target, currentLocale)}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label className="space-y-1 text-sm font-medium text-gray-700">
                        {isArabic ? 'تاريخ التقييم *' : 'Evaluation Date *'}
                        <input type="date" name="evaluation_date" value={form.evaluation_date} onChange={changeField} className="w-full rounded-lg border border-gray-300 px-3 py-3 font-normal outline-none focus:border-accent" />
                    </label>
                </div>

                <label className="block space-y-1 text-sm font-medium text-gray-700">
                    {isArabic ? 'ملاحظات' : 'Notes'}
                    <textarea name="notes" value={form.notes} onChange={changeField} rows="3" className="w-full rounded-lg border border-gray-300 px-3 py-3 font-normal outline-none focus:border-accent" />
                </label>

                {form.evaluation_parameter_id && (
                    <section className="space-y-3 rounded-xl border border-gray-200 bg-gray-50 p-4">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-gray-900">{isArabic ? 'معايير التقييم' : 'Evaluation Criteria'}</h3>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                            {criteria.map(criterion => {
                                const maxScore = criterion.degree ?? criterion.max_score ?? criterion.max_grade;
                                return (
                                    <label key={criterion.id} className="space-y-1 text-sm font-medium text-gray-700">
                                        {getLocalizedText(criterion.criteria_name, currentLocale) || getLocalizedText(criterion.name, currentLocale) || `#${criterion.id}`}
                                        {maxScore != null && <span className="mx-1 text-xs font-normal text-gray-500">({isArabic ? `الحد الأقصى ${maxScore}` : `max ${maxScore}`})</span>}
                                        <input type="number" min="0" max={maxScore} step="0.01" value={scores[criterion.id] ?? ''} onChange={event => setScores(previous => ({ ...previous, [criterion.id]: event.target.value }))} className="w-full rounded-lg border border-gray-300 bg-white px-3 py-3 font-normal outline-none focus:border-accent" />
                                    </label>
                                );
                            })}
                        </div>
                    </section>
                )}

                <div className="flex gap-3 border-t pt-4">
                    <Btn type="button" onClick={onClose} label="common.cancel" className="flex-1 bg-gray-200 text-gray-800 hover:bg-gray-300" />
                    <Btn type="submit" loading={isPending} label={isArabic ? 'حفظ التقييم' : 'Save Evaluation'} className="flex-1" />
                </div>
            </form>
        </Modal>
    );
}
