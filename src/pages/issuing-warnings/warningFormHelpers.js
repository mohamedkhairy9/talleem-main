/**
 * Normalize API row (nested branch, program, entity, student, teacher, warning_reason)
 * so form fields get correct IDs and date, while keeping nested objects for display.
 * Coerce IDs to number so select value matching works.
 */
export function normalizeWarningRowData(row) {
    if (!row) return null;
    return {
        ...row,
        program_id: row.program?.id ?? row.program_id,
        branch_id: row.branch?.id ?? row.branch_id,
        entity_id: row.entity?.id != null ? Number(row.entity.id) : row.entity_id,
        student_id: row.student?.id != null ? Number(row.student.id) : row.student_id,
        teacher_id: row.teacher?.id != null ? Number(row.teacher.id) : row.teacher_id,
        warning_reason_id: row.warning_reason?.id != null ? Number(row.warning_reason.id) : row.warning_reason_id,
        date: row.date?.gregorian ?? row.date
    };
}
