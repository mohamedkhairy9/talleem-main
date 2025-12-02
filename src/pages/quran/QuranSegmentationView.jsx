import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fontLoader } from '@/utils/helpers/fontLoader';
import './QuranSegmentationView.css';
import { dbLoader } from '@/utils/helpers/databaseLoader';
import QuranSegmentsService from '@/api/services/quranSegments.service';
import toastService from '@/utils/helpers/Toastservice';
import { FaEye } from 'react-icons/fa';
import useLocale from '@/utils/hooks/global/useLocale';
import DeleteModal from '@/components/common/form/DeleteModal';

// Juz starting pages in standard Madani Mushaf
const JUZ_START_PAGES = [
    1, 22, 42, 62, 82, 102, 121, 142, 162, 182,
    201, 222, 242, 262, 282, 302, 322, 342, 362, 382,
    402, 422, 442, 462, 482, 502, 522, 542, 562, 582
];

/**
 * Quran Segmentation View Component
 * Displays Quran page on right, segments table on left
 * Allows viewing and editing segments
 */
const QuranSegmentationView = () => {
    const { t, currentLocale } = useLocale();
    const [searchParams, setSearchParams] = useSearchParams();
    
    // Get initial page from URL or default to 1
    const getInitialPage = () => {
        const pageParam = searchParams.get('page');
        if (pageParam) {
            const page = parseInt(pageParam);
            if (page >= 1 && page <= 604) {
                return page;
            }
        }
        return 1;
    };
    
    // Database state
    const [linesDb, setLinesDb] = useState(null);
    const [wordsDb, setWordsDb] = useState(null);
    const [surahData, setSurahData] = useState(null);
    
    // UI state
    const [currentPage, setCurrentPageState] = useState(getInitialPage);
    const [pageLines, setPageLines] = useState([]);
    const [segments, setSegments] = useState([]);
    const [config, setConfig] = useState(null);
    
    // Update page and URL together
    const setCurrentPage = useCallback((pageOrFn) => {
        setCurrentPageState(prevPage => {
            const newPage = typeof pageOrFn === 'function' ? pageOrFn(prevPage) : pageOrFn;
            // Update URL without causing a re-render loop
            setSearchParams({ page: newPage.toString() }, { replace: true });
            return newPage;
        });
    }, [setSearchParams]);
    
    // Selection state
    const [editingSegment, setEditingSegment] = useState(null);
    const [selectedAyahs, setSelectedAyahs] = useState(new Set());
    
    // Track unsaved segment
    const [hasUnsavedSegment, setHasUnsavedSegment] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    
    // Loading states
    const [isLoading, setIsLoading] = useState(true);
    const [isFontLoading, setIsFontLoading] = useState(false);
    const [isSegmentsLoading, setIsSegmentsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Initialize databases
    useEffect(() => {
        initializeDatabases();
        return () => dbLoader.cleanup();
    }, []);

    // Sync URL on initial load if no page param
    useEffect(() => {
        if (!searchParams.get('page')) {
            setSearchParams({ page: currentPage.toString() }, { replace: true });
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Load page and segments when page changes
    useEffect(() => {
        if (linesDb && wordsDb && surahData) {
            loadPageWithFont(currentPage);
            fetchSegments(currentPage);
            fetchConfig();
        }
    }, [currentPage, linesDb, wordsDb, surahData]);

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
            setError(`${t('mushaf_management.loadError')}: ${err.message}`);
            setIsLoading(false);
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
        } catch (err) {
            setError(`${t('mushaf_management.loadError')}: ${err.message}`);
        }
    };

    /**
     * Fetch segments for current page
     */
    const fetchSegments = async (pageNum) => {
        try {
            setIsSegmentsLoading(true);
            const response = await QuranSegmentsService.getSegmentsByPage(pageNum);
            
            // Handle different response formats
            let segs = [];
            if (Array.isArray(response)) {
                segs = response;
            } else if (response && Array.isArray(response.data)) {
                segs = response.data;
            } else if (response && response.data && Array.isArray(response.data.data)) {
                segs = response.data.data;
            }
            
            // Sort segments by verse number (surah first, then ayah)
            const sortedSegs = [...segs].sort((a, b) => {
                // Parse first_verse_key (format: "surah:ayah" e.g., "2:17")
                const getVerseOrder = (segment) => {
                    // Use from_verse if available, otherwise parse first_verse_key
                    if (segment.from_verse !== undefined) {
                        const surah = segment.surah_number || 1;
                        return surah * 1000 + segment.from_verse;
                    }
                    
                    if (segment.first_verse_key) {
                        const [surah, ayah] = segment.first_verse_key.split(':').map(Number);
                        return surah * 1000 + ayah;
                    }
                    
                    return Infinity; // Put segments without verse info at the end
                };
                
                return getVerseOrder(a) - getVerseOrder(b);
            });
            
            setSegments(sortedSegs);
            setHasUnsavedSegment(false); // Reset unsaved state when fetching fresh data
        } catch (error) {
            console.error('Error fetching segments:', error);
            setSegments([]);
        } finally {
            setIsSegmentsLoading(false);
        }
    };

    /**
     * Fetch configuration (segments per page)
     */
    const fetchConfig = async () => {
        try {
            // TODO: Replace with actual config API
            const mockConfig = {
                segments_per_page: 'variable'
            };
            
            setConfig(mockConfig);
        } catch (error) {
            console.error('Error fetching config:', error);
            setConfig({ segments_per_page: 'variable' });
        }
    };

    /**
     * Get words for line
     */
    const getWordsForLine = (firstWordId, lastWordId) => {
        if (!wordsDb) return [];

        try {
            const query = `SELECT id, text, location FROM words WHERE id >= ${firstWordId} AND id <= ${lastWordId} ORDER BY id`;
            const result = wordsDb.exec(query);

            if (result.length > 0 && result[0].values.length > 0) {
                return result[0].values.map(row => ({
                    id: row[0],
                    text: row[1],
                    location: row[2]
                }));
            }
        } catch (error) {
            console.error('Error fetching words:', error);
        }

        return [];
    };

    /**
     * Get surah name
     */
    const getSurahName = (surahNumber) => {
        if (!surahData || !surahData[surahNumber]) return '';
        const surah = surahData[surahNumber];
        return surah.glyph || (surah.name_arabic ? `سُورَةُ ${surah.name_arabic}` : surah.name || '');
    };

    /**
     * Current page info (Juz and Surah)
     */
    const currentPageInfo = useMemo(() => {
        // Get Juz number from page number
        let juzNumber = 1;
        for (let i = JUZ_START_PAGES.length - 1; i >= 0; i--) {
            if (currentPage >= JUZ_START_PAGES[i]) {
                juzNumber = i + 1;
                break;
            }
        }

        let surahNumber = null;
        
        // Check if page has a surah_name line from the database
        const surahNameLine = pageLines.find(line => line.line_type === 'surah_name');
        
        if (surahNameLine && surahNameLine.surah_number && wordsDb) {
            // Verify the new surah has at least one ayah on this page
            const newSurahNumber = surahNameLine.surah_number;
            
            // Find ayah lines and check if any belong to the new surah
            const ayahLines = pageLines.filter(line => line.line_type === 'ayah');
            let hasAyahFromNewSurah = false;
            
            for (const ayahLine of ayahLines) {
                try {
                    const query = `SELECT location FROM words WHERE id = ${ayahLine.first_word_id} LIMIT 1`;
                    const result = wordsDb.exec(query);
                    
                    if (result.length > 0 && result[0].values.length > 0) {
                        const location = result[0].values[0][0];
                        if (location) {
                            const [surahNum] = location.split(':').map(Number);
                            if (surahNum === newSurahNumber) {
                                hasAyahFromNewSurah = true;
                                break;
                            }
                        }
                    }
                } catch (error) {
                    console.error('Error checking ayah surah:', error);
                }
            }
            
            if (hasAyahFromNewSurah) {
                // New surah has at least one ayah on this page
                surahNumber = newSurahNumber;
            }
        }
        
        // Fallback: Get surah info from first word of the page
        if (!surahNumber && wordsDb && pageLines.length) {
            const firstAyahLine = pageLines.find(line => line.line_type === 'ayah');
            if (firstAyahLine) {
                try {
                    const query = `SELECT location FROM words WHERE id = ${firstAyahLine.first_word_id} LIMIT 1`;
                    const result = wordsDb.exec(query);

                    if (result.length > 0 && result[0].values.length > 0) {
                        const location = result[0].values[0][0]; // e.g., "2:17:1"
                        if (location) {
                            const [surahNum] = location.split(':').map(Number);
                            surahNumber = surahNum;
                        }
                    }
                } catch (error) {
                    console.error('Error getting page surah info:', error);
                }
            }
        }
        
        let surahNameArabic = '';
        let surahNameEnglish = '';
        
        if (surahNumber && surahData && surahData[surahNumber]) {
            const surah = surahData[surahNumber];
            surahNameArabic = surah.name_arabic || '';
            surahNameEnglish = surah.name_simple || surah.name || '';
        }

        return {
            juz: juzNumber,
            surahNumber,
            surahNameArabic,
            surahNameEnglish,
            surahDisplayName: currentLocale === 'ar' ? surahNameArabic : surahNameEnglish
        };
    }, [currentPage, pageLines, wordsDb, surahData, currentLocale]);

    /**
     * Extract verse number from verse_key (e.g., "1:5" → "5")
     */
    const getVerseNumber = (verseKey) => {
        if (!verseKey) return '';
        const parts = verseKey.split(':');
        return parts.length > 1 ? parts[1] : verseKey;
    };

    /**
     * Handle word click for selection
     */
    const handleWordClick = (wordId, location) => {
        if (!editingSegment) return;
        if (!location) return;

        // Check if verse is already used
        if (isVerseUsed(location)) {
            toastService.warning(t('mushaf_management.verseAlreadyUsed'));
            return;
        }

        const [surah, ayah] = location.split(':');
        const surahAyah = `${surah}:${ayah}`;

        if (editingSegment.field === 'start') {
            setSelectedAyahs(new Set([surahAyah]));
            
            const newSegments = [...segments];
            newSegments[editingSegment.index] = {
                ...newSegments[editingSegment.index],
                first_verse_key: surahAyah
            };
            setSegments(newSegments);
            
            toastService.info(`${t('mushaf_management.startSelected')}: ${surahAyah}`);
            setEditingSegment(null);
            setSelectedAyahs(new Set());
        }
        else if (editingSegment.field === 'end') {
            setSelectedAyahs(new Set([surahAyah]));
            
            const newSegments = [...segments];
            newSegments[editingSegment.index] = {
                ...newSegments[editingSegment.index],
                last_verse_key: surahAyah
            };
            setSegments(newSegments);
            
            toastService.info(`${t('mushaf_management.endSelected')}: ${surahAyah}`);
            setEditingSegment(null);
            setSelectedAyahs(new Set());
        }
    };

    /**
     * Check if word is selected
     */
    const isWordSelected = (location) => {
        if (!location) return false;
        const [surah, ayah] = location.split(':');
        return selectedAyahs.has(`${surah}:${ayah}`);
    };

    /**
     * Get all used verses from existing segments
     */
    const getUsedVerses = () => {
        const usedVerses = new Set();
        
        segments.forEach(segment => {
            // Skip if segment is incomplete or is the one being edited
            if (!segment.first_verse_key || !segment.last_verse_key) return;
            
            // Skip if this is the segment we're currently editing
            if (editingSegment && segments[editingSegment.index]?.id === segment.id) return;
            
            const [startSurah, startAyah] = segment.first_verse_key.split(':').map(Number);
            const [endSurah, endAyah] = segment.last_verse_key.split(':').map(Number);
            
            // Add all verses in range
            for (let s = startSurah; s <= endSurah; s++) {
                const startA = (s === startSurah) ? startAyah : 1;
                const endA = (s === endSurah) ? endAyah : 999;
                
                for (let a = startA; a <= endA; a++) {
                    usedVerses.add(`${s}:${a}`);
                }
            }
        });
        
        return usedVerses;
    };

    /**
     * Check if verse is already used in another segment
     */
    const isVerseUsed = (location) => {
        if (!location) return false;
        if (!editingSegment) return false; // Only check when editing
        
        const [surah, ayah] = location.split(':');
        const verseKey = `${surah}:${ayah}`;
        
        const usedVerses = getUsedVerses();
        return usedVerses.has(verseKey);
    };

    /**
     * Start editing segment field
     */
    const startEditing = (index, field) => {
        setEditingSegment({ index, field });
        setSelectedAyahs(new Set());
        const message = field === 'start' ? t('mushaf_management.clickStart') : t('mushaf_management.clickEnd');
        toastService.info(message);
    };

    /**
     * View segment (highlight in Quran)
     */
    const viewSegment = (segment) => {
        if (!segment.first_verse_key || !segment.last_verse_key) {
            toastService.warning(t('mushaf_management.segmentIncomplete'));
            return;
        }

        const [startSurah, startAyah] = segment.first_verse_key.split(':').map(Number);
        const [endSurah, endAyah] = segment.last_verse_key.split(':').map(Number);

        const rangeAyahs = new Set();
        for (let s = startSurah; s <= endSurah; s++) {
            const startA = (s === startSurah) ? startAyah : 1;
            const endA = (s === endSurah) ? endAyah : 999;
            
            for (let a = startA; a <= endA; a++) {
                rangeAyahs.add(`${s}:${a}`);
            }
        }

        setSelectedAyahs(rangeAyahs);
        setEditingSegment(null);
        toastService.info(`${t('mushaf_management.viewingSegment')}: ${segment.first_verse_key} - ${segment.last_verse_key}`);
    };

    /**
     * Add new empty segment
     */
    const addNewSegment = () => {
        const newSegment = {
            id: null,
            page_number: currentPage,
            segment_number: segments.length + 1,
            first_verse_key: '',
            last_verse_key: '',
            is_active: 1
        };
        
        setSegments([...segments, newSegment]);
        setHasUnsavedSegment(true);
        toastService.info(t('mushaf_management.segmentAdded'));
    };
    
    /**
     * Check if there's an unsaved segment that can be saved
     */
    const canSaveSegment = () => {
        // Find the unsaved segment (segment without id)
        const unsavedSegment = segments.find(seg => !seg.id);
        return unsavedSegment && unsavedSegment.first_verse_key && unsavedSegment.last_verse_key;
    };
    
    /**
     * Save the current unsaved segment (global save)
     */
    const saveCurrentSegment = async () => {
        // Find the unsaved segment
        const unsavedIndex = segments.findIndex(seg => !seg.id);
        if (unsavedIndex === -1) {
            toastService.warning(t('mushaf_management.noUnsavedSegment'));
            return;
        }
        
        const segment = segments[unsavedIndex];
        
        if (!segment.first_verse_key || !segment.last_verse_key) {
            toastService.warning(t('mushaf_management.mustSelectBoth'));
            return;
        }

        try {
            setIsSaving(true);
            const segmentData = {
                first_verse_key: segment.first_verse_key,
                last_verse_key: segment.last_verse_key,
                page_number: currentPage,
                segment_number: unsavedIndex + 1
            };

            const result = await QuranSegmentsService.createSegment(segmentData);
            
            let newId = null;
            if (result && result.data && result.data.id) {
                newId = result.data.id;
            } else if (result && result.id) {
                newId = result.id;
            }
            
            if (newId) {
                const newSegments = [...segments];
                newSegments[unsavedIndex] = { ...segment, id: newId };
                setSegments(newSegments);
            }
            
            setHasUnsavedSegment(false);
            toastService.success(t('mushaf_management.segmentSaved'));
            await fetchSegments(currentPage);
            
        } catch (error) {
            if (error.response && error.response.status >= 200 && error.response.status < 300) {
                setHasUnsavedSegment(false);
                toastService.success(t('mushaf_management.segmentSaved'));
                await fetchSegments(currentPage);
            } else {
                const errorMessage = error.response?.data?.message || error.message || '';
                toastService.error(`${t('mushaf_management.saveFailed')}${errorMessage ? ': ' + errorMessage : ''}`);
            }
        } finally {
            setIsSaving(false);
        }
    };

    /**
     * Delete all segments for current page
     */
    const deleteAllPageSegments = async () => {
        try {
            setIsDeleting(true);
            await QuranSegmentsService.deletePageSegments(currentPage);
            toastService.success(t('mushaf_management.pageSegmentsDeleted'));
            setShowDeleteModal(false);
            await fetchSegments(currentPage);
        } catch (error) {
            console.error('Error deleting page segments:', error);
            const errorMessage = error.response?.data?.message || error.message || '';
            toastService.error(`${t('mushaf_management.deletePageFailed')}${errorMessage ? ': ' + errorMessage : ''}`);
        } finally {
            setIsDeleting(false);
        }
    };

    /**
     * Delete segment
     */
    // eslint-disable-next-line no-unused-vars
    const deleteSegment = async (segment, index) => {
        if (!window.confirm(t('mushaf_management.deleteConfirm'))) {
            return;
        }

        try {
            if (segment.id) {
                await QuranSegmentsService.deleteSegment(segment.id);
            }
            
            const newSegments = segments.filter((_, i) => i !== index);
            setSegments(newSegments);
            
            toastService.success(t('mushaf_management.segmentDeleted'));
        } catch (error) {
            console.error('Error deleting segment:', error);
            toastService.error(t('mushaf_management.deleteFailed'));
        }
    };

    /**
     * Render line
     */
    const renderLine = (line) => {
        switch (line.line_type) {
            case 'surah_name':
                return (
                    <div 
                        key={`${line.page_number}-${line.line_number}`} 
                        className={`line surah-name ${line.is_centered ? 'centered' : ''}`}
                    >
                        {getSurahName(line.surah_number)}
                    </div>
                );

            case 'basmallah':
                return (
                    <div 
                        key={`${line.page_number}-${line.line_number}`} 
                        className={`line basmallah ${line.is_centered ? 'centered' : ''}`}
                    >
                        ﷽
                    </div>
                );

            case 'ayah':
                { const words = getWordsForLine(line.first_word_id, line.last_word_id);
                return (
                    <div 
                        key={`${line.page_number}-${line.line_number}`} 
                        className={`line ayah centered ${line.is_centered ? 'centered' : ''}`}
                        ref={el => {
                            if (el) {
                                el.style.setProperty('font-family', `'QuranicFont-${currentPage}', Arial, sans-serif`, 'important');
                            }
                        }}
                    >
                        {words.map(word => {
                            const isUsed = isVerseUsed(word.location);
                            const isSelected = isWordSelected(word.location);
                            
                            return (
                                <span
                                    key={word.id}
                                    data-word-id={word.id}
                                    data-location={word.location}
                                    className={`word 
                                        ${isSelected ? 'selected' : ''} 
                                        ${editingSegment ? 'editable' : ''} 
                                        ${isUsed ? 'disabled' : ''}
                                    `}
                                    onClick={() => !isUsed && handleWordClick(word.id, word.location)}
                                    style={{ cursor: isUsed ? 'not-allowed' : (editingSegment ? 'pointer' : 'default') }}
                                    ref={el => {
                                        if (el) {
                                            el.style.setProperty('font-family', 'inherit', 'important');
                                        }
                                    }}
                                >
                                    {word.text}
                                </span>
                            );
                        })}
                    </div>
                ); }

            default:
                return null;
        }
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="segmentation-view loading">
                <div className="spinner"></div>
                <p>{t('mushaf_management.loadingData')}</p>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="segmentation-view error">
                <h2>{t('mushaf_management.loadError')}</h2>
                <p>{error}</p>
                <button onClick={() => window.location.reload()}>{t('mushaf_management.retry')}</button>
            </div>
        );
    }

    return (
        <div className="segmentation-view">
            {/* Header */}
            <div className="header">
                <h1>{t('mushaf_management.title')}</h1>
                
                {/* Page Info - Juz and Surah */}
                <div className="page-info">
                    {currentPageInfo.juz && (
                        <span className="juz-info">
                            {t('mushaf_management.juz')}: {currentPageInfo.juz}
                        </span>
                    )}
                    {currentPageInfo.surahDisplayName && (
                        <span className="surah-info">
                            {t('mushaf_management.surah')}: {currentPageInfo.surahDisplayName}
                        </span>
                    )}
                </div>

                <div className="page-navigation">
                    <button 
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                    >
                        ← {t('mushaf_management.previous')}
                    </button>
                    
                    <div className="page-input">
                        <label>{t('mushaf_management.page')}:</label>
                        <select
                            value={currentPage}
                            onChange={(e) => setCurrentPage(parseInt(e.target.value))}
                            className="page-select"
                        >
                            {Array.from({ length: 604 }, (_, i) => i + 1).map(page => (
                                <option key={page} value={page}>
                                    {page}
                                </option>
                            ))}
                        </select>
                        <span>{t('mushaf_management.of')} 604</span>
                    </div>

                    <button 
                        onClick={() => setCurrentPage(p => Math.min(604, p + 1))}
                        disabled={currentPage === 604}
                    >
                        {t('mushaf_management.next')} →
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="main-content">
                {/* Segments Table (Left) */}
                <div className="segments-panel">
                    <div className="panel-header">
                        <h2>{t('mushaf_management.segments')}</h2>
                        <div className="panel-actions">
                            {config?.segments_per_page === 'variable' && (
                                <button 
                                    className="btn-add" 
                                    onClick={addNewSegment}
                                    disabled={hasUnsavedSegment}
                                    title={hasUnsavedSegment ? t('mushaf_management.saveCurrentFirst') : ''}
                                >
                                    + {t('mushaf_management.addSegment')}
                                </button>
                            )}
                            {hasUnsavedSegment && (
                                <button 
                                    className="btn-save-global"
                                    onClick={saveCurrentSegment}
                                    disabled={!canSaveSegment() || isSaving}
                                    title={!canSaveSegment() ? t('mushaf_management.mustSelectBoth') : t('common.save')}
                                >
                                    {isSaving ? t('common.saving') : t('common.save')}
                                </button>
                            )}
                            {segments.length > 0 && !hasUnsavedSegment && (
                                <button 
                                    className="btn-delete-page"
                                    onClick={() => setShowDeleteModal(true)}
                                    title={t('mushaf_management.deletePageSegments')}
                                >
                                    {t('mushaf_management.deletePageSegments')}
                                </button>
                            )}
                        </div>
                    </div>

                    <table className="segments-table">
                        <thead>
                            <tr>
                                <th style={{textAlign: "center"}}>{t('mushaf_management.segmentColumn')}</th>
                                <th style={{textAlign: "center"}}>{t('mushaf_management.fromVerse')}</th>
                                <th style={{textAlign: "center"}}>{t('mushaf_management.toVerse')}</th>
                                <th style={{textAlign: "center"}}>{t('mushaf_management.actions')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isSegmentsLoading ? (
                                <tr>
                                    <td colSpan="4" style={{textAlign: 'center', padding: '20px'}}>
                                        <div className="spinner  mx-auto"></div>
                                        <p>{t('mushaf_management.loadingSegments')}</p>
                                    </td>
                                </tr>
                            ) : segments.length === 0 ? (
                                <tr>
                                    <td colSpan="4" style={{textAlign: 'center', padding: '20px', color: '#666'}}>
                                        {t('mushaf_management.noSegments')}
                                    </td>
                                </tr>
                            ) : (
                                segments.map((segment, index) => (
                                    <tr key={segment.id || index}>
                                        <td style={{textAlign: "center"}}>{index + 1}</td>
                                        <td style={{textAlign: "center"}}>
                                            {segment.first_verse_key ? (
                                                getVerseNumber(segment.first_verse_key)
                                            ) : (
                                                <button 
                                                    className="btn-select"
                                                    onClick={() => startEditing(index, 'start')}
                                                >
                                                    {t('mushaf_management.selectStart')}
                                                </button>
                                            )}
                                        </td>
                                        <td style={{textAlign: "center"}}>
                                            {segment.last_verse_key ? (
                                                getVerseNumber(segment.last_verse_key)
                                            ) : (
                                                <button 
                                                    className="btn-select"
                                                    onClick={() => startEditing(index, 'end')}
                                                >
                                                    {t('mushaf_management.selectEnd')}
                                                </button>
                                            )}
                                        </td>
                                        <td style={{textAlign: "center"}}>
                                            <div className="actions">
                                                {segment.first_verse_key && segment.last_verse_key && (
                                                    <button 
                                                        className="btn-view"
                                                        onClick={() => viewSegment(segment)}
                                                        title={t('mushaf_management.view')}
                                                    >
                                                        <FaEye color='#fffe'/>
                                                    </button>
                                                )}
                                                {!segment.id && (
                                                    <span className="unsaved-badge">
                                                        {t('mushaf_management.unsaved')}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>

                    {editingSegment && (
                        <div className="editing-notice">
                            ⚠️ {t('mushaf_management.editingNotice')} {editingSegment.field === 'start' ? t('mushaf_management.start') : t('mushaf_management.end')} {t('mushaf_management.inQuran')}
                            <button onClick={() => {
                                setEditingSegment(null);
                                setSelectedAyahs(new Set());
                            }}>
                                {t('mushaf_management.cancel')}
                            </button>
                        </div>
                    )}
                </div>

                {/* Quran Page (Right) */}
                <div className="quran-panel">
                    {isFontLoading ? (
                        <div className="font-loading">
                            <div className="spinner"></div>
                            <p>{t('mushaf_management.loadingFont')}</p>
                        </div>
                    ) : (
                        <div 
                            className="page-content"
                            ref={el => {
                                if (el) {
                                    el.style.setProperty('font-family', `'QuranicFont-${currentPage}', Arial, sans-serif`, 'important');
                                }
                            }}
                        >
                            {pageLines.length > 0 ? (
                                pageLines.map(line => renderLine(line))
                            ) : (
                                <div className="no-content">
                                    {t('mushaf_management.noContent')}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
            
            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <DeleteModal
                    deleteFn={deleteAllPageSegments}
                    loading={isDeleting}
                    onClose={() => setShowDeleteModal(false)}
                />
            )}
        </div>
    );
};

export default QuranSegmentationView;