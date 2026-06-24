export function normalizeEntityListParams(params = {}) {
    const normalized = { ...params };

    if (normalized.status === 'active') {
        delete normalized.status;
    }

    return normalized;
}
