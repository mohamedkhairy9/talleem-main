
export function getNestedError(errors, path) {
    if (!errors || !path) return undefined;

    const keys = path.split('.');
    let current = errors;

    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        
        if (!current || typeof current !== 'object') {
            return undefined;
        }

        // Try to access the key directly first
        if (key in current) {
            current = current[key];
        } 
        // If key is numeric and current is an array, try numeric index
        else if (!isNaN(key) && !isNaN(parseInt(key)) && Array.isArray(current)) {
            const numKey = parseInt(key);
            if (numKey >= 0 && numKey < current.length) {
                current = current[numKey];
            } else {
                return undefined;
            }
        }
        // Try numeric key for objects (some libraries use numeric keys)
        else if (!isNaN(key) && !isNaN(parseInt(key)) && typeof current === 'object') {
            const numKey = parseInt(key);
            if (numKey in current || String(numKey) in current) {
                current = current[numKey] !== undefined ? current[numKey] : current[String(numKey)];
            } else {
                return undefined;
            }
        }
        else {
            return undefined;
        }
    }

    // Return message if it exists
    if (current && typeof current === 'object' && 'message' in current) {
        return current.message;
    }
    
    return undefined;
}

export function getFieldError(errors, fieldName) {
    return errors?.[fieldName]?.message;
}
