import assert from 'node:assert/strict';
import { getVisibleConfigurationGroups } from './configurationVisibility.js';

const tahfizConfigs = [
    { program: 'tahfiz', key: 'annual_leave_days', label: 'إجازة سنوية (أيام)' },
    { program: 'tahfiz', key: 'max_allowed_absences_with_excuse', label: 'عدد الغيابات المسموحة (بعذر)' },
    { program: 'tahfiz', key: 'sick_leave_days', label: 'إجازة مرضية (أيام)' },
    { program: 'tahfiz', key: 'other_leave_days', label: 'إجازة أخرى (أيام)' }
];

const arabicGroups = getVisibleConfigurationGroups([tahfizConfigs], 'ar');
const visibleKeys = arabicGroups.flat().map(config => config.key);

assert.deepEqual(
    visibleKeys,
    ['annual_leave_days', 'sick_leave_days', 'other_leave_days'],
    'Tahfiz settings must not show the excused absences count as a teacher leave type'
);

assert.deepEqual(
    arabicGroups.flat().map(config => config.label),
    ['إجازات المعلم السنوية (أيام)', 'إجازات المعلم المرضية (أيام)', 'إجازات المعلم الأخرى (أيام)'],
    'Teacher leave labels in Arabic must explicitly say they belong to the teacher'
);

const englishGroups = getVisibleConfigurationGroups([tahfizConfigs], 'en');

assert.deepEqual(
    englishGroups.flat().map(config => config.label),
    ['Teacher Annual Leave (Days)', 'Teacher Sick Leave (Days)', 'Teacher Other Leave (Days)'],
    'Teacher leave labels in English must explicitly say they belong to the teacher'
);

assert.deepEqual(
    getVisibleConfigurationGroups([[{ program: 'general', key: 'max_allowed_absences_with_excuse' }]]),
    [[{ program: 'general', key: 'max_allowed_absences_with_excuse' }]],
    'Only the Tahfiz settings view should hide the excused absences count'
);
