import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Loader from '@/components/common/Loader';
import useLocale from '@/utils/hooks/global/useLocale';
import {
    useConductExamBranchesQuery,
    useConductExamEntitiesQuery,
    useConductExamTodayQuery
} from '@/api/hooks/useConductExams';
import {
    extractCollection,
    extractRecord,
    formatTimeRange,
    normalizeBranchItem,
    normalizeExamDetails,
    normalizeEntityItem,
    normalizeExamItem
} from './helpers';
import {
    getExamEarlyStartMinutes,
    getExamStartAvailability
} from './examTiming';
import { useConfigurationsQuery } from '@/api/hooks/useConfigurations';
import { conductExamsService } from '@/api/services/conductExams.service';

const isCompletedExam = exam => {
    const status = String(exam?.status || '').trim().toLowerCase();
    return ['completed', 'complete', 'finished', 'submitted'].includes(status);
};

const getScheduleState = (exam, now, isArabic, earlyStartMinutes = 0) => {
    if (exam?.isCompleted || isCompletedExam(exam)) {
        return {
            label: isArabic ? 'مكتمل' : 'Completed',
            className: 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200'
        };
    }

    const availability = getExamStartAvailability(exam, now, earlyStartMinutes);

    if (availability.reason === 'not_started') {
        return {
            label: isArabic ? 'لم يبدأ بعد' : 'Not started yet',
            className: 'bg-sky-50 text-sky-700 ring-1 ring-sky-200'
        };
    }
    if (availability.reason === 'ended') {
        return {
            label: isArabic ? 'انتهى الموعد' : 'Ended',
            className: 'bg-gray-100 text-gray-700 ring-1 ring-gray-200'
        };
    }
    return {
        label: isArabic ? 'متاح الآن' : 'Available now',
        className: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
    };
};

export default function ConductExams() {
    const navigate = useNavigate();
    const { currentLocale } = useLocale();
    const isArabic = currentLocale === 'ar';
    const [selectedBranchId, setSelectedBranchId] = useState('');
    const [selectedEntityId, setSelectedEntityId] = useState('');
    const [now, setNow] = useState(() => new Date());
    const [completedExamIds, setCompletedExamIds] = useState(() => new Set());

    const branchesQuery = useConductExamBranchesQuery();
    const branches = extractCollection(branchesQuery.data).map(normalizeBranchItem);
    // The API returns only the branches that the current account may access.
    // A branch manager normally receives one branch, so make it the active
    // scope immediately instead of initially querying every branch.
    const effectiveBranchId =
        selectedBranchId || (branches.length === 1 ? String(branches[0].id) : '');
    const entitiesQuery = useConductExamEntitiesQuery(
        effectiveBranchId ? { branch_id: effectiveBranchId } : {}
    );
    const todayQuery = useConductExamTodayQuery(
        effectiveBranchId ? { branch_id: effectiveBranchId } : {}
    );
    const configurationsQuery = useConfigurationsQuery('tahfiz');

    const entities = useMemo(
        () => extractCollection(entitiesQuery.data).map(normalizeEntityItem),
        [entitiesQuery.data]
    );
    const todayExams = useMemo(
        () => extractCollection(todayQuery.data).map(normalizeExamItem),
        [todayQuery.data]
    );
    const earlyStartMinutes = useMemo(
        () => getExamEarlyStartMinutes(configurationsQuery.data),
        [configurationsQuery.data]
    );
    const filteredTodayExams = useMemo(
        () => todayExams.filter(exam => (
            (!effectiveBranchId || String(exam.branchId) === String(effectiveBranchId)) &&
            (!selectedEntityId || String(exam.entityId) === String(selectedEntityId))
        )),
        [todayExams, effectiveBranchId, selectedEntityId]
    );

    useEffect(() => {
        if (!selectedBranchId && branches.length === 1) {
            setSelectedBranchId(String(branches[0].id));
        }
    }, [branches, selectedBranchId]);

    useEffect(() => {
        if (
            selectedEntityId &&
            !entities.some(entity => String(entity.id) === String(selectedEntityId))
        ) {
            setSelectedEntityId('');
        }
    }, [entities, selectedEntityId]);

    useEffect(() => {
        const timer = window.setInterval(() => setNow(new Date()), 30_000);
        return () => window.clearInterval(timer);
    }, []);

    useEffect(() => {
        let isActive = true;

        const checkExamCompletion = async exam => {
            if (!exam?.id) return null;
            if (isCompletedExam(exam)) return String(exam.id);

            try {
                const details = normalizeExamDetails(
                    await conductExamsService.getScheduledExam(exam.id)
                );

                if (!details.students.length) return null;

                const studentStates = await Promise.all(
                    details.students.map(async student => {
                        if (student.isCompleted || student.statusKey === 'submitted') {
                            return true;
                        }

                        try {
                            const result = extractRecord(
                                await conductExamsService.getStudentResult(exam.id, student.id)
                            );
                            return String(result?.status || '').toLowerCase() === 'completed';
                        } catch {
                            return false;
                        }
                    })
                );

                return studentStates.every(Boolean) ? String(exam.id) : null;
            } catch {
                return null;
            }
        };

        if (!todayExams.length) {
            setCompletedExamIds(new Set());
            return () => {
                isActive = false;
            };
        }

        Promise.all(todayExams.map(checkExamCompletion)).then(examIds => {
            if (!isActive) return;
            setCompletedExamIds(new Set(examIds.filter(Boolean)));
        });

        return () => {
            isActive = false;
        };
    }, [todayExams]);

    if (branchesQuery.isLoading || entitiesQuery.isLoading || todayQuery.isLoading) {
        return <Loader />;
    }

    return (
        <div className="space-y-6">
            <section className="relative overflow-hidden rounded-3xl bg-gradient-to-l from-primary via-primary to-sky-600 p-7 text-white shadow-lg">
                <div className="absolute -end-12 -top-16 h-48 w-48 rounded-full bg-white/10" />
                <div className="relative">
                <p className="text-xs font-bold tracking-[0.2em] text-white/70">EXAM CENTER</p>
                <h1 className="mt-2 text-3xl font-bold">
                    {isArabic ? 'إجراء الامتحانات' : 'Conduct Exams'}
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-white/85">
                    {isArabic
                        ? 'اختر امتحان اليوم لعرض تفاصيله وبدء تقييم الطلاب.'
                        : 'Choose a today exam to review its details and start evaluating students.'}
                </p>
                </div>
            </section>

            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="grid gap-4 md:grid-cols-2">
                    <label className="space-y-2 text-sm font-medium text-gray-700">
                        <span>{isArabic ? 'الفرع' : 'Branch'}</span>
                        <select
                            value={selectedBranchId}
                            onChange={event => setSelectedBranchId(event.target.value)}
                            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-primary"
                        >
                            <option value="">{isArabic ? 'كل الفروع' : 'All branches'}</option>
                            {branches.map(branch => (
                                <option key={branch.id} value={branch.id}>{branch.displayName}</option>
                            ))}
                        </select>
                    </label>
                    <label className="space-y-2 text-sm font-medium text-gray-700">
                        <span>{isArabic ? 'الجهة' : 'Entity'}</span>
                        <select
                            value={selectedEntityId}
                            onChange={event => setSelectedEntityId(event.target.value)}
                            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-primary"
                        >
                            <option value="">{isArabic ? 'كل الجهات' : 'All entities'}</option>
                            {entities.map(entity => (
                                <option key={entity.id} value={entity.id}>{entity.displayName}</option>
                            ))}
                        </select>
                    </label>
                </div>
            </section>

            {todayQuery.hasError ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
                    {todayQuery.errorMessage || (isArabic ? 'تعذر تحميل امتحانات اليوم.' : 'Unable to load today exams.')}
                </div>
            ) : null}

            <section className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-gray-200 bg-gradient-to-l from-slate-50 to-white px-6 py-4">
                    <h2 className="text-lg font-semibold text-gray-900">
                        {isArabic ? 'امتحانات اليوم' : 'Today Exams'}
                    </h2>
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
                        {filteredTodayExams.length}
                    </span>
                </div>
                <div className="divide-y divide-gray-100">
                    {filteredTodayExams.map(exam => (
                        <button
                            key={exam.id}
                            type="button"
                            onClick={() => navigate(`/conduct-exams/${exam.id}`)}
                            className="grid w-full gap-3 px-6 py-5 text-start transition hover:bg-primary/5 focus:bg-primary/5 md:grid-cols-[minmax(0,1fr)_auto] md:items-center"
                        >
                            <div>
                                <h3 className="font-semibold text-gray-900">{exam.displayName}</h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    {exam.entityName || '-'} {exam.branchName ? `• ${exam.branchName}` : ''}
                                </p>
                                <p className="mt-2 text-sm text-gray-600">
                                    {exam.examDate || exam.scheduledAt || '-'} • {formatTimeRange(exam)}
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                {(() => {
                                    const scheduleState = getScheduleState(
                                        {
                                            ...exam,
                                            isCompleted: completedExamIds.has(String(exam.id))
                                        },
                                        now,
                                        isArabic,
                                        earlyStartMinutes
                                    );
                                    return (
                                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${scheduleState.className}`}>
                                            {scheduleState.label}
                                        </span>
                                    );
                                })()}
                                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                                    {exam.studentsCount} {isArabic ? 'طالب' : 'students'}
                                </span>
                                <span className="text-sm font-semibold text-primary">
                                    {isArabic ? 'عرض التفاصيل ←' : 'View details →'}
                                </span>
                            </div>
                        </button>
                    ))}
                    {!filteredTodayExams.length ? (
                        <div className="p-8 text-center text-sm text-gray-500">
                            {isArabic ? 'لا توجد امتحانات مطابقة للتصفية الحالية.' : 'No exams match the current filters.'}
                        </div>
                    ) : null}
                </div>
            </section>
        </div>
    );
}
