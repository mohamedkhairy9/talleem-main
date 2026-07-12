import React, { useEffect, useState } from 'react';
import Modal from '@/components/common/form/Modal';
import ModalContent from '@/components/common/form/ModalContent';
import ModalFooter from '@/components/common/form/ModalFooter';
import useLocale from '@/utils/hooks/global/useLocale';
import { EXAM_TYPES } from './helpers';

export default function StartExamModal({
    student,
    templates = [],
    isPending,
    errorMessage,
    onClose,
    onSubmit
}) {
    const { currentLocale } = useLocale();
    const [form, setForm] = useState({
        exam_type: 'maqata3',
        evaluation_parameter_id: templates[0]?.id ?? ''
    });

    useEffect(() => {
        setForm(prev => ({
            ...prev,
            evaluation_parameter_id: prev.evaluation_parameter_id || templates[0]?.id || ''
        }));
    }, [templates]);

    const handleSubmit = event => {
        event.preventDefault();
        if (!form.evaluation_parameter_id) return;

        onSubmit({
            exam_type: form.exam_type,
            evaluation_parameter_id: Number(form.evaluation_parameter_id)
        });
    };

    return (
        <Modal onClose={onClose} size="lg">
            <form onSubmit={handleSubmit} className="flex h-full flex-col">
                <div className="flex items-center justify-between border-b border-gray-300 p-5">
                    <h2 className="text-xl font-semibold text-primary">
                        {currentLocale === 'ar' ? 'بدء الامتحان' : 'Start Exam'}
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
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
                            {student?.displayName || student?.display_name || '-'}
                        </p>
                    </div>

                    {errorMessage ? (
                        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                            {errorMessage}
                        </div>
                    ) : null}

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            {currentLocale === 'ar' ? 'نوع الامتحان' : 'Exam Type'}
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            {EXAM_TYPES.map(type => {
                                const isSelected = form.exam_type === type;

                                return (
                                    <button
                                        key={type}
                                        type="button"
                                        onClick={() =>
                                            setForm(prev => ({
                                                ...prev,
                                                exam_type: type
                                            }))
                                        }
                                        className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                                            isSelected
                                                ? 'border-primary bg-primary/5 text-primary'
                                                : 'border-gray-200 bg-white text-gray-700 hover:border-primary/40'
                                        }`}
                                    >
                                        {type === 'maqata3'
                                            ? currentLocale === 'ar'
                                                ? 'مقاطع'
                                                : 'Maqata3'
                                            : currentLocale === 'ar'
                                            ? 'سرد'
                                            : 'Sard'}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            {currentLocale === 'ar'
                                ? 'نموذج التقييم'
                                : 'Evaluation Template'}
                        </label>
                        <select
                            value={form.evaluation_parameter_id}
                            onChange={event =>
                                setForm(prev => ({
                                    ...prev,
                                    evaluation_parameter_id: event.target.value
                                }))
                            }
                            className="w-full rounded-lg border border-gray-300 px-3 py-3 outline-none focus:border-accent"
                        >
                            <option value="">
                                {currentLocale === 'ar'
                                    ? 'اختر نموذج التقييم'
                                    : 'Select evaluation template'}
                            </option>
                            {templates.map(template => (
                                <option key={template.id} value={template.id}>
                                    {template.displayName || template.display_name}
                                </option>
                            ))}
                        </select>
                    </div>
                </ModalContent>

                <ModalFooter className="flex items-center justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                    >
                        {currentLocale === 'ar' ? 'إلغاء' : 'Cancel'}
                    </button>
                    <button
                        type="submit"
                        disabled={isPending || !form.evaluation_parameter_id}
                        className="inline-flex min-w-[160px] items-center justify-center rounded-lg bg-primary px-6 py-[10px] text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                        {isPending
                            ? currentLocale === 'ar'
                                ? 'جارٍ البدء...'
                                : 'Starting...'
                            : currentLocale === 'ar'
                            ? 'بدء الامتحان'
                            : 'Start Exam'}
                    </button>
                </ModalFooter>
            </form>
        </Modal>
    );
}
