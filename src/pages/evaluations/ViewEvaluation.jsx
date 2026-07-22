import React from 'react';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import Loader from '@/components/common/Loader';
import useLocale from '@/utils/hooks/global/useLocale';
import { useEvaluationQuery } from '@/api/hooks/useEvaluations';
import { extractRecord, getEvaluationTargetName, getLocalizedText, getTemplateName } from './helpers';

const Value = ({ label, value }) => (
    <div className="rounded-lg bg-gray-50 p-3">
        <p className="text-xs text-gray-500">{label}</p>
        <p className="mt-1 font-medium text-gray-900">{value || '-'}</p>
    </div>
);

export default function ViewEvaluation({ onClose, evaluation }) {
    const { currentLocale } = useLocale();
    const isArabic = currentLocale === 'ar';
    const { data, isLoading } = useEvaluationQuery(evaluation?.id);
    const details = extractRecord(data) || evaluation;
    const criteriaScores =
        details?.criteria_scores || details?.scores || details?.evaluation_scores || [];

    return (
        <Modal onClose={onClose} size="3xl">
            <ModalHeader onClose={onClose} header={isArabic ? 'تفاصيل التقييم' : 'Evaluation Details'} />
            {isLoading ? (
                <div className="p-10"><Loader /></div>
            ) : (
                <div className="space-y-5 overflow-y-auto p-6">
                    <div className="grid gap-3 md:grid-cols-2">
                        <Value label={isArabic ? 'قالب التقييم' : 'Evaluation Template'} value={getTemplateName(details, currentLocale)} />
                        <Value label={isArabic ? 'المُقيَّم' : 'Evaluated User'} value={getEvaluationTargetName(details, currentLocale)} />
                        <Value label={isArabic ? 'النوع' : 'Type'} value={details?.evaluated_type} />
                        <Value label={isArabic ? 'تاريخ التقييم' : 'Evaluation Date'} value={details?.evaluation_date} />
                        <Value label={isArabic ? 'النتيجة' : 'Score'} value={details?.total_score ?? details?.score ?? details?.final_score} />
                        <Value label={isArabic ? 'المقيّم' : 'Evaluator'} value={getLocalizedText(details?.evaluator?.name, currentLocale) || details?.evaluator_name} />
                    </div>

                    {details?.notes && (
                        <section>
                            <h3 className="mb-2 font-semibold text-gray-900">{isArabic ? 'ملاحظات' : 'Notes'}</h3>
                            <p className="rounded-lg bg-gray-50 p-3 text-sm text-gray-700">{details.notes}</p>
                        </section>
                    )}

                    {criteriaScores.length > 0 && (
                        <section>
                            <h3 className="mb-2 font-semibold text-gray-900">{isArabic ? 'درجات المعايير' : 'Criteria Scores'}</h3>
                            <div className="space-y-2">
                                {criteriaScores.map((item, index) => (
                                    <div key={item.id || item.criteria_id || index} className="flex items-center justify-between rounded-lg border border-gray-200 p-3">
                                        <span className="font-medium text-gray-800">
                                            {getLocalizedText(item?.criterion?.criteria_name, currentLocale) || getLocalizedText(item?.criterion?.name, currentLocale) || getLocalizedText(item?.criteria_name, currentLocale) || `${isArabic ? 'معيار' : 'Criterion'} ${index + 1}`}
                                        </span>
                                        <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
                                            {item.score ?? item.grade ?? '-'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            )}
        </Modal>
    );
}
