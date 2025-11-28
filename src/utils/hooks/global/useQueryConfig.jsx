import queryPresets from '@/utils/constants/queryPresets';

export default function useQueryConfig(preset, overrides = {}) {
    const presetConfig = queryPresets[preset] || {};
    return { ...presetConfig, ...overrides };
}
