
export function getNestedError(errors, path) {
    if (!errors || !path) return undefined;

    const keys = path.split('.');
    let current = errors;

    for (const key of keys) {
        if (current && typeof current === 'object' && key in current) {
            current = current[key];
        } else {
            return undefined;
        }
    }

    return current?.message;
}

export function getFieldError(errors, fieldName) {
    return errors?.[fieldName]?.message;
}
