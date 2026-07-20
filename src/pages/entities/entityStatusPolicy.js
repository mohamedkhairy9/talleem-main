export function canChangeEntityStatus({
    currentStatus,
    nextStatus,
    isSuperAdmin
}) {
    if (currentStatus === nextStatus) return true;

    return (
        isSuperAdmin &&
        currentStatus === 'suspended' &&
        nextStatus === 'active'
    );
}
