import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { fontLoader } from '@/utils/helpers/fontLoader';
import { dbLoader } from '@/utils/helpers/databaseLoader';
import QuranExamSegmentsService from '@/api/services/quranExamSegments.service';
import toastService from '@/utils/helpers/Toastservice';
import useLocale from '@/utils/hooks/global/useLocale';
import MushafPage from '@/components/quran/MushafPage';
import DeleteModal from '@/components/common/form/DeleteModal';
import { MdDelete, MdEdit } from 'react-icons/md';
import './SuggestedExamTemplates.css';

/**
 * Suggested Exam Templates Component
 * Allows creating and managing exam segments for each Juz
 */
const SuggestedExamTemplates = () => {
    const { t, currentLocale } = useLocale();
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    // Database state
    const [linesDb, setLinesDb] = useState(null);
    const [wordsDb, setWordsDb] = useState(null);
    const [surahData, setSurahData] = useState(null);

    // Form state
    const [selectedJuz, setSelectedJuz] = useState('');
    const [segmentsCount, setSegmentsCount] = useState('');
    const [selectedPage, setSelectedPage] = useState('');
    const [isActive, setIsActive] = useState(true);

    // Page display state
    const [pageLines, setPageLines] = useState([]);
    const [isFontLoading, setIsFontLoading] = useState(false);

    // Segments state
    const [segments, setSegments] = useState([]);
    const [segmentDisplayInfo, setSegmentDisplayInfo] = useState({}); // Store display info for each segment
    const [editingSegmentIndex, setEditingSegmentIndex] = useState(null);
    const [editingField, setEditingField] = useState(null); // 'start' or 'end'
    const [selectedAyahs, setSelectedAyahs] = useState(new Set());
    const [isLoadingFromApi, setIsLoadingFromApi] = useState(false); // Flag to prevent useEffect from clearing loaded data
    const [originalSegments, setOriginalSegments] = useState([]); // Store original segments to track changes

    // Loading & error states
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [error, setError] = useState(null);
    const [existingData, setExistingData] = useState(null);
    const [juzPagesData, setJuzPagesData] = useState([]);

    // Initialize databases and load juz pages data
    useEffect(() => {
        initializeDatabases();
        loadJuzPagesData();
        return () => dbLoader.cleanup();
    }, []);

    /**
     * Load juz pages data from JSON file
     */
    const loadJuzPagesData = async () => {
        try {
            const response = await fetch('/data/juz_pages.json');
            const data = await response.json();
            setJuzPagesData(data);
        } catch (error) {
            console.error('Error loading juz pages data:', error);
            // Fallback to empty array
            setJuzPagesData([]);
        }
    };

    // Load existing data when juz is selected
    useEffect(() => {
        if (selectedJuz) {
            loadExistingData(parseInt(selectedJuz));
        } else {
            setExistingData(null);
            setSegments([]);
            setOriginalSegments([]);
            setSegmentsCount('');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedJuz]);

    // Update segments array when segmentsCount changes (only if not loading existing data)
    useEffect(() => {
        // Don't update if we're loading existing data from API
        if (isLoadingData || isLoadingFromApi) return;

        if (segmentsCount && parseInt(segmentsCount) > 0) {
            const count = parseInt(segmentsCount);

            // Only create new segments if current segments don't match the count
            // When count increases, append new empty segments to existing ones
            if (segments.length !== count) {
                setSegments(prevSegments => {
                    if (count > prevSegments.length) {
                        // Increasing count: append new empty segments
                        const newSegments = [...prevSegments];
                        for (let i = prevSegments.length; i < count; i++) {
                            newSegments.push({
                                first_verse_key: '',
                                last_verse_key: '',
                                order: i + 1
                            });
                        }
                        return newSegments;
                    } else {
                        // Decreasing count: keep only the first 'count' segments
                        // But only if they don't have data beyond the new count
                        const hasDataBeyondCount = prevSegments.slice(count).some(seg => seg.first_verse_key);
                        if (hasDataBeyondCount) {
                            // Don't allow decreasing if there's data beyond the new count
                            return prevSegments;
                        }
                        return prevSegments.slice(0, count);
                    }
                });
            }
        } else if (segmentsCount === '') {
            setSegments([]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [segmentsCount, isLoadingData, isLoadingFromApi]);

    // Load page when selectedPage changes
    useEffect(() => {
        if (selectedPage && linesDb && wordsDb && surahData) {
            loadPageWithFont(parseInt(selectedPage));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedPage, linesDb, wordsDb, surahData]);

    /**
     * Initialize databases
     */
    const initializeDatabases = async () => {
        try {
            setIsLoading(true);
            const { linesDb, wordsDb, surahData } = await dbLoader.initialize();
            setLinesDb(linesDb);
            setWordsDb(wordsDb);
            setSurahData(surahData);
            setIsLoading(false);
        } catch (err) {
            setError(`Error loading data: ${err.message}`);
            setIsLoading(false);
        }
    };

    /**
     * Load existing exam segments data
     */
    const loadExistingData = async (juzNumber) => {
        try {
            setIsLoadingData(true);
            setIsLoadingFromApi(true); // Set flag to prevent useEffect from interfering
            const response = await QuranExamSegmentsService.getExamSegmentsByJuz(juzNumber);

            // The service returns response.data from axios, which is: { data: [...], meta: {...} }
            // But based on the actual API response, it seems the service already unwraps it
            // So response is the array directly
            if (response && Array.isArray(response) && response.length > 0) {
                const data = response[0];

                setExistingData(data);
                setIsActive(data.is_active);

                // Set segments from existing data BEFORE setting segmentsCount
                // This prevents the useEffect from clearing the data
                if (data.items && Array.isArray(data.items) && data.items.length > 0) {
                    const sortedItems = [...data.items].sort((a, b) => a.order - b.order);

                    const newSegments = sortedItems.map(item => ({
                        first_verse_key: item.first_verse_key || '',
                        last_verse_key: item.last_verse_key || '',
                        order: item.order
                    }));

                    setSegments(newSegments);
                    // Store original segments to track changes
                    setOriginalSegments(JSON.parse(JSON.stringify(newSegments)));

                    // Load display info for segments
                    loadSegmentDisplayInfo(newSegments);
                } else {
                    // No items, create empty segments based on count
                    const count = data.segments_count || 0;
                    const emptySegments = Array.from({ length: count }, (_, i) => ({
                        first_verse_key: '',
                        last_verse_key: '',
                        order: i + 1
                    }));
                    setSegments(emptySegments);
                    setOriginalSegments(JSON.parse(JSON.stringify(emptySegments)));
                    setSegmentDisplayInfo({});
                }

                // Set segmentsCount AFTER setting segments to prevent useEffect from clearing
                setSegmentsCount(data.segments_count.toString());
            } else {
                setExistingData(null);
                setSegments([]);
                setOriginalSegments([]);
                setSegmentsCount('');
            }
        } catch (error) {
            console.error('Error loading existing data:', error);
            setExistingData(null);
        } finally {
            setIsLoadingData(false);
            // Clear flag after a short delay to allow state updates to complete
            setTimeout(() => setIsLoadingFromApi(false), 100);
        }
    };

    /**
     * Load page with font wait
     */
    const loadPageWithFont = async (pageNum) => {
        try {
            setIsFontLoading(true);
            fontLoader.loadPageFont(pageNum);

            if (document.fonts) {
                await document.fonts.load(`1em QuranicFont-${pageNum}`);
                await new Promise(resolve => setTimeout(resolve, 100));
            } else {
                await new Promise(resolve => setTimeout(resolve, 300));
            }

            loadPage(pageNum);
            setIsFontLoading(false);
        } catch (error) {
            console.error('Error loading font:', error);
            loadPage(pageNum);
            setIsFontLoading(false);
        }
    };

    /**
     * Load page data
     */
    const loadPage = (pageNum) => {
        if (!linesDb) return;

        try {
            const query = `SELECT * FROM pages WHERE page_number = ${pageNum} ORDER BY line_number`;
            const result = linesDb.exec(query);

            if (result.length === 0 || result[0].values.length === 0) {
                setPageLines([]);
                return;
            }

            const columns = result[0].columns;
            const rows = result[0].values;

            const lines = rows.map(row => {
                const line = {};
                columns.forEach((col, idx) => {
                    line[col] = row[idx];
                });
                return line;
            });

            setPageLines(lines);
            setSelectedAyahs(new Set());
        } catch (err) {
            setError(`Error loading page: ${err.message}`);
        }
    };

    /**
     * Get available pages for selected juz
     */
    const getJuzPages = useMemo(() => {
        if (!selectedJuz || !juzPagesData || juzPagesData.length === 0) return [];
        const juzInfo = juzPagesData.find(j => j.juz === parseInt(selectedJuz));
        if (!juzInfo) return [];

        const pages = [];
        for (let i = juzInfo.start_page; i <= juzInfo.end_page; i++) {
            pages.push(i);
        }
        return pages;
    }, [selectedJuz, juzPagesData]);


    /**
     * Handle word click for verse selection
     */
    const handleWordClick = (wordId, location) => {
        if (!location) return;
        if (editingSegmentIndex === null || !editingField) return;

        const [surah, ayah] = location.split(':');
        const surahAyah = `${surah}:${ayah}`;

        const newSegments = [...segments];
        if (editingField === 'start') {
            newSegments[editingSegmentIndex] = {
                ...newSegments[editingSegmentIndex],
                first_verse_key: surahAyah
            };
        } else if (editingField === 'end') {
            newSegments[editingSegmentIndex] = {
                ...newSegments[editingSegmentIndex],
                last_verse_key: surahAyah
            };
        }

        setSegments(newSegments);
        const currentIndex = editingSegmentIndex;
        
        // Clear editing mode after selection
        setEditingSegmentIndex(null);
        setEditingField(null);
        setSelectedAyahs(new Set());

        toastService.success(`${t('exam_templates.verseSelected')}: ${surahAyah}`);

        // Update display info for this segment
        const firstInfo = getSegmentDisplayInfo(newSegments[currentIndex].first_verse_key, null);
        const lastInfo = newSegments[currentIndex].last_verse_key
            ? getSegmentDisplayInfo(newSegments[currentIndex].last_verse_key, null)
            : null;

        setSegmentDisplayInfo(prev => ({
            ...prev,
            [currentIndex]: {
                first: firstInfo,
                last: lastInfo
            }
        }));
    };

    /**
     * Start editing segment field
     */
    const startEditing = (index, field) => {
        // Block editing if this is a saved segment (exists in originalSegments)
        if (existingData && originalSegments[index] && originalSegments[index].first_verse_key) {
            toastService.warning(t('exam_templates.cannotEditSavedSegment'));
            return;
        }
        
        setEditingSegmentIndex(index);
        setEditingField(field);
        setSelectedAyahs(new Set());
        const message = field === 'start'
            ? t('exam_templates.clickFirstAyah')
            : t('exam_templates.clickLastAyah');
        toastService.info(message);
    };

    /**
     * Remove a segment (only for new/unsaved segments)
     */
    const handleRemoveSegment = (index) => {
        // Only allow removing if it's a new record (no existingData) or if the segment is not in originalSegments
        if (existingData && originalSegments[index] && originalSegments[index].first_verse_key) {
            toastService.warning(t('exam_templates.cannotRemoveSavedSegment'));
            return;
        }

        const newSegments = segments.filter((_, i) => i !== index);
        setSegments(newSegments);
        setSegmentsCount(newSegments.length.toString());
        
        // Update segment display info - shift indices for segments after the removed one
        const newDisplayInfo = {};
        newSegments.forEach((seg, i) => {
            // For segments before the removed index, keep same index
            // For segments after the removed index, shift index by -1
            const sourceIndex = i < index ? i : i + 1;
            if (segmentDisplayInfo[sourceIndex]) {
                newDisplayInfo[i] = segmentDisplayInfo[sourceIndex];
            }
        });
        setSegmentDisplayInfo(newDisplayInfo);
        
        // Update original segments reference
        if (originalSegments.length > 0) {
            const newOriginalSegments = originalSegments.filter((_, i) => i !== index);
            setOriginalSegments(newOriginalSegments);
        }
    };

    /**
     * Check if verse is used in other segments
     */
    const isVerseUsed = useCallback((location) => {
        if (!location || editingSegmentIndex === null) return false;

        const [surah, ayah] = location.split(':');
        const verseKey = `${surah}:${ayah}`;

        // Check if this verse is already used in other segments
        for (let i = 0; i < segments.length; i++) {
            if (i === editingSegmentIndex) continue;
            const seg = segments[i];
            if (!seg.first_verse_key || !seg.last_verse_key) continue;

            const [startSurah, startAyah] = seg.first_verse_key.split(':').map(Number);
            const [endSurah, endAyah] = seg.last_verse_key.split(':').map(Number);

            for (let s = startSurah; s <= endSurah; s++) {
                const startA = (s === startSurah) ? startAyah : 1;
                const endA = (s === endSurah) ? endAyah : 999;

                for (let a = startA; a <= endA; a++) {
                    if (`${s}:${a}` === verseKey) {
                        return true;
                    }
                }
            }
        }

        return false;
    }, [segments, editingSegmentIndex]);

    /**
     * Extract verse number from verse_key
     */
    const getVerseNumber = (verseKey) => {
        if (!verseKey) return '';
        const parts = verseKey.split(':');
        return parts.length > 1 ? parts[1] : verseKey;
    };

    /**
     * Get surah name from surah number
     */
    const getSurahName = useCallback((surahNumber) => {
        if (!surahNumber || !surahData || !surahData[surahNumber]) return '';
        const surah = surahData[surahNumber];
        return currentLocale === 'ar'
            ? (surah.name_arabic || surah.name || '')
            : (surah.name_simple || surah.name || '');
    }, [surahData, currentLocale]);

    /**
     * Get page number from verse key
     */
    const getPageFromVerseKey = useCallback((verseKey) => {
        if (!verseKey || !wordsDb || !linesDb) return null;

        try {
            const [surah, ayah] = verseKey.split(':').map(Number);
            // Query to find a word with this surah:ayah
            const query = `SELECT id FROM words WHERE location LIKE '${surah}:${ayah}:%' LIMIT 1`;
            const result = wordsDb.exec(query);

            if (result.length > 0 && result[0].values.length > 0) {
                const wordId = result[0].values[0][0];
                // Get page from lines database - find which page contains this word
                const pageQuery = `SELECT page_number FROM pages WHERE first_word_id <= ${wordId} AND last_word_id >= ${wordId} LIMIT 1`;
                const pageResult = linesDb.exec(pageQuery);

                if (pageResult && pageResult.length > 0 && pageResult[0].values.length > 0) {
                    return pageResult[0].values[0][0];
                }
            }
        } catch (error) {
            console.error('Error getting page from verse key:', error);
        }

        return null;
    }, [wordsDb, linesDb]);

    /**
     * Get segment display info (page, surah, ayah)
     */
    const getSegmentDisplayInfo = useCallback((firstVerseKey, lastVerseKey) => {
        if (!firstVerseKey) return { page: null, surah: '', ayah: '' };

        const [surahNum, ayahNum] = firstVerseKey.split(':').map(Number);
        const surahName = getSurahName(surahNum);
        const page = getPageFromVerseKey(firstVerseKey);

        let ayahDisplay = ayahNum.toString();
        if (lastVerseKey) {
            const [, lastAyah] = lastVerseKey.split(':').map(Number);
            if (lastAyah !== ayahNum) {
                ayahDisplay = `${ayahNum} - ${lastAyah}`;
            }
        }

        return {
            page,
            surah: surahName,
            ayah: ayahDisplay
        };
    }, [getSurahName, getPageFromVerseKey]);

    /**
     * Load display info for all segments
     */
    const loadSegmentDisplayInfo = (segmentsToLoad) => {
        const info = {};
        for (let i = 0; i < segmentsToLoad.length; i++) {
            const seg = segmentsToLoad[i];
            if (seg.first_verse_key) {
                const firstInfo = getSegmentDisplayInfo(seg.first_verse_key, null);
                const lastInfo = seg.last_verse_key ? getSegmentDisplayInfo(seg.last_verse_key, null) : null;
                info[i] = {
                    first: firstInfo,
                    last: lastInfo
                };
            }
        }
        setSegmentDisplayInfo(info);
    };

    /**
     * Handle form submission
     */
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedJuz || !segmentsCount) {
            toastService.warning(t('exam_templates.selectJuzAndCount'));
            return;
        }

        // Validate all segments have at least first_verse_key
        const invalidSegments = segments.filter(seg => !seg.first_verse_key);
        if (invalidSegments.length > 0) {
            toastService.warning(t('exam_templates.selectFirstVerse'));
            return;
        }

        try {
            setIsSaving(true);

            const payload = {
                juz_number: parseInt(selectedJuz),
                segments_count: parseInt(segmentsCount),
                is_active: isActive ? 1 : 0,
                items: segments.map((seg, index) => ({
                    first_verse_key: seg.first_verse_key,
                    last_verse_key: seg.last_verse_key || null,
                    order: index + 1
                }))
            };

            // Use PUT if updating existing data, POST if creating new
            if (existingData && existingData.id) {
                await QuranExamSegmentsService.updateExamSegments(existingData.id, payload);
            } else {
                await QuranExamSegmentsService.createOrUpdateExamSegments(payload);
            }

            toastService.success(t('exam_templates.saveSuccess'));

            // Clear editing state
            setEditingSegmentIndex(null);
            setEditingField(null);
            setSelectedAyahs(new Set());

            // Reload data
            await loadExistingData(parseInt(selectedJuz));
            // Update original segments after save
            setOriginalSegments(JSON.parse(JSON.stringify(segments)));
        } catch (error) {
            console.error('Error saving exam segments:', error);
            const errorMessage = error.response?.data?.message || error.message || t('exam_templates.saveFailed');
            toastService.error(errorMessage);
        } finally {
            setIsSaving(false);
        }
    };

    /**
     * Handle delete confirmation
     */
    const handleDeleteClick = () => {
        if (!existingData || !existingData.id) {
            toastService.warning(t('exam_templates.noDataToDelete'));
            return;
        }
        setIsDeleteModalOpen(true);
    };

    /**
     * Handle delete
     */
    const handleDelete = async () => {
        if (!existingData || !existingData.id) {
            toastService.warning(t('exam_templates.noDataToDelete'));
            return;
        }

        try {
            setIsSaving(true);
            await QuranExamSegmentsService.deleteExamSegments(existingData.id);
            toastService.success(t('exam_templates.deleteSuccess'));

            // Clear form
            setExistingData(null);
            setSegments([]);
            setOriginalSegments([]);
            setSegmentsCount('');
            setSelectedJuz('');
            setSelectedPage('');
            setPageLines([]);

            // Close modal
            setIsDeleteModalOpen(false);
        } catch (error) {
            console.error('Error deleting exam segments:', error);
            const errorMessage = error.response?.data?.message || error.message || t('exam_templates.deleteFailed');
            toastService.error(errorMessage);
        } finally {
            setIsSaving(false);
        }
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="suggested-exam-templates loading">
                <div className="spinner"></div>
                <p>Loading data...</p>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="suggested-exam-templates error">
                <h2>Error</h2>
                <p>{error}</p>
                <button onClick={() => window.location.reload()}>Retry</button>
            </div>
        );
    }

    return (
        <div className="suggested-exam-templates">
            {/* Header */}
            <div className="header">
                <h1>{t('exam_templates.title')}</h1>

                {/* Form Header */}
                <form className="form-header" onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="form-group">
                            <label>{t('exam_templates.juz')}:</label>
                            <select
                                value={selectedJuz}
                                onChange={(e) => {
                                    setSelectedJuz(e.target.value);
                                    setSelectedPage('');
                                    setPageLines([]);
                                }}
                                required
                            >
                                <option value="">{t('exam_templates.selectJuz')}</option>
                                {Array.from({ length: 30 }, (_, i) => i + 1).map(juz => (
                                    <option key={juz} value={juz}>
                                        {currentLocale === 'ar' ? `الجزء ${juz}` : `Juz ${juz}`}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>{t('exam_templates.segmentsCount')}:</label>
                            <input
                                type="number"
                                min="1"
                                value={segmentsCount}
                                onChange={(e) => {
                                    const newValue = e.target.value;
                                    // Allow empty value for clearing
                                    if (newValue === '') {
                                        setSegmentsCount('');
                                        return;
                                    }
                                    const newCount = parseInt(newValue);
                                    if (newCount <= 0) {
                                        return;
                                    }
                                    // Prevent decreasing if there are segments with data
                                    if (segments.length > 0 && newCount < segments.length) {
                                        const hasDataSegments = segments.filter(seg => seg.first_verse_key).length;
                                        if (hasDataSegments > newCount) {
                                            toastService.warning(t('exam_templates.cannotDecreaseSegments'));
                                            return;
                                        }
                                    }
                                    setSegmentsCount(newValue);
                                }}
                                readOnly={!!existingData}
                                required
                            />
                        </div>

                        {selectedJuz && (
                            <div className="form-group">
                                <label>{t('exam_templates.page')}:</label>
                                <select
                                    value={selectedPage}
                                    onChange={(e) => setSelectedPage(e.target.value)}
                                >
                                    <option value="">{t('exam_templates.selectPage')}</option>
                                    {getJuzPages.map(page => (
                                        <option key={page} value={page}>
                                            {page}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <div className="form-group items-center gap-2 checkbox-group">
                            <input
                                type="checkbox"
                                checked={isActive}
                                onChange={(e) => setIsActive(e.target.checked)}
                                id='is_active'
                            />
                            <label className='w-fit' htmlFor='is_active'>
                                {t('exam_templates.active')}
                            </label>

                        </div>
                    </div>

                    <div className="instruction-text">
                        <p>{t('exam_templates.instruction')}</p>
                    </div>
                </form>
            </div>

            {/* Main Content */}
            <div className="main-content">
                {/* Segments Table (Left) */}
                <div className="segments-panel">
                    <div className="panel-header">
                        <h2>{t('exam_templates.defineSegments')}</h2>
                    </div>

                    {isLoadingData ? (
                        <div className="loading-state">
                            <div className="spinner"></div>
                            <p>{t('exam_templates.loadingSegments')}</p>
                        </div>
                    ) : (
                        <table className="segments-table border rounded-md">
                            <thead>
                                <tr>
                                    <th>{t('exam_templates.segment')}</th>
                                    <th>{t('exam_templates.fromVerse')}</th>
                                    <th>{t('exam_templates.toVerse')}</th>
                                    {!existingData && segments.length > 0 && (
                                        <th>{t('exam_templates.actions')}</th>
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {segments.length === 0 ? (
                                    <tr>
                                        <td colSpan={existingData ? "3" : "4"} style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                                            {t('exam_templates.noSegments')}
                                        </td>
                                    </tr>
                                ) : (
                                    segments.map((segment, index) => {
                                        // Check if this segment is from saved data
                                        const isSavedSegment = existingData && originalSegments[index] && originalSegments[index].first_verse_key;
                                        
                                        return (
                                            <tr key={index}>
                                                <td style={{ textAlign: "center" }}>
                                                    {currentLocale === 'ar'
                                                        ? ['الأول', 'الثاني', 'الثالث', 'الرابع', 'الخامس', 'السادس', 'السابع', 'الثامن', 'التاسع', 'العاشر'][index] || `مقطع ${index + 1}`
                                                        : `Segment ${index + 1}`
                                                    }
                                                </td>
                                                <td style={{ textAlign: "center" }}>
                                                    {segment.first_verse_key ? (
                                                        <div className="verse-display" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                                                            <div>
                                                                {segmentDisplayInfo[index] && segmentDisplayInfo[index].first ? (
                                                                    <>
                                                                        <div><strong>{t('exam_templates.page')}:</strong> {segmentDisplayInfo[index].first.page || '-'}</div>
                                                                        <div><strong>{t('exam_templates.surah')}:</strong> {segmentDisplayInfo[index].first.surah || '-'}</div>
                                                                        <div><strong>{t('exam_templates.ayah')}:</strong> {segmentDisplayInfo[index].first.ayah || getVerseNumber(segment.first_verse_key)}</div>
                                                                    </>
                                                                ) : (
                                                                    <span>{getVerseNumber(segment.first_verse_key)}</span>
                                                                )}
                                                            </div>
                                                            {!isSavedSegment && (
                                                                <button
                                                                    type="button"
                                                                    className="btn-icon"
                                                                    onClick={() => {
                                                                        if (!selectedPage) {
                                                                            toastService.warning(t('exam_templates.selectPageFirst'));
                                                                            return;
                                                                        }
                                                                        startEditing(index, 'start');
                                                                    }}
                                                                    title={t('exam_templates.editStart')}
                                                                >
                                                                    <MdEdit className="text-blue-600" size={20} />
                                                                </button>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <button
                                                            type="button"
                                                            className="btn-select"
                                                            onClick={() => {
                                                                if (!selectedPage) {
                                                                    toastService.warning(t('exam_templates.selectPageFirst'));
                                                                    return;
                                                                }
                                                                startEditing(index, 'start');
                                                            }}
                                                            disabled={isSavedSegment}
                                                        >
                                                            {t('exam_templates.clickFirstAyah')}
                                                        </button>
                                                    )}
                                                </td>
                                                <td style={{ textAlign: "center" }}>
                                                    {segment.last_verse_key ? (
                                                        <div className="verse-display" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                                                            <div>
                                                                {segmentDisplayInfo[index] && segmentDisplayInfo[index].last ? (
                                                                    <>
                                                                        <div><strong>{t('exam_templates.page')}:</strong> {segmentDisplayInfo[index].last.page || '-'}</div>
                                                                        <div><strong>{t('exam_templates.surah')}:</strong> {segmentDisplayInfo[index].last.surah || '-'}</div>
                                                                        <div><strong>{t('exam_templates.ayah')}:</strong> {segmentDisplayInfo[index].last.ayah || getVerseNumber(segment.last_verse_key)}</div>
                                                                    </>
                                                                ) : (
                                                                    <span>{getVerseNumber(segment.last_verse_key)}</span>
                                                                )}
                                                            </div>
                                                            {!isSavedSegment && (
                                                                <button
                                                                    type="button"
                                                                    className="btn-icon"
                                                                    onClick={() => {
                                                                        if (!selectedPage) {
                                                                            toastService.warning(t('exam_templates.selectPageFirst'));
                                                                            return;
                                                                        }
                                                                        startEditing(index, 'end');
                                                                    }}
                                                                    title={t('exam_templates.editEnd')}
                                                                >
                                                                    <MdEdit className="text-blue-600" size={20} />
                                                                </button>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <div className="teacher-dependent-message" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                                                            <span className="message-text">{t('exam_templates.teacherDetermines')}</span>
                                                            {!isSavedSegment && (
                                                                <button
                                                                    type="button"
                                                                    className="btn-select-small"
                                                                    onClick={() => {
                                                                        if (!selectedPage) {
                                                                            toastService.warning(t('exam_templates.selectPageFirst'));
                                                                            return;
                                                                        }
                                                                        startEditing(index, 'end');
                                                                    }}
                                                                    title={t('exam_templates.clickLastAyah')}
                                                                >
                                                                    {t('exam_templates.optionalSelect')}
                                                                </button>
                                                            )}
                                                        </div>
                                                    )}
                                                </td>
                                                {!existingData && segments.length > 0 && (
                                                    <td style={{ textAlign: "center" }}>
                                                        <button
                                                            type="button"
                                                            className="btn-icon"
                                                            onClick={() => handleRemoveSegment(index)}
                                                            title={t('exam_templates.removeSegment')}
                                                        >
                                                            <MdDelete className="text-red-600" size={20} />
                                                        </button>
                                                    </td>
                                                )}
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    )}

                    {editingSegmentIndex !== null && editingField && (
                        <div className="editing-notice">
                            ⚠️ {t('exam_templates.editingNotice')} {editingField === 'start' ? t('mushaf_management.start') : t('mushaf_management.end')} {t('mushaf_management.inQuran')}
                            <button
                                type="button"
                                onClick={() => {
                                    setEditingSegmentIndex(null);
                                    setEditingField(null);
                                    setSelectedAyahs(new Set());
                                }}
                            >
                                {t('exam_templates.cancel')}
                            </button>
                        </div>
                    )}

                    <div className="footer-info">
                        <p>{t('exam_templates.footerInfo')}</p>
                    </div>

                    <div className="form-actions flex gap-2 justify-center items-center">
                        {(() => {
                            // Check if there are unsaved changes
                            const hasChanges = JSON.stringify(segments) !== JSON.stringify(originalSegments) ||
                                             (existingData && existingData.is_active !== isActive) ||
                                             (existingData && existingData.segments_count !== parseInt(segmentsCount));
                            
                            // Only show save button if there are changes or if it's a new record
                            if (!hasChanges && existingData) {
                                return null;
                            }
                            
                            return (
                                <button
                                    type="submit"
                                    className="btn-save"
                                    onClick={handleSubmit}
                                    disabled={isSaving || !selectedJuz || !segmentsCount || segments.length === 0}
                                >
                                    {isSaving ? t('exam_templates.saving') : t('exam_templates.saveRecord')}
                                </button>
                            );
                        })()}
                        {existingData && existingData.id && (
                            <button
                                type="button"
                                className="btn-delete flex items-center gap-2"
                                onClick={handleDeleteClick}
                                disabled={isSaving}
                            >
                                <MdDelete size={20} />
                                {t('exam_templates.deleteRecord')}
                            </button>
                        )}
                    </div>
                </div>

                {/* Quran Page (Right) */}
                {selectedPage && (
                    <div className="quran-panel">
                        <MushafPage
                            pageLines={pageLines}
                            currentPage={parseInt(selectedPage)}
                            wordsDb={wordsDb}
                            surahData={surahData}
                            selectedAyahs={selectedAyahs}
                            onWordClick={handleWordClick}
                            isVerseUsed={isVerseUsed}
                            editingSegment={editingSegmentIndex !== null ? { index: editingSegmentIndex, field: editingField } : null}
                            isFontLoading={isFontLoading}
                        />
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && (
                <DeleteModal
                    deleteFn={handleDelete}
                    loading={isSaving}
                    onClose={() => setIsDeleteModalOpen(false)}
                    message={t('exam_templates.deleteConfirm')}
                />
            )}
        </div>
    );
};

export default SuggestedExamTemplates;

