import React, { useEffect, useState } from 'react';
import './QuranViewer.css';
import { dbLoader } from '@/utils/helpers/databaseLoader';
import { fontLoader } from '@/utils/helpers/fontLoader';
import QuranSegmentsService from '@/api/services/quranSegments.service';
import toastService from '@/utils/helpers/Toastservice';
import { useTranslation } from 'react-i18next';

const QuranViewer = () => {
    const { t } = useTranslation();
    
    // Database state
    const [linesDb, setLinesDb] = useState(null);
    const [wordsDb, setWordsDb] = useState(null);
    const [surahData, setSurahData] = useState(null);
    
    // UI state
    const [currentPage, setCurrentPage] = useState(1);
    const [pageLines, setPageLines] = useState([]);
    const [selectedAyahs, setSelectedAyahs] = useState(new Set());
    const [segmentNumber, setSegmentNumber] = useState(1);
    const [isFontLoading, setIsFontLoading] = useState(false);
    
    // Loading & error states
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    // Initialize databases on mount
    useEffect(() => {
        initializeDatabases();
        
        // Cleanup on unmount
        return () => {
            dbLoader.cleanup();
        };
    }, []);

    // Load page and segment count when page changes
    useEffect(() => {
        if (linesDb && wordsDb && surahData) {
            loadPageWithFont(currentPage);
            fetchSegmentCount(currentPage);
        }
    }, [currentPage, linesDb, wordsDb, surahData]);

    /**
     * Load page and wait for font to be ready
     */
    const loadPageWithFont = async (pageNum) => {
        try {
            setIsFontLoading(true);
            
            // Load font first
            fontLoader.loadPageFont(pageNum);
            
            // Wait for font to be ready
            if (document.fonts) {
                await document.fonts.load(`1em QuranicFont-${pageNum}`);
                console.log(`✅ Font QuranicFont-${pageNum} ready for display`);
                await new Promise(resolve => setTimeout(resolve, 200));
            } else {
                // Fallback: wait 300ms if Font Loading API not supported
                await new Promise(resolve => setTimeout(resolve, 300));
            }
            
            // Now load the page content
            loadPage(pageNum);
            
            setIsFontLoading(false);
        } catch (error) {
            console.error('Error loading font:', error);
            // Continue anyway
            loadPage(pageNum);
            setIsFontLoading(false);
        }
    };

    /**
     * Initialize all databases
     */
    const initializeDatabases = async () => {
        try {
            setIsLoading(true);
            setError(null);
            
            const { linesDb, wordsDb, surahData } = await dbLoader.initialize();
            
            setLinesDb(linesDb);
            setWordsDb(wordsDb);
            setSurahData(surahData);
            
            setIsLoading(false);
        } catch (err) {
            console.error('Error initializing:', err);
            setError(`Failed to load Quran data: ${err.message}`);
            setIsLoading(false);
        }
    };

    /**
     * Load page data from database
     */
    const loadPage = (pageNum) => {
        if (!linesDb) return;

        try {
            // Font is already loaded in useEffect above
            // No need to load again here
            
            // Query database for page lines
            const query = `SELECT * FROM pages WHERE page_number = ${pageNum} ORDER BY line_number`;
            const result = linesDb.exec(query);

            if (result.length === 0 || result[0].values.length === 0) {
                console.warn(`No data found for page ${pageNum}`);
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

            console.log(`📄 Page ${pageNum} loaded: ${lines.length} lines`);
            setPageLines(lines);
        } catch (err) {
            console.error('Error loading page:', err);
            setError(`Failed to load page ${pageNum}: ${err.message}`);
        }
    };

    /**
     * Fetch segment count for current page from API
     */
    const fetchSegmentCount = async (pageNum) => {
        try {
            console.log(`🔄 Fetching segments for page ${pageNum}...`);
            
            const response = await QuranSegmentsService.getSegmentsByPage(pageNum);
            
            // Backend returns array directly, not wrapped in { data: [] }
            const segments = Array.isArray(response) ? response : (response.data || []);
            
            console.log(`📊 Found ${segments.length} existing segments:`, segments);
            
            // Count actual segments (number of records, not max segment_number)
            // Since backend has bug where all have segment_number: 1
            const actualSegmentCount = segments.length;
            
            // Next segment number is count + 1
            const nextSegmentNumber = actualSegmentCount + 1;
            setSegmentNumber(nextSegmentNumber);
            
            
            return segments; // Return for validation checks
        } catch (error) {
            console.error('❌ Error fetching segment count:', error);
            // Default to 1 if fetch fails
            setSegmentNumber(1);
            return [];
        }
    };

    /**
     * Get words for a specific line from database
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
     * Get surah name from surah data
     */
    const getSurahName = (surahNumber) => {
        if (!surahData || !surahData[surahNumber]) return '';
        const surah = surahData[surahNumber];
        
        // Use glyph if available, otherwise use decorated Arabic name
        if (surah.glyph) {
            return surah.glyph;
        } else if (surah.name_arabic) {
            return `سُورَةُ ${surah.name_arabic}`;
        }
        
        return surah.name || '';
    };

    /**
     * Handle word click to toggle ayah selection
     * Auto-selects all ayahs between first and last selected
     */
    const handleWordClick = (wordId, location) => {
        if (!location) return;

        // Extract surah:ayah from location (format: "1:1:1")
        const [surah, ayah] = location.split(':');
        const surahAyah = `${surah}:${ayah}`;

        setSelectedAyahs(prev => {
            const newSet = new Set(prev);
            
            // If clicking already selected ayah, deselect it
            if (newSet.has(surahAyah)) {
                newSet.delete(surahAyah);
                
                // If this was the only one, clear all
                if (newSet.size === 0) {
                    return newSet;
                }
                
                // Re-calculate range after deletion
                return autoSelectRange(newSet);
            } else {
                // Add the clicked ayah
                newSet.add(surahAyah);
                
                // Auto-select all ayahs in between
                return autoSelectRange(newSet);
            }
        });
    };

    /**
     * Auto-select all ayahs between first and last selected
     * @param {Set} selectedSet - Current set of selected ayahs
     * @returns {Set} - New set with range filled
     */
    const autoSelectRange = (selectedSet) => {
        if (selectedSet.size === 0) return selectedSet;
        if (selectedSet.size === 1) return selectedSet; // Single ayah, no range
        
        // Convert to array and sort
        const ayahsArray = Array.from(selectedSet)
            .map(sa => {
                const [surah, ayah] = sa.split(':').map(Number);
                return { surah, ayah, key: sa };
            })
            .sort((a, b) => {
                if (a.surah !== b.surah) return a.surah - b.surah;
                return a.ayah - b.ayah;
            });
        
        const first = ayahsArray[0];
        const last = ayahsArray[ayahsArray.length - 1];
        
        console.log(`🎯 Auto-selecting range: ${first.key} to ${last.key}`);
        
        // Get all words on current page to find available ayahs
        const allAyahs = new Set();
        pageLines.forEach(line => {
            if (line.line_type === 'ayah') {
                const words = getWordsForLine(line.first_word_id, line.last_word_id);
                words.forEach(word => {
                    if (word.location) {
                        const [surah, ayah] = word.location.split(':');
                        allAyahs.add(`${surah}:${ayah}`);
                    }
                });
            }
        });
        
        // Fill in the range
        const rangeSet = new Set();
        
        // Add all ayahs in the range that exist on this page
        Array.from(allAyahs).forEach(ayahKey => {
            const [surah, ayah] = ayahKey.split(':').map(Number);
            const ayahNum = surah * 1000 + ayah;
            const firstNum = first.surah * 1000 + first.ayah;
            const lastNum = last.surah * 1000 + last.ayah;
            
            if (ayahNum >= firstNum && ayahNum <= lastNum) {
                rangeSet.add(ayahKey);
            }
        });
        
        console.log(`✅ Selected ${rangeSet.size} ayahs in range`);
        
        return rangeSet;
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
     * Check if selected verses overlap with existing segments
     * @param {Object} selection - Current selection {first_verse_key, last_verse_key}
     * @param {Array} existingSegments - Existing segments from backend
     * @returns {Object} - {hasOverlap: boolean, overlappingSegments: []}
     */
    const checkVerseOverlap = (selection, existingSegments) => {
        const [newStartSurah, newStartAyah] = selection.first_verse_key.split(':').map(Number);
        const [newEndSurah, newEndAyah] = selection.last_verse_key.split(':').map(Number);
        
        const overlappingSegments = existingSegments.filter(segment => {
            const [existStartSurah, existStartAyah] = segment.first_verse_key.split(':').map(Number);
            const [existEndSurah, existEndAyah] = segment.last_verse_key.split(':').map(Number);
            
            // Check if ranges overlap
            // Assuming all on same page, so surah might be same
            const newStart = newStartSurah * 1000 + newStartAyah;
            const newEnd = newEndSurah * 1000 + newEndAyah;
            const existStart = existStartSurah * 1000 + existStartAyah;
            const existEnd = existEndSurah * 1000 + existEndAyah;
            
            // Check overlap: new segment overlaps with existing if:
            // newStart <= existEnd && newEnd >= existStart
            return newStart <= existEnd && newEnd >= existStart;
        });
        
        return {
            hasOverlap: overlappingSegments.length > 0,
            overlappingSegments
        };
    };

    /**
     * Clear all selections
     */
    const clearSelection = () => {
        setSelectedAyahs(new Set());
    };

    /**
     * Get selection ranges for submission
     */
    const getSelectionRanges = () => {
        const ayahsArray = Array.from(selectedAyahs)
            .map(sa => {
                const [surah, ayah] = sa.split(':').map(Number);
                return { surah, ayah };
            })
            .sort((a, b) => {
                if (a.surah !== b.surah) return a.surah - b.surah;
                return a.ayah - b.ayah;
            });

        if (ayahsArray.length === 0) return null;

        const first = ayahsArray[0];
        const last = ayahsArray[ayahsArray.length - 1];

        return {
            first_verse_key: `${first.surah}:${first.ayah}`,
            last_verse_key: `${last.surah}:${last.ayah}`,
            count: ayahsArray.length
        };
    };

    /**
     * Submit segment to API
     */
    const handleSubmit = async () => {
        const selection = getSelectionRanges();
        if (!selection) {
            toastService.error('الرجاء تحديد آية واحدة على الأقل');
            return;
        }

        try {
            setIsSubmitting(true);
            
            // Fetch existing segments for validation
            const existingSegments = await QuranSegmentsService.getSegmentsByPage(currentPage);
            const segments = Array.isArray(existingSegments) ? existingSegments : (existingSegments.data || []);
            
            // Check for overlaps
            const overlapCheck = checkVerseOverlap(selection, segments);
            
            if (overlapCheck.hasOverlap) {
                // Show confirmation dialog
                const overlappingDetails = overlapCheck.overlappingSegments
                    .map(s => `(${s.first_verse_key} - ${s.last_verse_key})`)
                    .join('، ');
                
                const confirmMessage = `⚠️ تحذير!\n\nالآيات المحددة تتداخل مع مقاطع موجودة:\n${overlappingDetails}\n\nسيؤدي المتابعة إلى مسح جميع التقسيمات القديمة وإعادة تقسيم المصحف من جديد.\n\nهل تريد المتابعة؟`;
                
                const userConfirmed = window.confirm(confirmMessage);
                
                if (!userConfirmed) {
                    toastService.info('تم إلغاء العملية');
                    setIsSubmitting(false);
                    return;
                }
                
                // User confirmed - delete existing segments first
                console.log('⚠️ User confirmed overlap. Deleting existing segments...');
                toastService.warning('جاري مسح التقسيمات القديمة...');
                
                // Delete overlapping segments
                for (const segment of overlapCheck.overlappingSegments) {
                    try {
                        await QuranSegmentsService.deleteSegment(segment.id);
                        console.log(`🗑️ Deleted segment ${segment.id}`);
                    } catch (deleteError) {
                        console.error('Error deleting segment:', deleteError);
                    }
                }
            }
            
            const segmentData = {
                first_verse_key: selection.first_verse_key,
                last_verse_key: selection.last_verse_key,
                page_number: currentPage,
                segment_number: segmentNumber
            };

            console.log('📤 Submitting segment:', segmentData);

            const result = await QuranSegmentsService.createSegment(segmentData);
            
            console.log('✅ Segment created:', result);

            // Show success toast
            toastService.success(`تم حفظ القطعة بنجاح! (${selection.first_verse_key} - ${selection.last_verse_key})`);

            // Refresh segment count
            await fetchSegmentCount(currentPage);

            // Clear selection
            clearSelection();

        } catch (error) {
            console.error('❌ Submission failed:', error);
            
            // Show error toast with details
            const errorMessage = error.response?.data?.message || error.message || 'حدث خطأ غير متوقع';
            toastService.error(`فشل حفظ القطعة: ${errorMessage}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    /**
     * Render a single line
     */
    const renderLine = (line) => {
        switch (line.line_type) {
            case 'surah_name':
                { const surahName = getSurahName(line.surah_number);
                return (
                    <div 
                        key={`${line.page_number}-${line.line_number}`} 
                        className={`line surah-name ${line.is_centered ? 'centered' : ''}`}
                    >
                        {surahName}
                    </div>
                ); }

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
                        className={`line ayah ${line.is_centered ? 'centered' : ''}`}
                        ref={el => {
                            if (el) {
                                el.style.setProperty('font-family', `'QuranicFont-${currentPage}', Arial, sans-serif`, 'important');
                            }
                        }}
                    >
                        {words.map(word => (
                            <span
                                key={word.id}
                                data-word-id={word.id}
                                data-location={word.location}
                                className={`word ${isWordSelected(word.location) ? 'selected' : ''}`}
                                onClick={() => handleWordClick(word.id, word.location)}
                                ref={el => {
                                    if (el) {
                                        el.style.setProperty('font-family', 'inherit', 'important');
                                    }
                                }}
                            >
                                {word.text}
                            </span>
                        ))}
                    </div>
                ); }

            default:
                return null;
        }
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="quran-viewer loading">
                <div className="spinner"></div>
                <p>جاري تحميل بيانات القرآن...</p>
                <p style={{fontSize: '0.9em', color: '#666'}}>قد يستغرق هذا لحظة في التحميل الأول</p>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="quran-viewer error">
                <h2>خطأ في تحميل البيانات</h2>
                <p>{error}</p>
                <button onClick={() => window.location.reload()}>إعادة المحاولة</button>
            </div>
        );
    }

    const selection = getSelectionRanges();

    return (
        <div className="quran-viewer">
            {/* Header */}
            <div className="header">
                <h1>📖 مشاهد المصحف الشريف</h1>
                <p>Mushaf Viewer</p>
            </div>

            {/* Controls */}
            <div className="controls">
                <button 
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                >
                    ← السابق
                </button>
                
                <div className="page-input-group">
                    <label>الصفحة:</label>
                    <input
                        type="number"
                        min="1"
                        max="604"
                        value={currentPage}
                        onChange={(e) => {
                            const page = parseInt(e.target.value);
                            if (page >= 1 && page <= 604) {
                                setCurrentPage(page);
                                clearSelection(); // Clear selection on page change
                            }
                        }}
                    />
                    <span>من 604</span>
                </div>

                <button 
                    onClick={() => setCurrentPage(p => Math.min(604, p + 1))}
                    disabled={currentPage === 604}
                >
                    التالي →
                </button>
            </div>

            {/* Selection Info */}
            {selectedAyahs.size > 0 && selection && (
                <div className="selection-info">
                    <div className="selection-header">
                        <span>
                            الصفحة {currentPage}، القطعة #{segmentNumber} | 
                            المحدد: {selection.count} آيات ({selection.first_verse_key} - {selection.last_verse_key})
                        </span>
                        <div>
                            <button onClick={clearSelection} className="btn-clear">مسح</button>
                            <button 
                                onClick={handleSubmit} 
                                className="btn-submit"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'جاري الحفظ...' : 'حفظ القطعة'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Page Viewer */}
            <div className="page-viewer">
                {isFontLoading ? (
                    <div className="font-loading">
                        <div className="spinner"></div>
                        <p>جاري تحميل الخط...</p>
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
                            <div style={{textAlign: 'center', padding: '40px', color: '#666'}}>
                                {t('quran_viewer.no_content_page')}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default QuranViewer;