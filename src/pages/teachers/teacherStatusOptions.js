import { teacherStatusOptions } from '../../utils/constants/options.js';

export const teacherReadonlyStatusOptions = [
    ...teacherStatusOptions,
    { label: { ar: 'غير مرخص', en: 'Unlicensed' }, value: 'unlicensed' }
];
