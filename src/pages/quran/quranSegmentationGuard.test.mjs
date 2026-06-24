import assert from 'node:assert/strict';
import {
    getSegmentationLeaveBlockReason,
    isQuranSegmentationNavigationAllowed
} from './quranSegmentationGuard.js';

const completeSegment = {
    id: 1,
    first_verse_key: '1:1',
    last_verse_key: '1:7'
};

assert.equal(
    isQuranSegmentationNavigationAllowed({
        hasUnsavedSegment: false,
        editingSegment: null,
        segments: [completeSegment]
    }),
    true,
    'complete saved segments should allow navigation'
);

assert.equal(
    isQuranSegmentationNavigationAllowed({
        hasUnsavedSegment: true,
        editingSegment: null,
        segments: [{ id: null, first_verse_key: '1:1', last_verse_key: '' }]
    }),
    false,
    'unsaved incomplete segment should block navigation'
);

assert.equal(
    getSegmentationLeaveBlockReason({
        hasUnsavedSegment: false,
        editingSegment: { index: 0, field: 'end' },
        segments: [completeSegment]
    }),
    'editing',
    'active start/end selection should block navigation'
);

assert.equal(
    getSegmentationLeaveBlockReason({
        hasUnsavedSegment: false,
        editingSegment: null,
        segments: [{ id: 1, first_verse_key: '1:1', last_verse_key: '' }]
    }),
    'incomplete_segment',
    'saved or loaded incomplete segment should block navigation'
);

assert.equal(
    getSegmentationLeaveBlockReason({
        hasUnsavedSegment: false,
        editingSegment: null,
        pageVerseKeys: ['1:1', '1:2', '1:3'],
        segments: [{ id: 1, first_verse_key: '1:1', last_verse_key: '1:2' }]
    }),
    'incomplete_page_coverage',
    'started segmentation that does not cover all page verses should block navigation'
);

assert.equal(
    isQuranSegmentationNavigationAllowed({
        hasUnsavedSegment: false,
        editingSegment: null,
        pageVerseKeys: ['1:1', '1:2', '1:3'],
        segments: []
    }),
    true,
    'untouched pages with no started segmentation should not trap the user'
);

console.log('quran segmentation guard tests passed');
