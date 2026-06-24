export function getSegmentationLeaveBlockReason({
    hasUnsavedSegment = false,
    editingSegment = null,
    segments = [],
    pageVerseKeys = []
} = {}) {
    if (editingSegment) {
        return 'editing';
    }

    if (hasUnsavedSegment) {
        return 'unsaved_segment';
    }

    if (segments.some(segment => !segment?.first_verse_key || !segment?.last_verse_key)) {
        return 'incomplete_segment';
    }

    if (
        segments.length > 0 &&
        pageVerseKeys.length > 0 &&
        !segmentsCoverPageVerses(segments, pageVerseKeys)
    ) {
        return 'incomplete_page_coverage';
    }

    return null;
}

export function isQuranSegmentationNavigationAllowed(state = {}) {
    return getSegmentationLeaveBlockReason(state) === null;
}

export function segmentsCoverPageVerses(segments = [], pageVerseKeys = []) {
    if (pageVerseKeys.length === 0) return true;

    const covered = new Set();

    segments.forEach(segment => {
        const startIndex = pageVerseKeys.indexOf(segment?.first_verse_key);
        const endIndex = pageVerseKeys.indexOf(segment?.last_verse_key);

        if (startIndex === -1 || endIndex === -1) return;

        const from = Math.min(startIndex, endIndex);
        const to = Math.max(startIndex, endIndex);
        for (let index = from; index <= to; index += 1) {
            covered.add(pageVerseKeys[index]);
        }
    });

    return pageVerseKeys.every(verseKey => covered.has(verseKey));
}
