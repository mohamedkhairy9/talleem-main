import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { usePhaseQuery } from '@/api/hooks/usePhases';
import Loader from '@/components/common/Loader';
import StepsList from '@/pages/phases/StepsList';
import useLocale from '@/utils/hooks/global/useLocale';
import i18next from 'i18next';
import { MdArrowBack } from 'react-icons/md';
import { HiChevronRight } from 'react-icons/hi';

export default function Steps() {
    const { phaseId } = useParams();
    const { t } = useLocale();
    const { data, isLoading, refetch } = usePhaseQuery(phaseId, {
        enabled: Boolean(phaseId)
    });

    if (!phaseId) {
        return (
            <div className="p-6 text-gray-600">
                {t('common.invalid_phase')}
            </div>
        );
    }

    if (isLoading) return <Loader />;

    const phase = data?.data;
    if (!phase) {
        return (
            <div className="p-6 text-gray-600">
                {t('common.phase_not_found')}
            </div>
        );
    }

    const phaseName = typeof phase.name === 'string'
        ? phase.name
        : phase.name?.[i18next.language] || phase.name?.en || phase.name?.ar || `Phase ${phase.id}`;

    const backToPhasesUrl = `/phases${phase.request_type_id ? `?request_type_id=${phase.request_type_id}` : ''}`;

    return (
        <div className="p-6">
            {/* Breadcrumb + Back */}
            <nav className="mb-6" aria-label="Breadcrumb">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                    <Link
                        to={backToPhasesUrl}
                        className="inline-flex items-center gap-1.5 text-primary-600 hover:text-primary-700 hover:underline"
                    >
                        <MdArrowBack className="w-4 h-4 flex-shrink-0" />
                        {t('table_titles.phases')}
                    </Link>
                    <HiChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="text-gray-700 font-medium truncate" title={phaseName}>
                        {phaseName}
                    </span>
                    <HiChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="text-gray-900 font-medium">
                        {t('phases.steps')}
                    </span>
                </div>
                <h1 className="text-xl font-semibold text-gray-800">
                    {t('phases.steps')} — {phaseName}
                </h1>
            </nav>
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
                <StepsList
                    steps={phase.steps}
                    phaseId={phase.id}
                    requestTypeId={phase.request_type_id}
                    onReorderComplete={refetch}
                />
            </div>
        </div>
    );
}
