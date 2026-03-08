import i18next from 'i18next';

/**
 * All APIs return: { data: [...], meta: { current_page, per_page, total, last_page } }
 * The axios interceptor returns response.data so we receive this object directly.
 */

export const ASYNC_SELECT_PAGE_SIZE = 15;

function toOption(item, lang) {
    const label =
        item.name?.[lang] || item.name?.en || item.name?.ar ||
        (typeof item.name === 'string' ? item.name : '') ||
        item.label || '';
    return { label, value: item.id, id: item.id };
}

/**
 * loadOptions for <AsyncPaginate>.
 * Contract: (search, loadedOptions, additional) => { options, hasMore, additional }
 * - Pass additional={{ page: 1 }} to <AsyncPaginate> as initial state.
 * - Library passes back whatever `additional` we return last time as next `additional`.
 */
/** Remove undefined/null so API receives only real filter values */
function cleanParams(obj) {
    return Object.fromEntries(
        Object.entries(obj).filter(([, v]) => v !== undefined && v !== null && v !== '')
    );
}

const EMPTY_PAGINATED = { options: [], hasMore: false, additional: { page: 1 } };

/**
 * @param {string[]} [requiredParamKeys] - If any key is missing/falsy in extraParams, return empty (don't call API)
 */
export function createAsyncLoadOptions(apiService, extraParams = {}, transformFn = null, requiredParamKeys = null) {
    return async (search, _loadedOptions, additional) => {
        if (requiredParamKeys?.length) {
            const missing = requiredParamKeys.some(key => {
                const v = extraParams[key];
                return v === undefined || v === null || v === '';
            });
            if (missing) return EMPTY_PAGINATED;
        }

        const lang = i18next.language;
        const page = additional?.page ?? 1;

        try {
            const response = await apiService({
                ...cleanParams(extraParams),
                page,
                per_page: ASYNC_SELECT_PAGE_SIZE,
                ...(search?.trim() ? { search: search.trim() } : {})
            });


            const data  = Array.isArray(response?.data) ? response.data : [];
            const meta  = response?.meta ?? null;
            const hasMore = meta ? meta.current_page < meta.last_page : false;


            const result = {
                options: data.map(item => transformFn ? transformFn(item) : toOption(item, lang)),
                hasMore,
                additional: { page: hasMore ? page + 1 : page }
            };


            return result;
        } catch (err) {
            return { options: [], hasMore: false, additional: { page: 1 } };
        }
    };
}

/**
 * Like createAsyncLoadOptions, but prepends the currently-selected option on page 1
 * so edit-mode shows the right label immediately.
 * @param {string[]} [requiredParamKeys] - If any key is missing/falsy in extraParams, return empty (don't call API)
 */
export function createAsyncLoadOptionsWithIncluded(
    apiService,
    extraParams = {},
    selectedItem = null,
    transformFn = null,
    requiredParamKeys = null
) {
    const base = createAsyncLoadOptions(apiService, extraParams, transformFn, requiredParamKeys);

    return async (search, loadedOptions, additional) => {
        const result   = await base(search, loadedOptions, additional);
        const isPage1  = !additional?.page || additional.page === 1;

        if (selectedItem && !search?.trim() && isPage1) {
            const lang  = i18next.language;
            const id    = selectedItem.id ?? selectedItem.value;
            const label =
                selectedItem.name?.[lang] || selectedItem.name?.en ||
                selectedItem.name?.ar    || selectedItem.name   ||
                selectedItem.label       || '';

            if (!result.options.some(o => o.value === id || o.id === id)) {
                result.options = [{ label, value: id, id }, ...result.options];
            }
        }

        return result;
    };
}
