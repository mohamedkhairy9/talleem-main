import { axiosInstanceFront } from '../axiosInstance';
import { API_URLS } from '../endpoints';

/**
 * Context lookup endpoints for a logged-in educational supervisor.
 * They deliberately skip the selected-entity header because they are used to
 * discover all entities the supervisor can choose from.
 */
export const supervisorContextService = {
    getBranches: () =>
        axiosInstanceFront.get(API_URLS.SUPERVISOR_CONTEXT.BRANCHES, {
            skipSupervisorEntityContext: true
        }),

    getEntities: ({ branchId, date }) =>
        axiosInstanceFront.get(API_URLS.SUPERVISOR_CONTEXT.ENTITIES, {
            params: {
                branch_id: branchId,
                from_date: date,
                to_date: date
            },
            skipSupervisorEntityContext: true
        })
};
