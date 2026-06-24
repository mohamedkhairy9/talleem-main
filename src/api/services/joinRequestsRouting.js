import { API_URLS } from '../endpoints.js';

export function resolveJoinRequestsListPath({ mode = 'auto', scoped = false } = {}) {
    if (mode === 'pending' || scoped) {
        return `${API_URLS.JOIN_REQUESTS.LIST}/pending`;
    }

    return API_URLS.JOIN_REQUESTS.LIST;
}
