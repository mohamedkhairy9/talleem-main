import { useEffect, useMemo, useState } from 'react';
import { HiCheckCircle, HiOfficeBuilding, HiRefresh } from 'react-icons/hi';
import { useQueryClient } from '@tanstack/react-query';
import { useUserStore } from '@/utils/stores/user.store';
import { supervisorContextService } from '@/api/services/supervisorContext.service';

const SUPERVISOR_ROLE_ALIASES = [
    'supervisor',
    'educational supervisor',
    'inspector',
    'مشرف',
    'المشرف التربوي'
];

const localizedName = value => {
    if (!value) return '';
    if (typeof value === 'string') return value;
    return value.ar || value.en || value.name || '';
};

const roleText = role => {
    if (typeof role === 'string') return role;
    return [role?.name, role?.display_name, role?.label, role?.code]
        .map(localizedName)
        .filter(Boolean)
        .join(' ');
};

const isSupervisor = user =>
    (user?.roles || []).some(role => {
        const text = roleText(role).toLowerCase().trim();
        return SUPERVISOR_ROLE_ALIASES.some(alias =>
            text.includes(alias.toLowerCase())
        );
    });

const localToday = () => {
    const now = new Date();
    const offset = now.getTimezoneOffset() * 60_000;
    return new Date(now.getTime() - offset).toISOString().slice(0, 10);
};

export default function SupervisorEntityContextGate({ children }) {
    const user = useUserStore(state => state.user);
    const isAuthenticated = useUserStore(state => state.isAuthenticated);
    const selectedEntity = useUserStore(
        state => state.selectedSupervisorEntity
    );
    const setSelectedEntity = useUserStore(
        state => state.setSelectedSupervisorEntity
    );
    const queryClient = useQueryClient();
    const [entities, setEntities] = useState([]);
    const [candidate, setCandidate] = useState(null);
    const [loading, setLoading] = useState(false);
    const [retried, setRetried] = useState(0);

    const supervisor = useMemo(() => isSupervisor(user), [user]);

    useEffect(() => {
        if (!isAuthenticated || !supervisor || selectedEntity?.id) return;

        let active = true;
        const loadContexts = async () => {
            setLoading(true);
            try {
                const date = localToday();
                const branchesResponse = await supervisorContextService.getBranches();
                const branches = branchesResponse?.data || [];
                const entityGroups = await Promise.all(
                    branches.map(async branch => {
                        const response = await supervisorContextService.getEntities({
                            branchId: branch.id,
                            date
                        });
                        return (response?.data || []).map(entity => ({
                            ...entity,
                            branchId: branch.id,
                            branchName: localizedName(branch.name)
                        }));
                    })
                );

                if (!active) return;
                const uniqueEntities = Array.from(
                    new Map(entityGroups.flat().map(entity => [entity.id, entity])).values()
                );
                setEntities(uniqueEntities);

                // Do not interrupt a supervisor who has one active assignment.
                if (uniqueEntities.length === 1) {
                    setSelectedEntity(uniqueEntities[0]);
                    queryClient.clear();
                }
            } catch (error) {
                // Lookup failures must not lock a valid user out of the portal.
                // The user can still enter, while the backend keeps its own scope checks.
                if (active) setEntities([]);
            } finally {
                if (active) setLoading(false);
            }
        };

        loadContexts();
        return () => {
            active = false;
        };
    }, [isAuthenticated, supervisor, selectedEntity?.id, retried, queryClient, setSelectedEntity]);

    if (!isAuthenticated || !supervisor || selectedEntity?.id || (!loading && entities.length === 0)) {
        return children;
    }

    const confirmSelection = () => {
        const entity = entities.find(item => item.id === candidate);
        if (!entity) return;
        setSelectedEntity(entity);
        queryClient.clear();
    };

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm"
            dir="rtl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="supervisor-entity-context-title"
        >
            <section className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
                <div className="bg-gradient-to-l from-teal-800 to-cyan-700 px-7 py-6 text-white">
                    <div className="flex items-start gap-4">
                        <span className="rounded-xl bg-white/15 p-3">
                            <HiOfficeBuilding className="h-7 w-7" />
                        </span>
                        <div>
                            <h1 id="supervisor-entity-context-title" className="text-xl font-bold">
                                اختر الجهة التي ستعمل عليها
                            </h1>
                            <p className="mt-1 text-sm text-cyan-50">
                                لديك إسناد نشط لأكثر من جهة. اختر جهة واحدة لعرض بياناتها وإجراء مهامك ضمنها.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="max-h-[55vh] space-y-3 overflow-y-auto p-6">
                    {loading ? (
                        <div className="py-10 text-center text-slate-500">جارٍ تحميل الجهات المسندة إليك…</div>
                    ) : (
                        entities.map(entity => {
                            const selected = candidate === entity.id;
                            return (
                                <button
                                    key={entity.id}
                                    type="button"
                                    onClick={() => setCandidate(entity.id)}
                                    className={`flex w-full items-center justify-between rounded-xl border p-4 text-right transition ${
                                        selected
                                            ? 'border-teal-600 bg-teal-50 ring-2 ring-teal-100'
                                            : 'border-slate-200 bg-white hover:border-teal-300 hover:bg-slate-50'
                                    }`}
                                >
                                    <span>
                                        <span className="block font-semibold text-slate-800">
                                            {localizedName(entity.name)}
                                        </span>
                                        {entity.branchName && (
                                            <span className="mt-1 block text-sm text-slate-500">
                                                {entity.branchName}
                                            </span>
                                        )}
                                    </span>
                                    {selected && <HiCheckCircle className="h-6 w-6 text-teal-600" />}
                                </button>
                            );
                        })
                    )}
                </div>

                <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-6 py-4">
                    <button
                        type="button"
                        onClick={() => setRetried(value => value + 1)}
                        disabled={loading}
                        className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-200 disabled:opacity-50"
                    >
                        <HiRefresh className="h-4 w-4" />
                        إعادة التحميل
                    </button>
                    <button
                        type="button"
                        disabled={!candidate || loading}
                        onClick={confirmSelection}
                        className="rounded-lg bg-teal-700 px-6 py-2.5 font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-45"
                    >
                        دخول إلى الجهة المختارة
                    </button>
                </div>
            </section>
        </div>
    );
}
